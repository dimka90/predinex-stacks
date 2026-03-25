/**
 * Debounce and throttle utilities for optimizing UI interactions.
 */

/**
 * Creates a debounced version of a function.
 * The function will only be called after `delay` ms of no invocations.
 */
export function debounce<T extends (...args: unknown[]) => void>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<T>) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

/**
 * Creates a throttled version of a function.
 * The function will be called at most once per `interval` ms.
 */
export function throttle<T extends (...args: unknown[]) => void>(
    fn: T,
    interval: number
): (...args: Parameters<T>) => void {
    let lastCall = 0;

    return (...args: Parameters<T>) => {
        const now = Date.now();
        if (now - lastCall >= interval) {
            lastCall = now;
            fn(...args);
        }
    };
}

/**
 * Copies text to the system clipboard.
 * Falls back to legacy execCommand if Clipboard API is unavailable.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(text);
            return true;
        }
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
    } catch {
        return false;
    }
}

/**
 * Simple rate limiter for API calls.
 * Returns true if the action is allowed, false if rate-limited.
 */
export function createRateLimiter(maxCalls: number, windowMs: number) {
    const calls: number[] = [];

    return (): boolean => {
        const now = Date.now();
        // Remove expired calls
        while (calls.length > 0 && calls[0] < now - windowMs) {
            calls.shift();
        }
        if (calls.length >= maxCalls) return false;
        calls.push(now);
        return true;
    };
}
