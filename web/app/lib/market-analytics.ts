/**
 * Market analytics service for computing pool metrics.
 * Provides computed analytics for dashboard and market detail views.
 */

import { PoolAnalytics } from './market-types';

/**
 * Calculates the implied probability for an outcome.
 * @param totalA Total bets on outcome A
 * @param totalB Total bets on outcome B
 * @returns Probability of outcome A (0-1)
 */
export function calculateProbability(totalA: number, totalB: number): number {
    const total = totalA + totalB;
    if (total === 0) return 0.5; // Default 50/50 when no bets
    return totalA / total;
}

/**
 * Calculates the potential payout for a bet.
 * @param betAmount Amount being bet
 * @param totalOnSide Total bets on the chosen side
 * @param totalPool Total pool value
 */
export function calculatePayout(betAmount: number, totalOnSide: number, totalPool: number): number {
    if (totalOnSide === 0) return totalPool;
    return (betAmount / totalOnSide) * totalPool;
}

/**
 * Calculates return on investment percentage.
 */
export function calculateROI(payout: number, investment: number): number {
    if (investment === 0) return 0;
    return ((payout - investment) / investment) * 100;
}

/**
 * Calculates the Kelly criterion optimal bet size.
 * @param probability Estimated probability of winning
 * @param odds Decimal odds offered
 * @returns Optimal fraction of bankroll to bet
 */
export function kellyCriterion(probability: number, odds: number): number {
    const q = 1 - probability;
    const kelly = (probability * odds - q) / odds;
    return Math.max(0, Math.min(kelly, 0.25)); // Cap at 25%
}

/**
 * Generates mock analytics for a pool (for development).
 */
export function generateMockAnalytics(poolId: number): PoolAnalytics {
    return {
        poolId,
        uniqueBettors: Math.floor(Math.random() * 100) + 5,
        totalTransactions: Math.floor(Math.random() * 500) + 20,
        averageBetSize: Math.floor(Math.random() * 50) + 10,
        largestBet: Math.floor(Math.random() * 500) + 100,
        volumeChange24h: (Math.random() - 0.3) * 40,
        probabilityHistory: Array.from({ length: 24 }, (_, i) => ({
            timestamp: Date.now() - (24 - i) * 3600000,
            oddsA: 0.5 + (Math.random() - 0.5) * 0.3,
        })),
    };
}
