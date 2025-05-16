import {create} from 'zustand';
import {persist} from 'zustand/middleware';

interface Podcast {
  id: any;
  audio_uri: string;
  video_uri?: string;
  title: string;
  lyricist: string;
  type: string;
  isFavourite?: boolean;
  artist: any;
  artwork: any;
  category: string;
}

interface FavoritesStore {
  favoritePodcasts: Podcast[];
  toggleFavorite: (podcast: Podcast) => void;
  updateFavoriteStatus: (podcast: Podcast, isFavorite: boolean) => void;
}

export const useFavouritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favoritePodcasts: [],
      toggleFavorite: async podcast => {
        const currentFavorites = get().favoritePodcasts;
        const isCurrentlyFavorite = currentFavorites.some(
          fav => fav.id === podcast.id,
        );

        set({
          favoritePodcasts: isCurrentlyFavorite
            ? currentFavorites.filter(fav => fav.id !== podcast.id)
            : [...currentFavorites, podcast],
        });
      },
      updateFavoriteStatus: (podcast, isFavorite) => {
        set(state => ({
          favoritePodcasts: isFavorite
            ? [...state.favoritePodcasts, podcast]
            : state.favoritePodcasts.filter(fav => fav.id !== podcast.id),
        }));
      },
    }),
    {
      name: 'favorite-podcasts',
    },
  ),
);
