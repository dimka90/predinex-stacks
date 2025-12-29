'use client';

import { useState, useCallback } from 'react';
import {
  Dispute,
  DisputeVote,
  DisputeStats,
  DisputeConfig,
  DEFAULT_DISPUTE_CONFIG,
  calculateDisputeBond,
  isDisputeEligible,
  canVote,
  resolveDispute,
  calculateVotingPower,
} from '../dispute-system';

export function useDisputes() {
  const [config, setConfig] = useState<DisputeConfig>(DEFAULT_DISPUTE_CONFIG);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [votes, setVotes] = useState<DisputeVote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDispute = useCallback(
    (
      poolId: number,
      disputer: string,
      reason: string,
      poolValue: number,
      evidence?: string
    ) => {
      try {
        const existingDisputes = disputes.filter(d => d.poolId === poolId).length;

        if (!isDisputeEligible(poolValue, existingDisputes, config)) {
          throw new Error('Dispute not eligible for this pool');
        }

        const bond = calculateDisputeBond(poolValue, config);
        const dispute: Dispute = {
          id: `dispute-${Date.now()}`,
          poolId,
          disputer,
          reason,
          evidence,
          bond,
          status: 'active',
          createdAt: Date.now(),
          votingDeadline: Date.now() + config.votingWindowBlocks * 60000, // Simplified
        };

        setDisputes(prev => [...prev, dispute]);
        return dispute;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create dispute';
        setError(message);
        throw err;
      }
    },
    [disputes, config]
  );

  const addVote = useCallback(
    (disputeId: string, voter: string, vote: boolean, voterBalance: number) => {
      try {
        if (!canVote(voterBalance, config)) {
          throw new Error('Insufficient balance to vote');
        }

        const dispute = disputes.find(d => d.id === disputeId);
        if (!dispute) throw new Error('Dispute not found');

        const votingPower = calculateVotingPower(voterBalance);
        const voteRecord: DisputeVote = {
          id: `vote-${Date.now()}`,
          disputeId,
          voter,
          vote,
          votingPower,
          votedAt: Date.now(),
        };

        setVotes(prev => [...prev, voteRecord]);
        return voteRecord;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add vote';
        setError(message);
        throw err;
      }
    },
    [disputes, config]
  );

  const getDisputeVotes = useCallback(
    (disputeId: string) => {
      return votes.filter(v => v.disputeId === disputeId);
    },
    [votes]
  );

  const getDisputeStats = useCallback(
    (disputeId: string) => {
      const disputeVotes = getDisputeVotes(disputeId);
      const votesFor = disputeVotes.filter(v => v.vote).reduce((sum, v) => sum + v.votingPower, 0);
      const votesAgainst = disputeVotes.filter(v => !v.vote).reduce((sum, v) => sum + v.votingPower, 0);

      return {
        totalVotes: disputeVotes.length,
        votesFor,
        votesAgainst,
        totalVotingPower: votesFor + votesAgainst,
      };
    },
    [getDisputeVotes]
  );

  const resolveDisputeVoting = useCallback(
    (disputeId: string) => {
      try {
        const dispute = disputes.find(d => d.id === disputeId);
        if (!dispute) throw new Error('Dispute not found');

        const stats = getDisputeStats(disputeId);
        const upheld = resolveDispute(stats.votesFor, stats.votesAgainst);

        setDisputes(prev =>
          prev.map(d =>
            d.id === disputeId
              ? {
                  ...d,
                  status: 'resolved',
                  resolution: upheld,
                  resolvedAt: Date.now(),
                }
              : d
          )
        );

        return upheld;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to resolve dispute';
        setError(message);
        throw err;
      }
    },
    [disputes, getDisputeStats]
  );

  const getPoolDisputes = useCallback(
    (poolId: number) => {
      return disputes.filter(d => d.poolId === poolId);
    },
    [disputes]
  );

  const getOverallStats = useCallback((): DisputeStats => {
    const totalDisputes = disputes.length;
    const activeDisputes = disputes.filter(d => d.status === 'active' || d.status === 'voting').length;
    const resolvedDisputes = disputes.filter(d => d.status === 'resolved').length;
    const upheldDisputes = disputes.filter(d => d.resolution === true).length;
    const rejectedDisputes = disputes.filter(d => d.resolution === false).length;
    const totalBondLocked = disputes
      .filter(d => d.status !== 'resolved')
      .reduce((sum, d) => sum + d.bond, 0);
    const totalBondReleased = disputes
      .filter(d => d.status === 'resolved')
      .reduce((sum, d) => sum + d.bond, 0);

    return {
      totalDisputes,
      activeDisputes,
      resolvedDisputes,
      upheldDisputes,
      rejectedDisputes,
      totalBondLocked,
      totalBondReleased,
    };
  }, [disputes]);

  const updateConfig = useCallback((newConfig: Partial<DisputeConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const hasUserVoted = useCallback(
    (disputeId: string, voter: string) => {
      return votes.some(v => v.disputeId === disputeId && v.voter === voter);
    },
    [votes]
  );

  return {
    config,
    disputes,
    votes,
    isLoading,
    error,
    createDispute,
    addVote,
    getDisputeVotes,
    getDisputeStats,
    resolveDisputeVoting,
    getPoolDisputes,
    getOverallStats,
    updateConfig,
    hasUserVoted,
  };
}
