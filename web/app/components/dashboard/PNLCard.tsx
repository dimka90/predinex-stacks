'use client';

import { TrendingUp, TrendingDown, Target, Wallet } from 'lucide-react';
import Card from '../../../components/ui/Card';

interface PNLCardProps {
    totalWagered: number;
    totalWon: number;
    netPnL: number;
    winRate: number;
    isLoading?: boolean;
}

export default function PNLCard({ totalWagered, totalWon, netPnL, winRate, isLoading }: PNLCardProps) {
    const isProfitable = netPnL >= 0;

    if (isLoading) {
        return (
            <Card className="p-8 h-40 animate-pulse bg-muted/20 border-border/50">
                <div className="h-full flex flex-col justify-between">
                    <div className="w-1/3 h-4 bg-muted rounded" />
                    <div className="w-1/2 h-8 bg-muted rounded" />
                </div>
            </Card>
        );
    }

    return (
        <Card className="relative overflow-hidden group">
            <div className="p-8 relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <span className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground mb-1 block">
                            Portfolio Performance
                        </span>
                        <h3 className="text-3xl font-black tracking-tighter">
                            {isProfitable ? '+' : ''}{netPnL.toFixed(2)} STX
                        </h3>
                    </div>
                    <div className={`p-3 rounded-2xl ${isProfitable ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'} border border-white/5`}>
                        {isProfitable ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1.5">
                            <Wallet size={10} /> Volume
                        </span>
                        <p className="text-lg font-black">{totalWagered.toLocaleString()} STX</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1.5">
                            <Target size={10} /> Win Rate
                        </span>
                        <p className="text-lg font-black">{winRate.toFixed(1)}%</p>
                    </div>
                </div>
            </div>

            {/* Decorative gradient background */}
            <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] rounded-full -mr-16 -mt-16 opacity-20 ${isProfitable ? 'bg-green-500' : 'bg-red-500'}`} />
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </Card>
    );
}
