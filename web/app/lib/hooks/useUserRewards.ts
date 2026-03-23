'use client';

import { useMemo } from 'react';
import { useUserPortfolio } from './useUserPortfolio';

export interface Mission {
    id: string;
    title: string;
    description: string;
    progress: number; // 0 to 100
    isCompleted: boolean;
    reward: string;
}

export function useUserRewards(stxAddress?: string) {
    const { stats, isLoading } = useUserPortfolio(stxAddress);

    const rewards = useMemo(() => {
        if (!stats) return { totalPoints: 0, multiplier: 1.0, level: 1 };

        // Institutional math for gamification
        const totalPoints = Math.floor(stats.totalWagered * 10 + stats.totalWon * 5);
        const level = Math.floor(Math.sqrt(totalPoints / 100)) + 1;
        const multiplier = 1.0 + (level * 0.1) + (stats.winRate > 50 ? 0.2 : 0);

        return { totalPoints, multiplier, level };
    }, [stats]);

    const missions: Mission[] = useMemo(() => [
        {
            id: 'pioneer',
            title: 'Protocol Pioneer',
            description: 'Place your first bet on the Predinex network',
            progress: stats.totalWagered > 0 ? 100 : 0,
            isCompleted: stats.totalWagered > 0,
            reward: '500 PTS'
        },
        {
            id: 'volume-tier-1',
            title: 'High Stakes: Tier 1',
            description: 'Reach 1,000 STX total volume',
            progress: Math.min(100, (stats.totalWagered / 1000) * 100),
            isCompleted: stats.totalWagered >= 1000,
            reward: '2,500 PTS'
        },
        {
            id: 'win-streak',
            title: 'Oracle Precision',
            description: 'Achieve a 60%+ win rate across 5+ bets',
            progress: stats.activeCount >= 5 ? (stats.winRate >= 60 ? 100 : 50) : 0,
            isCompleted: stats.winRate >= 60 && stats.activeCount >= 5,
            reward: '1.5x Multiplier'
        }
    ], [stats]);

    return {
        rewards,
        missions,
        isLoading
    };
}
