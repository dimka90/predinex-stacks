import { Trophy, Medal } from 'lucide-react';

interface RankBadgeProps {
    rank: number;
}

export default function RankBadge({ rank }: RankBadgeProps) {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500 mx-auto animate-bounce-subtle drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400 mx-auto animate-in zoom-in duration-500" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-orange-400 mx-auto animate-in zoom-in duration-500" />;
    return <span className="font-black text-muted-foreground/60 font-mono text-sm animate-in fade-in duration-500">{rank}</span>;
}
