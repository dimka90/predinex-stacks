'use client';

import Link from "next/link";
import { LogOut, Wallet } from "lucide-react";
import { useWalletConnect } from "@/context/WalletConnectContext";
import { WalletConnectButton } from "./WalletConnectButton";
import { NetworkSwitcher } from "./NetworkSwitcher";

export default function Navbar() {
    const { session } = useWalletConnect();

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
                        {session?.isConnected && (
                            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                Dashboard
                            </Link>
                        )}
                    </div>

                    {/* Wallet Connection and Network Switcher */}
                    <div className="flex items-center gap-4">
                        {session?.isConnected && <NetworkSwitcher />}
                        <WalletConnectButton />
                    </div>
                </div>
            </div>
        </nav>
    );
}
