'use client';

import { useState } from "react";
import Link from "next/link";
import { LogOut, Menu, X } from "lucide-react";
import AppKitButton from "../../components/AppKitButton";
import { useStacks } from "./StacksProvider";

export default function Navbar() {
    const { userData, signOut } = useStacks();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 glass border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="font-bold text-white">P</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight text-gradient">Predinex</span>
                    </Link>

                    {/* Navigation Links - Desktop */}
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

                    {/* User Info & Connect Button - Desktop */}
                    <div className="hidden md:flex items-center gap-4">
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

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <AppKitButton />
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden glass border-t border-border animate-float-delayed">
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        <Link
                            href="/markets"
                            className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-lg transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Markets
                        </Link>
                        <Link
                            href="/create"
                            className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-lg transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Create
                        </Link>
                        {userData && (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-lg transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => {
                                        signOut();
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-base font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    Sign Out
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
