# 🏗️ Predinex Architecture - How Everything Connects

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PREDINEX ARCHITECTURE                              │
└─────────────────────────────────────────────────────────────────────────────┘

                              STACKS BLOCKCHAIN
                                     ▲
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
                    │                │                │
        ┌───────────▼──────┐  ┌──────▼────────┐  ┌──▼──────────────┐
        │  Smart Contract  │  │  Transaction  │  │  Read-Only      │
        │  predinex-pool   │  │  Broadcast    │  │  Functions      │
        │                  │  │               │  │                 │
        │ • create-pool    │  │ • Deploy      │  │ • get-pool      │
        │ • place-bet      │  │ • place-bet   │  │ • get-user-bet  │
        │ • settle-pool    │  │ • settle-pool │  │ • get-pool-stats│
        │ • claim-winnings │  │ • create-pool │  │ • get-total-vol │
        └──────────────────┘  └───────────────┘  └─────────────────┘
                    ▲                                      ▲
                    │                                      │
                    │                                      │
        ┌───────────┴──────────────────────────────────────┴──────────┐
        │                                                              │
        │                    @stacks/transactions                     │
        │                    @stacks/network                          │
        │                                                              │
        └───────────┬──────────────────────────────────────┬──────────┘
                    │                                      │
        ┌───────────▼──────────────┐        ┌─────────────▼────────┐
        │   BACKEND (Node.js)      │        │  FRONTEND (React)    │
        │                          │        │                      │
        │ scripts/                 │        │ web/app/             │
        │ ├─ deploy.ts             │        │ ├─ components/       │
        │ │  (Deploy contract)     │        │ │  ├─ StacksProvider │
        │ │                        │        │ │  │  (Wallet)       │
        │ ├─ generate-activity.ts  │        │ │  ├─ Navbar         │
        │ │  (Create pools/bets)   │        │ │  └─ Hero           │
        │ │                        │        │ │                    │
        │ └─ interact.ts           │        │ ├─ create/           │
        │    (User interaction)    │        │ │  (Create pools)    │
        │                          │        │ │                    │
        │ lib/                     │        │ ├─ markets/          │
        │ └─ stacks-api.ts         │        │ │  (View pools)      │
        │    (Read contract data)  │        │ │                    │
        │                          │        │ └─ lib/              │
        │ @stacks/transactions     │        │    └─ stacks-api.ts  │
        │ @stacks/network          │        │       (API calls)    │
        │                          │        │                      │
        └──────────────────────────┘        │ @stacks/connect      │
                                            │ @stacks/transactions │
                                            │ @stacks/auth         │
                                            │                      │
                                            └──────────────────────┘
```

---

## 🔄 Data Flow Diagrams

### 1. Deployment Flow

```
Developer
    │
    ├─ npm run deploy:mainnet
    │
    ├─ scripts/deploy.ts
    │  ├─ Read contract code
    │  ├─ Load PRIVATE_KEY from .env
    │  └─ Create deployment transaction
    │
    ├─ @stacks/transactions
    │  ├─ makeContractDeploy()
    │  │  └─ Build transaction
    │  │
    │  └─ broadcastTransaction()
    │     └─ Send to network
    │
    ├─ Stacks Blockchain
    │  ├─ Validate transaction
    │  ├─ Execute contract deployment
    │  └─ Store contract state
    │
    └─ Output
       ├─ Transaction ID
       ├─ Contract Address
       └─ Explorer Link
```

### 2. User Interaction Flow (Frontend)

```
User
  │
  ├─ Clicks "Connect Wallet"
  │
  ├─ @stacks/connect
  │  ├─ showConnect()
  │  └─ Opens Leather/Hiro wallet
  │
  ├─ User approves connection
  │
  ├─ @stacks/auth
  │  ├─ UserSession created
  │  └─ User data stored
  │
  ├─ Clicks "Create Pool"
  │
  ├─ web/app/create/page.tsx
  │  └─ Collects pool details
  │
  ├─ @stacks/connect
  │  ├─ openContractCall()
  │  └─ Opens wallet for approval
  │
  ├─ User approves transaction
  │
  ├─ @stacks/transactions
  │  ├─ Signs with user's private key
  │  └─ Broadcasts to blockchain
  │
  ├─ Stacks Blockchain
  │  ├─ Validates transaction
  │  ├─ Executes create-pool function
  │  └─ Updates contract state
  │
  └─ Success!
     ├─ Pool created
     ├─ Transaction ID shown
     └─ Pool appears in markets
```

### 3. Activity Generation Flow (Backend)

```
Developer
    │
    ├─ npm run generate-activity:mainnet
    │
    ├─ scripts/generate-activity.ts
    │  ├─ Interactive CLI menu
    │  └─ User selects action
    │
    ├─ Action: Create Pool
    │  ├─ Collect pool details
    │  ├─ @stacks/transactions
    │  │  ├─ makeContractCall()
    │  │  └─ broadcastTransaction()
    │  │
    │  └─ Stacks Blockchain
    │     └─ Pool created
    │
    ├─ Action: Place Bet
    │  ├─ Collect bet details
    │  ├─ @stacks/transactions
    │  │  ├─ makeContractCall()
    │  │  └─ broadcastTransaction()
    │  │
    │  └─ Stacks Blockchain
    │     └─ Bet placed
    │
    ├─ Action: Settle Pool
    │  ├─ Collect settlement details
    │  ├─ @stacks/transactions
    │  │  ├─ makeContractCall()
    │  │  └─ broadcastTransaction()
    │  │
    │  └─ Stacks Blockchain
    │     └─ Pool settled
    │
    └─ Output
       ├─ Transaction IDs
       ├─ Explorer links
       └─ Activity recorded
```

### 4. Data Reading Flow

```
Frontend (web/app/lib/stacks-api.ts)
    │
    ├─ User views markets page
    │
    ├─ fetchActivePools()
    │  ├─ getPoolCount()
    │  │  ├─ @stacks/transactions
    │  │  │  └─ fetchCallReadOnlyFunction()
    │  │  │
    │  │  └─ Stacks Blockchain
    │  │     └─ Returns pool count
    │  │
    │  └─ getPool(id) for each pool
    │     ├─ @stacks/transactions
    │     │  └─ fetchCallReadOnlyFunction()
    │     │
    │     └─ Stacks Blockchain
    │        └─ Returns pool data
    │
    ├─ cvToValue() - Convert Clarity values
    │
    └─ Display pools in UI
       ├─ Pool title
       ├─ Outcome A & B
       ├─ Total bets
       └─ Settlement status
```

---

## 📦 Package Dependencies

```
predinex-stacks/
├── Backend
│   ├── @stacks/transactions
│   │   ├─ makeContractDeploy
│   │   ├─ makeContractCall
│   │   ├─ broadcastTransaction
│   │   ├─ fetchCallReadOnlyFunction
│   │   └─ cvToValue
│   │
│   └── @stacks/network
│       ├─ STACKS_MAINNET
│       ├─ STACKS_TESTNET
│       └─ Network configuration
│
└── Frontend (web/)
    ├── @stacks/connect
    │   ├─ showConnect
    │   ├─ openContractCall
    │   └─ Wallet integration
    │
    ├── @stacks/auth
    │   ├─ UserSession
    │   ├─ AppConfig
    │   └─ User authentication
    │
    ├── @stacks/transactions
    │   ├─ fetchCallReadOnlyFunction
    │   ├─ cvToValue
    │   └─ uintCV, stringAsciiCV, etc.
    │
    └── @stacks/network
        └─ Network configuration
```

---

## 🔐 Security Flow

```
User's Private Key
    │
    ├─ Stored in: Leather/Hiro Wallet (NOT in your app)
    │
    ├─ When user approves transaction:
    │  ├─ @stacks/connect intercepts
    │  ├─ Wallet signs transaction
    │  └─ Signed transaction returned
    │
    ├─ Your app receives signed transaction
    │  ├─ @stacks/transactions broadcasts
    │  └─ Sent to blockchain
    │
    └─ Blockchain validates signature
       └─ Transaction executed

Developer's Private Key (for deployment)
    │
    ├─ Stored in: .env file (LOCAL ONLY)
    │
    ├─ When deploying:
    │  ├─ scripts/deploy.ts reads .env
    │  ├─ @stacks/transactions signs
    │  └─ Broadcast to blockchain
    │
    └─ .env is in .gitignore (NEVER committed)
```

---

## 🎯 For Builder Challenge

```
Leaderboard Scoring
    │
    ├─ Smart Contract Activity
    │  ├─ Deployed to mainnet ✅
    │  ├─ Using Clarity 4 functions ✅
    │  └─ Transaction activity ✅
    │
    ├─ Package Usage
    │  ├─ @stacks/transactions ✅
    │  │  └─ Used in: deploy.ts, generate-activity.ts
    │  │
    │  └─ @stacks/connect ✅
    │     └─ Used in: StacksProvider.tsx
    │
    ├─ GitHub Visibility
    │  ├─ Public repository ✅
    │  ├─ Comprehensive docs ✅
    │  └─ CI/CD workflows ✅
    │
    └─ Points Calculation
       ├─ Deployment: +100
       ├─ Clarity 4: +50
       ├─ Per transaction: +10 each
       ├─ GitHub: +25
       └─ Total: 200-500 points
```

---

## 📊 Component Interaction Matrix

| Component | Uses | Used By | Purpose |
|-----------|------|---------|---------|
| `deploy.ts` | @stacks/transactions | Developer | Deploy contract |
| `generate-activity.ts` | @stacks/transactions | Developer | Create activity |
| `stacks-api.ts` | @stacks/transactions | Frontend | Read contract data |
| `StacksProvider.tsx` | @stacks/connect | Frontend | Wallet connection |
| `create/page.tsx` | @stacks/connect | User | Create pools |
| `markets/page.tsx` | stacks-api.ts | User | View pools |
| Smart Contract | - | Blockchain | Execute logic |

---

## 🚀 Deployment Architecture

```
Local Development
    │
    ├─ npm run test
    │  └─ Verify contract logic
    │
    ├─ npm run deploy:testnet
    │  └─ Test on testnet
    │
    └─ npm run deploy:mainnet
       └─ Deploy to mainnet

Mainnet
    │
    ├─ Smart Contract
    │  ├─ predinex-pool
    │  └─ Live on blockchain
    │
    ├─ Frontend
    │  ├─ web/app deployed
    │  └─ Users interact
    │
    └─ Backend Scripts
       ├─ Generate activity
       └─ Monitor transactions

Leaderboard
    │
    ├─ Track contract activity
    ├─ Monitor package usage
    ├─ Calculate points
    └─ Update rankings
```

---

## ✅ Your Setup Status

```
✅ Backend (@stacks/transactions)
   ├─ scripts/deploy.ts - Ready
   ├─ scripts/generate-activity.ts - Ready
   └─ web/app/lib/stacks-api.ts - Ready

✅ Frontend (@stacks/connect)
   ├─ web/app/components/StacksProvider.tsx - Ready
   ├─ web/package.json - Has dependencies
   └─ Ready for user interactions

✅ Smart Contract
   ├─ Clarity 4 functions - Implemented
   ├─ Compiled - No errors
   └─ Ready for mainnet

✅ Documentation
   ├─ 8 guides created
   ├─ Architecture documented
   └─ Ready for deployment

🟢 STATUS: READY FOR MAINNET DEPLOYMENT
```

---

**Next Step:** `npm run deploy:mainnet` 🚀
