import { fetchActivePools, Pool, getUserBet, UserBetData } from './stacks-api';

export interface DashboardBet {
  pool: Pool;
  amountA: number;
  amountB: number;
  totalBet: number;
}

export interface DashboardStats {
  totalBet: number;
  totalWinnings: number;
  activeBetsCount: number;
  settledBetsCount: number;
  winRate: number;
  totalPoolsParticipated: number;
}

export async function loadDashboardData(
  userAddress: string
): Promise<{
  activeBets: DashboardBet[];
  winnings: DashboardBet[];
  history: DashboardBet[];
  stats: DashboardStats;
}> {
  const allPools = await fetchActivePools();
  const active: DashboardBet[] = [];
  const won: DashboardBet[] = [];
  const all: DashboardBet[] = [];

  let totalBet = 0;
  let totalWon = 0;
  let activeCount = 0;
  let settledCount = 0;

  for (const pool of allPools) {
    const userBet = await getUserBet(pool.id, userAddress);

    if (userBet && userBet.totalBet > 0) {
      const bet: DashboardBet = {
        pool,
        amountA: userBet.amountA,
        amountB: userBet.amountB,
        totalBet: userBet.totalBet,
      };

      all.push(bet);
      totalBet += userBet.totalBet;

      if (pool.settled) {
        settledCount++;
        if (
          (pool.winningOutcome === 0 && userBet.amountA > 0) ||
          (pool.winningOutcome === 1 && userBet.amountB > 0)
        ) {
          won.push(bet);
          totalWon += userBet.totalBet;
        }
      } else {
        activeCount++;
        active.push(bet);
      }
    }
  }

  const stats: DashboardStats = {
    totalBet,
    totalWinnings: totalWon,
    activeBetsCount: activeCount,
    settledBetsCount: settledCount,
    winRate: settledCount > 0 ? (won.length / settledCount) * 100 : 0,
    totalPoolsParticipated: all.length,
  };

  return { activeBets: active, winnings: won, history: all, stats };
}

