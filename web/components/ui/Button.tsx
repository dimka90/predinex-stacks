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
        primary: 'bg-primary text-white hover:bg-primary/90 shadow-[0_10px_30px_rgba(79,70,229,0.3)] hover:shadow-[0_15px_40px_rgba(79,70,229,0.5)] border border-white/20 relative overflow-hidden group',
        secondary: 'bg-black/40 backdrop-blur-md text-foreground hover:bg-white/10 hover:border-white/20 border border-white/5 shadow-inner',
        outline: 'bg-transparent border border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/60 hover:shadow-[0_0_20px_rgba(79,70,229,0.2)]',
        ghost: 'bg-transparent text-muted-foreground hover:text-white hover:bg-white/5 active:scale-95',
        danger: 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]',
    };

    const sizes = {
        sm: 'px-5 py-2.5 text-[10px] tracking-[0.2em]',
        md: 'px-8 py-3.5 text-xs tracking-[0.2em]',
        lg: 'px-12 py-5 text-sm tracking-[0.2em]',
    };

    return (
        <button
            className={cn(
                'inline-flex items-center justify-center gap-3 font-black uppercase rounded-[1.25rem] transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
                <>
                    {leftIcon}
                    {children}
                    {rightIcon}
                </>
            )}
        </button>
    );
}
