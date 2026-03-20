export interface UserStats {
    totalPoints: string;
    rank: string;
    activity: string;
    impact: string;
    nextTier: string;
    progressToNextTier: number;
    pointsToNextTier: string;
}

export interface Contributor {
    rank: number;
    name: string;
    points: string;
    avatarColor: string;
    isCurrentUser?: boolean;
}
