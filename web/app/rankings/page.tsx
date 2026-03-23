'use client';

import Navbar from "../components/Navbar";
import { Award, ShieldCheck, Search } from "lucide-react";
import { useLeaderboard } from "../lib/hooks/useLeaderboard";
import LeaderboardTable from "../components/rankings/LeaderboardTable";
import RankingStats from "../components/rankings/RankingStats";

export default function RankingsPage() {
    const { leaderboard, isLoading } = useLeaderboard();

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Award size={16} className="text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Hall of Fame</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight">
                            Global <span className="text-primary italic">Rankings</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                            Track the elite predictors securing the Predinex network. Performance is verified on-chain via Stacks.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search participant..."
                                className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all w-64"
                            />
                        </div>
                        <div className="h-14 w-px bg-white/5 hidden md:block" />
                        <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 px-5 py-3.5 rounded-2xl">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                            <div className="flex flex-col leading-none">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Status</span>
                                <span className="text-xs font-black">VERIFIED</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Hub */}
                <RankingStats />

                {/* Global Leaderboard */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                            <div className="w-2 h-8 bg-primary rounded-full" />
                            Top Performers
                        </h2>
                    </div>
                    <LeaderboardTable entries={leaderboard} isLoading={isLoading} />
                </div>
            </div>
        </main>
    );
}
