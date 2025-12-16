# Wallet Connection Implementation Tasks

## Overview
The wallet connection flow is incomplete. Users cannot connect their wallets to the app because the `authenticate` function is missing from the StacksProvider.

## What Needs to Be Done

### Task 1: Add authenticate function to StacksProvider
**File:** `web/app/components/StacksProvider.tsx`

- Import the `showConnect` function from `@stacks/connect`
- Create an `authenticate` function that:
  - Opens the wallet connection dialog
  - Handles successful authentication by loading user data
  - Handles when user cancels the connection
  - Handles any errors that occur
- Add the `authenticate` function to the context provider so other components can use it
- Update the TypeScript interface to include the `authenticate` function

### Task 2: Add Connect Wallet button to Navbar
**File:** `web/app/components/Navbar.tsx`

- Import the `authenticate` function from the useStacks hook
- Add a "Connect Wallet" button that appears when no user is logged in
- The button should call the `authenticate` function when clicked
- Style it to match the existing "Sign Out" button design
- Make sure it only shows when `userData` is null

## Testing Requirements
- Verify wallet connection works with Leather wallet
- Verify wallet connection works with Xverse wallet
- Verify user's STX address displays in the navbar after connecting
- Verify sign out button works and clears user data
- Verify user data persists when refreshing the page
- Verify create pool page blocks users who aren't authenticated
- Verify market betting page blocks users who aren't authenticated

## Files to Modify
1. `web/app/components/StacksProvider.tsx`
2. `web/app/components/Navbar.tsx`

## Dependencies
All required packages are already installed:
- `@stacks/connect` ✅
- `@stacks/auth` ✅
- `lucide-react` ✅

## Reference
- Stacks authentication docs: https://docs.stacks.co/build-apps/authentication
- Current StacksProvider: `web/app/components/StacksProvider.tsx`
- Current Navbar: `web/app/components/Navbar.tsx`
