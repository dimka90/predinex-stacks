import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    variant?: 'glass' | 'outline' | 'flat';
    hover?: boolean;
}

/**
 * Card - Reusable container component
 * @param children Card content
 * @param className Additional CSS classes
 * @param variant Card style variant (default: 'glass')
 * @param hover Whether to apply hover lift effect (default: true)
 */
export default function Card({
    children,
    className = '',
    variant = 'glass',
    hover = true
}: CardProps) {
    const baseClasses = 'rounded-2xl transition-all duration-300 overflow-hidden';

    const variantClasses = {
        glass: 'glass border border-border',
        outline: 'border border-border bg-background/50',
        flat: 'bg-muted/30 border border-transparent',
    };

    const hoverClasses = hover ? 'hover:border-primary/40 hover-lift' : '';

    return (
        <div className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}>
            {children}
        </div>
    );
}
