import { Star } from "lucide-react";

interface UserTierBadgeProps {
    tier: string;
    progress: number;
    pointsToNext: string;
    nextTier: string;
}

export default function UserTierBadge({ tier, progress, pointsToNext, nextTier }: UserTierBadgeProps) {
    return (
        <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/5 border border-primary/20 relative">
            <div className="flex justify-between items-end mb-3">
                <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">Current Level</p>
                    <p className="text-lg text-primary font-black">{tier}</p>
                </div>
                <p className="text-xs font-bold text-primary">{progress}% Complete</p>
            </div>

            <div className="w-full bg-muted/50 rounded-full h-3 p-0.5 overflow-hidden">
                <div
                    className="bg-gradient-to-r from-primary via-indigo-400 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="flex justify-between items-center mt-3">
                <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    Next: {nextTier}
                </p>
                <p className="text-[10px] text-muted-foreground font-bold italic">{pointsToNext} pts to go</p>
            </div>
        </div>
    );
}
