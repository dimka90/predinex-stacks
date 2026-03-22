export const STX_DECIMALS = 6;
export const MAX_BET_AMOUNT = 1_000_000_000; // 1000 STX in micro
export const MIN_BET_AMOUNT = 1_000_000;     // 1 STX in micro
export const PROTOCOL_FEE_BPS = 100;         // 1%
export const ORACLE_TIMEOUT_BLOCKS = 144; // ~24 hours
export const MAX_ORACLE_DEVIATION_PCT = 5;
export const STACKS_EXPLORER_BASE = "https://explorer.hiro.so";
export function explorerTxUrl(txId: string, network = "mainnet"): string {
  return `${STACKS_EXPLORER_BASE}/txid/${txId}?chain=${network}`;
}

export const ICON_CLASS = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8"
};

export const CONTRACT_ADDRESS = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
export const CONTRACT_NAME = "predinex-pool";
export const DEFAULT_NETWORK = "testnet";

export const STACKS_API_BASE_URL = "https://stacks-node-api.testnet.stacks.co";

export const NETWORK_CONFIG = {
  mainnet: {
    explorerUrl: "https://explorer.hiro.so",
    networkId: "mainnet"
  },
  testnet: {
    explorerUrl: "https://explorer.hiro.so",
    networkId: "testnet"
  }
};
