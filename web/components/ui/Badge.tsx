import { ReactNode } from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'outline';

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

/**
 * Badge - Generic tag component
 * @param children Badge content
 * @param variant Visual style variant
 * @param className Additional CSS classes
 */
export default function Badge({
    children,
    variant = 'default',
    className = ''
}: BadgeProps) {
    const variantClasses = {
        default: 'bg-muted text-muted-foreground border-border',
        primary: 'bg-primary/20 text-primary border-primary/20',
        success: 'bg-green-500/10 text-green-400 border-green-500/20',
        warning: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        error: 'bg-red-500/10 text-red-500 border-red-500/20',
        info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        outline: 'bg-transparent text-foreground border-border',
    };

    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${variantClasses[variant]} ${className}`}>
            {children}
        </span>
    );
}
