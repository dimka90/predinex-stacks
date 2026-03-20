import { useState, useEffect } from 'react';
import { Contributor } from '../types/user';

const MOCK_CONTRIBUTORS: Contributor[] = [
    { rank: 1, name: "Satoshi.stx", points: "15420", avatarColor: "bg-yellow-500/20" },
    { rank: 2, name: "Marvin.stx", points: "12100", avatarColor: "bg-gray-400/20" },
    { rank: 3, name: "StacksEnthusiast.stx", points: "9850", avatarColor: "bg-orange-400/20" },
    { rank: 4, name: "Builder.btc", points: "7200", avatarColor: "bg-primary/20" },
    { rank: 5, name: "Dimka.stx", points: "6500", avatarColor: "bg-primary/20", isCurrentUser: true },
];

export function useLeaderboard() {
    const [contributors, setContributors] = useState<Contributor[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setContributors(MOCK_CONTRIBUTORS);
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return { contributors, isLoading };
}
