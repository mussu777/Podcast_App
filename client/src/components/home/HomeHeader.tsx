import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {Image} from 'react-native';
import Icon from '../ui/Icon';
import {mmkvStorage} from '../../state/storage';
import {usePlayerStore} from '../../state/usePlayerStore';

const HomeHeader = () => {
  const {setUser} = usePlayerStore();
  return (
    <View style={styles.flexRow}>
      <Image
        source={require('../../assets/icons/logo.png')}
        style={styles.img}
      />

      <TouchableOpacity
        onPress={() => {
          setUser(null);
          mmkvStorage.removeItem('token');
        }}>
        <Icon name="power-sharp" iconFamily="Ionicons" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  flexRow: {
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: 10,
  },
  img: {
    width: 120,
    height: 50,
    resizeMode: 'contain',
  },
  profile: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    borderRadius: 500,
    overflow: 'hidden',
    marginRight: 10,
  },
});

export default HomeHeader;
