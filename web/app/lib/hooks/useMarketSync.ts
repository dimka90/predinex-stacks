'use client';

import { useQuery } from '@tanstack/react-query';
import { getMarkets, Pool } from '../lib/stacks-api';
import { processMarketData } from '../lib/market-utils';
import { ProcessedMarket, MarketFilters } from '../lib/market-types';
import { useState, useMemo } from 'react';

export function useMarketSync(filters: MarketFilters) {
    // Current block height for time calculations
    const [currentBlockHeight] = useState(875000); // In a real app, fetch from Stacks API

    const {
        data: rawMarkets,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: ['markets', filters.status],
        queryFn: () => getMarkets(filters.status === 'all' ? '' : filters.status),
        refetchInterval: 30000, // Refresh every 30 seconds
    });

    const processedMarkets = useMemo(() => {
        if (!rawMarkets) return [];

        let markets = rawMarkets.map(pool => processMarketData(pool as any, currentBlockHeight));

        // Filtering
        if (filters.search) {
            const search = filters.search.toLowerCase();
            markets = markets.filter(m =>
                m.title.toLowerCase().includes(search) ||
                m.description.toLowerCase().includes(search)
            );
        }

        if (filters.isVerifiedOnly) {
            markets = markets.filter(m => m.isVerified);
        }

        if (filters.category !== 'All') {
            markets = markets.filter(m => m.category === filters.category);
        }

        // Sorting
        markets.sort((a, b) => {
            if (filters.sortBy === 'newest') return b.createdAt - a.createdAt;
            if (filters.sortBy === 'volume') return b.totalVolume - a.totalVolume;
            if (filters.sortBy === 'ending-soon') {
                const timeA = a.timeRemaining ?? Number.MAX_SAFE_INTEGER;
                const timeB = b.timeRemaining ?? Number.MAX_SAFE_INTEGER;
                return timeA - timeB;
            }
            return 0;
        });

        return markets;
    }, [rawMarkets, filters, currentBlockHeight]);

    return {
        markets: processedMarkets,
        isLoading,
        isError,
        error: error instanceof Error ? error.message : 'Failed to fetch markets',
        refetch
    };
}
