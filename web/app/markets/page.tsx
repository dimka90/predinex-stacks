'use client';

import { useMemo, useCallback } from 'react';
import Navbar from "../components/Navbar";
import { StatsCard } from '@/components/ui/StatsCard';
import SearchBar from "../components/SearchBar";
import FilterControls from "../components/FilterControls";
import SortControls from "../components/SortControls";
import MarketGrid from "../components/MarketGrid";
import Pagination from "../components/Pagination";
import { useMarketDiscovery } from "../lib/hooks/useMarketDiscovery";
import { XCircle } from 'lucide-react';

export default function MarketsPage() {
  const {
    paginatedMarkets,
    isLoading,
    error,
    setIsVerifiedOnly,
    setCategory,
    setIsMyBetsOnly,
    setPage,
    retry,
    filteredMarkets
  } = useMarketDiscovery();

  const clearFilters = useCallback(() => {
    setSearch('');
    setStatusFilter('all');
    setCategory('All');
    setIsVerifiedOnly(false);
    setIsMyBetsOnly(false);
  }, [setSearch, setStatusFilter, setCategory, setIsVerifiedOnly, setIsMyBetsOnly]);

  // Calculate filter counts for display
  const filterCounts = useMemo(() => {
    const counts = {
      all: filteredMarkets.length,
      active: 0,
      settled: 0,
      expired: 0
    };

    filteredMarkets.forEach(market => {
      if (counts[market.status] !== undefined) {
        counts[market.status]++;
      }
    });

    return counts;
  }, [filteredMarkets]);

  const hasActiveFilters = filters.search.trim() !== '' || filters.status !== 'all' || filters.isVerifiedOnly || filters.category !== 'All' || filters.isMyBetsOnly;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 relative">
          <div className="absolute -left-4 top-0 w-1 h-12 bg-primary rounded-full blur-sm opacity-50" />
          <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-foreground via-foreground/80 to-primary bg-clip-text text-transparent tracking-tighter">
            Prediction Markets
          </h1>
          <p className="text-muted-foreground text-lg font-medium max-w-2xl leading-relaxed">
            Discover, analyze, and participate in decentralized prediction markets powered by Stacks.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatsCard title="Total Markets" value={filterCounts.all} />
          <StatsCard title="Active" value={filterCounts.active} />
          <StatsCard title="Settled" value={filterCounts.settled} />
        </div>

        {/* Controls */}
        <div className="space-y-6 mb-8 sticky top-16 z-30 py-4 bg-background/80 backdrop-blur-md border-b border-transparent md:border-border/10">
          {/* Search and Clear */}
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 max-w-2xl w-full">
              <SearchBar
                value={filters.search}
                onChange={setSearch}
                placeholder="Search markets by title or description..."
              />
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-6 py-3 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl border border-border/50 transition-all animate-in fade-in slide-in-from-left-2"
              >
                <XCircle className="w-4 h-4" />
                <span className="text-sm font-bold">Clear Filters</span>
              </button>
            )}
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Status Filters */}
            <div className="flex-1">
              <FilterControls
                selectedStatus={filters.status}
                onStatusChange={setStatusFilter}
                counts={filterCounts}
                isVerifiedOnly={filters.isVerifiedOnly}
                onVerifiedChange={setIsVerifiedOnly}
                selectedCategory={filters.category}
                onCategoryChange={setCategory}
                isMyBetsOnly={filters.isMyBetsOnly}
                onMyBetsChange={setIsMyBetsOnly}
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
