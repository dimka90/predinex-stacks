'use client';

import { AppConfig, UserSession } from '@stacks/auth';
import { showConnect } from '@stacks/connect';
import { ReactNode, createContext, useContext, useEffect, useState, useCallback } from 'react';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

interface StacksContextValue {
    userSession: UserSession;
    userData: any;
    setUserData: (data: any) => void;
    signOut: () => void;
    authenticate: () => void;
    isLoading: boolean;
}

const StacksContext = createContext<StacksContextValue>({} as any);

export function StacksProvider({ children }: { children: ReactNode }) {
    const [userData, setUserData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

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
                onFinish: (authData) => {
                    // Handle successful authentication
                    console.log('Authentication finished:', authData);
                    console.log('User data will be loaded on page reload');
                    // Reload to trigger the useEffect that checks for signed in user
                    window.location.reload();
                },
                onCancel: () => {
                    // Handle user cancellation gracefully
                    console.log('User cancelled wallet connection');
                    console.log('Authentication state remains unchanged');
                },
            });
        } catch (error) {
            // Handle connection errors
            console.error('Wallet connection error:', error);
            console.error('Please ensure you have a Stacks wallet extension installed (Leather or Xverse)');
        }
    }, []);

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
