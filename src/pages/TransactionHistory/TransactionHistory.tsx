import {
  Text,
  View,
  Pressable,
  StatusBar,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import React, { useMemo } from 'react';
import { Colors } from '../../constants/color';
import { useAuth } from '../../Contexts/AuthContext';
import { useWallet } from '../../Contexts/WalletContext';
import { useNavigation } from '@react-navigation/native';
import type { WalletTransfer } from '../../hooks/useGetWalletDetails';

type UiTransaction = {
  id: string;
  title: string;
  subtitle: string;
  amount: string;
  time: string;
  type: 'sent' | 'received';
  icon: string;
  bgColor: string;
  timestampMs: number;
};

const shortenAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

const getSectionTitle = (timestampMs: number) => {
  const date = new Date(timestampMs);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const TransactionHistoryScreen = () => {
  const navigation = useNavigation<any>();
  const { walletPublicKey } = useAuth();
  const { walletDetails, isWalletDetailsLoading, walletDetailsError } =
    useWallet();

  const sections = useMemo(() => {
    const outgoing = (walletDetails?.recentTransfers.outgoing ?? []).map(
      (transfer: WalletTransfer) => ({ transfer, type: 'sent' as const }),
    );
    const incoming = (walletDetails?.recentTransfers.incoming ?? []).map(
      (transfer: WalletTransfer) => ({ transfer, type: 'received' as const }),
    );

    const merged = [...outgoing, ...incoming]
      .map(({ transfer, type }) => {
        const timestampMs = transfer.metadata?.blockTimestamp
          ? new Date(transfer.metadata.blockTimestamp).getTime()
          : 0;
        const asset = transfer.asset ?? 'ETH';
        const value = transfer.value ?? 0;
        const counterParty =
          type === 'sent'
            ? transfer.to ?? 'Unknown address'
            : transfer.from ?? 'Unknown address';

        return {
          id:
            transfer.hash ?? `${type}-${counterParty}-${timestampMs}-${asset}`,
          title: type === 'sent' ? `Sent ${asset}` : `Received ${asset}`,
          subtitle: `${type === 'sent' ? 'To' : 'From'}: ${
            counterParty.startsWith('0x')
              ? shortenAddress(counterParty)
              : counterParty
          }`,
          amount: `${type === 'sent' ? '-' : '+'} ${value.toFixed(6)} ${asset}`,
          time:
            timestampMs > 0
              ? new Date(timestampMs).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '--:--',
          type,
          icon: type === 'sent' ? '↗' : '↙',
          bgColor: type === 'sent' ? '#7A122D' : '#0F4F35',
          timestampMs,
        } satisfies UiTransaction;
      })
      .sort((a, b) => b.timestampMs - a.timestampMs);

    return merged.reduce<{ title: string; items: UiTransaction[] }[]>(
      (acc, transaction) => {
        const title = getSectionTitle(transaction.timestampMs);
        const existingSection = acc.find(section => section.title === title);

        if (existingSection) {
          existingSection.items.push(transaction);
          return acc;
        }

        acc.push({ title, items: [transaction] });
        return acc;
      },
      [],
    );
  }, [walletDetails]);

  const isEmpty = sections.length === 0;
  const walletDisplay = walletPublicKey
    ? shortenAddress(walletPublicKey)
    : 'your wallet';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.darkBackground}
      />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={styles.scrollContainer}
      >
        <View style={styles.headerBar}>
          <Pressable
            style={styles.iconButton}
            hitSlop={styles.hitSlop}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.iconText}>{'\u2190'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Activity</Text>
          <Pressable style={styles.iconButton} hitSlop={styles.hitSlop}>
            <Text style={styles.iconText}>⋮</Text>
          </Pressable>
        </View>

        <View style={styles.searchBar}>
          <Text style={styles.searchLabel}>
            {isWalletDetailsLoading
              ? 'Loading recent transactions...'
              : walletDetailsError
              ? 'Unable to refresh transactions right now.'
              : `Latest activity for ${walletDisplay}`}
          </Text>
        </View>

        {isEmpty && !isWalletDetailsLoading ? (
          <View style={styles.emptyStateCard}>
            <Text style={styles.emptyStateEmoji}>🧾</Text>
            <Text style={styles.emptyStateTitle}>No transactions yet</Text>
            <Text style={styles.emptyStateDescription}>
              Your on-chain activity will appear here once you send or receive
              assets.
            </Text>
          </View>
        ) : null}

        {sections.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map(item => (
              <View key={item.id} style={styles.transactionCard}>
                <View
                  style={[styles.iconCircle, { backgroundColor: item.bgColor }]}
                >
                  <Text style={styles.iconSymbol}>{item.icon}</Text>
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>{item.title}</Text>
                  <Text style={styles.transactionSubtitle}>
                    {item.subtitle}
                  </Text>
                </View>
                <View style={styles.amountBlock}>
                  <Text
                    style={[
                      styles.amount,
                      item.type === 'received'
                        ? styles.amountPositive
                        : styles.amountNegative,
                    ]}
                  >
                    {item.amount}
                  </Text>
                  <Text style={styles.time}>{item.time}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
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
    paddingBottom: 40,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#06060A',
  },
  hitSlop: { top: 10, bottom: 10, left: 10, right: 10 },
  iconText: {
    color: Colors.whiteText,
    fontSize: 18,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: Colors.whiteText,
    fontSize: 20,
    fontWeight: '700',
  },
  searchBar: {
    height: 48,
    borderRadius: 16,
    backgroundColor: '#1F1F25',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchLabel: {
    color: Colors.lightGreyText,
  },
  emptyStateCard: {
    backgroundColor: '#0F0F14',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1F1F25',
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyStateEmoji: {
    fontSize: 28,
    marginBottom: 10,
  },
  emptyStateTitle: {
    color: Colors.whiteText,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptyStateDescription: {
    color: Colors.lightGreyText,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: Colors.lightGreyText,
    marginBottom: 12,
    letterSpacing: 1,
    fontSize: 12,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F0F14',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconSymbol: {
    color: Colors.whiteText,
    fontSize: 18,
  },
  transactionInfo: {
    flex: 2,
  },
  transactionTitle: {
    color: Colors.whiteText,
    fontSize: 16,
    fontWeight: '600',
  },
  transactionSubtitle: {
    color: Colors.lightGreyText,
    fontSize: 12,
    marginTop: 4,
  },
  amountBlock: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
  amountPositive: {
    color: Colors.positiveGreen,
  },
  amountNegative: {
    color: Colors.negativeRed,
  },
  time: {
    color: Colors.lightGreyText,
    fontSize: 11,
    marginTop: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#14141A',
    marginBottom: 6,
  },
  navLabel: {
    color: Colors.lightGreyText,
    fontSize: 10,
  },
});

export default TransactionHistoryScreen;
