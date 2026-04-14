import { ReactNode } from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'outline';

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

/**
 * Badge - Generic tag array component establishing micro-level data classification.
 * Optimized with dedicated `duration-300` layout interpolations ensuring jank-free color mapping.
 * 
 * @param {ReactNode} children - Core scalar metrics or categorical strings
 * @param {BadgeVariant} variant - Design system constant dictating semantic color constraints
 * @param {string} className - Optional tailwind overrides applied to final resolution
 */
export default function Badge({
    children,
    variant = 'default',
    className = ''
}: BadgeProps) {
    const variantClasses = {
        default: 'bg-black/40 text-muted-foreground/80 border-white/10 shadow-inner backdrop-blur-sm',
        primary: 'bg-primary/20 text-primary border-primary/30 shadow-[0_0_15px_rgba(79,70,229,0.15)] group-hover:border-primary/50',
        success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(52,211,153,0.15)]',
        warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
        error: 'bg-red-500/10 text-red-500 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]',
        info: 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]',
        outline: 'bg-transparent text-foreground/80 border-white/20 hover:border-white/40',
    };

    return (
        <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border transition-colors duration-300 ease-out ${variantClasses[variant]} ${className}`}>
            {children}
        </span>
    );
}
