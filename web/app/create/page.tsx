'use client';
import Navbar from "../../components/Navbar";
import AuthGuard from "../../components/AuthGuard";

export default function CreateMarket() {
    return (
        <main className="min-h-screen bg-black relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(79,70,229,0.1)_0%,rgba(0,0,0,1)_70%)] pointer-events-none" />
            <Navbar />
            <AuthGuard>
                <div className="container mx-auto px-4 py-20 max-w-3xl relative z-10">
                    <div className="mb-12">
                        <div className="flex items-center gap-3 bg-primary/10 w-fit px-4 py-2 rounded-xl border border-primary/20 shadow-inner mb-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Protocol Initialization</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-br from-white via-white/80 to-primary/50 bg-clip-text text-transparent uppercase tracking-tighter drop-shadow-sm mb-4">
                            Create Market
                        </h1>
                        <p className="text-muted-foreground/80 font-medium">Define parameters and provision liquidity for a new institutional prediction pool.</p>
                    </div>

                    <form className="space-y-6">
                        <div className="p-10 rounded-[2.5rem] bg-black/40 backdrop-blur-3xl border border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.5)] space-y-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] -mr-16 -mt-16 group-hover:bg-primary/30 transition-colors duration-1000" />

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 mb-3">Market Premise</label>
                                <input type="text" className="w-full px-6 py-4 rounded-2xl bg-black/50 border border-white/10 text-white font-medium focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all outline-none shadow-inner" placeholder="e.g. WILL STACKS SIP-025 PASS BY Q3?" />
                            </div>

                            <button className="w-full py-5 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(79,70,229,0.3)] hover:shadow-[0_15px_40px_rgba(79,70,229,0.5)] transition-all hover:scale-[1.02] active:scale-95 border border-primary/50">
                                Initialize Protocol Pool (50 STX)
                            </button>
                        </div>
                    </form>
                </div>
            </AuthGuard>
        </main>
    );
}
