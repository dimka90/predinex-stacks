import { ReactNode, useState } from 'react';

interface TooltipProps {
    content: string;
    children: ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Tooltip - Hover information component
 * @param content The text to display in the tooltip
 * @param children The element that triggers the tooltip
 * @param position Tooltip position relative to children
 */
export default function Tooltip({
    content,
    children,
    position = 'top'
}: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onFocus={() => setIsVisible(true)}
            onBlur={() => setIsVisible(false)}
            aria-describedby={isVisible ? "tooltip-content" : undefined}
        >
            {children}
            {isVisible && (
                <div
                    id="tooltip-content"
                    role="tooltip"
                    className={`absolute z-50 px-5 py-3 text-[10px] uppercase tracking-[0.2em] font-black text-white bg-black/80 backdrop-blur-[20px] rounded-2xl border border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.6)] whitespace-nowrap animate-in fade-in zoom-in-95 duration-200 ${positionClasses[position]}`}
                >
                    {content}
                    {/* Arrow */}
                    <div className={`absolute w-2 h-2 bg-black/90 rotate-45 border-white/10 ${position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1 border-r border-b' :
                        position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-l border-t' :
                            position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1 border-r border-t' :
                                'right-full top-1/2 -translate-y-1/2 -mr-1 border-l border-b'
                        }`} />
                </div>
            )}
        </div>
    );
}
