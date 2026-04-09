import { Trophy, Medal } from 'lucide-react';

interface RankBadgeProps {
    rank: number;
}

export default function RankBadge({ rank }: RankBadgeProps) {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500 mx-auto animate-bounce-subtle drop-shadow-[0_0_10px_rgba(234,179,8,0.6)]" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-slate-300 mx-auto animate-in zoom-in duration-500 drop-shadow-[0_0_8px_rgba(203,213,225,0.4)]" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600 mx-auto animate-in zoom-in duration-500 drop-shadow-[0_0_8px_rgba(217,119,6,0.4)]" />;
    return <span className="font-black text-muted-foreground/60 font-mono text-sm animate-in fade-in duration-500">{rank}</span>;
}
