'use client';

import Navbar from "../components/Navbar";
import { Award, ShieldCheck, Search } from "lucide-react";
import { useLeaderboard } from "../lib/hooks/useLeaderboard";
import LeaderboardTable from "../components/rankings/LeaderboardTable";
import RankingStats from "../components/rankings/RankingStats";
import UserRankCard from "../components/rankings/UserRankCard";

export default function RankingsPage() {
    const { leaderboard, isLoading } = useLeaderboard();

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 relative z-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 bg-primary/10 w-fit px-4 py-2 rounded-xl border border-primary/20">
                            <Award size={14} className="text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Hall of Fame</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-none relative">
                            <span className="absolute -left-6 top-1/2 -translate-y-1/2 w-2 h-12 bg-primary rounded-full drop-shadow-[0_0_10px_rgba(79,70,229,0.8)] opacity-60" />
                            Global <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-indigo-400 to-primary drop-shadow-sm italic">Rankings</span>
                        </h1>
                        <p className="text-lg text-muted-foreground/80 max-w-2xl leading-relaxed font-medium">
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

                {/* Personalized User Rank */}
                <UserRankCard rank={42} points={4200} nextRankPoints={10000} />

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
