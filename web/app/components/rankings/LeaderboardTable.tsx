'use client';

import React from 'react';
import { Trophy, TrendingUp, Star, Award } from 'lucide-react';
import { LeaderboardEntry } from '../../lib/hooks/useLeaderboard';

interface LeaderboardTableProps {
    entries: LeaderboardEntry[];
    isLoading?: boolean;
}

export default function LeaderboardTable({ entries, isLoading }: LeaderboardTableProps) {
    if (isLoading) return <div className="py-20 text-center animate-pulse text-[10px] font-black uppercase tracking-widest text-primary">Synchronizing Global Rankings...</div>;

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-4 min-w-[800px]">
                <thead>
                    <tr className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                        <th className="pb-4 pl-8">Rank</th>
                        <th className="pb-4">Participant Address</th>
                        <th className="pb-4">Est. Performance PNL</th>
                        <th className="pb-4">Win Rate Accuracy</th>
                        <th className="pb-4 pr-8 text-right">Protocol PTS</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry) => (
                        <tr
                            key={entry.address}
                            className={`group glass-panel hover:border-primary/40 transition-all ${entry.isUser ? 'border-primary/50 bg-primary/5' : ''}`}
                        >
                            <td className="py-6 pl-8 rounded-l-[2rem] border-y border-l border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${entry.rank === 1 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.3)]' :
                                            entry.rank === 2 ? 'bg-slate-400/20 text-slate-400 border border-slate-400/30' :
                                                entry.rank === 3 ? 'bg-amber-700/20 text-amber-700 border border-amber-700/30' :
                                                    'bg-white/5 text-muted-foreground'
                                        }`}>
                                        {entry.rank === 1 ? <Trophy size={18} /> : entry.rank}
                                    </div>
                                </div>
                            </td>
                            <td className="py-6 border-y border-white/5">
                                <span className="font-mono text-sm font-bold opacity-80 group-hover:opacity-100 group-hover:text-primary transition-all">
                                    {entry.address}
                                </span>
                            </td>
                            <td className="py-6 border-y border-white/5">
                                <div className="flex items-center gap-2">
                                    <TrendingUp size={14} className="text-green-500" />
                                    <span className="font-black text-green-500">+{entry.pnl.toLocaleString()} STX</span>
                                </div>
                            </td>
                            <td className="py-6 border-y border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 max-w-[80px] h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-accent" style={{ width: `${entry.winRate}%` }} />
                                    </div>
                                    <span className="text-xs font-black">{entry.winRate}%</span>
                                </div>
                            </td>
                            <td className="py-6 pr-8 text-right rounded-r-[2rem] border-y border-r border-white/5">
                                <span className="text-lg font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                    {entry.points.toLocaleString()}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
