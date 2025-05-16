import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../home/HomeScreen';
import SearchScreen from '../search/SearchScreen';
import FavouriteScreen from '../favourite/FavouriteScreen';
import CustomTabBar from './CustomTabBar';
import withPlayer from '../../components/player/Player';

const Tab = createBottomTabNavigator();

const UserBottomTab: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Favourite" component={FavouriteScreen} />
    </Tab.Navigator>
  );
};

export default withPlayer(UserBottomTab);
