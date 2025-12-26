'use client';

import { useMemo } from 'react';
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import FilterControls from "../components/FilterControls";
import SortControls from "../components/SortControls";
import MarketGrid from "../components/MarketGrid";
import Pagination from "../components/Pagination";
import { useMarketDiscovery } from "../lib/hooks/useMarketDiscovery";

export default function MarketsPage() {
  const {
    paginatedMarkets,
    isLoading,
    error,
    filters,
    pagination,
    setSearch,
    setStatusFilter,
    setSortBy,
    setPage,
    retry,
    filteredMarkets
  } = useMarketDiscovery();

  // Calculate filter counts for display
  const filterCounts = useMemo(() => {
    const counts = {
      all: filteredMarkets.length,
      active: 0,
      settled: 0,
      expired: 0
    };

    filteredMarkets.forEach(market => {
      counts[market.status]++;
    });

    return counts;
  }, [filteredMarkets]);

  const hasActiveFilters = filters.search.trim() !== '' || filters.status !== 'all';

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Prediction Markets</h1>
          <p className="text-muted-foreground">
            Discover and participate in decentralized prediction markets on Stacks
          </p>
        </div>

        {/* Controls */}
        <div className="space-y-6 mb-8">
          {/* Search */}
          <div className="max-w-2xl">
            <SearchBar
              value={filters.search}
              onChange={setSearch}
              placeholder="Search markets by title or description..."
            />
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Status Filters */}
            <div className="flex-1">
              <FilterControls
                selectedStatus={filters.status}
                onStatusChange={setStatusFilter}
                counts={filterCounts}
              />
            </div>

            {/* Sort Controls */}
            <div className="lg:w-64">
              <SortControls
                selectedSort={filters.sortBy}
                onSortChange={setSortBy}
              />
            </div>
          </div>
        </div>

        {/* Markets Grid */}
        <MarketGrid
          markets={paginatedMarkets}
          isLoading={isLoading}
          error={error}
          onRetry={retry}
          searchQuery={filters.search}
          hasFilters={hasActiveFilters}
        />

        {/* Pagination */}
        {!isLoading && !error && paginatedMarkets.length > 0 && (
          <Pagination
            pagination={pagination}
            onPageChange={setPage}
          />
        )}
      </div>
    </main>
  );
}
