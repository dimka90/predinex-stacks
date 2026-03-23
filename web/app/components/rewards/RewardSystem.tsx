'use client';

import React from 'react';
import { Trophy, Star, Target, CheckCircle2, ChevronRight } from 'lucide-react';
import { Mission } from '../../lib/hooks/useUserRewards';

interface RewardBadgeProps {
    level: number;
    points: number;
    multiplier: number;
}

/**
 * Professional floating badge for user rank/rewards
 */
export function RewardBadge({ level, points, multiplier }: RewardBadgeProps) {
    return (
        <div className="glass-panel p-6 rounded-3xl border border-primary/20 bg-primary/5 relative overflow-hidden group">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] group-hover:scale-110 transition-transform">
                    <Trophy size={24} className="text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Rank Tier</span>
                    <h3 className="text-xl font-black italic">LEVEL {level}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-muted-foreground">{points.toLocaleString()} PTS</span>
                        <div className="w-1 h-1 rounded-full bg-muted-foreground opacity-30" />
                        <span className="text-xs font-bold text-accent">{multiplier.toFixed(2)}x Boost</span>
                    </div>
                </div>
            </div>

            {/* Shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
    );
}

/**
 * Grid of protocol missions with progress tracking
 */
export function MissionGrid({ missions }: { missions: Mission[] }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Protocol Missions</h3>
                <span className="text-[10px] font-bold text-primary">VIEW ALL</span>
            </div>
            {missions.map(mission => (
                <div key={mission.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group cursor-pointer relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${mission.isCompleted ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'}`}>
                                {mission.isCompleted ? <CheckCircle2 size={16} /> : <Target size={16} />}
                            </div>
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-tight group-hover:text-primary transition-colors">{mission.title}</h4>
                                <p className="text-[10px] text-muted-foreground font-medium">{mission.reward}</p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px] font-black text-muted-foreground">
                            <span>{mission.isCompleted ? '100%' : `${mission.progress.toFixed(0)}%`}</span>
                            {mission.isCompleted && <span className="text-green-500 uppercase">MISSION COMPLETE</span>}
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-1000 ease-out ${mission.isCompleted ? 'bg-green-500' : 'bg-primary'}`}
                                style={{ width: `${mission.progress}%` }}
                            />
                        </div>
                    </div>

                    <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 group-hover:translate-x-1 transition-all" />
                </div>
            ))}
        </div>
    );
}
