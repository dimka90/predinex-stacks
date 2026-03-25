'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * useCountdown - Hook for countdown timers with auto-tick.
 * @param targetDate The target date to count down to
 * @returns Object with days, hours, minutes, seconds, and isExpired
 */
export function useCountdown(targetDate: Date | string | number) {
    const [timeLeft, setTimeLeft] = useState(() => calculateDiff(targetDate));

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateDiff(targetDate));
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    return timeLeft;
}

function calculateDiff(targetDate: Date | string | number) {
    const target = new Date(targetDate).getTime();
    const now = Date.now();
    const diff = Math.max(0, target - now);

    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        totalMs: diff,
        isExpired: diff === 0,
    };
}
