# Add User Dashboard Page

## Description
Users need a dashboard to view their activity on the platform. Currently, there's no way for users to see their active bets, winnings, or betting history. This is essential for user engagement and tracking their positions.

## What's Missing
- A dashboard page at `/dashboard`
- Display of user's active bets across all pools
- Display of user's winnings from settled pools
- Display of user's betting history
- Summary stats (total bet, total winnings, win rate)

## What Needs to Be Done

### 1. Create Dashboard Page
**File:** `web/app/dashboard/page.tsx`

- Create a new page component for the dashboard
- Add the Navbar component at the top
- Require user authentication (redirect to home if not logged in)
- Display a welcome message with the user's address

### 2. Display User's Active Bets
- Fetch all pools from the contract
- For each pool, check if the current user has placed a bet
- Show only unsettled pools where the user has bets
- Display for each active bet:
  - Pool title
  - Amount bet on each outcome
  - Current odds
  - Link to the pool details page

### 3. Display User's Winnings
- Fetch all settled pools
- Check which ones the user has bets in
- Show pools where the user bet on the winning outcome
- Display for each winning bet:
  - Pool title
  - Amount won
  - Status (claimed or unclaimed)
  - Button to claim winnings if not already claimed

### 4. Display Betting History
- Show all pools the user has participated in (both settled and active)
- Display in a table or list with:
  - Pool title
  - Amount bet
  - Outcome bet on
  - Pool status (active/settled)
  - Winnings (if settled)

### 5. Add Summary Stats
- Total amount bet across all pools
- Total winnings claimed
- Number of active bets
- Number of settled bets
- Win rate percentage

### 6. Add Navigation Link
**File:** `web/app/components/Navbar.tsx`

- Add a "Dashboard" link in the navbar that appears when user is authenticated
- Link should go to `/dashboard`

## Acceptance Criteria
- [ ] Dashboard page exists at `/dashboard`
- [ ] Page requires user authentication
- [ ] Active bets section displays all unsettled pools user has bets in
- [ ] Winnings section displays settled pools with winning bets
- [ ] Betting history shows all user's bets
- [ ] Summary stats are calculated and displayed correctly
- [ ] Dashboard link appears in navbar when authenticated
- [ ] All data updates when user places new bets
- [ ] Claim winnings button works for unclaimed winnings

## Testing
- [ ] Test that unauthenticated users are redirected
- [ ] Test that active bets display correctly
- [ ] Test that winnings display correctly
- [ ] Test that betting history is complete
- [ ] Test that stats are accurate
- [ ] Test that new bets appear in dashboard immediately
- [ ] Test that settled pools move to winnings section

## Resources
- Stacks API utilities: `web/app/lib/stacks-api.ts`
- Market detail page (reference): `web/app/markets/[id]/page.tsx`
- Navbar component: `web/app/components/Navbar.tsx`

## Difficulty
🟡 Medium - Requires fetching and filtering data from multiple pools
