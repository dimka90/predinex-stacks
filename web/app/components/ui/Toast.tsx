'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, LucideIcon } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextValue {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
    const icons: Record<ToastType, LucideIcon> = {
        success: CheckCircle,
        error: AlertCircle,
        info: Info,
    };

    const colors: Record<ToastType, string> = {
        success: 'bg-green-500/10 text-green-500 border-green-500/20',
        error: 'bg-red-500/10 text-red-500 border-red-500/20',
        info: 'bg-primary/10 text-primary border-primary/20',
    };

    const Icon = icons[toast.type];

    return (
        <div className={`
      pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl animate-in slide-in-from-right-10 duration-300
      ${colors[toast.type]}
    `}>
            <Icon size={20} className="shrink-0" />
            <p className="text-sm font-bold tracking-tight">{toast.message}</p>
            <button
                onClick={() => onRemove(toast.id)}
                className="ml-4 p-1 hover:bg-black/10 rounded-full transition-colors"
            >
                <X size={16} />
            </button>
        </div>
    );
};
