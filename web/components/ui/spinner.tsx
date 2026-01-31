export function Spinner({ className }: { className?: string }) {
    return (
        <div className={`animate-spin rounded-full h-4 w-4 border-b-2 border-primary ${className}`} />
    );
}
