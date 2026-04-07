import { Search } from 'lucide-react';

interface Props {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder }: Props) {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-card/40 border border-border focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/50 font-medium"
            />
            {value && (
                <button
                    onClick={() => onChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted/20 rounded-full transition-colors text-muted-foreground/50 hover:text-foreground"
                    aria-label="Clear search"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>
            )}
        </div>
    );
}
