'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
    value: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    className?: string;
}

/**
 * AnimatedCounter - Smoothly animates from 0 to a target number.
 * Useful for statistics displays and dashboard metrics.
 */
export default function AnimatedCounter({
    value,
    duration = 1500,
    prefix = '',
    suffix = '',
    decimals = 0,
    className = '',
}: AnimatedCounterProps) {
    const [displayValue, setDisplayValue] = useState(0);
    const startTime = useRef<number | null>(null);
    const animationFrame = useRef<number | null>(null);

    useEffect(() => {
        startTime.current = null;

        const animate = (timestamp: number) => {
            if (!startTime.current) startTime.current = timestamp;
            const elapsed = timestamp - startTime.current;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(eased * value);

            if (progress < 1) {
                animationFrame.current = requestAnimationFrame(animate);
            }
        };

        animationFrame.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrame.current) {
                cancelAnimationFrame(animationFrame.current);
            }
        };
    }, [value, duration]);

    return (
        <span className={`tabular-nums ${className}`}>
            {prefix}{displayValue.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{suffix}
        </span>
    );
}
