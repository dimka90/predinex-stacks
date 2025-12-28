/**
 * Reown AppKit Configuration
 * Network and wallet connection settings
 */

import { mainnet as stacksMainnet } from '@stacks/network';

export const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

export const stacksNetworks = {
  mainnet: {
    id: 'stacks:mainnet',
    name: 'Stacks Mainnet',
    network: stacksMainnet,
    nativeCurrency: {
      name: 'Stacks',
      symbol: 'STX',
      decimals: 6,
    },
    rpcUrls: {
      default: { http: ['https://api.mainnet.hiro.so'] },
      public: { http: ['https://api.mainnet.hiro.so'] },
    },
    blockExplorers: {
      default: { name: 'Stacks Explorer', url: 'https://explorer.hiro.so' },
    },
  },
};

export const appKitMetadata = {
  name: 'Predinex',
  description: 'Decentralized Prediction Markets on Stacks',
  url: 'https://predinex.io',
  icons: ['/logo.png'],
};
