'use client';

import { AppConfig, UserSession } from '@stacks/auth';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

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
    const [showConnectFn, setShowConnectFn] = useState<any>(null);

    useEffect(() => {
        // Load showConnect only on client side
        import('@stacks/connect').then((module) => {
            setShowConnectFn(() => module.showConnect);
        });

        if (userSession.isSignInPending()) {
            userSession.handlePendingSignIn().then((userData) => {
                setUserData(userData);
            });
        } else if (userSession.isUserSignedIn()) {
            setUserData(userSession.loadUserData());
        }
    }, []);

    const authenticate = () => {
        if (!showConnectFn) {
            console.error('showConnect not loaded yet');
            return;
        }

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
