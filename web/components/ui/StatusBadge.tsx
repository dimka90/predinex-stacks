import { cn } from '../../lib/utils'; // Assuming cn utility might be needed or just manual classes

interface StatusBadgeProps {
    status: string;
    className?: string;
}

/**
 * StatusBadge - Standardized badge for market status
 * @param status The market status text (e.g., 'active', 'settled')
 * @param className Additional CSS classes
 */
export default function StatusBadge({ status, className }: StatusBadgeProps) {
    const isActive = status.toLowerCase() === 'active';

    return (
        <span
            className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${isActive
                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                    : 'bg-muted text-muted-foreground border-border'
                } ${className || ''}`}
            aria-label={`Market status: ${status}`}
        >
            {status}
        </span>
    );
}
