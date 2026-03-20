import { useState, useEffect, useMemo } from 'react';
import { Pool, getMarkets } from '../stacks-api';

export function useMarketDiscovery() {
  const [allMarkets, setAllMarkets] = useState<Pool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isVerifiedOnly, setIsVerifiedOnly] = useState(false);
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
    return result;
  }, [allMarkets, search, status, isVerifiedOnly]);

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
    filters: { search, status, sortBy, isVerifiedOnly },
    pagination: { currentPage: page, totalPages },
    setSearch,
    setStatusFilter: setStatus,
    setSortBy,
    setIsVerifiedOnly,
    setPage,
    retry: () => window.location.reload(),
    filteredMarkets
  };
}
