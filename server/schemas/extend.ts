import { mergeSchemas } from "@graphql-tools/schema";
import axios from "axios";
import { gql } from "graphql-tag";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const API_KEY = process.env.GEMINI_API_KEY;

export const extendGraphqlSchema = (schema: any) =>
  mergeSchemas({
    schemas: [schema],
    typeDefs: gql`
      type RegisterResponse {
        user: User
      }

      type PodcastRecommendation {
        id: ID!
        title: String!
        category: String!
        video_uri: String
        artwork: String
        lyricist: String
        type: String!
        audio_uri: String
        artist: ArtistInfo
        isFavourite: Boolean!
      }

      type ArtistInfo {
        id: ID!
        name: String!
        bio: String
        photo: String
      }

      extend type Mutation {
        registerUser(
          name: String!
          email: String!
          password: String!
        ): RegisterResponse
      }

      extend type Query {
        getRecommendedPodcasts(userId: ID!): [PodcastRecommendation]
      }
    `,
    resolvers: {
      Mutation: {
        registerUser: async (root, { name, email, password }, context) => {
          const existingUser = await context.db.User.findOne({
            where: { email },
          });

          if (existingUser) {
            throw new Error("User already exists with this email.");
          }

          const newUser = await context.db.User.createOne({
            data: { name, email, password },
          });

          return { user: newUser };
        },
      },
      Query: {
        getRecommendedPodcasts: async (_, { userId }, context) => {
          try {
            const user = await context.query.User.findOne({
              where: { id: userId },
              query: "id favoritePodcasts { id title category }",
            });

            if (!user) throw new Error("User not found");

            const favoritePodcasts = user.favoritePodcasts || [];

            const favoriteCategories = [
              ...new Set(favoritePodcasts.map((p: any) => p.category)),
            ];

            const allPodcasts = await context.query.Podcast.findMany({
              query: `
                id
                title
                category
                video_uri
                artwork
                lyricist
                type
                audio_uri
                artist {
                  id
                  name
                  bio
                  photo
                }
              `,
            });


            const favoritePodcastIds = favoritePodcasts.map((p: any) => p.id);
            const availablePodcasts = allPodcasts.filter(
              (p: any) => !favoritePodcastIds.includes(p.id)
            );

            if (availablePodcasts.length === 0) {
              return [];
            }

            const prompt = `
            You are an AI podcast recommendation system.
            The user has listened to these categories: ${
              favoriteCategories?.length
                ? favoriteCategories?.join(", ")
                : "None"
            }.
            
            From the following available podcasts, suggest 1 that match their interests or if not then still any random one:
            ${
              availablePodcasts?.length
                ? availablePodcasts
                    .map(
                      (p: any) =>
                        `${p.title} (Category: ${p?.category}, Artist: ${p?.artist?.name})`
                    )
                    .join("\n")
                : "No podcasts available"
            }


               Return only the titles in this JSON format:
              {
                "recommendations": ["Title 1","Title 2","Title 3"]
              }
            `;

            const response = await axios.post(
              `${GEMINI_API_URL}?key=${API_KEY}`,
              {
                contents: [
                  {
                    parts: [{ text: prompt }],
                  },
                ],
              },
              {
                headers: { "Content-Type": "application/json" },
              }
            );

            const aiResponse =
              response.data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

            const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/);

            if (!jsonMatch) {
              throw new Error("AI response does not contain JSON.");
            }

            const jsonString = jsonMatch[1];
            const { recommendations } = JSON.parse(jsonString);

            if (!Array.isArray(recommendations)) {
              throw new Error("Invalid AI response format.");
            }

            const matchedPodcasts = allPodcasts.filter((p: any) =>
              recommendations.includes(p.title)
            );

            return matchedPodcasts;
          } catch (error) {
            console.error("Error in AI Podcast Recommendation:", error);
            throw new Error("Failed to get recommendations.");
          }
        },
      },
    },
  });
