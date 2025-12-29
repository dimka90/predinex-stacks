/**
 * Dispute Resolution System
 * Allows users to challenge pool settlements
 */

export interface Dispute {
  id: string;
  poolId: number;
  disputer: string;
  reason: string;
  evidence?: string;
  bond: number;
  status: 'active' | 'voting' | 'resolved' | 'rejected' | 'expired';
  createdAt: number;
  votingDeadline: number;
  resolvedAt?: number;
  resolution?: boolean; // true = dispute upheld, false = dispute rejected
}

export interface DisputeVote {
  id: string;
  disputeId: string;
  voter: string;
  vote: boolean; // true = uphold dispute, false = reject dispute
  votingPower: number;
  votedAt: number;
}

export interface DisputeStats {
  totalDisputes: number;
  activeDisputes: number;
  resolvedDisputes: number;
  upheldDisputes: number;
  rejectedDisputes: number;
  totalBondLocked: number;
  totalBondReleased: number;
}

export interface DisputeConfig {
  bondPercentage: number; // Percentage of pool value as bond
  votingWindowBlocks: number; // Voting period in blocks
  minVotingPower: number; // Minimum votes needed
  minVoterBalance: number; // Minimum balance to vote
  maxDisputesPerPool: number; // Max disputes per pool
}

// Default dispute configuration
export const DEFAULT_DISPUTE_CONFIG: DisputeConfig = {
  bondPercentage: 5, // 5% of pool value
  votingWindowBlocks: 1008, // 7 days in blocks
  minVotingPower: 10, // 10 votes minimum
  minVoterBalance: 10, // 10 STX minimum to vote
  maxDisputesPerPool: 3, // Max 3 disputes per pool
};

/**
 * Calculate dispute bond amount
 */
export function calculateDisputeBond(poolValue: number, config: DisputeConfig): number {
  return (poolValue * config.bondPercentage) / 100;
}

/**
 * Check if dispute is eligible
 */
export function isDisputeEligible(
  poolValue: number,
  existingDisputes: number,
  config: DisputeConfig
): boolean {
  return existingDisputes < config.maxDisputesPerPool && poolValue > 0;
}

/**
 * Check if voter can vote
 */
export function canVote(voterBalance: number, config: DisputeConfig): boolean {
  return voterBalance >= config.minVoterBalance;
}

/**
 * Calculate dispute resolution
 */
export function resolveDispute(
  votesFor: number,
  votesAgainst: number
): boolean {
  return votesFor > votesAgainst;
}

/**
 * Get dispute status description
 */
export function getDisputeStatusDescription(status: string): string {
  switch (status) {
    case 'active':
      return 'Dispute is active and awaiting votes';
    case 'voting':
      return 'Voting is in progress';
    case 'resolved':
      return 'Dispute has been resolved';
    case 'rejected':
      return 'Dispute was rejected';
    case 'expired':
      return 'Dispute voting period expired';
    default:
      return 'Unknown status';
  }
}

/**
 * Get dispute resolution description
 */
export function getResolutionDescription(upheld: boolean): string {
  return upheld
    ? 'Dispute was upheld - settlement will be reversed'
    : 'Dispute was rejected - settlement stands';
}

/**
 * Format bond amount
 */
export function formatBond(amount: number): string {
  return amount.toFixed(2);
}

/**
 * Calculate voting power
 */
export function calculateVotingPower(voterBalance: number): number {
  // 1 vote per 10 STX, minimum 1
  return Math.max(1, Math.floor(voterBalance / 10));
}

/**
 * Check if voting period is active
 */
export function isVotingActive(votingDeadline: number, currentBlock: number): boolean {
  return currentBlock < votingDeadline;
}

/**
 * Get dispute reason validation
 */
export function isValidDisputeReason(reason: string): boolean {
  return reason.length >= 10 && reason.length <= 500;
}

/**
 * Get dispute reasons
 */
export const DISPUTE_REASONS = [
  'Incorrect settlement outcome',
  'Pool creator acted maliciously',
  'Oracle data was manipulated',
  'Settlement criteria not met',
  'Technical error in resolution',
  'Other (please specify)',
];
