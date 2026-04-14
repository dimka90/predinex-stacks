import Navbar from "../components/Navbar";
import { useStacks } from "../components/StacksProvider";
import Link from "next/link";
import { useUserPortfolio } from "../lib/hooks/useUserPortfolio";
import { useUserRewards } from "../lib/hooks/useUserRewards";
import PNLCard from "../components/dashboard/PNLCard";
import UserBetsTable from "../components/dashboard/UserBetsTable";
import { RewardBadge, MissionGrid } from "../components/rewards/RewardSystem";
import UserCreatedMarkets from "../components/markets/UserCreatedMarkets";
import { LayoutDashboard, History, TrendingUp, ShieldCheck, Settings } from "lucide-react";

export default function Dashboard() {
    const { userData } = useStacks();
    const stxAddress = userData?.profile?.stxAddress?.mainnet || userData?.profile?.stxAddress?.testnet || userData?.identityAddress;

    const { portfolio, stats, isLoading: loadingPortfolio } = useUserPortfolio(stxAddress);
    const { rewards, missions, isLoading: loadingRewards } = useUserRewards(stxAddress);

    const isLoading = loadingPortfolio || loadingRewards;

    if (!userData) {
        return (
            <main className="min-h-screen bg-background">
                <Navbar />
                <div className="pt-32 flex flex-col items-center justify-center px-4 text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20 mb-6">
                        <ShieldCheck className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-black mb-4">Secure Access Required</h2>
                    <p className="text-muted-foreground max-w-sm mb-8">Please connect your Stacks wallet to view your institutional-grade dashboard and portfolio stats.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />

            <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 bg-primary/10 w-fit px-4 py-2 rounded-xl border border-primary/20 shadow-inner mb-3">
                            <LayoutDashboard size={14} className="text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Terminal v2.0</span>
                        </div>
                        <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-br from-white via-white/80 to-primary/40 bg-clip-text text-transparent uppercase drop-shadow-sm">
                            Account Overview
                        </h1>
                    </div>
                    <div className="flex items-center gap-5 bg-black/40 border border-white/5 p-4 pr-10 rounded-[2rem] backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-indigo-500/10 flex items-center justify-center border border-primary/30 shadow-inner">
                            <TrendingUp size={24} className="text-primary drop-shadow-[0_0_8px_rgba(79,70,229,0.8)]" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] block">Win Rate</span>
                            <span className="text-2xl font-black">{stats.winRate.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Left Column: Stats & Rewards */}
                    <div className="lg:col-span-1 space-y-6">
                        <RewardBadge
                            level={rewards.level}
                            points={rewards.totalPoints}
                            multiplier={rewards.multiplier}
                        />

                        <PNLCard
                            totalWagered={stats.totalWagered * 1_000_000}
                            totalWon={stats.totalWon * 1_000_000}
                            netPnL={stats.netPnL * 1_000_000}
                            winRate={stats.winRate}
                            isLoading={isLoading}
                        />

                        <div className="p-8 rounded-[2rem] border border-white/5 bg-card/20 backdrop-blur-xl relative overflow-hidden group">
                            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">Active Positions</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black">{stats.activeCount}</span>
                                <span className="text-xs font-bold text-accent">Markets</span>
                            </div>
                            <div className="mt-6 flex gap-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className={`h-1 flex-1 rounded-full ${i <= stats.activeCount ? 'bg-primary' : 'bg-white/5'}`} />
                                ))}
                            </div>
                        </div>

                        <MissionGrid missions={missions} />
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                                <History size={20} className="text-muted-foreground" />
                                Position History
                            </h2>
                            <button className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">
                                Export CSV
                            </button>
                        </div>
                        <UserBetsTable positions={portfolio} isLoading={isLoading} />

                        {/* Market Creator Terminal */}
                        <div className="pt-12 border-t border-white/5">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                                    <Settings size={20} className="text-muted-foreground" />
                                    Initialized Pools
                                </h2>
                                <Link
                                    href="/markets/create"
                                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                                >
                                    New Market +
                                </Link>
                            </div>
                            <UserCreatedMarkets />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
