'use client';

import { useEffect, useRef, RefObject } from 'react';

/**
 * useOnClickOutside - Detects clicks outside a ref element.
 * Useful for closing modals, dropdowns, and popovers.
 * @param ref The ref to the target element
 * @param handler Function called when clicked outside
 */
export function useOnClickOutside<T extends HTMLElement>(
    ref: RefObject<T | null>,
    handler: (event: MouseEvent | TouchEvent) => void
): void {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            const el = ref.current;
            if (!el || el.contains(event.target as Node)) return;
            handler(event);
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
}
