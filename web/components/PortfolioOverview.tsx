"use client";

import { useAppKitAccount } from '@reown/appkit/react';
import { Wallet, CircleDollarSign, Info } from 'lucide-react';
import Card from './ui/Card';
import Tooltip from './ui/Tooltip';

export default function PortfolioOverview() {
    const { isConnected, address } = useAppKitAccount();

    if (!isConnected) return null;

    return (
        <div className="mb-8 p-8 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/5 glass relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                <div>
                    <h2 className="text-3xl font-black mb-1 flex items-center gap-2">
                        Portfolio Overview
                        <Tooltip content="Live stats from your Stacks wallet address">
                            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                        </Tooltip>
                    </h2>
                    <p className="text-muted-foreground font-medium flex items-center gap-2">
                        <Wallet className="w-4 h-4" />
                        {address?.slice(0, 8)}...{address?.slice(-8)}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full md:w-auto">
                    <div className="flex flex-col group/stat cursor-default">
                        <span className="text-[10px] uppercase font-black text-primary/70 tracking-[0.2em] mb-2 group-hover/stat:text-primary transition-colors">Total Wagered</span>
                        <span className="text-3xl font-black tracking-tighter tabular-nums text-white group-hover/stat:scale-105 transition-transform origin-left">1,250 <span className="text-sm">STX</span></span>
                    </div>
                    <div className="flex flex-col group/stat cursor-default">
                        <span className="text-[10px] uppercase font-black text-accent/70 tracking-[0.2em] mb-2 group-hover/stat:text-accent transition-colors">Total Won</span>
                        <span className="text-3xl font-black tracking-tighter tabular-nums text-accent group-hover/stat:scale-105 transition-transform origin-left group-hover/stat:drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]">840 <span className="text-sm">STX</span></span>
                    </div>
                    <div className="flex flex-col group/stat cursor-default">
                        <span className="text-[10px] uppercase font-black text-emerald-400/70 tracking-[0.2em] mb-2 group-hover/stat:text-emerald-400 transition-colors">Net P/L</span>
                        <div className="flex items-center gap-2 group-hover/stat:scale-105 transition-transform origin-left group-hover/stat:drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
                            <CircleDollarSign className="w-6 h-6 text-emerald-400" />
                            <span className="text-3xl font-black text-emerald-400 tracking-tighter tabular-nums">+590</span>
                            <span className="text-sm font-black text-emerald-400/80">STX</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[120px] rounded-full -mr-32 -mt-32 animate-[pulse_3s_infinite] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none mix-blend-overlay" />
        </div>
    );
}
