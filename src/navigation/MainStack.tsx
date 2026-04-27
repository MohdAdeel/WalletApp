import React from 'react';
import BottomTabNavigator from './BottomTabNavigator';
import SwapScreen from '../pages/SwapScreen/SwapScreen';
import SendScreen from '../pages/SendScreen/SendScreen';
import BuyAssetsScreen from '../pages/BuyAssets/BuyAssets';
import ReceiveScreen from '../pages/ReceiveScreen/ReceiveScreen';
import CreateProfileScreen from '../pages/CreateProfile/CreateProfile';
import NotificationsScreen from '../pages/Notifications/Notifications';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type MainStackParamList = {
  MainTabs: undefined;
  Send: undefined;
  Receive: undefined;
  Swap: undefined;
  BuyAssets: undefined;
  CreateProfile: undefined;
  Notifications: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="Send" component={SendScreen} />
      <Stack.Screen name="Receive" component={ReceiveScreen} />
      <Stack.Screen name="Swap" component={SwapScreen} />
      <Stack.Screen name="BuyAssets" component={BuyAssetsScreen} />
      <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;
