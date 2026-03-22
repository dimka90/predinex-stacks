'use client';

import { useState, useEffect, useCallback } from 'react';
import { useStacks } from '../components/StacksProvider';
import { ActivityItem, getUserActivity } from '../lib/stacks-api';

export function useActivities(limit: number = 20) {
    const { userData } = useStacks();
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchActivities = useCallback(async () => {
        const address = userData?.profile?.stxAddress?.mainnet || userData?.profile?.stxAddress?.testnet;
        if (!address) {
            setActivities([]);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const data = await getUserActivity(address, limit);
            setActivities(data);
        } catch (err) {
            console.error('Error in useActivities:', err);
            setError('Failed to fetch recent activity.');
        } finally {
            setIsLoading(false);
        }
    }, [userData, limit]);

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    return {
        activities,
        isLoading,
        error,
        refresh: fetchActivities
    };
}
