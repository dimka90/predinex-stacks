/**
 * Skeleton - Primitive component for loading placeholders
 * @param className CSS classes for sizing and positioning
 */
export default function Skeleton({ className = '' }: { className?: string }) {
    return (
        <div
            className={`bg-black/20 backdrop-blur-md rounded-xl border border-white/5 relative overflow-hidden shadow-inner ${className}`}
            aria-hidden="true"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
        </div>
    );
}
