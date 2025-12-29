// Market calculation utilities for Market Discovery System

import { PoolData, ProcessedMarket, MarketStatus } from './market-types';

/**
 * Calculate market status based on settled flag and expiry block height
 */
export function calculateMarketStatus(pool: PoolData, currentBlockHeight: number): MarketStatus {
  if (pool.settled) return 'settled';
  if (currentBlockHeight > pool.expiry) return 'expired';
  return 'active';
}

/**
 * Calculate odds based on total bets on each outcome
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
 * Calculate time remaining in blocks for active markets
 */
export function calculateTimeRemaining(expiry: number, currentBlockHeight: number): number | null {
  if (currentBlockHeight >= expiry) return null;
  return expiry - currentBlockHeight;
}

/**
 * Convert raw pool data to processed market data
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
 * Format STX amount for display
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
 * Format time remaining for display
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
 * Get current block height (mock implementation - in real app would fetch from API)
 */
export function getCurrentBlockHeight(): number {
  // This is a mock implementation
  // In a real application, you would fetch this from the Stacks API
  return 150000; // Mock current block height
}