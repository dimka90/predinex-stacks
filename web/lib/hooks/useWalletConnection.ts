import { useState } from 'react';

export function useWalletConnection() {
    const [isConnected, setIsConnected] = useState(false);
    const [address, setAddress] = useState<string | null>(null);

    const connect = () => {
        // Mock connection
        setIsConnected(true);
        setAddress("SP1234...");
    };

    const disconnect = () => {
        setIsConnected(false);
        setAddress(null);
    };

    return { isConnected, address, connect, disconnect };
}
