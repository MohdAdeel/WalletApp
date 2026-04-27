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
          <ActivityIndicator size="large" color="#53F2FF" />
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
              color="#53F2FF"
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
                color="#63FFFF"
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
                color="#63FFFF"
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
                color="#63FFFF"
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
    backgroundColor: '#020408',
  },
  container: {
    flex: 1,
    backgroundColor: '#020408',
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
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(7, 8, 12, 0.6)',
    marginBottom: 10,
  },
  brandTitle: {
    fontSize: 28,
    letterSpacing: 2,
    fontWeight: '700',
    color: '#E8F6FF',
  },
  brandAccent: {
    color: '#63FFFF',
  },
  brandTag: {
    fontSize: 11,
    letterSpacing: 3,
    marginTop: 4,
    color: '#7A8BA8',
  },
  header: {
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  subtitle: {
    color: '#9ca5c4',
    marginTop: 8,
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(17, 24, 42, 0.9)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  label: {
    color: '#87a1ff',
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
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  notice: {
    color: '#7d8aa7',
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
    color: '#9ca5c4',
    fontSize: 16,
  },
  errorText: {
    color: '#f87171',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CreateWallet;
