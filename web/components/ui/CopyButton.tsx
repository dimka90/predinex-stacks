import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { ICON_CLASS } from '../../app/lib/constants';

interface CopyButtonProps {
    value: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

/**
 * CopyButton - Specialized button for copying text to clipboard
 * @param value The text to copy
 * @param className Additional CSS classes
 * @param size Size of the icon
 */
export default function CopyButton({
    value,
    className = '',
    size = 'sm'
}: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const Icon = copied ? Check : Copy;
    const iconClass = size === 'sm' ? ICON_CLASS.sm : size === 'md' ? ICON_CLASS.md : ICON_CLASS.lg;

    return (
        <button
            onClick={handleCopy}
            className={`p-2 hover:bg-white/10 rounded-xl transition-all duration-300 active:scale-75 relative group ${className} ${copied ? 'text-primary' : 'text-muted-foreground/70 hover:text-white'}`}
            title={copied ? "Copied!" : "Copy to clipboard"}
            aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
        >
            <Icon className={`${iconClass} ${copied ? 'drop-shadow-[0_0_8px_rgba(79,70,229,0.8)] animate-in zoom-in-50 duration-200' : 'group-hover:scale-110 transition-transform'}`} />
        </button>
    );
}
