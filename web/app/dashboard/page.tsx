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
