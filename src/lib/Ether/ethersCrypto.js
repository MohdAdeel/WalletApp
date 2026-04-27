/**
 * Registers secure random (and optional crypto) for ethers in React Native.
 * Must be imported before any code that uses ethers.Wallet.createRandom().
 */
import { ethers } from 'ethers';
import crypto from 'react-native-quick-crypto';

ethers.randomBytes.register(length => {
  return new Uint8Array(crypto.randomBytes(length));
});

// Optional: register other crypto for faster wallet/derivation (recommended)
ethers.pbkdf2.register((password, salt, iterations, keylen, algo) => {
  const result = crypto.pbkdf2Sync(password, salt, iterations, keylen, algo);
  return ethers.hexlify(new Uint8Array(result));
});
