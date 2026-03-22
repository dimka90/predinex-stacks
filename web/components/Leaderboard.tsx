import { Trophy } from "lucide-react";
import { memo } from "react";
import LeaderboardRow from "./LeaderboardRow";
import { useLeaderboard } from "../lib/hooks/useLeaderboard";

const Leaderboard = memo(function Leaderboard() {
  const { contributors, isLoading } = useLeaderboard();

  return (
    <div className="glass-panel rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold tracking-tight">Top Contributors</h2>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-bold text-muted-foreground bg-muted/50 px-2 py-1 rounded-md cursor-help border border-border/50 hover:bg-muted transition-colors"
            title="Leaderboard ranks are updated every 60 minutes based on on-chain activity and GitHub contributions."
          >
            Updated Hourly
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          [1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 w-full bg-muted/10 rounded-lg animate-pulse" />
          ))
        ) : (
          contributors.map((c) => (
            <LeaderboardRow key={c.rank} contributor={c} />
          ))
        )}
      </div>
    </div>
  );
});

export default Leaderboard;
