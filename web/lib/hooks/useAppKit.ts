'use client';
import { useAppKit as useReownAppKit, useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';

export function useAppKit() {
  const { open, close } = useReownAppKit();
  const { address, isConnected, status } = useAppKitAccount();
  const { chainId, switchNetwork } = useAppKitNetwork();

  return {
    open,
    close,
    address,
    isConnected,
    status,
    chainId,
    switchNetwork,
  };
}
