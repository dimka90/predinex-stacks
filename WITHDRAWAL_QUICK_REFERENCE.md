# 🏦 Withdrawal Functions - Quick Reference

## Public Functions (8)

### Admin Management
```clarity
(add-admin principal)           → (ok true) | (err u401)
(remove-admin principal)        → (ok true) | (err u401)
```

### Withdrawal Operations
```clarity
(request-withdrawal uint uint)  → (ok withdrawal-id) | (err code)
(cancel-withdrawal uint)        → (ok true) | (err code)
(approve-withdrawal principal uint) → (ok true) | (err code)
(reject-withdrawal principal uint)  → (ok true) | (err code)
(emergency-withdrawal uint)     → (ok amount) | (err code)
(batch-approve-withdrawals (list 10 principal) (list 10 uint)) → (ok results) | (err code)
```

---

## Read-Only Functions (11)

### Admin Checks
```clarity
(is-admin principal)            → bool
(is-owner principal)            → bool
```

### Withdrawal Info
```clarity
(get-pending-withdrawal principal uint)     → (optional withdrawal)
(get-withdrawal-history principal uint)     → (optional history)
(get-withdrawal-status principal uint)      → (ok status) | (err code)
```

### User Info
```clarity
(get-user-withdrawal-count principal)       → uint
(get-user-pending-amount principal)         → (ok uint) | (err code)
(can-withdraw principal uint uint)          → (ok eligibility) | (err code)
```

### Contract Info
```clarity
(get-total-withdrawn)           → uint
(get-withdrawal-counter)        → uint
(get-contract-balance)          → uint
```

---

## Error Codes

| Code | Constant | Meaning |
|------|----------|---------|
| u400 | ERR-INVALID-AMOUNT | Amount is invalid |
| u401 | ERR-UNAUTHORIZED | Not authorized |
| u404 | ERR-POOL-NOT-FOUND | Pool doesn't exist |
| u410 | ERR-ALREADY-CLAIMED | Already claimed |
| u411 | ERR-NO-WINNINGS | No winnings available |
| u412 | ERR-NOT-SETTLED | Pool not settled |
| u425 | ERR-WITHDRAWAL-FAILED | Withdrawal failed |
| u426 | ERR-INVALID-WITHDRAWAL | Invalid withdrawal |
| u427 | ERR-WITHDRAWAL-LOCKED | Withdrawal locked |
| u428 | ERR-INSUFFICIENT-CONTRACT-BALANCE | Insufficient balance |
| u429 | ERR-NOT-POOL-CREATOR | Not pool creator |

---

## Common Workflows

### 1. User Requests Withdrawal
```typescript
// User requests 1 STX from pool 0
const withdrawalId = await contract.call('request-withdrawal', [0, 1000000]);
console.log('Withdrawal ID:', withdrawalId);
```

### 2. Admin Approves
```typescript
// Admin approves withdrawal
await contract.call('approve-withdrawal', [userAddress, withdrawalId]);
console.log('Withdrawal approved');
```

### 3. Check Status
```typescript
// Check withdrawal status
const status = await contract.read('get-withdrawal-status', [userAddress, withdrawalId]);
console.log('Status:', status);  // "pending", "approved", "rejected", "cancelled"
```

### 4. Batch Approve
```typescript
// Approve multiple withdrawals
await contract.call('batch-approve-withdrawals', [
  [user1, user2, user3],
  [id1, id2, id3]
]);
```

### 5. Emergency Withdrawal
```typescript
// Pool creator withdraws after expiry
const amount = await contract.call('emergency-withdrawal', [poolId]);
console.log('Withdrawn:', amount);
```

---

## Validation Checklist

Before calling functions, verify:

### request-withdrawal
- [ ] Pool ID exists
- [ ] Amount > 0
- [ ] Amount <= user's bet
- [ ] Pool is settled

### approve-withdrawal
- [ ] Caller is admin or owner
- [ ] Withdrawal exists
- [ ] Withdrawal is pending
- [ ] Contract has balance

### emergency-withdrawal
- [ ] Caller is pool creator
- [ ] Pool is expired
- [ ] Pool is settled

---

## Access Control Matrix

| Function | Owner | Admin | User |
|----------|-------|-------|------|
| add-admin | ✅ | ❌ | ❌ |
| remove-admin | ✅ | ❌ | ❌ |
| request-withdrawal | ✅ | ✅ | ✅ |
| cancel-withdrawal | ✅ | ✅ | ✅* |
| approve-withdrawal | ✅ | ✅ | ❌ |
| reject-withdrawal | ✅ | ✅ | ❌ |
| emergency-withdrawal | ✅ | ❌ | ❌** |
| batch-approve-withdrawals | ✅ | ✅ | ❌ |

*User can only cancel own withdrawals
**Only pool creator can call

---

## Data Structures

### Pending Withdrawal
```clarity
{
  amount: uint,
  requested-at: uint,
  status: (string-ascii 20),
  pool-id: uint
}
```

### Withdrawal History
```clarity
{
  amount: uint,
  completed-at: uint,
  pool-id: uint
}
```

### Eligibility Check
```clarity
{
  pool-settled: bool,
  user-has-bet: bool,
  user-bet-amount: uint,
  can-withdraw: bool
}
```

---

## Status Values

| Status | Meaning |
|--------|---------|
| "pending" | Awaiting admin review |
| "approved" | Approved and funds transferred |
| "rejected" | Rejected by admin |
| "cancelled" | Cancelled by user |

---

## Tips & Best Practices

### For Users
1. ✅ Request withdrawal after pool settles
2. ✅ Check status before requesting again
3. ✅ Cancel if you change your mind
4. ✅ Wait for admin approval

### For Admins
1. ✅ Review pending withdrawals regularly
2. ✅ Use batch approval for efficiency
3. ✅ Reject invalid requests
4. ✅ Monitor contract balance

### For Developers
1. ✅ Always check `can-withdraw` before requesting
2. ✅ Handle all error codes
3. ✅ Track withdrawal history
4. ✅ Monitor contract balance
5. ✅ Implement rate limiting (optional)

---

## Testing Commands

```bash
# Deploy contract
npm run deploy:mainnet

# Generate activity
npm run generate-activity:mainnet

# Test withdrawal flow
# 1. Create pool
# 2. Place bet
# 3. Settle pool
# 4. Request withdrawal
# 5. Approve withdrawal
# 6. Verify funds transferred
```

---

## Monitoring

### Key Metrics
- Total withdrawn: `get-total-withdrawn()`
- Pending count: Count entries in `pending-withdrawals`
- Contract balance: `get-contract-balance()`
- Withdrawal rate: Approved / Total requests

### Audit Trail
- Check `withdrawal-history` for completed withdrawals
- Review `pending-withdrawals` for pending requests
- Monitor status changes
- Track timestamps

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "ERR-UNAUTHORIZED" | Check if caller is admin/owner |
| "ERR-INVALID-WITHDRAWAL" | Verify withdrawal exists and is pending |
| "ERR-INSUFFICIENT-CONTRACT-BALANCE" | Check contract has enough STX |
| "ERR-NOT-SETTLED" | Wait for pool to settle |
| "ERR-INVALID-AMOUNT" | Amount must be > 0 and <= bet |

---

## Quick Links

- 📖 Full Guide: `WITHDRAWAL_FUNCTIONS_GUIDE.md`
- 📊 Summary: `WITHDRAWAL_IMPLEMENTATION_SUMMARY.md`
- 🏗️ Architecture: `ARCHITECTURE_DIAGRAM.md`
- 📚 Main Docs: `BUILDER_CHALLENGE_GUIDE.md`

---

**Status:** ✅ Ready for Production

**Last Updated:** December 2024

**Version:** 1.0
