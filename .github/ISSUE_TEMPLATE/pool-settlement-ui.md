# Add Pool Settlement UI for Pool Creators

## Description
Pool creators need a way to settle their pools and declare a winner. Currently, there's no UI for this. The contract has the `settle-pool` function, but only the pool creator can access it, and there's no frontend interface.

## What's Missing
- A way for pool creators to see their created pools
- A settlement button that only appears for the pool creator
- A way to select the winning outcome
- Confirmation before settling
- Success/error feedback after settling

## What Needs to Be Done

### 1. Update Market Detail Page
**File:** `web/app/markets/[id]/page.tsx`

- Check if the current user is the pool creator
- If user is creator and pool is not settled, show settlement UI
- If pool is already settled, show the winning outcome

### 2. Add Settlement Section
- Display a "Settlement" section for pool creators only
- Show both outcomes as options
- Allow creator to select which outcome won
- Show a warning that this action is permanent

### 3. Implement Settlement Function
- Create a function that calls the `settle-pool` contract function
- Pass the pool ID and winning outcome
- Handle successful settlement with confirmation message
- Handle errors gracefully
- Show loading state while transaction is pending

### 4. Add Settlement Button
- Button should only appear for pool creator
- Button should be disabled if pool is already settled
- Button should show loading state during transaction
- After settlement, button should be disabled and show "Pool Settled"

### 5. Add Confirmation Dialog
- Before settling, show a confirmation dialog
- Warn that this action cannot be undone
- Show which outcome will be declared as winner
- Require creator to confirm

### 6. Display Settlement Info
- Show when pool was settled
- Show who settled it (should be current user)
- Show the winning outcome clearly

## Acceptance Criteria
- [ ] Settlement UI only appears for pool creator
- [ ] Settlement UI only appears for unsettled pools
- [ ] Creator can select winning outcome
- [ ] Confirmation dialog appears before settling
- [ ] Settlement transaction is sent to contract
- [ ] Success message shows after settling
- [ ] Pool status updates to "Settled"
- [ ] Winning outcome is displayed
- [ ] Settlement button is disabled after settling
- [ ] Error handling works for failed settlements

## Testing
- [ ] Test that only pool creator sees settlement UI
- [ ] Test that settlement UI doesn't appear for other users
- [ ] Test that settlement UI doesn't appear for settled pools
- [ ] Test confirmation dialog appears
- [ ] Test settlement transaction is sent
- [ ] Test pool status updates after settlement
- [ ] Test winning outcome displays correctly
- [ ] Test error handling when settlement fails

## Resources
- Market detail page: `web/app/markets/[id]/page.tsx`
- Contract settle-pool function: `contracts/predinex-pool.clar`
- Stacks transactions: `@stacks/transactions`

## Difficulty
🟡 Medium - Requires contract interaction and access control
