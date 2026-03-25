/**
 * STX conversion helpers for the Predinex frontend.
 * Handles micro-STX <-> STX conversions with precision.
 */

const MICRO_STX_PER_STX = 1_000_000;

/**
 * Converts micro-STX to STX.
 * @param microStx Amount in micro-STX
 * @returns Amount in STX
 */
export function microStxToStx(microStx: number | bigint): number {
    return Number(microStx) / MICRO_STX_PER_STX;
}

/**
 * Converts STX to micro-STX.
 * @param stx Amount in STX
 * @returns Amount in micro-STX
 */
export function stxToMicroStx(stx: number): number {
    return Math.round(stx * MICRO_STX_PER_STX);
}

/**
 * Formats micro-STX to a human-readable STX string.
 * @param microStx Amount in micro-STX
 * @param decimals Number of decimal places (default: 2)
 * @returns Formatted string (e.g., "1,250.50 STX")
 */
export function formatStx(microStx: number | bigint, decimals = 2): string {
    const stx = microStxToStx(microStx);
    return `${stx.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })} STX`;
}

/**
 * Validates that an STX amount is within protocol limits.
 * @param stxAmount Amount in STX
 * @param minStx Minimum allowed (default: 1)
 * @param maxStx Maximum allowed (default: 1000)
 */
export function validateStxAmount(stxAmount: number, minStx = 1, maxStx = 1000): { valid: boolean; error?: string } {
    if (isNaN(stxAmount) || stxAmount <= 0) {
        return { valid: false, error: 'Amount must be a positive number' };
    }
    if (stxAmount < minStx) {
        return { valid: false, error: `Minimum bet is ${minStx} STX` };
    }
    if (stxAmount > maxStx) {
        return { valid: false, error: `Maximum bet is ${maxStx} STX` };
    }
    return { valid: true };
}
