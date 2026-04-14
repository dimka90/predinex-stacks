import React from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
    return (
        <button
            role="switch"
            aria-checked="true"
            aria-label="Toggle screen theme"
            className="p-3 rounded-2xl bg-black/20 backdrop-blur-md hover:bg-black/40 transition-all duration-500 border border-white/5 hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-black group relative overflow-hidden active:scale-95 shadow-lg"
        >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" aria-hidden="true" />
            <Sun className="h-5 w-5 block dark:hidden text-amber-500 group-hover:rotate-[120deg] transition-transform duration-700 relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" aria-hidden="true" />
            <Moon className="h-5 w-5 hidden dark:block text-primary group-hover:-rotate-[25deg] transition-transform duration-700 relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]" aria-hidden="true" />
        </button>
    );
};

export default ThemeToggle;
