import React, {createContext, useContext, ReactNode} from 'react';
import Animated, {useSharedValue, withTiming} from 'react-native-reanimated';
import {screenHeight} from '../../utils/Scaling';
import {BOTTOM_TAB_HEIGHT} from '../../utils/Constants';

interface SharedStateContextType {
  translationY: Animated.SharedValue<number>;
  expandPlayer: () => void;
  collapsePlayer: () => void;
}

const MIN_PLAYER_HEIGHT = BOTTOM_TAB_HEIGHT + 60;
const MAX_PLAYER_HEIGHT = screenHeight;

const SharedStateContext = createContext<SharedStateContextType | undefined>(
  undefined,
);

export const SharedStateProvider: React.FC<{children: ReactNode}> = ({
  children,
}) => {
  const translationY = useSharedValue(0);

  const expandPlayer = () => {
    translationY.value = withTiming(-MAX_PLAYER_HEIGHT + MIN_PLAYER_HEIGHT, {
      duration: 300,
    });
  };

  const collapsePlayer = () => {
    translationY.value = withTiming(0, {duration: 300});
  };

  return (
    <SharedStateContext.Provider
      value={{translationY, expandPlayer, collapsePlayer}}>
      {children}
    </SharedStateContext.Provider>
  );
};

export const useSharedState = () => {
  const context = useContext(SharedStateContext);
  if (context === undefined) {
    throw new Error('useSharedState must be used within a SharedStateProvider');
  }
  return context;
};
