import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Loader2 } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';

interface ToastProps {
    message: string;
    type?: ToastType;
    duration?: number;
    onClose: () => void;
}

export default function Toast({
    message,
    type = 'info',
    duration = 5000,
    onClose
}: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-primary" />,
        warning: <AlertTriangle className="w-5 h-5 text-orange-500" />,
        loading: <Loader2 className="w-5 h-5 text-primary animate-spin" />,
    };

    const bgClasses = {
        success: 'bg-green-500/10 border-green-500/20 text-green-500',
        error: 'bg-red-500/10 border-red-500/20 text-red-500',
        info: 'bg-primary/10 border-primary/20 text-primary font-bold',
        warning: 'bg-orange-500/10 border-orange-500/20 text-orange-500',
        loading: 'bg-muted/30 border-primary/20 text-foreground',
    };

    return (
        <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-500 ease-out transform ${isVisible ? 'translate-x-0 opacity-100 animate-in slide-in-from-right-10 duration-500' : 'translate-x-20 opacity-0'} ${bgClasses[type]} min-w-[320px] fixed bottom-8 right-8 z-[100]`}>
            <div className="shrink-0">{icons[type]}</div>
            <p className="text-sm font-bold tracking-tight flex-1">{message}</p>
            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                }}
                className="p-1.5 hover:bg-black/10 rounded-full transition-colors ml-4"
                aria-label="Close"
            >
                <X className="w-4 h-4 opacity-70" />
            </button>
        </div>
    );
}
