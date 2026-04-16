import { Trophy } from "lucide-react";
import { memo } from "react";
import LeaderboardRow from "./LeaderboardRow";
import { useLeaderboard } from "../lib/hooks/useLeaderboard";

const Leaderboard = memo(function Leaderboard() {
  const { contributors, isLoading } = useLeaderboard();

  return (
    <div className="glass-card rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
      <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/5 blur-[50px] rounded-full -mr-24 -mt-24 group-hover:bg-yellow-500/10 transition-colors duration-700" />
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 relative z-10 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 group-hover:scale-110 transition-transform duration-500">
            <Trophy className="h-6 w-6 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tighter uppercase mb-1">Top Contributors</h2>
            <p className="text-[10px] text-muted-foreground/70 uppercase tracking-[0.2em] font-bold">Protocol Elite Ranks</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-black/40 px-3 py-1.5 rounded-lg cursor-help border border-white/5 hover:border-white/20 hover:text-white transition-all shadow-inner"
            title="Leaderboard ranks are updated every 60 minutes based on on-chain activity and GitHub contributions."
          >
            Updated Hourly
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          [1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-[2rem] border border-white/5 bg-black/20 backdrop-blur-md relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 shadow-inner" />
                <div className="h-4 w-32 bg-white/10 rounded-md" />
              </div>
              <div className="h-10 w-24 bg-white/5 rounded-xl mt-4 sm:mt-0 relative z-10 shadow-inner" />
            </div>
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
