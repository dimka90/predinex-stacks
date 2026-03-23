'use client';

import React from 'react';
import { Users, Trophy, BarChart, TrendingUp, Medal } from 'lucide-react';

export default function RankingStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="glass-panel p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform duration-500">
                        <Users size={28} />
                    </div>
                    <div>
                        <div className="text-3xl font-black tracking-tighter">12,450</div>
                        <div className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mt-1 opacity-60">Active Predictors</div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
            </div>

            <div className="glass-panel p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent border border-accent/20 group-hover:scale-110 transition-transform duration-500">
                        <Trophy size={28} />
                    </div>
                    <div>
                        <div className="text-3xl font-black tracking-tighter">8.5M <span className="text-sm font-bold text-muted-foreground">STX</span></div>
                        <div className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mt-1 opacity-60">Cumulative Volume</div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-accent/10 transition-colors" />
            </div>

            <div className="glass-panel p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform duration-500">
                        <Medal size={28} />
                    </div>
                    <div>
                        <div className="text-3xl font-black tracking-tighter">1.2M <span className="text-sm font-bold text-muted-foreground">STX</span></div>
                        <div className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mt-1 opacity-60">Rewards Distributed</div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
            </div>
        </div>
    );
}
