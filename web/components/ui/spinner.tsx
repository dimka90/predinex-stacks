export function Spinner({ className }: { className?: string }) {
    return (
        <div className={`animate-spin rounded-full h-5 w-5 border border-primary/20 border-r-primary shadow-[0_0_10px_rgba(79,70,229,0.5)] ${className}`} />
    );
}
