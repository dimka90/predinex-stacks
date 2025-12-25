'use client';

import Navbar from "../components/Navbar";
import AuthGuard from "../components/AuthGuard";
import DisputeCenter from "../components/DisputeCenter";
import { useStacks } from "../components/StacksProvider";
import { useWalletConnect } from "../lib/hooks/useWalletConnect";
import { useState } from "react";

export default function DisputesPage() {
  const { userData } = useStacks();
  const { session } = useWalletConnect();
  const [selectedPoolId, setSelectedPoolId] = useState<number>(0);

  const userAddress = session?.address || userData?.profile?.stxAddress;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <AuthGuard>
        <div className="pt-32 pb-20 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="glass p-8 rounded-2xl border border-border mb-8">
            <h1 className="text-4xl font-bold mb-2">Dispute Resolution</h1>
            <p className="text-muted-foreground">Challenge pool settlements through community voting</p>
          </div>

          {/* Pool Selector */}
          <div className="glass p-6 rounded-xl border border-border mb-8">
            <label className="block text-sm font-bold mb-2">Select Pool</label>
            <input
              type="number"
              value={selectedPoolId}
              onChange={(e) => setSelectedPoolId(parseInt(e.target.value))}
              className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Enter pool ID"
            />
          </div>

          <DisputeCenter poolId={selectedPoolId} userId={userAddress} />
        </div>
      </AuthGuard>
    </main>
  );
}
