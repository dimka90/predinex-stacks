'use client';

import React from 'react';
import { Layers } from 'lucide-react';

interface OrderBookProps {
    pool: {
        totalA: number;
        totalB: number;
        outcomeA: string;
        outcomeB: string;
    };
}

export default function OrderBook({ pool }: OrderBookProps) {
    const total = (pool.totalA + pool.totalB) || 1;
    const pctA = (pool.totalA / total) * 100;
    const pctB = (pool.totalB / total) * 100;

    return (
        <div className="glass-panel p-8 rounded-[2rem] border border-white/5 bg-card/10">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Layers size={18} className="text-primary" />
                    <h3 className="text-sm font-black uppercase tracking-widest">Market Depth</h3>
                </div>
                <span className="text-[10px] font-bold text-muted-foreground opacity-50">STX Micro-liquidity</span>
            </div>

            <div className="space-y-4">
                {/* Outcome A Depth */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                        <span className="text-foreground/80">{pool.outcomeA}</span>
                        <span className="text-primary">{(pool.totalA / 1_000_000).toLocaleString()} STX</span>
                    </div>
                    <div className="h-3 w-full bg-primary/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
                            style={{ width: `${pctA}%` }}
                        />
                    </div>
                </div>

                {/* Outcome B Depth */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                        <span className="text-foreground/80">{pool.outcomeB}</span>
                        <span className="text-accent">{(pool.totalB / 1_000_000).toLocaleString()} STX</span>
                    </div>
                    <div className="h-3 w-full bg-accent/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-accent transition-all duration-1000 ease-out"
                            style={{ width: `${pctB}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center bg-white/[0.02] -mx-8 px-8 -mb-8 pb-8 rounded-b-[2rem]">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Total Liquidity</span>
                    <span className="text-lg font-black tracking-tight">{(total / 1_000_000).toLocaleString()} STX</span>
                </div>
                <div className="text-right flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Spread</span>
                    <span className="text-lg font-black text-green-400">0.05%</span>
                </div>
            </div>
        </div>
    );
}
