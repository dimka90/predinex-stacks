# 📋 Command Reference - Predinex Deployment

## 🔧 Setup Commands

```bash
# Install dependencies
npm install

# Configure environment
nano .env
# Add: PRIVATE_KEY=your_64_hex_chars
# Add: STACKS_NETWORK=mainnet
```

---

## 🧪 Testing Commands

```bash
# Run all tests
npm run test

# Run tests with coverage report
npm run test:report

# Watch mode (auto-run on file changes)
npm run test:watch
```

---

## 🚀 Deployment Commands

### Deploy to Mainnet
```bash
npm run deploy:mainnet
```

### Deploy to Testnet
```bash
npm run deploy:testnet
```

### Deploy with Custom Network
```bash
STACKS_NETWORK=mainnet npm run deploy
STACKS_NETWORK=testnet npm run deploy
```

---

## 💰 Activity Generation Commands

### Interactive Activity Generator (Mainnet)
```bash
npm run generate-activity:mainnet
```

### Interactive Activity Generator (Testnet)
```bash
npm run generate-activity:testnet
```

### Legacy Interact Script
```bash
npm run interact
```

---

## 📊 Monitoring Commands

### Check Contract on Explorer
```bash
# After deployment, visit:
https://explorer.hiro.so/txid/{TX_ID}?chain=mainnet
```

### View Your Address
```bash
# Check your wallet address:
https://explorer.hiro.so/address/{YOUR_ADDRESS}?chain=mainnet
```

---

## 🔄 Full Deployment Workflow

### Step 1: Setup (One-time)
```bash
npm install
nano .env
```

### Step 2: Test Locally
```bash
npm run test
```

### Step 3: Deploy to Testnet (Optional but Recommended)
```bash
npm run deploy:testnet
# Wait for confirmation (~10 minutes)
# Check explorer link in output
```

### Step 4: Deploy to Mainnet
```bash
npm run deploy:mainnet
# Copy Transaction ID from output
# Wait for confirmation (~10 minutes)
```

### Step 5: Generate Activity
```bash
npm run generate-activity:mainnet
# Create 3-5 pools
# Place 5-10 bets
# Settle 2-3 pools
```

### Step 6: Update GitHub
```bash
git add .
git commit -m "Deploy Predinex to mainnet with Clarity 4 features"
git push origin main
```

### Step 7: Register on Leaderboard
```
Visit: https://stacks.org/builder-challenge
Connect GitHub account
```

---

## 🎯 Quick Commands by Goal

### "I want to deploy to mainnet NOW"
```bash
npm install
nano .env  # Add PRIVATE_KEY
npm run deploy:mainnet
```

### "I want to test first"
```bash
npm install
npm run test
npm run deploy:testnet
npm run deploy:mainnet
```

### "I want to generate activity"
```bash
npm run generate-activity:mainnet
# Follow prompts to create pools, place bets, settle
```

### "I want to check my contract"
```bash
# After deployment, visit:
https://explorer.hiro.so/address/{YOUR_ADDRESS}?chain=mainnet
```

### "I want to see all available commands"
```bash
npm run
```

---

## 🔐 Environment Variables

### Required
```env
PRIVATE_KEY=your_64_character_hex_private_key
STACKS_NETWORK=mainnet
```

### Optional
```env
WALLET_ADDRESS=your_stacks_address
CONTRACT_NAME=predinex-pool
```

---

## 📝 Script Details

### `npm run deploy:mainnet`
- Deploys contract to Stacks mainnet
- Uses PRIVATE_KEY from .env
- Sets fee to 150,000 microstacks
- Returns transaction ID and explorer link

### `npm run deploy:testnet`
- Deploys contract to Stacks testnet
- Uses PRIVATE_KEY from .env
- Sets fee to 150,000 microstacks
- Returns transaction ID and explorer link

### `npm run generate-activity:mainnet`
- Interactive CLI for contract interaction
- Create pools
- Place bets
- Settle markets
- Claim winnings

### `npm run test`
- Runs Vitest test suite
- Tests all contract functions
- Validates Clarity 4 features

### `npm run test:report`
- Runs tests with coverage report
- Shows code coverage percentage
- Generates detailed report

---

## 🆘 Troubleshooting Commands

### Check if .env exists
```bash
cat .env
```

### Check Node version
```bash
node --version
# Should be v16+
```

### Check npm version
```bash
npm --version
```

### Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Clear cache
```bash
npm cache clean --force
```

### Run specific test file
```bash
npm run test -- tests/predinex-pool.test.ts
```

---

## 📊 Expected Output

### Successful Deployment
```
🚀 Deploying Predinex to mainnet...
📦 Using Clarity 4 with enhanced features for Builder Challenge

✅ Contract deployed successfully!
📋 Transaction ID: abc123def456...
🔗 Explorer: https://explorer.hiro.so/txid/abc123def456...?chain=mainnet

📝 Contract Name: predinex-pool-1702000000

💡 Next steps:
   1. Wait for transaction confirmation (~10 minutes)
   2. Share your contract address on GitHub
   3. Generate activity by calling contract functions
   4. Check leaderboard at https://stacks.org/builder-challenge
```

### Successful Activity Generation
```
🎯 Predinex Activity Generator
📍 Network: Mainnet
📦 Contract: SPSHVWJVD3NP8G7ZM82KTHB91HKCMNTY3BKKNE5V.predinex-pool

Choose an action:
1. Create Pool
2. Place Bet
3. Settle Pool
4. Exit

✅ Pool created!
📋 TX ID: xyz789...
🔗 https://explorer.hiro.so/txid/xyz789...?chain=mainnet
```

---

## 🎯 Command Cheat Sheet

| Goal | Command |
|------|---------|
| Setup | `npm install && nano .env` |
| Test | `npm run test` |
| Deploy Mainnet | `npm run deploy:mainnet` |
| Deploy Testnet | `npm run deploy:testnet` |
| Generate Activity | `npm run generate-activity:mainnet` |
| View All Commands | `npm run` |
| Check Coverage | `npm run test:report` |

---

**Ready? Start with:** `npm install` 🚀
