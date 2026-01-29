'use client';
import { useStacksAccount } from '../lib/hooks/useStacksAccount';

export function AccountDisplay() {
  const { address, balance, isConnected } = useStacksAccount();

  if (!isConnected) return null;

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
        <p className="font-mono text-sm">{address}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Balance</p>
        <p className="font-semibold">{balance} STX</p>
      </div>
    </div>
  );
}
