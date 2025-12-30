'use client';

import { createAppKit } from '@reown/appkit/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { WALLETCONNECT_PROJECT_ID, stacksNetworks, appKitMetadata } from '../lib/appkit-config';

const queryClient = new QueryClient();

// Initialize AppKit
createAppKit({
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [stacksNetworks.mainnet, stacksNetworks.testnet] as any, // Cast to any to bypass strict typing for custom chains
  metadata: appKitMetadata,
  features: {
    analytics: true,
  }
});

export function AppKitProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
