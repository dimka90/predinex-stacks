'use client';

/**
 * StacksProvider - React Context Provider for Stacks wallet authentication (Legacy Stacks wallet authentication Direct)
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

    const openWalletModal = useCallback(() => {
        setIsWalletModalOpen(true);
    }, []);

    const handleWalletSelection = useCallback(async (walletType: WalletType) => {
        try {
            await connectWallet({
                walletType,
                userSession,
                onFinish: async (authData) => {
                    console.log('Authentication finished:', authData);
                    try {
                        const userData = await userSession.handlePendingSignIn();
                        setUserData(userData);
                        console.log('Wallet connected successfully');
                    } catch (error) {
                        console.error('Error handling sign in:', error);
                        window.location.reload();
                    }
                },
                onCancel: () => {
                    console.log('User cancelled wallet connection');
                },
            });
        } catch (error) {
            console.error('Wallet connection error:', error);
            alert(`Failed to connect to ${walletType}. Please try again.`);
        }
    }, [userSession]);

    const authenticate = useCallback(() => {
        openWalletModal();
    }, [openWalletModal]);

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
        <StacksContext.Provider value={{ userSession, userData, setUserData, signOut, authenticate, openWalletModal, isLoading }}>
            <WalletModal
                isOpen={isWalletModalOpen}
                onClose={() => setIsWalletModalOpen(false)}
                onSelectWallet={handleWalletSelection}
            />
            {children}
        </StacksContext.Provider>
    );
}

export function useStacks() {
    return useContext(StacksContext);
}
