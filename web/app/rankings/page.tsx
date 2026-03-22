'use client';

import Navbar from "../components/Navbar";
import RankingsTable from "../components/RankingsTable";
import { Trophy, Users, BarChart } from "lucide-react";

export default function RankingsPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
                {/* Header */}
                <div className="mb-16">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-2 h-10 bg-primary rounded-full" />
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Leaderboard</h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                        The hall of fame. Track the top-performing predictors on Predinex
                        and see how you stack up against the competition.
                    </p>
                </div>

                {/* Platform Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center gap-6">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                            <Users size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-black">12,450</div>
                            <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Active Users</div>
                        </div>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center gap-6">
                        <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent border border-accent/20">
                            <Trophy size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-black">8.5M STX</div>
                            <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Total Volume</div>
                        </div>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center gap-6">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                            <BarChart size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-black">1.2M STX</div>
                            <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Total Payouts</div>
                        </div>
                    </div>
                </div>

                {/* Rankings Table */}
                <RankingsTable />
            </div>
        </main>
    );
}
