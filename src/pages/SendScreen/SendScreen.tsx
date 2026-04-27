import {
  View,
  Text,
  Alert,
  Easing,
  Modal,
  Animated,
  Pressable,
  StatusBar,
  ScrollView,
  StyleSheet,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Contract, Wallet, isAddress, parseEther, parseUnits } from 'ethers';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/color';
import { MainStackParamList } from '../../navigation/MainStack';
import { useAuth } from '../../Contexts/AuthContext';
import { useWallet } from '../../Contexts/WalletContext';
import { getDefaultProvider } from '../../lib/Ether/EtherConfig';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const QR_LINE_COUNT = 1;
const ERC20_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
];

type SendScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'Send'
>;
type AssetOption = {
  id: string;
  symbol: string;
  name: string;
  type: 'native' | 'erc20';
  contractAddress?: string;
  decimals: number;
  balance?: number;
};

const SendScreen = () => {
  const navigation = useNavigation<SendScreenNavigationProp>();
  const { walletPublicKey, walletPrivateKey } = useAuth();
  const { walletDetails, refetchWalletDetails } = useWallet();
  const lineAnimations = useRef(
    Array.from({ length: QR_LINE_COUNT }, () => new Animated.Value(0)),
  ).current;

  const [recipientAddress, setRecipientAddress] = useState('');
  const [addressError, setAddressError] = useState<string | null>(null);
  const [isAddressVerified, setIsAddressVerified] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState('native-eth');

  useEffect(() => {
    const loops = lineAnimations.map((anim, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 1600,
            easing: Easing.linear,
            useNativeDriver: true,
            delay: index * 150,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 1600,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
      ),
    );

    loops.forEach(loop => loop.start());
    return () => loops.forEach(loop => loop.stop());
  }, [lineAnimations]);

  const assets = useMemo<AssetOption[]>(() => {
    const nativeBalance = Number(walletDetails?.balanceEth ?? '0');
    const nativeOption: AssetOption = {
      id: 'native-eth',
      symbol: 'ETH',
      name: 'Ethereum',
      type: 'native',
      decimals: 18,
      balance: Number.isFinite(nativeBalance) ? nativeBalance : 0,
    };

    const tokenOptions =
      walletDetails?.tokenPortfolio.topTokens.map(token => ({
        id: token.contractAddress,
        symbol: token.symbol,
        name: token.name,
        type: 'erc20' as const,
        contractAddress: token.contractAddress,
        decimals: token.decimals,
        balance: token.balance,
      })) ?? [];

    return [nativeOption, ...tokenOptions];
  }, [walletDetails]);

  const selectedAsset =
    assets.find(asset => asset.id === selectedAssetId) ?? assets[0] ?? null;

  const handleVerifyRecipient = () => {
    const trimmedAddress = recipientAddress.trim();
    if (!trimmedAddress) {
      setAddressError('Please enter a wallet address.');
      setIsAddressVerified(false);
      return;
    }

    if (!isAddress(trimmedAddress)) {
      setAddressError('Address format looks invalid. Check and try again.');
      setIsAddressVerified(false);
      return;
    }

    if (
      walletPublicKey &&
      trimmedAddress.toLowerCase() === walletPublicKey.toLowerCase()
    ) {
      setAddressError('You cannot send assets to your own wallet address.');
      setIsAddressVerified(false);
      return;
    }

    setAddressError(null);
    setIsAddressVerified(true);
    setIsDropdownOpen(false);
  };

  const handleSendTransaction = async () => {
    if (!walletPrivateKey) {
      Alert.alert(
        'Private key missing',
        'Wallet credentials are not available on this device. Re-import or recreate wallet first.',
      );
      return;
    }

    if (!selectedAsset) {
      Alert.alert('Select asset', 'Please select a currency first.');
      return;
    }

    const normalizedAmount = amount.trim();
    if (!normalizedAmount || Number(normalizedAmount) <= 0) {
      Alert.alert(
        'Invalid amount',
        'Please enter a valid amount greater than 0.',
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const provider = getDefaultProvider();
      const signer = new Wallet(walletPrivateKey, provider);
      const to = recipientAddress.trim();

      if (selectedAsset.type === 'native') {
        const tx = await signer.sendTransaction({
          to,
          value: parseEther(normalizedAmount),
        });
        await tx.wait();
      } else {
        const token = new Contract(
          selectedAsset.contractAddress!,
          ERC20_ABI,
          signer,
        );
        const transferAmount = parseUnits(
          normalizedAmount,
          selectedAsset.decimals,
        );
        const tx = await token.transfer(to, transferAmount);
        await tx.wait();
      }

      setIsConfirmVisible(false);
      setAmount('');
      setRecipientAddress('');
      setIsAddressVerified(false);
      await refetchWalletDetails();
      Alert.alert('Sent', 'Transaction submitted and confirmed on-chain.');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to send transaction.';
      Alert.alert('Send failed', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAmount = selectedAsset?.balance ?? 0;
  const enteredAmount = Number(amount || '0');
  const remainingAmount = Number.isFinite(enteredAmount)
    ? totalAmount - enteredAmount
    : totalAmount;
  const canProceed =
    isAddressVerified &&
    Boolean(selectedAsset) &&
    enteredAmount > 0 &&
    remainingAmount >= 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.darkBackground}
      />
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.headerBar}>
          <Pressable
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.iconText}>{'\u2190'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Send Assets</Text>
          <Pressable style={styles.iconButton}>
            <Text style={styles.iconText}>i</Text>
          </Pressable>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Recipient Address</Text>
          <View style={styles.inputRow}>
            <View style={styles.addressIcon}>
              <Text style={styles.addressIconText}>ENS</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="ENS or Wallet Address"
              placeholderTextColor={Colors.lightGreyText}
              value={recipientAddress}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={text => {
                setRecipientAddress(text);
                setAddressError(null);
                setIsAddressVerified(false);
              }}
            />
            <Pressable style={styles.goButton} onPress={handleVerifyRecipient}>
              <Text style={styles.goButtonText}>Go</Text>
            </Pressable>
          </View>
          {addressError ? (
            <Text style={styles.errorText}>{addressError}</Text>
          ) : null}
          {isAddressVerified ? (
            <Text style={styles.successText}>
              Address looks valid. Continue below.
            </Text>
          ) : null}
        </View>

        <View style={styles.qrCard}>
          <View style={styles.qrOverlay}>
            <View style={styles.qrHeader}>
              <Text style={styles.qrHeaderLabel}>Scan to send</Text>
              <View style={styles.qrStatusBadge}>
                <Text style={styles.qrStatusText}>Active</Text>
              </View>
            </View>
            <View style={styles.qrFrame}>
              <View style={styles.qrBackground}>
                {lineAnimations.map((anim, index) => (
                  <Animated.View
                    key={`line-${index}`}
                    style={[
                      styles.qrLine,
                      {
                        top: '50%',
                        transform: [
                          {
                            translateY: anim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-20, 20],
                            }),
                          },
                        ],
                        opacity: anim.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [0.2, 0.8, 0.2],
                        }),
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
            <Text style={styles.qrHint}>
              Hold your wallet QR inside the frame to auto-fill the address.
            </Text>
          </View>
        </View>

        {isAddressVerified ? (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.formCard}>
              <Text style={styles.label}>Select Currency</Text>
              <Pressable
                style={styles.currencySelector}
                onPress={() => setIsDropdownOpen(prev => !prev)}
              >
                <Text style={styles.assetTitle}>
                  {selectedAsset
                    ? `${selectedAsset.symbol} - ${selectedAsset.name}`
                    : 'Select asset'}
                </Text>
                <Text style={styles.dropdownText}>
                  {isDropdownOpen ? '\u25B2' : '\u25BC'}
                </Text>
              </Pressable>
              {isDropdownOpen ? (
                <View style={styles.dropdownList}>
                  {assets.map(asset => (
                    <Pressable
                      key={asset.id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedAssetId(asset.id);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <Text style={styles.dropdownItemTitle}>
                        {asset.symbol} - {asset.name}
                      </Text>
                      <Text style={styles.dropdownItemSubtitle}>
                        Balance: {asset.balance?.toFixed(6) ?? '0.000000'}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}

              <Text style={[styles.label, styles.amountLabel]}>
                Amount to Send
              </Text>
              <View style={styles.amountInputRow}>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.0"
                  placeholderTextColor={Colors.lightGreyText}
                  keyboardType="decimal-pad"
                  value={amount}
                  onChangeText={setAmount}
                />
                <Text style={styles.amountSuffix}>
                  {selectedAsset?.symbol ?? 'ETH'}
                </Text>
              </View>
              <Text style={styles.assetEquivalent}>
                Total Amount: {totalAmount.toFixed(6)}{' '}
                {selectedAsset?.symbol ?? 'ETH'}
              </Text>
              <Text style={styles.assetEquivalent}>
                Balance after send: {remainingAmount.toFixed(6)}{' '}
                {selectedAsset?.symbol ?? 'ETH'}
              </Text>

              <Pressable
                style={[
                  styles.proceedButton,
                  !canProceed && styles.disabledButton,
                ]}
                onPress={() => setIsConfirmVisible(true)}
                disabled={!canProceed}
              >
                <Text style={styles.proceedButtonText}>Proceed</Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        ) : null}
      </ScrollView>

      <Modal
        transparent
        visible={isConfirmVisible}
        animationType="fade"
        onRequestClose={() => setIsConfirmVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Confirm Transfer</Text>
            <Text style={styles.modalMessage}>
              Are you sure to send {amount || '0'}{' '}
              {selectedAsset?.symbol ?? 'ETH'} to this {recipientAddress.trim()}
              ?
            </Text>
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setIsConfirmVisible(false)}
                disabled={isSubmitting}
              >
                <Text style={styles.modalCancelText}>No</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={handleSendTransaction}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator
                    size="small"
                    color={Colors.darkBackground}
                  />
                ) : (
                  <Text style={styles.modalConfirmText}>Yes, Send</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.darkBackground,
  },
  scrollContainer: {
    backgroundColor: Colors.darkBackground,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#06060A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: Colors.whiteText,
    fontSize: 18,
    fontWeight: '600',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: Colors.whiteText,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  formCard: {
    backgroundColor: '#0F0F14',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1F1F25',
  },
  label: {
    color: Colors.lightGreyText,
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#07070B',
    borderRadius: 16,
    padding: 12,
  },
  addressIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.accentBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  addressIconText: {
    color: Colors.darkBackground,
    fontSize: 10,
    fontWeight: '700',
  },
  input: {
    flex: 1,
    color: Colors.whiteText,
    paddingVertical: 0,
  },
  goButton: {
    backgroundColor: Colors.accentBlue,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  goButtonText: {
    color: Colors.darkBackground,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  errorText: {
    color: '#f87171',
    marginTop: 8,
    fontSize: 12,
  },
  successText: {
    color: '#34d399',
    marginTop: 8,
    fontSize: 12,
  },
  qrCard: {
    backgroundColor: '#0F0F14',
    borderRadius: 24,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1F1F25',
    position: 'relative',
    overflow: 'hidden',
  },
  qrBackground: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    bottom: 14,
    borderRadius: 20,
    backgroundColor: '#07070B',
    justifyContent: 'center',
  },
  qrOverlay: {
    position: 'relative',
    padding: 16,
  },
  qrHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qrHeaderLabel: {
    color: Colors.whiteText,
    fontSize: 14,
    fontWeight: '600',
  },
  qrStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.accentBlue,
  },
  qrStatusText: {
    color: Colors.accentBlue,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  qrFrame: {
    width: 160,
    height: 160,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 18,
    borderColor: Colors.accentBlue,
    marginVertical: 8,
  },
  qrHint: {
    color: Colors.lightGreyText,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
  },
  qrLine: {
    position: 'absolute',
    width: '90%',
    height: 3,
    backgroundColor: Colors.accentBlue,
    borderRadius: 1,
    left: '5%',
  },
  currencySelector: {
    backgroundColor: '#07070B',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#1F1F25',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownList: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#1F1F25',
    borderRadius: 14,
    backgroundColor: '#07070B',
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F25',
  },
  dropdownItemTitle: {
    color: Colors.whiteText,
    fontWeight: '600',
  },
  dropdownItemSubtitle: {
    color: Colors.lightGreyText,
    marginTop: 2,
    fontSize: 12,
  },
  assetTitle: {
    color: Colors.whiteText,
    fontSize: 16,
    fontWeight: '700',
  },
  dropdownText: {
    color: Colors.lightGreyText,
    fontSize: 14,
  },
  amountLabel: {
    marginTop: 14,
  },
  amountInputRow: {
    backgroundColor: '#07070B',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#1F1F25',
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountInput: {
    flex: 1,
    color: Colors.whiteText,
    fontSize: 20,
    fontWeight: '700',
    paddingVertical: 0,
  },
  amountSuffix: {
    color: Colors.accentBlue,
    fontWeight: '700',
    fontSize: 14,
  },
  assetEquivalent: {
    color: Colors.lightGreyText,
    fontSize: 12,
    marginTop: 10,
    textAlign: 'left',
  },
  proceedButton: {
    marginTop: 14,
    backgroundColor: Colors.accentBlue,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  proceedButtonText: {
    color: Colors.darkBackground,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: '#10131C',
    borderWidth: 1,
    borderColor: '#1F1F25',
    padding: 18,
  },
  modalTitle: {
    color: Colors.whiteText,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalMessage: {
    color: Colors.lightGreyText,
    fontSize: 14,
    lineHeight: 20,
  },
  modalActions: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#1a1d28',
  },
  modalConfirmButton: {
    backgroundColor: Colors.accentBlue,
  },
  modalCancelText: {
    color: Colors.whiteText,
    fontWeight: '600',
  },
  modalConfirmText: {
    color: Colors.darkBackground,
    fontWeight: '700',
  },
});

export default SendScreen;
