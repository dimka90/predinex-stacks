'use client';

import { AppConfig, UserSession } from '@stacks/auth';
import { showConnect } from '@stacks/connect';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

interface StacksContextValue {
    userSession: UserSession;
    userData: any;
    setUserData: (data: any) => void;
    signOut: () => void;
    authenticate: () => void;
}

const StacksContext = createContext<StacksContextValue>({} as any);

export function StacksProvider({ children }: { children: ReactNode }) {
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        if (userSession.isSignInPending()) {
            userSession.handlePendingSignIn().then((userData) => {
                setUserData(userData);
            });
        } else if (userSession.isUserSignedIn()) {
            setUserData(userSession.loadUserData());
        }
    }, []);

    const signOut = () => {
        userSession.signUserOut();
        setUserData(null);
    };

    const authenticate = async () => {
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
                    // Reload to trigger the useEffect that checks for signed in user
                    window.location.reload();
                },
                onCancel: () => {
                    // Handle user cancellation gracefully
                    console.log('User cancelled wallet connection');
                },
            });
        } catch (error) {
            // Handle connection errors
            console.error('Wallet connection error:', error);
        }
    };

    return (
        <StacksContext.Provider value={{ userSession, userData, setUserData, signOut, authenticate }}>
            {children}
        </StacksContext.Provider>
    );
}

export function useStacks() {
    return useContext(StacksContext);
}
