'use client';

import Link from "next/link";
import { LogOut } from "lucide-react";
import { useStacks } from "./StacksProvider";

export default function Navbar() {
    const { userData, signOut } = useStacks();

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

                    {/* User Info */}
                    {userData ? (
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                Dashboard
                            </Link>
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
                        <div className="text-sm text-muted-foreground">
                            Not connected
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
