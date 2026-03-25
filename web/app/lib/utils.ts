/**
 * Common utility functions for the Predinex frontend application.
 */

/**
 * Truncates a Stacks address for display.
 * @param address The full Stacks address
 * @param startChars Number of characters to show at the start (default: 6)
 * @param endChars Number of characters to show at the end (default: 4)
 * @returns Truncated address string (e.g., "SP2W...580")
 */
export function truncateAddress(address: string, startChars = 6, endChars = 4): string {
    if (!address) return '';
    if (address.length <= startChars + endChars) return address;

    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Formats a number as a currency string.
 * @param amount The number to format
 * @param currency The currency symbol (default: 'STX')
 * @returns Formatted string (e.g., "1,250 STX")
 */
export function formatAmount(amount: number, currency = 'STX'): string {
    return `${amount.toLocaleString()} ${currency}`;
}

/**
 * Formats a number as a percentage string.
 * @param value The decimal value (e.g., 0.75 for 75%)
 * @param decimals Number of decimal places (default: 1)
 * @returns Formatted percentage string (e.g., "75.0%")
 */
export function formatPercentage(value: number, decimals = 1): string {
    if (isNaN(value) || !isFinite(value)) return '0%';
    return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Calculates time ago from a given date.
 * @param date The date to calculate from
 * @returns Human-readable relative time string
 */
export function timeAgo(date: Date | string | number): string {
    const now = Date.now();
    const past = new Date(date).getTime();
    const diffMs = now - past;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'just now';
}
