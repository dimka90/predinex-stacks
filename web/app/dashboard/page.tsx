'use client';
import Navbar from "../../components/Navbar";
import AuthGuard from "../../components/AuthGuard";

export default function Dashboard() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <AuthGuard>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                    <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="p-6 rounded-xl border border-border bg-card">
                            <h2 className="text-xl font-bold mb-4">Active Bets</h2>
                            <p className="text-muted-foreground">No active bets.</p>
                        </div>
                        <div className="p-6 rounded-xl border border-border bg-card">
                            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                            <p className="text-muted-foreground">No recent activity.</p>
                        </div>
                    </div>
                </div>
            </AuthGuard>
        </main>
    );
}
