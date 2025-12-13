'use client';

import { AppConfig, UserSession } from '@stacks/auth';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

interface StacksContextValue {
    userSession: UserSession;
    userData: any;
    authenticate: () => Promise<void>;
    signOut: () => void;
    isLoading: boolean;
}

const StacksContext = createContext<StacksContextValue>({} as any);

export function StacksProvider({ children }: { children: ReactNode }) {
    const [userData, setUserData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);

        if (userSession.isSignInPending()) {
            userSession.handlePendingSignIn().then((userData) => {
                setUserData(userData);
            });
        } else if (userSession.isUserSignedIn()) {
            setUserData(userSession.loadUserData());
        }
    }, []);

    const authenticate = async () => {
        try {
            const { showConnect } = await import('@stacks/connect');
            
            showConnect({
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
            console.error('Failed to authenticate:', error);
        }
    };

    const signOut = () => {
        userSession.signUserOut();
        setUserData(null);
    };

    return (
        <StacksContext.Provider value={{ userSession, userData, authenticate, signOut, isLoading }}>
            {children}
        </StacksContext.Provider>
    );
}

export function useStacks() {
    return useContext(StacksContext);
}
