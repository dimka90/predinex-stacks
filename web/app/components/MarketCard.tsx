'use client';

import Link from 'next/link';
import { Clock, TrendingUp, Users, CheckCircle, XCircle, Info } from 'lucide-react';
import { ProcessedMarket } from '../lib/market-types';
import { formatSTXAmount, formatTimeRemaining } from '../lib/market-utils';
import ShareMarketButton from './ShareMarketButton';

interface MarketCardProps {
  market: ProcessedMarket;
  onShowDetails?: () => void;
}

export default function MarketCard({ market, onShowDetails }: MarketCardProps) {
  const getStatusColor = (status: ProcessedMarket['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500';
      case 'settled':
        return 'bg-blue-500/10 text-blue-500';
      case 'expired':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getStatusIcon = (status: ProcessedMarket['status']) => {
    switch (status) {
      case 'active':
        return <Clock className="w-3 h-3" />;
      case 'settled':
        return <CheckCircle className="w-3 h-3" />;
      case 'expired':
        return <XCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: ProcessedMarket['status']) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'settled':
        return 'Settled';
      case 'expired':
        return 'Expired';
      default:
        return 'Unknown';
    }
  };

  const getTimeDisplay = () => {
    if (market.status === 'settled') {
      return 'Settled';
    } else if (market.status === 'expired') {
      return 'Expired';
    } else if (market.timeRemaining !== null) {
      return formatTimeRemaining(market.timeRemaining);
    } else {
      return 'Expired';
    }
  };

  return (
    <div className="group h-full">
      <Link href={`/markets/${market.poolId}`} className="block h-full">
        <div className="glass p-6 rounded-xl border border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer h-full flex flex-col justify-between hover:shadow-2xl hover:shadow-primary/5 relative overflow-hidden">
          {/* Hover highlight effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div>
            {/* Header */}
            <div className="flex justify-between items-start mb-5">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono font-bold text-muted-foreground tracking-widest uppercase">
                  Pool #{market.poolId}
                </span>
                <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 w-fit ${getStatusColor(market.status)}`}>
                  {getStatusIcon(market.status)}
                  {getStatusText(market.status)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ShareMarketButton
                  poolId={market.poolId}
                  title={market.title}
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onShowDetails?.();
                  }}
                  className="p-2 rounded-lg bg-muted/50 hover:bg-primary hover:text-white transition-all border border-border/30 hover:border-primary/50"
                  title="View Details"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Title and Description */}
            <h3 className="text-xl font-black mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight tracking-tight">
              {market.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-8 line-clamp-3 leading-relaxed font-medium">
              {market.description}
            </p>
          </div>

          <div className="space-y-6">
            {/* Outcomes & Visualization */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-bold px-4 py-3 bg-muted/20 rounded-xl border border-border/10">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-500/50" />
                  <span className="text-foreground/80">{market.outcomeA}</span>
                  <span className="text-green-500">{market.oddsA}%</span>
                </div>
                <div className="h-4 w-px bg-border/20" />
                <div className="flex items-center gap-3">
                  <span className="text-red-500">{market.oddsB}%</span>
                  <span className="text-foreground/80">{market.outcomeB}</span>
                  <div className="w-2 h-2 rounded-full bg-red-500 shadow-sm shadow-red-500/50" />
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-muted/20 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500 ease-out"
                  style={{ width: `${market.oddsA}%` }}
                />
                <div
                  className="h-full bg-gradient-to-l from-red-500 to-red-400 transition-all duration-500 ease-out"
                  style={{ width: `${market.oddsB}%` }}
                />
              </div>
            </div>

            {/* Stats & Footer */}
            <div className="flex justify-between items-center py-4 border-t border-border/10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/5 text-primary">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-black text-muted-foreground/60 leading-none mb-1">Volume</span>
                  <span className="text-sm font-bold tracking-tight">{formatSTXAmount(market.totalVolume)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-right">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase font-black text-muted-foreground/60 leading-none mb-1">Time Left</span>
                  <span className="text-sm font-bold text-accent tracking-tight">{getTimeDisplay()}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-accent/5 text-accent">
                  <Clock className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Creator badge */}
            <div className="flex items-center gap-2 px-3 py-2 bg-muted/10 rounded-lg w-fit">
              <Users className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] font-bold text-muted-foreground tracking-wide">
                by {market.creator.slice(0, 6)}...{market.creator.slice(-4)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}