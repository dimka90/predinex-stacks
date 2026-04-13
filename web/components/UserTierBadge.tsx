import { Star } from "lucide-react";

interface UserTierBadgeProps {
    tier: string;
    progress: number;
    pointsToNext: string;
    nextTier: string;
}

export default function UserTierBadge({ tier, progress, pointsToNext, nextTier }: UserTierBadgeProps) {
    return (
        <div className="p-6 md:p-8 rounded-[2rem] bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-black/40 border border-white/10 relative overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_-20%,rgba(99,102,241,0.15),transparent_70%)]" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[60px] rounded-full mix-blend-screen pointer-events-none group-hover:bg-primary/20 transition-colors duration-1000" />

            <div className="flex justify-between items-end mb-6 relative z-10">
                <div>
                    <p className="text-[10px] text-muted-foreground/70 font-black uppercase tracking-[0.2em] mb-1">Current Protocol Level</p>
                    <p className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-primary drop-shadow-sm">{tier}</p>
                </div>
                <p className="text-xs font-black tracking-widest uppercase text-primary/80 bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20">{progress}% Complete</p>
            </div>

            <div className="w-full bg-black/40 rounded-full h-4 p-1 overflow-hidden border border-white/5 shadow-inner relative z-10">
                <div
                    className="bg-gradient-to-r from-primary via-indigo-400 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(168,85,247,0.5)] relative overflow-hidden"
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
            </div>

            <div className="flex justify-between items-center mt-6 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 shadow-inner group-hover:shadow-[0_0_10px_rgba(234,179,8,0.3)] transition-shadow">
                        <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 group-hover:rotate-[72deg] transition-transform duration-700" />
                    </div>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">
                        Next: <span className="text-foreground">{nextTier}</span>
                    </p>
                </div>
                <div className="flex flex-col items-end">
                    <p className="text-[10px] text-primary/80 font-black uppercase tracking-[0.2em]">{pointsToNext} pts to go</p>
                    {progress > 95 && (
                        <span className="text-[9px] text-emerald-400 font-black animate-pulse uppercase tracking-widest mt-1">Level Up Ready!</span>
                    )}
                </div>
            </div>
        </div>
    );
}
