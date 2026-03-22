'use client';

import { useQuery } from '@tanstack/react-query';
import { getPoolCount, getTotalVolume } from '../stacks-api';
import { useState, useEffect } from 'react';

export function useRealTimeStats() {
    const { data: poolCount, isLoading: loadingPools } = useQuery({
        queryKey: ['poolCount'],
        queryFn: getPoolCount,
        refetchInterval: 60000,
    });

    const { data: totalVolume, isLoading: loadingVolume } = useQuery({
        queryKey: ['totalVolume'],
        queryFn: getTotalVolume,
        refetchInterval: 60000,
    });

    // Mock active users for now
    const [activeUsers, setActiveUsers] = useState(1050);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveUsers(prev => prev + Math.floor(Math.random() * 5) - 2);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    return {
        stats: {
            poolCount: poolCount || 0,
            totalVolume: (Number(totalVolume) || 0) / 1_000_000, // Convert from microSTX
            activeUsers,
        },
        isLoading: loadingPools || loadingVolume,
    };
}
