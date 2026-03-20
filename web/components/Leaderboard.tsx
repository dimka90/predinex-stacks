import { Trophy } from "lucide-react";
import { memo } from "react";
import LeaderboardRow from "./LeaderboardRow";
import { Contributor } from "../lib/types/user";

const DEFAULT_CONTRIBUTORS: Contributor[] = [
  { rank: 1, name: "Satoshi.stx", points: "15,420", avatarColor: "bg-yellow-500/20" },
  { rank: 2, name: "Marvin.stx", points: "12,100", avatarColor: "bg-gray-400/20" },
  { rank: 3, name: "StacksEnthusiast.stx", points: "9,850", avatarColor: "bg-orange-400/20" },
  { rank: 4, name: "Builder.btc", points: "7,200", avatarColor: "bg-primary/20" },
  { rank: 5, name: "Dimka.stx", points: "6,500", avatarColor: "bg-primary/20", isCurrentUser: true },
];

const Leaderboard = memo(function Leaderboard() {
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
        {DEFAULT_CONTRIBUTORS.map((c) => (
          <LeaderboardRow key={c.rank} contributor={c} />
        ))}
      </div>
    </div>
  );
});

export default Leaderboard;
