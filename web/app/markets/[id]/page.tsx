'use client';

import Navbar from "../../components/Navbar";
import BettingSection from "../../components/BettingSection";
import { use, useEffect, useState, useMemo } from "react";
import { getPool, Pool } from "../../lib/stacks-api";
import { TrendingUp, Users, Clock, ShieldCheck, Share2, BarChart3, ArrowLeft, Activity } from "lucide-react";
import Link from "next/link";
import { truncateAddress } from "../../lib/utils";
import MarketChart from "../../components/MarketChart";
import OrderBook from "../../components/OrderBook";
import PriceOracleStatus from "../../components/PriceOracleStatus";
import MarketSettlement from "../../components/markets/MarketSettlement";

export default function PoolDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const poolId = parseInt(id);

    const [pool, setPool] = useState<Pool | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { userData } = useStacks();
    const stxAddress = userData?.profile?.stxAddress?.mainnet || userData?.profile?.stxAddress?.testnet || userData?.identityAddress;

    useEffect(() => {
        getPool(poolId).then(data => {
            setPool(data);
            setIsLoading(false);
        });
    }, [poolId]);



    if (isLoading) {
        return (
            <main className="min-h-screen bg-background text-foreground">
                <Navbar />
                <div className="pt-32 text-center">Loading pool...</div>
            </main>
        );
    }

    if (!pool) {
        return (
            <main className="min-h-screen bg-background text-foreground">
                <Navbar />
                <div className="pt-32 text-center text-red-500">Pool not found.</div>
            </main>
        );
    }

    const totalVolume = pool.totalA + pool.totalB;
    const oddsA = totalVolume > 0 ? (pool.totalA / totalVolume) * 100 : 50;
    const oddsB = totalVolume > 0 ? (pool.totalB / totalVolume) * 100 : 50;

    // Generate mock history data for the chart
    const historyData = useMemo(() => {
        return Array.from({ length: 15 }, (_, i) => {
            const variance = Math.sin((pool.id + i) * 0.8) * 5;
            const valA = Math.max(5, Math.min(95, oddsA + variance));
            return {
                time: `${15 - i}h ago`,
                oddsA: valA,
                oddsB: 100 - valA
            };
        });
    }, [pool.id, oddsA]);

    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            <Navbar />

            <div className="pt-32 pb-20 max-w-5xl mx-auto px-4 sm:px-6">
                <Link
                    href="/markets"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-widest">Back to Markets</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Market Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass-panel p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32" />

                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                        #POOL-{pool.id}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${pool.settled ? 'bg-zinc-800 text-zinc-400 border-zinc-700' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                                        {pool.settled ? 'Settled' : 'Active'}
                                    </span>
                                </div>
                                <button className="p-3 rounded-xl bg-muted/50 hover:bg-muted border border-border/50 transition-all">
                                    <Share2 size={18} />
                                </button>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter leading-tight">{pool.title}</h1>
                            <p className="text-lg text-muted-foreground leading-relaxed mb-10">{pool.description}</p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                    <TrendingUp className="w-5 h-5 text-primary mb-3" />
                                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Total Volume</p>
                                    <p className="text-xl font-black">{(totalVolume / 1_000_000).toLocaleString()} STX</p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                    <ShieldCheck className="w-5 h-5 text-accent mb-3" />
                                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Creator</p>
                                    <p className="text-sm font-mono font-bold truncate">{truncateAddress(pool.creator)}</p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                    <Clock className="w-5 h-5 text-yellow-500 mb-3" />
                                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Expires At</p>
                                    <p className="text-xl font-black">Block {pool.expiry}</p>
                                </div>
                            </div>
                        </div>

                        {/* Market Analysis / Chart Stub */}
                        <div className="glass-panel p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">Analytical Terminal</span>
                                    <h3 className="text-2xl font-black tracking-tight">Market Probability</h3>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                                    <Activity size={14} className="text-primary animate-pulse" />
                                    <span>Live Feed</span>
                                </div>
                            </div>

                            <div className="mb-10">
                                <MarketChart
                                    data={historyData}
                                    outcomeA={pool.outcomeA}
                                    outcomeB={pool.outcomeB}
                                />
                            </div>

                            <div className="space-y-6">
                                <div className="flex h-12 rounded-2xl overflow-hidden border border-white/5 p-1 bg-white/5">
                                    <div
                                        className="bg-primary rounded-xl transition-all duration-1000 flex items-center justify-center text-[10px] font-black uppercase text-white overflow-hidden"
                                        style={{ width: `${oddsA}%` }}
                                    >
                                        {oddsA > 15 && pool.outcomeA}
                                    </div>
                                    <div
                                        className="bg-accent rounded-xl transition-all duration-1000 flex items-center justify-center text-[10px] font-black uppercase text-white overflow-hidden ml-1"
                                        style={{ width: `${oddsB}%` }}
                                    >
                                        {oddsB > 15 && pool.outcomeB}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-xs font-bold uppercase tracking-widest opacity-60">Outcome A</span>
                                            <span className="text-2xl font-black text-primary">{oddsA.toFixed(1)}%</span>
                                        </div>
                                        <p className="text-sm font-bold truncate">{pool.outcomeA}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-accent/5 border border-accent/10 text-right">
                                        <div className="flex justify-between flex-row-reverse items-end mb-2">
                                            <span className="text-xs font-bold uppercase tracking-widest opacity-60">Outcome B</span>
                                            <span className="text-2xl font-black text-accent">{oddsB.toFixed(1)}%</span>
                                        </div>
                                        <p className="text-sm font-bold truncate">{pool.outcomeB}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Proof / Activity */}
                        <div className="mt-8 flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-zinc-800 flex items-center justify-center text-[10px] font-black">
                                            {String.fromCharCode(64 + i)}
                                        </div>
                                    ))}
                                    <div className="w-8 h-8 rounded-full border-2 border-background bg-primary flex items-center justify-center text-[10px] font-black">
                                        +42
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-black tracking-tight">Active Predictors</p>
                                    <p className="text-[10px] text-muted-foreground font-bold">47 experts already placed their orders</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] uppercase font-black text-muted-foreground mb-1">Sentiment</span>
                                <span className="text-xs font-black text-primary">BULLISH</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Betting Section */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32 space-y-6">
                            <BettingSection pool={pool as any} poolId={poolId} />

                            <OrderBook pool={{
                                totalA: pool.totalA,
                                totalB: pool.totalB,
                                outcomeA: pool.outcomeA,
                                outcomeB: pool.outcomeB
                            }} />

                            <PriceOracleStatus />

                            <div className="p-6 glass-panel rounded-2xl border border-white/5 opacity-60">
                                <h4 className="text-xs font-black uppercase tracking-widest mb-4">Risk Warning</h4>
                                <p className="text-[11px] leading-relaxed text-muted-foreground">
                                    Prediction markets involve high risk. Past performance is not indicative of future results.
                                    Always do your own research before participating in any pool.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
