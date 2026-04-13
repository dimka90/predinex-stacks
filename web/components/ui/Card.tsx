import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    variant?: 'glass' | 'outline' | 'flat';
    hover?: boolean;
    style?: React.CSSProperties;
}

/**
 * Card - Reusable container component
 * @param children Card content
 * @param className Additional CSS classes
 * @param variant Card style variant (default: 'glass')
 * @param hover Whether to apply hover lift effect (default: true)
 * @param style Inline styles for dynamic animations
 */
export default function Card({
    children,
    className = '',
    variant = 'glass',
    hover = true,
    style
}: CardProps) {
    const baseClasses = 'rounded-[2rem] transition-all duration-500 overflow-hidden';

    const variantClasses = {
        glass: 'glass-card backdrop-blur-2xl bg-black/20 border border-white/5 relative z-10',
        outline: 'border border-white/10 bg-black/40 relative z-10 backdrop-blur-md shadow-inner',
        flat: 'bg-black/10 border border-transparent backdrop-blur-sm relative z-10',
    };

    const hoverClasses = hover ? 'hover:border-primary/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-1' : '';

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}
            style={style}
        >
            {children}
        </div>
    );
}
