'use client';
import { useNetwork } from '../lib/hooks/useNetwork';

export function NetworkIndicator() {
  const { networkName, isMainnet } = useNetwork();

  return (
    <div className={`px-3 py-1 rounded-full text-xs font-medium ${isMainnet ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
      {networkName}
    </div>
  );
}
