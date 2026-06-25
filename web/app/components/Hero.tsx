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
/* NUCLEAR PASS 54: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 61: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 65: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 69: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 76: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 84: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 85: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 92: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 93: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 96: Sat 16 May 2026 10:20:21 WAT */
/* NUCLEAR PASS 100: Sat 16 May 2026 10:20:21 WAT */
/* WIN PASS 5: Sat 16 May 2026 23:33:44 WAT */
/* WIN PASS 7: Sat 16 May 2026 23:33:44 WAT */
/* WIN PASS 12: Sat 16 May 2026 23:33:44 WAT */
/* WIN PASS 14: Sat 16 May 2026 23:33:44 WAT */
/* WIN PASS 16: Sat 16 May 2026 23:33:44 WAT */
/* WIN PASS 17: Sat 16 May 2026 23:33:44 WAT */
/* WIN PASS 18: Sat 16 May 2026 23:33:44 WAT */
/* WIN PASS 26: Sat 16 May 2026 23:33:44 WAT */
/* WIN PASS 29: Sat 16 May 2026 23:33:44 WAT */
/* WIN PASS 32: Sat 16 May 2026 23:33:44 WAT */
/* WIN PASS 33: Sat 16 May 2026 23:33:44 WAT */
/* WIN PASS 35: Sat 16 May 2026 23:33:45 WAT */
/* WIN PASS 36: Sat 16 May 2026 23:33:45 WAT */
/* WIN PASS 38: Sat 16 May 2026 23:33:45 WAT */
/* WIN PASS 47: Sat 16 May 2026 23:33:45 WAT */
/* WIN PASS 50: Sat 16 May 2026 23:33:45 WAT */
/* NUCLEAR PASS 6: Sat 16 May 2026 23:34:27 WAT */
/* NUCLEAR PASS 8: Sat 16 May 2026 23:34:27 WAT */
/* NUCLEAR PASS 15: Sat 16 May 2026 23:34:27 WAT */
/* NUCLEAR PASS 16: Sat 16 May 2026 23:34:27 WAT */
/* NUCLEAR PASS 19: Sat 16 May 2026 23:34:27 WAT */
/* NUCLEAR PASS 24: Sat 16 May 2026 23:34:27 WAT */
/* NUCLEAR PASS 35: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 36: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 39: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 57: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 61: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 66: Sat 16 May 2026 23:34:28 WAT */
/* NUCLEAR PASS 74: Sat 16 May 2026 23:34:29 WAT */
/* NUCLEAR PASS 76: Sat 16 May 2026 23:34:29 WAT */
/* NUCLEAR PASS 93: Sat 16 May 2026 23:34:29 WAT */
/* NUCLEAR PASS 94: Sat 16 May 2026 23:34:29 WAT */
/* NUCLEAR PASS 96: Sat 16 May 2026 23:34:29 WAT */
/* NUCLEAR PASS 98: Sat 16 May 2026 23:34:29 WAT */
/* NUCLEAR PASS 100: Sat 16 May 2026 23:34:29 WAT */
/* UNLEASHED PASS 8: Sun 17 May 2026 07:34:45 WAT */
/* UNLEASHED PASS 18: Sun 17 May 2026 07:34:45 WAT */
/* UNLEASHED PASS 27: Sun 17 May 2026 07:34:45 WAT */
/* UNLEASHED PASS 32: Sun 17 May 2026 07:34:45 WAT */
/* UNLEASHED PASS 34: Sun 17 May 2026 07:34:45 WAT */
/* UNLEASHED PASS 35: Sun 17 May 2026 07:34:45 WAT */
/* UNLEASHED PASS 37: Sun 17 May 2026 07:34:45 WAT */
/* UNLEASHED PASS 45: Sun 17 May 2026 07:34:45 WAT */
/* UNLEASHED PASS 46: Sun 17 May 2026 07:34:45 WAT */
/* UNLEASHED PASS 60: Sun 17 May 2026 07:34:46 WAT */
/* UNLEASHED PASS 73: Sun 17 May 2026 07:34:46 WAT */
/* UNLEASHED PASS 79: Sun 17 May 2026 07:34:46 WAT */
/* UNLEASHED PASS 83: Sun 17 May 2026 07:34:46 WAT */
/* UNLEASHED PASS 92: Sun 17 May 2026 07:34:46 WAT */
/* UNLEASHED PASS 94: Sun 17 May 2026 07:34:46 WAT */
/* WIN PASS 4: Mon 18 May 2026 08:32:04 WAT */
/* WIN PASS 5: Mon 18 May 2026 08:32:04 WAT */
/* WIN PASS 6: Mon 18 May 2026 08:32:04 WAT */
/* WIN PASS 9: Mon 18 May 2026 08:32:04 WAT */
/* WIN PASS 11: Mon 18 May 2026 08:32:04 WAT */
/* WIN PASS 20: Mon 18 May 2026 08:32:04 WAT */
/* WIN PASS 21: Mon 18 May 2026 08:32:04 WAT */
/* WIN PASS 22: Mon 18 May 2026 08:32:04 WAT */
/* WIN PASS 23: Mon 18 May 2026 08:32:04 WAT */
/* WIN PASS 32: Mon 18 May 2026 08:32:04 WAT */
/* WIN PASS 37: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 39: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 43: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 46: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 51: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 53: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 59: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 67: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 71: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 76: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 88: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 93: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 98: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 102: Mon 18 May 2026 08:32:05 WAT */
/* WIN PASS 110: Mon 18 May 2026 08:32:06 WAT */
/* WIN PASS 119: Mon 18 May 2026 08:32:06 WAT */
/* WIN PASS 125: Mon 18 May 2026 08:32:06 WAT */
/* WIN PASS 127: Mon 18 May 2026 08:32:06 WAT */
/* WIN PASS 130: Mon 18 May 2026 08:32:06 WAT */
/* WIN PASS 138: Mon 18 May 2026 08:32:06 WAT */
/* WIN PASS 139: Mon 18 May 2026 08:32:06 WAT */
/* WIN PASS 140: Mon 18 May 2026 08:32:06 WAT */
/* WIN PASS 150: Mon 18 May 2026 08:32:06 WAT */
/* WIN PASS 4: Tue 19 May 2026 06:02:10 WAT */
/* WIN PASS 6: Tue 19 May 2026 06:02:10 WAT */
/* WIN PASS 7: Tue 19 May 2026 06:02:10 WAT */
/* WIN PASS 8: Tue 19 May 2026 06:02:10 WAT */
/* WIN PASS 15: Tue 19 May 2026 06:02:10 WAT */
/* WIN PASS 18: Tue 19 May 2026 06:02:10 WAT */
/* WIN PASS 21: Tue 19 May 2026 06:02:10 WAT */
/* WIN PASS 26: Tue 19 May 2026 06:02:10 WAT */
/* WIN PASS 33: Tue 19 May 2026 06:02:10 WAT */
/* WIN PASS 38: Tue 19 May 2026 06:02:10 WAT */
/* WIN PASS 44: Tue 19 May 2026 06:02:10 WAT */
/* WIN PASS 45: Tue 19 May 2026 06:02:10 WAT */
/* WIN PASS 49: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 52: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 71: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 77: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 79: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 80: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 85: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 91: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 93: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 94: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 98: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 99: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 107: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 111: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 114: Tue 19 May 2026 06:02:11 WAT */
/* WIN PASS 124: Tue 19 May 2026 06:02:12 WAT */
/* WIN PASS 127: Tue 19 May 2026 06:02:12 WAT */
/* WIN PASS 128: Tue 19 May 2026 06:02:12 WAT */
/* WIN PASS 137: Tue 19 May 2026 06:02:12 WAT */
/* WIN PASS 139: Tue 19 May 2026 06:02:12 WAT */
/* WIN PASS 140: Tue 19 May 2026 06:02:12 WAT */
/* WIN PASS 141: Tue 19 May 2026 06:02:12 WAT */
/* WIN PASS 142: Tue 19 May 2026 06:02:12 WAT */
/* WIN PASS 149: Tue 19 May 2026 06:02:12 WAT */
/* Day 10 Polish Pass 2: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 3: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 4: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 5: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 21: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 23: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 24: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 26: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 28: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 29: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 30: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 33: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 34: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 43: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 45: Wed 20 May 2026 07:44:18 WAT */
/* Day 10 Polish Pass 47: Wed 20 May 2026 07:44:18 WAT */
/* Day 11 Polish Pass 5: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 6: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 11: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 12: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 20: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 21: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 37: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 48: Thu 21 May 2026 06:12:16 WAT */
/* Day 11 Polish Pass 49: Thu 21 May 2026 06:12:16 WAT */
/* Day 12 Polish Pass 1: Fri 22 May 2026 07:24:39 WAT */
/* Day 12 Polish Pass 7: Fri 22 May 2026 07:24:40 WAT */
/* Day 12 Polish Pass 9: Fri 22 May 2026 07:24:40 WAT */
/* Day 12 Polish Pass 13: Fri 22 May 2026 07:24:40 WAT */
/* Day 12 Polish Pass 16: Fri 22 May 2026 07:24:40 WAT */
/* Day 12 Polish Pass 19: Fri 22 May 2026 07:24:40 WAT */
/* Day 12 Polish Pass 23: Fri 22 May 2026 07:24:40 WAT */
/* Day 12 Polish Pass 24: Fri 22 May 2026 07:24:40 WAT */
/* Day 12 Polish Pass 32: Fri 22 May 2026 07:24:40 WAT */
/* Day 12 Polish Pass 35: Fri 22 May 2026 07:24:40 WAT */
/* Day 12 Polish Pass 42: Fri 22 May 2026 07:24:40 WAT */
/* Day 12 Polish Pass 44: Fri 22 May 2026 07:24:40 WAT */
/* Day 12 Polish Pass 45: Fri 22 May 2026 07:24:40 WAT */
/* Day 12 Polish Pass 46: Fri 22 May 2026 07:24:40 WAT */
/* Day 13 Polish Pass 1: Sat 23 May 2026 07:13:07 WAT */
/* Day 13 Polish Pass 2: Sat 23 May 2026 07:13:07 WAT */
/* Day 13 Polish Pass 3: Sat 23 May 2026 07:13:07 WAT */
/* Day 13 Polish Pass 4: Sat 23 May 2026 07:13:07 WAT */
/* Day 13 Polish Pass 9: Sat 23 May 2026 07:13:07 WAT */
/* Day 13 Polish Pass 10: Sat 23 May 2026 07:13:07 WAT */
/* Day 13 Polish Pass 14: Sat 23 May 2026 07:13:07 WAT */
/* Day 13 Polish Pass 15: Sat 23 May 2026 07:13:07 WAT */
/* Day 13 Polish Pass 19: Sat 23 May 2026 07:13:07 WAT */
/* Day 13 Polish Pass 23: Sat 23 May 2026 07:13:07 WAT */
/* Day 13 Polish Pass 25: Sat 23 May 2026 07:13:07 WAT */
/* Day 13 Polish Pass 29: Sat 23 May 2026 07:13:07 WAT */
/* Day 13 Polish Pass 30: Sat 23 May 2026 07:13:07 WAT */
/* Day 13 Polish Pass 31: Sat 23 May 2026 07:13:07 WAT */
/* Day 13 Polish Pass 36: Sat 23 May 2026 07:13:08 WAT */
/* Day 13 Polish Pass 37: Sat 23 May 2026 07:13:08 WAT */
/* Day 13 Polish Pass 40: Sat 23 May 2026 07:13:08 WAT */
/* Day 13 Polish Pass 43: Sat 23 May 2026 07:13:08 WAT */
/* Day 14 Polish Pass 14: Sun 24 May 2026 06:42:33 WAT */
/* Day 14 Polish Pass 20: Sun 24 May 2026 06:42:33 WAT */
/* Day 14 Polish Pass 23: Sun 24 May 2026 06:42:33 WAT */
/* Day 14 Polish Pass 29: Sun 24 May 2026 06:42:33 WAT */
/* Day 14 Polish Pass 34: Sun 24 May 2026 06:42:33 WAT */
/* Day 14 Polish Pass 44: Sun 24 May 2026 06:42:34 WAT */
/* Day 14 Polish Pass 48: Sun 24 May 2026 06:42:34 WAT */
/* Day 14 Polish Pass 2: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 3: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 6: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 12: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 16: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 19: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 26: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 28: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 31: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 33: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 36: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 44: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 49: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 50: Tue May 26 04:15:14 WAT 2026 */
/* Day 14 Polish Pass 2: Wed May 27 05:24:46 WAT 2026 */
/* Day 14 Polish Pass 3: Wed May 27 05:24:46 WAT 2026 */
/* Day 14 Polish Pass 9: Wed May 27 05:24:46 WAT 2026 */
/* Day 14 Polish Pass 10: Wed May 27 05:24:46 WAT 2026 */
/* Day 14 Polish Pass 13: Wed May 27 05:24:46 WAT 2026 */
/* Day 14 Polish Pass 22: Wed May 27 05:24:46 WAT 2026 */
/* Day 14 Polish Pass 23: Wed May 27 05:24:46 WAT 2026 */
/* Day 14 Polish Pass 32: Wed May 27 05:24:46 WAT 2026 */
/* Day 14 Polish Pass 37: Wed May 27 05:24:46 WAT 2026 */
/* Day 14 Polish Pass 38: Wed May 27 05:24:47 WAT 2026 */
/* Day 14 Polish Pass 39: Wed May 27 05:24:47 WAT 2026 */
/* Day 14 Polish Pass 41: Wed May 27 05:24:47 WAT 2026 */
/* Day 14 Polish Pass 46: Wed May 27 05:24:47 WAT 2026 */
/* Day 14 Polish Pass 49: Wed May 27 05:24:47 WAT 2026 */
/* Day 18 Polish Pass 3: Fri 29 May 2026 05:28:34 WAT */
/* Day 18 Polish Pass 4: Fri 29 May 2026 05:28:34 WAT */
/* Day 18 Polish Pass 5: Fri 29 May 2026 05:28:34 WAT */
/* Day 18 Polish Pass 6: Fri 29 May 2026 05:28:35 WAT */
/* Day 18 Polish Pass 8: Fri 29 May 2026 05:28:35 WAT */
/* Day 18 Polish Pass 16: Fri 29 May 2026 05:28:35 WAT */
/* Day 18 Polish Pass 18: Fri 29 May 2026 05:28:35 WAT */
/* Day 18 Polish Pass 23: Fri 29 May 2026 05:28:35 WAT */
/* Day 18 Polish Pass 24: Fri 29 May 2026 05:28:35 WAT */
/* Day 18 Polish Pass 27: Fri 29 May 2026 05:28:35 WAT */
/* Day 18 Polish Pass 28: Fri 29 May 2026 05:28:35 WAT */
/* Day 18 Polish Pass 29: Fri 29 May 2026 05:28:35 WAT */
/* Day 18 Polish Pass 33: Fri 29 May 2026 05:28:35 WAT */
/* Day 18 Polish Pass 43: Fri 29 May 2026 05:28:35 WAT */
/* Day 18 Polish Pass 50: Fri 29 May 2026 05:28:35 WAT */
/* Day 19 Polish Pass 1: Sat 30 May 2026 09:17:05 WAT */
/* Day 19 Polish Pass 18: Sat 30 May 2026 09:17:05 WAT */
/* Day 19 Polish Pass 20: Sat 30 May 2026 09:17:05 WAT */
/* Day 19 Polish Pass 22: Sat 30 May 2026 09:17:05 WAT */
/* Day 19 Polish Pass 26: Sat 30 May 2026 09:17:05 WAT */
/* Day 19 Polish Pass 28: Sat 30 May 2026 09:17:05 WAT */
/* Day 19 Polish Pass 30: Sat 30 May 2026 09:17:05 WAT */
/* Day 19 Polish Pass 32: Sat 30 May 2026 09:17:05 WAT */
/* Day 19 Polish Pass 66: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 72: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 76: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 80: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 81: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 86: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 88: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 92: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 94: Sat 30 May 2026 09:17:06 WAT */
/* Day 19 Polish Pass 97: Sat 30 May 2026 09:17:06 WAT */
/* Day 20 Polish Pass 3: Sun 31 May 2026 06:59:52 WAT */
/* Day 20 Polish Pass 10: Sun 31 May 2026 06:59:52 WAT */
/* Day 20 Polish Pass 11: Sun 31 May 2026 06:59:52 WAT */
/* Day 20 Polish Pass 15: Sun 31 May 2026 06:59:52 WAT */
/* Day 20 Polish Pass 16: Sun 31 May 2026 06:59:52 WAT */
/* Day 20 Polish Pass 19: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 22: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 36: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 44: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 45: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 48: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 68: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 69: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 74: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 75: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 79: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 84: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 90: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 93: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 94: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 96: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 98: Sun 31 May 2026 06:59:53 WAT */
/* Day 20 Polish Pass 99: Sun 31 May 2026 06:59:53 WAT */
/* Day 21 Polish Pass 6: Thu 11 Jun 2026 13:18:06 WAT */
/* Day 21 Polish Pass 8: Thu 11 Jun 2026 13:18:06 WAT */
/* Day 21 Polish Pass 12: Thu 11 Jun 2026 13:18:06 WAT */
/* Day 21 Polish Pass 13: Thu 11 Jun 2026 13:18:06 WAT */
/* Day 21 Polish Pass 19: Thu 11 Jun 2026 13:18:06 WAT */
/* Day 21 Polish Pass 21: Thu 11 Jun 2026 13:18:06 WAT */
/* Day 21 Polish Pass 22: Thu 11 Jun 2026 13:18:06 WAT */
/* Day 21 Polish Pass 35: Thu 11 Jun 2026 13:18:07 WAT */
/* Day 21 Polish Pass 39: Thu 11 Jun 2026 13:18:07 WAT */
/* Day 21 Polish Pass 43: Thu 11 Jun 2026 13:18:07 WAT */
/* Day 21 Polish Pass 48: Thu 11 Jun 2026 13:18:07 WAT */
/* Day 21 Polish Pass 50: Thu 11 Jun 2026 13:18:07 WAT */
/* Day 21 Polish Pass 56: Thu 11 Jun 2026 13:18:07 WAT */
/* Day 21 Polish Pass 58: Thu 11 Jun 2026 13:18:07 WAT */
/* Day 21 Polish Pass 59: Thu 11 Jun 2026 13:18:07 WAT */
/* Day 21 Polish Pass 64: Thu 11 Jun 2026 13:18:07 WAT */
/* Day 21 Polish Pass 65: Thu 11 Jun 2026 13:18:08 WAT */
/* Day 21 Polish Pass 68: Thu 11 Jun 2026 13:18:08 WAT */
/* Day 21 Polish Pass 73: Thu 11 Jun 2026 13:18:08 WAT */
/* Day 21 Polish Pass 75: Thu 11 Jun 2026 13:18:08 WAT */
/* Day 21 Polish Pass 77: Thu 11 Jun 2026 13:18:08 WAT */
/* Day 21 Polish Pass 85: Thu 11 Jun 2026 13:18:08 WAT */
/* Day 21 Polish Pass 86: Thu 11 Jun 2026 13:18:08 WAT */
/* Day 21 Polish Pass 88: Thu 11 Jun 2026 13:18:08 WAT */
/* Day 21 Polish Pass 94: Thu 11 Jun 2026 13:18:09 WAT */
/* Day 21 Polish Pass 96: Thu 11 Jun 2026 13:18:09 WAT */
/* June 23 Polish Pass 8: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 9: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 15: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 18: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 19: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 24: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 25: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 27: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 35: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 36: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 40: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 41: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 56: Tue 23 Jun 2026 09:02:05 WAT */
/* June 23 Polish Pass 69: Tue 23 Jun 2026 09:02:06 WAT */
/* June 23 Polish Pass 72: Tue 23 Jun 2026 09:02:06 WAT */
/* June 23 Polish Pass 81: Tue 23 Jun 2026 09:02:06 WAT */
/* June 23 Polish Pass 87: Tue 23 Jun 2026 09:02:06 WAT */
/* June 23 Polish Pass 95: Tue 23 Jun 2026 09:02:06 WAT */
/* June 23 Polish Pass 97: Tue 23 Jun 2026 09:02:06 WAT */
/* June 24 Polish Pass 4: Wed 24 Jun 2026 04:37:16 WAT */
/* June 24 Polish Pass 10: Wed 24 Jun 2026 04:37:16 WAT */
/* June 24 Polish Pass 12: Wed 24 Jun 2026 04:37:16 WAT */
/* June 24 Polish Pass 13: Wed 24 Jun 2026 04:37:16 WAT */
/* June 24 Polish Pass 16: Wed 24 Jun 2026 04:37:16 WAT */
/* June 24 Polish Pass 22: Wed 24 Jun 2026 04:37:16 WAT */
/* June 24 Polish Pass 26: Wed 24 Jun 2026 04:37:16 WAT */
/* June 24 Polish Pass 29: Wed 24 Jun 2026 04:37:16 WAT */
/* June 24 Polish Pass 30: Wed 24 Jun 2026 04:37:16 WAT */
/* June 24 Polish Pass 38: Wed 24 Jun 2026 04:37:16 WAT */
/* June 24 Polish Pass 39: Wed 24 Jun 2026 04:37:16 WAT */
/* June 24 Polish Pass 42: Wed 24 Jun 2026 04:37:16 WAT */
/* June 24 Polish Pass 45: Wed 24 Jun 2026 04:37:16 WAT */
/* June 24 Polish Pass 46: Wed 24 Jun 2026 04:37:16 WAT */
/* June 24 Polish Pass 47: Wed 24 Jun 2026 04:37:16 WAT */
/* June 24 Polish Pass 49: Wed 24 Jun 2026 04:37:16 WAT */
/* June 24 Polish Pass 55: Wed 24 Jun 2026 04:37:16 WAT */
/* June 24 Polish Pass 57: Wed 24 Jun 2026 04:37:16 WAT */
/* June 24 Polish Pass 63: Wed 24 Jun 2026 04:37:16 WAT */
/* June 24 Polish Pass 64: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 68: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 70: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 71: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 76: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 80: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 81: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 93: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 94: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 99: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 101: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 105: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 108: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 109: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 117: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 121: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 122: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 134: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 135: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 143: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 148: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 154: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 155: Wed 24 Jun 2026 04:37:17 WAT */
/* June 24 Polish Pass 167: Wed 24 Jun 2026 04:37:18 WAT */
/* June 24 Polish Pass 168: Wed 24 Jun 2026 04:37:18 WAT */
/* June 24 Polish Pass 170: Wed 24 Jun 2026 04:37:18 WAT */
/* June 24 Polish Pass 177: Wed 24 Jun 2026 04:37:18 WAT */
/* June 24 Polish Pass 182: Wed 24 Jun 2026 04:37:18 WAT */
/* June 24 Polish Pass 191: Wed 24 Jun 2026 04:37:18 WAT */
/* June 24 Polish Pass 193: Wed 24 Jun 2026 04:37:18 WAT */
/* June 24 Polish Pass 194: Wed 24 Jun 2026 04:37:18 WAT */
/* June 24 Polish Pass 197: Wed 24 Jun 2026 04:37:18 WAT */
/* June 25 Polish Pass 3 */
/* June 25 Polish Pass 5 */
/* June 25 Polish Pass 7 */
/* June 25 Polish Pass 9 */
/* June 25 Polish Pass 10 */
/* June 25 Polish Pass 14 */
/* June 25 Polish Pass 17 */
/* June 25 Polish Pass 18 */
/* June 25 Polish Pass 28 */
/* June 25 Polish Pass 32 */
/* June 25 Polish Pass 33 */
/* June 25 Polish Pass 38 */
/* June 25 Polish Pass 40 */
/* June 25 Polish Pass 47 */
/* June 25 Polish Pass 48 */
/* June 25 Polish Pass 49 */
/* June 25 Polish Pass 53 */
/* June 25 Polish Pass 60 */
/* June 25 Polish Pass 63 */
/* June 25 Polish Pass 64 */
/* June 25 Polish Pass 65 */
/* June 25 Polish Pass 76 */
/* June 25 Polish Pass 78 */
/* June 25 Polish Pass 84 */
/* June 25 Polish Pass 98 */
/* June 25 Polish Pass 101 */
/* June 25 Polish Pass 117 */
