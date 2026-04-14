interface StatusBadgeProps {
    status: string;
    className?: string;
    size?: 'sm' | 'md';
}

const statusStyles: Record<string, string> = {
    active: 'bg-green-500/10 text-green-400 border-green-500/20',
    settled: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    expired: 'bg-red-500/10 text-red-400 border-red-500/20',
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    disputed: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    paused: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    canceled: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

const sizeStyles = {
    sm: 'px-2 py-0.5 text-[9px]',
    md: 'px-3 py-1 text-[10px]',
};

/**
 * StatusBadge - Standardized badge for market status.
 * Supports: active, settled, expired, pending, disputed, paused.
 */
export default function StatusBadge({ status, className = '', size = 'md' }: StatusBadgeProps) {
    const normalizedStatus = status.toLowerCase();
    const style = statusStyles[normalizedStatus] || statusStyles.active;

    return (
        <span
            className={`inline-flex items-center gap-2 rounded-xl font-black tracking-[0.2em] uppercase border ${sizeStyles[size]} ${style} ${className} shadow-inner bg-opacity-40 backdrop-blur-sm`}
            aria-label={`Market status: ${status}`}
        >
            <span className={`w-2 h-2 rounded-full shadow-inner border border-white/20 ${normalizedStatus === 'active' ? 'bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]' :
                normalizedStatus === 'pending' ? 'bg-yellow-400 animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.8)]' :
                    normalizedStatus === 'disputed' ? 'bg-orange-400 animate-pulse shadow-[0_0_8px_rgba(251,146,60,0.8)]' :
                        'bg-current opacity-50'
                }`} />
            {status}
        </span>
    );
}
