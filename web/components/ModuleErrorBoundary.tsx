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
                <div className="glass-panel p-6 rounded-xl border-red-500/20 bg-red-500/5 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="text-red-500 font-bold flex items-center gap-2">
                        Failed to load {this.props.moduleName || 'component'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        A small technical issue occurred within this section.
                    </p>
                    <button
                        onClick={this.handleReset}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 text-xs font-bold rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                        <RefreshCcw className="h-3 w-3" />
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ModuleErrorBoundary;
