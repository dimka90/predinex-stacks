// Enhanced types for Market Discovery System

export interface PoolData {
  poolId: number;
  creator: string;
  title: string;
  description: string;
  outcomeAName: string;
  outcomeBName: string;
  totalA: bigint;
  totalB: bigint;
  settled: boolean;
  winningOutcome: number | null;
  createdAt: number;
  settledAt: number | null;
  expiry: number;
}

export interface ProcessedMarket {
  poolId: number;
  title: string;
  description: string;
  outcomeA: string;
  outcomeB: string;
  totalVolume: number;
  oddsA: number;
  oddsB: number;
  status: 'active' | 'settled' | 'expired';
  timeRemaining: number | null;
  createdAt: number;
  creator: string;
  isVerified: boolean;
  category: string;
  expiryDate: number;
}

export interface MarketFilters {
  search: string;
  status: 'all' | 'active' | 'settled' | 'expired';
  sortBy: 'volume' | 'newest' | 'ending-soon';
  isVerifiedOnly: boolean;
  category: string;
  isMyBetsOnly: boolean;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export type MarketStatus = 'active' | 'settled' | 'expired';
export type SortOption = 'volume' | 'newest' | 'ending-soon';
export type StatusFilter = 'all' | 'active' | 'settled' | 'expired';

/** Metadata about how a market was resolved */
export interface ResolutionMetadata {
  resolvedBy: 'creator' | 'oracle' | 'dispute' | 'fallback';
  resolutionTxId: string;
  resolvedAt: number;
  oracleConfidence?: number;
  disputeCount?: number;
}

/** Analytics snapshot for a specific pool */
export interface PoolAnalytics {
  poolId: number;
  uniqueBettors: number;
  totalTransactions: number;
  averageBetSize: number;
  largestBet: number;
  volumeChange24h: number;
  probabilityHistory: { timestamp: number; oddsA: number }[];
}

/** Leaderboard entry for top predictors */
export interface LeaderboardEntry {
  address: string;
  totalBets: number;
  winRate: number;
  totalVolume: number;
  profitLoss: number;
  rank: number;
}