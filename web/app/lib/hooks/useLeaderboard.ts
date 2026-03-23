'use client';

import { useMemo } from 'react';

export interface LeaderboardEntry {
    rank: number;
    address: string;
    points: number;
    pnl: number;
    winRate: number;
    isUser?: boolean;
}

export function useLeaderboard() {
    // In a real app, this would fetch from an API/Indexer
    const data: LeaderboardEntry[] = useMemo(() => [
        { rank: 1, address: 'SP3...X7Y2', points: 12500, pnl: 4500, winRate: 72 },
        { rank: 2, address: 'SP2...A9B1', points: 10200, pnl: 3800, winRate: 68 },
        { rank: 3, address: 'SP1...K4J0', points: 9800, pnl: 3200, winRate: 65 },
        { rank: 4, address: 'SP4...L5M6', points: 8500, pnl: 2900, winRate: 61 },
        { rank: 5, address: 'SP9...Q8R7', points: 7200, pnl: 2100, winRate: 58 },
    ], []);

    return {
        leaderboard: data,
        isLoading: false
    };
}
