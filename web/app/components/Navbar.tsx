'use client';

import Link from "next/link";
import { LogOut } from "lucide-react";
import AppKitButton from "../../components/AppKitButton";
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

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/markets" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            Markets
                        </Link>
                        <Link href="/create" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            Create
                        </Link>
                        {userData && (
                            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                Dashboard
                            </Link>
                        )}
                    </div>

                    {/* User Info & Connect Button */}
                    <div className="flex items-center gap-4">
                        {/* We use the AppKit button as the primary connect method now */}
                        <AppKitButton />
                        
                        {userData && (
                            <button
                                onClick={signOut}
                                className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-full border border-red-500/20 transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
                                aria-label="Sign out"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
