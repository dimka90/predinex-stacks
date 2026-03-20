import { useState, useEffect, useMemo } from 'react';
import { Pool, getMarkets } from '../stacks-api';
import { MarketFilters, MarketStatus } from '../types/market';

export interface UseMarketDiscoveryReturn {
  paginatedMarkets: Pool[];
  isLoading: boolean;
  error: string | null;
  filters: MarketFilters;
  pagination: { currentPage: number; totalPages: number };
  setSearch: (search: string) => void;
  setStatusFilter: (status: string) => void;
  setSortBy: (sortBy: string) => void;
  setIsVerifiedOnly: (isVerified: boolean) => void;
  setCategory: (category: string) => void;
  setPage: (page: number) => void;
  retry: () => void;
  filteredMarkets: Pool[];
}

export function useMarketDiscovery(): UseMarketDiscoveryReturn {
  const [allMarkets, setAllMarkets] = useState<Pool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<MarketStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isVerifiedOnly, setIsVerifiedOnly] = useState(false);
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);

  useEffect(() => {
    // Simulate fetch
    getMarkets('all').then(data => {
      setAllMarkets(data);
      setIsLoading(false);
    }).catch(err => {
      setError("Failed to fetch markets");
      setIsLoading(false);
    });
  }, []);

  const filteredMarkets = useMemo(() => {
    let result = allMarkets;
    if (search) {
      result = result.filter(m => m.title.toLowerCase().includes(search.toLowerCase()) || m.description.toLowerCase().includes(search.toLowerCase()));
    }
    if (status !== 'all') {
      result = result.filter(m => m.status === status);
    }
    if (isVerifiedOnly) {
      // For now, let's assume markets with even IDs or some specific ones are "verified" in mock
      result = result.filter((_, idx) => idx % 2 === 0);
    }
    if (category !== 'All') {
      result = result.filter(m => m.category === category);
    }

    // Sort
    const sorted = [...result].sort((a, b) => {
      if (sortBy === 'newest') return b.id - a.id;
      if (sortBy === 'ending_soon') return a.expiry - b.expiry;
      if (sortBy === 'highest_volume') {
        const volA = a.totalA + a.totalB;
        const volB = b.totalA + b.totalB;
        return volB - volA;
      }
      if (sortBy === 'liquidity') return b.totalA - a.totalA;
      return 0;
    });

    return sorted;
  }, [allMarkets, search, status, isVerifiedOnly, category, sortBy]);

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredMarkets.length / ITEMS_PER_PAGE);

  const paginatedMarkets = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredMarkets.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredMarkets, page]);

  return {
    paginatedMarkets,
    isLoading,
    error,
    filters: { search, status, sortBy, isVerifiedOnly, category },
    pagination: { currentPage: page, totalPages },
    setSearch,
    setStatusFilter: setStatus,
    setSortBy,
    setIsVerifiedOnly,
    setCategory,
    setPage,
    retry: () => window.location.reload(),
    filteredMarkets
  };
}
