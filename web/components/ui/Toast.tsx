import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

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
    };

    const bgClasses = {
        success: 'bg-green-500/10 border-green-500/20 text-green-500',
        error: 'bg-red-500/10 border-red-500/20 text-red-500',
        info: 'bg-primary/10 border-primary/20 text-primary font-bold',
    };

    return (
        <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'} ${bgClasses[type]} min-w-[300px]`}>
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
