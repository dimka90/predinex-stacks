# Stacks Builder Challenge - Predinex Deployment Guide

## 🎯 Challenge Overview

**Week 1 (Dec 10-14): Clarity 4 Functions Challenge**

Earn leaderboard boost by:
- ✅ Deploying smart contracts to Stacks mainnet
- ✅ Using Clarity 4 functions in your contract
- ✅ Using `@stacks/connect` and `@stacks/transactions` packages
- ✅ Generating transaction activity on your contract

**Leaderboard Ranking Based On:**
1. Smart contract activity and impact
2. Package usage (`@stacks/connect`, `@stacks/transactions`)
3. GitHub contributions
4. Weekly challenges (Clarity 4 functions this week)

---

## 📋 Prerequisites

### 1. Mainnet STX Tokens
You need **0.5-1 STX** for deployment fees. Get STX from:
- **Coinbase** - https://www.coinbase.com
- **Binance** - https://www.binance.com
- **OKX** - https://www.okx.com
- **Kraken** - https://www.kraken.com

### 2. Stacks Wallet
- **Leather Wallet** - https://leather.io
- **Hiro Wallet** - https://wallet.hiro.so

### 3. Node.js
- Node.js v16+ installed
- npm or yarn package manager

---

## 🚀 Step-by-Step Deployment

### Step 1: Clone & Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd predinex-stacks

# Install dependencies
npm install
```

### Step 2: Get Your Private Key

1. Open **Leather Wallet** (or Hiro Wallet)
2. Go to **Settings** → **Secret Key** (or **Export Private Key**)
3. Copy your **64-character hex private key**
4. ⚠️ **NEVER share or commit this key!**

### Step 3: Configure Environment

```bash
# Edit .env file
nano .env
```

Update with your private key:
```env
PRIVATE_KEY=your_64_character_hex_private_key_here
STACKS_NETWORK=mainnet
WALLET_ADDRESS=your_stacks_address
```

### Step 4: Deploy to Mainnet

```bash
# Deploy to mainnet
npm run deploy:mainnet

# Or deploy to testnet first (recommended)
npm run deploy:testnet
```

You'll see output like:
```
🚀 Deploying Predinex to mainnet...
📦 Using Clarity 4 with enhanced features for Builder Challenge

✅ Contract deployed successfully!
📋 Transaction ID: abc123...
🔗 Explorer: https://explorer.hiro.so/txid/abc123...?chain=mainnet
```

### Step 5: Verify Deployment

1. Copy the **Transaction ID** from the output
2. Visit: `https://explorer.hiro.so/txid/{TX_ID}?chain=mainnet`
3. Wait for confirmation (~10 minutes)
4. Your contract address: `{YOUR_ADDRESS}.predinex-pool-{TIMESTAMP}`

---

## 💡 Clarity 4 Features Implemented

This contract uses these **Clarity 4 functions** for the Week 1 challenge:

### 1. **stx-account** - Get user balance info
```clarity
(define-read-only (validate-principal-and-get-balance (user principal))
  (let ((account-info (stx-account user)))
    { unlocked-balance: (get unlocked account-info) }
  )
)
```

### 2. **int-to-ascii** - Convert numbers to strings
```clarity
(define-read-only (get-pool-id-string (pool-id uint))
  (int-to-ascii pool-id)
)
```

### 3. **to-consensus-buff?** - Serialize data
```clarity
(define-read-only (serialize-pool-totals (pool-id uint))
  (to-consensus-buff? { total-a: ..., total-b: ... })
)
```

### 4. **Enhanced validation** - Multiple checks
```clarity
(define-public (place-bet-validated (pool-id uint) (outcome uint) (amount uint))
  ;; Comprehensive validation using Clarity 4 features
)
```

---

## 📊 Generate Activity (Boost Ranking)

After deployment, generate transactions to boost your leaderboard ranking:

### Create Pools
```bash
npm run interact
# Select: Create Pool
```

### Place Bets
```bash
npm run interact
# Select: Place Bet
```

### Settle Markets
```bash
npm run interact
# Select: Settle Pool
```

**More transactions = Higher ranking!**

---

## 🔗 Share Your Deployment

### 1. Update README
Add your mainnet contract address:
```markdown
## Mainnet Deployment

**Contract Address:** `SPSHVWJVD3NP8G7ZM82KTHB91HKCMNTY3BKKNE5V.predinex-pool-1702000000`

**Explorer:** https://explorer.hiro.so/address/SPSHVWJVD3NP8G7ZM82KTHB91HKCMNTY3BKKNE5V?chain=mainnet
```

### 2. Push to GitHub
```bash
git add .
git commit -m "Deploy Predinex to mainnet with Clarity 4 features"
git push origin main
```

### 3. Register on Leaderboard
- Visit: https://stacks.org/builder-challenge
- Connect your GitHub account
- Your contract activity will be tracked automatically

---

## 📦 Package Requirements

This project uses the required Stacks packages:

```json
{
  "@stacks/transactions": "^7.2.0",
  "@stacks/network": "^7.2.0",
  "@stacks/clarinet-sdk": "^3.9.0"
}
```

For frontend integration, add:
```bash
npm install @stacks/connect
```

---

## 🧪 Testing Before Mainnet

### Run Tests
```bash
npm run test
```

### Deploy to Testnet First
```bash
npm run deploy:testnet
```

### Interact with Testnet Contract
```bash
STACKS_NETWORK=testnet npm run interact
```

---

## ⚠️ Security Checklist

- ✅ `.env` is in `.gitignore` (never commit private keys)
- ✅ Private key is 64 hex characters
- ✅ Using mainnet address for mainnet deployment
- ✅ Tested on testnet before mainnet
- ✅ Contract code reviewed for security

---

## 🆘 Troubleshooting

### "DEPLOYER_KEY environment variable is required"
```bash
# Make sure .env file exists and has PRIVATE_KEY set
cat .env
```

### "Insufficient balance"
- You need at least 0.5 STX on mainnet
- Check balance: https://explorer.hiro.so/address/{YOUR_ADDRESS}?chain=mainnet

### "Transaction failed"
- Check fee is sufficient (150000 microstacks)
- Verify contract syntax: `npm run test`
- Try testnet first: `npm run deploy:testnet`

### "Contract not found after deployment"
- Wait 10+ minutes for confirmation
- Check explorer: https://explorer.hiro.so/txid/{TX_ID}?chain=mainnet

---

## 📚 Resources

- **Stacks Docs:** https://docs.stacks.co
- **Clarity Reference:** https://docs.stacks.co/clarity
- **Builder Challenge:** https://stacks.org/builder-challenge
- **Explorer:** https://explorer.hiro.so
- **Leather Wallet:** https://leather.io

---

## 🎉 Next Steps

1. ✅ Deploy to mainnet
2. ✅ Generate activity
3. ✅ Share on GitHub
4. ✅ Check leaderboard
5. 🔄 Prepare for Week 2 challenge (details coming soon)

Good luck! 🚀
