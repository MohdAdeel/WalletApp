import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { Colors } from '../../constants/color';
import { useWallet } from '../../Contexts/WalletContext';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { walletDetails, isWalletDetailsLoading } = useWallet();
  const handleSend = () => navigation.getParent()?.navigate('Send');
  const handleReceive = () => navigation.getParent()?.navigate('Receive');
  const handleBuy = () => navigation.getParent()?.navigate('BuyAssets');
  const handleNotifications = () =>
    navigation.getParent()?.navigate('Notifications');

  const displayName =
    walletDetails?.ensName ??
    (walletDetails?.publicKey
      ? `${walletDetails.publicKey.slice(
          0,
          6,
        )}...${walletDetails.publicKey.slice(-4)}`
      : 'Wallet');
  const portfolioValueText = walletDetails
    ? `${Number(walletDetails.balanceEth).toFixed(4)} ETH`
    : '--';

  const assets = walletDetails?.tokenPortfolio.topTokens ?? [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.profileContainer}>
              <View style={styles.profileImage}>
                <Text style={styles.profileInitial}>A</Text>
              </View>
            </View>
            <View style={styles.userTextContainer}>
              <Text style={styles.welcomeText}>WELCOME BACK</Text>
              <Text style={styles.usernameText}>{displayName}</Text>
            </View>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleNotifications}
            >
              <Ionicons
                name="notifications-outline"
                size={22}
                color={Colors.whiteText}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Portfolio Value Section */}
        <View style={styles.portfolioSection}>
          <Text style={styles.portfolioLabel}>PORTFOLIO VALUE</Text>
          <View style={styles.portfolioValueContainer}>
            <Text style={styles.portfolioValue}>{portfolioValueText}</Text>
          </View>
          <View style={styles.changeChip}>
            <Text style={styles.changeText}>
              {isWalletDetailsLoading
                ? 'Refreshing wallet...'
                : `Tx Count: ${walletDetails?.transactionCount ?? 0}`}
            </Text>
          </View>
        </View>

        {/* Performance Graph Section */}
        <View style={styles.graphCard}>
          <View style={styles.graphContainer}>
            {/* Graph gradient fill area */}
            <View style={styles.graphGradientArea}>
              {[
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
              ].map(index => {
                const baseHeight = 40;
                const variation = Math.sin(index * 0.3) * 20;
                const trend = index * 2;
                const height = Math.min(160, baseHeight + variation + trend);
                const opacity = 0.1 + (height / 160) * 0.5;
                return (
                  <View
                    key={index}
                    style={[
                      styles.graphGradientBar,
                      {
                        height: height,
                        backgroundColor: Colors.accentBlue,
                        opacity: opacity,
                      },
                    ]}
                  />
                );
              })}
            </View>
            {/* Graph line */}
            <View style={styles.graphLineWrapper}>
              <View style={styles.graphLine} />
            </View>
          </View>
        </View>

        {/* Action Buttons Section */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleSend}>
            <View style={styles.actionButtonIcon}>
              <Text style={styles.actionButtonIconText}>↑</Text>
            </View>
            <Text style={styles.actionButtonText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleReceive}>
            <View style={styles.actionButtonIcon}>
              <Text style={styles.actionButtonIconText}>↓</Text>
            </View>
            <Text style={styles.actionButtonText}>Receive</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionButtonIcon}>
              <Text style={styles.actionButtonIconText}>⇄</Text>
            </View>
            <Text style={styles.actionButtonText}>Swap</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.actionButton} onPress={handleBuy}>
            <View style={styles.actionButtonIcon}>
              <Text style={styles.actionButtonIconText}>🛒</Text>
            </View>
            <Text style={styles.actionButtonText}>Buy</Text>
          </TouchableOpacity>
        </View>

        {/* Your Assets Section */}
        <View style={styles.assetsSection}>
          <View style={styles.assetsHeader}>
            <Text style={styles.assetsTitle}>YOUR ASSETS</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {assets.length === 0 && !isWalletDetailsLoading ? (
            <View style={styles.assetCard}>
              <Text style={styles.assetName}>No token balances found yet.</Text>
            </View>
          ) : null}

          {assets.map(asset => (
            <View key={asset.contractAddress} style={styles.assetCard}>
              <View style={styles.assetLeft}>
                <View
                  style={[
                    styles.assetIconContainer,
                    {
                      backgroundColor:
                        asset.symbol === 'ETH'
                          ? Colors.ethereumBlue
                          : Colors.accentBlue,
                    },
                  ]}
                >
                  <Text style={styles.assetIcon}>
                    {asset.symbol.slice(0, 1)}
                  </Text>
                </View>
                <View style={styles.assetInfo}>
                  <Text style={styles.assetName}>{asset.name}</Text>
                </View>
              </View>
              <View style={styles.assetRight}>
                <Text style={styles.assetAmount}>
                  {asset.balance.toFixed(6)} {asset.symbol}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkBackground,
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileContainer: {
    marginRight: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.cardBackground,
    borderWidth: 2,
    borderColor: Colors.accentBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.whiteText,
  },
  userTextContainer: {
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 11,
    color: Colors.lightGreyText,
    letterSpacing: 1,
    marginBottom: 2,
  },
  usernameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.whiteText,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
    color: Colors.whiteText,
  },
  // Portfolio Section Styles
  portfolioSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  portfolioLabel: {
    fontSize: 11,
    color: Colors.lightGreyText,
    letterSpacing: 1,
    marginBottom: 8,
  },
  portfolioValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  portfolioValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.whiteText,
  },
  portfolioValueDecimal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.whiteText,
  },
  changeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.positiveGreen,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  changeIcon: {
    fontSize: 10,
    color: Colors.positiveGreen,
    marginRight: 4,
  },
  changeText: {
    fontSize: 12,
    color: Colors.accentBlue,
    fontWeight: '600',
  },
  // Graph Section Styles
  graphCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    height: 200,
  },
  graphContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    position: 'relative',
    overflow: 'hidden',
  },
  graphGradientArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '100%',
    gap: 1,
    paddingBottom: 2,
  },
  graphGradientBar: {
    flex: 1,
    borderRadius: 1,
    minHeight: 20,
  },
  graphLineWrapper: {
    position: 'absolute',
    bottom: 2,
    left: 0,
    right: 0,
    height: 3,
    zIndex: 1,
  },
  graphLine: {
    height: 3,
    backgroundColor: Colors.accentBlue,
    borderRadius: 1.5,
    width: '100%',
  },
  // Action Buttons Styles
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionButtonIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: Colors.whiteText,
    backgroundColor: Colors.darkBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButtonIconText: {
    fontSize: 24,
    color: Colors.whiteText,
  },
  actionButtonText: {
    fontSize: 12,
    color: Colors.whiteText,
    fontWeight: '500',
  },
  // Assets Section Styles
  assetsSection: {
    paddingHorizontal: 20,
  },
  assetsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  assetsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.whiteText,
  },
  viewAllText: {
    fontSize: 12,
    color: Colors.lightGreyText,
  },
  assetCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  assetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  assetIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  assetIcon: {
    fontSize: 24,
    color: Colors.whiteText,
    fontWeight: 'bold',
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.whiteText,
    marginBottom: 4,
  },
  assetAmount: {
    fontSize: 13,
    color: Colors.lightGreyText,
  },
  assetRight: {
    alignItems: 'flex-end',
  },
  assetValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.whiteText,
    marginBottom: 4,
  },
  assetChange: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.lightGreyText,
    maxWidth: 110,
  },
});

export default HomeScreen;
