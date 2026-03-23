'use client';

import React from 'react';
import { useMarketSync } from '../../lib/hooks/useMarketSync';
import { useStacks } from '../../components/StacksProvider';
import { Settings, BarChart3, Clock, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function UserCreatedMarkets() {
    const { userData } = useStacks();
    const stxAddress = userData?.profile?.stxAddress?.mainnet || userData?.profile?.stxAddress?.testnet || userData?.identityAddress;
    const { markets, isLoading } = useMarketSync({
        search: '',
        status: 'all',
        sortBy: 'newest',
        isVerifiedOnly: false,
        category: 'All'
    });

    const userMarkets = markets.filter(m => m.creator === stxAddress);

    if (isLoading) return <div className="text-center py-10 animate-pulse text-[10px] font-black uppercase tracking-widest text-primary">Synchronizing Protocol Records...</div>;

    if (userMarkets.length === 0) {
        return (
            <div className="p-10 text-center glass-panel border border-dashed border-white/10 rounded-[2rem]">
                <p className="text-sm font-bold text-muted-foreground mb-4">No decentralized pools initialized by this account.</p>
                <Link href="/markets/create" className="text-primary text-xs font-black uppercase tracking-widest hover:underline">
                    Initialze First Pool
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {userMarkets.map(market => (
                <div key={market.id} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
                    <div className="flex justify-between items-start">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${market.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-white/5 text-muted-foreground border-white/5'
                                    }`}>
                                    {market.status}
                                </span>
                                <span className="text-[10px] font-black text-muted-foreground uppercase opacity-50 tracking-tighter">
                                    POOL-ID #{market.id}
                                </span>
                            </div>
                            <h4 className="text-sm font-black tracking-tight group-hover:text-primary transition-colors">{market.title}</h4>
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total TVL</span>
                                    <span className="text-xs font-black">{(market.totalVolume / 1_000_000).toLocaleString()} STX</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Participants</span>
                                    <span className="text-xs font-black">42</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-muted-foreground transition-all">
                                <Settings size={14} />
                            </button>
                            <Link
                                href={`/markets/${market.id}`}
                                className="p-2 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary transition-all"
                            >
                                <ArrowUpRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
