import { formatEther } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { getDefaultProvider } from '../lib/Ether/EtherConfig';

type RawTokenBalance = {
  contractAddress: string;
  tokenBalance: string;
};

type TokenMetadata = {
  symbol?: string;
  name?: string;
  decimals?: number;
};

export type WalletTransfer = {
  hash?: string;
  from?: string;
  to?: string;
  value?: number;
  asset?: string;
  category?: string;
  metadata?: {
    blockTimestamp?: string;
  };
};

export type WalletToken = {
  contractAddress: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: number;
};

export type WalletDetails = {
  publicKey: string;
  chainId: number;
  latestBlock: number;
  balanceWei: string;
  balanceEth: string;
  transactionCount: number;
  isContractAddress: boolean;
  ensName: string | null;
  feeData: {
    gasPriceWei: string | null;
    maxFeePerGasWei: string | null;
    maxPriorityFeePerGasWei: string | null;
  };
  recentTransfers: {
    incoming: WalletTransfer[];
    outgoing: WalletTransfer[];
  };
  tokenPortfolio: {
    totalTrackedTokens: number;
    topTokens: WalletToken[];
  };
};

const hexToDecimal = (hexValue: string) => {
  if (!hexValue || hexValue === '0x') {
    return 0;
  }
  return Number(BigInt(hexValue));
};

export const useGetWalletDetails = (walletPublicKey: string | null) => {
  const [walletDetails, setWalletDetails] = useState<WalletDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWalletDetails = useCallback(async () => {
    if (!walletPublicKey) {
      setWalletDetails(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const provider = getDefaultProvider();
    const providerWithSend = provider as typeof provider & {
      send: (method: string, params: unknown[]) => Promise<any>;
    };

    try {
      const [network, balanceWei, txCount, code, ensName, latestBlock, feeData] =
        await Promise.all([
          provider.getNetwork(),
          provider.getBalance(walletPublicKey),
          provider.getTransactionCount(walletPublicKey),
          provider.getCode(walletPublicKey),
          provider.lookupAddress(walletPublicKey),
          provider.getBlockNumber(),
          provider.getFeeData(),
        ]);

      const [incomingTransfers, outgoingTransfers, tokenBalancesResponse] =
        await Promise.all([
          providerWithSend.send('alchemy_getAssetTransfers', [
            {
              fromBlock: '0x0',
              toAddress: walletPublicKey,
              category: ['external', 'erc20', 'erc721', 'erc1155'],
              withMetadata: true,
              excludeZeroValue: true,
              maxCount: '0x5',
              order: 'desc',
            },
          ]),
          providerWithSend.send('alchemy_getAssetTransfers', [
            {
              fromBlock: '0x0',
              fromAddress: walletPublicKey,
              category: ['external', 'erc20', 'erc721', 'erc1155'],
              withMetadata: true,
              excludeZeroValue: true,
              maxCount: '0x5',
              order: 'desc',
            },
          ]),
          providerWithSend.send('alchemy_getTokenBalances', [
            walletPublicKey,
            'erc20',
          ]),
        ]);

      const nonZeroTokenBalances = (tokenBalancesResponse?.tokenBalances ?? [])
        .filter(
          (token: RawTokenBalance) =>
            token.tokenBalance && token.tokenBalance !== '0x0',
        )
        .slice(0, 5);

      const tokenMetadataSettled = await Promise.allSettled(
        nonZeroTokenBalances.map((token: RawTokenBalance) =>
          providerWithSend.send('alchemy_getTokenMetadata', [token.contractAddress]),
        ),
      );

      const topTokens = nonZeroTokenBalances.map(
        (token: RawTokenBalance, index: number) => {
          const metadataResult = tokenMetadataSettled[index];
          const metadata: TokenMetadata | null =
            metadataResult?.status === 'fulfilled' ? metadataResult.value : null;
          const decimals = metadata?.decimals ?? 18;
          const rawBalance = hexToDecimal(token.tokenBalance);
          const normalizedBalance = rawBalance / 10 ** decimals;

          return {
            contractAddress: token.contractAddress,
            symbol: metadata?.symbol ?? 'UNKNOWN',
            name: metadata?.name ?? 'Unknown Token',
            decimals,
            balance: normalizedBalance,
          };
        },
      );

      const nextDetails: WalletDetails = {
        publicKey: walletPublicKey,
        chainId: Number(network.chainId),
        latestBlock,
        balanceWei: balanceWei.toString(),
        balanceEth: formatEther(balanceWei),
        transactionCount: txCount,
        isContractAddress: code !== '0x',
        ensName: ensName ?? null,
        feeData: {
          gasPriceWei: feeData.gasPrice?.toString() ?? null,
          maxFeePerGasWei: feeData.maxFeePerGas?.toString() ?? null,
          maxPriorityFeePerGasWei: feeData.maxPriorityFeePerGas?.toString() ?? null,
        },
        recentTransfers: {
          incoming: incomingTransfers?.transfers ?? [],
          outgoing: outgoingTransfers?.transfers ?? [],
        },
        tokenPortfolio: {
          totalTrackedTokens: nonZeroTokenBalances.length,
          topTokens,
        },
      };

      setWalletDetails(nextDetails);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : 'Failed to fetch wallet details.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [walletPublicKey]);

  useEffect(() => {
    fetchWalletDetails();
  }, [fetchWalletDetails]);

  return {
    walletDetails,
    isLoading,
    error,
    refetch: fetchWalletDetails,
  };
};

