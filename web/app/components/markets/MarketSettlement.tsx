'use client';

import React, { useState } from 'react';
import { useMarketSettlement } from '../../lib/hooks/useMarketSettlement';
import { ShieldCheck, AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/providers/ToastProvider';

interface MarketSettlementProps {
    poolId: number;
    outcomeA: string;
    outcomeB: string;
}

export default function MarketSettlement({ poolId, outcomeA, outcomeB }: MarketSettlementProps) {
    const { settleMarket, isSettling } = useMarketSettlement();
    const { showToast } = useToast();
    const [selectedOutcome, setSelectedOutcome] = useState<boolean | null>(null);

    const handleSettle = async () => {
        if (selectedOutcome === null) return;
        try {
            await settleMarket(poolId, selectedOutcome);
            showToast("Settlement transaction initiated!", "success");
        } catch (error) {
            showToast("Settlement failed", "error");
        }
    };

    return (
        <div className="glass-panel p-10 rounded-[2.5rem] border border-primary/20 bg-primary/5 space-y-8 relative overflow-hidden">
            <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/30">
                    <ShieldCheck size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-black italic tracking-tight">Settlement Terminal</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Authorize Final Protocol Outcome</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <button
                    onClick={() => setSelectedOutcome(true)}
                    className={`p-8 rounded-3xl border transition-all flex flex-col items-center gap-3 group ${selectedOutcome === true ? 'bg-primary border-primary shadow-[0_0_30px_rgba(var(--primary-rgb),0.4)]' : 'bg-white/5 border-white/5 hover:border-white/10'
                        }`}
                >
                    <span className={`text-[10px] font-black uppercase tracking-widest ${selectedOutcome === true ? 'text-white/60' : 'text-muted-foreground'}`}>Option A</span>
                    <span className={`text-2xl font-black ${selectedOutcome === true ? 'text-white' : 'group-hover:text-primary transition-colors'}`}>{outcomeA}</span>
                </button>

                <button
                    onClick={() => setSelectedOutcome(false)}
                    className={`p-8 rounded-3xl border transition-all flex flex-col items-center gap-3 group ${selectedOutcome === false ? 'bg-accent border-accent shadow-[0_0_30px_rgba(var(--accent-rgb),0.4)]' : 'bg-white/5 border-white/5 hover:border-white/10'
                        }`}
                >
                    <span className={`text-[10px] font-black uppercase tracking-widest ${selectedOutcome === false ? 'text-white/60' : 'text-muted-foreground'}`}>Option B</span>
                    <span className={`text-2xl font-black ${selectedOutcome === false ? 'text-white' : 'group-hover:text-accent transition-colors'}`}>{outcomeB}</span>
                </button>
            </div>

            <div className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex gap-4 items-start relative z-10">
                <AlertTriangle className="text-yellow-500 flex-shrink-0" size={20} />
                <p className="text-[10px] font-bold text-yellow-500/80 leading-relaxed italic">
                    WARNING: Settlement is irreversible. Funds will be distributed according to the selected outcome. Ensure all external verification data is confirmed before proceeding.
                </p>
            </div>

            <button
                onClick={handleSettle}
                disabled={isSettling || selectedOutcome === null}
                className="w-full py-6 bg-foreground text-background font-black uppercase tracking-[0.3em] rounded-[2rem] transition-all hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed group relative z-10"
            >
                {isSettling ? <Loader2 className="w-6 h-6 animate-spin mx-auto text-background" /> : "Authorize Settlement"}
            </button>

            {/* Background Aesthetic */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        </div>
    );
}
