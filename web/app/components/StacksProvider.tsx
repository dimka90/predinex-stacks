'use client';

/**
 * StacksProvider - React Context Provider for Stacks wallet authentication
 * 
 * This component manages the authentication state for the entire application,
 * providing wallet connection, user session management, and authentication
 * functions to child components through React Context.
 */

import { AppConfig, UserSession } from '@stacks/auth';
import { ReactNode, createContext, useContext, useEffect, useState, useCallback } from 'react';
import { connectWallet, WalletType } from '../lib/wallet-connector';
import WalletModal from './WalletModal';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

/**
 * Interface defining the shape of the Stacks context value
 * Available to all components that use the useStacks hook
 */
interface StacksContextValue {
    /** The Stacks UserSession instance for managing authentication */
    userSession: UserSession;
    /** Current user data from the authenticated wallet, null if not authenticated */
    userData: any;
    /** Function to manually set user data */
    setUserData: (data: any) => void;
    /** Function to sign out the current user */
    signOut: () => void;
    /** Function to initiate wallet connection flow */
    authenticate: () => void;
    /** Function to open wallet selection modal */
    openWalletModal: () => void;
    /** Loading state during authentication initialization */
    isLoading: boolean;
}

const StacksContext = createContext<StacksContextValue>({} as any);

export function StacksProvider({ children }: { children: ReactNode }) {
    const [userData, setUserData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                if (userSession.isSignInPending()) {
                    const userData = await userSession.handlePendingSignIn();
                    setUserData(userData);
                } else if (userSession.isUserSignedIn()) {
                    setUserData(userSession.loadUserData());
                }
            } catch (error) {
                console.error('Error initializing authentication:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const signOut = useCallback(() => {
        userSession.signUserOut();
        setUserData(null);
    }, []);

    const authenticate = useCallback(async () => {
        console.log('Authenticate function called');
        try {
            await showConnect({
                appDetails: {
                    name: 'Predinex',
                    icon: window.location.origin + '/favicon.ico',
                },
                redirectTo: '/',
                userSession,
                onFinish: async (authData) => {
                    // Handle successful authentication
                    console.log('Authentication finished:', authData);
                    try {
                        const userData = await userSession.handlePendingSignIn();
                        setUserData(userData);
                        // Optional: Show success notification
                        console.log('Wallet connected successfully');
                    } catch (error) {
                        console.error('Error handling sign in:', error);
                        // Fallback to reload if handlePendingSignIn fails
                        window.location.reload();
                    }
                },
                onCancel: () => {
                    // Handle user cancellation gracefully
                    console.log('User cancelled wallet connection');
                },
            });
        } catch (error) {
            // Handle connection errors
            console.error('Wallet connection error:', error);
            // Check if wallet extension is available
            if (typeof window !== 'undefined' && !window.StacksProvider) {
                alert('Please install Leather or Xverse wallet extension to connect.');
            }
        }
    }, [userSession]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <StacksContext.Provider value={{ userSession, userData, setUserData, signOut, authenticate, isLoading }}>
            {children}
        </StacksContext.Provider>
    );
}

export function useStacks() {
    return useContext(StacksContext);
}
