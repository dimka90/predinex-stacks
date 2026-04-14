import { Star } from "lucide-react";
import RankBadge from "./RankBadge";
import { Contributor } from "../lib/types/user";
import { formatPoints } from "../lib/utils/formatters";

interface LeaderboardRowProps {
    contributor: Contributor;
}

/**
 * LeaderboardRow - Visual list element documenting protocol contributor metrics.
 * Configured with dynamic background tracking (`shimmer`) for authenticated nodes.
 *
 * @param {Contributor} contributor - Profile data vector including ranking arrays and point hashes
 */
export default function LeaderboardRow({ contributor: c }: LeaderboardRowProps) {
    const isCurrentUser = c.isCurrentUser;
    return (
        <div
            className={`flex items-center justify-between p-6 md:p-5 rounded-[2rem] transition-all duration-500 border group active:scale-95 relative overflow-hidden ${isCurrentUser
                ? "bg-gradient-to-r from-primary/20 via-indigo-500/10 to-transparent border-primary/50 shadow-[0_10px_30px_rgba(79,70,229,0.25)] scale-[1.02] z-10"
                : "bg-black/20 border-white/5 hover:bg-white/5 hover:border-primary/30 hover:scale-[1.02] hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)] shadow-inner"
                }`}
        >
            {isCurrentUser && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_3s_infinite]" />}

            <div className="flex items-center gap-4">
                <div className="w-8 text-center">
                    <RankBadge rank={c.rank} />
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
                <span className={`font-black tracking-tight ${isCurrentUser ? "text-primary text-xl" : "text-primary text-lg"}`}>{formatPoints(c.points)} pts</span>
            </div>
        </div>
    );
}
