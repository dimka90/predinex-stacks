# WalletConnect Implementation - Challenge #3

## Overview

This document describes the WalletConnect integration for Predinex, enabling users to connect their Stacks wallets and interact with the prediction market.

**Challenge**: Build on Stacks with WalletConnect
**Activity Period**: Dec 22-30
**Rewards Pool**: 12,000 STX
**Status**: ✅ Implementation Complete

## Architecture

### Components

```
WalletConnect Integration
├── Configuration
│   └── walletconnect-config.ts
├── Context
│   └── WalletConnectContext.tsx
├── Hooks
│   ├── useWalletConnect.ts
│   ├── useWalletBalance.ts
│   ├── useWalletTransactions.ts
│   ├── useWalletSignMessage.ts
│   ├── useWalletSendTransaction.ts
│   ├── useWalletNetwork.ts
│   └── useWalletEvents.ts
├── Components
│   ├── WalletConnectButton.tsx
│   ├── WalletInfo.tsx
│   ├── QRCodeModal.tsx
│   ├── WalletSelector.tsx
│   ├── ConnectionStatus.tsx
│   ├── AccountSwitcher.tsx
│   ├── NetworkSwitcher.tsx
│   └── WalletModal.tsx
├── Utilities
│   ├── wallet-address.ts
│   ├── wallet-balance.ts
│   ├── wallet-transaction.ts
│   ├── wallet-signing.ts
│   ├── wallet-network.ts
│   ├── wallet-session.ts
│   └── wallet-events.ts
└── Integration
    ├── Navbar integration
    ├── BettingSection integration
    ├── CreatePool integration
    ├── Dashboard integration
    └── Markets integration
```

## Features

### 1. Wallet Connection
- ✅ Connect wallet via WalletConnect
- ✅ Disconnect wallet
- ✅ Session persistence
- ✅ Auto-reconnect on app load
- ✅ Error handling

### 2. Account Management
- ✅ Display connected account
- ✅ Show account balance
- ✅ Switch between accounts
- ✅ Display account history
- ✅ Account-specific data

### 3. Network Management
- ✅ Switch between mainnet/testnet
- ✅ Display current network
- ✅ Network-specific data
- ✅ Network change detection
- ✅ Network validation

### 4. Transaction Management
- ✅ Send transactions
- ✅ Track transaction status
- ✅ Display transaction history
- ✅ Handle transaction errors
- ✅ Transaction confirmation

### 5. Message Signing
- ✅ Sign messages
- ✅ Verify signatures
- ✅ Display signed messages
- ✅ Handle signing errors
- ✅ Signature validation

### 6. UI Components
- ✅ Connect button
- ✅ Wallet info display
- ✅ QR code modal
- ✅ Wallet selector
- ✅ Connection status
- ✅ Account switcher
- ✅ Network switcher
- ✅ Wallet modal

## Setup Instructions

### 1. Install Dependencies

```bash
npm install @walletconnect/web3-provider @walletconnect/client @walletconnect/qrcode-modal
```

### 2. Configure Environment

Create `.env.local`:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_APP_URL=https://predinex.app
```

### 3. Add Provider to App

```typescript
import { WalletConnectProvider } from '@/context/WalletConnectContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <WalletConnectProvider>
          {children}
        </WalletConnectProvider>
      </body>
    </html>
  );
}
```

### 4. Use in Components

```typescript
import { useWalletConnect } from '@/context/WalletConnectContext';

export function MyComponent() {
  const { session, connect, disconnect } = useWalletConnect();

  return (
    <div>
      {session ? (
        <>
          <p>Connected: {session.address}</p>
          <button onClick={disconnect}>Disconnect</button>
        </>
      ) : (
        <button onClick={connect}>Connect Wallet</button>
      )}
    </div>
  );
}
```

## API Reference

### Context

#### `useWalletConnect()`

Returns wallet connection state and methods.

```typescript
const {
  session,           // Current session or null
  isConnecting,      // Connection in progress
  error,             // Error message or null
  connect,           // Connect wallet
  disconnect,        // Disconnect wallet
  switchNetwork,     // Switch network
  signMessage,       // Sign message
  sendTransaction,   // Send transaction
} = useWalletConnect();
```

### Hooks

#### `useWalletBalance()`

Get wallet balance.

```typescript
const { balance, isLoading, error, refresh } = useWalletBalance();
```

#### `useWalletTransactions()`

Get wallet transactions.

```typescript
const { transactions, isLoading, error, refresh } = useWalletTransactions();
```

#### `useWalletSignMessage()`

Sign messages.

```typescript
const { sign, isLoading, error } = useWalletSignMessage();
const signature = await sign('message');
```

#### `useWalletSendTransaction()`

Send transactions.

```typescript
const { send, isLoading, error } = useWalletSendTransaction();
const txId = await send(transaction);
```

#### `useWalletNetwork()`

Manage network.

```typescript
const { network, switchNetwork, isLoading, error } = useWalletNetwork();
```

#### `useWalletEvents()`

Listen to wallet events.

```typescript
const { on, off } = useWalletEvents();
on('accountsChanged', (accounts) => {});
on('chainChanged', (chain) => {});
```

## Integration Examples

### Navbar Integration

```typescript
import { WalletConnectButton } from '@/components/WalletConnectButton';

export function Navbar() {
  return (
    <nav>
      {/* ... other nav items ... */}
      <WalletConnectButton />
    </nav>
  );
}
```

### BettingSection Integration

```typescript
import { useWalletConnect } from '@/context/WalletConnectContext';

export function BettingSection() {
  const { session } = useWalletConnect();

  if (!session) {
    return <p>Please connect your wallet to place bets</p>;
  }

  return (
    <div>
      <p>Wallet: {session.address}</p>
      <p>Balance: {session.balance} STX</p>
      {/* Betting UI */}
    </div>
  );
}
```

### Dashboard Integration

```typescript
import { useWalletConnect } from '@/context/WalletConnectContext';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import { useWalletTransactions } from '@/hooks/useWalletTransactions';

export function Dashboard() {
  const { session } = useWalletConnect();
  const { balance } = useWalletBalance();
  const { transactions } = useWalletTransactions();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Address: {session?.address}</p>
      <p>Balance: {balance} STX</p>
      <h2>Transactions</h2>
      {transactions.map(tx => (
        <div key={tx.id}>{tx.id}</div>
      ))}
    </div>
  );
}
```

## Testing

### Unit Tests

```bash
npm run test -- walletconnect
```

### Integration Tests

```bash
npm run test:integration -- walletconnect
```

### E2E Tests

```bash
npm run test:e2e -- walletconnect
```

## Troubleshooting

### Connection Issues

1. Check Project ID is correct
2. Verify network connectivity
3. Check wallet is compatible
4. Clear browser cache

### Transaction Failures

1. Check wallet balance
2. Verify transaction parameters
3. Check network is correct
4. Review error message

### Session Issues

1. Clear localStorage
2. Refresh page
3. Reconnect wallet
4. Check session expiration

## Security Considerations

1. **Never expose private keys** - WalletConnect handles this
2. **Validate signatures** - Always verify signed messages
3. **Check addresses** - Verify wallet address before transactions
4. **Use HTTPS** - Always use secure connections
5. **Validate transactions** - Check transaction details before signing

## Performance Optimization

1. **Cache balance data** - Reduce API calls
2. **Debounce events** - Prevent excessive updates
3. **Lazy load components** - Load wallet UI on demand
4. **Optimize re-renders** - Use React.memo for components
5. **Use session storage** - Persist session data

## Monitoring

### Metrics to Track

- Connection success rate
- Average connection time
- Transaction success rate
- Error frequency
- User retention

### Logging

```typescript
import { createScopedLogger } from '@/lib/logger';

const log = createScopedLogger('WalletConnect');
log.info('Wallet connected', { address: session.address });
```

## Deployment

### Production Checklist

- [ ] Project ID configured
- [ ] Environment variables set
- [ ] HTTPS enabled
- [ ] Error handling tested
- [ ] Performance optimized
- [ ] Security reviewed
- [ ] Documentation updated
- [ ] Tests passing

## Support

For issues or questions:

1. Check troubleshooting guide
2. Review error messages
3. Check WalletConnect docs
4. Contact support

## Resources

- [WalletConnect Docs](https://docs.walletconnect.com)
- [Stacks Docs](https://docs.stacks.co)
- [Hiro Docs](https://docs.hiro.so)

## Changelog

### v1.0.0 (Dec 22, 2025)

- ✅ Initial WalletConnect integration
- ✅ Wallet connection/disconnection
- ✅ Session management
- ✅ Account switching
- ✅ Network switching
- ✅ Transaction signing
- ✅ UI components
- ✅ Custom hooks
- ✅ Utilities
- ✅ Tests
- ✅ Documentation

---

**Challenge #3: Build on Stacks with WalletConnect**
**Status**: ✅ COMPLETE
**Commits**: 50+
**Rewards**: 12,000 STX
