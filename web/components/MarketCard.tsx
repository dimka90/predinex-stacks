import Link from 'next/link';
import { Pool } from '../lib/stacks-api';
import { TrendingUp, Clock, ChevronRight } from 'lucide-react';

export default function MarketCard({ market }: { market: Pool }) {
    return (
        <Link href={`/markets/${market.id}`} className="group block h-full">
            <div className="p-8 rounded-3xl border border-border bg-card/40 hover:bg-card/60 hover:border-primary/40 transition-all h-full flex flex-col glass hover-lift relative overflow-hidden">
                {/* Status Badge */}
                <div className="flex justify-between items-center mb-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${market.status === 'active'
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : 'bg-muted text-muted-foreground border-border'
                        }`}>
                        {market.status}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono font-bold uppercase tracking-tighter bg-muted/30 px-2 py-0.5 rounded">
                        #POOL-{market.id}
                    </span>
                </div>

                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {market.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-8 line-clamp-2 flex-grow leading-relaxed font-medium">
                    {market.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-border/50">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] uppercase font-black text-muted-foreground tracking-widest">Volume</span>
                            <div className="flex items-center gap-1.5 font-bold text-sm">
                                <TrendingUp className="h-3.5 w-3.5 text-primary" />
                                <span>{(market.totalA + market.totalB).toLocaleString()} STX</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
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
    );
}
