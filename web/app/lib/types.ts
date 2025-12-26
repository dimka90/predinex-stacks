/**
 * Centralized type definitions for the application
 * Ensures consistency across components and utilities
 */

/**
 * Pool status enumeration
 */
export enum PoolStatus {
  ACTIVE = 'active',
  SETTLED = 'settled',
  EXPIRED = 'expired',
}

/**
 * Bet status enumeration
 */
export enum BetStatus {
  ACTIVE = 'active',
  WON = 'won',
  LOST = 'lost',
  EXPIRED = 'expired',
}

/**
 * Claim status enumeration
 */
export enum ClaimStatus {
  UNCLAIMED = 'unclaimed',
  CLAIMED = 'claimed',
  NOT_ELIGIBLE = 'not_eligible',
}

/**
 * Transaction status enumeration
 */
export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

/**
 * Pool data structure
 */
export interface PoolData {
  id: number;
  title: string;
  description: string;
  creator: string;
  outcomeA: string;
  outcomeB: string;
  totalA: number;
  totalB: number;
  settled: boolean;
  winningOutcome: number | null;
  expiry: number;
  createdAt: number;
  settledAt?: number;
}

/**
 * User bet data structure
 */
export interface UserBetData {
  poolId: number;
  marketTitle: string;
  outcomeChosen: 'A' | 'B';
  outcomeName: string;
  amountBet: number;
  betTimestamp: number;
  currentOdds: number;
  potentialWinnings: number;
  status: BetStatus;
  claimStatus: ClaimStatus;
  claimableAmount?: number;
}

/**
 * Portfolio data structure
 */
export interface PortfolioData {
  totalBetsPlaced: number;
  totalAmountBet: number;
  totalWinnings: number;
  totalLosses: number;
  netProfit: number;
  winRate: number;
  activeBetsCount: number;
  settledBetsCount: number;
}

/**
 * Transaction data structure
 */
export interface TransactionData {
  id: string;
  type: 'bet' | 'claim' | 'withdrawal' | 'refund';
  poolId: number;
  amount: number;
  status: TransactionStatus;
  timestamp: number;
  txId?: string;
  error?: string;
}

/**
 * Market statistics structure
 */
export interface MarketStats {
  totalPools: number;
  activePools: number;
  settledPools: number;
  totalVolume: number;
  averagePoolVolume: number;
  totalParticipants: number;
}

/**
 * Withdrawal request structure
 */
export interface WithdrawalRequest {
  id: number;
  userId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  requestedAt: number;
  processedAt?: number;
  poolId: number;
}

/**
 * User profile structure
 */
export interface UserProfile {
  address: string;
  portfolio: PortfolioData;
  transactions: TransactionData[];
  withdrawals: WithdrawalRequest[];
  lastUpdated: number;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

/**
 * Pagination data
 */
export interface PaginationData {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationData;
}
