import Link from 'next/link';
import { Pool } from '../lib/stacks-api';
import { TrendingUp, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import MarketCardHeader from './ui/MarketCardHeader';
import ClaimWinningsButton from './ClaimWinningsButton';

export default function MarketCard({ market }: { market: Pool }) {
    // In a real app, we would check if the user has a winning bet.
    const canClaim = market.status === 'settled';
    const isVerified = true; // Hardcoded for now for Phase 3 visual polish

    return (
        <div className="group block h-full rounded-3xl relative">
            <Link
                href={`/markets/${market.id}`}
                className="block h-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-3xl"
                aria-label={`View details for market: ${market.title}`}
            >
                <div
                    className="p-8 rounded-3xl border border-border bg-card/40 hover:bg-card/60 hover:border-primary/40 transition-all h-full flex flex-col glass hover-lift relative overflow-hidden"
                    role="article"
                >
                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <MarketCardHeader id={market.id} status={market.status} />
                            {isVerified && (
                                <div className="p-1 bg-blue-500/10 rounded-full" title="Verified Market">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                                </div>
                            )}
                        </div>
                        {market.status === 'active' && (
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 animate-pulse-subtle">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Live</span>
                            </div>
                        )}
                    </div>

                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                        {market.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-8 line-clamp-2 flex-grow leading-relaxed font-medium">
                        {market.description}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-border/50">
                        <div className="flex items-center gap-4">
                            <div
                                className="flex flex-col gap-1 cursor-help"
                                title="Total 24h trading volume in STX"
                            >
                                <span className="text-[9px] uppercase font-black text-muted-foreground tracking-widest">Volume</span>
                                <div className="flex items-center gap-1.5 font-bold text-sm">
                                    <TrendingUp className="h-3.5 w-3.5 text-primary" />
                                    <span>{(market.totalA + market.totalB).toLocaleString()} STX</span>
                                </div>
                            </div>
                            <div
                                className="flex flex-col gap-1 cursor-help"
                                title={`This market expires at Stacks block height ${market.expiry}`}
                            >
                                <span className="text-[9px] uppercase font-black text-muted-foreground tracking-widest">Expiry</span>
                                <div className="flex items-center gap-1.5 font-bold text-sm">
                                    <Clock className="h-3.5 w-3.5 text-accent" />
                                    <span>Block {market.expiry}</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
                            <ChevronRight className="h-4 w-4" />
                        </div>
                    </div>

                    {/* Subtle gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
            </Link>

            {canClaim && (
                <div className="absolute bottom-24 right-8 z-10 transition-transform hover:scale-105 active:scale-95">
                    <ClaimWinningsButton
                        poolId={market.id}
                        isSettled={true}
                        userHasWinnings={true}
                    />
                </div>
            )}
        </div>
    );
}
