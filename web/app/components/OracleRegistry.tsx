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
/* NUCLEAR PASS 67: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 75: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 81: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 82: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 87: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 88: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 95: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 97: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 99: Sat 16 May 2026 10:20:21 WAT */
/* WIN PASS 4: Sat 16 May 2026 23:33:44 WAT */
/* WIN PASS 8: Sat 16 May 2026 23:33:44 WAT */
/* WIN PASS 9: Sat 16 May 2026 23:33:44 WAT */
/* WIN PASS 10: Sat 16 May 2026 23:33:44 WAT */
/* WIN PASS 20: Sat 16 May 2026 23:33:44 WAT */
/* WIN PASS 23: Sat 16 May 2026 23:33:44 WAT */
/* WIN PASS 24: Sat 16 May 2026 23:33:44 WAT */
/* WIN PASS 28: Sat 16 May 2026 23:33:44 WAT */
/* WIN PASS 34: Sat 16 May 2026 23:33:45 WAT */
/* WIN PASS 43: Sat 16 May 2026 23:33:45 WAT */
/* WIN PASS 44: Sat 16 May 2026 23:33:45 WAT */
/* WIN PASS 45: Sat 16 May 2026 23:33:45 WAT */
/* WIN PASS 46: Sat 16 May 2026 23:33:45 WAT */
/* WIN PASS 49: Sat 16 May 2026 23:33:45 WAT */
/* NUCLEAR PASS 1: Sat 16 May 2026 23:34:27 WAT */
/* NUCLEAR PASS 7: Sat 16 May 2026 23:34:27 WAT */
/* NUCLEAR PASS 9: Sat 16 May 2026 23:34:27 WAT */
/* NUCLEAR PASS 14: Sat 16 May 2026 23:34:27 WAT */
/* NUCLEAR PASS 25: Sat 16 May 2026 23:34:27 WAT */
/* NUCLEAR PASS 27: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 29: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 30: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 31: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 34: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 38: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 43: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 46: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 47: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 48: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 52: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 54: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 55: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 59: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 67: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 68: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 71: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 75: Sat 16 May 2026 23:34:29 WAT */
/* NUCLEAR PASS 78: Sat 16 May 2026 23:34:29 WAT */
/* NUCLEAR PASS 80: Sat 16 May 2026 23:34:29 WAT */
/* NUCLEAR PASS 86: Sat 16 May 2026 23:34:29 WAT */
/* NUCLEAR PASS 87: Sat 16 May 2026 23:34:29 WAT */
/* NUCLEAR PASS 97: Sat 16 May 2026 23:34:29 WAT */
/* NUCLEAR PASS 99: Sat 16 May 2026 23:34:29 WAT */
/* UNLEASHED PASS 3: Sun 17 May 2026 07:34:45 WAT */
/* UNLEASHED PASS 7: Sun 17 May 2026 07:34:45 WAT */
/* UNLEASHED PASS 19: Sun 17 May 2026 07:34:45 WAT */
/* UNLEASHED PASS 23: Sun 17 May 2026 07:34:45 WAT */
/* UNLEASHED PASS 31: Sun 17 May 2026 07:34:45 WAT */
/* UNLEASHED PASS 40: Sun 17 May 2026 07:34:45 WAT */
/* UNLEASHED PASS 41: Sun 17 May 2026 07:34:45 WAT */
/* UNLEASHED PASS 43: Sun 17 May 2026 07:34:45 WAT */
/* UNLEASHED PASS 67: Sun 17 May 2026 07:34:46 WAT */
/* UNLEASHED PASS 69: Sun 17 May 2026 07:34:46 WAT */
/* UNLEASHED PASS 72: Sun 17 May 2026 07:34:46 WAT */
/* UNLEASHED PASS 74: Sun 17 May 2026 07:34:46 WAT */
/* UNLEASHED PASS 81: Sun 17 May 2026 07:34:46 WAT */
/* UNLEASHED PASS 82: Sun 17 May 2026 07:34:46 WAT */
/* UNLEASHED PASS 86: Sun 17 May 2026 07:34:46 WAT */
/* UNLEASHED PASS 95: Sun 17 May 2026 07:34:46 WAT */
/* UNLEASHED PASS 96: Sun 17 May 2026 07:34:46 WAT */
/* UNLEASHED PASS 99: Sun 17 May 2026 07:34:46 WAT */
/* WIN PASS 1: Mon 18 May 2026 08:32:04 WAT */
/* WIN PASS 12: Mon 18 May 2026 08:32:04 WAT */
/* WIN PASS 16: Mon 18 May 2026 08:32:04 WAT */
/* WIN PASS 17: Mon 18 May 2026 08:32:04 WAT */
/* WIN PASS 18: Mon 18 May 2026 08:32:04 WAT */
/* WIN PASS 24: Mon 18 May 2026 08:32:04 WAT */
/* WIN PASS 25: Mon 18 May 2026 08:32:04 WAT */
/* WIN PASS 27: Mon 18 May 2026 08:32:04 WAT */
/* WIN PASS 33: Mon 18 May 2026 08:32:04 WAT */
/* WIN PASS 34: Mon 18 May 2026 08:32:04 WAT */
/* WIN PASS 36: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 38: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 44: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 45: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 47: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 56: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 61: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 64: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 66: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 69: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 72: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 73: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 77: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 80: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 81: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 82: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 84: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 92: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 94: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 100: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 105: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 107: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 109: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 117: Mon 18 May 2026 08:32:06 WAT */
/* WIN PASS 118: Mon 18 May 2026 08:32:06 WAT */
/* WIN PASS 122: Mon 18 May 2026 08:32:06 WAT */
/* WIN PASS 123: Mon 18 May 2026 08:32:06 WAT */
/* WIN PASS 126: Mon 18 May 2026 08:32:06 WAT */
/* WIN PASS 149: Mon 18 May 2026 08:32:06 WAT */
/* WIN PASS 3: Tue 19 May 2026 06:02:10 WAT */
/* WIN PASS 11: Tue 19 May 2026 06:02:10 WAT */
/* WIN PASS 13: Tue 19 May 2026 06:02:10 WAT */
/* WIN PASS 16: Tue 19 May 2026 06:02:10 WAT */
/* WIN PASS 19: Tue 19 May 2026 06:02:10 WAT */
/* WIN PASS 23: Tue 19 May 2026 06:02:10 WAT */
/* WIN PASS 24: Tue 19 May 2026 06:02:10 WAT */
/* WIN PASS 30: Tue 19 May 2026 06:02:10 WAT */
/* WIN PASS 32: Tue 19 May 2026 06:02:10 WAT */
/* WIN PASS 40: Tue 19 May 2026 06:02:10 WAT */
/* WIN PASS 47: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 48: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 50: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 57: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 60: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 62: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 64: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 66: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 70: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 73: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 75: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 78: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 81: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 87: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 92: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 96: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 101: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 103: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 106: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 108: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 109: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 112: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 116: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 117: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 118: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 119: Tue 19 May 2026 06:02:12 WAT */
/* WIN PASS 121: Tue 19 May 2026 06:02:12 WAT */
/* WIN PASS 131: Tue 19 May 2026 06:02:12 WAT */
/* WIN PASS 135: Tue 19 May 2026 06:02:12 WAT */
/* WIN PASS 136: Tue 19 May 2026 06:02:12 WAT */
/* WIN PASS 146: Tue 19 May 2026 06:02:12 WAT */
/* Day 10 Polish Pass 7: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 9: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 10: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 16: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 19: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 27: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 39: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 48: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 50: Wed 20 May 2026 07:44:18 WAT */
/* Day 11 Polish Pass 4: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 8: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 9: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 13: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 16: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 17: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 18: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 22: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 24: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 33: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 47: Thu 21 May 2026 06:12:16 WAT */
/* Day 12 Polish Pass 2: Fri 22 May 2026 07:24:39 WAT */
/* Day 12 Polish Pass 3: Fri 22 May 2026 07:24:39 WAT */
/* Day 12 Polish Pass 4: Fri 22 May 2026 07:24:39 WAT */
/* Day 12 Polish Pass 12: Fri 22 May 2026 07:24:40 WAT */
/* Day 12 Polish Pass 14: Fri 22 May 2026 07:24:40 WAT */
/* Day 12 Polish Pass 15: Fri 22 May 2026 07:24:40 WAT */
/* Day 12 Polish Pass 20: Fri 22 May 2026 07:24:40 WAT */
/* Day 12 Polish Pass 21: Fri 22 May 2026 07:24:40 WAT */
/* Day 12 Polish Pass 22: Fri 22 May 2026 07:24:40 WAT */
/* Day 12 Polish Pass 26: Fri 22 May 2026 07:24:40 WAT */
/* Day 12 Polish Pass 33: Fri 22 May 2026 07:24:40 WAT */
/* Day 12 Polish Pass 47: Fri 22 May 2026 07:24:40 WAT */
/* Day 13 Polish Pass 5: Sat 23 May 2026 07:13:07 WAT */
/* Day 13 Polish Pass 6: Sat 23 May 2026 07:13:07 WAT */
/* Day 13 Polish Pass 17: Sat 23 May 2026 07:13:07 WAT */
/* Day 13 Polish Pass 20: Sat 23 May 2026 07:13:07 WAT */
/* Day 13 Polish Pass 26: Sat 23 May 2026 07:13:07 WAT */
/* Day 13 Polish Pass 28: Sat 23 May 2026 07:13:07 WAT */
/* Day 13 Polish Pass 33: Sat 23 May 2026 07:13:07 WAT */
/* Day 13 Polish Pass 35: Sat 23 May 2026 07:13:08 WAT */
/* Day 13 Polish Pass 38: Sat 23 May 2026 07:13:08 WAT */
/* Day 13 Polish Pass 41: Sat 23 May 2026 07:13:08 WAT */
/* Day 13 Polish Pass 45: Sat 23 May 2026 07:13:08 WAT */
/* Day 13 Polish Pass 47: Sat 23 May 2026 07:13:08 WAT */
/* Day 13 Polish Pass 48: Sat 23 May 2026 07:13:08 WAT */
/* Day 14 Polish Pass 1: Sun 24 May 2026 06:42:32 WAT */
/* Day 14 Polish Pass 2: Sun 24 May 2026 06:42:32 WAT */
/* Day 14 Polish Pass 4: Sun 24 May 2026 06:42:32 WAT */
/* Day 14 Polish Pass 11: Sun 24 May 2026 06:42:33 WAT */
/* Day 14 Polish Pass 13: Sun 24 May 2026 06:42:33 WAT */
/* Day 14 Polish Pass 15: Sun 24 May 2026 06:42:33 WAT */
/* Day 14 Polish Pass 19: Sun 24 May 2026 06:42:33 WAT */
/* Day 14 Polish Pass 22: Sun 24 May 2026 06:42:33 WAT */
/* Day 14 Polish Pass 33: Sun 24 May 2026 06:42:33 WAT */
/* Day 14 Polish Pass 1: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 9: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 11: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 13: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 14: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 15: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 17: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 20: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 25: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 27: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 29: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 32: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 42: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 43: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 45: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 4: Wed May 27 05:24:46 WAT 2026 */
/* Day 14 Polish Pass 7: Wed May 27 05:24:46 WAT 2026 */
/* Day 14 Polish Pass 8: Wed May 27 05:24:46 WAT 2026 */
/* Day 14 Polish Pass 14: Wed May 27 05:24:46 WAT 2026 */
/* Day 14 Polish Pass 26: Wed May 27 05:24:46 WAT 2026 */
/* Day 14 Polish Pass 42: Wed May 27 05:24:47 WAT 2026 */
/* Day 14 Polish Pass 43: Wed May 27 05:24:47 WAT 2026 */
/* Day 14 Polish Pass 45: Wed May 27 05:24:47 WAT 2026 */
/* Day 14 Polish Pass 50: Wed May 27 05:24:47 WAT 2026 */
/* Day 18 Polish Pass 1: Fri 29 May 2026 05:28:34 WAT */
/* Day 18 Polish Pass 2: Fri 29 May 2026 05:28:34 WAT */
/* Day 18 Polish Pass 14: Fri 29 May 2026 05:28:35 WAT */
/* Day 18 Polish Pass 15: Fri 29 May 2026 05:28:35 WAT */
/* Day 18 Polish Pass 20: Fri 29 May 2026 05:28:35 WAT */
/* Day 18 Polish Pass 22: Fri 29 May 2026 05:28:35 WAT */
/* Day 18 Polish Pass 31: Fri 29 May 2026 05:28:35 WAT */
/* Day 18 Polish Pass 32: Fri 29 May 2026 05:28:35 WAT */
/* Day 18 Polish Pass 37: Fri 29 May 2026 05:28:35 WAT */
/* Day 18 Polish Pass 39: Fri 29 May 2026 05:28:35 WAT */
/* Day 19 Polish Pass 2: Sat 30 May 2026 09:17:05 WAT */
/* Day 19 Polish Pass 10: Sat 30 May 2026 09:17:05 WAT */
/* Day 19 Polish Pass 12: Sat 30 May 2026 09:17:05 WAT */
/* Day 19 Polish Pass 13: Sat 30 May 2026 09:17:05 WAT */
/* Day 19 Polish Pass 14: Sat 30 May 2026 09:17:05 WAT */
/* Day 19 Polish Pass 19: Sat 30 May 2026 09:17:05 WAT */
/* Day 19 Polish Pass 23: Sat 30 May 2026 09:17:05 WAT */
/* Day 19 Polish Pass 24: Sat 30 May 2026 09:17:05 WAT */
/* Day 19 Polish Pass 35: Sat 30 May 2026 09:17:05 WAT */
/* Day 19 Polish Pass 37: Sat 30 May 2026 09:17:05 WAT */
/* Day 19 Polish Pass 44: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 46: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 47: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 57: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 59: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 61: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 67: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 70: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 73: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 78: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 79: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 87: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 91: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 98: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 100: Sat 30 May 2026 09:17:06 WAT */
/* Day 20 Polish Pass 1: Sun 31 May 2026 06:59:52 WAT */
/* Day 20 Polish Pass 2: Sun 31 May 2026 06:59:52 WAT */
/* Day 20 Polish Pass 4: Sun 31 May 2026 06:59:52 WAT */
/* Day 20 Polish Pass 9: Sun 31 May 2026 06:59:52 WAT */
/* Day 20 Polish Pass 12: Sun 31 May 2026 06:59:52 WAT */
/* Day 20 Polish Pass 20: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 23: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 30: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 34: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 35: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 38: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 40: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 41: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 46: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 55: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 57: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 65: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 76: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 80: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 82: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 100: Sun 31 May 2026 06:59:53 WAT */
/* Day 21 Polish Pass 3: Thu 11 Jun 2026 13:18:06 WAT */
/* Day 21 Polish Pass 15: Thu 11 Jun 2026 13:18:06 WAT */
/* Day 21 Polish Pass 16: Thu 11 Jun 2026 13:18:06 WAT */
/* Day 21 Polish Pass 24: Thu 11 Jun 2026 13:18:07 WAT */
/* Day 21 Polish Pass 25: Thu 11 Jun 2026 13:18:07 WAT */
/* Day 21 Polish Pass 26: Thu 11 Jun 2026 13:18:07 WAT */
/* Day 21 Polish Pass 28: Thu 11 Jun 2026 13:18:07 WAT */
/* Day 21 Polish Pass 32: Thu 11 Jun 2026 13:18:07 WAT */
/* Day 21 Polish Pass 34: Thu 11 Jun 2026 13:18:07 WAT */
/* Day 21 Polish Pass 38: Thu 11 Jun 2026 13:18:07 WAT */
/* Day 21 Polish Pass 51: Thu 11 Jun 2026 13:18:07 WAT */
/* Day 21 Polish Pass 53: Thu 11 Jun 2026 13:18:07 WAT */
/* Day 21 Polish Pass 54: Thu 11 Jun 2026 13:18:07 WAT */
/* Day 21 Polish Pass 61: Thu 11 Jun 2026 13:18:07 WAT */
/* Day 21 Polish Pass 62: Thu 11 Jun 2026 13:18:07 WAT */
/* Day 21 Polish Pass 71: Thu 11 Jun 2026 13:18:08 WAT */
/* Day 21 Polish Pass 72: Thu 11 Jun 2026 13:18:08 WAT */
/* Day 21 Polish Pass 74: Thu 11 Jun 2026 13:18:08 WAT */
/* Day 21 Polish Pass 79: Thu 11 Jun 2026 13:18:08 WAT */
/* Day 21 Polish Pass 80: Thu 11 Jun 2026 13:18:08 WAT */
/* Day 21 Polish Pass 89: Thu 11 Jun 2026 13:18:08 WAT */
/* Day 21 Polish Pass 90: Thu 11 Jun 2026 13:18:08 WAT */
/* Day 21 Polish Pass 93: Thu 11 Jun 2026 13:18:09 WAT */
/* Day 21 Polish Pass 99: Thu 11 Jun 2026 13:18:09 WAT */
/* June 23 Polish Pass 1: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 2: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 3: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 13: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 17: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 22: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 31: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 38: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 44: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 46: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 48: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 50: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 51: Tue 23 Jun 2026 09:02:05 WAT */
