import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useMemo} from 'react';
import {Colors, Fonts} from '../../utils/Constants';
import {useFavouritesStore} from '../../state/useFavouriteStore';
import {usePlayerStore} from '../../state/usePlayerStore';
import {useMutation} from '@apollo/client';
import {MARK_FAVOURITE, UNMARK_FAVOURITE} from '../../graphQL/queries';
import {TouchableOpacity} from 'react-native';
import {resetAndNavigate} from '../../utils/NavigationUtils';
import CustomText from '../ui/CustomText';
import {fontR} from '../../utils/Scaling';
import Icon from '../ui/Icon';

interface PodcastItemProps {
  item: any;
  onNavigate?: boolean;
}

const PodcastItem: React.FC<PodcastItemProps> = ({item, onNavigate}) => {
  const {currentPlayingPodcast, user, setCurrentPlayingPodcast, resetPlayer} =
    usePlayerStore();
  const {favoritePodcasts, toggleFavorite} = useFavouritesStore();

  const isFavorite = useMemo(() => {
    return favoritePodcasts.some(fav => fav.id === item?.id);
  }, [favoritePodcasts, item]);

  const isActive = currentPlayingPodcast?.id === item?.id;

  const [markFavorite] = useMutation(MARK_FAVOURITE);
  const [unmarkFavorite] = useMutation(UNMARK_FAVOURITE);

  const togglePlayPodcast = async () => {
    if (currentPlayingPodcast?.id === item.id) {
      resetPlayer();
    } else {
      resetPlayer();
      setCurrentPlayingPodcast(item);
    }
  };

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
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.container}
      onPress={() => {
        togglePlayPodcast();
        if (onNavigate) {
          resetAndNavigate('UserBottomTab');
        }
      }}>
      <View style={styles.flexRowBetween}>
        <View style={styles.flexRow}>
          <Image source={{uri: item.artwork}} style={styles.img} />
          <View style={styles.PodcastInfo}>
            <CustomText
              numberOfLines={1}
              fontSize={fontR(9)}
              fontFamily={Fonts.Medium}
              style={{color: isActive ? Colors.primary : Colors.text}}>
              {item.title}
            </CustomText>
            <CustomText
              numberOfLines={1}
              fontSize={fontR(8)}
              style={{opacity: 0.8, marginTop: 2}}>
              {item?.artist?.name}
            </CustomText>
          </View>
        </View>

        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => handleToggleFavorite(item)}>
            <Icon
              name={isFavorite ? 'heart' : 'heart-outline'}
              iconFamily="Ionicons"
              size={24}
              color={isFavorite ? Colors.primary : Colors.inactive}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.backgroundDark,
    marginVertical: 5,
  },
  flexRowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  img: {
    borderRadius: 5,
    width: 45,
    height: 45,
    resizeMode: 'cover',
  },
  PodcastInfo: {
    width: '65%',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
});

export default PodcastItem;
