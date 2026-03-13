import React from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
    return (
        <button className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors border border-border">
            <Sun className="h-4 w-4 block dark:hidden" />
            <Moon className="h-4 w-4 hidden dark:block" />
        </button>
    );
};

export default ThemeToggle;
