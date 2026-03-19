export const MAX_BET_AMOUNT = 1_000_000_000; // 1000 STX in micro
export const MIN_BET_AMOUNT = 1_000_000;     // 1 STX in micro
export const PROTOCOL_FEE_BPS = 100;         // 1%
export const ORACLE_TIMEOUT_BLOCKS = 144; // ~24 hours
export const MAX_ORACLE_DEVIATION_PCT = 5;
export const STACKS_EXPLORER_BASE = "https://explorer.hiro.so";
export function explorerTxUrl(txId: string, network = "mainnet"): string {
  return `${STACKS_EXPLORER_BASE}/txid/${txId}?chain=${network}`;
}
