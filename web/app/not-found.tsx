'use client';

import Link from 'next/link';
import Navbar from './components/Navbar';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
            <Navbar />

            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex flex-col items-center justify-center relative z-10 text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20 mb-8 animate-bounce">
                    <Compass className="w-12 h-12 text-primary" />
                </div>

                <h1 className="text-[120px] font-black tracking-tighter leading-none mb-4 text-gradient">
                    404
                </h1>

                <h2 className="text-3xl font-bold mb-6">Market Not Found</h2>

                <p className="text-muted-foreground max-w-md mb-10 text-lg leading-relaxed">
                    It seems you've wandered into an uncharted prediction space.
                    The market you're looking for might have been settled, cancelled, or never existed.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/markets"
                        className="px-8 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                    >
                        Explore Markets
                    </Link>
                    <Link
                        href="/"
                        className="px-8 py-4 bg-white/5 border border-white/10 text-foreground font-black rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}
