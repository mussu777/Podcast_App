import {View, Text, StyleSheet} from 'react-native';
import React, {FC} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';
import {screenHeight, screenWidth} from '../../utils/Scaling';

const VideoPlayer: FC<{
  uri: any;
  type: string;
  isPlaying: boolean;
  progress: Number;
  duration: Number;
  videoRef: any;
  handleProgress: any;
  onSetDuration: any;
}> = ({uri, type, isPlaying, handleProgress, videoRef, onSetDuration}) => {
  return (
    <View>
      <Video
        ref={videoRef}
        source={{uri: uri}}
        paused={!isPlaying}
        onLoad={meta => onSetDuration(meta.duration)}
        onProgress={e => handleProgress(e.currentTime)}
        ignoreSilentSwitch={'ignore'}
        playWhenInactive={false}
        playInBackground={true}
        controls={false}
        disableFocus={true}
        style={[styles.videoContainer, {opacity: type === 'audio' ? 0 : 1}]}
        repeat={true}
        hideShutterView
        resizeMode="cover"
        shutterColor="transparent"
      />

      <LinearGradient
        colors={[
          'rgba(0,0,0,0)',
          'rgba(0,0,0,0.1)',
          'rgba(0,0,0,0.2)',
          'rgba(0,0,0,0.3)',
          'rgba(0,0,0,0.4)',
          'rgba(0,0,0,0.7)',
          'rgba(0,0,0,0.8)',
          'rgba(0,0,0,0.9)',
          'rgba(0,0,0,1)',
        ]}
        style={styles.gradient}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    height: screenHeight,
    aspectRatio: 9 / 16,
    width: screenWidth,
    position: 'absolute',
    zIndex: 2,
  },
  gradient: {
    height: screenHeight,
    width: screenWidth,
    zIndex: 2,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
  },
});

export default VideoPlayer;
