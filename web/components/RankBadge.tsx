import { Trophy, Medal } from 'lucide-react';

interface RankBadgeProps {
    rank: number;
}

export default function RankBadge({ rank }: RankBadgeProps) {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-400 mx-auto animate-bounce-subtle drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] filter brightness-110" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-slate-200 mx-auto animate-in zoom-in duration-500 drop-shadow-[0_0_12px_rgba(226,232,240,0.6)] filter brightness-110" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-500 mx-auto animate-in zoom-in duration-500 drop-shadow-[0_0_12px_rgba(245,158,11,0.6)] filter brightness-110" />;
    return <span className="font-black text-muted-foreground/60 font-mono text-sm animate-in fade-in duration-500 text-center block tracking-tight">#{rank}</span>;
}
