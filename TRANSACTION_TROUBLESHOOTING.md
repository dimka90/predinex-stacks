# Transaction Troubleshooting Guide

## Problem: "Transaction Rejected" Errors

### Symptoms
```
Tx 1 failed: transaction rejected
Tx 2 failed: transaction rejected
Tx 3 failed: transaction rejected
```

### Root Causes

#### 1. **Nonce Conflicts** (Most Common)
When you send multiple transactions too quickly, they get the same nonce, causing rejections.

**Solution:**
- Increase delay between transactions to 3+ seconds
- Explicitly set nonce in transaction options
- Use the updated `interact.ts` script

#### 2. **Insufficient Balance**
You don't have enough STX to cover transaction fees.

**Check your balance:**
```bash
npx tsx scripts/diagnose-nonce.ts
```

**Solution:**
- Get more STX from faucet (testnet) or exchange (mainnet)
- Reduce number of transactions
- Increase fee to ensure inclusion

#### 3. **Rate Limiting**
Hiro API has rate limits on free tier.

**Solution:**
- Increase delay between transactions
- Use paid API tier
- Batch transactions more efficiently

#### 4. **Invalid Contract/Function**
Contract address or function name is incorrect.

**Check:**
```bash
# Verify in .env
cat .env | grep CONTRACT
cat .env | grep WALLET_ADDRESS
```

**Solution:**
- Verify contract address is correct
- Verify contract name is correct
- Verify function exists in contract

### Quick Fixes

#### Fix 1: Run Diagnostic
```bash
npx tsx scripts/diagnose-nonce.ts
```

This will show:
- Current nonce
- Account balance
- Recent transactions
- Recommendations

#### Fix 2: Use Updated Script
```bash
STACKS_NETWORK="mainnet" npx tsx scripts/interact.ts
```

The updated script:
- ✅ Manages nonce properly
- ✅ Fetches fresh nonce on conflicts
- ✅ Uses 3-second delays
- ✅ Reduces to 50 transactions (saves STX)
- ✅ Shows success/failure stats

#### Fix 3: Reduce Transaction Count
Edit `scripts/interact.ts` and change:
```typescript
const TOTAL_TXS = 50; // Reduced from 125
```

#### Fix 4: Increase Delays
Edit `scripts/interact.ts` and change:
```typescript
const DELAY_MS = 5000; // Increased from 3000 (5 seconds)
```

### Step-by-Step Troubleshooting

1. **Check Balance**
   ```bash
   npx tsx scripts/diagnose-nonce.ts
   ```
   - Need at least 0.1 STX per transaction
   - You have 10 STX, so can do ~100 transactions

2. **Check Nonce**
   ```bash
   npx tsx scripts/diagnose-nonce.ts
   ```
   - Note the current nonce
   - Next transaction should use this nonce

3. **Run with Verbose Output**
   ```bash
   STACKS_NETWORK="mainnet" npx tsx scripts/interact.ts 2>&1 | tee interaction.log
   ```
   - Saves output to file for analysis

4. **Check Recent Transactions**
   - Visit: https://explorer.hiro.so/address/SPSHVWJVD3NP8G7ZM82KTHB91HKCMNTY3BKKNE5V
   - Look for failed transactions
   - Check error messages

5. **Wait and Retry**
   - Wait 5 minutes
   - Run diagnostic again
   - Retry with updated script

### Common Error Messages

#### "transaction rejected"
- **Cause**: Nonce conflict or invalid transaction
- **Fix**: Use updated script with nonce management

#### "Per-minute rate limit exceeded"
- **Cause**: Too many API requests
- **Fix**: Increase delay to 5+ seconds

#### "insufficient balance"
- **Cause**: Not enough STX
- **Fix**: Get more STX or reduce transaction count

#### "Error fetching nonce"
- **Cause**: API error or network issue
- **Fix**: Wait and retry, check internet connection

### Prevention Tips

1. **Always use explicit nonce**
   ```typescript
   nonce: currentNonce,
   ```

2. **Use adequate delays**
   - Minimum: 2 seconds
   - Recommended: 3-5 seconds
   - Safe: 5+ seconds

3. **Monitor balance**
   - Check before running script
   - Keep buffer for fees
   - Don't spend all STX

4. **Test on testnet first**
   ```bash
   STACKS_NETWORK="testnet" npx tsx scripts/interact.ts
   ```

5. **Use diagnostic tool regularly**
   ```bash
   npx tsx scripts/diagnose-nonce.ts
   ```

### Advanced Debugging

#### Enable Verbose Logging
Add to `interact.ts`:
```typescript
console.log('Transaction options:', txOptions);
console.log('Response:', broadcastResponse);
```

#### Check Transaction Details
```bash
# Replace with actual TX ID
curl https://api.mainnet.hiro.so/v2/transactions/54f649c8fe0dceb1a3c1ae9644e572ecc4bb9a7524d6a5f7f5a817becc9aa0ea
```

#### Monitor in Real-time
```bash
# Watch for new transactions
watch -n 5 'npx tsx scripts/diagnose-nonce.ts'
```

### When to Contact Support

If you've tried all fixes and still have issues:

1. Collect diagnostic info:
   ```bash
   npx tsx scripts/diagnose-nonce.ts > diagnostic.txt
   ```

2. Save transaction log:
   ```bash
   STACKS_NETWORK="mainnet" npx tsx scripts/interact.ts 2>&1 | tee tx.log
   ```

3. Include:
   - Diagnostic output
   - Transaction log
   - Error messages
   - Your wallet address
   - Network (mainnet/testnet)

### Resources

- **Stacks Docs**: https://docs.stacks.co
- **Hiro API Docs**: https://docs.hiro.so
- **Explorer**: https://explorer.hiro.so
- **Faucet (Testnet)**: https://testnet.faucet.stacks.org

### Summary

| Issue | Solution |
|-------|----------|
| Transaction rejected | Use updated script with nonce management |
| Rate limiting | Increase delay to 5+ seconds |
| Insufficient balance | Get more STX or reduce transactions |
| Nonce conflicts | Explicitly set nonce, increase delays |
| API errors | Wait and retry, check connection |

---

**Last Updated**: December 20, 2025
**Script Version**: 2.0 (with nonce management)
