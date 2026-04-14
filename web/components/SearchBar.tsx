import { Search } from 'lucide-react';

interface Props {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder }: Props) {
    return (
        <div role="search" aria-label="Global Search" className="relative group focus-within:ring-2 focus-within:ring-primary/40 focus-within:ring-offset-background rounded-[1.25rem] transition-all duration-300">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" aria-hidden="true" />
            <input
                type="search"
                value={value}
                aria-label={placeholder || "Search input"}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-12 pr-12 py-4 rounded-[1.25rem] bg-black/20 backdrop-blur-md border border-white/5 hover:border-white/10 focus:border-primary/50 focus:bg-primary/5 outline-none transition-all placeholder:text-muted-foreground/40 font-bold text-sm shadow-inner"
            />
            {value && (
                <button
                    onClick={() => onChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-xl transition-all text-muted-foreground/50 hover:text-white active:scale-90"
                    aria-label="Clear search"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>
            )}
        </div>
    );
}
