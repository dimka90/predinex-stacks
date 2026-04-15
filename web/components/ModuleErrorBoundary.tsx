'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCcw } from 'lucide-react';

interface Props {
    children?: ReactNode;
    moduleName?: string;
}

interface State {
    hasError: boolean;
}

class ModuleErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(`Error in module ${this.props.moduleName || 'Unknown'}:`, error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false });
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div role="alert" aria-live="assertive" className="glass-panel p-8 rounded-3xl border-red-500/20 bg-red-950/20 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] relative overflow-hidden shadow-[0_10px_30px_rgba(220,38,38,0.15)]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[40px] -mr-16 -mt-16" />
                    <div className="p-4 bg-red-500/10 rounded-full text-red-500/80 mb-2">
                        <RefreshCcw className="h-6 w-6" />
                    </div>
                    <div className="text-red-400 font-black tracking-widest uppercase text-sm flex items-center gap-2">
                        Module Integrity Failure: {this.props.moduleName || 'Component'}
                    </div>
                    <p className="text-sm font-medium text-muted-foreground/70 max-w-xs">
                        A technical anomaly prevented this module from rendering correctly.
                    </p>
                    <button
                        onClick={this.handleReset}
                        className="flex items-center gap-3 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all active:scale-95 group relative z-10"
                    >
                        <RefreshCcw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                        Reboot Module
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ModuleErrorBoundary;
