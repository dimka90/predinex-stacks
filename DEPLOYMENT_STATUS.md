# Predinex Deployment Status

## 🎯 Deployment Progress

### ✅ Step 1: Oracle Registry (COMPLETED)
- **Status**: Transaction Sent
- **TX ID**: `917fa7ef6e79c0f3b32102158e766570e95f5968f030f39d08e217e2ca45a590`
- **Contract Name**: `predinex-oracle-registry-1769574272753`
- **Address**: `SP2WWKKF25SED3K5P6ETY7MDDNBQH50GPSP8EJM8N.predinex-oracle-registry-1769574272753`
- **Explorer**: https://explorer.hiro.so/txid/917fa7ef6e79c0f3b32102158e766570e95f5968f030f39d08e217e2ca45a590?chain=mainnet
- **Wait Time**: 15 minutes (ongoing)

### 🔄 Step 2: Liquidity Incentives (IN PROGRESS)
- **Status**: Waiting for oracle-registry confirmation, then will auto-deploy
- **Expected Start**: ~05:38 UTC (15 min from oracle deployment)

### ⏳ Step 3: Predinex Pool (PENDING)
- **Status**: Awaiting completion of Steps 1 & 2
- **Depends On**: 
  - `predinex-oracle-registry-1769574272753`
  - `liquidity-incentives-<timestamp>` (to be determined)

### ⏳ Step 4: Resolution Engine (PENDING - OPTIONAL)
- **Status**: Can be deployed after oracle-registry confirms
- **Depends On**: `predinex-oracle-registry-1769574272753`

---

## 🚨 Why Your Previous Deployments Failed

Your `predinex-pool` contract deployment failed with:
```
VM Error: use of unresolved contract 'SP2WWKKF25SED3K5P6ETY7MDDNBQH50GPSP8EJM8N.predinex-oracle-registry'
```

**Root Cause**: Clarity smart contracts that reference other contracts with relative imports (`.contract-name`) require those dependencies to be deployed first. Your pool contract tried to call:
- `.predinex-oracle-registry` (line 101)
- `.liquidity-incentives` (lines 137, 181)

But neither existed on mainnet yet!

---

## ✅ Solution Being Implemented

Deploying contracts in correct dependency order:
1. **Oracle Registry** → No dependencies ✅ 
2. **Liquidity Incentives** → No dependencies 🔄
3. **Predinex Pool** → Depends on 1 & 2 ⏳
4. **Resolution Engine** → Depends on 1 ⏳

---

## 📋 Next Steps

### After All Deployments Complete:

1. **Update .env file** with deployed contract names:
   ```bash
   # Add these to your .env
   ORACLE_REGISTRY_CONTRACT=predinex-oracle-registry-1769574272753
   LIQUIDITY_INCENTIVES_CONTRACT=liquidity-incentives-<timestamp>
   MAIN_POOL_CONTRACT=predinex-pool-<timestamp>
   ```

2. **Verify all deployments on explorer**:
   - Check each transaction shows "Success" status
   - Confirm contracts are visible and callable

3. **Test the contracts**:
   ```bash
   npm run interact
   ```

4. **Update frontend** with new contract addresses

---

## 🛠 Deployment Scripts Created

### Single Contract Deployment:
```bash
PRIVATE_KEY="${PRIVATE_KEY}" npx tsx scripts/deploy-single.ts <contract-name>
```

###Reliable Single Deployment:
```bash
PRIVATE_KEY="${PRIVATE_KEY}" npx tsx scripts/deploy-reliable.ts
```

### Full Auto-Deploy (all contracts):
```bash
PRIVATE_KEY="${PRIVATE_KEY}" npx tsx scripts/deploy-all-contracts.ts
```

---

## ⏰ Timeline

- **05:24 UTC**: Oracle Registry deployed 
- **05:39 UTC**: Oracle Registry should be confirmed
- **05:39 UTC**: Liquidity Incentives will deploy (auto)
- **05:54 UTC**: Liquidity Incentives should be confirmed
- **05:55 UTC**: Ready to deploy Predinex Pool

**Total Time**: ~30-40 minutes for all dependencies

---

## 💡 Lessons Learned

1. **Always check contract dependencies** before deployment
2. **Deploy in order**: Dependencies first, then contracts that use them
3. **Wait for confirmation**: Each contract must be mined before deploying the next
4. **Use high fees** (1 STX) for reliable mainnet deployment
5. **Monitor transactions**: Check explorer links for confirmation

---

## 🆘 If Something Fails

If any deployment fails with "abort_by_response":
1. Wait 30 minutes for mempool to clear
2. Check if previous transactions confirmed
3. Re-run the specific failed deployment
4. DO NOT try to deploy the next contract until dependencies succeed

---

*Last Updated: 2026-01-28 05:25 UTC*
