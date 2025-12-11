# Mainnet Deployment Guide - Stacks Builder Challenge

## Prerequisites

1. **Mainnet STX tokens** - You need ~0.5-1 STX for deployment fees
2. **A Stacks wallet** with your private key (Leather/Hiro Wallet)

## Where to Buy STX

| Exchange | Link |
|----------|------|
| Coinbase | https://www.coinbase.com |
| Binance | https://www.binance.com |
| OKX | https://www.okx.com |
| Kraken | https://www.kraken.com |

## Step 1: Get Your Private Key

1. Open your **Leather Wallet** (or Hiro Wallet)
2. Go to **Settings** > **Secret Key** or **Export Private Key**
3. Copy your 64-character hex private key
4. ⚠️ **NEVER share this key or commit it to git!**

## Step 2: Configure Environment

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your values
nano .env
```

Your `.env` should look like:
```
DEPLOYER_KEY=your_64_character_hex_private_key
STACKS_NETWORK=mainnet
```

## Step 3: Deploy to Mainnet

```bash
# Install dependencies if not done
npm install

# Deploy the contract
npx ts-node scripts/deploy.ts
```

## Step 4: Verify Deployment

After deployment, you'll get a **Transaction ID**. Check it at:
- https://explorer.hiro.so/txid/{YOUR_TX_ID}?chain=mainnet

Your contract address will be:
```
{YOUR_WALLET_ADDRESS}.predinex-pool
```

## Step 5: Generate Activity (Boost Builder Challenge Score)

Once deployed, have users interact with your contract:

1. **Create pools** - Call `create-pool`
2. **Place bets** - Call `place-bet` or `place-bet-safe` (Clarity 4)
3. **Register users** - Call `register-user` (Clarity 4)

More user interactions = more fees = higher Builder Challenge ranking!

## Clarity 4 Features Included

This contract uses these Clarity 4 functions for the Builder Challenge:

- `int-to-ascii` - Pool ID formatting
- `stx-account` - Balance checking
- `principal-destruct?` - Principal analysis
- `to-consensus-buff?` - Data serialization

## Security Reminders

- ✅ Your `.env` is already in `.gitignore`
- ⚠️ Never commit private keys
- ⚠️ Test on testnet first if unsure
