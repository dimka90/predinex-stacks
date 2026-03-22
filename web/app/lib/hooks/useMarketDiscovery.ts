'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { PoolData, ProcessedMarket, MarketFilters, PaginationState } from '../market-types';
import { useStacks } from '../../components/StacksProvider';
import { fetchAllPools } from '../enhanced-stacks-api';
import { processMarketData, getCurrentBlockHeight } from '../market-utils';
import { useMarketSync } from './useMarketSync';

interface UseMarketDiscoveryState {
  // Data
  allMarkets: ProcessedMarket[];
  filteredMarkets: ProcessedMarket[];
  paginatedMarkets: ProcessedMarket[];

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Filters and pagination
  filters: MarketFilters;
  pagination: PaginationState;

  // Actions
  setSearch: (search: string) => void;
  setStatusFilter: (status: MarketFilters['status']) => void;
  setSortBy: (sortBy: MarketFilters['sortBy']) => void;
  setIsVerifiedOnly: (isVerifiedOnly: boolean) => void;
  setCategory: (category: string) => void;
  setIsMyBetsOnly: (isMyBetsOnly: boolean) => void;
  setPage: (page: number) => void;
  retry: () => void;
}

const ITEMS_PER_PAGE = 12;

export function useMarketDiscovery(): UseMarketDiscoveryState {
  const { userData } = useStacks();
  // Filter state
  const [filters, setFilters] = useState<MarketFilters>({
    search: '',
    status: 'all',
    sortBy: 'newest',
    isVerifiedOnly: false,
    category: 'All',
    isMyBetsOnly: false
  });

  // Use the new sync hook
  const {
    markets: allMarkets,
    isLoading,
    error,
    refetch: retry
  } = useMarketSync(filters);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort markets
  const filteredMarkets = useMemo(() => {
    let filtered = [...allMarkets];

    // Apply search filter
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(market =>
        market.title.toLowerCase().includes(searchLower) ||
        market.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(market => market.status === filters.status);
    }

    // Apply category filter (if implemented on ProcessedMarket, otherwise ignore for now)
    if (filters.category !== 'All') {
      // Assuming market.category exists or will be added. 
      // For now, let's keep it placeholder-ready or filter by title keywords.
      const catLower = filters.category.toLowerCase();
      filtered = filtered.filter(market =>
        market.title.toLowerCase().includes(catLower) ||
        market.description.toLowerCase().includes(catLower)
      );
    }

    // Apply verification filter
    if (filters.isVerifiedOnly) {
      // In a real app, this would check a verification flag. 
      // For demonstration, let's say all markets with > 100 STX volume are "verified".
      filtered = filtered.filter(market => market.totalVolume > 100 * 1_000_000);
    }

    // Apply "My Bets" filter
    if (filters.isMyBetsOnly && userData) {
      const userAddress = userData.profile?.stxAddress?.mainnet || userData.profile?.stxAddress?.testnet;
      // In a real app, this would check against a list of pools the user has bet in.
      // For now, let's say the user has bet in pools they created or pools with even IDs for demo.
      filtered = filtered.filter(market =>
        market.creator === userAddress || market.poolId % 2 === 0
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'volume':
        filtered.sort((a, b) => b.totalVolume - a.totalVolume);
        break;
      case 'newest':
        filtered.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'ending-soon':
        filtered.sort((a, b) => {
          // Active markets first, sorted by time remaining
          if (a.status === 'active' && b.status !== 'active') return -1;
          if (b.status === 'active' && a.status !== 'active') return 1;

          if (a.status === 'active' && b.status === 'active') {
            const aTime = a.timeRemaining ?? Infinity;
            const bTime = b.timeRemaining ?? Infinity;
            return aTime - bTime;
          }

          // For non-active markets, sort by creation time
          return b.createdAt - a.createdAt;
        });
        break;
    }

    return filtered;
  }, [allMarkets, filters, userData]);

  // Calculate pagination
  const pagination = useMemo((): PaginationState => {
    const totalItems = filteredMarkets.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    return {
      currentPage,
      itemsPerPage: ITEMS_PER_PAGE,
      totalItems,
      totalPages
    };
  }, [filteredMarkets.length, currentPage]);

  // Get paginated markets
  const paginatedMarkets = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredMarkets.slice(startIndex, endIndex);
  }, [filteredMarkets, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.search, filters.status, filters.sortBy, filters.isVerifiedOnly, filters.category, filters.isMyBetsOnly]);

  // Action handlers
  const setSearch = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search }));
  }, []);

  const setStatusFilter = useCallback((status: MarketFilters['status']) => {
    setFilters(prev => ({ ...prev, status }));
  }, []);

  const setSortBy = useCallback((sortBy: MarketFilters['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy }));
  }, []);

  const setIsVerifiedOnly = useCallback((isVerifiedOnly: boolean) => {
    setFilters(prev => ({ ...prev, isVerifiedOnly }));
  }, []);

  const setCategory = useCallback((category: string) => {
    setFilters(prev => ({ ...prev, category }));
  }, []);

  const setIsMyBetsOnly = useCallback((isMyBetsOnly: boolean) => {
    setFilters(prev => ({ ...prev, isMyBetsOnly }));
  }, []);

  const setPage = useCallback((page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
    }
  }, [pagination.totalPages]);

  return {
    // Data
    allMarkets,
    filteredMarkets,
    paginatedMarkets,

    // Loading states
    isLoading,
    error,

    // Filters and pagination
    filters,
    pagination,

    // Actions
    setSearch,
    setStatusFilter,
    setSortBy,
    setIsVerifiedOnly,
    setCategory,
    setIsMyBetsOnly,
    setPage,
    retry
  };
}