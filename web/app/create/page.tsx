'use client';
import Navbar from "../../components/Navbar";
import AuthGuard from "../../components/AuthGuard";

export default function CreateMarket() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <AuthGuard>
                <div className="container mx-auto px-4 py-12 max-w-2xl">
                    <h1 className="text-3xl font-bold mb-8">Create New Market</h1>
                    <form className="space-y-6">
                       <div className="p-6 rounded-xl border border-border space-y-4">
                           <div>
                                <label className="block text-sm font-medium mb-2">Question</label>
                                <input type="text" className="w-full px-4 py-2 rounded-lg bg-background border border-input" placeholder="e.g. Will Bitcoin be above $60k?" />
                            </div>
                            <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold">
                                Create Market (50 STX)
                            </button>
                       </div>
                    </form>
                </div>
            </AuthGuard>
        </main>
    );
}
