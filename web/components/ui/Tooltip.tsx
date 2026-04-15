import { ReactNode, useState } from 'react';

interface TooltipProps {
    content: string;
    children: ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Tooltip - Hover-dependent absolute portal component contextualizing data nodes.
 * Explicitly binds `aria-describedby` links and forces 200ms `zoom-in-95` GPU transforms.
 * 
 * @param {string} content - Explanatory text injected into the portal container
 * @param {ReactNode} children - Hover target boundary that controls element visibility tracking
 * @param {'top'|'bottom'|'left'|'right'} position - Relative coordinate anchor
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
            tabIndex={0}
            aria-describedby={isVisible ? "tooltip-content" : undefined}
            role="doc-tip"
        >
            {children}
            {isVisible && (
                <div
                    id="tooltip-content"
                    role="tooltip"
                    className={`absolute z-50 px-5 py-3 text-[10px] uppercase tracking-[0.3em] font-black text-white bg-black/90 backdrop-blur-[30px] rounded-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] whitespace-nowrap animate-in fade-in zoom-in-95 duration-200 ${positionClasses[position]}`}
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
