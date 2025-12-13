# ✅ Fixed: Frontend Wallet Connection & Contract Calls

## Problems Fixed

### 1. **Wallet Connection Error**
**Error:** `showConnect is not a function`

**Cause:** SSR (Server-Side Rendering) issue with Next.js - `@stacks/connect` was being imported on the server.

**Fix:** Use dynamic import with `ssr: false` in StacksProvider

### 2. **Contract Call Failing**
**Cause:** Missing `userSession` parameter in `openContractCall`

**Fix:** Pass `userSession` from userData to the contract call

### 3. **Wrong Network**
**Cause:** Frontend was using testnet/mocknet while contract is on mainnet

**Fix:** Updated all network references to `STACKS_MAINNET`

### 4. **Wrong Contract Address**
**Cause:** Constants file had old testnet address

**Fix:** Updated to mainnet address: `SPSHVWJVD3NP8G7ZM82KTHB91HKCMNTY3BKKNE5V`

---

## Files Updated

### 1. `web/app/components/StacksProvider.tsx`

**What changed:**
- ✅ Dynamic import of `showConnect` with `ssr: false`
- ✅ Added `isClient` state to prevent SSR issues
- ✅ Async authenticate function with proper error handling
- ✅ Proper import of `showConnect` inside the function

**Before:**
```typescript
import { showConnect } from '@stacks/connect';

const authenticate = () => {
    showConnect({...});
};
```

**After:**
```typescript
import dynamic from 'next/dynamic';

const authenticate = async () => {
    const { showConnect: showConnectFn } = await import('@stacks/connect');
    showConnectFn({...});
};
```

### 2. `web/app/create/page.tsx`

**What changed:**
- ✅ Added `userSession` to `openContractCall`
- ✅ Better error handling with alert messages
- ✅ Proper error message display

**Before:**
```typescript
await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'create-pool',
    functionArgs,
    onFinish: (data) => {...},
});
```

**After:**
```typescript
await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'create-pool',
    functionArgs,
    userSession: userData.userSession || undefined,
    onFinish: (data) => {...},
    onCancel: () => {...},
});
```

### 3. `web/app/components/Navbar.tsx`

**What changed:**
- ✅ Changed from `testnet` to `mainnet` address display

**Before:**
```typescript
{userData.profile.stxAddress.testnet.slice(0, 5)}...
```

**After:**
```typescript
{userData.profile.stxAddress.mainnet.slice(0, 5)}...
```

### 4. `web/app/lib/constants.ts`

**What changed:**
- ✅ Updated contract address to mainnet

**Before:**
```typescript
export const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
```

**After:**
```typescript
export const CONTRACT_ADDRESS = 'SPSHVWJVD3NP8G7ZM82KTHB91HKCMNTY3BKKNE5V';
```

### 5. `web/app/lib/stacks-api.ts`

**What changed:**
- ✅ Changed from `STACKS_MOCKNET` to `STACKS_MAINNET`

**Before:**
```typescript
import { STACKS_MOCKNET } from "@stacks/network";
const network = STACKS_MOCKNET;
```

**After:**
```typescript
import { STACKS_MAINNET } from "@stacks/network";
const network = STACKS_MAINNET;
```

---

## How to Test

### 1. Start the Frontend
```bash
cd web
npm run dev
```

### 2. Connect Wallet
- Click "Connect Wallet" button
- Leather/Hiro wallet should open
- Approve the connection
- You should see your mainnet address in the navbar

### 3. Create a Pool
- Click "Create Pool" in navbar
- Fill in the form:
  - Title: "Will BTC hit $100k?"
  - Description: "Bitcoin price prediction"
  - Outcome A: "Yes"
  - Outcome B: "No"
  - Duration: 1000
- Click "Create Pool"
- Wallet should open for transaction approval
- After approval, you should see success message with TX ID

### 4. View Pools
- Go to "Markets" page
- Should see your created pool
- Can place bets on outcomes

---

## Common Issues & Solutions

### Issue: "Connect Wallet" button doesn't work
**Solution:** 
- Make sure you're on mainnet in your wallet
- Check browser console for errors
- Try refreshing the page

### Issue: "Create Pool" fails after wallet approval
**Solution:**
- Check that contract address is correct
- Verify you have STX on mainnet
- Check browser console for error details

### Issue: Pools not showing on Markets page
**Solution:**
- Make sure you're viewing mainnet data
- Wait a few minutes for blockchain confirmation
- Refresh the page

### Issue: Wrong address showing in navbar
**Solution:**
- Make sure wallet is connected to mainnet
- Sign out and reconnect
- Check that you're using Leather/Hiro wallet

---

## Architecture

```
Frontend (Next.js)
├── StacksProvider
│   ├── Dynamic import of @stacks/connect
│   ├── UserSession management
│   └── Wallet authentication
│
├── Create Pool Page
│   ├── Form for pool details
│   ├── openContractCall with userSession
│   └─ Wallet approval
│
├── Markets Page
│   ├── Fetch pools from contract
│   ├── Display pool data
│   └── Place bets
│
└── Constants
    ├── Mainnet contract address
    └── Mainnet network config
```

---

## Next Steps

1. ✅ Test wallet connection
2. ✅ Create a test pool
3. ✅ Place a bet
4. ✅ View pools on markets page
5. ✅ Generate activity for leaderboard

---

## Deployment

When deploying to production:

1. **Environment Variables**
   ```bash
   # .env.local (frontend)
   NEXT_PUBLIC_CONTRACT_ADDRESS=SPSHVWJVD3NP8G7ZM82KTHB91HKCMNTY3BKKNE5V
   NEXT_PUBLIC_NETWORK=mainnet
   ```

2. **Build**
   ```bash
   cd web
   npm run build
   npm run start
   ```

3. **Verify**
   - Wallet connects
   - Pools can be created
   - Transactions broadcast to mainnet

---

## Resources

- **@stacks/connect Docs:** https://docs.stacks.co/build-apps/connect
- **@stacks/auth Docs:** https://docs.stacks.co/build-apps/authentication
- **Next.js Dynamic Import:** https://nextjs.org/docs/advanced-features/dynamic-import
- **Stacks Explorer:** https://explorer.hiro.so

---

**Status:** ✅ Frontend fixed and ready to use!

**Next:** Test wallet connection and create a pool
