import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';
import {
  useGetWalletDetails,
  type WalletDetails,
} from '../hooks/useGetWalletDetails';

type WalletContextValue = {
  walletDetails: WalletDetails | null;
  isWalletDetailsLoading: boolean;
  walletDetailsError: string | null;
  refetchWalletDetails: () => Promise<void>;
};

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

type WalletProviderProps = {
  children: React.ReactNode;
};

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const { walletPublicKey } = useAuth();
  const { walletDetails, isLoading, error, refetch } =
    useGetWalletDetails(walletPublicKey);

  const value = useMemo(
    () => ({
      walletDetails,
      isWalletDetailsLoading: isLoading,
      walletDetailsError: error,
      refetchWalletDetails: refetch,
    }),
    [walletDetails, isLoading, error, refetch],
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

