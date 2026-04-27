import React from 'react';
import HomeScreen from '../pages/Home/Home';
import WalletStartScreen from '../pages/AuthFlow/WalletStart';
import ImportWalletScreen from '../pages/AuthFlow/ImportWallet';
import CreateWalletScreen from '../pages/AuthFlow/CreateWallet';
import SecureBackupScreen from '../pages/AuthFlow/SecureBackup';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  WalletStart: undefined;
  ImportWallet: undefined;
  CreateWallet: undefined;
  SecureBackup: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="WalletStart" component={WalletStartScreen} />
      <Stack.Screen name="ImportWallet" component={ImportWalletScreen} />
      <Stack.Screen name="CreateWallet" component={CreateWalletScreen} />
      <Stack.Screen name="SecureBackup" component={SecureBackupScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
