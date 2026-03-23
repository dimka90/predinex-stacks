'use client';

import React from 'react';
import { Award, ChevronUp, Star, Zap } from 'lucide-react';

interface UserRankCardProps {
    rank: number;
    points: number;
    nextRankPoints: number;
}

export default function UserRankCard({ rank, points, nextRankPoints }: UserRankCardProps) {
    const progress = (points / nextRankPoints) * 100;

    return (
        <div className="glass-panel p-8 rounded-[2.5rem] border border-primary/30 bg-primary/5 relative overflow-hidden group mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)] group-hover:scale-110 transition-transform duration-500">
                        <Award size={32} className="text-white" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1 block">Your Global Standing</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black italic">RANK #{rank}</span>
                            <div className="flex items-center gap-1 text-green-500 text-xs font-bold">
                                <ChevronUp size={14} />
                                <span>+2</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 max-w-md space-y-3">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Next Tier Progress</span>
                        <span className="text-xs font-black text-primary">{points.toLocaleString()} / {nextRankPoints.toLocaleString()} PTS</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-[10px] text-muted-foreground font-bold italic opacity-60">
                        Collect {(nextRankPoints - points).toLocaleString()} more points to reach the "Elite Oracle" tier.
                    </p>
                </div>

                <button className="px-8 py-4 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] transition-all hover:-translate-y-1 active:translate-y-0">
                    Claim Rewards
                </button>
            </div>

            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.1),transparent)] pointer-events-none" />
            <Zap size={120} className="absolute -right-8 -bottom-8 text-primary/5 -rotate-12 pointer-events-none" />
        </div>
    );
}
