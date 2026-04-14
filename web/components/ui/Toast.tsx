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
        success: 'bg-green-500/10 border-green-500/30 text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.15)]',
        error: 'bg-red-500/10 border-red-500/30 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.15)]',
        info: 'bg-primary/20 border-primary/30 text-primary font-black tracking-widest uppercase shadow-[0_0_20px_rgba(79,70,229,0.2)]',
        warning: 'bg-orange-500/10 border-orange-500/30 text-amber-500 shadow-[0_0_20px_rgba(249,115,22,0.15)]',
        loading: 'bg-black/60 border-primary/40 text-white shadow-[0_0_20px_rgba(0,0,0,0.5)]',
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
