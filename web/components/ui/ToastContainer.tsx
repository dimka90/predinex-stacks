'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

interface ToastContainerProps {
    toasts: Toast[];
    onClose: (id: string) => void;
}

export default function ToastContainer({ toasts, onClose }: ToastContainerProps) {
    return (
        <div role="status" aria-live="polite" className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4 max-w-sm w-full pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className="pointer-events-auto bg-slate-950/80 backdrop-blur-2xl border border-white/10 p-5 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-start gap-4 animate-in slide-in-from-right-10 fade-in duration-500 overflow-hidden relative group slide-out-to-right-10 zoom-out-95"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-tr from-transparent via-white/5 to-white/5 opacity-50 blur-[20px] rounded-full -mr-16 -mt-16 pointer-events-none" />
                    <div className={`mt-0.5 p-2 rounded-xl backdrop-blur-sm shadow-inner relative z-10 ${toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : toast.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                        {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    </div>
                    <div className="flex-1 space-y-1 relative z-10 pt-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
                            {toast.type === 'success' ? 'System Success' : toast.type === 'error' ? 'Protocol Error' : 'System Message'}
                        </p>
                        <p className="text-sm font-medium text-white leading-snug">{toast.message}</p>
                    </div>
                    <button
                        onClick={() => onClose(toast.id)}
                        className="text-muted-foreground/50 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg active:scale-90 relative z-10"
                    >
                        <X size={14} />
                    </button>

                    {/* Progress Bar Aesthetic */}
                    <div className={`absolute bottom-0 left-0 h-1 transition-all duration-[5000ms] ease-linear w-full opacity-80 ${toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-primary shadow-[0_0_10px_rgba(79,70,229,0.5)]'
                        }`} />
                </div>
            ))}
        </div>
    );
}
