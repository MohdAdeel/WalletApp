import {
  Text,
  View,
  Alert,
  StatusBar,
  Pressable,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Colors } from '../../constants/color';
import React, { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

type BuyAssetOption = {
  symbol: string;
  name: string;
  priceUsd: number;
  icon: string;
};

const assets: BuyAssetOption[] = [
  { symbol: 'ETH', name: 'Ethereum', priceUsd: 3150, icon: 'Ξ' },
  { symbol: 'BTC', name: 'Bitcoin', priceUsd: 64500, icon: '₿' },
  { symbol: 'USDC', name: 'USD Coin', priceUsd: 1, icon: '$' },
  { symbol: 'MATIC', name: 'Polygon', priceUsd: 0.93, icon: '⬢' },
];

const paymentMethods = [
  { label: 'Card', icon: 'card-outline' },
  { label: 'Bank Transfer', icon: 'business-outline' },
  { label: 'Apple Pay', icon: 'logo-apple' },
];

const BuyAssetsScreen = () => {
  const navigation = useNavigation();
  const [selectedAsset, setSelectedAsset] = useState<BuyAssetOption>(assets[0]);
  const [usdAmount, setUsdAmount] = useState('250');
  const [selectedPayment, setSelectedPayment] = useState(
    paymentMethods[0].label,
  );

  const parsedAmount = Number(usdAmount || '0');
  const isAmountValid = Number.isFinite(parsedAmount) && parsedAmount > 0;

  const estimatedReceive = useMemo(() => {
    if (!isAmountValid) {
      return 0;
    }
    return parsedAmount / selectedAsset.priceUsd;
  }, [isAmountValid, parsedAmount, selectedAsset.priceUsd]);

  const feesUsd = isAmountValid ? parsedAmount * 0.018 : 0;
  const totalUsd = isAmountValid ? parsedAmount + feesUsd : 0;

  const handleBuy = () => {
    if (!isAmountValid) {
      Alert.alert('Invalid amount', 'Enter a USD amount greater than 0.');
      return;
    }

    Alert.alert(
      'Purchase initiated',
      `Buying ${estimatedReceive.toFixed(6)} ${
        selectedAsset.symbol
      } with ${selectedPayment}.`,
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.darkBackground}
      />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
            hitSlop={10}
          >
            <Ionicons name="chevron-back" size={20} color={Colors.whiteText} />
          </Pressable>
          <Text style={styles.title}>BUY ASSETS</Text>
          <View style={styles.iconButtonPlaceholder} />
        </View>

        <LinearGradient
          colors={[Colors.surfaceAccent, Colors.surfaceAccent, Colors.surfaceAccent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <Text style={styles.heroLabel}>FAST ONRAMP</Text>
          <Text style={styles.heroTitle}>Purchase crypto in minutes</Text>
          <Text style={styles.heroSubtitle}>
            Choose asset, enter amount, and complete payment securely.
          </Text>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose asset</Text>
          <View style={styles.assetGrid}>
            {assets.map(asset => {
              const isSelected = selectedAsset.symbol === asset.symbol;
              return (
                <Pressable
                  key={asset.symbol}
                  style={[
                    styles.assetOption,
                    isSelected && styles.assetOptionSelected,
                  ]}
                  onPress={() => setSelectedAsset(asset)}
                >
                  <Text style={styles.assetIcon}>{asset.icon}</Text>
                  <Text style={styles.assetSymbol}>{asset.symbol}</Text>
                  <Text style={styles.assetName}>{asset.name}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>You pay (USD)</Text>
          <View style={styles.inputCard}>
            <Text style={styles.inputPrefix}>$</Text>
            <TextInput
              value={usdAmount}
              onChangeText={setUsdAmount}
              placeholder="0.00"
              placeholderTextColor={Colors.lightGreyText}
              style={styles.input}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={styles.quickAmounts}>
            {['50', '100', '250', '500'].map(value => (
              <Pressable
                key={value}
                style={[
                  styles.quickAmount,
                  usdAmount === value && styles.quickAmountSelected,
                ]}
                onPress={() => setUsdAmount(value)}
              >
                <Text
                  style={[
                    styles.quickAmountText,
                    usdAmount === value && styles.quickAmountTextSelected,
                  ]}
                >
                  ${value}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment method</Text>
          <View style={styles.paymentRow}>
            {paymentMethods.map(method => {
              const isSelected = selectedPayment === method.label;
              return (
                <Pressable
                  key={method.label}
                  style={[
                    styles.paymentChip,
                    isSelected && styles.paymentChipSelected,
                  ]}
                  onPress={() => setSelectedPayment(method.label)}
                >
                  <Ionicons
                    name={method.icon}
                    size={14}
                    style={[
                      styles.paymentChipIcon,
                      isSelected && styles.paymentChipIconSelected,
                    ]}
                  />
                  <Text
                    style={[
                      styles.paymentChipText,
                      isSelected && styles.paymentChipTextSelected,
                    ]}
                  >
                    {method.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Asset price</Text>
            <Text style={styles.summaryValue}>
              ${selectedAsset.priceUsd.toLocaleString()}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Estimated receive</Text>
            <Text style={styles.summaryValue}>
              {estimatedReceive.toFixed(6)} {selectedAsset.symbol}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Fees (1.8%)</Text>
            <Text style={styles.summaryValue}>${feesUsd.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotalRow]}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalValue}>${totalUsd.toFixed(2)}</Text>
          </View>
        </View>

        <Pressable
          style={[styles.buyButton, !isAmountValid && styles.buyButtonDisabled]}
          onPress={handleBuy}
          disabled={!isAmountValid}
        >
          <Text style={styles.buyButtonText}>
            Buy {selectedAsset.symbol} now
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.darkBackground,
  },
  screen: {
    flex: 1,
    backgroundColor: Colors.darkBackground,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundDeep,
    borderWidth: 1,
    borderColor: Colors.surfaceElevated,
  },
  iconButtonPlaceholder: {
    width: 42,
    height: 42,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: Colors.whiteText,
    fontSize: 13,
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  heroCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    padding: 18,
    minHeight: 132,
    justifyContent: 'center',
    marginBottom: 20,
  },
  heroLabel: {
    color: Colors.accentPrimary,
    fontSize: 11,
    letterSpacing: 1.2,
    fontWeight: '700',
    marginBottom: 8,
  },
  heroTitle: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
    marginBottom: 6,
  },
  heroSubtitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    lineHeight: 21,
    maxWidth: '95%',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: Colors.whiteText,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  assetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  assetOption: {
    width: '48%',
    backgroundColor: Colors.backgroundAlt,
    borderWidth: 1,
    borderColor: Colors.surfaceAccent,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  assetOptionSelected: {
    borderColor: Colors.accentBlue,
    backgroundColor: Colors.surfaceAccent,
  },
  assetIcon: {
    color: Colors.whiteText,
    fontSize: 19,
    marginBottom: 6,
  },
  assetSymbol: {
    color: Colors.whiteText,
    fontSize: 14,
    fontWeight: '700',
  },
  assetName: {
    color: Colors.lightGreyText,
    fontSize: 11,
    marginTop: 2,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    backgroundColor: Colors.backgroundBase,
    paddingHorizontal: 14,
    minHeight: 58,
  },
  inputPrefix: {
    color: Colors.lightGreyText,
    fontSize: 20,
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: Colors.whiteText,
    fontSize: 22,
    fontWeight: '700',
  },
  quickAmounts: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  quickAmount: {
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  quickAmountSelected: {
    borderColor: Colors.accentBlue,
    backgroundColor: Colors.borderSubtle,
  },
  quickAmountText: {
    color: Colors.accentBlue,
    fontWeight: '600',
    fontSize: 12,
  },
  quickAmountTextSelected: {
    color: Colors.whiteText,
  },
  paymentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  paymentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    backgroundColor: Colors.backgroundAlt,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  paymentChipIcon: {
    color: Colors.lightGreyText,
    marginRight: 6,
  },
  paymentChipIconSelected: {
    color: Colors.accentBlue,
  },
  paymentChipSelected: {
    borderColor: Colors.accentBlue,
    backgroundColor: Colors.surfaceAccent,
  },
  paymentChipText: {
    color: Colors.lightGreyText,
    fontSize: 12,
    fontWeight: '600',
  },
  paymentChipTextSelected: {
    color: Colors.whiteText,
  },
  summaryCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    backgroundColor: Colors.backgroundBase,
    padding: 16,
    marginBottom: 20,
  },
  summaryTitle: {
    color: Colors.whiteText,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: Colors.lightGreyText,
    fontSize: 12,
  },
  summaryValue: {
    color: Colors.whiteText,
    fontSize: 12,
    fontWeight: '600',
  },
  summaryTotalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    paddingTop: 10,
    marginTop: 3,
    marginBottom: 0,
  },
  summaryTotalLabel: {
    color: Colors.whiteText,
    fontSize: 14,
    fontWeight: '700',
  },
  summaryTotalValue: {
    color: Colors.accentBlue,
    fontSize: 16,
    fontWeight: '700',
  },
  buyButton: {
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: Colors.accentBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButtonDisabled: {
    opacity: 0.45,
  },
  buyButtonText: {
    color: Colors.whiteText,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default BuyAssetsScreen;
