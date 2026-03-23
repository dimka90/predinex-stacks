'use client';

import React, { useMemo } from 'react';

interface TrendChartProps {
    data: number[];
    color?: string;
    width?: number;
    height?: number;
    strokeWidth?: number;
    hover?: boolean;
}

/**
 * TrendChart - Minimal SVG sparkline for visual metrics
 */
export default function TrendChart({
    data,
    color = 'hsl(var(--primary))',
    width = 100,
    height = 40,
    strokeWidth = 2,
    hover = false
}: TrendChartProps) {
    const points = useMemo(() => {
        if (!data.length) return '';

        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;

        const xStep = width / (data.length - 1);

        return data.map((val, i) => {
            const x = i * xStep;
            const y = height - ((val - min) / range) * height;
            return `${x},${y}`;
        }).join(' ');
    }, [data, width, height]);

    if (!data.length) return null;

    return (
        <div className={`relative ${hover ? 'group-hover:scale-110 transition-transform duration-500' : ''}`}>
            <svg
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="overflow-visible"
            >
                {/* Glow effect */}
                <polyline
                    points={points}
                    stroke={color}
                    strokeWidth={strokeWidth + 2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ filter: 'blur(4px)', opacity: 0.3 }}
                />
                {/* Main line */}
                <polyline
                    points={points}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}
