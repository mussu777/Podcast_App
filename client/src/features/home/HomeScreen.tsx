import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import CustomSafeAreaView from '../../components/ui/CustomSafeAreaView';
import LottieView from 'lottie-react-native';
import HomeHeader from '../../components/home/HomeHeader';
import AIPick from '../../components/home/AIPick';
import {usePlayerStore} from '../../state/usePlayerStore';
import {useQuery} from '@apollo/client';
import {GET_TRENDING_AND_TOPPICKS} from '../../graphQL/queries';
import PodcastList from '../../components/home/PodcastList';

const HomeScreen = () => {
  const {user} = usePlayerStore();
  const {data, loading, error} = useQuery(GET_TRENDING_AND_TOPPICKS, {
    variables: {userId: user?.id},
  });

  return (
    <CustomSafeAreaView>
      <View style={styles.content}>
        <HomeHeader />

        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContainer}>
          <AIPick />
          <PodcastList data={data?.topPicks || []} title="Top Picks" />
          <PodcastList data={data?.trending || []} title="Trending" />
        </ScrollView>
      </View>

      <LottieView
        source={require('../../assets/animation/music.json')}
        autoPlay
        loop
        enableMergePathsAndroidForKitKatAndAbove
        hardwareAccelerationAndroid
        style={styles.lottie}
      />
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  lottie: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    right: 0,
    width: 300,
    height: 300,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
  scrollContent: {
    marginTop: 20,
    padding: 5,
  },
  scrollContainer: {
    paddingBottom: 120,
  },
});

export default HomeScreen;
