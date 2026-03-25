/**
 * Input sanitization utilities for the Predinex frontend.
 * Protects against XSS and injection attacks in user-generated content.
 */

/**
 * Sanitizes a string by removing HTML tags and script injections.
 */
export function sanitizeText(input: string): string {
    if (!input) return '';
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

/**
 * Validates and sanitizes a pool title.
 * @param title The raw pool title
 * @returns Sanitized title or null if invalid
 */
export function sanitizePoolTitle(title: string): string | null {
    if (!title || title.trim().length === 0) return null;
    if (title.length > 100) return null;

    const cleaned = title.trim().replace(/\s+/g, ' ');
    return sanitizeText(cleaned);
}

/**
 * Validates a Stacks principal address format.
 * @param address The address to validate
 */
export function isValidStacksAddress(address: string): boolean {
    if (!address) return false;
    // SP (mainnet) or ST (testnet) followed by alphanumeric characters
    return /^S[PT][A-Z0-9]{38,40}$/i.test(address);
}

/**
 * Sanitizes a pool description.
 */
export function sanitizeDescription(desc: string): string | null {
    if (!desc || desc.trim().length === 0) return null;
    if (desc.length > 500) return null;

    return sanitizeText(desc.trim());
}
