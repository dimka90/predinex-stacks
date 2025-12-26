// Dashboard utility functions for calculations and data processing

import { UserBet, BetHistory, UserPortfolio, MarketStatistics, PlatformMetrics } from './dashboard-types';
import { PoolData } from './market-types';
import { getCurrentBlockHeight } from './market-utils';

/**
 * Calculate user portfolio metrics from betting data
 */
export function calculatePortfolio(bets: UserBet[]): UserPortfolio {
  const activeBets = bets.filter(bet => bet.status === 'active');
  const settledBets = bets.filter(bet => bet.status !== 'active');
  
  const totalWagered = bets.reduce((sum, bet) => sum + bet.amountBet, 0);
  const totalWinnings = settledBets
    .filter(bet => bet.status === 'won')
    .reduce((sum, bet) => sum + (bet.actualWinnings || 0), 0);
  
  const totalClaimable = bets
    .filter(bet => bet.claimStatus === 'unclaimed')
    .reduce((sum, bet) => sum + (bet.claimableAmount || 0), 0);
  
  const profitLoss = totalWinnings - totalWagered;
  const winRate = settledBets.length > 0 
    ? (settledBets.filter(bet => bet.status === 'won').length / settledBets.length) * 100 
    : 0;

  return {
    totalBets: bets.length,
    activeBets: activeBets.length,
    totalWagered,
    totalWinnings,
    totalClaimable,
    profitLoss,
    winRate
  };
}

/**
 * Calculate potential winnings for a bet
 */
export function calculatePotentialWinnings(
  betAmount: number,
  totalPoolA: number,
  totalPoolB: number,
  chosenOutcome: 'A' | 'B'
): number {
  const totalPool = totalPoolA + totalPoolB;
  if (totalPool === 0) return betAmount; // No other bets yet
  
  const winningPool = chosenOutcome === 'A' ? totalPoolA : totalPoolB;
  const losingPool = chosenOutcome === 'A' ? totalPoolB : totalPoolA;
  
  if (winningPool === 0) return totalPool; // Only bet on this outcome
  
  // Calculate share of losing pool based on proportion of winning pool
  const userShare = betAmount / (winningPool + betAmount);
  const winnings = betAmount + (losingPool * userShare);
  
  return Math.max(0, winnings - betAmount); // Potential profit
}

/**
 * Calculate actual winnings for a settled bet
 */
export function calculateActualWinnings(
  betAmount: number,
  totalPoolA: number,
  totalPoolB: number,
  chosenOutcome: 'A' | 'B',
  winningOutcome: 'A' | 'B'
): number {
  if (chosenOutcome !== winningOutcome) return 0; // Lost bet
  
  const totalPool = totalPoolA + totalPoolB;
  const winningPool = winningOutcome === 'A' ? totalPoolA : totalPoolB;
  
  if (winningPool === 0) return 0; // Should not happen
  
  // Calculate proportional share of total pool
  const userShare = betAmount / winningPool;
  const totalWinnings = totalPool * userShare;
  
  return Math.max(0, totalWinnings);
}

/**
 * Determine if a bet is eligible for claiming
 */
export function isClaimEligible(bet: UserBet): boolean {
  return bet.status === 'won' && bet.claimStatus === 'unclaimed' && (bet.claimableAmount || 0) > 0;
}

/**
 * Calculate profit/loss for a bet
 */
export function calculateBetProfitLoss(bet: BetHistory): number {
  if (bet.status === 'active') return 0;
  if (bet.status === 'won') return (bet.actualWinnings || 0) - bet.amountBet;
  return -bet.amountBet; // Lost or expired
}

/**
 * Process raw pool data into market statistics
 */
export function processMarketStatistics(pools: PoolData[]): MarketStatistics[] {
  const currentBlockHeight = getCurrentBlockHeight();
  
  return pools.map(pool => {
    const totalVolume = Number(pool.totalA + pool.totalB);
    const oddsA = totalVolume > 0 ? Math.round((Number(pool.totalA) / totalVolume) * 100) : 50;
    const oddsB = totalVolume > 0 ? Math.round((Number(pool.totalB) / totalVolume) * 100) : 50;
    
    let status: 'active' | 'settled' | 'expired' = 'active';
    if (pool.settled) {
      status = 'settled';
    } else if (currentBlockHeight > pool.expiry) {
      status = 'expired';
    }
    
    return {
      poolId: pool.poolId,
      title: pool.title,
      description: pool.description,
      totalVolume,
      participantCount: 0, // Will be calculated separately
      currentOdds: { A: oddsA, B: oddsB },
      volumeTrend: [], // Will be calculated from historical data
      createdAt: pool.createdAt,
      expiresAt: pool.expiry,
      status,
      outcomeAName: pool.outcomeAName,
      outcomeBName: pool.outcomeBName,
      creator: pool.creator
    };
  });
}

/**
 * Calculate platform-wide metrics
 */
export function calculatePlatformMetrics(
  pools: PoolData[],
  allBets: UserBet[]
): PlatformMetrics {
  const currentBlockHeight = getCurrentBlockHeight();
  
  const activePools = pools.filter(pool => !pool.settled && currentBlockHeight <= pool.expiry).length;
  const settledPools = pools.filter(pool => pool.settled).length;
  const expiredPools = pools.filter(pool => !pool.settled && currentBlockHeight > pool.expiry).length;
  
  const totalVolume = pools.reduce((sum, pool) => sum + Number(pool.totalA + pool.totalB), 0);
  const averageMarketSize = pools.length > 0 ? totalVolume / pools.length : 0;
  
  // Calculate time-based volumes (mock implementation - would need historical data)
  const dailyVolume = totalVolume * 0.1; // Mock: 10% of total
  const weeklyVolume = totalVolume * 0.3; // Mock: 30% of total
  const monthlyVolume = totalVolume * 0.7; // Mock: 70% of total
  
  const totalBets = allBets.length;
  const totalWinnings = allBets
    .filter(bet => bet.status === 'won')
    .reduce((sum, bet) => sum + (bet.actualWinnings || 0), 0);
  
  // Estimate unique users (would need actual user tracking)
  const totalUsers = Math.ceil(totalBets / 3); // Mock: average 3 bets per user
  
  return {
    totalPools: pools.length,
    activePools,
    settledPools,
    expiredPools,
    totalVolume,
    totalUsers,
    averageMarketSize,
    dailyVolume,
    weeklyVolume,
    monthlyVolume,
    totalBets,
    totalWinnings
  };
}

/**
 * Format currency amounts for display
 */
export function formatCurrency(amount: number, currency: string = 'STX'): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(2)}M ${currency}`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(2)}K ${currency}`;
  } else {
    return `${amount.toLocaleString()} ${currency}`;
  }
}

/**
 * Format percentage values
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format profit/loss with appropriate styling
 */
export function formatProfitLoss(amount: number): { 
  formatted: string; 
  isProfit: boolean; 
  isBreakeven: boolean; 
} {
  const isProfit = amount > 0;
  const isBreakeven = amount === 0;
  const formatted = isBreakeven ? '±0 STX' : `${isProfit ? '+' : ''}${formatCurrency(Math.abs(amount))}`;
  
  return { formatted, isProfit, isBreakeven };
}