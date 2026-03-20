import { Star } from "lucide-react";
import RankBadge from "./RankBadge";
import { Contributor } from "../lib/types/user";
import { formatPoints } from "../lib/utils/formatters";

interface LeaderboardRowProps {
    contributor: Contributor;
}

export default function LeaderboardRow({ contributor: c }: LeaderboardRowProps) {
    const isCurrentUser = c.isCurrentUser;
    return (
        <div
            className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 border group ${isCurrentUser
                ? "bg-primary/10 border-primary/30 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)] scale-[1.02]"
                : "bg-muted/20 border-transparent hover:bg-muted/40 hover:border-primary/20 hover:scale-[1.01]"
                }`}
        >
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
                <span className={`font-bold ${isCurrentUser ? "text-primary text-lg" : "text-primary"}`}>{formatPoints(c.points)} pts</span>
            </div>
        </div>
    );
}
