import { Trophy } from "lucide-react";
import { memo } from "react";

const Leaderboard = memo(function Leaderboard() {
  return (
    <div className="glass-panel rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="h-6 w-6 text-yellow-500" />
        <h2 className="text-2xl font-bold">Top Contributors</h2>
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-4">
              <span className="font-bold text-lg text-muted-foreground font-mono">#{i}</span>
              <div className="h-10 w-10 rounded-full bg-primary/20" />
              <span className="font-medium">User.stx</span>
            </div>
            <span className="font-bold text-primary">2,450 pts</span>
          </div>
        ))}
      </div>
    </div>
  );
});

export default Leaderboard;
