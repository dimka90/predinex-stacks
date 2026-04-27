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
