import { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils'; // Assuming cn utility exists or I'll use simple interpolation

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

export default function Button({
    children,
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    disabled,
    ...props
}: ButtonProps) {
    const variants = {
        primary: 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/40',
        secondary: 'bg-muted text-foreground hover:bg-muted/80 border border-border',
        outline: 'bg-transparent border border-primary/50 text-primary hover:bg-primary/5',
        ghost: 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50',
        danger: 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20',
    };

    const sizes = {
        sm: 'px-4 py-2 text-xs',
        md: 'px-6 py-3 text-sm',
        lg: 'px-10 py-5 text-base',
    };

    return (
        <button
            className={cn(
                'inline-flex items-center justify-center gap-2 font-black rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {!isLoading && leftIcon}
            {children}
            {!isLoading && rightIcon}
        </button>
    );
}
