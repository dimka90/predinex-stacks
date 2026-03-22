export type MarketStatus = 'active' | 'settled' | 'expired';

export interface Market {
    id: string;
    title: string;
    description: string;
    status: MarketStatus;
    endDate: string;
    volume: string;
    liquidity: string;
    category?: string;
    creator?: string;
    isVerified?: boolean;
}

export interface MarketFilters {
    search: string;
    status: MarketStatus | 'all';
    sortBy: string;
    category: string | 'all';
    isVerifiedOnly: boolean;
}
