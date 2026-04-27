import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { Colors } from '../../constants/color';
import LinearGradient from 'react-native-linear-gradient';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = NativeStackScreenProps<AuthStackParamList, 'WalletStart'>;

const WalletStart = ({ navigation }: Props) => {
  return (
    <LinearGradient
      colors={[Colors.backgroundDeep, Colors.backgroundBase, Colors.backgroundBase]}
      style={styles.screen}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.hero}>
            <View style={styles.logoCircle}>
              <MaterialCommunityIcons
                name="wallet-outline"
                size={64}
                color={Colors.accentCyanBright}
              />
            </View>
            <Text style={styles.brandTitle}>
              NEXUS
              <Text style={styles.brandAccent}>WALLET</Text>
            </Text>
            <Text style={styles.brandTag}>NEXT GEN DIGITAL ASSETS</Text>
            <Text style={styles.subtitle}>
              Secure your digital future with cutting-edge blockchain technology
            </Text>
          </View>

          <View style={styles.ctaGroup}>
            <Text style={styles.ctaTitle}>Get Started</Text>

            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => navigation.navigate('CreateWallet')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[
                  Colors.glowCyanSoft,
                  Colors.glowPurpleSoft,
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
              >
                <View style={styles.cardContent}>
                  <View style={styles.iconContainer}>
                    <MaterialCommunityIcons
                      name="wallet-plus"
                      size={32}
                      color={Colors.accentCyan}
                    />
                  </View>
                  <View style={styles.cardText}>
                    <Text style={styles.cardTitle}>Create New Wallet</Text>
                    <Text style={styles.cardSubtitle}>
                      Start fresh with a new secure vault
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color={Colors.accentCyan}
                  />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => navigation.navigate('ImportWallet')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[
                  Colors.glowPurpleSoft,
                  Colors.glowCyanSoft,
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
              >
                <View style={styles.cardContent}>
                  <View style={styles.iconContainer}>
                    <MaterialCommunityIcons
                      name="cloud-download"
                      size={32}
                      color={Colors.accentLavender}
                    />
                  </View>
                  <View style={styles.cardText}>
                    <Text style={styles.cardTitle}>Import Wallet</Text>
                    <Text style={styles.cardSubtitle}>
                      Restore using recovery phrase
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color={Colors.accentLavender}
                  />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'space-between',
  },
  hero: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Colors.glowCyanMid,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.glassMid,
    marginBottom: 24,
    shadowColor: Colors.accentCyan,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  brandTitle: {
    fontSize: 36,
    letterSpacing: 2.5,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  brandAccent: {
    color: Colors.accentCyan,
  },
  brandTag: {
    fontSize: 12,
    letterSpacing: 4,
    color: Colors.textMuted,
    marginBottom: 16,
  },
  subtitle: {
    color: Colors.textSecondary,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: 20,
    letterSpacing: 0.3,
  },
  ctaGroup: {
    marginBottom: 20,
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 20,
    letterSpacing: 1,
  },
  optionCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.accentCyan,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  cardGradient: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderMuted,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.glassMid,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.glowCyanSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  cardSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    letterSpacing: 0.3,
  },
});

export default WalletStart;
