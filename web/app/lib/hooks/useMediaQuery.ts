'use client';

import { useState, useEffect } from 'react';

/**
 * useMediaQuery - SSR-safe media query hook for responsive logic.
 * @param query CSS media query string (e.g., '(min-width: 768px)')
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia(query);
        setMatches(mediaQuery.matches);

        const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
        mediaQuery.addEventListener('change', handler);

        return () => mediaQuery.removeEventListener('change', handler);
    }, [query]);

    return matches;
}

/**
 * Predefined breakpoint hooks for convenience.
 */
export function useIsMobile(): boolean {
    return !useMediaQuery('(min-width: 768px)');
}

export function useIsTablet(): boolean {
    return useMediaQuery('(min-width: 768px)') && !useMediaQuery('(min-width: 1024px)');
}

export function useIsDesktop(): boolean {
    return useMediaQuery('(min-width: 1024px)');
}
