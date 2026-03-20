import { Trophy, Medal, Star } from "lucide-react";
import { memo } from "react";

interface Contributor {
  rank: number;
  name: string;
  points: string;
  avatarColor: string;
}

const DEFAULT_CONTRIBUTORS: Contributor[] = [
  { rank: 1, name: "Satoshi.stx", points: "15,420", avatarColor: "bg-yellow-500/20" },
  { rank: 2, name: "Marvin.stx", points: "12,100", avatarColor: "bg-gray-400/20" },
  { rank: 3, name: "StacksEnthusiast.stx", points: "9,850", avatarColor: "bg-orange-400/20" },
  { rank: 4, name: "Builder.btc", points: "7,200", avatarColor: "bg-primary/20" },
  { rank: 5, name: "Dimka.stx", points: "6,500", avatarColor: "bg-primary/20" },
];

const Leaderboard = memo(function Leaderboard() {
  return (
    <div className="glass-panel rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold">Top Contributors</h2>
        </div>
        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">Updated Hourly</span>
      </div>
      <div className="space-y-3">
        {DEFAULT_CONTRIBUTORS.map((c) => {
          const isCurrentUser = c.name === "Dimka.stx";
          return (
            <div
              key={c.rank}
              className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 border group ${isCurrentUser
                  ? "bg-primary/10 border-primary/30 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)] scale-[1.02]"
                  : "bg-muted/20 border-transparent hover:bg-muted/40 hover:border-primary/20 hover:scale-[1.01]"
                }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 text-center">
                  {c.rank === 1 && <Trophy className="h-5 w-5 text-yellow-500 mx-auto animate-bounce-subtle" />}
                  {c.rank === 2 && <Medal className="h-5 w-5 text-gray-400 mx-auto" />}
                  {c.rank === 3 && <Medal className="h-5 w-5 text-orange-400 mx-auto" />}
                  {c.rank > 3 && <span className="font-bold text-muted-foreground font-mono">{c.rank}</span>}
                </div>
                <div className={`h-10 w-10 rounded-full ${c.avatarColor} flex items-center justify-center text-primary font-bold overflow-hidden relative`}>
                  {c.name[0].toUpperCase()}
                  {isCurrentUser && <div className="absolute inset-0 bg-primary/20 animate-pulse" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`font-medium block transition-colors ${isCurrentUser ? "text-primary font-bold" : "group-hover:text-primary"}`}>
                      {c.name}
                    </span>
                    {isCurrentUser && (
                      <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">You</span>
                    )}
                  </div>
                  {c.rank <= 3 && <span className="text-[10px] text-primary font-bold uppercase tracking-tighter">Elite Contributor</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className={`h-3 w-3 ${isCurrentUser ? "text-primary fill-primary animate-spin-slow" : "text-primary fill-primary"}`} />
                <span className={`font-bold ${isCurrentUser ? "text-primary text-lg" : "text-primary"}`}>{c.points} pts</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default Leaderboard;
