'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search markets by title or description...",
  debounceMs = 300
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  // Debounced search implementation
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, onChange, debounceMs]);

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleClear = useCallback(() => {
    setLocalValue('');
    onChange('');
  }, [onChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  }, []);

  return (
    <div className="relative group">
      <div className="absolute inset-x-0 inset-y-0 bg-primary/5 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
      <div className="relative flex items-center">
        <div className="absolute left-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={localValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 bg-muted/20 hover:bg-muted/30 border border-border/50 rounded-2xl 
                   focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 
                   transition-all duration-300 text-sm font-medium placeholder:text-muted-foreground/50"
        />
        <div className="absolute right-4 flex items-center gap-2">
          {localValue !== value && (
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
          )}
          {localValue && (
            <button
              onClick={handleClear}
              className="text-muted-foreground/30 hover:text-foreground transition-colors duration-200 p-1 bg-muted/50 rounded-lg hover:bg-muted"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}