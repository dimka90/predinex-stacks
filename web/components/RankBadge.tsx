import { Trophy, Medal } from 'lucide-react';

interface RankBadgeProps {
    rank: number;
}

export default function RankBadge({ rank }: RankBadgeProps) {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500 mx-auto animate-bounce-subtle" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400 mx-auto" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-orange-400 mx-auto" />;
    return <span className="font-bold text-muted-foreground font-mono">{rank}</span>;
}
