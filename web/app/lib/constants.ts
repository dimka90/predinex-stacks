/**
 * Protocol Constants - Centralized values for the Predinex Protocol.
 */

export const STX_DECIMALS = 6;
export const STX_MICRO_STX = 1_000_000;

export const PROTOCOL_CONSTANTS = {
  // Contract Limits
  MIN_BET_AMOUNT: 1_000_000,    // 1 STX in micro
  MAX_BET_AMOUNT: 1000_000_000, // 1000 STX in micro
  MIN_POOL_DURATION: 3600,      // 1 hour (seconds)
  MAX_POOL_DURATION: 31536000,  // 1 year (seconds)

  // Fee Structure (BPS = 1/100th of a percent)
  CREATOR_FEE_BPS: 200,  // 2%
  ORACLE_FEE_BPS: 100,   // 1%
  TREASURY_FEE_BPS: 100, // 1%

  // Oracle Reputation
  INITIAL_REPUTATION: 500,
  MAX_REPUTATION: 1000,
  SLASH_PERCENTAGE: 10, // 10%
  ORACLE_TIMEOUT_BLOCKS: 144, // ~24 hours
  MAX_ORACLE_DEVIATION_PCT: 5,

  // UI Limits
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_OUTCOME_LENGTH: 32,

  // Refresh Intervals
  MARKET_REFRESH_MS: 30000, // 30 seconds
  BALANCE_REFRESH_MS: 60000, // 1 minute
} as const;

export const CONTRACT_ADDRESS = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
export const CONTRACT_NAME = "predinex-pool";

export const STACKS_EXPLORER_BASE = "https://explorer.hiro.so";
export const DEFAULT_NETWORK = "mainnet";

export function getExplorerTxUrl(txId: string, network = "mainnet"): string {
  return `${STACKS_EXPLORER_BASE}/txid/${txId}?chain=${network}`;
}

export const STACKS_API_BASE_URL = "https://stacks-node-api.testnet.stacks.co";

export const NETWORK_CONFIG = {
  mainnet: {
    explorerUrl: "https://explorer.hiro.so",
    networkId: "mainnet",
    apiUrl: "https://stacks-node-api.mainnet.stacks.co"
  },
  testnet: {
    explorerUrl: "https://explorer.hiro.so",
    networkId: "testnet",
    apiUrl: "https://stacks-node-api.testnet.stacks.co"
  }
};

export const UI_DESIGN = {
  GLASS_OPACITY: '0.4',
  BLUR_STRENGTH: 'xl',
  ANIMATION_DURATION: 300,
  BORDER_OPACITY: '0.1',
} as const;

export const ICON_CLASS = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8"
};
