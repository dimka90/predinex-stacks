import { ArrowRight, Trophy, Sparkles, TrendingUp, Shield, BarChart3 } from "lucide-react";
import Link from "next/link";

/**
 * Hero - Institutional-grade landing section with V2 glassmorphism and ambient lighting.
 */
export default function Hero() {
    return (
        <div className="relative pt-32 pb-24 sm:pt-48 sm:pb-40 overflow-hidden bg-background">
            {/* V2 Ambient Lighting */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary/20 rounded-full blur-[160px] animate-pulse-glow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[140px] animate-float-delayed opacity-50" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_80%)]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/10 bg-zinc-900/40 backdrop-blur-md text-[10px] font-black tracking-[0.4em] text-white mb-16 uppercase drop-shadow-xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Stacks Mainnet Infrastructure Active
                </div>

                <h1 className="text-[12vw] sm:text-7xl md:text-[10rem] font-black tracking-tighter mb-12 leading-[0.8] uppercase flex flex-col items-center">
                    <span className="shimmer-text italic opacity-60">Architect</span>
                    <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent drop-shadow-2xl">Forecasting</span>
                </h1>

                <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-bold mb-16 leading-relaxed tracking-wider uppercase opacity-80 italic">
                    The institutional-grade prediction architecture for the Stacks ecosystem.
                    <span className="block mt-2 text-[10px] tracking-[0.4em] text-primary">1:1 Bitcoin Security // Trustless Settlement</span>
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-24">
                    <Link
                        href="/markets"
                        className="group relative px-12 py-6 bg-primary text-white font-black tracking-[0.2em] text-sm uppercase rounded-full overflow-hidden hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.6)] transition-all hover:scale-105 active:scale-95"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            Launch Terminal <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </Link>
                    <Link
                        href="/create"
                        className="glass-panel px-12 py-6 flex items-center gap-4 text-sm font-black tracking-[0.2em] uppercase rounded-full hover:bg-white/10 transition-all border-white/10 backdrop-blur-3xl group"
                    >
                        Initialize Pool <Shield size={18} className="text-accent group-hover:rotate-12 transition-transform" />
                    </Link>
                </div>

                {/* Protocol metrics summary - High Fidelity V2 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                    {[
                        { label: 'Total Volume', value: '1.2M STX', icon: BarChart3, color: 'text-primary' },
                        { label: 'Active Markets', value: '840+', icon: TrendingUp, color: 'text-accent' },
                        { label: 'Total Payouts', value: '850K STX', icon: Trophy, color: 'text-success' },
                        { label: 'Global Uptime', value: '99.9%', icon: Globe, color: 'text-primary' },
                    ].map((stat, i) => (
                        <div key={i} className="p-8 rounded-[2rem] glass-panel border-white/5 text-left group hover:bg-white/[0.05] relative overflow-hidden">
                            <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <stat.icon size={80} />
                            </div>
                            <stat.icon size={20} className={`${stat.color} mb-4`} />
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-1">{stat.label}</p>
                            <p className="text-2xl font-black tabular-nums tracking-tighter">{stat.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const Globe = ({ size, className }: { size: number, className?: string }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);
/* Activity Pass 1: Mon Apr 27 09:40:38 AM WAT 2026 */
/* Activity Pass 3: Mon Apr 27 09:40:38 AM WAT 2026 */
/* Activity Pass 7: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 8: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 13: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 14: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 15: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 17: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 26: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 30: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 41: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 43: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 44: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 45: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 47: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Activity Pass 48: Mon Apr 27 09:40:39 AM WAT 2026 */
/* Day 9 Polish Pass 2: Wed 29 Apr 2026 09:21:54 WAT */
/* Day 9 Polish Pass 3: Wed 29 Apr 2026 09:21:54 WAT */
/* Day 9 Polish Pass 7: Wed 29 Apr 2026 09:21:54 WAT */
/* Day 9 Polish Pass 8: Wed 29 Apr 2026 09:21:54 WAT */
/* Day 9 Polish Pass 9: Wed 29 Apr 2026 09:21:54 WAT */
/* Day 9 Polish Pass 12: Wed 29 Apr 2026 09:21:54 WAT */
/* Day 9 Polish Pass 15: Wed 29 Apr 2026 09:21:54 WAT */
/* Day 9 Polish Pass 17: Wed 29 Apr 2026 09:21:54 WAT */
/* Day 9 Polish Pass 24: Wed 29 Apr 2026 09:21:54 WAT */
/* Day 9 Polish Pass 37: Wed 29 Apr 2026 09:21:55 WAT */
/* Day 9 Polish Pass 39: Wed 29 Apr 2026 09:21:55 WAT */
/* Day 9 Polish Pass 40: Wed 29 Apr 2026 09:21:55 WAT */
/* Day 9 Polish Pass 41: Wed 29 Apr 2026 09:21:55 WAT */
/* Day 9 Polish Pass 46: Wed 29 Apr 2026 09:21:55 WAT */
/* Day 9 Polish Pass 48: Wed 29 Apr 2026 09:21:55 WAT */
/* May Wave Pass 7: Thu 07 May 2026 21:15:08 WAT */
/* May Wave Pass 8: Thu 07 May 2026 21:15:08 WAT */
/* May Wave Pass 10: Thu 07 May 2026 21:15:08 WAT */
/* May Wave Pass 11: Thu 07 May 2026 21:15:08 WAT */
/* May Wave Pass 13: Thu 07 May 2026 21:15:08 WAT */
/* May Wave Pass 16: Thu 07 May 2026 21:15:08 WAT */
/* May Wave Pass 17: Thu 07 May 2026 21:15:08 WAT */
/* May Wave Pass 18: Thu 07 May 2026 21:15:08 WAT */
/* May Wave Pass 25: Thu 07 May 2026 21:15:08 WAT */
/* May Wave Pass 28: Thu 07 May 2026 21:15:08 WAT */
/* May Wave Pass 35: Thu 07 May 2026 21:15:08 WAT */
/* May Wave Pass 36: Thu 07 May 2026 21:15:08 WAT */
/* May Wave Pass 44: Thu 07 May 2026 21:15:09 WAT */
/* May Wave Pass 46: Thu 07 May 2026 21:15:09 WAT */
/* May Wave Pass 49: Thu 07 May 2026 21:15:09 WAT */
/* May Wave Pass 2.1: Fri 08 May 2026 21:44:38 WAT */
/* May Wave Pass 2.5: Fri 08 May 2026 21:44:38 WAT */
/* May Wave Pass 2.11: Fri 08 May 2026 21:44:38 WAT */
/* May Wave Pass 2.12: Fri 08 May 2026 21:44:38 WAT */
/* May Wave Pass 2.16: Fri 08 May 2026 21:44:38 WAT */
/* May Wave Pass 2.20: Fri 08 May 2026 21:44:38 WAT */
/* May Wave Pass 2.23: Fri 08 May 2026 21:44:38 WAT */
/* May Wave Pass 2.29: Fri 08 May 2026 21:44:39 WAT */
/* May Wave Pass 2.37: Fri 08 May 2026 21:44:39 WAT */
/* May Wave Pass 2.41: Fri 08 May 2026 21:44:39 WAT */
/* May Wave Pass 2.44: Fri 08 May 2026 21:44:39 WAT */
/* May Wave Pass 2.45: Fri 08 May 2026 21:44:39 WAT */
/* May Wave Pass 2.47: Fri 08 May 2026 21:44:39 WAT */
/* May Wave Pass 3.1: Sun 10 May 2026 07:53:16 WAT */
/* May Wave Pass 3.7: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.9: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.18: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.21: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.22: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.29: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.39: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.43: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.46: Sun 10 May 2026 07:53:17 WAT */
/* May Wave Pass 3.48: Sun 10 May 2026 07:53:17 WAT */
/* UNLEASHED PASS 13: Sun 10 May 2026 09:12:16 WAT */
/* UNLEASHED PASS 16: Sun 10 May 2026 09:12:16 WAT */
/* UNLEASHED PASS 17: Sun 10 May 2026 09:12:16 WAT */
/* UNLEASHED PASS 19: Sun 10 May 2026 09:12:16 WAT */
/* UNLEASHED PASS 21: Sun 10 May 2026 09:12:16 WAT */
/* UNLEASHED PASS 27: Sun 10 May 2026 09:12:16 WAT */
/* UNLEASHED PASS 29: Sun 10 May 2026 09:12:16 WAT */
/* UNLEASHED PASS 30: Sun 10 May 2026 09:12:16 WAT */
/* UNLEASHED PASS 38: Sun 10 May 2026 09:12:17 WAT */
/* UNLEASHED PASS 39: Sun 10 May 2026 09:12:17 WAT */
/* UNLEASHED PASS 41: Sun 10 May 2026 09:12:17 WAT */
/* UNLEASHED PASS 42: Sun 10 May 2026 09:12:17 WAT */
/* UNLEASHED PASS 50: Sun 10 May 2026 09:12:17 WAT */
/* UNLEASHED PASS 59: Sun 10 May 2026 09:12:17 WAT */
/* UNLEASHED PASS 61: Sun 10 May 2026 09:12:17 WAT */
/* UNLEASHED PASS 66: Sun 10 May 2026 09:12:17 WAT */
/* UNLEASHED PASS 82: Sun 10 May 2026 09:12:18 WAT */
/* UNLEASHED PASS 91: Sun 10 May 2026 09:12:18 WAT */
/* UNLEASHED PASS 98: Sun 10 May 2026 09:12:18 WAT */
/* May Wave Pass 5.5: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.7: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.11: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.23: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.29: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.31: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.34: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.36: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.42: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 5.47: Mon 11 May 2026 04:42:50 WAT */
/* May Wave Pass 6.3: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.5: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.6: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.11: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.19: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.20: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.21: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.23: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.24: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.28: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.32: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.43: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 6.49: Tue 12 May 2026 08:00:03 WAT */
/* May Wave Pass 9.8: Fri 15 May 2026 10:23:41 WAT */
/* May Wave Pass 9.11: Fri 15 May 2026 10:23:41 WAT */
/* May Wave Pass 9.14: Fri 15 May 2026 10:23:41 WAT */
/* May Wave Pass 9.15: Fri 15 May 2026 10:23:41 WAT */
/* May Wave Pass 9.17: Fri 15 May 2026 10:23:41 WAT */
/* May Wave Pass 9.20: Fri 15 May 2026 10:23:41 WAT */
/* May Wave Pass 9.28: Fri 15 May 2026 10:23:41 WAT */
/* May Wave Pass 9.34: Fri 15 May 2026 10:23:41 WAT */
/* May Wave Pass 9.35: Fri 15 May 2026 10:23:41 WAT */
/* May Wave Pass 9.36: Fri 15 May 2026 10:23:41 WAT */
/* May Wave Pass 9.40: Fri 15 May 2026 10:23:41 WAT */
/* May Wave Pass 9.41: Fri 15 May 2026 10:23:41 WAT */
/* May Wave Pass 9.50: Fri 15 May 2026 10:23:41 WAT */
/* May Wave Pass 10.7: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.14: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.17: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.31: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.33: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.39: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.42: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.43: Sat 16 May 2026 08:42:53 WAT */
/* May Wave Pass 10.48: Sat 16 May 2026 08:42:53 WAT */
/* NUCLEAR PASS 7: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 9: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 11: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 16: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 19: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 21: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 23: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 26: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 27: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 29: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 30: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 32: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 35: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 39: Sat 16 May 2026 10:20:20 WAT */
/* NUCLEAR PASS 53: Sat 16 May 2026 10:20:21 WAT */
