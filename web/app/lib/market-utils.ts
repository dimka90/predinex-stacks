/**
 * Market calculation utilities for the Market Discovery System.
 * These helpers manage odds calculations, status determinations, and formatting for prediction markets.
 */

import { PoolData, ProcessedMarket, MarketStatus } from './market-types';

/**
 * Determines the current status of a market based on its settlement state and expiry time.
 * 
 * @param pool - The raw pool data from the smart contract
 * @param currentBlockHeight - The current block height of the Stacks blockchain
 * @returns 'settled' if resolved, 'expired' if deadline passed, otherwise 'active'
 */
export function calculateMarketStatus(pool: PoolData, currentBlockHeight: number): MarketStatus {
  if (pool.settled) return 'settled';
  if (currentBlockHeight > pool.expiry) return 'expired';
  return 'active';
}

/**
 * Calculates percentage-based odds for two outcomes.
 * Used to visualize market sentiment and potential payouts.
 * 
 * @param totalA - Total micro-STX bet on outcome A
 * @param totalB - Total micro-STX bet on outcome B
 * @returns Object with oddsA and oddsB (defaulting to 50/50 for empty pools)
 */
export function calculateOdds(totalA: bigint, totalB: bigint): { oddsA: number; oddsB: number } {
  const total = Number(totalA + totalB);
  if (total === 0) return { oddsA: 50, oddsB: 50 };

  return {
    oddsA: Math.round((Number(totalA) / total) * 100),
    oddsB: Math.round((Number(totalB) / total) * 100)
  };
}

/**
 * Calculates the number of blocks remaining until market expiry.
 * 
 * @param expiry - The block height at which the market expires
 * @param currentBlockHeight - The current blockchain height
 * @returns Number of blocks remaining, or null if already expired
 */
export function calculateTimeRemaining(expiry: number, currentBlockHeight: number): number | null {
  if (currentBlockHeight >= expiry) return null;
  return expiry - currentBlockHeight;
}

/**
 * Transforms raw smart contract data into a processed format ready for UI consumption.
 * Encapsulates logic for odds, status, and time remaining calculations.
 * 
 * @param pool - The input pool data
 * @param currentBlockHeight - Current blockchain state
 * @returns Enriched market object with computed fields
 */
export function processMarketData(pool: PoolData, currentBlockHeight: number): ProcessedMarket {
  const odds = calculateOdds(pool.totalA, pool.totalB);
  const status = calculateMarketStatus(pool, currentBlockHeight);
  const timeRemaining = calculateTimeRemaining(pool.expiry, currentBlockHeight);
  const totalVolume = Number(pool.totalA + pool.totalB);

  return {
    poolId: pool.poolId,
    title: pool.title,
    description: pool.description,
    outcomeA: pool.outcomeAName,
    outcomeB: pool.outcomeBName,
    totalVolume,
    oddsA: odds.oddsA,
    oddsB: odds.oddsB,
    status,
    timeRemaining,
    createdAt: pool.createdAt,
    creator: pool.creator
  };
}

/**
 * Formats a micro-STX amount into a user-friendly string (e.g., 1.5M STX).
 * 
 * @param amount - The numerical amount in micro-STX
 * @returns Formatted currency string
 */
export function formatSTXAmount(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M STX`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K STX`;
  } else {
    return `${amount.toLocaleString()} STX`;
  }
}

/**
 * Estimates human-readable time remaining based on block count.
 * Assumes a block production time of approximately 10 minutes (Stacks average).
 * 
 * @param blocksRemaining - The number of blocks until expiry
 * @returns Formatted duration string (e.g., "2d", "5h", "45m")
 */
export function formatTimeRemaining(blocksRemaining: number | null): string {
  if (blocksRemaining === null) return 'Expired';
  if (blocksRemaining <= 0) return 'Expired';

  // Assuming ~10 minutes per block on Stacks
  const minutesRemaining = blocksRemaining * 10;

  if (minutesRemaining < 60) {
    return `${minutesRemaining}m`;
  } else if (minutesRemaining < 1440) { // 24 hours
    return `${Math.floor(minutesRemaining / 60)}h`;
  } else {
    return `${Math.floor(minutesRemaining / 1440)}d`;
  }
}

/**
 * Retrieves the current block height of the Stacks network.
 * 
 * @note Currently returns a mock value. In production, this should fetch 
 * data from the Stacks API via stacks-api.ts.
 * 
 * @returns Constant mock block height
 */
export function getCurrentBlockHeight(): number {
  return 150000; // Mock current block height
}