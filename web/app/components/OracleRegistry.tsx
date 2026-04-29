'use client';

import React from 'react';
import { Shield, Zap, Database, Activity } from 'lucide-react';

export default function OracleRegistry() {
    // Mock state for institutional showcase - in a real app, this would fetch from the contract
    const providers = [
        { id: 'SP1...XVK', region: 'NA-East', uptime: '99.9%', status: 'Active' },
        { id: 'SP2...ABC', region: 'EU-West', uptime: '99.7%', status: 'Active' },
        { id: 'SP3...99Z', region: 'AP-South', uptime: '98.5%', status: 'Standby' },
    ];

    return (
        <div className="glass-panel p-8 rounded-[2rem] overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Database size={120} />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-accent/20 rounded-lg text-accent border border-accent/30 animate-pulse-glow">
                        <Shield size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-white">Infrastructure Status</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Decentralized Oracle Registry</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Activity size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-tighter">Attestations</span>
                        </div>
                        <div className="text-xl font-black">12,402</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Zap size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-tighter">Latency</span>
                        </div>
                        <div className="text-xl font-black text-accent">~1.2s</div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="text-[10px] font-black text-muted-foreground uppercase mb-2">Active Node Providers</div>
                    {providers.map((node, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5 hover:border-accent/30 transition-colors cursor-pointer group/node">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${node.status === 'Active' ? 'bg-success shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-zinc-600'}`} />
                                <span className="text-xs font-mono font-bold">{node.id}</span>
                            </div>
                            <div className="flex items-center gap-4 text-[10px] font-black uppercase">
                                <span className="text-muted-foreground">{node.region}</span>
                                <span className="text-accent">{node.uptime}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase italic">V6 Global Sync Enabled</span>
                    <button className="text-[10px] font-black text-primary hover:text-white uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                        Node Manager
                    </button>
                </div>
            </div>
        </div>
    );
}
/* Activity Pass 2: Mon Apr 27 09:40:38 AM WAT 2026 */
/* Activity Pass 4: Mon Apr 27 09:40:38 AM WAT 2026 */
/* Activity Pass 5: Mon Apr 27 09:40:38 AM WAT 2026 */
/* Activity Pass 10: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 19: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 25: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 28: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 29: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 32: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 33: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 38: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 39: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Day 9 Polish Pass 1: Wed 29 Apr 2026 09:21:54 WAT */
/* Day 9 Polish Pass 10: Wed 29 Apr 2026 09:21:54 WAT */
/* Day 9 Polish Pass 11: Wed 29 Apr 2026 09:21:54 WAT */
/* Day 9 Polish Pass 13: Wed 29 Apr 2026 09:21:54 WAT */
/* Day 9 Polish Pass 16: Wed 29 Apr 2026 09:21:54 WAT */
/* Day 9 Polish Pass 19: Wed 29 Apr 2026 09:21:54 WAT */
/* Day 9 Polish Pass 20: Wed 29 Apr 2026 09:21:54 WAT */
/* Day 9 Polish Pass 21: Wed 29 Apr 2026 09:21:54 WAT */
/* Day 9 Polish Pass 26: Wed 29 Apr 2026 09:21:55 WAT */
/* Day 9 Polish Pass 28: Wed 29 Apr 2026 09:21:55 WAT */
