/**
 * Application Constants
 * Centralized configuration for the Predinex application
 */

// Contract Configuration
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9';
export const CONTRACT_NAME = process.env.NEXT_PUBLIC_CONTRACT_NAME || 'predinex-pool';

// Network Configuration
export const NETWORK_CONFIG = {
  mainnet: {
    name: 'Stacks Mainnet',
    coreApiUrl: 'https://api.mainnet.hiro.so',
    explorerUrl: 'https://explorer.hiro.so',
    chainId: 'stacks:mainnet',
  },
  testnet: {
    name: 'Stacks Testnet', 
    coreApiUrl: 'https://api.testnet.hiro.so',
    explorerUrl: 'https://explorer.hiro.so?chain=testnet',
    chainId: 'stacks:testnet',
  },
} as const;

// Default network based on environment
export const DEFAULT_NETWORK = process.env.NODE_ENV === 'production' ? 'mainnet' : 'testnet';

// Wallet Configuration
export const WALLET_CONFIG = {
  sessionTTL: 7 * 24 * 60 * 60 * 1000, // 7 days
  maxInactivityHours: 24,
  autoConnectTimeout: 5000,
  transactionTimeout: 300000, // 5 minutes
} as const;

// Application URLs
export const APP_CONFIG = {
  name: 'Predinex',
  description: 'Decentralized Prediction Market on Stacks',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://predinex.app',
  logo: '/logo.png',
} as const;

// Feature Flags
export const FEATURES = {
  multiWalletSupport: true,
  networkSwitching: true,
  sessionPersistence: true,
  errorRecovery: true,
  balanceRefresh: true,
  transactionTracking: true,
} as const;