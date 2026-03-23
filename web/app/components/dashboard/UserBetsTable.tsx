'use client';

import Link from 'next/link';
import { ExternalLink, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { UserPosition } from '../../lib/hooks/useUserPortfolio';
import Card from '../../../components/ui/Card';

interface UserBetsTableProps {
    positions: UserPosition[];
    isLoading?: boolean;
}

export default function UserBetsTable({ positions, isLoading }: UserBetsTableProps) {
    if (isLoading) {
        return (
            <Card className="p-8 space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-muted/20 animate-pulse rounded-xl" />
                ))}
            </Card>
        );
    }

    if (positions.length === 0) {
        return (
            <Card className="p-12 text-center bg-card/40 border-dashed border-border/50">
                <p className="text-muted-foreground font-medium mb-4">No positions found in your history.</p>
                <Link href="/markets" className="text-primary font-black uppercase tracking-widest text-xs hover:underline">
                    Explore Markets
                </Link>
            </Card>
        );
    }

    return (
        <div className="overflow-x-auto rounded-3xl border border-white/5 bg-card/20 backdrop-blur-xl">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                        <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-muted-foreground">Market</th>
                        <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-muted-foreground text-right">Wager</th>
                        <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-muted-foreground text-center">Outcome</th>
                        <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-muted-foreground text-right">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {positions.map((pos) => (
                        <tr key={pos.poolId} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-6 py-5">
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm mb-1 truncate max-w-[200px]">{pos.pool.title}</span>
                                    <Link
                                        href={`/markets/${pos.poolId}`}
                                        className="text-[10px] text-primary font-bold uppercase tracking-tighter flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        View Detail <ExternalLink size={10} />
                                    </Link>
                                </div>
                            </td>
                            <td className="px-6 py-5 text-right font-black text-sm">
                                {(pos.totalBet / 1_000_000).toLocaleString()} STX
                            </td>
                            <td className="px-6 py-5 text-center">
                                <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-muted-foreground border border-white/5">
                                    {pos.amountA > 0 ? pos.pool.outcomeA : pos.pool.outcomeB}
                                </span>
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex justify-end">
                                    {pos.status === 'active' && (
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-accent">
                                            <Clock size={14} className="animate-spin-slow" /> Active
                                        </span>
                                    )}
                                    {pos.status === 'won' && (
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-green-400">
                                            <CheckCircle2 size={14} /> Won
                                        </span>
                                    )}
                                    {pos.status === 'lost' && (
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 opacity-60">
                                            <XCircle size={14} /> Lost
                                        </span>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
