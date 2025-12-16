# Add Claim Winnings UI

## Description
Users who have won bets need a way to claim their winnings from settled pools. Currently, there's no UI for this. The contract has the `claim-winnings` function, but users can't easily access it from the frontend.

## What's Missing
- A way for users to see which pools they've won
- A button to claim winnings from settled pools
- Confirmation that winnings were claimed successfully
- Display of claimed vs unclaimed winnings

## What Needs to Be Done

### 1. Update Market Detail Page
**File:** `web/app/markets/[id]/page.tsx`

- When a pool is settled, check if the current user has a winning bet
- If user has a winning bet and hasn't claimed yet, show a "Claim Winnings" button
- If user has already claimed, show a "Winnings Claimed" message
- If user didn't win, show a "You didn't win this pool" message

### 2. Implement Claim Winnings Function
- Create a function that calls the `claim-winnings` contract function
- Pass the pool ID to the function
- Handle successful claims with a success message
- Handle errors gracefully
- Show loading state while transaction is pending

### 3. Add Claim Winnings Button UI
- Button should only appear when:
  - Pool is settled
  - User has a winning bet
  - User hasn't already claimed
- Button should be styled distinctly (e.g., green for success)
- Show transaction ID after successful claim
- Allow user to view transaction on explorer

### 4. Display Winnings Amount
- Calculate how much the user will receive
- Show this amount before they claim
- Update display after claiming

### 5. Add to Dashboard
**File:** `web/app/dashboard/page.tsx` (if created)

- Show unclaimed winnings section
- List all pools with unclaimed winnings
- Add "Claim" button for each
- Show claimed winnings separately

## Acceptance Criteria
- [ ] Settled pools show claim winnings UI
- [ ] Claim button only appears for winning bets
- [ ] Claim button only appears if not already claimed
- [ ] Clicking claim opens wallet signature dialog
- [ ] Transaction is sent to contract
- [ ] Success message shows after claiming
- [ ] Transaction ID is displayed
- [ ] User can view transaction on explorer
- [ ] Claimed status updates immediately
- [ ] Error handling works for failed claims

## Testing
- [ ] Test claiming winnings from a settled pool
- [ ] Test that claimed pools show "Winnings Claimed"
- [ ] Test that losing bets don't show claim button
- [ ] Test that already claimed winnings don't show button
- [ ] Test error handling when claim fails
- [ ] Test transaction appears on explorer

## Resources
- Market detail page: `web/app/markets/[id]/page.tsx`
- Contract claim-winnings function: `contracts/predinex-pool.clar`
- Stacks transactions: `@stacks/transactions`

## Difficulty
🟡 Medium - Requires contract interaction and state management
