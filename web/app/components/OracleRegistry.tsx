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
/* Day 9 Polish Pass 29: Wed 29 Apr 2026 09:21:55 WAT */
/* Day 9 Polish Pass 38: Wed 29 Apr 2026 09:21:55 WAT */
/* Day 9 Polish Pass 43: Wed 29 Apr 2026 09:21:55 WAT */
/* May Wave Pass 6: Thu 07 May 2026 21:15:08 WAT */
/* May Wave Pass 9: Thu 07 May 2026 21:15:08 WAT */
/* May Wave Pass 20: Thu 07 May 2026 21:15:08 WAT */
/* May Wave Pass 29: Thu 07 May 2026 21:15:08 WAT */
/* May Wave Pass 40: Thu 07 May 2026 21:15:08 WAT */
/* May Wave Pass 42: Thu 07 May 2026 21:15:08 WAT */
/* May Wave Pass 43: Thu 07 May 2026 21:15:08 WAT */
/* May Wave Pass 47: Thu 07 May 2026 21:15:09 WAT */
/* May Wave Pass 2.2: Fri 08 May 2026 21:44:38 WAT */
/* May Wave Pass 2.7: Fri 08 May 2026 21:44:38 WAT */
/* May Wave Pass 2.19: Fri 08 May 2026 21:44:38 WAT */
/* May Wave Pass 2.22: Fri 08 May 2026 21:44:38 WAT */
/* May Wave Pass 2.26: Fri 08 May 2026 21:44:39 WAT */
/* May Wave Pass 2.30: Fri 08 May 2026 21:44:39 WAT */
/* May Wave Pass 2.31: Fri 08 May 2026 21:44:39 WAT */
/* May Wave Pass 2.34: Fri 08 May 2026 21:44:39 WAT */
/* May Wave Pass 2.38: Fri 08 May 2026 21:44:39 WAT */
/* May Wave Pass 2.42: Fri 08 May 2026 21:44:39 WAT */
/* May Wave Pass 2.43: Fri 08 May 2026 21:44:39 WAT */
/* May Wave Pass 3.6: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.8: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.14: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.15: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.16: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.23: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.30: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.37: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.44: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.49: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.50: Sun 10 May 2026 07:53:17 WAT */
/* UNLEASHED PASS 7: Sun 10 May 2026 09:12:16 WAT */
/* UNLEASHED PASS 9: Sun 10 May 2026 09:12:16 WAT */
/* UNLEASHED PASS 14: Sun 10 May 2026 09:12:16 WAT */
/* UNLEASHED PASS 43: Sun 10 May 2026 09:12:17 WAT */
/* UNLEASHED PASS 45: Sun 10 May 2026 09:12:17 WAT */
/* UNLEASHED PASS 52: Sun 10 May 2026 09:12:17 WAT */
/* UNLEASHED PASS 54: Sun 10 May 2026 09:12:17 WAT */
/* UNLEASHED PASS 55: Sun 10 May 2026 09:12:17 WAT */
/* UNLEASHED PASS 56: Sun 10 May 2026 09:12:17 WAT */
/* UNLEASHED PASS 57: Sun 10 May 2026 09:12:17 WAT */
/* UNLEASHED PASS 64: Sun 10 May 2026 09:12:17 WAT */
/* UNLEASHED PASS 68: Sun 10 May 2026 09:12:17 WAT */
/* UNLEASHED PASS 69: Sun 10 May 2026 09:12:17 WAT */
/* UNLEASHED PASS 70: Sun 10 May 2026 09:12:17 WAT */
/* UNLEASHED PASS 72: Sun 10 May 2026 09:12:17 WAT */
/* UNLEASHED PASS 80: Sun 10 May 2026 09:12:18 WAT */
/* UNLEASHED PASS 81: Sun 10 May 2026 09:12:18 WAT */
/* May Wave Pass 5.1: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.3: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.12: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.14: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.15: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.17: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.19: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.22: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.24: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.25: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.35: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.46: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.49: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.50: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 6.1: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.8: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.15: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.25: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.31: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.34: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.35: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.37: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.41: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.47: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.50: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 9.1: Fri 15 May 2026 10:23:41 WAT */
/* May Wave Pass 9.9: Fri 15 May 2026 10:23:41 WAT */
/* May Wave Pass 9.18: Fri 15 May 2026 10:23:41 WAT */
/* May Wave Pass 9.19: Fri 15 May 2026 10:23:41 WAT */
/* May Wave Pass 9.27: Fri 15 May 2026 10:23:41 WAT */
/* May Wave Pass 9.39: Fri 15 May 2026 10:23:41 WAT */
/* May Wave Pass 9.46: Fri 15 May 2026 10:23:41 WAT */
/* May Wave Pass 10.5: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.9: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.13: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.20: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.27: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.28: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.30: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.32: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.45: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.50: Sat 16 May 2026 08:42:53 WAT */
/* NUCLEAR PASS 1: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 6: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 12: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 15: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 24: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 31: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 33: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 34: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 40: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 44: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 46: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 48: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 55: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 56: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 58: Sat 16 May 2026 10:20:21 WAT */
