import {View, StyleSheet, ScrollView} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {VideoRef} from 'react-native-video';
import {useSharedState} from '../../features/tabs/SharedContext';
import {usePlayerStore} from '../../state/usePlayerStore';
import Animated, {
  interpolate,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {BOTTOM_TAB_HEIGHT} from '../../utils/Constants';
import {screenHeight} from '../../utils/Scaling';
import AirPlayer from './AirPlayer';
import FullScreenPlayer from './FullScreenPlayer';

const MIN_PLAYER_HEIGHT = BOTTOM_TAB_HEIGHT + 60;
const MAX_PLAYER_HEIGHT = screenHeight;

const withPlayer = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
): React.FC<P> => {
  const WithPlayer: React.FC<P> = props => {
    const videoRef = useRef<VideoRef>(null);
    const {translationY} = useSharedState();
    const {
      currentPlayingPodcast,
      isPlaying,
      progress,
      duration,
      setPlaying,
      setProgress,
      setDuration,
    } = usePlayerStore();
    const scrollRef = useRef<Animated.ScrollView>(null);

    useEffect(() => {
      translationY.value = withTiming(0, {duration: 0});
    }, [translationY]);

    const animatedContainerStyles = useAnimatedStyle(() => {
      const height = interpolate(
        translationY.value,
        [-MAX_PLAYER_HEIGHT + MIN_PLAYER_HEIGHT, 0],
        [MAX_PLAYER_HEIGHT, MIN_PLAYER_HEIGHT],
        'clamp',
      );

      return {
        height,
        borderTopLeftRadius: translationY.value < -2 ? 15 : 0,
        borderTopRightRadius: translationY.value < -2 ? 15 : 0,
      };
    });

    const collapsedOpacityStyle = useAnimatedStyle(() => {
      const opacity = interpolate(translationY.value, [-2, 0], [0, 1], 'clamp');
      return {
        opacity,
        display: translationY.value < -2 ? 'contents' : 'flex',
        zIndex: 2,
      };
    });

    const expandedOpacityStyle = useAnimatedStyle(() => {
      const opacity = interpolate(translationY.value, [-2, 0], [1, 0], 'clamp');
      return {
        opacity,
        display: translationY.value > -2 ? 'contents' : 'flex',
      };
    });

    const togglePlayback = () => {
      if (isPlaying) {
        videoRef.current?.pause();
      } else {
        videoRef.current?.resume();
      }
      setPlaying(!isPlaying);
    };

    return (
      <View style={styles.container}>
        <WrappedComponent {...props} />

        {currentPlayingPodcast && (
          <Animated.View
            style={[styles.playerContainer, animatedContainerStyles]}>
            <Animated.View style={expandedOpacityStyle}>
              <ScrollView
                persistentScrollbar
                ref={scrollRef}
                pinchGestureEnabled
                bounces={false}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={1}
                contentContainerStyle={styles.expandedPlayer}
                nestedScrollEnabled>
                <FullScreenPlayer
                  isPlaying={isPlaying}
                  progress={progress}
                  togglePlayback={togglePlayback}
                  handleProgress={setProgress}
                  duration={duration}
                  videoRef={videoRef}
                  onSeek={(t: any) => {
                    setProgress(t);
                    videoRef.current?.seek(t);
                  }}
                  onSetDuration={setDuration}
                />
              </ScrollView>
            </Animated.View>

            <Animated.View
              style={[styles.collapsedPlayer, collapsedOpacityStyle]}>
              <AirPlayer
                isPlaying={isPlaying}
                togglePlayback={togglePlayback}
                duration={duration}
                progress={progress}
              />
            </Animated.View>
          </Animated.View>
        )}
      </View>
    );
  };

  return React.memo(WithPlayer);
};

export default withPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  playerContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    zIndex: 3,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  expandedPlayer: {
    alignItems: 'center',
    backgroundColor: '#444',
  },
  collapsedPlayer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1,
  },
});
