/**
 * Skeleton - Primitive component for loading placeholders
 * @param className CSS classes for sizing and positioning
 */
export default function Skeleton({ className = '' }: { className?: string }) {
    return (
        <div
            className={`animate-pulse bg-muted/40 rounded-md ${className}`}
            aria-hidden="true"
        />
    );
}
