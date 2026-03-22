'use client';

import { X, Clock, Users, Hash, Info, TrendingUp, Target } from 'lucide-react';
import { ProcessedMarket } from '../lib/market-types';
import { formatSTXAmount, formatTimeRemaining } from '../lib/market-utils';

interface PoolDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    market: ProcessedMarket | null;
}

export default function PoolDetailsModal({ isOpen, onClose, market }: PoolDetailsModalProps) {
    if (!isOpen || !market) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="glass border border-border rounded-3xl p-8 max-w-2xl w-full mx-4 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                                #POOL-{market.poolId}
                            </span>
                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${market.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'
                                }`}>
                                {market.status}
                            </span>
                        </div>
                        <h2 className="text-3xl font-black leading-tight">{market.title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-xl transition-all hover:rotate-90"
                        aria-label="Close modal"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-8">
                    {/* Description */}
                    <section>
                        <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                            <Info className="w-4 h-4" />
                            <h4 className="text-sm font-bold uppercase tracking-wider">About this Market</h4>
                        </div>
                        <p className="text-foreground/80 leading-relaxed bg-muted/20 p-4 rounded-2xl border border-muted/30">
                            {market.description}
                        </p>
                    </section>

                    {/* Outcomes & Odds */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 rounded-2xl bg-green-500/5 border border-green-500/20">
                            <div className="flex items-center justify-between mb-4">
                                <span className="font-bold text-green-400">Outcome A</span>
                                <Target className="w-4 h-4 text-green-400" />
                            </div>
                            <div className="text-xl font-black mb-1">{market.outcomeA}</div>
                            <div className="text-2xl font-mono text-green-400/90">{market.oddsA}% Odds</div>
                        </div>
                        <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20">
                            <div className="flex items-center justify-between mb-4">
                                <span className="font-bold text-red-400">Outcome B</span>
                                <Target className="w-4 h-4 text-red-400" />
                            </div>
                            <div className="text-xl font-black mb-1">{market.outcomeB}</div>
                            <div className="text-2xl font-mono text-red-400/90">{market.oddsB}% Odds</div>
                        </div>
                    </section>

                    {/* Metadata Grid */}
                    <section className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-muted/30">
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                                <TrendingUp className="w-3 h-3" /> Total Volume
                            </span>
                            <div className="font-mono font-bold text-lg">{formatSTXAmount(market.totalVolume)}</div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                                <Clock className="w-3 h-3" /> Time Remaining
                            </span>
                            <div className="font-mono font-bold text-lg">
                                {market.timeRemaining ? formatTimeRemaining(market.timeRemaining) : 'Expired'}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                                <Hash className="w-3 h-3" /> Pool ID
                            </span>
                            <div className="font-mono font-bold text-lg">{market.poolId}</div>
                        </div>
                    </section>

                    {/* Creator & Security */}
                    <div className="flex flex-wrap items-center gap-4 text-xs p-4 bg-muted/40 rounded-2xl border border-muted-foreground/10 text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>Created by <span className="text-foreground font-mono">{market.creator}</span></span>
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div className="pt-4">
                        <button
                            onClick={() => window.location.href = `/markets/${market.poolId}`}
                            className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Go to Betting Page
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
