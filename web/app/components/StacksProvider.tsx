'use client';

import { AppConfig, UserSession } from '@stacks/auth';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import showConnect to avoid SSR issues
const showConnect = dynamic(
    () => import('@stacks/connect').then(mod => mod.showConnect),
    { ssr: false }
);

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

interface StacksContextValue {
    userSession: UserSession;
    userData: any;
    authenticate: () => void;
    signOut: () => void;
}

const StacksContext = createContext<StacksContextValue>({} as any);

export function StacksProvider({ children }: { children: ReactNode }) {
    const [userData, setUserData] = useState<any>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        
        if (userSession.isSignInPending()) {
            userSession.handlePendingSignIn().then((userData) => {
                setUserData(userData);
            });
        } else if (userSession.isUserSignedIn()) {
            setUserData(userSession.loadUserData());
        }
    }, []);

    const authenticate = async () => {
        if (!isClient) return;
        
        try {
            const { showConnect: showConnectFn } = await import('@stacks/connect');
            showConnectFn({
                appDetails: {
                    name: 'Predinex',
                    icon: window.location.origin + '/favicon.ico',
                },
                redirectTo: '/',
                onFinish: () => {
                    setUserData(userSession.loadUserData());
                },
                userSession: userSession as any,
            });
        } catch (error) {
            console.error('Failed to show connect:', error);
        }
    };

    const signOut = () => {
        userSession.signUserOut();
        setUserData(null);
    };

    return (
        <StacksContext.Provider value={{ userSession, userData, authenticate, signOut }}>
            {children}
        </StacksContext.Provider>
    );
}

export function useStacks() {
    return useContext(StacksContext);
}
