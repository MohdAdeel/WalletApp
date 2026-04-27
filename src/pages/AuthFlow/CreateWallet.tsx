import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Wallet } from 'ethers';
import { Colors } from '../../constants/color';
import { useAuth } from '../../Contexts/AuthContext';
import React, { useState, useCallback } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import GradientButton from '../../components/GradientButton';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = NativeStackScreenProps<AuthStackParamList, 'CreateWallet'>;

const CreateWallet = ({ navigation }: Props) => {
  const { setWalletCredentials } = useAuth();
  const [wallet, setWallet] = useState<{
    address: string;
    privateKey: string;
    mnemonic: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateWallet = useCallback(() => {
    setLoading(true);
    setError(null);
    try {
      const newWallet = Wallet.createRandom();
      console.log('newWallet', newWallet);
      setWallet({
        address: newWallet.address,
        privateKey: newWallet.privateKey,
        mnemonic: newWallet.mnemonic?.phrase ?? '',
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create wallet');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    generateWallet();
  }, [generateWallet]);

  const handleSave = async () => {
    if (!wallet?.address) {
      setError('Wallet is not ready yet. Please try again.');
      return;
    }

    try {
      await setWalletCredentials(wallet.address, wallet.privateKey);
      navigation.navigate('SecureBackup');
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Failed to save wallet public key.',
      );
    }
  };

  const handleCopyMnemonic = () => {
    if (!wallet?.mnemonic) {
      Alert.alert('Unavailable', 'Mnemonic is not available yet.');
      return;
    }

    Clipboard.setString(wallet.mnemonic);
    Alert.alert('Copied', 'Recovery phrase copied to clipboard.');
  };

  const handleCopyPublicKey = () => {
    if (!wallet?.address) {
      Alert.alert('Unavailable', 'Public key is not available yet.');
      return;
    }

    Clipboard.setString(wallet.address);
    Alert.alert('Copied', 'Public key copied to clipboard.');
  };

  const handleCopyPrivateKey = () => {
    if (!wallet?.privateKey) {
      Alert.alert('Unavailable', 'Private key is not available yet.');
      return;
    }

    Clipboard.setString(wallet.privateKey);
    Alert.alert('Copied', 'Private key copied to clipboard.');
  };

  if (loading && !wallet) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.accentCyanBright} />
          <Text style={styles.loadingText}>Generating wallet...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !wallet) {
    console.log('error', error);
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <GradientButton title="RETRY" onPress={generateWallet} showIcon />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <MaterialCommunityIcons
              name="wallet-outline"
              size={32}
              color={Colors.accentCyanBright}
            />
          </View>
          <Text style={styles.brandTitle}>
            NEXUS<Text style={styles.brandAccent}>WALLET</Text>
          </Text>
          <Text style={styles.brandTag}>NEXT GEN DIGITAL ASSETS</Text>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Create Wallet</Text>
          <Text style={styles.subtitle}>
            We generated a brand new secure wallet for you.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Public Key</Text>
            <TouchableOpacity
              onPress={handleCopyPublicKey}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.copyButton}
            >
              <MaterialCommunityIcons
                name="content-copy"
                size={18}
                color={Colors.accentCyan}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.value}>{wallet?.address ?? '—'}</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Private Key</Text>
            <TouchableOpacity
              onPress={handleCopyPrivateKey}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.copyButton}
            >
              <MaterialCommunityIcons
                name="content-copy"
                size={18}
                color={Colors.accentCyan}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.value}>{wallet?.privateKey ?? '—'}</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Key Phrase</Text>
            <TouchableOpacity
              onPress={handleCopyMnemonic}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.copyButton}
            >
              <MaterialCommunityIcons
                name="content-copy"
                size={18}
                color={Colors.accentCyan}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.value}>{wallet?.mnemonic ?? '—'}</Text>
        </View>

        <Text style={styles.notice}>
          Save these details offline. You will need them to recover during
          emergencies.
        </Text>

        <GradientButton
          title="SAVE WALLET"
          onPress={handleSave}
          containerStyle={styles.button}
          showIcon
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundDeep,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDeep,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
    gap: 16,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 8,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.glassMid,
    marginBottom: 10,
  },
  brandTitle: {
    fontSize: 28,
    letterSpacing: 2,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  brandAccent: {
    color: Colors.accentCyan,
  },
  brandTag: {
    fontSize: 11,
    letterSpacing: 3,
    marginTop: 4,
    color: Colors.textMuted,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  subtitle: {
    color: Colors.textSecondary,
    marginTop: 8,
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.glassDark,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.borderMuted,
  },
  label: {
    color: Colors.accentPrimary,
    fontSize: 14,
    marginBottom: 4,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  copyButton: {
    padding: 4,
    marginBottom: 4,
  },
  value: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  notice: {
    color: Colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    marginTop: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  errorText: {
    color: Colors.statusError,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CreateWallet;
