'use client';

import Navbar from "../components/Navbar";
import UserStats from "../components/UserStats";
import ActiveBets from "../components/ActiveBets";
import BetHistory from "../components/BetHistory";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStacks } from "../components/StacksProvider";
import { loadDashboardData } from "../lib/dashboard-api";
import Link from "next/link";
import { Trophy } from "lucide-react";

interface UserBet {
  pool: Pool;
  amountA: number;
  amountB: number;
  totalBet: number;
}

export default function Dashboard() {
  const router = useRouter();
  const { userData } = useStacks();
  const [pools, setPools] = useState<Pool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeBets, setActiveBets] = useState<UserBet[]>([]);
  const [winnings, setWinnings] = useState<UserBet[]>([]);
  const [history, setHistory] = useState<UserBet[]>([]);
  const [stats, setStats] = useState({
    totalBet: 0,
    totalWinnings: 0,
    activeBetsCount: 0,
    settledBetsCount: 0,
    winRate: 0,
    totalPoolsParticipated: 0,
  });

  useEffect(() => {
    if (!userData) {
      router.push("/");
      return;
    }

    loadDashboardDataHandler();
  }, [userData, router]);

  const loadDashboardDataHandler = async () => {
    try {
      const userAddress = userData.profile.stxAddress.mainnet;
      const { activeBets: active, winnings: won, history: all, stats: computedStats } =
        await loadDashboardData(userAddress);

      setActiveBets(active);
      setWinnings(won);
      setHistory(all);
      setStats(computedStats);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userData) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userData.profile.stxAddress.mainnet.slice(0, 8)}...
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-20">Loading your dashboard...</div>
        ) : (
          <>
            {/* Stats Grid */}
            <UserStats
              totalBet={stats.totalBet}
              totalWinnings={stats.totalWinnings}
              activeBetsCount={stats.activeBetsCount}
              settledBetsCount={stats.settledBetsCount}
              winRate={stats.winRate}
              totalPoolsParticipated={stats.totalPoolsParticipated}
            />

            {/* Active Bets Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Active Bets</h2>
              <ActiveBets bets={activeBets} />
            </div>

            {/* Winnings Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Winnings</h2>
              {winnings.length === 0 ? (
                <div className="glass p-8 rounded-xl border border-border text-center">
                  <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No winnings yet. Keep betting!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {winnings.map((bet) => (
                    <Link key={bet.pool.id} href={`/markets/${bet.pool.id}`}>
                      <div className="glass p-6 rounded-xl hover:border-green-500/50 transition-colors cursor-pointer group h-full border-green-500/20">
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-xs font-mono text-muted-foreground">#POOL-{bet.pool.id}</span>
                          <span className="px-2 py-1 rounded bg-green-500/10 text-green-500 text-xs font-medium">
                            Won
                          </span>
                        </div>

                        <h3 className="text-lg font-bold mb-2 group-hover:text-green-400 transition-colors line-clamp-2">
                          {bet.pool.title}
                        </h3>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Winnings:</span>
                            <span className="font-semibold text-green-400">
                              {(bet.totalBet / 1_000_000).toFixed(2)} STX
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <span className="font-semibold">Unclaimed</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Betting History Section */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Betting History</h2>
              <BetHistory bets={history} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
