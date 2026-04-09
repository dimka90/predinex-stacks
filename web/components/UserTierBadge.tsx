import { Star } from "lucide-react";

interface UserTierBadgeProps {
    tier: string;
    progress: number;
    pointsToNext: string;
    nextTier: string;
}

export default function UserTierBadge({ tier, progress, pointsToNext, nextTier }: UserTierBadgeProps) {
    return (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 via-indigo-500/10 to-purple-500/5 border border-primary/30 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_-20%,rgba(79,70,229,0.1),transparent_70%)]" />
            <div className="flex justify-between items-end mb-3">
                <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">Current Level</p>
                    <p className="text-lg text-primary font-black">{tier}</p>
                </div>
                <p className="text-xs font-bold text-primary">{progress}% Complete</p>
            </div>

            <div className="w-full bg-muted/50 rounded-full h-3 p-1.5 overflow-hidden border border-white/5 shadow-inner">
                <div
                    className="bg-gradient-to-r from-primary via-indigo-400 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(79,70,229,0.5)] relative overflow-hidden"
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
            </div>

            <div className="flex justify-between items-center mt-4">
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest flex items-center gap-2">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 group-hover:rotate-180 transition-transform duration-700" />
                    Next: {nextTier}
                </p>
                <div className="flex flex-col items-end">
                    <p className="text-[10px] text-primary font-black uppercase tracking-widest">{pointsToNext} pts to go</p>
                    {progress > 95 && (
                        <span className="text-[8px] text-accent font-black animate-pulse uppercase">Level Up Ready!</span>
                    )}
                </div>
            </div>
        </div>
    );
}
