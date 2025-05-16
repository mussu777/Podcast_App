import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  LayoutChangeEvent,
} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import CustomText from './CustomText';

interface SlidingTextProps {
  text: string | undefined;
  fontSize: any;
  fontFamily: any;
}

const SlidingText: FC<SlidingTextProps> = ({text, fontFamily, fontSize}) => {
  const [textWidth, setTextWidth] = useState<number>(0);
  const containerWidth = Dimensions.get('window').width - 130;

  const translateX = useSharedValue(0);

  useEffect(() => {
    if (textWidth > containerWidth) {
      translateX.value = withRepeat(
        withTiming(-textWidth + 200, {
          duration: 8000,
          easing: Easing.linear,
        }),
        -1,
        true,
      );
    } else {
      translateX.value = 0;
    }
  }, [textWidth, containerWidth, text]);

  const handleTextLayout = (e: LayoutChangeEvent) => {
    const {width} = e.nativeEvent.layout;
    setTextWidth(width);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.textContainer, animatedStyle]}>
        <CustomText
          fontSize={fontSize}
          fontFamily={fontFamily}
          onLayout={handleTextLayout}
          numberOfLines={1}>
          {text}
        </CustomText>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    width: '100%',
  },
  textContainer: {
    flexDirection: 'row',
    width: 600,
  },
});

export default SlidingText;
