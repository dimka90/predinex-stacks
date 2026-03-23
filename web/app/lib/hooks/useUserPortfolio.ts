'use client';

import { useQuery } from '@tanstack/react-query';
import { getPoolCount, getUserBet, getPool, Pool, UserBetData } from '../stacks-api';
import { useMemo } from 'react';

export interface UserPosition extends UserBetData {
    poolId: number;
    pool: Pool;
    pnl: number;
    status: 'active' | 'won' | 'lost' | 'pending';
}

export function useUserPortfolio(userAddress: string | undefined) {
    const { data: poolCount = 0 } = useQuery({
        queryKey: ['poolCount'],
        queryFn: getPoolCount,
        enabled: !!userAddress,
    });

    const { data: portfolio = [], isLoading } = useQuery({
        queryKey: ['userPortfolio', userAddress, poolCount],
        queryFn: async () => {
            if (!userAddress) return [];

            const positions: UserPosition[] = [];

            // In a production app, we'd use an indexer. 
            // For now, we iterate through recent pools (last 50 for performance).
            const startId = Math.max(0, poolCount - 50);

            for (let i = poolCount - 1; i >= startId; i--) {
                const bet = await getUserBet(i, userAddress);
                if (bet && bet.totalBet > 0) {
                    const pool = await getPool(i);
                    if (pool) {
                        let status: UserPosition['status'] = 'active';
                        let pnl = 0;

                        if (pool.settled) {
                            const isWinA = pool.winningOutcome === 1 && bet.amountA > 0;
                            const isWinB = pool.winningOutcome === 2 && bet.amountB > 0;

                            if (isWinA || isWinB) {
                                status = 'won';
                                // Simple PNL: assuming 1.9x for simplicity in mock, 
                                // real apps check total pool share.
                                pnl = bet.totalBet * 0.9;
                            } else {
                                status = 'lost';
                                pnl = -bet.totalBet;
                            }
                        }

                        positions.push({
                            ...bet,
                            poolId: i,
                            pool,
                            pnl,
                            status
                        });
                    }
                }
            }
            return positions;
        },
        enabled: !!userAddress && poolCount > 0,
        refetchInterval: 60000,
    });

    const stats = useMemo(() => {
        const totalWagered = portfolio.reduce((sum, pos) => sum + pos.totalBet, 0);
        const netPnL = portfolio.reduce((sum, pos) => sum + pos.pnl, 0);
        const totalWon = portfolio.filter(p => p.status === 'won').reduce((sum, pos) => sum + (pos.totalBet + pos.pnl), 0);

        return {
            totalWagered: totalWagered / 1_000_000,
            totalWon: totalWon / 1_000_000,
            netPnL: netPnL / 1_000_000,
            activeCount: portfolio.filter(p => p.status === 'active').length,
            winRate: portfolio.filter(p => p.status !== 'active').length > 0
                ? (portfolio.filter(p => p.status === 'won').length / portfolio.filter(p => p.status !== 'active').length) * 100
                : 0
        };
    }, [portfolio]);

    return {
        portfolio,
        stats,
        isLoading
    };
}
