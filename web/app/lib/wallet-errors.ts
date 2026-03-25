/**
 * Wallet Error Handling - Centralized error types and messages
 */

export enum WalletErrorType {
    EXTENSION_NOT_FOUND = 'EXTENSION_NOT_FOUND',
    CONNECTION_REJECTED = 'CONNECTION_REJECTED',
    NETWORK_ERROR = 'NETWORK_ERROR',
    INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
    TRANSACTION_FAILED = 'TRANSACTION_FAILED',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface WalletError {
    type: WalletErrorType;
    message: string;
    walletType?: string;
    originalError?: Error;
}

export function createWalletError(
    type: WalletErrorType,
    walletType?: string,
    originalError?: Error
): WalletError {
    const messages: Record<WalletErrorType, string> = {
        [WalletErrorType.EXTENSION_NOT_FOUND]: `${walletType || 'Wallet'} extension not found. Please install the extension and try again.`,
        [WalletErrorType.CONNECTION_REJECTED]: 'Connection request was rejected by the wallet.',
        [WalletErrorType.NETWORK_ERROR]: 'Network error occurred. Please check your connection and try again.',
        [WalletErrorType.INSUFFICIENT_FUNDS]: 'Insufficient STX balance to complete this transaction.',
        [WalletErrorType.TRANSACTION_FAILED]: 'The transaction failed to broadcast or was aborted.',
        [WalletErrorType.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
    };

    return {
        type,
        message: messages[type],
        walletType,
        originalError,
    };
}

export function handleWalletError(error: unknown, walletType?: string): WalletError {
    if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();

        if (errorMessage.includes('not found') || errorMessage.includes('extension')) {
            return createWalletError(WalletErrorType.EXTENSION_NOT_FOUND, walletType, error);
        }

        if (errorMessage.includes('rejected') || errorMessage.includes('cancel')) {
            return createWalletError(WalletErrorType.CONNECTION_REJECTED, walletType, error);
        }

        if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
            return createWalletError(WalletErrorType.NETWORK_ERROR, walletType, error);
        }
    }

    return createWalletError(WalletErrorType.UNKNOWN_ERROR, walletType, error as Error);
}

/** Recovery suggestions for each error type */
export const WALLET_RECOVERY: Record<WalletErrorType, { suggestion: string; action: string; isRetryable: boolean }> = {
    [WalletErrorType.EXTENSION_NOT_FOUND]: {
        suggestion: 'Install a compatible Stacks wallet extension (Leather, Xverse, or Hiro).',
        action: 'Install Wallet',
        isRetryable: false,
    },
    [WalletErrorType.CONNECTION_REJECTED]: {
        suggestion: 'The connection was rejected. Please try again and approve the request in your wallet.',
        action: 'Try Again',
        isRetryable: true,
    },
    [WalletErrorType.NETWORK_ERROR]: {
        suggestion: 'Check your internet connection and ensure the Stacks network is operational.',
        action: 'Retry Connection',
        isRetryable: true,
    },
    [WalletErrorType.INSUFFICIENT_FUNDS]: {
        suggestion: 'Add STX to your wallet to complete this transaction. You can purchase STX from exchanges.',
        action: 'Check Balance',
        isRetryable: false,
    },
    [WalletErrorType.TRANSACTION_FAILED]: {
        suggestion: 'The transaction could not be completed. This may be due to nonce issues or contract state.',
        action: 'Try Again',
        isRetryable: true,
    },
    [WalletErrorType.UNKNOWN_ERROR]: {
        suggestion: 'An unexpected error occurred. Please refresh the page and try again.',
        action: 'Refresh Page',
        isRetryable: true,
    },
};

/**
 * Gets the recovery information for a wallet error.
 */
export function getRecoveryInfo(error: WalletError) {
    return WALLET_RECOVERY[error.type];
}
