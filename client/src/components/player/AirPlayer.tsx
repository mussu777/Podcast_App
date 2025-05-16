import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {FC, useState} from 'react';
import {usePlayerStore} from '../../state/usePlayerStore';
import {useSharedState} from '../../features/tabs/SharedContext';
import {StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../ui/CustomText';
import {fontR} from '../../utils/Scaling';
import {Fonts} from '../../utils/Constants';
import Icon from '../ui/Icon';
import SlidingText from '../ui/SlidingText';

const AirPlayer: FC<{
  progress: number;
  isPlaying: boolean;
  duration: number;
  togglePlayback: any;
}> = ({progress, duration, isPlaying, togglePlayback}) => {
  const [colors] = useState(['#333', '#333']);
  const {currentPlayingPodcast} = usePlayerStore();
  const {expandPlayer} = useSharedState();
  const calculateProgressWidth: any = () => {
    if (duration > 0) {
      const percentage = (progress / duration) * 100;
      return `${percentage}%`;
    }
    return '0%';
  };

  return (
    <LinearGradient style={styles.container} colors={colors}>
      <View style={styles.flexRowBetween}>
        <TouchableOpacity activeOpacity={1} onPress={expandPlayer}>
          <View style={styles.flexRow}>
            <Image
              source={{uri: currentPlayingPodcast?.artwork}}
              style={styles.img}
            />
            <View style={{width: '68%'}}>
              <SlidingText
                fontSize={fontR(8)}
                fontFamily={Fonts.Bold}
                text={currentPlayingPodcast?.title}
              />
              <CustomText
                fontFamily={Fonts.Medium}
                numberOfLines={1}
                fontSize={fontR(9)}
                style={{opacity: 0.8}}>
                {currentPlayingPodcast?.artist?.name}
              </CustomText>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.flexRow}>
          <Icon
            name="broadcast-on-home"
            iconFamily="MaterialIcons"
            color="#ccc"
            size={fontR(20)}
          />
          <TouchableOpacity onPress={togglePlayback}>
            <Icon
              name={isPlaying ? 'pause' : 'play-arrow'}
              iconFamily="MaterialIcons"
              size={fontR(22)}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View
            style={[styles.progressBar, {width: calculateProgressWidth()}]}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  img: {
    borderRadius: 5,
    width: 45,
    height: 45,
    resizeMode: 'cover',
  },
  container: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    width: '100%',
  },
  flexRowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: 5,
    paddingHorizontal: 5,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressContainer: {
    height: 5,
    width: '100%',
    marginTop: 5,
  },
  progressBackground: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  progressBar: {
    height: 3,
    backgroundColor: 'white',
  },
});

export default AirPlayer;
