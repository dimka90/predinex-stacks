import { ArrowRight, Trophy, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";

/**
 * Hero - Institutional-grade landing section with premium typography.
 */
export default function Hero() {
    return (
        <div className="relative pt-32 pb-24 sm:pt-48 sm:pb-40 overflow-hidden">
            {/* Soft background glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-40 pointer-events-none">
                <div className="absolute top-[-10%] left-[5%] w-[600px] h-[600px] bg-primary/30 rounded-full blur-[160px] animate-float anim-delay-500" />
                <div className="absolute bottom-[10%] right-[5%] w-[700px] h-[700px] bg-accent/20 rounded-full blur-[180px] animate-float-delayed" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-black tracking-[0.2em] text-primary mb-12 uppercase animate-pulse-subtle">
                    <Sparkles size={14} className="animate-spin-slow" />
                    Protocol Live on Stacks Mainnet
                </div>

                <h1 className="text-[12vw] sm:text-7xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.85] uppercase">
                    Predict <span className="gradient-text">Reality</span>.
                    <br />
                    Secure <span className="text-foreground">Yield</span>.
                </h1>

                <p className="max-w-3xl mx-auto text-xl md:text-2xl text-muted-foreground mb-16 leading-relaxed font-medium">
                    The institutional-grade prediction architecture for the Stacks ecosystem.
                    Scalable, trustless settlement, and 1:1 Bitcoin security.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                    <Link
                        href="/markets"
                        className="btn-primary flex items-center gap-4 group px-12 py-6 text-base font-black tracking-widest"
                    >
                        EXPLORE TERMINAL
                        <TrendingUp className="w-5 h-5 group-hover:translate-y-[-2px] group-hover:translate-x-[2px] transition-transform" />
                    </Link>
                    <Link
                        href="/create"
                        className="glass-panel px-12 py-6 flex items-center gap-4 text-base font-black tracking-widest hover:bg-white/10 active:scale-95 transition-all border-white/10"
                    >
                        <Trophy className="w-5 h-5 text-accent" />
                        INITIATE POOL
                    </Link>
                </div>

                {/* Protocol metrics summary */}
                <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    {[
                        { label: 'Total Volume', value: '1.2M STX', icon: TrendingUp },
                        { label: 'Active Markets', value: '840+', icon: TrendingUp },
                        { label: 'Total Payouts', value: '850K STX', icon: Trophy },
                        { label: 'Reputation', value: '99.9%', icon: Sparkles },
                    ].map((stat, i) => (
                        <div key={i} className="p-6 rounded-2xl glass-card border-white/5 text-left">
                            <stat.icon size={16} className="text-primary mb-3" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                            <p className="text-xl font-black tabular-nums">{stat.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
