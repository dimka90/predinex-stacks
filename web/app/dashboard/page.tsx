'use client';
import Navbar from "../../components/Navbar";
import AuthGuard from "../../components/AuthGuard";
import PortfolioOverview from "../../components/PortfolioOverview";
import PlatformStats from "../../components/PlatformStats";

export default function Dashboard() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <AuthGuard>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h1 className="text-4xl font-black mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Institutional Dashboard
                    </h1>

                    <PlatformStats />
                    <PortfolioOverview />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="p-8 rounded-3xl border border-border bg-card/40 glass shadow-xl">
                            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                                <div className="w-2 h-6 bg-primary rounded-full" />
                                Active Bets
                            </h2>
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <span className="text-muted-foreground font-medium">No active positions found in your portfolio.</span>
                                <button className="mt-4 text-primary font-bold hover:underline">Explore Markets</button>
                            </div>
                        </div>
                        <div className="p-8 rounded-3xl border border-border bg-card/40 glass shadow-xl">
                            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                                <div className="w-2 h-6 bg-accent rounded-full" />
                                Recent Activity
                            </h2>
                            <p className="text-muted-foreground font-medium py-12 text-center">Your recent transaction history is empty.</p>
                        </div>
                    </div>
                </div>
            </AuthGuard>
        </main>
    );
}
