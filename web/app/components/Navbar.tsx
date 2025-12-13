'use client';

import Link from "next/link";
import { Wallet, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useStacks } from "./StacksProvider";

export default function Navbar() {
    const { userData, setUserData, signOut, userSession } = useStacks();
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [showConnectFn, setShowConnectFn] = useState<any>(null);

    // Load showConnect on mount
    useEffect(() => {
        import('@stacks/connect').then((module) => {
            console.log('Loaded @stacks/connect:', Object.keys(module));
            setShowConnectFn(() => module.showConnect);
        }).catch((err) => {
            console.error('Failed to load @stacks/connect:', err);
        });
    }, []);

    const handleConnect = async () => {
        if (!showConnectFn) {
            console.error('showConnect not loaded');
            return;
        }

        setIsAuthenticating(true);
        try {
            showConnectFn({
                appDetails: {
                    name: 'Predinex',
                    icon: window.location.origin + '/favicon.ico',
                },
                redirectTo: '/',
                onFinish: () => {
                    try {
                        const userData = userSession.loadUserData();
                        setUserData(userData);
                    } catch (error) {
                        console.error('Failed to load user data:', error);
                    }
                },
                userSession: userSession as any,
            });
        } catch (error) {
            console.error('Connection failed:', error);
        } finally {
            setIsAuthenticating(false);
        }
    };

    return (
        <nav className="fixed top-0 w-full z-50 glass border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="font-bold text-white">P</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight">Predinex</span>
                    </Link>

                    {/* Connect Button */}
                    {userData ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-mono text-muted-foreground hidden sm:block">
                                {userData.profile.stxAddress.mainnet.slice(0, 5)}...{userData.profile.stxAddress.mainnet.slice(-5)}
                            </span>
                            <button
                                onClick={signOut}
                                className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-full border border-red-500/20 transition-colors font-medium text-sm"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleConnect}
                            disabled={isAuthenticating || !showConnectFn}
                            className="flex items-center gap-2 bg-muted hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors px-4 py-2 rounded-full border border-border font-medium text-sm"
                        >
                            <Wallet className="w-4 h-4 text-accent" />
                            {isAuthenticating ? 'Loading...' : 'Connect Wallet'}
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
