'use client';

import { Trophy, Medal, Crown, TrendingUp, BarChart3, Target } from "lucide-react";
import { truncateAddress } from "../lib/utils";

interface RankItem {
    rank: number;
    address: string;
    volume: number;
    wins: number;
    accuracy: number;
}

const mockRankings: RankItem[] = [
    { rank: 1, address: 'ST1PQ...GGM', volume: 15420, wins: 42, accuracy: 88 },
    { rank: 2, address: 'ST2NB...X7Y', volume: 12100, wins: 35, accuracy: 82 },
    { rank: 3, address: 'ST3XJ...R1Z', volume: 9800, wins: 28, accuracy: 79 },
    { rank: 4, address: 'ST1VQ...W2B', volume: 7500, wins: 21, accuracy: 75 },
    { rank: 5, address: 'ST4AB...CDE', volume: 5200, wins: 15, accuracy: 71 },
];

export default function RankingsTable() {
    return (
        <div className="w-full">
            {/* Top 3 Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {mockRankings.slice(0, 3).map((item) => (
                    <div
                        key={item.address}
                        className={`
                            relative glass-panel p-8 rounded-[2.5rem] border overflow-hidden flex flex-col items-center text-center
                            ${item.rank === 1 ? 'border-primary/50 shadow-primary/20 scale-105 z-10' : 'border-white/5 opacity-80'}
                        `}
                    >
                        <div className={`
                            w-16 h-16 rounded-2xl flex items-center justify-center mb-6
                            ${item.rank === 1 ? 'bg-primary/20 text-primary' : 'bg-muted/30 text-muted-foreground'}
                        `}>
                            {item.rank === 1 ? <Crown size={32} /> : item.rank === 2 ? <Medal size={32} /> : <Trophy size={32} />}
                        </div>
                        <h3 className="font-mono text-lg font-bold mb-1">{item.address}</h3>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-black mb-6">Rank #{item.rank}</p>

                        <div className="grid grid-cols-2 gap-4 w-full pt-6 border-t border-white/5">
                            <div>
                                <div className="text-xl font-black">{item.volume}</div>
                                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Volume (STX)</div>
                            </div>
                            <div>
                                <div className="text-xl font-black text-green-400">{item.accuracy}%</div>
                                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Accuracy</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detailed Table */}
            <div className="glass-panel rounded-[2rem] border border-white/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/5">
                            <th className="px-8 py-6 text-xs uppercase font-black tracking-widest text-muted-foreground">Rank</th>
                            <th className="px-8 py-6 text-xs uppercase font-black tracking-widest text-muted-foreground">User</th>
                            <th className="px-8 py-6 text-xs uppercase font-black tracking-widest text-muted-foreground">Volume</th>
                            <th className="px-8 py-6 text-xs uppercase font-black tracking-widest text-muted-foreground">Wins</th>
                            <th className="px-8 py-6 text-xs uppercase font-black tracking-widest text-muted-foreground text-right">Accuracy</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockRankings.map((item) => (
                            <tr key={item.address} className="border-b border-white/5 last:border-none hover:bg-white/5 transition-colors group">
                                <td className="px-8 py-6">
                                    <span className={`
                                        w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm
                                        ${item.rank <= 3 ? 'bg-primary/20 text-primary' : 'bg-muted/30 text-muted-foreground'}
                                    `}>
                                        {item.rank}
                                    </span>
                                </td>
                                <td className="px-8 py-6 font-mono font-bold group-hover:text-primary transition-colors">{item.address}</td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp size={14} className="text-green-400" />
                                        <span className="font-black">{item.volume.toLocaleString()} STX</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <Target size={14} className="text-primary" />
                                        <span className="font-bold">{item.wins}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-black">
                                        {item.accuracy}%
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
