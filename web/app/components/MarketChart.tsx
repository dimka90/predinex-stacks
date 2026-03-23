'use client';

import React, { useMemo, useState } from 'react';

interface DataPoint {
    time: string;
    oddsA: number;
    oddsB: number;
}

interface MarketChartProps {
    data: DataPoint[];
    outcomeA: string;
    outcomeB: string;
    height?: number;
}

export default function MarketChart({ data, outcomeA, outcomeB, height = 300 }: MarketChartProps) {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    const points = useMemo(() => {
        if (!data.length) return { pathA: '', pathB: '', areaA: '', areaB: '' };

        const width = 1000; // Reference width for viewBox
        const xStep = width / (data.length - 1);

        const pathA = data.map((d, i) => `${i * xStep},${100 - d.oddsA}`).join(' L ');
        const pathB = data.map((d, i) => `${i * xStep},${100 - d.oddsB}`).join(' L ');

        const areaA = `${pathA} L ${width},100 L 0,100 Z`;
        const areaB = `${pathB} L ${width},100 L 0,100 Z`;

        return { pathA: `M ${pathA}`, pathB: `M ${pathB}`, areaA: `M ${areaA}`, areaB: `M ${areaB}` };
    }, [data]);

    const activePoint = hoverIndex !== null ? data[hoverIndex] : data[data.length - 1];

    return (
        <div className="relative group glass-panel p-6 rounded-[2rem] border border-white/5 bg-card/10 overflow-hidden">
            {/* Legend & Stats */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex gap-6">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{outcomeA}</span>
                        </div>
                        <span className="text-xl font-black">{activePoint.oddsA}%</span>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-accent" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{outcomeB}</span>
                        </div>
                        <span className="text-xl font-black">{activePoint.oddsB}%</span>
                    </div>
                </div>
                {hoverIndex !== null && (
                    <div className="text-right">
                        <span className="text-[10px] font-bold text-primary block uppercase tracking-tighter">TIMESTAMP</span>
                        <span className="text-xs font-black opacity-60 italic">{activePoint.time}</span>
                    </div>
                )}
            </div>

            {/* Chart Area */}
            <div className="relative" style={{ height: `${height}px` }}>
                <svg
                    viewBox="0 0 1000 100"
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                    onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const index = Math.round((x / rect.width) * (data.length - 1));
                        setHoverIndex(Math.max(0, Math.min(data.length - 1, index)));
                    }}
                    onMouseLeave={() => setHoverIndex(null)}
                >
                    {/* Grids */}
                    <line x1="0" y1="50" x2="1000" y2="50" stroke="white" strokeWidth="0.5" strokeOpacity="0.05" strokeDasharray="5,5" />

                    {/* Area A */}
                    <path d={points.areaA} fill="url(#gradA)" opacity="0.1" />
                    {/* Path A */}
                    <path d={points.pathA} stroke="hsl(var(--primary))" strokeWidth="2" fill="none" />

                    {/* Area B */}
                    <path d={points.areaB} fill="url(#gradB)" opacity="0.05" />
                    {/* Path B */}
                    <path d={points.pathB} stroke="hsl(var(--accent))" strokeWidth="1.5" strokeOpacity="0.5" fill="none" strokeDasharray="4,2" />

                    {/* Interaction Cursor */}
                    {hoverIndex !== null && (
                        <g transform={`translate(${(hoverIndex / (data.length - 1)) * 1000}, 0)`}>
                            <line y1="0" y2="100" stroke="white" strokeWidth="1" strokeOpacity="0.2" />
                            <circle cy={100 - activePoint.oddsA} r="4" fill="hsl(var(--primary))" stroke="white" strokeWidth="2" />
                        </g>
                    )}

                    <defs>
                        <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                        <linearGradient id="gradB" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--accent))" />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Background Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-white/[0.01] to-transparent opacity-50" />
        </div>
    );
}
