import AuthStack from './AuthStack';
import MainStack from './MainStack';
import React from 'react';
import GettingStarted from '../pages/AuthFlow/GettingStarted';
import { useAuth } from '../Contexts/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type AppRootStackParamList = {
  GettingStarted: undefined;
  AppFlow: undefined;
};

const Stack = createNativeStackNavigator<AppRootStackParamList>();

const AppFlow = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <MainStack /> : <AuthStack />;
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="GettingStarted"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="GettingStarted" component={GettingStarted} />
        <Stack.Screen name="AppFlow" component={AppFlow} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
