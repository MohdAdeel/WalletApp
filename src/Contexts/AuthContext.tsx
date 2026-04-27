import React, {
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback,
  createContext,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WALLET_PUBLIC_KEY_STORAGE_KEY = '@wallet_public_key';

type AuthContextValue = {
  walletPublicKey: string | null;
  walletPrivateKey: string | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  setWalletCredentials: (publicKey: string, privateKey: string) => Promise<void>;
  clearWalletCredentials: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [walletPublicKey, setWalletPublicKeyState] = useState<string | null>(
    null,
  );
  const [walletPrivateKey, setWalletPrivateKeyState] = useState<string | null>(
    null,
  );
  const [isHydrating, setIsHydrating] = useState(true);
  const isStorageAvailable =
    typeof AsyncStorage?.getItem === 'function' &&
    typeof AsyncStorage?.setItem === 'function' &&
    typeof AsyncStorage?.removeItem === 'function';

  useEffect(() => {
    const hydrateAuthState = async () => {
      if (!isStorageAvailable) {
        console.log(
          'AsyncStorage native module is unavailable. Using session-only auth state.',
        );
        setIsHydrating(false);
        return;
      }

      try {
        const storedPublicKey = await AsyncStorage.getItem(
          WALLET_PUBLIC_KEY_STORAGE_KEY,
        );
        setWalletPublicKeyState(storedPublicKey);
      } catch (error) {
        console.log('Failed to hydrate auth state', error);
      } finally {
        setIsHydrating(false);
      }
    };

    hydrateAuthState();
  }, [isStorageAvailable]);

  const setWalletCredentials = useCallback(
    async (publicKey: string, privateKey: string) => {
      if (isStorageAvailable) {
        await AsyncStorage.setItem(WALLET_PUBLIC_KEY_STORAGE_KEY, publicKey);
      }
      setWalletPublicKeyState(publicKey);
      setWalletPrivateKeyState(privateKey);
    },
    [isStorageAvailable],
  );

  const clearWalletCredentials = useCallback(async () => {
    if (isStorageAvailable) {
      await AsyncStorage.removeItem(WALLET_PUBLIC_KEY_STORAGE_KEY);
    }
    setWalletPublicKeyState(null);
    setWalletPrivateKeyState(null);
  }, [isStorageAvailable]);

  const value = useMemo(
    () => ({
      walletPublicKey,
      walletPrivateKey,
      isAuthenticated: Boolean(walletPublicKey),
      isHydrating,
      setWalletCredentials,
      clearWalletCredentials,
    }),
    [
      walletPublicKey,
      walletPrivateKey,
      isHydrating,
      setWalletCredentials,
      clearWalletCredentials,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
