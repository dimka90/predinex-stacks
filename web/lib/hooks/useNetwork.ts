'use client';
import { useAppKit } from './useAppKit';

export function useNetwork() {
  const { chainId, switchNetwork } = useAppKit();
  
  const isMainnet = chainId === 'stacks:mainnet';
  const networkName = isMainnet ? 'Mainnet' : 'Testnet';

  return {
    chainId,
    isMainnet,
    networkName,
    switchNetwork,
  };
}
