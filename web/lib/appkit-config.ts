/**
 * Reown AppKit Configuration
 * Network and wallet connection settings
 */

import { mainnet as stacksMainnet, testnet as stacksTestnet } from '@stacks/network';

export const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'cbb72cc85764d1cd3b664790089a8fab';

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
  testnet: {
    id: 'stacks:testnet',
    name: 'Stacks Testnet',
    network: stacksTestnet,
    nativeCurrency: {
      name: 'Stacks',
      symbol: 'STX',
      decimals: 6,
    },
    rpcUrls: {
      default: { http: ['https://api.testnet.hiro.so'] },
      public: { http: ['https://api.testnet.hiro.so'] },
    },
    blockExplorers: {
      default: { name: 'Stacks Explorer', url: 'https://explorer.hiro.so?chain=testnet' },
    },
  },
};

export const appKitMetadata = {
  name: 'Predinex',
  description: 'Decentralized Prediction Markets on Stacks',
  url: 'https://predinex.io',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
};
