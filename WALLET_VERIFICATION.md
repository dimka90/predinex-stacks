# Wallet Connection Verification Checklist

This document provides a comprehensive checklist to verify that the wallet connection functionality is working correctly.

## Prerequisites

1. **Browser Extensions**: Install at least one of the following:
   - Leather Wallet (recommended)
   - Xverse Wallet

2. **Development Environment**: 
   - Run `npm run dev` in the `web` directory
   - Open browser to `http://localhost:3000`

## Manual Testing Checklist

### 1. Initial State (Unauthenticated User)

- [ ] Navigate to homepage - should see "Connect Wallet" button in navbar
- [ ] Navigate to `/create` - should see authentication guard with "Connect Wallet" button
- [ ] Navigate to `/markets` - should be accessible (public page)
- [ ] Navigate to any market detail page - betting section should show "Connect Wallet to Bet"

### 2. Wallet Connection Flow

- [ ] Click "Connect Wallet" button from navbar
- [ ] Wallet extension popup should appear
- [ ] Select wallet (Leather/Xverse) if multiple options
- [ ] Approve connection in wallet extension
- [ ] Page should reload automatically
- [ ] Navbar should now show STX address (first 5 + last 5 characters)
- [ ] "Sign Out" button should appear in navbar

### 3. Authenticated State

- [ ] STX address should be displayed correctly in navbar
- [ ] Navigate to `/create` - should see create pool form (no auth guard)
- [ ] Navigate to any market - betting section should show bet amount input and bet buttons
- [ ] "Sign Out" button should be visible and functional

### 4. Protected Functionality

#### Create Pool Page (`/create`)
- [ ] Form should be accessible when authenticated
- [ ] Fill out form with valid data
- [ ] Click "Create Pool" - wallet should prompt for transaction signature
- [ ] Approve transaction - should see success message with transaction ID

#### Market Betting (`/markets/[id]`)
- [ ] Enter bet amount (e.g., "1")
- [ ] Click either bet button (Outcome A or B)
- [ ] Wallet should prompt for transaction signature
- [ ] Approve transaction - should see success message with transaction ID

### 5. Session Persistence

- [ ] While authenticated, refresh the page
- [ ] Should remain authenticated (STX address still visible)
- [ ] Close browser tab and reopen to same URL
- [ ] Should remain authenticated (if session is still valid)

### 6. Sign Out Flow

- [ ] Click "Sign Out" button in navbar
- [ ] Should return to unauthenticated state
- [ ] Navbar should show "Connect Wallet" button again
- [ ] Navigate to `/create` - should see authentication guard again
- [ ] Market betting sections should show "Connect Wallet to Bet" again

### 7. Error Handling

#### No Wallet Extension
- [ ] Test on browser without wallet extension
- [ ] Click "Connect Wallet" - should see appropriate error in console
- [ ] Application should not crash

#### User Cancellation
- [ ] Click "Connect Wallet"
- [ ] Cancel the wallet connection dialog
- [ ] Should remain in unauthenticated state
- [ ] No errors should occur

#### Transaction Cancellation
- [ ] While authenticated, try to create pool or place bet
- [ ] Cancel the transaction in wallet
- [ ] Should return to form state without errors
- [ ] Can retry the action

## Console Logging

The following console messages should appear during testing:

### Authentication Flow
```
Authenticate function called
Authentication finished: [authData object]
User data will be loaded on page reload
```

### Cancellation
```
User cancelled wallet connection
Authentication state remains unchanged
```

### Betting Success
```
Bet placed successfully: [transaction data]
```

### Betting Cancellation
```
User cancelled bet transaction
```

## Common Issues and Solutions

### Issue: "Connect Wallet" button doesn't work
- **Check**: Browser console for errors
- **Solution**: Ensure wallet extension is installed and enabled

### Issue: Page doesn't reload after authentication
- **Check**: Console for authentication finished message
- **Solution**: Manual page refresh should show authenticated state

### Issue: STX address not displaying
- **Check**: Console for user data loading
- **Solution**: Verify wallet connection was successful

### Issue: Protected pages still show auth guard when authenticated
- **Check**: User data is properly loaded in StacksProvider
- **Solution**: Check browser developer tools for React context state

## Success Criteria

All checklist items should pass for the wallet connection feature to be considered fully functional. The application should:

1. ✅ Properly handle unauthenticated users
2. ✅ Successfully connect to Stacks wallets
3. ✅ Maintain authentication state across page refreshes
4. ✅ Protect sensitive functionality behind authentication
5. ✅ Handle errors gracefully without crashing
6. ✅ Provide clear user feedback for all actions