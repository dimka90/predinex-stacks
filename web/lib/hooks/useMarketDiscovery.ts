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
      return result;
  }, [allMarkets, search, status]);

  const paginatedMarkets = filteredMarkets; // TODO: Implement pagination slice

  return {
    paginatedMarkets,
    isLoading,
    error,
    filters: { search, status, sortBy },
    pagination: { currentPage: page, totalPages: 1 },
    setSearch,
    setStatusFilter: setStatus,
    setSortBy,
    setPage,
    retry: () => window.location.reload(),
    filteredMarkets
  };
}
