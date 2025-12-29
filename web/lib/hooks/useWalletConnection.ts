'use client';
import { useAppKit } from './useAppKit';

export function useWalletConnection() {
  const { open, close, isConnected, address, status } = useAppKit();

  const connect = () => open();
  const disconnect = () => close();

  return {
    connect,
    disconnect,
    isConnected,
    address,
    status,
    isConnecting: status === 'connecting',
    isReconnecting: status === 'reconnecting',
  };
}
