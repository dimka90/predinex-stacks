'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error';
}

interface ToastContainerProps {
    toasts: Toast[];
    onClose: (id: string) => void;
}

export default function ToastContainer({ toasts, onClose }: ToastContainerProps) {
    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4 max-w-sm w-full pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className="pointer-events-auto bg-black/40 backdrop-blur-2xl border border-white/5 p-5 rounded-2xl shadow-2xl flex items-start gap-4 animate-in slide-in-from-right-10 fade-in duration-500 overflow-hidden relative group"
                >
                    <div className={`mt-0.5 ${toast.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                        {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    </div>
                    <div className="flex-1 space-y-1">
                        <p className="text-xs font-black uppercase tracking-widest opacity-60">
                            {toast.type === 'success' ? 'System Success' : 'Protocol Error'}
                        </p>
                        <p className="text-sm font-bold text-foreground leading-tight">{toast.message}</p>
                    </div>
                    <button
                        onClick={() => onClose(toast.id)}
                        className="text-muted-foreground hover:text-white transition-colors p-1"
                    >
                        <X size={16} />
                    </button>

                    {/* Progress Bar Aesthetic */}
                    <div className={`absolute bottom-0 left-0 h-1 transition-all duration-[5000ms] ease-linear w-full ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                </div>
            ))}
        </div>
    );
}
