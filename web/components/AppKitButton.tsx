'use client';
import { useWalletConnection } from '../lib/hooks/useWalletConnection';

export function AppKitButton() {
  const { connect, disconnect, isConnected, address } = useWalletConnection();

  if (isConnected && address) {
    return (
      <button
        onClick={disconnect}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
      >
        {address.slice(0, 6)}...{address.slice(-4)}
      </button>
    );
  }

  return (
    <button
      onClick={connect}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
    >
      Connect Wallet
    </button>
  );
}
