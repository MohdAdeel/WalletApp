import {
  View,
  Text,
  Platform,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import { Wallet } from 'ethers';
import React, { useState } from 'react';
import { Colors } from '../../constants/color';
import { useAuth } from '../../Contexts/AuthContext';
import LinearGradient from 'react-native-linear-gradient';
import GradientButton from '../../components/GradientButton';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { getDefaultProvider } from '../../lib/Ether/EtherConfig';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = NativeStackScreenProps<AuthStackParamList, 'ImportWallet'>;

const ImportWallet = ({ navigation }: Props) => {
  const { setWalletCredentials } = useAuth();
  const [keyphrase, setKeyphrase] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const canProceed = Boolean(keyphrase.trim());

  const handleImport = async () => {
    if (!canProceed) return;
    const phrase = keyphrase.trim();
    const words = phrase.split(/\s+/).filter(Boolean);
    if (words.length !== 12 && words.length !== 24) {
      setError('Recovery phrase must be 12 or 24 words.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const provider = getDefaultProvider();
      const wallet = Wallet.fromPhrase(phrase).connect(provider);
      console.log('Imported wallet:', {
        address: wallet.address,
        wallet,
      });
      await setWalletCredentials(wallet.address, wallet.privateKey);
      navigation.navigate('SecureBackup');
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Invalid recovery phrase.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[Colors.backgroundDeep, Colors.backgroundBase, Colors.backgroundBase]}
      style={styles.screen}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.logoSection}>
              <View style={styles.logoCircle}>
                <MaterialCommunityIcons
                  name="wallet-outline"
                  size={36}
                  color={Colors.accentCyanBright}
                />
              </View>
              <Text style={styles.brandTitle}>
                NEXUS
                <Text style={styles.brandAccent}>WALLET</Text>
              </Text>
              <Text style={styles.brandTag}>NEXT GEN DIGITAL ASSETS</Text>
            </View>

            <View style={styles.card}>
              <View style={styles.header}>
                <MaterialCommunityIcons
                  name="wallet-plus"
                  size={32}
                  color={Colors.accentCyan}
                  style={styles.headerIcon}
                />
                <Text style={styles.cardTitle}>Import Wallet</Text>
                <Text style={styles.cardSubtitle}>
                  Restore your vault with recovery phrase
                </Text>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.label}>Recovery Phrase</Text>
                <TextInput
                  style={[styles.input, error ? styles.inputError : null]}
                  placeholder="word word word ..."
                  placeholderTextColor={Colors.textMuted}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  value={keyphrase}
                  onChangeText={t => {
                    setKeyphrase(t);
                    setError(null);
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <View style={styles.infoBox}>
                  <MaterialCommunityIcons
                    name="information"
                    size={18}
                    color={Colors.accentCyan}
                  />
                  <Text style={styles.infoText}>
                    Enter your 12 or 24 word recovery phrase with spaces between
                    each word.
                  </Text>
                </View>
              </View>

              <GradientButton
                title={loading ? 'IMPORTING...' : 'IMPORT WALLET'}
                onPress={canProceed && !loading ? handleImport : undefined}
                containerStyle={[
                  styles.buttonContainer,
                  (!canProceed || loading) && styles.buttonDisabled,
                ]}
                showIcon
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 32,
    paddingHorizontal: 24,
    paddingTop: 40,
    justifyContent: 'space-between',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.glassMid,
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: 32,
    letterSpacing: 2,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  brandAccent: {
    color: Colors.accentCyan,
  },
  brandTag: {
    fontSize: 12,
    letterSpacing: 4,
    marginTop: 4,
    color: Colors.textMuted,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.glassDark,
    borderRadius: 30,
    padding: 24,
    shadowColor: Colors.backgroundDeep,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerIcon: {
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 24,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: 4,
  },
  cardSubtitle: {
    color: Colors.textMuted,
    marginTop: 8,
    letterSpacing: 0.6,
    textAlign: 'center',
    fontSize: 15,
  },
  formSection: {
    marginBottom: 20,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: Colors.inputBackground,
    borderRadius: 16,
    padding: 16,
    color: Colors.textPrimary,
    fontSize: 15,
    minHeight: 130,
    borderWidth: 1,
    borderColor: Colors.borderMuted,
    letterSpacing: 0.5,
    lineHeight: 22,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.glowCyanSoft,
    borderRadius: 12,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: Colors.glowCyanMid,
    gap: 10,
  },
  infoText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    letterSpacing: 0.3,
  },
  buttonContainer: {
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  inputError: {
    borderColor: Colors.statusError,
  },
  errorText: {
    color: Colors.statusError,
    fontSize: 13,
    marginTop: 8,
  },
});

export default ImportWallet;
