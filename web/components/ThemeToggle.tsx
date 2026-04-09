import React from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
    return (
        <button className="p-2.5 rounded-xl bg-muted/20 hover:bg-muted/40 transition-all duration-500 border border-border/50 hover:border-primary/30 group relative overflow-hidden active:scale-95">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Sun className="h-5 w-5 block dark:hidden text-yellow-500 group-hover:rotate-90 transition-transform duration-500 relative z-10" />
            <Moon className="h-5 w-5 hidden dark:block text-primary group-hover:rotate-12 transition-transform duration-500 relative z-10" />
        </button>
    );
};

export default ThemeToggle;
