# Withdrawal System Analysis

## Current Withdrawal Flow

### Who Can Withdraw Your Deposited Money?

**Only YOU can initiate a withdrawal request**, but **an Admin or the Contract Owner must approve it**.

### Step-by-Step Process:

1. **You (the bettor) request withdrawal:**
   - Call `request-withdrawal(pool-id, amount)`
   - Requirements:
     - Pool must be settled
     - Amount must be ≤ your total bet in that pool
   - Status: "pending"

2. **Admin or Contract Owner approves:**
   - Call `approve-withdrawal(your-address, withdrawal-id)`
   - Only admins or contract owner can do this
   - Funds are transferred to you
   - Status: "approved"

### Current Setup:

- **CONTRACT-OWNER**: `tx-sender` (whoever deployed the contract)
  - Your wallet: `SPSHVWJVD3NP8G7ZM82KTHB91HKCMNTY3BKKNE5V`
  - **You ARE the contract owner!** ✅

- **Admins**: Empty by default
  - No admins are currently set up
  - You can add admins using `add-admin(admin-principal)`

### The Problem:

Since you are the contract owner, **you can approve your own withdrawals**! 

However, there's a catch:
- The pool must be **settled** before you can request a withdrawal
- You need to call `settle-pool` or `settle-pool-enhanced` first
- Only the pool creator can settle the pool

### Solution:

To withdraw your bets:

1. **Settle the pool** (as pool creator):
   ```
   settle-pool(pool-id, winning-outcome)
   ```

2. **Request withdrawal** (as bettor):
   ```
   request-withdrawal(pool-id, amount)
   ```

3. **Approve withdrawal** (as contract owner):
   ```
   approve-withdrawal(your-address, withdrawal-id)
   ```

### Alternative: Direct Refund Function

I can add a simpler `refund-bet` function that lets you directly withdraw without needing settlement. This would be better for testing.

Would you like me to add this?
