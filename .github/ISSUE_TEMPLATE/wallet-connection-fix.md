# Fix Wallet Connection Flow in StacksProvider

## Description
The wallet connection flow is incomplete. Users cannot connect their wallets because the `authenticate` function is missing from StacksProvider. This blocks all user interactions with the contract.

## What's Missing
- The `authenticate` function in StacksProvider that opens the wallet connection dialog
- The "Connect Wallet" button in the Navbar
- The connection between these two components

## What Needs to Be Done

### 1. Update StacksProvider (`web/app/components/StacksProvider.tsx`)
- Import `showConnect` from `@stacks/connect`
- Create an `authenticate` function that opens the wallet connection dialog
- Handle successful authentication by loading and storing user data
- Handle when user cancels the connection
- Handle any errors that occur
- Add the `authenticate` function to the context so other components can use it
- Update the TypeScript interface to include `authenticate`

### 2. Update Navbar (`web/app/components/Navbar.tsx`)
- Get the `authenticate` function from the useStacks hook
- Add a "Connect Wallet" button that shows when user is not logged in
- Make the button call `authenticate()` when clicked
- Style it to match the existing design

## Acceptance Criteria
- [ ] Users can click "Connect Wallet" button in navbar
- [ ] Wallet connection dialog opens when button is clicked
- [ ] User can connect with Leather wallet
- [ ] User can connect with Xverse wallet
- [ ] User's STX address displays in navbar after connecting
- [ ] User data persists when page is refreshed
- [ ] Sign out button works and clears user data
- [ ] Create pool page works for authenticated users
- [ ] Market betting works for authenticated users

## Testing
- [ ] Test with Leather wallet
- [ ] Test with Xverse wallet
- [ ] Test that user data persists on page refresh
- [ ] Test that sign out clears all data
- [ ] Test that unauthenticated users see "Connect Wallet" button

## Resources
- Stacks authentication: https://docs.stacks.co/build-apps/authentication
- StacksProvider file: `web/app/components/StacksProvider.tsx`
- Navbar file: `web/app/components/Navbar.tsx`

## Difficulty
🟡 Medium
