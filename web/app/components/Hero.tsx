import { ArrowRight, Trophy } from "lucide-react";
import Link from "next/link";

export default function Hero() {
    return (
        <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
            {/* Background gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-20 pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-primary rounded-full blur-[100px]" />
                <div className="absolute top-40 right-20 w-96 h-96 bg-accent rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/50 text-sm text-muted-foreground mb-8">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Live on Stacks Testnet
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                    Predict the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent glow-text">Future</span>.
                    <br />
                    Win on <span className="text-white">Stacks</span>.
                </h1>

                <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10">
                    The decentralized prediction market built for the Bitcoin economy.
                    Create pools, place bets, and settle trustlessly with Clarity smart contracts.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/markets" className="w-full sm:w-auto px-8 py-3 bg-primary hover:bg-violet-600 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2">
                        Explore Markets
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link href="/create" className="w-full sm:w-auto px-8 py-3 bg-muted hover:bg-zinc-800 border border-border text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2">
                        <Trophy className="w-4 h-4 text-accent" />
                        Create Pool
                    </Link>
                </div>
            </div>
        </div>
    );
}
