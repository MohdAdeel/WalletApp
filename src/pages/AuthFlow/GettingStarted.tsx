import React, { useEffect } from 'react';
import { useAuth } from '../../Contexts/AuthContext';
import LinearGradient from 'react-native-linear-gradient';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { AppRootStackParamList } from '../../navigation/AppNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = NativeStackScreenProps<AppRootStackParamList, 'GettingStarted'>;

const INTRO_DURATION_MS = 2000;

const GettingStarted = ({ navigation }: Props) => {
  const { isHydrating } = useAuth();

  useEffect(() => {
    if (isHydrating) {
      return;
    }

    const timeoutId = setTimeout(() => {
      navigation.replace('AppFlow');
    }, INTRO_DURATION_MS);

    return () => clearTimeout(timeoutId);
  }, [navigation, isHydrating]);

  return (
    <LinearGradient
      colors={['#02040b', '#060c18', '#090f1d', '#070910']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.screen}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.topGlow} />
        <View style={styles.bottomGlow} />

        <View style={styles.content}>
          <View style={styles.badge}>
            <MaterialCommunityIcons
              name="shield-star"
              size={56}
              color="#63FFFF"
            />
          </View>

          <Text style={styles.brandTitle}>
            NEXUS
            <Text style={styles.brandAccent}>WALLET</Text>
          </Text>
          <Text style={styles.brandTag}>NEXT GEN DIGITAL ASSETS</Text>
          <Text style={styles.subtitle}>
            Premium custody for modern crypto wealth. Fast, secure, and built
            for the future.
          </Text>

          <View style={styles.loaderTrack}>
            <View style={styles.loaderPulse} />
          </View>
          <Text style={styles.loadingText}>Preparing your secure vault...</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  topGlow: {
    position: 'absolute',
    top: -120,
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: 'rgba(99, 255, 255, 0.12)',
  },
  bottomGlow: {
    position: 'absolute',
    bottom: -160,
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: 'rgba(153, 69, 255, 0.16)',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 26,
  },
  badge: {
    width: 124,
    height: 124,
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: 'rgba(99, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(10, 13, 25, 0.75)',
    shadowColor: '#53F2FF',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 14,
    marginBottom: 24,
  },
  brandTitle: {
    color: '#F2FBFF',
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: 2.8,
  },
  brandAccent: {
    color: '#63FFFF',
  },
  brandTag: {
    color: '#8FA3C2',
    marginTop: 8,
    marginBottom: 18,
    letterSpacing: 3.8,
    fontSize: 12,
    fontWeight: '600',
  },
  subtitle: {
    color: '#B1C2DD',
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 30,
    maxWidth: 320,
  },
  loaderTrack: {
    width: 210,
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
    marginBottom: 12,
  },
  loaderPulse: {
    width: '62%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#63FFFF',
  },
  loadingText: {
    color: '#8DA0BE',
    fontSize: 13,
    letterSpacing: 1.1,
  },
});

export default GettingStarted;
