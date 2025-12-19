'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import PortfolioOverview from '../components/dashboard/PortfolioOverview';
import ActiveBetsCard from '../components/dashboard/ActiveBetsCard';
import BetHistoryTable from '../components/dashboard/BetHistoryTable';
import ClaimWinnings from '../components/dashboard/ClaimWinnings';
import MarketStatsCard from '../components/dashboard/MarketStatsCard';
import PlatformMetrics from '../components/dashboard/PlatformMetrics';
import { useStacks } from '../components/StacksProvider';
import { useDashboardData } from '../lib/hooks/useDashboardData';
import { AlertCircle, RefreshCw } from 'lucide-react';

type DashboardSection = 'portfolio' | 'history' | 'statistics' | 'claims';

export default function Dashboard() {
  const router = useRouter();
  const { userData } = useStacks();
  const [activeSection, setActiveSection] = useState<DashboardSection>('portfolio');
  
  const userAddress = userData?.profile?.stxAddress?.mainnet || null;
  const {
    data,
    isLoading,
    isConnected,
    error,
    filters,
    claimTransactions,
    refreshData,
    setFilters,
    executeClaim,
    retry
  } = useDashboardData(userAddress);

  useEffect(() => {
    if (!userData) {
      router.push('/');
      return;
    }
  }, [userData, router]);

  // Handle batch claim functionality
  const handleBatchClaim = async (poolIds: number[]) => {
    for (const poolId of poolIds) {
      await executeClaim(poolId);
    }
  };

  if (!userData) {
    return null;
  }

  // Connection error state
  if (error && !isConnected) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Connection Error</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button
              onClick={retry}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Connection
            </button>
          </div>
        </div>
      </main>
    );
  }

  const renderSectionContent = () => {
    if (!data && isLoading) {
      return <div className="text-center py-20">Loading your dashboard...</div>;
    }

    if (!data) {
      return <div className="text-center py-20">No data available</div>;
    }

    switch (activeSection) {
      case 'portfolio':
        return (
          <div className="space-y-8">
            <PortfolioOverview portfolio={data.userPortfolio} isLoading={isLoading} />
            <ActiveBetsCard
              bets={data.activeBets}
              claimTransactions={claimTransactions}
              onClaim={executeClaim}
              isLoading={isLoading}
            />
          </div>
        );

      case 'history':
        return (
          <BetHistoryTable
            history={data.betHistory}
            filters={filters}
            onFiltersChange={setFilters}
            isLoading={isLoading}
          />
        );

      case 'claims':
        const claimableBets = data.activeBets.concat(data.betHistory).filter(
          bet => bet.claimStatus === 'unclaimed' && bet.claimableAmount && bet.claimableAmount > 0
        );
        
        return (
          <ClaimWinnings
            claimableBets={claimableBets}
            claimTransactions={claimTransactions}
            onClaim={executeClaim}
            onBatchClaim={handleBatchClaim}
            isLoading={isLoading}
          />
        );

      case 'statistics':
        return (
          <div className="space-y-8">
            <PlatformMetrics metrics={data.platformMetrics} isLoading={isLoading} />
            <MarketStatsCard markets={data.marketStats} isLoading={isLoading} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <DashboardLayout
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        breadcrumbs={[
          { label: activeSection.charAt(0).toUpperCase() + activeSection.slice(1) }
        ]}
      >
        {/* Connection Status */}
        {!isConnected && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-500">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Connection lost. Attempting to reconnect...</span>
            </div>
          </div>
        )}

        {/* Refresh Button */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-muted-foreground">
            {data && `Last updated: ${new Date(data.lastUpdated).toLocaleTimeString()}`}
          </div>
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 border border-muted/50 rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Section Content */}
        {renderSectionContent()}
      </DashboardLayout>
    </main>
  );
}
