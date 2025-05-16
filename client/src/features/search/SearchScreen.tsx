import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, {useRef, useState} from 'react';
import CustomSafeAreaView from '../../components/ui/CustomSafeAreaView';
import {Colors} from '../../utils/Constants';
import {fontR, screenHeight} from '../../utils/Scaling';
import CustomHeader from '../../components/ui/CustomHeader';
import {usePlayerStore} from '../../state/usePlayerStore';
import {GET_PODCASTS} from '../../graphQL/queries';
import {useQuery} from '@apollo/client';
import Icon from '../../components/ui/Icon';
import CustomText from '../../components/ui/CustomText';
import PodcastItem from '../../components/podcast/PodcastItem';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<TextInput>(null);
  const {user} = usePlayerStore();

  const {data, loading, error, refetch} = useQuery(GET_PODCASTS, {
    variables: {
      where: {
        title: {
          contains: searchQuery,
        },
      },
      userId: user?.id,
    },
    skip: !user?.id,
  });

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    refetch({
      where: {
        title: {
          contains: text,
        },
      },
      userId: user?.id,
    });
  };

  const renderPodcastItem = ({item}: any) => {
    const isFavourite = item.favoritedBy?.length > 0;

    return <PodcastItem item={{...item, isFavourite}} />;
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        inputRef.current?.blur();
      }}
      accessible={false}>
      <CustomSafeAreaView>
        <CustomHeader title="Search" />

        <View style={styles.searchContainer}>
          <Icon name="search" iconFamily="Ionicons" size={20} color="#fff" />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Search podcasts..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {loading ? (
          <CustomText variant="h5" style={styles.loadingText}>
            Loading...
          </CustomText>
        ) : error ? (
          <CustomText variant="h5" style={styles.errorText}>
            Error fetching podcasts! {error.message}
          </CustomText>
        ) : (
          <FlatList
            data={data?.podcasts || []}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Icon name="mic" iconFamily="Ionicons" size={fontR(40)} />
                <CustomText variant="h5">
                  No Podcast found! Try a different search.
                </CustomText>
              </View>
            }
            renderItem={renderPodcastItem}
            keyExtractor={(item: any) => item.id}
            showsVerticalScrollIndicator={false}
            style={{paddingTop: 20}}
          />
        )}
      </CustomSafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundDark,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 25,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: fontR(14),
    height: 35,
    color: '#fff',
  },
  emptyContainer: {
    height: screenHeight * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#fff',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
});

export default SearchScreen;
