import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {FC, useEffect, useMemo, useState} from 'react';
import {usePlayerStore} from '../../state/usePlayerStore';
import {useFavouritesStore} from '../../state/useFavouriteStore';
import PackageIcon from 'react-native-vector-icons/MaterialIcons';
import {MARK_FAVOURITE, UNMARK_FAVOURITE} from '../../graphQL/queries';
import {useMutation} from '@apollo/client';
import {Colors, Fonts} from '../../utils/Constants';
import {Platform} from 'react-native';
import {fontR, screenWidth} from '../../utils/Scaling';
import SlidingText from '../ui/SlidingText';
import CustomText from '../ui/CustomText';
import Icon from '../ui/Icon';
import Slider from '@react-native-community/slider';
import {Image} from 'react-native';

const ControlsAndDetails: FC<{
  progress: number;
  duration: number;
  isPlaying: boolean;
  togglePlayback: any;
  onSeek: any;
}> = ({progress, isPlaying, togglePlayback, duration, onSeek}) => {
  const [icon, setIcon] = useState();

  const {currentPlayingPodcast, user} = usePlayerStore();

  const {favoritePodcasts, toggleFavorite} = useFavouritesStore();

  const isFavorite = useMemo(() => {
    return favoritePodcasts.some(fav => fav.id === currentPlayingPodcast?.id);
  }, [favoritePodcasts, currentPlayingPodcast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    PackageIcon.getImageSource('circle', 15, 'white').then(setIcon);
  }, []);

  const handleSeek = async (value: number) => {
    onSeek(value * duration);
  };

  const [markFavorite] = useMutation(MARK_FAVOURITE);
  const [unmarkFavorite] = useMutation(UNMARK_FAVOURITE);

  const handleToggleFavorite = async (podcast: any) => {
    const isFavorite = favoritePodcasts?.some(fav => fav.id === podcast?.id);

    toggleFavorite(podcast);

    try {
      if (isFavorite) {
        await unmarkFavorite({
          variables: {userId: user?.id, podcastId: podcast.id},
        });
      } else {
        await markFavorite({
          variables: {userId: user?.id, podcastId: podcast.id},
        });
      }
    } catch (error) {
      console.error('Failed to update favorite:', error);
      toggleFavorite(podcast);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.flexRowBetween}>
        <View style={{width: '85%'}}>
          <SlidingText
            fontSize={fontR(14)}
            fontFamily={Fonts.Bold}
            text={currentPlayingPodcast?.title}
          />
          <CustomText
            fontSize={fontR(9)}
            fontFamily={Fonts.Medium}
            style={styles.artist}>
            {currentPlayingPodcast?.artist?.name}
          </CustomText>
        </View>

        <TouchableOpacity
          onPress={() => handleToggleFavorite(currentPlayingPodcast as any)}>
          <Icon
            name={isFavorite ? 'heart' : 'heart-outline'}
            iconFamily="Ionicons"
            size={fontR(22)}
            color={isFavorite ? Colors.primary : Colors.inactive}
          />
        </TouchableOpacity>
      </View>

      <Slider
        style={styles.slider}
        tapToSeek
        minimumValue={0}
        maximumValue={1}
        value={progress / duration || 0}
        onSlidingComplete={handleSeek}
        thumbImage={icon}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="rgba(255,255,255,0.2)"
      />

      <View style={styles.timeZone}>
        <CustomText fontSize={fontR(7)}>{formatTime(duration)}</CustomText>
        <CustomText fontSize={fontR(7)}>
          -{formatTime(duration - progress)}
        </CustomText>
      </View>

      <View style={styles.flexRowBetweenCenter}>
        <TouchableOpacity>
          <Icon
            name="play-skip-back-sharp"
            iconFamily="Ionicons"
            size={fontR(26)}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={togglePlayback}>
          <Icon
            name={isPlaying ? 'pause-circle-sharp' : 'play-circle-sharp'}
            iconFamily="Ionicons"
            size={fontR(50)}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon
            name="play-skip-forward-sharp"
            iconFamily="Ionicons"
            size={fontR(26)}
          />
        </TouchableOpacity>
      </View>

      <View style={[styles.flexRowBetween, {marginTop: 20}]}>
        <TouchableOpacity>
          <Icon
            name="broadcast-on-home"
            iconFamily="MaterialIcons"
            color="#ccc"
            size={fontR(16)}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon
            name="share-outline"
            iconFamily="Ionicons"
            color="#ccc"
            size={fontR(16)}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.artistContainer}>
        <Image
          source={{uri: currentPlayingPodcast?.artist?.photo}}
          style={styles.artistCover}
        />

        <View style={{paddingVertical: 20, paddingHorizontal: 15}}>
          <CustomText fontFamily={Fonts.Bold} fontSize={fontR(11)}>
            {currentPlayingPodcast?.artist?.name}
          </CustomText>
          <CustomText
            fontFamily={Fonts.Medium}
            fontSize={fontR(8)}
            style={{opacity: 0.7}}>
            1.7Cr Monthly Listeners
          </CustomText>
          <CustomText
            fontSize={fontR(8)}
            fontFamily={Fonts.Medium}
            style={{marginTop: 10, opacity: 0.8}}
            numberOfLines={3}>
            {currentPlayingPodcast?.artist?.bio}
          </CustomText>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <CustomText fontFamily={Fonts.Bold} fontSize={fontR(11)}>
          Credits
        </CustomText>
        <CustomText
          fontFamily={Fonts.Medium}
          style={styles.titleText}
          fontSize={fontR(9)}>
          {currentPlayingPodcast?.artist?.name}
        </CustomText>
        <CustomText fontSize={fontR(8)} style={styles.subText}>
          Main Artist, Composer, Producer
        </CustomText>
        <CustomText
          fontFamily={Fonts.Medium}
          style={styles.titleText}
          fontSize={fontR(9)}>
          {currentPlayingPodcast?.lyricist}
        </CustomText>
        <CustomText fontSize={fontR(8)} style={styles.subText}>
          Lyricist
        </CustomText>
      </View>
    </View>
  );
};

export default ControlsAndDetails;

const styles = StyleSheet.create({
  subText: {
    marginTop: 2,
    opacity: 0.8,
  },
  titleText: {
    marginTop: 10,
  },
  artistContainer: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 40,
  },
  infoContainer: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 20,
    marginBottom: 100,
    padding: 10,
  },
  artistCover: {
    height: 200,
    width: '100%',
    resizeMode: 'cover',
  },
  slider: {
    width: Platform.OS === 'android' ? screenWidth : screenWidth - 30,
    height: 40,
    alignSelf: 'center',
    marginTop: 10,
  },
  timeZone: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    bottom: 10,
  },
  flexRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexRowBetweenCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    gap: 50,
  },
  container: {
    padding: 20,
    zIndex: 88,
  },
  artist: {
    opacity: 0.8,
    marginTop: 5,
  },
});
