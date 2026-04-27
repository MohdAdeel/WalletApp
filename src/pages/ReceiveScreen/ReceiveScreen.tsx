import {
  Alert,
  Share,
  Text,
  View,
  Pressable,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import React from 'react';
import { Colors } from '../../constants/color';
import { useAuth } from '../../Contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';
import LinearGradient from 'react-native-linear-gradient';

const actionButtons = [
  { icon: 'copy-outline', label: 'Copy Address', key: 'copy' },
  { icon: 'share-social-outline', label: 'Share', key: 'share' },
  { icon: 'qr-code-outline', label: 'Show QR', key: 'qr' },
];

const qrPattern = [
  [1, 0, 1, 0, 1],
  [0, 1, 1, 1, 0],
  [1, 1, 0, 1, 1],
  [0, 1, 1, 1, 0],
  [1, 0, 1, 0, 1],
];

const ReceiveScreen = () => {
  const navigation = useNavigation();
  const { walletPublicKey } = useAuth();

  const handleCopyAddress = () => {
    if (!walletPublicKey) {
      Alert.alert('Unavailable', 'Wallet public address is not available yet.');
      return;
    }

    Clipboard.setString(walletPublicKey);
    Alert.alert('Copied', 'Wallet public address copied to clipboard.');
  };

  const handleShareAddress = async () => {
    if (!walletPublicKey) {
      Alert.alert('Unavailable', 'Wallet public address is not available yet.');
      return;
    }

    try {
      await Share.share({
        message: `Send assets to my wallet address:\n${walletPublicKey}`,
      });
    } catch {
      Alert.alert('Unable to share', 'Please try again in a moment.');
    }
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
          >
            <Ionicons name="chevron-back" size={20} color={Colors.whiteText} />
          </Pressable>
          <Text style={styles.title}>RECEIVE ASSETS</Text>
          <Pressable style={styles.iconButton}>
            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color={Colors.whiteText}
            />
          </Pressable>
        </View>
        <Text style={styles.subtitle}>
          Share your public wallet address to receive funds securely.
        </Text>

        <View style={styles.assetCard}>
          <View style={styles.assetRow}>
            <View style={styles.assetBadge}>
              <Text style={styles.assetBadgeText}>Ξ</Text>
            </View>
            <View style={styles.assetInfo}>
              <Text style={styles.assetName}>Ethereum</Text>
              <Text style={styles.assetSub}>Main Wallet Address</Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>Active</Text>
            </View>
          </View>
        </View>

        <View style={styles.assetCard}>
          <LinearGradient
            colors={[
              `${Colors.gradientBlueStart}22`,
              `${Colors.gradientPurpleEnd}40`,
              `${Colors.gradientBlueStart}22`,
            ]}
            style={styles.qrGlow}
          >
            <View style={styles.qrContainer}>
              <View style={styles.qrFrame}>
                <View style={styles.qrMatrix}>
                  {qrPattern.map((row, rowIndex) => (
                    <View style={styles.qrRow} key={`row-${rowIndex}`}>
                      {row.map((cell, cellIndex) => (
                        <View
                          key={`cell-${rowIndex}-${cellIndex}`}
                          style={[
                            styles.qrCell,
                            cell ? styles.qrCellActive : styles.qrCellInactive,
                          ]}
                        />
                      ))}
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.qrCornerBadge}>
                <Text style={styles.qrCornerText}>BTC</Text>
              </View>
              <Text style={styles.qrMeta}>12 / 5.4.7</Text>
            </View>
          </LinearGradient>
          <Text style={styles.qrHint}>SCAN TO RECEIVE ASSETS</Text>
        </View>

        <View style={styles.addressCard}>
          <View style={styles.addressHeader}>
            <Text style={styles.addressTitle}>YOUR WALLET ADDRESS</Text>
            <Pressable style={styles.copyButton} onPress={handleCopyAddress}>
              <Ionicons
                name="copy-outline"
                size={16}
                color={Colors.accentBlue}
              />
            </Pressable>
          </View>
          <Text style={styles.addressText}>
            {walletPublicKey ?? 'Wallet address is not available yet.'}
          </Text>
          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Public</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Verified</Text>
            </View>
          </View>
        </View>

        <View style={styles.noteCard}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={Colors.accentBlue}
          />
          <Text style={styles.noteText}>
            Send only Ethereum network compatible assets to this address.
          </Text>
        </View>

        <View style={styles.actionRow}>
          {actionButtons.map(action => (
            <View key={action.label} style={styles.actionWrapper}>
              <Pressable
                style={styles.actionButton}
                onPress={() => {
                  if (action.key === 'copy') {
                    handleCopyAddress();
                    return;
                  }
                  if (action.key === 'share') {
                    void handleShareAddress();
                    return;
                  }
                  Alert.alert(
                    'QR Ready',
                    'Scan the QR above to receive assets.',
                  );
                }}
              >
                <Ionicons
                  name={action.icon}
                  size={22}
                  color={Colors.whiteText}
                />
              </Pressable>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </View>
          ))}
        </View>
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
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.backgroundDeep,
    borderWidth: 1,
    borderColor: Colors.surfaceBase,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: Colors.whiteText,
    letterSpacing: 2,
    fontSize: 12,
    fontWeight: '700',
  },
  subtitle: {
    color: Colors.lightGreyText,
    fontSize: 13,
    marginBottom: 8,
    lineHeight: 19,
  },
  assetCard: {
    backgroundColor: Colors.backgroundBase,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.surfaceElevated,
    padding: 22,
    marginTop: 12,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 360,
  },
  assetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  assetBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accentBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assetBadgeText: {
    color: Colors.darkBackground,
    fontWeight: '700',
    fontSize: 18,
  },
  assetInfo: {
    flex: 1,
    marginLeft: 12,
  },
  assetName: {
    color: Colors.whiteText,
    fontWeight: '700',
    fontSize: 18,
  },
  assetSub: {
    color: Colors.lightGreyText,
    fontSize: 12,
  },
  statusPill: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    backgroundColor: Colors.surfaceAccent,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusPillText: {
    color: Colors.accentBlue,
    fontSize: 11,
    fontWeight: '700',
  },
  qrGlow: {
    borderRadius: 40,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accentBlue,
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },
  qrContainer: {
    width: 220,
    height: 220,
    borderRadius: 34,
    backgroundColor: Colors.backgroundDeep,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  qrMatrix: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'space-between',
  },
  qrFrame: {
    width: '90%',
    aspectRatio: 1,
    borderRadius: 28,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderMuted,
    backgroundColor: Colors.backgroundDeep,
    justifyContent: 'center',
  },
  qrRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  qrCell: {
    width: 16,
    height: 16,
    margin: 3,
    borderRadius: 4,
  },
  qrCellActive: {
    backgroundColor: Colors.whiteText,
  },
  qrCellInactive: {
    backgroundColor: Colors.backgroundDeep,
  },
  qrMeta: {
    color: Colors.lightGreyText,
    fontSize: 11,
    letterSpacing: 1.5,
    marginTop: 12,
  },
  qrCornerBadge: {
    position: 'absolute',
    bottom: 14,
    right: 18,
    backgroundColor: Colors.backgroundDeep,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  qrCornerText: {
    color: Colors.whiteText,
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: '600',
  },
  qrHint: {
    marginTop: 14,
    color: Colors.lightGreyText,
    letterSpacing: 1.5,
    fontSize: 12,
  },
  addressCard: {
    backgroundColor: Colors.backgroundBase,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.surfaceBase,
    padding: 20,
    marginTop: 24,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressTitle: {
    color: Colors.accentBlue,
    letterSpacing: 2,
    fontSize: 10,
    fontWeight: '600',
  },
  copyButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: Colors.accentBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressText: {
    color: Colors.whiteText,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Menlo',
  },
  tagRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  tag: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.accentBlue,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 10,
  },
  tagText: {
    color: Colors.accentBlue,
    fontSize: 12,
    fontWeight: '600',
  },
  noteCard: {
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    backgroundColor: Colors.backgroundAlt,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  noteText: {
    color: Colors.lightGreyText,
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  actionWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  actionButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: Colors.backgroundDeep,
    borderWidth: 1,
    borderColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  actionLabel: {
    color: Colors.lightGreyText,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

export default ReceiveScreen;
