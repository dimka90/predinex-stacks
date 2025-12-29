/**
 * Wallet Error Handling - Centralized error types and messages
 */

export enum WalletErrorType {
    EXTENSION_NOT_FOUND = 'EXTENSION_NOT_FOUND',
    CONNECTION_REJECTED = 'CONNECTION_REJECTED',
    NETWORK_ERROR = 'NETWORK_ERROR',
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

