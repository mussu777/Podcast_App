import HomeFocused from '../../assets/icons/home_focused.png';
import Home from '../../assets/icons/home.png';
import Favourite from '../../assets/icons/fav.png';
import Search from '../../assets/icons/search.png';
import SearchFocused from '../../assets/icons/search_focused.png';
import FavouriteFocused from '../../assets/icons/fav_focused.png';
import {FC} from 'react';
import {Image, TextStyle, View, ViewStyle} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import CustomText from '../../components/ui/CustomText';
import {fontR} from '../../utils/Scaling';
import {Colors} from '../../utils/Constants';

interface TabProps {
  name: string;
}

interface IconProp {
  focused: boolean;
}

const styles = {
  width: RFValue(18),
  height: RFValue(18),
};
const tabStyles: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
};
const textStyleInActive: TextStyle = {
  textAlign: 'center',
  marginTop: 4,
  color: Colors.inactive,
  fontSize: fontR(9.5),
};
const textStyleActive: TextStyle = {
  textAlign: 'center',
  marginTop: 4,
  color: Colors.text,
  fontSize: fontR(9.5),
};

const TabIcon: FC<TabProps> = ({name}) => {
  return (
    <View style={tabStyles}>
      <Image
        source={name === 'Home' ? Home : name === 'Search' ? Search : Favourite}
        style={[styles]}
      />
      <CustomText style={textStyleInActive}>{name}</CustomText>
    </View>
  );
};

const TabIconFocused: FC<TabProps> = ({name}) => {
  return (
    <View style={tabStyles}>
      <Image
        source={
          name === 'Home'
            ? HomeFocused
            : name === 'Search'
            ? SearchFocused
            : FavouriteFocused
        }
        style={[styles]}
      />
      <CustomText fontFamily="Satoshi-Bold" style={textStyleActive}>
        {name}
      </CustomText>
    </View>
  );
};

export const HomeTabIcon: FC<IconProp> = ({focused}) => {
  return focused ? <TabIconFocused name="Home" /> : <TabIcon name="Home" />;
};

export const FavouriteTabIcon: FC<IconProp> = ({focused}) => {
  return focused ? (
    <TabIconFocused name="Favourite" />
  ) : (
    <TabIcon name="Favourite" />
  );
};

export const SearchTabIcon: FC<IconProp> = ({focused}) => {
  return focused ? <TabIconFocused name="Search" /> : <TabIcon name="Search" />;
};
