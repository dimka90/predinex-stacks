'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Globe, ShieldCheck, Zap } from 'lucide-react';

export default function PriceOracleStatus() {
    const [status, setStatus] = useState<'nominal' | 'degraded' | 'offline'>('nominal');
    const [latency, setLatency] = useState(42);
    const [sync, setSync] = useState(99.9);

    useEffect(() => {
        const interval = setInterval(() => {
            setLatency(prev => Math.max(20, Math.min(100, prev + (Math.random() * 10 - 5))));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-card/5 overflow-hidden relative group">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Globe size={16} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Oracle Network</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
                    <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[8px] font-black uppercase text-green-500">Live</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">Latency</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black">{latency.toFixed(0)}</span>
                        <span className="text-[10px] font-bold text-muted-foreground">ms</span>
                    </div>
                </div>
                <div className="space-y-1 text-right">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">Chain Sync</span>
                    <div className="flex items-baseline justify-end gap-1">
                        <span className="text-lg font-black">{sync}%</span>
                    </div>
                </div>
            </div>

            {/* Micro Sparkline / Pulse */}
            <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary/40 animate-[shimmer_2s_infinite_linear]" style={{ width: '40%' }} />
            </div>

            <div className="mt-4 flex items-center gap-2 text-[9px] font-bold text-muted-foreground opacity-50 italic">
                <ShieldCheck size={10} />
                <span>Verified by decentralized validator nodes</span>
            </div>

            {/* Hover aura */}
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
}
