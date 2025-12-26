'use client';

import { TrendingUp, TrendingDown, DollarSign, Target, Trophy, Activity } from 'lucide-react';
import { UserPortfolio } from '../../lib/dashboard-types';
import { formatCurrency, formatPercentage, formatProfitLoss } from '../../lib/dashboard-utils';

interface PortfolioOverviewProps {
  portfolio: UserPortfolio;
  isLoading?: boolean;
}

export default function PortfolioOverview({ portfolio, isLoading = false }: PortfolioOverviewProps) {
  const profitLossData = formatProfitLoss(portfolio.profitLoss);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass p-6 rounded-xl animate-pulse">
            <div className="h-4 bg-muted/50 rounded mb-2"></div>
            <div className="h-8 bg-muted/50 rounded mb-1"></div>
            <div className="h-3 bg-muted/50 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      title: 'Total Portfolio Value',
      value: formatCurrency(portfolio.totalWagered + portfolio.profitLoss),
      subtitle: `${portfolio.totalBets} total bets`,
      icon: DollarSign,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Active Bets',
      value: portfolio.activeBets.toString(),
      subtitle: formatCurrency(portfolio.totalWagered - (portfolio.totalBets - portfolio.activeBets) * (portfolio.totalWagered / portfolio.totalBets)),
      icon: Activity,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Total Wagered',
      value: formatCurrency(portfolio.totalWagered),
      subtitle: `Avg: ${formatCurrency(portfolio.totalBets > 0 ? portfolio.totalWagered / portfolio.totalBets : 0)} per bet`,
      icon: Target,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Total Winnings',
      value: formatCurrency(portfolio.totalWinnings),
      subtitle: `${formatPercentage(portfolio.winRate)} win rate`,
      icon: Trophy,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      title: 'Claimable Amount',
      value: formatCurrency(portfolio.totalClaimable),
      subtitle: portfolio.totalClaimable > 0 ? 'Ready to claim' : 'No pending claims',
      icon: DollarSign,
      color: portfolio.totalClaimable > 0 ? 'text-green-500' : 'text-muted-foreground',
      bgColor: portfolio.totalClaimable > 0 ? 'bg-green-500/10' : 'bg-muted/10'
    },
    {
      title: 'Profit/Loss',
      value: profitLossData.formatted,
      subtitle: profitLossData.isBreakeven 
        ? 'Break even' 
        : profitLossData.isProfit 
          ? 'Profitable' 
          : 'In loss',
      icon: profitLossData.isProfit ? TrendingUp : TrendingDown,
      color: profitLossData.isBreakeven 
        ? 'text-muted-foreground' 
        : profitLossData.isProfit 
          ? 'text-green-500' 
          : 'text-red-500',
      bgColor: profitLossData.isBreakeven 
        ? 'bg-muted/10' 
        : profitLossData.isProfit 
          ? 'bg-green-500/10' 
          : 'bg-red-500/10'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Portfolio Overview</h2>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => {
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

      {/* Performance Summary */}
      <div className="glass p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">
              {formatPercentage(portfolio.winRate)}
            </div>
            <div className="text-sm text-muted-foreground">Win Rate</div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${profitLossData.isProfit ? 'text-green-500' : profitLossData.isBreakeven ? 'text-muted-foreground' : 'text-red-500'}`}>
              {portfolio.totalWagered > 0 ? formatPercentage((portfolio.profitLoss / portfolio.totalWagered) * 100) : '0%'}
            </div>
            <div className="text-sm text-muted-foreground">ROI</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">
              {portfolio.totalBets > 0 ? formatCurrency(portfolio.totalWagered / portfolio.totalBets) : formatCurrency(0)}
            </div>
            <div className="text-sm text-muted-foreground">Avg Bet Size</div>
          </div>
        </div>
      </div>
    </div>
  );
}