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
    const baseClasses = 'rounded-2xl transition-all duration-300 overflow-hidden';

    const variantClasses = {
        glass: 'glass border border-white/10 bg-white/5 backdrop-blur-md',
        outline: 'border border-border bg-background/50',
        flat: 'bg-muted/30 border border-transparent',
    };

    const hoverClasses = hover ? 'hover:border-primary/40 hover-lift' : '';

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}
            style={style}
        >
            {children}
        </div>
    );
}
