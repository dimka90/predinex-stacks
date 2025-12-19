'use client';

import { BarChart3, TrendingUp, Users, Target, DollarSign, Activity, Calendar, Trophy } from 'lucide-react';
import { PlatformMetrics as PlatformMetricsType } from '../../lib/dashboard-types';
import { formatCurrency, formatPercentage } from '../../lib/dashboard-utils';

interface PlatformMetricsProps {
  metrics: PlatformMetricsType;
  isLoading?: boolean;
}

export default function PlatformMetrics({ metrics, isLoading = false }: PlatformMetricsProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-6 bg-muted/50 rounded mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="glass p-6 rounded-xl animate-pulse">
              <div className="h-4 bg-muted/50 rounded mb-2"></div>
              <div className="h-8 bg-muted/50 rounded mb-1"></div>
              <div className="h-3 bg-muted/50 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const marketDistribution = [
    { label: 'Active', value: metrics.activePools, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { label: 'Settled', value: metrics.settledPools, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { label: 'Expired', value: metrics.expiredPools, color: 'text-red-500', bgColor: 'bg-red-500/10' }
  ];

  const volumeMetrics = [
    { label: 'Daily', value: metrics.dailyVolume, icon: Calendar },
    { label: 'Weekly', value: metrics.weeklyVolume, icon: BarChart3 },
    { label: 'Monthly', value: metrics.monthlyVolume, icon: TrendingUp }
  ];

  const mainMetrics = [
    {
      title: 'Total Markets',
      value: metrics.totalPools.toString(),
      subtitle: `${metrics.activePools} currently active`,
      icon: Target,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Total Volume',
      value: formatCurrency(metrics.totalVolume),
      subtitle: `Avg: ${formatCurrency(metrics.averageMarketSize)} per market`,
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Active Users',
      value: metrics.totalUsers.toString(),
      subtitle: `${metrics.totalBets} total bets placed`,
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Total Winnings',
      value: formatCurrency(metrics.totalWinnings),
      subtitle: `${formatPercentage((metrics.totalWinnings / Math.max(metrics.totalVolume, 1)) * 100)} of volume`,
      icon: Trophy,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Platform Overview</h3>
        <div className="text-sm text-muted-foreground">
          Real-time statistics
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainMetrics.map((metric, index) => {
          const Icon = metric.icon;
          
          return (
            <div key={index} className="glass p-6 rounded-xl hover:border-primary/50 transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                <p className="text-xs text-muted-foreground">{metric.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Market Distribution */}
      <div className="glass p-6 rounded-xl">
        <h4 className="text-lg font-semibold mb-4">Market Distribution</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {marketDistribution.map((item, index) => {
            const percentage = metrics.totalPools > 0 
              ? (item.value / metrics.totalPools) * 100 
              : 0;
            
            return (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${item.bgColor} mb-3`}>
                  <span className={`text-2xl font-bold ${item.color}`}>
                    {item.value}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">{item.label} Markets</p>
                  <p className="text-sm text-muted-foreground">
                    {formatPercentage(percentage)} of total
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Volume Trends */}
      <div className="glass p-6 rounded-xl">
        <h4 className="text-lg font-semibold mb-4">Volume Trends</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {volumeMetrics.map((metric, index) => {
            const Icon = metric.icon;
            const percentageOfTotal = metrics.totalVolume > 0 
              ? (metric.value / metrics.totalVolume) * 100 
              : 0;
            
            return (
              <div key={index} className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-center mb-3">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{metric.label} Volume</p>
                  <p className="text-xl font-bold text-primary">
                    {formatCurrency(metric.value)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatPercentage(percentageOfTotal)} of total
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-semibold">Betting Activity</h4>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Bets</span>
              <span className="font-semibold">{metrics.totalBets.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Avg Bets per User</span>
              <span className="font-semibold">
                {metrics.totalUsers > 0 
                  ? (metrics.totalBets / metrics.totalUsers).toFixed(1)
                  : '0'
                }
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Avg Bet Size</span>
              <span className="font-semibold">
                {formatCurrency(metrics.totalBets > 0 
                  ? metrics.totalVolume / metrics.totalBets 
                  : 0
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h4 className="font-semibold">Growth Metrics</h4>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Markets Created</span>
              <span className="font-semibold">{metrics.totalPools}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Success Rate</span>
              <span className="font-semibold text-green-500">
                {formatPercentage(metrics.totalPools > 0 
                  ? (metrics.settledPools / metrics.totalPools) * 100 
                  : 0
                )}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Platform Health</span>
              <span className="font-semibold text-blue-500">
                {metrics.activePools > 0 ? 'Active' : 'Quiet'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}