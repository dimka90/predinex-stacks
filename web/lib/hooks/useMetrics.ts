import { useState, useEffect } from 'react';

export function useMetrics() {
    const [metrics, setMetrics] = useState({
        points: "12450",
        rank: "#42",
        activity: "89%",
        impact: "High",
        tier: "Institutional Tier",
        progress: 75,
        pointsToNext: "2,550",
        nextTier: "Whale Tier"
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    return { metrics, isLoading };
}
