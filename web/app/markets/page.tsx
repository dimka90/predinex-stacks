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
import { useRealTimeStats } from "../lib/hooks/useRealTimeStats";
import TrendChart from "../components/ui/TrendChart";
import { XCircle, Trophy, TrendingUp, Users, Plus, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function MarketsPage() {
  const {
    paginatedMarkets,
    isLoading: isMarketLoading,
    error,
    filters,
    pagination,
    setSearch,
    setStatusFilter,
    setSortBy,
    setIsVerifiedOnly,
    setCategory,
    setIsMyBetsOnly,
    setPage,
    retry,
    filteredMarkets
  } = useMarketDiscovery();

  const { stats, isLoading: isStatsLoading } = useRealTimeStats();

  const clearFilters = useCallback(() => {
    setSearch('');
    setStatusFilter('all');
    setCategory('All');
    setIsVerifiedOnly(false);
    setIsMyBetsOnly(false);
  }, [setSearch, setStatusFilter, setCategory, setIsVerifiedOnly, setIsMyBetsOnly]);

  const isLoading = isMarketLoading || isStatsLoading;

  const hasActiveFilters = filters.search.trim() !== '' || filters.status !== 'all' || filters.isVerifiedOnly || filters.category !== 'All' || filters.isMyBetsOnly;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 relative flex flex-col md:flex-row md:items-end justify-between gap-8 z-10">
          <div className="space-y-4">
            <div className="absolute -left-6 top-0 w-1.5 h-14 bg-primary/80 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]" />
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-br from-white via-white/90 to-primary/50 bg-clip-text text-transparent tracking-tighter uppercase drop-shadow-sm">
              Terminal Markets
            </h1>
            <p className="text-muted-foreground/80 text-lg font-medium max-w-2xl leading-relaxed tracking-wide">
              Experience institutional-grade prediction pools secured by the remote Stacks network execution state.
            </p>
          </div>

          <Link
            href="/markets/create"
            className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] transition-all hover:-translate-y-1 active:translate-y-0 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            <span className="text-sm font-black uppercase tracking-widest">Initialize Pool</span>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatsCard
            title="Total Markets"
            value={stats.poolCount}
            icon={Trophy}
            color="primary"
          />
          <StatsCard
            title="Total Volume"
            value={`${stats.totalVolume.toLocaleString()} STX`}
            icon={TrendingUp}
            color="success"
            trend="+12.5%"
            trendType="up"
            chart={<TrendChart data={[20, 35, 25, 45, 40, 60, 55]} color="#22c55e" height={40} />}
          />
          <StatsCard
            title="Active Predictors"
            value={stats.activeUsers}
            icon={Users}
            color="accent"
          />
        </div>

        {/* Controls */}
        <div className="space-y-6 mb-8 sticky top-16 z-30 py-4 bg-background/80 backdrop-blur-md border-b border-white/5 mx-[-1rem] px-[1rem] md:mx-0 md:px-0">
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
                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground rounded-xl border border-white/5 transition-all animate-in fade-in slide-in-from-left-2"
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
                counts={{
                  all: filteredMarkets.length,
                  active: filteredMarkets.filter(m => m.status === 'active').length,
                  settled: filteredMarkets.filter(m => m.status === 'settled').length,
                  expired: filteredMarkets.filter(m => m.status === 'expired').length,
                }}
                isVerifiedOnly={filters.isVerifiedOnly}
                onVerifiedChange={setIsVerifiedOnly}
                selectedCategory={filters.category}
                onCategoryChange={setCategory}
                isMyBetsOnly={filters.isMyBetsOnly}
                onMyBetsChange={setIsMyBetsOnly}
              />
            </div>
          </div>
        </div>

        {/* Markets Grid */}
        <MarketGrid
          markets={paginatedMarkets}
          isLoading={isMarketLoading}
          error={error}
          onRetry={retry}
          searchQuery={filters.search}
          hasFilters={hasActiveFilters}
        />

        {/* Pagination */}
        {
          !isMarketLoading && !error && paginatedMarkets.length > 0 && (
            <Pagination
              pagination={pagination}
              onPageChange={setPage}
            />
          )
        }
      </div >
    </main >
  );
}
