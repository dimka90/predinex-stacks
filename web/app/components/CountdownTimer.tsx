'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
    targetDate: Date | string | number;
    onExpire?: () => void;
    className?: string;
    showLabels?: boolean;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function calculateTimeLeft(targetDate: Date | string | number): TimeLeft | null {
    const target = new Date(targetDate).getTime();
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) return null;

    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    };
}

export default function CountdownTimer({ targetDate, onExpire, className = '', showLabels = true }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft(targetDate));

    useEffect(() => {
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft(targetDate);
            setTimeLeft(newTimeLeft);
            if (!newTimeLeft) {
                clearInterval(timer);
                onExpire?.();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate, onExpire]);

    if (!timeLeft) {
        return (
            <div className={`flex items-center gap-2 text-red-400 ${className}`}>
                <Clock size={14} />
                <span className="text-sm font-bold">Expired</span>
            </div>
        );
    }

    const segments = [
        { value: timeLeft.days, label: 'd' },
        { value: timeLeft.hours, label: 'h' },
        { value: timeLeft.minutes, label: 'm' },
        { value: timeLeft.seconds, label: 's' },
    ];

    return (
        <div className={`flex items-center gap-1.5 ${className}`}>
            <Clock size={14} className="text-accent" />
            {segments.map((seg) => (
                <div key={seg.label} className="flex items-baseline gap-0.5">
                    <span className="text-sm font-bold tabular-nums">{String(seg.value).padStart(2, '0')}</span>
                    {showLabels && <span className="text-[10px] text-muted-foreground font-black">{seg.label}</span>}
                </div>
            ))}
        </div>
    );
}
