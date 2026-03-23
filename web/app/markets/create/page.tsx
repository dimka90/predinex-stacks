'use client';

import Navbar from "../../components/Navbar";
import CreateMarketForm from "../../components/markets/CreateMarketForm";
import { ShieldCheck, Info, MessageSquare, AlertCircle } from "lucide-react";

export default function CreateMarketPage() {
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            <Navbar />

            <div className="pt-32 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={16} className="text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Protocol Governance</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight">
                            Market <span className="text-primary italic">Initialization</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                            Deploy high-integrity prediction pools with granular parameter controls and decentralized settlement safeguards.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 bg-white/5 border border-white/5 px-6 py-4 rounded-3xl">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Mainnet Ready</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: Form */}
                    <div className="lg:col-span-2 space-y-12">
                        <CreateMarketForm />
                    </div>

                    {/* Right: Info Panels */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-card/10">
                            <div className="flex items-center gap-3 mb-4">
                                <Info size={18} className="text-primary" />
                                <h4 className="text-xs font-black uppercase tracking-widest">Creator Guidelines</h4>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    'Define clear, unambiguous outcomes (Outcome A vs B).',
                                    'Set a realistic block height for settlement.',
                                    'Seed liquidity ensures immediate market stability.',
                                    'Verified creators receive premium visibility badges.'
                                ].map((step, i) => (
                                    <li key={i} className="flex gap-3 text-xs font-bold text-muted-foreground leading-relaxed">
                                        <div className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[8px] flex-shrink-0 mt-0.5">
                                            {i + 1}
                                        </div>
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-8 rounded-3xl border border-dashed border-white/10 bg-white/[0.02]">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertCircle size={18} className="text-yellow-500" />
                                <h4 className="text-xs font-black uppercase tracking-widest text-yellow-500">Security Warning</h4>
                            </div>
                            <p className="text-[11px] font-bold text-muted-foreground/60 leading-relaxed italic">
                                Market parameters cannot be modified once initialized on-chain. Ensure all data is accurate before deployment.
                            </p>
                        </div>

                        <button className="w-full flex items-center justify-between p-6 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group">
                            <div className="flex flex-col items-start gap-1">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Need Assistance?</span>
                                <span className="text-xs font-black">Join Discord Terminal</span>
                            </div>
                            <MessageSquare size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
