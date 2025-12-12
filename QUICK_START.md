# 🚀 Quick Start - Predinex Mainnet Deployment

## 1️⃣ Setup (2 minutes)

```bash
# Install dependencies
npm install

# Edit .env with your private key
nano .env
# Set: PRIVATE_KEY=your_64_hex_chars
# Set: STACKS_NETWORK=mainnet
```

## 2️⃣ Deploy (5 minutes)

```bash
# Deploy to mainnet
npm run deploy:mainnet
```

**You'll get:**
- ✅ Transaction ID
- ✅ Explorer link
- ✅ Contract address

## 3️⃣ Generate Activity (Boost Ranking)

```bash
# Interactive activity generator
npm run generate-activity:mainnet

# Or use the interact script
npm run interact
```

**Actions:**
- Create pools
- Place bets
- Settle markets
- Claim winnings

## 4️⃣ Share & Register

1. **Update README** with your contract address
2. **Push to GitHub**
3. **Register** at https://stacks.org/builder-challenge

---

## 📊 Clarity 4 Features Used

✅ `stx-account` - Balance checking  
✅ `int-to-ascii` - Number formatting  
✅ `to-consensus-buff?` - Data serialization  
✅ Enhanced validation functions  

---

## 🔗 Useful Links

| Link | Purpose |
|------|---------|
| https://explorer.hiro.so | View transactions |
| https://stacks.org/builder-challenge | Leaderboard |
| https://leather.io | Get wallet |
| https://docs.stacks.co | Documentation |

---

## ⚠️ Important

- **Never commit `.env`** (already in .gitignore)
- **Need 0.5+ STX** on mainnet for fees
- **Wait 10+ minutes** for confirmation
- **Test on testnet first** if unsure

---

## 🆘 Help

```bash
# Run tests
npm run test

# Deploy to testnet first
npm run deploy:testnet

# Check contract syntax
npm run test:report
```

---

**Ready? Run:** `npm run deploy:mainnet` 🎉
