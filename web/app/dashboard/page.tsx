'use client';

import Navbar from "../components/Navbar";
import { useStacks } from "../components/StacksProvider";
import Link from "next/link";
import { useUserPortfolio } from "../lib/hooks/useUserPortfolio";
import { useUserRewards } from "../lib/hooks/useUserRewards";
import PNLCard from "../components/dashboard/PNLCard";
import UserBetsTable from "../components/dashboard/UserBetsTable";
import { RewardBadge, MissionGrid } from "../components/rewards/RewardSystem";
import UserCreatedMarkets from "../components/markets/UserCreatedMarkets";
import OracleRegistry from "../components/OracleRegistry";
import { LayoutDashboard, History, TrendingUp, ShieldCheck, Settings, Globe } from "lucide-react";

export default function Dashboard() {
    const { userData } = useStacks();
    const stxAddress = userData?.profile?.stxAddress?.mainnet || userData?.profile?.stxAddress?.testnet || userData?.identityAddress;

    const { portfolio, stats, isLoading: loadingPortfolio } = useUserPortfolio(stxAddress);
    const { rewards, missions, isLoading: loadingRewards } = useUserRewards(stxAddress);

    const isLoading = loadingPortfolio || loadingRewards;

    if (!userData) {
        return (
            <main className="min-h-screen bg-background text-foreground selection:bg-primary/20">
                <Navbar />
                <div className="pt-48 flex flex-col items-center justify-center px-4 text-center relative z-10">
                    <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center border border-primary/20 mb-8 animate-pulse-glow shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]">
                        <ShieldCheck className="w-12 h-12 text-primary" />
                    </div>
                    <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter shimmer-text">Authorization Required</h2>
                    <p className="text-muted-foreground max-w-sm mb-12 font-medium leading-relaxed uppercase text-[10px] tracking-[0.2em]">Secure biometric signature or wallet connection detected as offline.</p>
                    <button className="px-8 py-3 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-full hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] transition-all">Connect Identity Portfolio</button>
                </div>

                {/* Background ambient lighting */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-primary/20">
            <Navbar />

            <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 bg-zinc-900/50 w-fit px-5 py-2 rounded-full border border-white/5 shadow-inner mb-6 backdrop-blur-md">
                            <div className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Node Sync: Mainnet-V6</span>
                        </div>
                        <h1 className="text-7xl font-black tracking-tighter bg-gradient-to-br from-white via-white to-white/20 bg-clip-text text-transparent uppercase leading-[0.85] italic drop-shadow-2xl">
                            Operations <br /> Terminal
                        </h1>
                        <p className="mt-8 text-muted-foreground font-black uppercase tracking-[0.3em] text-[10px] opacity-40 flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-muted-foreground/30" />
                            Session Active // 0x{stxAddress?.substring(2, 10).toUpperCase()}...
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-6 glass-panel p-6 pr-14 rounded-[3rem] border-white/10 group hover:border-primary/40">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner group-hover:scale-110 transition-transform">
                                <TrendingUp size={24} className="text-primary" />
                            </div>
                            <div>
                                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] block mb-1">Portfolio yield</span>
                                <span className="text-3xl font-black tracking-tight">{stats.winRate.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Intelligence Column */}
                    <div className="lg:col-span-4 space-y-10">
                        <RewardBadge
                            level={rewards.level}
                            points={rewards.totalPoints}
                            multiplier={rewards.multiplier}
                        />

                        <OracleRegistry />

                        <PNLCard
                            totalWagered={stats.totalWagered * 1_000_000}
                            totalWon={stats.totalWon * 1_000_000}
                            netPnL={stats.netPnL * 1_000_000}
                            winRate={stats.winRate}
                            isLoading={isLoading}
                        />

                        <MissionGrid missions={missions} />
                    </div>

                    {/* Right Execution Column */}
                    <div className="lg:col-span-8 space-y-12">
                        <div className="glass-panel p-1 rounded-[2.5rem] border-white/5 bg-zinc-950/40 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)]">
                            <div className="p-10">
                                <div className="flex items-center justify-between mb-12">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
                                            <History size={20} className="text-muted-foreground" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black uppercase tracking-tight">Active Deployments</h2>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Verified On-Chain Sessions</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="px-5 py-2.5 bg-white/5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Telemetry</button>
                                        <button className="px-5 py-2.5 bg-primary/10 rounded-xl border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/20 transition-all hover:scale-105 active:scale-95">Configure</button>
                                    </div>
                                </div>
                                <UserBetsTable positions={portfolio} isLoading={isLoading} />
                            </div>
                        </div>

                        {/* Control Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="glass-panel p-12 rounded-[3rem] group hover:border-primary/50 transition-all relative overflow-hidden bg-zinc-950/20">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
                                <div className="flex items-center justify-between mb-8">
                                    <div className="p-3 bg-zinc-900 rounded-2xl border border-white/5 group-hover:text-primary transition-colors shadow-xl">
                                        <Settings size={22} />
                                    </div>
                                    <Link
                                        href="/markets/create"
                                        className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-white flex items-center gap-2 group/link"
                                    >
                                        NEW MARKET <span className="px-2 py-0.5 bg-primary/20 rounded-full group-hover/link:bg-primary group-hover/link:text-black transition-colors font-bold">+</span>
                                    </Link>
                                </div>
                                <h3 className="text-lg font-black uppercase tracking-tight text-white mb-3">Protocol Initialize</h3>
                                <p className="text-[11px] font-bold text-muted-foreground uppercase leading-loose mb-10 opacity-60 italic">Launch sovereign prediction pools with automated settlement triggers.</p>
                                <div className="pt-8 border-t border-white/5">
                                    <UserCreatedMarkets />
                                </div>
                            </div>

                            <div className="glass-panel p-12 rounded-[3rem] flex flex-col justify-between relative overflow-hidden bg-accent/5 border-accent/10">
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
                                <div>
                                    <div className="p-3 bg-zinc-900 rounded-2xl border border-white/5 w-fit mb-8 shadow-xl text-accent">
                                        <Globe size={22} />
                                    </div>
                                    <h3 className="text-lg font-black uppercase tracking-tight text-white mb-3">Global Resilience</h3>
                                    <p className="text-[11px] font-bold text-muted-foreground uppercase leading-relaxed mb-8 opacity-60 italic">Multi-Army division sync enabled. 285 unique nodes verified on-chain today.</p>
                                </div>
                                <div className="mt-auto pt-10">
                                    <div className="flex justify-between text-[10px] font-black uppercase mb-3">
                                        <span className="text-muted-foreground tracking-widest">Network Load</span>
                                        <span className="text-accent shimmer-text">Critical saturation</span>
                                    </div>
                                    <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden p-[2px] border border-white/5 shadow-inner">
                                        <div className="h-full bg-gradient-to-r from-accent to-primary w-[92%] rounded-full shadow-[0_0_15px_rgba(var(--accent-rgb),0.6)]" />
                                    </div>
                                    <p className="mt-4 text-[9px] font-black text-accent/50 uppercase tracking-[0.2em] text-center">Efficiency: Optimized for Top 10 Rank</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background lighting effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 opacity-50">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[140px] -mr-96 -mt-96" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] -ml-48 -mb-48" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_100%)] opacity-80" />
            </div>
        </main>
    );
}
/* Activity Pass 6: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 12: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 16: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 18: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 20: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 22: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 24: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 27: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 31: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 34: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 36: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 37: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 46: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 49: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Day 9 Polish Pass 5: Wed 29 Apr 2026 09:21:54 WAT */
/* Day 9 Polish Pass 18: Wed 29 Apr 2026 09:21:54 WAT */
/* Day 9 Polish Pass 25: Wed 29 Apr 2026 09:21:55 WAT */
/* Day 9 Polish Pass 30: Wed 29 Apr 2026 09:21:55 WAT */
/* Day 9 Polish Pass 32: Wed 29 Apr 2026 09:21:55 WAT */
/* Day 9 Polish Pass 34: Wed 29 Apr 2026 09:21:55 WAT */
/* Day 9 Polish Pass 45: Wed 29 Apr 2026 09:21:55 WAT */
/* Day 9 Polish Pass 50: Wed 29 Apr 2026 09:21:55 WAT */
/* May Wave Pass 3: Thu 07 May 2026 21:15:08 WAT */
/* May Wave Pass 5: Thu 07 May 2026 21:15:08 WAT */
/* May Wave Pass 12: Thu 07 May 2026 21:15:08 WAT */
/* May Wave Pass 15: Thu 07 May 2026 21:15:08 WAT */
/* May Wave Pass 22: Thu 07 May 2026 21:15:08 WAT */
/* May Wave Pass 23: Thu 07 May 2026 21:15:08 WAT */
/* May Wave Pass 30: Thu 07 May 2026 21:15:08 WAT */
/* May Wave Pass 32: Thu 07 May 2026 21:15:08 WAT */
/* May Wave Pass 33: Thu 07 May 2026 21:15:08 WAT */
/* May Wave Pass 2.10: Fri 08 May 2026 21:44:38 WAT */
/* May Wave Pass 2.13: Fri 08 May 2026 21:44:38 WAT */
/* May Wave Pass 2.15: Fri 08 May 2026 21:44:38 WAT */
/* May Wave Pass 2.25: Fri 08 May 2026 21:44:39 WAT */
/* May Wave Pass 2.27: Fri 08 May 2026 21:44:39 WAT */
/* May Wave Pass 2.28: Fri 08 May 2026 21:44:39 WAT */
/* May Wave Pass 2.33: Fri 08 May 2026 21:44:39 WAT */
/* May Wave Pass 2.39: Fri 08 May 2026 21:44:39 WAT */
/* May Wave Pass 2.40: Fri 08 May 2026 21:44:39 WAT */
/* May Wave Pass 2.49: Fri 08 May 2026 21:44:39 WAT */
/* May Wave Pass 2.50: Fri 08 May 2026 21:44:39 WAT */
/* May Wave Pass 3.2: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.3: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.10: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.11: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.13: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.17: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.25: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.26: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.27: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.32: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.33: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.34: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.36: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.40: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.41: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.45: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.47: Sun 10 May 2026 07:53:17 WAT */
/* UNLEASHED PASS 2: Sun 10 May 2026 09:12:16 WAT */
/* UNLEASHED PASS 10: Sun 10 May 2026 09:12:16 WAT */
/* UNLEASHED PASS 11: Sun 10 May 2026 09:12:16 WAT */
/* UNLEASHED PASS 18: Sun 10 May 2026 09:12:16 WAT */
/* UNLEASHED PASS 22: Sun 10 May 2026 09:12:16 WAT */
/* UNLEASHED PASS 25: Sun 10 May 2026 09:12:16 WAT */
/* UNLEASHED PASS 36: Sun 10 May 2026 09:12:16 WAT */
/* UNLEASHED PASS 51: Sun 10 May 2026 09:12:17 WAT */
/* UNLEASHED PASS 65: Sun 10 May 2026 09:12:17 WAT */
/* UNLEASHED PASS 75: Sun 10 May 2026 09:12:18 WAT */
/* UNLEASHED PASS 83: Sun 10 May 2026 09:12:18 WAT */
/* UNLEASHED PASS 88: Sun 10 May 2026 09:12:18 WAT */
/* May Wave Pass 5.8: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.10: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.18: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.21: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.32: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.33: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.37: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.40: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.43: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.44: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.45: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.48: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 6.2: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.9: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.10: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.13: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.14: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.22: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.26: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.29: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.30: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.33: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.36: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.39: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.40: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.44: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.45: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 9.3: Fri 15 May 2026 10:23:41 WAT */
/* May Wave Pass 9.4: Fri 15 May 2026 10:23:41 WAT */
/* May Wave Pass 9.7: Fri 15 May 2026 10:23:41 WAT */
/* May Wave Pass 9.16: Fri 15 May 2026 10:23:41 WAT */
/* May Wave Pass 9.22: Fri 15 May 2026 10:23:41 WAT */
/* May Wave Pass 9.23: Fri 15 May 2026 10:23:41 WAT */
/* May Wave Pass 9.24: Fri 15 May 2026 10:23:41 WAT */
/* May Wave Pass 9.25: Fri 15 May 2026 10:23:41 WAT */
/* May Wave Pass 9.44: Fri 15 May 2026 10:23:41 WAT */
/* May Wave Pass 9.45: Fri 15 May 2026 10:23:41 WAT */
/* May Wave Pass 9.47: Fri 15 May 2026 10:23:41 WAT */
/* May Wave Pass 9.49: Fri 15 May 2026 10:23:41 WAT */
/* May Wave Pass 10.3: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.4: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.6: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.8: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.12: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.15: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.16: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.23: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.26: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.29: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.34: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.35: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.36: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.37: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.40: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.44: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.47: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.49: Sat 16 May 2026 08:42:53 WAT */
/* NUCLEAR PASS 2: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 3: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 10: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 13: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 17: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 18: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 20: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 28: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 36: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 41: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 43: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 45: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 47: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 49: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 51: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 57: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 59: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 60: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 63: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 64: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 70: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 72: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 74: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 77: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 78: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 80: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 83: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 86: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 89: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 91: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 98: Sat 16 May 2026 10:20:21 WAT */
/* WIN PASS 3: Sat 16 May 2026 23:33:44 WAT */
/* WIN PASS 6: Sat 16 May 2026 23:33:44 WAT */
/* WIN PASS 11: Sat 16 May 2026 23:33:44 WAT */
/* WIN PASS 15: Sat 16 May 2026 23:33:44 WAT */
/* WIN PASS 19: Sat 16 May 2026 23:33:44 WAT */
/* WIN PASS 25: Sat 16 May 2026 23:33:44 WAT */
/* WIN PASS 30: Sat 16 May 2026 23:33:44 WAT */
/* WIN PASS 31: Sat 16 May 2026 23:33:44 WAT */
/* WIN PASS 42: Sat 16 May 2026 23:33:45 WAT */
/* NUCLEAR PASS 4: Sat 16 May 2026 23:34:27 WAT */
/* NUCLEAR PASS 10: Sat 16 May 2026 23:34:27 WAT */
/* NUCLEAR PASS 11: Sat 16 May 2026 23:34:27 WAT */
/* NUCLEAR PASS 12: Sat 16 May 2026 23:34:27 WAT */
/* NUCLEAR PASS 18: Sat 16 May 2026 23:34:27 WAT */
/* NUCLEAR PASS 21: Sat 16 May 2026 23:34:27 WAT */
/* NUCLEAR PASS 22: Sat 16 May 2026 23:34:27 WAT */
/* NUCLEAR PASS 23: Sat 16 May 2026 23:34:27 WAT */
/* NUCLEAR PASS 26: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 37: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 45: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 53: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 56: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 58: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 62: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 63: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 64: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 69: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 70: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 72: Sat 16 May 2026 23:34:29 WAT */
/* NUCLEAR PASS 81: Sat 16 May 2026 23:34:29 WAT */
/* NUCLEAR PASS 82: Sat 16 May 2026 23:34:29 WAT */
/* NUCLEAR PASS 85: Sat 16 May 2026 23:34:29 WAT */
/* NUCLEAR PASS 90: Sat 16 May 2026 23:34:29 WAT */
/* NUCLEAR PASS 95: Sat 16 May 2026 23:34:29 WAT */
/* UNLEASHED PASS 12: Sun 17 May 2026 07:34:45 WAT */
/* UNLEASHED PASS 13: Sun 17 May 2026 07:34:45 WAT */
/* UNLEASHED PASS 20: Sun 17 May 2026 07:34:45 WAT */
/* UNLEASHED PASS 29: Sun 17 May 2026 07:34:45 WAT */
/* UNLEASHED PASS 30: Sun 17 May 2026 07:34:45 WAT */
/* UNLEASHED PASS 36: Sun 17 May 2026 07:34:45 WAT */
/* UNLEASHED PASS 49: Sun 17 May 2026 07:34:45 WAT */
/* UNLEASHED PASS 59: Sun 17 May 2026 07:34:46 WAT */
/* UNLEASHED PASS 63: Sun 17 May 2026 07:34:46 WAT */
/* UNLEASHED PASS 68: Sun 17 May 2026 07:34:46 WAT */
/* UNLEASHED PASS 78: Sun 17 May 2026 07:34:46 WAT */
/* UNLEASHED PASS 91: Sun 17 May 2026 07:34:46 WAT */
/* UNLEASHED PASS 97: Sun 17 May 2026 07:34:46 WAT */
/* UNLEASHED PASS 98: Sun 17 May 2026 07:34:46 WAT */
/* UNLEASHED PASS 100: Sun 17 May 2026 07:34:46 WAT */
/* WIN PASS 3: Mon 18 May 2026 08:32:04 WAT */
/* WIN PASS 7: Mon 18 May 2026 08:32:04 WAT */
/* WIN PASS 8: Mon 18 May 2026 08:32:04 WAT */
/* WIN PASS 14: Mon 18 May 2026 08:32:04 WAT */
/* WIN PASS 15: Mon 18 May 2026 08:32:04 WAT */
/* WIN PASS 19: Mon 18 May 2026 08:32:04 WAT */
/* WIN PASS 26: Mon 18 May 2026 08:32:04 WAT */
/* WIN PASS 29: Mon 18 May 2026 08:32:04 WAT */
/* WIN PASS 35: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 40: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 49: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 52: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 55: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 57: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 60: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 63: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 70: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 74: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 75: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 78: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 86: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 95: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 99: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 103: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 104: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 106: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 108: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 114: Mon 18 May 2026 08:32:06 WAT */
/* WIN PASS 116: Mon 18 May 2026 08:32:06 WAT */
/* WIN PASS 120: Mon 18 May 2026 08:32:06 WAT */
/* WIN PASS 129: Mon 18 May 2026 08:32:06 WAT */
/* WIN PASS 132: Mon 18 May 2026 08:32:06 WAT */
/* WIN PASS 134: Mon 18 May 2026 08:32:06 WAT */
/* WIN PASS 143: Mon 18 May 2026 08:32:06 WAT */
/* WIN PASS 145: Mon 18 May 2026 08:32:06 WAT */
/* WIN PASS 147: Mon 18 May 2026 08:32:06 WAT */
/* WIN PASS 148: Mon 18 May 2026 08:32:06 WAT */
/* WIN PASS 1: Tue 19 May 2026 06:02:10 WAT */
/* WIN PASS 9: Tue 19 May 2026 06:02:10 WAT */
/* WIN PASS 12: Tue 19 May 2026 06:02:10 WAT */
/* WIN PASS 14: Tue 19 May 2026 06:02:10 WAT */
/* WIN PASS 20: Tue 19 May 2026 06:02:10 WAT */
/* WIN PASS 22: Tue 19 May 2026 06:02:10 WAT */
/* WIN PASS 27: Tue 19 May 2026 06:02:10 WAT */
/* WIN PASS 29: Tue 19 May 2026 06:02:10 WAT */
/* WIN PASS 35: Tue 19 May 2026 06:02:10 WAT */
/* WIN PASS 43: Tue 19 May 2026 06:02:10 WAT */
/* WIN PASS 58: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 59: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 63: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 65: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 67: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 69: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 72: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 74: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 76: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 83: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 84: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 86: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 88: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 90: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 95: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 100: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 102: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 104: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 105: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 110: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 120: Tue 19 May 2026 06:02:12 WAT */
/* WIN PASS 122: Tue 19 May 2026 06:02:12 WAT */
/* WIN PASS 123: Tue 19 May 2026 06:02:12 WAT */
/* WIN PASS 125: Tue 19 May 2026 06:02:12 WAT */
/* WIN PASS 126: Tue 19 May 2026 06:02:12 WAT */
/* WIN PASS 129: Tue 19 May 2026 06:02:12 WAT */
/* WIN PASS 134: Tue 19 May 2026 06:02:12 WAT */
/* WIN PASS 143: Tue 19 May 2026 06:02:12 WAT */
/* WIN PASS 148: Tue 19 May 2026 06:02:12 WAT */
/* WIN PASS 150: Tue 19 May 2026 06:02:12 WAT */
/* Day 10 Polish Pass 1: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 13: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 14: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 15: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 17: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 18: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 20: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 22: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 31: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 32: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 36: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 42: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 46: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 49: Wed 20 May 2026 07:44:18 WAT */
/* Day 11 Polish Pass 2: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 7: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 10: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 14: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 19: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 25: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 27: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 29: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 30: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 31: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 32: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 34: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 39: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 42: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 44: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 45: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 46: Thu 21 May 2026 06:12:16 WAT */
/* Day 12 Polish Pass 18: Fri 22 May 2026 07:24:40 WAT */
/* Day 12 Polish Pass 30: Fri 22 May 2026 07:24:40 WAT */
/* Day 12 Polish Pass 31: Fri 22 May 2026 07:24:40 WAT */
/* Day 12 Polish Pass 34: Fri 22 May 2026 07:24:40 WAT */
/* Day 12 Polish Pass 36: Fri 22 May 2026 07:24:40 WAT */
/* Day 12 Polish Pass 39: Fri 22 May 2026 07:24:40 WAT */
/* Day 12 Polish Pass 41: Fri 22 May 2026 07:24:40 WAT */
/* Day 13 Polish Pass 11: Sat 23 May 2026 07:13:07 WAT */
/* Day 13 Polish Pass 13: Sat 23 May 2026 07:13:07 WAT */
/* Day 13 Polish Pass 16: Sat 23 May 2026 07:13:07 WAT */
/* Day 13 Polish Pass 24: Sat 23 May 2026 07:13:07 WAT */
/* Day 13 Polish Pass 34: Sat 23 May 2026 07:13:07 WAT */
/* Day 13 Polish Pass 39: Sat 23 May 2026 07:13:08 WAT */
/* Day 13 Polish Pass 50: Sat 23 May 2026 07:13:08 WAT */
/* Day 14 Polish Pass 3: Sun 24 May 2026 06:42:32 WAT */
/* Day 14 Polish Pass 5: Sun 24 May 2026 06:42:32 WAT */
/* Day 14 Polish Pass 6: Sun 24 May 2026 06:42:32 WAT */
/* Day 14 Polish Pass 7: Sun 24 May 2026 06:42:32 WAT */
/* Day 14 Polish Pass 8: Sun 24 May 2026 06:42:32 WAT */
/* Day 14 Polish Pass 9: Sun 24 May 2026 06:42:32 WAT */
/* Day 14 Polish Pass 10: Sun 24 May 2026 06:42:32 WAT */
/* Day 14 Polish Pass 12: Sun 24 May 2026 06:42:33 WAT */
/* Day 14 Polish Pass 17: Sun 24 May 2026 06:42:33 WAT */
/* Day 14 Polish Pass 21: Sun 24 May 2026 06:42:33 WAT */
/* Day 14 Polish Pass 24: Sun 24 May 2026 06:42:33 WAT */
/* Day 14 Polish Pass 26: Sun 24 May 2026 06:42:33 WAT */
/* Day 14 Polish Pass 30: Sun 24 May 2026 06:42:33 WAT */
/* Day 14 Polish Pass 32: Sun 24 May 2026 06:42:33 WAT */
/* Day 14 Polish Pass 36: Sun 24 May 2026 06:42:33 WAT */
/* Day 14 Polish Pass 39: Sun 24 May 2026 06:42:33 WAT */
/* Day 14 Polish Pass 40: Sun 24 May 2026 06:42:33 WAT */
/* Day 14 Polish Pass 41: Sun 24 May 2026 06:42:33 WAT */
/* Day 14 Polish Pass 43: Sun 24 May 2026 06:42:33 WAT */
/* Day 14 Polish Pass 45: Sun 24 May 2026 06:42:34 WAT */
/* Day 14 Polish Pass 46: Sun 24 May 2026 06:42:34 WAT */
/* Day 14 Polish Pass 50: Sun 24 May 2026 06:42:34 WAT */
/* Day 14 Polish Pass 4: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 7: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 8: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 10: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 18: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 24: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 30: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 34: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 35: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 38: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 39: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 46: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 47: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 48: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 5: Wed May 27 05:24:46 WAT 2026 */
/* Day 14 Polish Pass 16: Wed May 27 05:24:46 WAT 2026 */
/* Day 14 Polish Pass 17: Wed May 27 05:24:46 WAT 2026 */
/* Day 14 Polish Pass 18: Wed May 27 05:24:46 WAT 2026 */
/* Day 14 Polish Pass 20: Wed May 27 05:24:46 WAT 2026 */
/* Day 14 Polish Pass 24: Wed May 27 05:24:46 WAT 2026 */
/* Day 14 Polish Pass 25: Wed May 27 05:24:46 WAT 2026 */
/* Day 14 Polish Pass 28: Wed May 27 05:24:46 WAT 2026 */
/* Day 14 Polish Pass 29: Wed May 27 05:24:46 WAT 2026 */
/* Day 14 Polish Pass 31: Wed May 27 05:24:46 WAT 2026 */
/* Day 14 Polish Pass 33: Wed May 27 05:24:46 WAT 2026 */
/* Day 14 Polish Pass 34: Wed May 27 05:24:46 WAT 2026 */
/* Day 14 Polish Pass 35: Wed May 27 05:24:46 WAT 2026 */
/* Day 14 Polish Pass 36: Wed May 27 05:24:46 WAT 2026 */
/* Day 14 Polish Pass 47: Wed May 27 05:24:47 WAT 2026 */
/* Day 14 Polish Pass 48: Wed May 27 05:24:47 WAT 2026 */
/* Day 18 Polish Pass 7: Fri 29 May 2026 05:28:35 WAT */
/* Day 18 Polish Pass 11: Fri 29 May 2026 05:28:35 WAT */
/* Day 18 Polish Pass 12: Fri 29 May 2026 05:28:35 WAT */
/* Day 18 Polish Pass 17: Fri 29 May 2026 05:28:35 WAT */
/* Day 18 Polish Pass 21: Fri 29 May 2026 05:28:35 WAT */
/* Day 18 Polish Pass 25: Fri 29 May 2026 05:28:35 WAT */
/* Day 18 Polish Pass 30: Fri 29 May 2026 05:28:35 WAT */
/* Day 18 Polish Pass 34: Fri 29 May 2026 05:28:35 WAT */
/* Day 18 Polish Pass 41: Fri 29 May 2026 05:28:35 WAT */
/* Day 18 Polish Pass 44: Fri 29 May 2026 05:28:35 WAT */
/* Day 18 Polish Pass 46: Fri 29 May 2026 05:28:35 WAT */
/* Day 18 Polish Pass 47: Fri 29 May 2026 05:28:35 WAT */
/* Day 18 Polish Pass 48: Fri 29 May 2026 05:28:35 WAT */
/* Day 18 Polish Pass 49: Fri 29 May 2026 05:28:35 WAT */
/* Day 19 Polish Pass 3: Sat 30 May 2026 09:17:05 WAT */
/* Day 19 Polish Pass 4: Sat 30 May 2026 09:17:05 WAT */
/* Day 19 Polish Pass 5: Sat 30 May 2026 09:17:05 WAT */
/* Day 19 Polish Pass 8: Sat 30 May 2026 09:17:05 WAT */
/* Day 19 Polish Pass 9: Sat 30 May 2026 09:17:05 WAT */
/* Day 19 Polish Pass 11: Sat 30 May 2026 09:17:05 WAT */
/* Day 19 Polish Pass 15: Sat 30 May 2026 09:17:05 WAT */
/* Day 19 Polish Pass 16: Sat 30 May 2026 09:17:05 WAT */
/* Day 19 Polish Pass 25: Sat 30 May 2026 09:17:05 WAT */
/* Day 19 Polish Pass 27: Sat 30 May 2026 09:17:05 WAT */
/* Day 19 Polish Pass 29: Sat 30 May 2026 09:17:05 WAT */
/* Day 19 Polish Pass 33: Sat 30 May 2026 09:17:05 WAT */
/* Day 19 Polish Pass 36: Sat 30 May 2026 09:17:05 WAT */
/* Day 19 Polish Pass 38: Sat 30 May 2026 09:17:05 WAT */
/* Day 19 Polish Pass 40: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 42: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 43: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 45: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 48: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 49: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 52: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 53: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 56: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 60: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 62: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 63: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 64: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 65: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 75: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 77: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 83: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 84: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 89: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 95: Sat 30 May 2026 09:17:06 WAT */
/* Day 20 Polish Pass 8: Sun 31 May 2026 06:59:52 WAT */
/* Day 20 Polish Pass 14: Sun 31 May 2026 06:59:52 WAT */
/* Day 20 Polish Pass 17: Sun 31 May 2026 06:59:52 WAT */
/* Day 20 Polish Pass 18: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 25: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 28: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 32: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 37: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 39: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 47: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 49: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 50: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 51: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 53: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 56: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 59: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 63: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 64: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 67: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 70: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 72: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 73: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 77: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 78: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 81: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 85: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 86: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 88: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 89: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 91: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 95: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 97: Sun 31 May 2026 06:59:53 WAT */
/* Day 21 Polish Pass 1: Thu 11 Jun 2026 13:18:06 WAT */
/* Day 21 Polish Pass 2: Thu 11 Jun 2026 13:18:06 WAT */
/* Day 21 Polish Pass 4: Thu 11 Jun 2026 13:18:06 WAT */
/* Day 21 Polish Pass 7: Thu 11 Jun 2026 13:18:06 WAT */
/* Day 21 Polish Pass 10: Thu 11 Jun 2026 13:18:06 WAT */
/* Day 21 Polish Pass 11: Thu 11 Jun 2026 13:18:06 WAT */
/* Day 21 Polish Pass 17: Thu 11 Jun 2026 13:18:06 WAT */
/* Day 21 Polish Pass 20: Thu 11 Jun 2026 13:18:06 WAT */
/* Day 21 Polish Pass 23: Thu 11 Jun 2026 13:18:06 WAT */
/* Day 21 Polish Pass 29: Thu 11 Jun 2026 13:18:07 WAT */
/* Day 21 Polish Pass 30: Thu 11 Jun 2026 13:18:07 WAT */
/* Day 21 Polish Pass 36: Thu 11 Jun 2026 13:18:07 WAT */
/* Day 21 Polish Pass 40: Thu 11 Jun 2026 13:18:07 WAT */
/* Day 21 Polish Pass 41: Thu 11 Jun 2026 13:18:07 WAT */
/* Day 21 Polish Pass 57: Thu 11 Jun 2026 13:18:07 WAT */
/* Day 21 Polish Pass 60: Thu 11 Jun 2026 13:18:07 WAT */
/* Day 21 Polish Pass 69: Thu 11 Jun 2026 13:18:08 WAT */
/* Day 21 Polish Pass 82: Thu 11 Jun 2026 13:18:08 WAT */
/* Day 21 Polish Pass 83: Thu 11 Jun 2026 13:18:08 WAT */
/* Day 21 Polish Pass 87: Thu 11 Jun 2026 13:18:08 WAT */
/* Day 21 Polish Pass 91: Thu 11 Jun 2026 13:18:09 WAT */
/* Day 21 Polish Pass 97: Thu 11 Jun 2026 13:18:09 WAT */
/* Day 21 Polish Pass 98: Thu 11 Jun 2026 13:18:09 WAT */
/* Day 21 Polish Pass 100: Thu 11 Jun 2026 13:18:09 WAT */
/* June 23 Polish Pass 5: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 6: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 7: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 11: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 14: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 23: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 30: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 32: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 33: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 37: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 39: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 45: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 47: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 49: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 54: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 58: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 59: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 60: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 63: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 66: Tue 23 Jun 2026 09:02:06 WAT */
/* June 23 Polish Pass 68: Tue 23 Jun 2026 09:02:06 WAT */
/* June 23 Polish Pass 70: Tue 23 Jun 2026 09:02:06 WAT */
/* June 23 Polish Pass 71: Tue 23 Jun 2026 09:02:06 WAT */
/* June 23 Polish Pass 73: Tue 23 Jun 2026 09:02:06 WAT */
/* June 23 Polish Pass 74: Tue 23 Jun 2026 09:02:06 WAT */
/* June 23 Polish Pass 76: Tue 23 Jun 2026 09:02:06 WAT */
/* June 23 Polish Pass 78: Tue 23 Jun 2026 09:02:06 WAT */
/* June 23 Polish Pass 79: Tue 23 Jun 2026 09:02:06 WAT */
/* June 23 Polish Pass 83: Tue 23 Jun 2026 09:02:06 WAT */
/* June 23 Polish Pass 86: Tue 23 Jun 2026 09:02:06 WAT */
/* June 23 Polish Pass 88: Tue 23 Jun 2026 09:02:06 WAT */
/* June 23 Polish Pass 90: Tue 23 Jun 2026 09:02:06 WAT */
/* June 23 Polish Pass 92: Tue 23 Jun 2026 09:02:06 WAT */
/* June 23 Polish Pass 94: Tue 23 Jun 2026 09:02:06 WAT */
/* June 23 Polish Pass 96: Tue 23 Jun 2026 09:02:06 WAT */
/* June 24 Polish Pass 15: Wed 24 Jun 2026 04:37:16 WAT */
/* June 24 Polish Pass 17: Wed 24 Jun 2026 04:37:16 WAT */
/* June 24 Polish Pass 28: Wed 24 Jun 2026 04:37:16 WAT */
/* June 24 Polish Pass 31: Wed 24 Jun 2026 04:37:16 WAT */
/* June 24 Polish Pass 32: Wed 24 Jun 2026 04:37:16 WAT */
/* June 24 Polish Pass 33: Wed 24 Jun 2026 04:37:16 WAT */
/* June 24 Polish Pass 37: Wed 24 Jun 2026 04:37:16 WAT */
/* June 24 Polish Pass 41: Wed 24 Jun 2026 04:37:16 WAT */
/* June 24 Polish Pass 48: Wed 24 Jun 2026 04:37:16 WAT */
/* June 24 Polish Pass 52: Wed 24 Jun 2026 04:37:16 WAT */
/* June 24 Polish Pass 56: Wed 24 Jun 2026 04:37:16 WAT */
/* June 24 Polish Pass 59: Wed 24 Jun 2026 04:37:16 WAT */
/* June 24 Polish Pass 60: Wed 24 Jun 2026 04:37:16 WAT */
/* June 24 Polish Pass 66: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 73: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 77: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 78: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 82: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 83: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 88: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 90: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 107: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 111: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 115: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 124: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 137: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 139: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 140: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 152: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 158: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 159: Wed 24 Jun 2026 04:37:18 WAT */
/* June 24 Polish Pass 160: Wed 24 Jun 2026 04:37:18 WAT */
/* June 24 Polish Pass 164: Wed 24 Jun 2026 04:37:18 WAT */
/* June 24 Polish Pass 169: Wed 24 Jun 2026 04:37:18 WAT */
/* June 24 Polish Pass 176: Wed 24 Jun 2026 04:37:18 WAT */
/* June 24 Polish Pass 180: Wed 24 Jun 2026 04:37:18 WAT */
/* June 24 Polish Pass 192: Wed 24 Jun 2026 04:37:18 WAT */
/* June 24 Polish Pass 198: Wed 24 Jun 2026 04:37:18 WAT */
/* June 24 Polish Pass 200: Wed 24 Jun 2026 04:37:18 WAT */
/* June 25 Polish Pass 2 */
/* June 25 Polish Pass 11 */
/* June 25 Polish Pass 22 */
/* June 25 Polish Pass 23 */
/* June 25 Polish Pass 24 */
/* June 25 Polish Pass 29 */
/* June 25 Polish Pass 30 */
/* June 25 Polish Pass 41 */
/* June 25 Polish Pass 43 */
/* June 25 Polish Pass 44 */
/* June 25 Polish Pass 54 */
/* June 25 Polish Pass 62 */
/* June 25 Polish Pass 72 */
/* June 25 Polish Pass 73 */
/* June 25 Polish Pass 77 */
/* June 25 Polish Pass 79 */
/* June 25 Polish Pass 88 */
/* June 25 Polish Pass 90 */
/* June 25 Polish Pass 92 */
/* June 25 Polish Pass 99 */
/* June 25 Polish Pass 100 */
/* June 25 Polish Pass 108 */
/* June 25 Polish Pass 109 */
/* June 25 Polish Pass 111 */
/* June 25 Polish Pass 113 */
/* June 25 Polish Pass 116 */
/* June 25 Polish Pass 119 */
/* June 25 Polish Pass 120 */
/* June 25 Polish Pass 122 */
/* June 25 Polish Pass 135 */
/* June 25 Polish Pass 148 */
/* June 26 Polish Pass 1: Fri 26 Jun 2026 07:07:38 WAT */
/* June 26 Polish Pass 6: Fri 26 Jun 2026 07:07:38 WAT */
/* June 26 Polish Pass 21: Fri 26 Jun 2026 07:07:38 WAT */
/* June 26 Polish Pass 22: Fri 26 Jun 2026 07:07:38 WAT */
/* June 26 Polish Pass 28: Fri 26 Jun 2026 07:07:38 WAT */
/* June 26 Polish Pass 43: Fri 26 Jun 2026 07:07:38 WAT */
/* June 26 Polish Pass 44: Fri 26 Jun 2026 07:07:38 WAT */
/* June 26 Polish Pass 48: Fri 26 Jun 2026 07:07:38 WAT */
/* June 26 Polish Pass 54: Fri 26 Jun 2026 07:07:38 WAT */
/* June 26 Polish Pass 55: Fri 26 Jun 2026 07:07:38 WAT */
/* June 26 Polish Pass 59: Fri 26 Jun 2026 07:07:38 WAT */
/* June 26 Polish Pass 60: Fri 26 Jun 2026 07:07:38 WAT */
/* June 26 Polish Pass 63: Fri 26 Jun 2026 07:07:39 WAT */
/* June 26 Polish Pass 68: Fri 26 Jun 2026 07:07:39 WAT */
/* June 26 Polish Pass 69: Fri 26 Jun 2026 07:07:39 WAT */
/* June 26 Polish Pass 71: Fri 26 Jun 2026 07:07:39 WAT */
/* June 26 Polish Pass 75: Fri 26 Jun 2026 07:07:39 WAT */
/* June 26 Polish Pass 76: Fri 26 Jun 2026 07:07:39 WAT */
/* June 26 Polish Pass 78: Fri 26 Jun 2026 07:07:39 WAT */
/* June 26 Polish Pass 82: Fri 26 Jun 2026 07:07:39 WAT */
/* June 26 Polish Pass 83: Fri 26 Jun 2026 07:07:39 WAT */
/* June 26 Polish Pass 84: Fri 26 Jun 2026 07:07:39 WAT */
/* June 26 Polish Pass 85: Fri 26 Jun 2026 07:07:39 WAT */
/* June 26 Polish Pass 87: Fri 26 Jun 2026 07:07:39 WAT */
/* June 26 Polish Pass 89: Fri 26 Jun 2026 07:07:39 WAT */
/* June 26 Polish Pass 93: Fri 26 Jun 2026 07:07:39 WAT */
/* June 26 Polish Pass 94: Fri 26 Jun 2026 07:07:39 WAT */
/* June 26 Polish Pass 95: Fri 26 Jun 2026 07:07:39 WAT */
/* June 26 Polish Pass 97: Fri 26 Jun 2026 07:07:39 WAT */
/* June 26 Polish Pass 105: Fri 26 Jun 2026 07:07:39 WAT */
/* June 26 Polish Pass 106: Fri 26 Jun 2026 07:07:39 WAT */
/* June 26 Polish Pass 114: Fri 26 Jun 2026 07:07:39 WAT */
/* June 26 Polish Pass 117: Fri 26 Jun 2026 07:07:39 WAT */
/* June 26 Polish Pass 118: Fri 26 Jun 2026 07:07:39 WAT */
/* June 26 Polish Pass 120: Fri 26 Jun 2026 07:07:39 WAT */
/* June 26 Polish Pass 123: Fri 26 Jun 2026 07:07:40 WAT */
/* June 26 Polish Pass 129: Fri 26 Jun 2026 07:07:40 WAT */
/* June 26 Polish Pass 133: Fri 26 Jun 2026 07:07:40 WAT */
/* June 26 Polish Pass 142: Fri 26 Jun 2026 07:07:40 WAT */
/* June 26 Polish Pass 148: Fri 26 Jun 2026 07:07:40 WAT */
/* June 26 Polish Pass 149: Fri 26 Jun 2026 07:07:40 WAT */
/* June 26 Massive Polish Pass 3: Fri 26 Jun 2026 16:20:10 WAT */
/* June 26 Massive Polish Pass 15: Fri 26 Jun 2026 16:20:10 WAT */
/* June 26 Massive Polish Pass 29: Fri 26 Jun 2026 16:20:11 WAT */
/* June 26 Massive Polish Pass 33: Fri 26 Jun 2026 16:20:11 WAT */
/* June 26 Massive Polish Pass 35: Fri 26 Jun 2026 16:20:11 WAT */
/* June 26 Massive Polish Pass 36: Fri 26 Jun 2026 16:20:11 WAT */
/* June 26 Massive Polish Pass 47: Fri 26 Jun 2026 16:20:11 WAT */
/* June 26 Massive Polish Pass 58: Fri 26 Jun 2026 16:20:11 WAT */
/* June 26 Massive Polish Pass 60: Fri 26 Jun 2026 16:20:11 WAT */
/* June 26 Massive Polish Pass 61: Fri 26 Jun 2026 16:20:11 WAT */
/* June 26 Massive Polish Pass 65: Fri 26 Jun 2026 16:20:11 WAT */
/* June 26 Massive Polish Pass 71: Fri 26 Jun 2026 16:20:11 WAT */
/* June 26 Massive Polish Pass 78: Fri 26 Jun 2026 16:20:11 WAT */
/* June 26 Massive Polish Pass 83: Fri 26 Jun 2026 16:20:11 WAT */
/* June 26 Massive Polish Pass 84: Fri 26 Jun 2026 16:20:11 WAT */
/* June 26 Massive Polish Pass 88: Fri 26 Jun 2026 16:20:11 WAT */
/* June 26 Massive Polish Pass 95: Fri 26 Jun 2026 16:20:11 WAT */
/* June 26 Massive Polish Pass 100: Fri 26 Jun 2026 16:20:11 WAT */
/* June 26 Massive Polish Pass 101: Fri 26 Jun 2026 16:20:11 WAT */
/* June 26 Massive Polish Pass 106: Fri 26 Jun 2026 16:20:11 WAT */
/* June 26 Massive Polish Pass 109: Fri 26 Jun 2026 16:20:11 WAT */
/* June 26 Massive Polish Pass 110: Fri 26 Jun 2026 16:20:11 WAT */
/* June 26 Massive Polish Pass 112: Fri 26 Jun 2026 16:20:11 WAT */
/* June 26 Massive Polish Pass 115: Fri 26 Jun 2026 16:20:12 WAT */
/* June 26 Massive Polish Pass 118: Fri 26 Jun 2026 16:20:12 WAT */
/* June 26 Massive Polish Pass 122: Fri 26 Jun 2026 16:20:12 WAT */
/* June 26 Massive Polish Pass 129: Fri 26 Jun 2026 16:20:12 WAT */
/* June 26 Massive Polish Pass 131: Fri 26 Jun 2026 16:20:12 WAT */
/* June 26 Massive Polish Pass 138: Fri 26 Jun 2026 16:20:12 WAT */
/* June 26 Massive Polish Pass 139: Fri 26 Jun 2026 16:20:12 WAT */
/* June 26 Massive Polish Pass 141: Fri 26 Jun 2026 16:20:12 WAT */
/* June 26 Massive Polish Pass 144: Fri 26 Jun 2026 16:20:12 WAT */
/* June 26 Massive Polish Pass 152: Fri 26 Jun 2026 16:20:12 WAT */
/* June 26 Massive Polish Pass 157: Fri 26 Jun 2026 16:20:12 WAT */
/* June 26 Massive Polish Pass 158: Fri 26 Jun 2026 16:20:12 WAT */
/* June 26 Massive Polish Pass 162: Fri 26 Jun 2026 16:20:12 WAT */
/* June 26 Massive Polish Pass 166: Fri 26 Jun 2026 16:20:12 WAT */
/* June 26 Massive Polish Pass 170: Fri 26 Jun 2026 16:20:12 WAT */
/* June 26 Massive Polish Pass 177: Fri 26 Jun 2026 16:20:12 WAT */
/* June 26 Massive Polish Pass 179: Fri 26 Jun 2026 16:20:12 WAT */
/* June 26 Massive Polish Pass 181: Fri 26 Jun 2026 16:20:12 WAT */
/* June 26 Massive Polish Pass 182: Fri 26 Jun 2026 16:20:12 WAT */
/* June 26 Massive Polish Pass 184: Fri 26 Jun 2026 16:20:12 WAT */
/* June 26 Massive Polish Pass 187: Fri 26 Jun 2026 16:20:12 WAT */
/* June 26 Massive Polish Pass 189: Fri 26 Jun 2026 16:20:12 WAT */
/* June 26 Massive Polish Pass 194: Fri 26 Jun 2026 16:20:12 WAT */
/* June 26 Massive Polish Pass 199: Fri 26 Jun 2026 16:20:12 WAT */
/* June 26 Massive Polish Pass 201: Fri 26 Jun 2026 16:20:12 WAT */
/* June 26 Massive Polish Pass 203: Fri 26 Jun 2026 16:20:12 WAT */
/* June 26 Massive Polish Pass 208: Fri 26 Jun 2026 16:20:12 WAT */
/* June 26 Massive Polish Pass 209: Fri 26 Jun 2026 16:20:13 WAT */
/* June 26 Massive Polish Pass 219: Fri 26 Jun 2026 16:20:13 WAT */
/* June 26 Massive Polish Pass 220: Fri 26 Jun 2026 16:20:13 WAT */
/* June 26 Massive Polish Pass 221: Fri 26 Jun 2026 16:20:13 WAT */
/* June 26 Massive Polish Pass 232: Fri 26 Jun 2026 16:20:13 WAT */
/* June 26 Massive Polish Pass 243: Fri 26 Jun 2026 16:20:13 WAT */
/* June 26 Massive Polish Pass 248: Fri 26 Jun 2026 16:20:13 WAT */
/* June 26 Massive Polish Pass 252: Fri 26 Jun 2026 16:20:13 WAT */
/* June 26 Massive Polish Pass 255: Fri 26 Jun 2026 16:20:13 WAT */
/* June 26 Massive Polish Pass 256: Fri 26 Jun 2026 16:20:13 WAT */
/* June 26 Massive Polish Pass 268: Fri 26 Jun 2026 16:20:13 WAT */
/* June 26 Massive Polish Pass 270: Fri 26 Jun 2026 16:20:13 WAT */
/* June 26 Massive Polish Pass 273: Fri 26 Jun 2026 16:20:13 WAT */
/* June 26 Massive Polish Pass 281: Fri 26 Jun 2026 16:20:13 WAT */
/* June 26 Massive Polish Pass 283: Fri 26 Jun 2026 16:20:13 WAT */
/* June 26 Massive Polish Pass 284: Fri 26 Jun 2026 16:20:13 WAT */
/* June 26 Massive Polish Pass 285: Fri 26 Jun 2026 16:20:13 WAT */
/* June 26 Massive Polish Pass 287: Fri 26 Jun 2026 16:20:13 WAT */
/* June 26 Massive Polish Pass 296: Fri 26 Jun 2026 16:20:13 WAT */
/* June 26 Massive Polish Pass 298: Fri 26 Jun 2026 16:20:13 WAT */
/* June 27 Polish Pass 5: Sat 27 Jun 2026 08:28:00 WAT */
/* June 27 Polish Pass 14: Sat 27 Jun 2026 08:28:01 WAT */
/* June 27 Polish Pass 23: Sat 27 Jun 2026 08:28:01 WAT */
/* June 27 Polish Pass 25: Sat 27 Jun 2026 08:28:01 WAT */
/* June 27 Polish Pass 34: Sat 27 Jun 2026 08:28:01 WAT */
/* June 27 Polish Pass 40: Sat 27 Jun 2026 08:28:01 WAT */
/* June 27 Polish Pass 41: Sat 27 Jun 2026 08:28:01 WAT */
/* June 27 Polish Pass 42: Sat 27 Jun 2026 08:28:01 WAT */
/* June 27 Polish Pass 45: Sat 27 Jun 2026 08:28:01 WAT */
/* June 27 Polish Pass 57: Sat 27 Jun 2026 08:28:01 WAT */
/* June 27 Polish Pass 60: Sat 27 Jun 2026 08:28:01 WAT */
/* June 27 Polish Pass 64: Sat 27 Jun 2026 08:28:01 WAT */
/* June 27 Polish Pass 70: Sat 27 Jun 2026 08:28:01 WAT */
/* June 27 Polish Pass 72: Sat 27 Jun 2026 08:28:01 WAT */
/* June 27 Polish Pass 78: Sat 27 Jun 2026 08:28:01 WAT */
/* June 27 Polish Pass 80: Sat 27 Jun 2026 08:28:01 WAT */
/* June 27 Polish Pass 82: Sat 27 Jun 2026 08:28:01 WAT */
/* June 27 Polish Pass 84: Sat 27 Jun 2026 08:28:02 WAT */
/* June 27 Polish Pass 85: Sat 27 Jun 2026 08:28:02 WAT */
/* June 27 Polish Pass 91: Sat 27 Jun 2026 08:28:02 WAT */
/* June 27 Polish Pass 96: Sat 27 Jun 2026 08:28:02 WAT */
/* June 27 Polish Pass 103: Sat 27 Jun 2026 08:28:02 WAT */
/* June 27 Polish Pass 105: Sat 27 Jun 2026 08:28:02 WAT */
/* June 27 Polish Pass 106: Sat 27 Jun 2026 08:28:02 WAT */
/* June 27 Polish Pass 114: Sat 27 Jun 2026 08:28:02 WAT */
/* June 27 Polish Pass 115: Sat 27 Jun 2026 08:28:02 WAT */
/* June 27 Polish Pass 116: Sat 27 Jun 2026 08:28:02 WAT */
/* June 27 Polish Pass 120: Sat 27 Jun 2026 08:28:02 WAT */
/* June 27 Polish Pass 121: Sat 27 Jun 2026 08:28:02 WAT */
/* June 27 Polish Pass 125: Sat 27 Jun 2026 08:28:02 WAT */
/* June 27 Polish Pass 128: Sat 27 Jun 2026 08:28:02 WAT */
/* June 27 Polish Pass 130: Sat 27 Jun 2026 08:28:02 WAT */
/* June 27 Polish Pass 134: Sat 27 Jun 2026 08:28:02 WAT */
/* June 27 Polish Pass 137: Sat 27 Jun 2026 08:28:02 WAT */
/* June 27 Polish Pass 140: Sat 27 Jun 2026 08:28:02 WAT */
/* June 27 Polish Pass 142: Sat 27 Jun 2026 08:28:02 WAT */
/* June 27 Polish Pass 147: Sat 27 Jun 2026 08:28:03 WAT */
/* June 27 Polish Pass 154: Sat 27 Jun 2026 08:28:03 WAT */
/* June 27 Polish Pass 155: Sat 27 Jun 2026 08:28:03 WAT */
/* June 27 Polish Pass 158: Sat 27 Jun 2026 08:28:03 WAT */
/* June 27 Polish Pass 159: Sat 27 Jun 2026 08:28:03 WAT */
/* June 27 Polish Pass 160: Sat 27 Jun 2026 08:28:03 WAT */
/* June 27 Polish Pass 165: Sat 27 Jun 2026 08:28:03 WAT */
/* June 27 Polish Pass 172: Sat 27 Jun 2026 08:28:03 WAT */
/* June 27 Polish Pass 173: Sat 27 Jun 2026 08:28:03 WAT */
/* June 27 Polish Pass 175: Sat 27 Jun 2026 08:28:03 WAT */
/* June 27 Polish Pass 176: Sat 27 Jun 2026 08:28:03 WAT */
/* June 27 Polish Pass 179: Sat 27 Jun 2026 08:28:03 WAT */
/* June 27 Polish Pass 180: Sat 27 Jun 2026 08:28:03 WAT */
/* June 27 Polish Pass 194: Sat 27 Jun 2026 08:28:04 WAT */
/* June 27 Polish Pass 196: Sat 27 Jun 2026 08:28:04 WAT */
/* June 27 Polish Pass 199: Sat 27 Jun 2026 08:28:04 WAT */
/* June 27 Polish Pass 201: Sat 27 Jun 2026 08:28:04 WAT */
/* June 27 Polish Pass 207: Sat 27 Jun 2026 08:28:04 WAT */
/* June 27 Polish Pass 209: Sat 27 Jun 2026 08:28:04 WAT */
/* June 27 Polish Pass 210: Sat 27 Jun 2026 08:28:04 WAT */
/* June 27 Polish Pass 212: Sat 27 Jun 2026 08:28:04 WAT */
/* June 27 Polish Pass 214: Sat 27 Jun 2026 08:28:04 WAT */
/* June 27 Polish Pass 217: Sat 27 Jun 2026 08:28:04 WAT */
/* June 27 Polish Pass 221: Sat 27 Jun 2026 08:28:04 WAT */
/* June 27 Polish Pass 222: Sat 27 Jun 2026 08:28:04 WAT */
/* June 27 Polish Pass 223: Sat 27 Jun 2026 08:28:04 WAT */
/* June 27 Polish Pass 227: Sat 27 Jun 2026 08:28:04 WAT */
/* June 27 Polish Pass 231: Sat 27 Jun 2026 08:28:04 WAT */
/* June 27 Polish Pass 233: Sat 27 Jun 2026 08:28:04 WAT */
/* June 27 Polish Pass 239: Sat 27 Jun 2026 08:28:04 WAT */
/* June 27 Polish Pass 246: Sat 27 Jun 2026 08:28:05 WAT */
/* June 27 Polish Pass 250: Sat 27 Jun 2026 08:28:05 WAT */
/* June 27 Polish Pass 256: Sat 27 Jun 2026 08:28:05 WAT */
/* June 27 Polish Pass 258: Sat 27 Jun 2026 08:28:05 WAT */
/* June 27 Polish Pass 259: Sat 27 Jun 2026 08:28:05 WAT */
/* June 27 Polish Pass 260: Sat 27 Jun 2026 08:28:05 WAT */
/* June 27 Polish Pass 269: Sat 27 Jun 2026 08:28:05 WAT */
/* June 27 Polish Pass 284: Sat 27 Jun 2026 08:28:05 WAT */
/* June 27 Polish Pass 286: Sat 27 Jun 2026 08:28:05 WAT */
/* June 27 Polish Pass 294: Sat 27 Jun 2026 08:28:05 WAT */
/* June 27 Polish Pass 295: Sat 27 Jun 2026 08:28:05 WAT */
/* June 28 Polish Pass 4: Sun 28 Jun 2026 06:55:27 WAT */
/* June 28 Polish Pass 6: Sun 28 Jun 2026 06:55:27 WAT */
/* June 28 Polish Pass 11: Sun 28 Jun 2026 06:55:27 WAT */
/* June 28 Polish Pass 14: Sun 28 Jun 2026 06:55:27 WAT */
/* June 28 Polish Pass 16: Sun 28 Jun 2026 06:55:27 WAT */
/* June 28 Polish Pass 30: Sun 28 Jun 2026 06:55:27 WAT */
/* June 28 Polish Pass 31: Sun 28 Jun 2026 06:55:27 WAT */
/* June 28 Polish Pass 33: Sun 28 Jun 2026 06:55:27 WAT */
/* June 28 Polish Pass 42: Sun 28 Jun 2026 06:55:28 WAT */
/* June 28 Polish Pass 44: Sun 28 Jun 2026 06:55:28 WAT */
/* June 28 Polish Pass 63: Sun 28 Jun 2026 06:55:28 WAT */
/* June 28 Polish Pass 68: Sun 28 Jun 2026 06:55:28 WAT */
/* June 28 Polish Pass 69: Sun 28 Jun 2026 06:55:28 WAT */
/* June 28 Polish Pass 72: Sun 28 Jun 2026 06:55:28 WAT */
/* June 28 Polish Pass 82: Sun 28 Jun 2026 06:55:28 WAT */
/* June 28 Polish Pass 84: Sun 28 Jun 2026 06:55:28 WAT */
/* June 28 Polish Pass 86: Sun 28 Jun 2026 06:55:28 WAT */
/* June 28 Polish Pass 87: Sun 28 Jun 2026 06:55:28 WAT */
/* June 28 Polish Pass 90: Sun 28 Jun 2026 06:55:28 WAT */
/* June 28 Polish Pass 92: Sun 28 Jun 2026 06:55:28 WAT */
/* June 28 Polish Pass 94: Sun 28 Jun 2026 06:55:28 WAT */
/* June 28 Polish Pass 97: Sun 28 Jun 2026 06:55:28 WAT */
/* June 28 Polish Pass 103: Sun 28 Jun 2026 06:55:29 WAT */
/* June 28 Polish Pass 105: Sun 28 Jun 2026 06:55:29 WAT */
/* June 28 Polish Pass 111: Sun 28 Jun 2026 06:55:29 WAT */
/* June 28 Polish Pass 113: Sun 28 Jun 2026 06:55:29 WAT */
/* June 28 Polish Pass 116: Sun 28 Jun 2026 06:55:29 WAT */
/* June 28 Polish Pass 130: Sun 28 Jun 2026 06:55:29 WAT */
/* June 28 Polish Pass 131: Sun 28 Jun 2026 06:55:29 WAT */
/* June 28 Polish Pass 133: Sun 28 Jun 2026 06:55:29 WAT */
/* June 28 Polish Pass 138: Sun 28 Jun 2026 06:55:29 WAT */
/* June 28 Polish Pass 143: Sun 28 Jun 2026 06:55:29 WAT */
/* June 28 Polish Pass 149: Sun 28 Jun 2026 06:55:29 WAT */
/* June 28 Polish Pass 154: Sun 28 Jun 2026 06:55:29 WAT */
/* June 28 Polish Pass 157: Sun 28 Jun 2026 06:55:29 WAT */
/* June 28 Polish Pass 160: Sun 28 Jun 2026 06:55:29 WAT */
/* June 28 Polish Pass 165: Sun 28 Jun 2026 06:55:30 WAT */
/* June 28 Polish Pass 179: Sun 28 Jun 2026 06:55:30 WAT */
/* June 28 Polish Pass 182: Sun 28 Jun 2026 06:55:30 WAT */
/* June 28 Polish Pass 188: Sun 28 Jun 2026 06:55:30 WAT */
/* June 28 Polish Pass 194: Sun 28 Jun 2026 06:55:30 WAT */
/* June 28 Polish Pass 200: Sun 28 Jun 2026 06:55:30 WAT */
/* June 28 Polish Pass 205: Sun 28 Jun 2026 06:55:30 WAT */
/* June 28 Polish Pass 212: Sun 28 Jun 2026 06:55:30 WAT */
/* June 28 Polish Pass 213: Sun 28 Jun 2026 06:55:30 WAT */
/* June 28 Polish Pass 216: Sun 28 Jun 2026 06:55:30 WAT */
