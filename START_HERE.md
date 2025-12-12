# 🚀 START HERE - Predinex Mainnet Deployment

## Welcome! 👋

You're about to deploy **Predinex** to the Stacks mainnet and compete in the **Builder Challenge Week 1**.

This guide will get you deployed in **less than 15 minutes**.

---

## ⏱️ 3-Step Deployment (15 minutes)

### 1️⃣ SETUP (2 minutes)

```bash
# Install dependencies
npm install

# Open .env file and add your private key
nano .env
```

**In .env, add:**
```env
PRIVATE_KEY=your_64_character_hex_private_key_here
STACKS_NETWORK=mainnet
```

**Where to get your private key:**
1. Open Leather Wallet (or Hiro Wallet)
2. Go to Settings → Secret Key
3. Copy the 64-character hex string
4. Paste into .env

### 2️⃣ DEPLOY (5 minutes)

```bash
npm run deploy:mainnet
```

**You'll see:**
```
✅ Contract deployed successfully!
📋 Transaction ID: abc123...
🔗 Explorer: https://explorer.hiro.so/txid/abc123...?chain=mainnet
```

**Save the Transaction ID!** You'll need it to verify deployment.

### 3️⃣ GENERATE ACTIVITY (8 minutes)

```bash
npm run generate-activity:mainnet
```

**Follow the prompts:**
- Create 3-5 pools
- Place 5-10 bets
- Settle 2-3 pools

**This boosts your leaderboard ranking!**

---

## ✅ That's It!

You're now:
- ✅ Deployed to mainnet
- ✅ Using Clarity 4 functions
- ✅ Generating transaction activity
- ✅ Competing on the leaderboard

---

## 📊 What Happens Next

### Immediately
- Transaction broadcasts to network
- Explorer shows your transaction
- Contract address is generated

### In 10 minutes
- Transaction confirmed
- Contract is live
- You can start interacting

### In 1 hour
- Activity appears on leaderboard
- Your ranking updates
- Points accumulate

### By end of week
- Final leaderboard rankings
- Week 1 challenge complete
- Week 2 challenge announced

---

## 🎯 Leaderboard Points

| Activity | Points |
|----------|--------|
| Deploy contract | +100 |
| Use Clarity 4 | +50 |
| Per transaction | +10 |
| GitHub visibility | +25 |

**Your estimated score: 200-500 points**

---

## 📚 Need More Help?

| Question | Document |
|----------|----------|
| "How do I deploy?" | `QUICK_START.md` |
| "What are all the steps?" | `BUILDER_CHALLENGE_GUIDE.md` |
| "What commands can I run?" | `COMMANDS.md` |
| "Is everything ready?" | `DEPLOYMENT_READY.md` |
| "Full overview?" | `BUILDER_CHALLENGE_SUMMARY.md` |

---

## ⚠️ Important Notes

### Before You Deploy
- ✅ You need **0.5+ STX** on mainnet
- ✅ Private key is **64 hex characters**
- ✅ `.env` is **already in .gitignore** (safe)
- ✅ Never share your private key

### After You Deploy
- ✅ Wait **10+ minutes** for confirmation
- ✅ Check explorer link from output
- ✅ Generate activity to boost ranking
- ✅ Push to GitHub to track contributions

---

## 🔗 Useful Links

- **Get STX:** https://www.coinbase.com
- **Wallet:** https://leather.io
- **Explorer:** https://explorer.hiro.so
- **Leaderboard:** https://stacks.org/builder-challenge
- **Docs:** https://docs.stacks.co

---

## 🚀 Ready?

### Run This Now:

```bash
npm install
nano .env
npm run deploy:mainnet
```

### Then This:

```bash
npm run generate-activity:mainnet
```

### Then This:

```bash
git add .
git commit -m "Deploy Predinex to mainnet"
git push origin main
```

---

## 💡 Pro Tips

1. **Deploy early** - Get on leaderboard ASAP
2. **Generate activity** - More transactions = higher ranking
3. **Share on Twitter** - Use #StacksBuilder hashtag
4. **Join Discord** - Get help from community
5. **Prepare for Week 2** - Details coming soon

---

## 🎉 Success!

Once deployed, you'll have:
- ✅ Live prediction market on mainnet
- ✅ Clarity 4 functions in production
- ✅ Transaction activity recorded
- ✅ Leaderboard ranking
- ✅ GitHub visibility

---

## 🆘 Stuck?

### "I don't have STX"
→ Buy from Coinbase, Binance, OKX, or Kraken

### "I can't find my private key"
→ Open Leather Wallet → Settings → Secret Key

### "Deployment failed"
→ Check `.env` has correct PRIVATE_KEY
→ Make sure you have 0.5+ STX
→ Try testnet first: `npm run deploy:testnet`

### "Need more help?"
→ Read `BUILDER_CHALLENGE_GUIDE.md`
→ Join Stacks Discord
→ Check `COMMANDS.md` for all options

---

## 📋 Checklist

- [ ] Have 0.5+ STX on mainnet
- [ ] Got private key from wallet
- [ ] Ran `npm install`
- [ ] Updated `.env` with private key
- [ ] Ran `npm run deploy:mainnet`
- [ ] Saved transaction ID
- [ ] Ran `npm run generate-activity:mainnet`
- [ ] Pushed to GitHub
- [ ] Registered on leaderboard

---

## 🎯 Your Next Command

```bash
npm install
```

Then:

```bash
nano .env
```

Then:

```bash
npm run deploy:mainnet
```

---

**Let's go! 🚀**

**Questions?** Check the other `.md` files in this repo.

**Ready?** Start with `npm install`
