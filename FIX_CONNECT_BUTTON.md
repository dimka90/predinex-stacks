# ✅ Fixed: Connect Wallet Button Not Working

## Problem

The "Connect Wallet" button wasn't opening the wallet connection dialog when clicked.

## Root Cause

The `showConnect` function was being stored in state, but the state update wasn't happening before the user clicked the button. This caused the function to be undefined when called.

### ❌ What Was Wrong
```typescript
const [showConnectFn, setShowConnectFn] = useState<any>(null);

useEffect(() => {
    import('@stacks/connect').then((module) => {
        setShowConnectFn(() => module.showConnect);  // ❌ Async state update
    });
}, []);

const authenticate = () => {
    if (!showConnectFn) {
        console.error('showConnect not loaded yet');
        return;  // ❌ Function not available
    }
    showConnectFn({...});
};
```

## Solution

Import `showConnect` dynamically inside the `authenticate` function itself, so it's loaded when needed.

### ✅ What's Fixed
```typescript
const authenticate = async () => {
    try {
        const { showConnect } = await import('@stacks/connect');  // ✅ Import when needed
        
        showConnect({
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
    } catch (error) {
        console.error('Failed to authenticate:', error);
    }
};
```

## Changes Made

### File 1: `web/app/components/StacksProvider.tsx`

**Removed:**
- `showConnectFn` state
- Complex state management for loading

**Added:**
- Dynamic import inside `authenticate` function
- Proper error handling
- Made `authenticate` async

**Key Change:**
```typescript
// ❌ Before: Store function in state
const [showConnectFn, setShowConnectFn] = useState<any>(null);

// ✅ After: Import when needed
const authenticate = async () => {
    const { showConnect } = await import('@stacks/connect');
    showConnect({...});
};
```

### File 2: `web/app/components/Navbar.tsx`

**Added:**
- `isAuthenticating` state to track button state
- `handleConnect` function to manage async call
- Proper button disabled state

**Key Change:**
```typescript
const [isAuthenticating, setIsAuthenticating] = useState(false);

const handleConnect = async () => {
    setIsAuthenticating(true);
    try {
        await authenticate();
    } catch (error) {
        console.error('Connection failed:', error);
    } finally {
        setIsAuthenticating(false);
    }
};
```

## Result

✅ Connect Wallet button now works  
✅ Wallet connection dialog opens  
✅ No more "not loaded yet" errors  
✅ Proper loading state feedback  
✅ Better error handling  

## How It Works Now

1. User clicks "Connect Wallet" button
2. Button shows "Loading..." and becomes disabled
3. `handleConnect` is called
4. `authenticate` function runs
5. `showConnect` is imported dynamically
6. Wallet connection dialog opens
7. User approves connection
8. User data is loaded
9. Button changes to show wallet address

## Test It

1. Open http://localhost:3001 (or your dev server)
2. Click "Connect Wallet" button
3. Leather/Hiro wallet should open
4. Approve the connection
5. You should see your wallet address in the navbar

## Files Updated

- ✅ `web/app/components/StacksProvider.tsx` - Fixed
- ✅ `web/app/components/Navbar.tsx` - Fixed

---

**Status:** ✅ Fixed and ready to use!
