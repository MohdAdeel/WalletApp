/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar } from 'react-native';
import { Colors } from './src/constants/color';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/Contexts/AuthContext';
import { WalletProvider } from './src/Contexts/WalletContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <WalletProvider>
            <StatusBar
              barStyle="light-content"
              backgroundColor={Colors.darkBackground}
            />
            <AppNavigator />
          </WalletProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
