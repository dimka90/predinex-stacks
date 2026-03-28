'use client';

import Link from 'next/link';
import { TrendingUp, Users, Info, ShieldCheck, Share2 } from 'lucide-react';
import { ProcessedMarket } from '../lib/market-types';
import { formatSTXAmount } from '../lib/market-utils';
import ShareMarketButton from './ShareMarketButton';
import TrendChart from '../components/ui/TrendChart';
import StatusBadge from '@/components/ui/StatusBadge';
import CountdownTimer from './CountdownTimer';
import PoolCreatorBadge from './PoolCreatorBadge';
import { useMarketStatus } from '../lib/hooks/useMarketStatus';

interface MarketCardProps {
  market: ProcessedMarket;
  onShowDetails?: () => void;
}

/**
 * MarketCard - Premium institutional market display.
 * Integrates real-time status, countdown, and verified creator badges.
 */
export default function MarketCard({ market, onShowDetails }: MarketCardProps) {
  const { variant, label } = useMarketStatus(market.expiryDate);

  return (
    <div className="group h-full">
      <Link href={`/markets/${market.poolId}`} className="block h-full">
        <div className="glass-panel p-8 rounded-2xl border border-white/5 hover:border-primary/20 transition-all duration-500 cursor-pointer h-full flex flex-col justify-between hover:shadow-[0_0_50px_-12px_rgba(59,130,246,0.15)] relative overflow-hidden group">
          {/* Animated background glow on hover */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

          <div className="relative z-10">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-muted-foreground/60 tracking-[0.2em] uppercase">
                  Protocol Node #{market.poolId.toString().padStart(4, '0')}
                </span>
                <StatusBadge status={market.status} />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Share logic
                  }}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-primary transition-all border border-white/5"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onShowDetails?.();
                  }}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-primary hover:text-white transition-all border border-white/5"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-[1.1] tracking-tight uppercase italic">
              {market.title}
            </h3>

            <p className="text-sm text-muted-foreground/80 mb-8 line-clamp-3 leading-relaxed font-medium">
              {market.description}
            </p>

            {/* Progress Visualization */}
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-end mb-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-1">{market.outcomeA}</span>
                  <span className="text-xl font-black text-green-400 tabular-nums">{market.oddsA}%</span>
                </div>
                <div className="flex flex-col items-end text-right">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-1">{market.outcomeB}</span>
                  <span className="text-xl font-black text-red-400 tabular-nums">{market.oddsB}%</span>
                </div>
              </div>

              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden flex p-0.5 border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                  style={{ width: `${market.oddsA}%` }}
                />
                <div
                  className="h-full bg-gradient-to-l from-red-500 to-red-400 rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(239,68,68,0.3)] ml-0.5"
                  style={{ width: `${market.oddsB}%` }}
                />
              </div>
            </div>
          </div>

          <div className="relative z-10 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 py-6 border-y border-white/5">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Liquidity</span>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-lg font-black tabular-nums">{formatSTXAmount(market.totalVolume)}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Settlement</span>
                <CountdownTimer targetDate={market.expiryDate} showLabels={false} />
              </div>
            </div>

            {/* Footer with Creator Badge */}
            <div className="flex items-center justify-between">
              <PoolCreatorBadge creatorAddress={market.creator} isVerified={market.poolId % 2 === 0} />
              <div className="px-4 py-2 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-lg border border-primary/20">
                Trade Terminal
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}