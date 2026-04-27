import {
  Text,
  View,
  TextInput,
  StatusBar,
  Pressable,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../../constants/color';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';

type MarketAsset = {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number | null;
  market_cap_rank: number;
};

const formatPrice = (value: number) => {
  if (value >= 1000) {
    return `$${value.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })}`;
  }

  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  })}`;
};

const normalizeGraphPoints = (values: number[]) => {
  if (values.length === 0) {
    return [];
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) {
    return values.map(() => 44);
  }

  return values.map(value => {
    const normalized = ((value - min) / (max - min)) * 52;
    return 18 + normalized;
  });
};

const MarketScreen = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [assets, setAssets] = useState<MarketAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [selectedBarIndex, setSelectedBarIndex] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const fetchMarketData = async (showLoader = false) => {
      try {
        if (showLoader) {
          setIsLoading(true);
        }
        setError(null);

        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=120&page=1&sparkline=false&price_change_percentage=24h',
        );

        if (!response.ok) {
          throw new Error('Unable to fetch market data right now.');
        }

        const payload = await response.json();
        if (!Array.isArray(payload)) {
          throw new Error('Unexpected market data format.');
        }
        if (isMounted) {
          setAssets(payload as MarketAsset[]);
          setLastUpdatedAt(new Date());
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : 'Failed to load market data.',
          );
        }
      } finally {
        if (isMounted && showLoader) {
          setIsLoading(false);
        }
      }
    };

    fetchMarketData(true);
    intervalId = setInterval(() => {
      void fetchMarketData(false);
    }, 30000);

    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  const filteredAssets = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return assets;
    }

    return assets.filter(
      asset =>
        asset.name.toLowerCase().includes(normalizedQuery) ||
        asset.symbol.toLowerCase().includes(normalizedQuery),
    );
  }, [assets, searchQuery]);

  const graphPoints = useMemo(
    () =>
      normalizeGraphPoints(
        assets.slice(0, 8).map(asset => asset.price_change_percentage_24h ?? 0),
      ),
    [assets],
  );
  const graphAssets = useMemo(() => assets.slice(0, 8), [assets]);
  const selectedGraphAsset = graphAssets[selectedBarIndex] ?? null;

  useEffect(() => {
    if (selectedBarIndex > graphAssets.length - 1) {
      setSelectedBarIndex(0);
    }
  }, [graphAssets.length, selectedBarIndex]);

  const marketPulse = useMemo(() => {
    if (assets.length === 0) {
      return 0;
    }
    const changes = assets
      .slice(0, 20)
      .map(asset => asset.price_change_percentage_24h ?? 0);
    const total = changes.reduce((sum, current) => sum + current, 0);
    return total / changes.length;
  }, [assets]);

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
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.iconText}>{'\u2190'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Market</Text>
          <Pressable style={styles.iconButton}>
            <Text style={styles.iconText}>≡</Text>
          </Pressable>
        </View>

        <View style={styles.searchCard}>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search Bitcoin, ETH, SOL..."
            placeholderTextColor={Colors.lightGreyText}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Market Pulse</Text>
          <Text style={styles.heroSubtitle}>
            Live global market performance across top assets.
          </Text>
          <View style={styles.marketSignal}>
            <View style={styles.signalDot} />
            <Text style={styles.signalLabel}>
              {marketPulse >= 0
                ? 'Market is trending up'
                : 'Market is pulling back'}
            </Text>
            <Text
              style={[
                styles.heroChange,
                marketPulse < 0 && styles.heroChangeNegative,
              ]}
            >
              {marketPulse >= 0 ? '+' : ''}
              {marketPulse.toFixed(2)}%
            </Text>
          </View>
          <View style={styles.graphRow}>
            {graphPoints.map((point, idx) => (
              <Pressable
                key={`${graphAssets[idx]?.id ?? point}-${idx}`}
                onPress={() => setSelectedBarIndex(idx)}
                style={[
                  styles.graphBar,
                  idx === selectedBarIndex && styles.graphBarSelected,
                  {
                    height: point,
                    backgroundColor: Colors.accentBlue,
                    opacity:
                      idx === selectedBarIndex
                        ? 1
                        : Math.max(0.35, Math.min(1, point / 70)),
                  },
                ]}
              />
            ))}
          </View>
          {selectedGraphAsset ? (
            <View style={styles.tooltipCard}>
              <Text style={styles.tooltipTitle}>
                {selectedGraphAsset.name} (
                {selectedGraphAsset.symbol.toUpperCase()})
              </Text>
              <Text style={styles.tooltipChange}>
                24h change:{' '}
                {(selectedGraphAsset.price_change_percentage_24h ?? 0) >= 0
                  ? '+'
                  : ''}
                {(selectedGraphAsset.price_change_percentage_24h ?? 0).toFixed(
                  2,
                )}
                %
              </Text>
              <Text style={styles.tooltipMeta}>
                Cutoff:{' '}
                {lastUpdatedAt
                  ? lastUpdatedAt.toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Refreshing...'}
              </Text>
            </View>
          ) : null}
          <Text style={styles.graphCaption}>
            Top-8 assets by 24h % change • auto refresh every 30s
            {lastUpdatedAt
              ? ` • updated ${lastUpdatedAt.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}`
              : ''}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Live Market Stats</Text>
          {isLoading ? (
            <View style={styles.stateCard}>
              <ActivityIndicator size="small" color={Colors.accentBlue} />
              <Text style={styles.stateText}>Loading market assets...</Text>
            </View>
          ) : null}

          {!isLoading && error ? (
            <View style={styles.stateCard}>
              <Text style={styles.stateText}>{error}</Text>
            </View>
          ) : null}

          {!isLoading && !error && filteredAssets.length === 0 ? (
            <View style={styles.stateCard}>
              <Text style={styles.stateText}>
                No assets found for "{searchQuery}". Try another name or symbol.
              </Text>
            </View>
          ) : null}

          {!isLoading &&
            !error &&
            filteredAssets.map(asset => {
              const change = asset.price_change_percentage_24h ?? 0;
              const isPositive = change >= 0;
              return (
                <View key={asset.id} style={styles.moverCard}>
                  <View style={styles.assetLeft}>
                    <View style={styles.rankBadge}>
                      <Text style={styles.rankBadgeText}>
                        #{asset.market_cap_rank}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.moverName}>{asset.name}</Text>
                      <Text style={styles.moverTicker}>
                        {asset.symbol.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.moverRight}>
                    <Text style={styles.moverPrice}>
                      {formatPrice(asset.current_price)}
                    </Text>
                    <Text
                      style={[
                        styles.moverChange,
                        isPositive ? styles.positive : styles.negative,
                      ]}
                    >
                      {isPositive ? '+' : ''}
                      {change.toFixed(2)}%
                    </Text>
                  </View>
                </View>
              );
            })}
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
    marginBottom: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#06060A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: Colors.whiteText,
    fontSize: 18,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: Colors.whiteText,
    fontSize: 22,
    fontWeight: '700',
  },
  searchCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#202028',
    backgroundColor: '#0E0E14',
    marginBottom: 14,
    paddingHorizontal: 14,
    minHeight: 46,
    justifyContent: 'center',
  },
  searchInput: {
    color: Colors.whiteText,
    fontSize: 14,
  },
  heroCard: {
    backgroundColor: '#101014',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1F1F25',
  },
  heroTitle: {
    color: Colors.whiteText,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  heroSubtitle: {
    color: Colors.lightGreyText,
    fontSize: 12,
    marginBottom: 16,
  },
  marketSignal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  signalDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accentBlue,
    marginRight: 8,
  },
  signalLabel: {
    color: Colors.whiteText,
    marginRight: 8,
  },
  heroChange: {
    color: Colors.accentBlue,
    fontWeight: '700',
  },
  heroChangeNegative: {
    color: Colors.negativeRed,
  },
  graphRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 90,
    marginBottom: 12,
  },
  graphBar: {
    width: 20,
    borderRadius: 6,
  },
  graphBarSelected: {
    borderWidth: 1,
    borderColor: Colors.whiteText,
  },
  tooltipCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#294A74',
    backgroundColor: '#101C2E',
    padding: 10,
    marginBottom: 10,
  },
  tooltipTitle: {
    color: Colors.whiteText,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  tooltipChange: {
    color: Colors.accentBlue,
    fontSize: 12,
    marginBottom: 3,
  },
  tooltipMeta: {
    color: Colors.lightGreyText,
    fontSize: 11,
  },
  graphCaption: {
    color: Colors.lightGreyText,
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: Colors.lightGreyText,
    letterSpacing: 1,
    fontSize: 12,
    marginBottom: 12,
  },
  moverCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F0F14',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  assetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankBadge: {
    borderRadius: 14,
    backgroundColor: '#1A1A23',
    borderWidth: 1,
    borderColor: '#2A2A35',
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginRight: 10,
  },
  rankBadgeText: {
    color: Colors.lightGreyText,
    fontSize: 11,
    fontWeight: '700',
  },
  moverName: {
    color: Colors.whiteText,
    fontWeight: '700',
    fontSize: 16,
  },
  moverTicker: {
    color: Colors.lightGreyText,
    fontSize: 12,
  },
  moverRight: {
    alignItems: 'flex-end',
  },
  moverPrice: {
    color: Colors.whiteText,
    fontWeight: '700',
  },
  moverChange: {
    fontSize: 12,
    marginTop: 4,
  },
  positive: {
    color: Colors.positiveGreen,
  },
  negative: {
    color: Colors.negativeRed,
  },
  stateCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#242430',
    backgroundColor: '#13131A',
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateText: {
    color: Colors.lightGreyText,
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default MarketScreen;
