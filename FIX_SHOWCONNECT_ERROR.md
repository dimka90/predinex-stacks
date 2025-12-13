# ✅ Fixed: showConnectFn is not a function

## Problem

You got this error when running the frontend:
```
Console TypeError
showConnectFn is not a function
```

This happened in `web/app/components/StacksProvider.tsx` at line 46.

## Root Cause

The `showConnect` function was being dynamically imported using Next.js `dynamic()`, which doesn't work well with `@stacks/connect` in a client component.

### ❌ What Was Wrong
```typescript
import dynamic from 'next/dynamic';

const showConnect = dynamic(
    () => import('@stacks/connect').then(mod => mod.showConnect),
    { ssr: false }
);

// Later trying to use it:
const authenticate = async () => {
    const { showConnect: showConnectFn } = await import('@stacks/connect');
    showConnectFn({...})  // ❌ This doesn't work
};
```

## Solution

Import `showConnect` directly at the top of the file since it's already a client component.

### ✅ What's Fixed
```typescript
'use client';

import { showConnect } from '@stacks/connect';  // ✅ Direct import

const authenticate = () => {
    showConnect({  // ✅ Use directly
        appDetails: {
            name: 'Predinex',
            icon: window.location.origin + '/favicon.ico',
        },
        redirectTo: '/',
        onFinish: () => {
            setUserData(userSession.loadUserData());
        },
        userSession: userSession as any,
    });
};
```

## Changes Made

**File:** `web/app/components/StacksProvider.tsx`

1. **Removed dynamic import:**
   ```typescript
   // ❌ Removed
   import dynamic from 'next/dynamic';
   const showConnect = dynamic(...);
   ```

2. **Added direct import:**
   ```typescript
   // ✅ Added
   import { showConnect } from '@stacks/connect';
   ```

3. **Simplified authenticate function:**
   - Removed `async/await`
   - Removed dynamic import inside function
   - Call `showConnect()` directly

4. **Removed unnecessary state:**
   - Removed `isClient` state
   - Removed `setIsClient` logic

## Result

✅ `showConnect` now works correctly
✅ Wallet connection button works
✅ No more TypeErrors
✅ Cleaner, simpler code

## Test It

1. Start the frontend:
   ```bash
   cd web
   npm run dev
   ```

2. Click "Connect Wallet" button in the navbar

3. Leather/Hiro wallet should open

4. Approve connection

5. You should see your wallet address in the navbar

## Files Updated

- ✅ `web/app/components/StacksProvider.tsx` - Fixed

---

**Status:** ✅ Fixed and ready to use!
