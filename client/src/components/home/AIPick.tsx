import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {useLazyQuery} from '@apollo/client';
import {AI_PICK} from '../../graphQL/queries';
import {usePlayerStore} from '../../state/usePlayerStore';
import CustomText from '../ui/CustomText';
import {Image} from 'react-native';

const AIPick = () => {
  const {currentPlayingPodcast, user, setCurrentPlayingPodcast, resetPlayer} =
    usePlayerStore();
  const [fetching, setFetching] = useState(false);

  const [fetchAI, {data, loading, error}] = useLazyQuery(AI_PICK, {
    variables: {userId: user?.id},
    fetchPolicy: 'network-only',
  });

  const handleFetchAI = async () => {
    setFetching(true);
    try {
      await fetchAI();
    } catch (err) {
      console.error('AI Fetch Error:', err);
    }
    setFetching(false);
  };

  const aiPodcast = data?.getRecommendedPodcasts?.[0];
  console.log(data?.getRecommendedPodcasts)
  const togglePlayPodcast = async (item: any) => {
    if (currentPlayingPodcast?.id === item.id) {
      resetPlayer();
    } else {
      resetPlayer();
      setCurrentPlayingPodcast(item);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <CustomText variant="h2" fontFamily="Satoshi-Medium">
          Let Podcast AI Pick Best for You!
        </CustomText>
        <TouchableOpacity style={styles.button} onPress={handleFetchAI}>
          <CustomText>Let's Go</CustomText>
        </TouchableOpacity>
      </View>

      <View style={styles.section2}>
        {fetching || loading ? (
          <ActivityIndicator size="large" color="#ccc" />
        ) : error ? (
          <CustomText>Error Fetching AI Pick</CustomText>
        ) : (
          <TouchableOpacity
            style={styles.img}
            onPress={() => {
              if (aiPodcast?.artwork) {
                togglePlayPodcast(aiPodcast);
              } else {
                handleFetchAI();
              }
            }}>
            <Image
              style={styles.img}
              source={
                aiPodcast?.artwork
                  ? {uri: aiPodcast?.artwork}
                  : require('../../assets/icons/profile.jpeg')
              }
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default AIPick;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 160,
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  section: {
    width: '45%',
  },
  button: {
    marginTop: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#222',
    width: '100%',
  },
  section2: {
    width: '45%',
    borderWidth: 1,
    height: 150,
    borderColor: '#ccc',
    overflow: 'hidden',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
