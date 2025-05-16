import {View, StyleSheet, Image} from 'react-native';
import React, {FC} from 'react';
import CustomText from './CustomText';
import {fontR} from '../../utils/Scaling';
import {Fonts} from '../../utils/Constants';
const CustomHeader: FC<{title: string}> = ({title}) => {
  return (
    <View style={styles.flexRow}>
      <CustomText fontFamily={Fonts.Medium} fontSize={fontR(14)}>
        {title}
      </CustomText>
      <Image
        source={require('../../assets/icons/logo.png')}
        style={styles.img}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  img: {
    width: 140,
    height: 35,
    resizeMode: 'contain',
  },
  flexRow: {
    gap: 10,
    flexDirection: 'row',
    paddingLeft: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
export default CustomHeader;
