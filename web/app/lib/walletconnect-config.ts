/**
 * WalletConnect Configuration
 * Challenge #3: Build on Stacks with WalletConnect
 */

export const WALLETCONNECT_CONFIG = {
  // Project ID from WalletConnect Cloud
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',

  // Metadata for wallet display
  metadata: {
    name: 'Predinex',
    description: 'Decentralized Prediction Market on Stacks',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://predinex.app',
    icons: ['https://predinex.app/logo.png'],
  },

  // Supported chains
  chains: {
    mainnet: {
      chainId: 'mainnet',
      name: 'Stacks Mainnet',
      rpcUrl: 'https://api.mainnet.hiro.so',
      explorerUrl: 'https://explorer.hiro.so',
    },
    testnet: {
      chainId: 'testnet',
      name: 'Stacks Testnet',
      rpcUrl: 'https://api.testnet.hiro.so',
      explorerUrl: 'https://explorer.hiro.so?chain=testnet',
    },
  },

  // Supported methods
  methods: [
    'stx_call_read_only',
    'stx_call_contract_function',
    'stx_transfer',
    'stx_sign_message',
    'stx_get_accounts',
  ],

  // Supported events
  events: [
    'chainChanged',
    'accountsChanged',
    'sessionProposed',
    'sessionApproved',
    'sessionRejected',
    'sessionDisconnected',
  ],

  // UI Configuration
  ui: {
    showQrCode: true,
    showWalletList: true,
    autoConnect: true,
    persistSession: true,
  },

  // Timeouts
  timeouts: {
    sessionProposal: 300000, // 5 minutes
    sessionApproval: 300000, // 5 minutes
    sessionConnection: 60000, // 1 minute
  },

  // Storage
  storage: {
    key: 'predinex_walletconnect_session',
    ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
} as const;

export type WalletConnectConfig = typeof WALLETCONNECT_CONFIG;
