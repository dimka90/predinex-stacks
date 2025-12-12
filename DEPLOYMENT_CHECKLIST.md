# ✅ Predinex Mainnet Deployment Checklist

## Pre-Deployment

- [ ] Have 0.5+ STX on mainnet wallet
- [ ] Private key extracted from Leather/Hiro wallet
- [ ] `.env` file configured with `PRIVATE_KEY` and `STACKS_NETWORK=mainnet`
- [ ] `.env` is in `.gitignore` (never commit private keys)
- [ ] Dependencies installed: `npm install`
- [ ] Contract tested locally: `npm run test`
- [ ] Deployed to testnet first: `npm run deploy:testnet`

## Deployment

- [ ] Run: `npm run deploy:mainnet`
- [ ] Copy Transaction ID from output
- [ ] Wait for confirmation (~10 minutes)
- [ ] Verify on explorer: `https://explorer.hiro.so/txid/{TX_ID}?chain=mainnet`

## Post-Deployment

- [ ] Contract address confirmed on explorer
- [ ] Update README with contract address
- [ ] Add explorer link to README
- [ ] Commit changes: `git add . && git commit -m "Deploy Predinex to mainnet"`
- [ ] Push to GitHub: `git push origin main`

## Generate Activity (Boost Ranking)

- [ ] Run: `npm run generate-activity:mainnet`
- [ ] Create at least 3 pools
- [ ] Place at least 5 bets
- [ ] Settle at least 2 pools
- [ ] Claim winnings from settled pools

## Leaderboard Registration

- [ ] Visit: https://stacks.org/builder-challenge
- [ ] Connect GitHub account
- [ ] Verify contract appears in activity feed
- [ ] Check leaderboard ranking

## Clarity 4 Features Verification

- [ ] ✅ `stx-account` used in `validate-principal-and-get-balance`
- [ ] ✅ `int-to-ascii` used in `get-pool-id-string`
- [ ] ✅ `to-consensus-buff?` used in `serialize-pool-totals`
- [ ] ✅ Enhanced validation in `place-bet-validated`
- [ ] ✅ `settle-pool-enhanced` with comprehensive checks

## Package Requirements

- [ ] ✅ `@stacks/transactions` in package.json
- [ ] ✅ `@stacks/network` in package.json
- [ ] ✅ `@stacks/clarinet-sdk` in package.json
- [ ] ✅ Ready to add `@stacks/connect` for frontend

## Security

- [ ] ✅ Private key never committed to git
- [ ] ✅ `.env` in `.gitignore`
- [ ] ✅ Contract code reviewed
- [ ] ✅ No hardcoded secrets in code
- [ ] ✅ Fee set appropriately (150000 microstacks)

## Documentation

- [ ] ✅ README updated with mainnet address
- [ ] ✅ BUILDER_CHALLENGE_GUIDE.md created
- [ ] ✅ QUICK_START.md created
- [ ] ✅ Contract functions documented
- [ ] ✅ Clarity 4 features highlighted

---

## 🎯 Success Criteria

✅ Contract deployed to mainnet  
✅ Using Clarity 4 functions  
✅ Using `@stacks/transactions` and `@stacks/network`  
✅ Generated transaction activity  
✅ Registered on leaderboard  
✅ GitHub repository public  

---

## 📊 Expected Leaderboard Impact

- **Contract Deployment:** +100 points
- **Clarity 4 Functions:** +50 points (Week 1 boost)
- **Transaction Activity:** +10 points per transaction
- **GitHub Visibility:** +25 points

**Estimated Total:** 200-500 points depending on activity level

---

## 🚀 Next Steps

1. Complete all checkboxes above
2. Monitor leaderboard at https://stacks.org/builder-challenge
3. Prepare for Week 2 challenge (details coming soon)
4. Share your contract on Twitter/Discord with #StacksBuilder

---

**Last Updated:** December 2024  
**Challenge Period:** Dec 10-14, 2024  
**Status:** Ready for Deployment ✅
