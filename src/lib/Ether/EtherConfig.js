import { JsonRpcProvider } from 'ethers';

/**
 * Ethers.js configuration for the wallet app.
 * Central place for RPC endpoints, chain IDs, and provider setup.
 */

// Default chain IDs
export const CHAIN_IDS = {
  MAINNET: 1,
  SEPOLIA: 11155111,
  POLYGON: 137,
  ARBITRUM_ONE: 42161,
};

// RPC URLs (use your own keys in production via env)
const RPC_URLS = {
  [CHAIN_IDS.MAINNET]:
    'https://eth-sepolia.g.alchemy.com/v2/tIkeqgR5Hl1aSBiRgtG77',
  [CHAIN_IDS.SEPOLIA]: 'https://rpc.sepolia.org',
  [CHAIN_IDS.POLYGON]: 'https://polygon.llamarpc.com',
  [CHAIN_IDS.ARBITRUM_ONE]: 'https://arb1.arbitrum.io/rpc',
};

// Default chain for the app
export const DEFAULT_CHAIN_ID = CHAIN_IDS.MAINNET;

// Cached providers per chain
const providerCache = {};

/**
 * Get a JsonRpcProvider for the given chain ID.
 * @param {number} chainId - Chain ID (defaults to DEFAULT_CHAIN_ID)
 * @returns {JsonRpcProvider}
 */
export function getProvider(chainId = DEFAULT_CHAIN_ID) {
  if (providerCache[chainId]) {
    return providerCache[chainId];
  }
  const url = RPC_URLS[chainId] || RPC_URLS[DEFAULT_CHAIN_ID];
  const provider = new JsonRpcProvider(url);
  providerCache[chainId] = provider;
  return provider;
}

/**
 * Get the default provider (mainnet).
 * @returns {JsonRpcProvider}
 */
export function getDefaultProvider() {
  return getProvider(DEFAULT_CHAIN_ID);
}

export default {
  CHAIN_IDS,
  DEFAULT_CHAIN_ID,
  getProvider,
  getDefaultProvider,
};
