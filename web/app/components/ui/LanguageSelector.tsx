'use client';

import { useState, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';

const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'cn', name: '中文', flag: '🇨🇳' },
];

export default function LanguageSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(languages[0]);

    useEffect(() => {
        const saved = localStorage.getItem('language');
        if (saved) {
            const lang = languages.find(l => l.code === saved);
            if (lang) setSelected(lang);
        }
    }, []);

    const handleSelect = (lang: typeof languages[0]) => {
        setSelected(lang);
        localStorage.setItem('language', lang.code);
        setIsOpen(false);
        // In a real app, this would trigger i18n change
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/50 hover:bg-muted transition-all border border-border/30 hover:border-primary/30 group"
                aria-label="Select Language"
            >
                <div className="flex items-center gap-2">
                    <span className="text-lg">{selected.flag}</span>
                    <span className="text-xs font-bold uppercase tracking-widest hidden lg:block">{selected.code}</span>
                </div>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 glass-panel border border-border/50 rounded-2xl shadow-2xl py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleSelect(lang)}
                                className={`
                  w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors
                  ${selected.code === lang.code ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                `}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">{lang.flag}</span>
                                    <span>{lang.name}</span>
                                </div>
                                {selected.code === lang.code && <Check size={14} />}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
