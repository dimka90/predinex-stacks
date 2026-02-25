/**
 * Application Constants
 * Centralized configuration for the Predinex application
 */

// Contract Configuration
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'SP2WWKKF25SED3K5P6ETY7MDDNBQH50GPSP8EJM8N';
export const CONTRACT_NAME = process.env.NEXT_PUBLIC_CONTRACT_NAME || 'predinex-pool-1771407097278';

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

// Icon Styles
export const ICON_CLASS = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
} as const;

// Application URLs
export const APP_CONFIG = {
  name: 'Predinex',
  description: 'Decentralized Prediction Market on Stacks',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://predinex.app',
  logo: '/logo.png',
} as const;

// Stacks API Base URL (derived from current network)
export const STACKS_API_BASE_URL = NETWORK_CONFIG[DEFAULT_NETWORK].coreApiUrl;

// Feature Flags
export const FEATURES = {
  multiWalletSupport: true,
  networkSwitching: true,
  sessionPersistence: true,
  errorRecovery: true,
  balanceRefresh: true,
  transactionTracking: true,
} as const;