'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: undefined });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden z-50">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.15)_0%,rgba(0,0,0,1)_70%)] pointer-events-none" />
                    <div className="glass bg-black/60 backdrop-blur-3xl border border-red-500/30 p-10 rounded-[3rem] max-w-lg w-full text-center space-y-8 relative z-10 shadow-[0_30px_100px_rgba(220,38,38,0.2)]">
                        <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20 shadow-[0_0_30px_rgba(220,38,38,0.3)] relative">
                            <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping opacity-50" />
                            <AlertTriangle className="w-10 h-10 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] relative z-10" />
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-3xl font-black tracking-tighter uppercase text-white">System Fault</h2>
                            <p className="text-sm font-medium text-red-200/60 leading-relaxed max-w-sm mx-auto">
                                Critical execution error intercepted. Protocol monitoring has been notified.
                            </p>
                        </div>

                        {this.state.error && (
                            <div className="bg-black/80 border border-red-500/20 p-5 rounded-2xl text-left overflow-auto max-h-40 text-[11px] font-mono text-red-400 shadow-inner">
                                {this.state.error.message}
                            </div>
                        )}

                        <button
                            onClick={this.handleReset}
                            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-800 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] active:scale-95 shadow-[0_10px_30px_rgba(220,38,38,0.4)] border border-red-500/50"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Force Restart Terminal
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
