'use client';

import React, { useState } from 'react';
import { useMarketCreation } from '../../lib/hooks/useMarketCreation';
import { Layout, Type, AlignLeft, Calendar, Coins, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';
import { useToast } from '../../providers/ToastProvider';

export default function CreateMarketForm() {
    const { createMarket, isCreating } = useMarketCreation();
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        outcomeA: 'Yes',
        outcomeB: 'No',
        expiry: 150000,
        initialLiq: 10
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createMarket(formData);
            showToast("Market creation initiated successfully!", "success");
        } catch (error) {
            showToast(`Creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`, "error");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="glass-panel p-10 rounded-[2.5rem] border border-white/5 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Type size={18} />
                    </div>
                    <h3 className="text-xl font-black tracking-tight">Market Identity</h3>
                </div>

                <div className="space-y-4">
                    <div className="group/input">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">Market Title</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-white/5 border border-white/5 focus:border-primary/50 group-hover/input:border-white/10 rounded-2xl px-6 py-4 transition-all text-sm font-bold"
                            placeholder="e.g., Will Bitcoin reach $100k in 2026?"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="group/input">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">Analytical Description</label>
                        <textarea
                            required
                            rows={4}
                            className="w-full bg-white/5 border border-white/5 focus:border-primary/50 group-hover/input:border-white/10 rounded-2xl px-6 py-4 transition-all text-sm font-medium"
                            placeholder="Provide professional context for the market..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Parameters & Liquidity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-panel p-10 rounded-[2.5rem] border border-white/5 space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-accent/10 rounded-lg text-accent">
                            <Calendar size={18} />
                        </div>
                        <h3 className="text-xl font-black tracking-tight">Settlement</h3>
                    </div>
                    <div className="group/input">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">Expiry Block Height</label>
                        <input
                            type="number"
                            required
                            className="w-full bg-white/5 border border-white/5 focus:border-primary/50 group-hover/input:border-white/10 rounded-2xl px-6 py-4 transition-all text-sm font-bold"
                            value={formData.expiry}
                            onChange={e => setFormData({ ...formData, expiry: parseInt(e.target.value) })}
                        />
                        <p className="text-[10px] text-muted-foreground mt-2 font-bold opacity-60 italic">~10 minutes per block cycle</p>
                    </div>
                </div>

                <div className="glass-panel p-10 rounded-[2.5rem] border border-white/5 space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Coins size={18} />
                        </div>
                        <h3 className="text-xl font-black tracking-tight">Seed Liquidity</h3>
                    </div>
                    <div className="group/input">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">Initial STX Contribution</label>
                        <input
                            type="number"
                            required
                            min={1}
                            className="w-full bg-white/5 border border-white/5 focus:border-primary/50 group-hover/input:border-white/10 rounded-2xl px-6 py-4 transition-all text-sm font-bold"
                            value={formData.initialLiq}
                            onChange={e => setFormData({ ...formData, initialLiq: parseFloat(e.target.value) })}
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isCreating}
                className="w-full py-6 bg-primary text-white font-black uppercase tracking-[0.2em] rounded-[2rem] transition-all hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.4)] hover:-translate-y-1 active:translate-y-0 group"
            >
                {isCreating ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (
                    <div className="flex items-center justify-center gap-3">
                        <span>Deploy Decentralized Pool</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                )}
            </button>
        </form>
    );
}
