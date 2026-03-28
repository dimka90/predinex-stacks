'use client';

import { useMemo } from 'react';

/**
 * useMarketStatus - Determines the human-readable status and variant for a market.
 */
export function useMarketStatus(expiryDate: number) {
    const statusInfo = useMemo(() => {
        const now = Date.now();
        const diff = expiryDate - now;

        if (diff <= 0) {
            return {
                label: 'Expired',
                variant: 'error' as const,
                isExpired: true,
                isEndingSoon: false,
            };
        }

        if (diff < 1000 * 60 * 60 * 24) { // Less than 24h
            return {
                label: 'Ending Soon',
                variant: 'warning' as const,
                isExpired: false,
                isEndingSoon: true,
            };
        }

        return {
            label: 'Active',
            variant: 'success' as const,
            isExpired: false,
            isEndingSoon: false,
        };
    }, [expiryDate]);

    return statusInfo;
}
