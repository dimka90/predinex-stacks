'use client';

import Navbar from "../../components/Navbar";
import AuthGuard from "../../components/AuthGuard";

export default function RewardsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <AuthGuard>
        <div className="container mx-auto px-4 py-12 max-w-5xl">
           <div className="glass-panel p-8 rounded-2xl mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Rewards</h1>
              <p className="text-muted-foreground">Track your performance and earnings</p>
           </div>
        </div>
      </AuthGuard>
    </main>
  );
}
