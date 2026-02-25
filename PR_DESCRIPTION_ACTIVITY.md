# PR Title: `feat: Institutional-Grade User Activity Feed & On-Chain Transaction History`

## 🚀 Overview
This PR introduces a high-fidelity **Activity Feed & Transaction History** system for Predinex. It transforms the user experience by providing real-time, on-chain visibility into protocol interactions (bets, claims, and pool creations) directly from the Stacks blockchain.

Previously, the dashboard contained static placeholders for activity. This implementation replaces them with live data fetched via the **Hiro Stacks API**, showcasing deep integration with the Stacks ecosystem—a key requirement for the Code4STX campaign.

## ✨ Key Features
- **On-Chain Data Sync**: Real-time fetching of `contract-call` transactions for the Predinex contract.
- **Dedicated Activity Hub**: A new `/activity` route with stats (Total Bets, Success Rate) and granular filtering.
- **Premium Timeline UI**: Glassmorphism-based timeline with transaction-specific icons and color-coded statuses.
- **Dashboard Integration**: Live "Recent Activity" feed on the main dashboard.
- **Deep Linking**: One-click access to the Stacks Explorer for every transaction.
- **Responsive & Accessible**: Fully mobile-responsive with optimized ARIA labels and loading skeletons.

## 🛠️ Technical Implementation
- **API**: implemented `getUserActivity` in `stacks-api.ts` using the Hiro REST API.
- **Hooks**: Custom `useUserActivity` hook for efficient state management and auto-refresh.
- **Components**: Memoized `ActivityFeed` and `ActivityRow` components for high performance.
- **Styling**: Tailwind CSS v4 with custom glassmorphism utilities (`.glass`, `.glass-panel`).

## 📊 Commit History (8 Granular Commits)
I've followed conventional commit standards to provide a clean, professional history:

1. `f641b6e` feat(api): add getUserActivity for on-chain transaction fetching
2. `9539701` feat(hooks): create useUserActivity hook with loading state management
3. `075cafa` feat(ui): build premium ActivityFeed component with timeline design
4. `195925f` feat(pages): add dedicated activity page with filtering controls
5. `d98bf13` feat(nav): add Activity link to navbar for connected users
6. `3ef55c0` feat(dashboard): integrate live activity feed into dashboard
7. `c86cb12` test(api): add unit tests for getUserActivity function
8. `6e27d35` test(ui): add component tests for ActivityFeed

## ✅ Verification
- [x] Unit tests for API parsing and filtering (Passed)
- [x] Component tests for UI states (Passed)
- [x] Full responsive build (Passed)
- [x] Stacks Explorer links verified (Passed)

---
*This feature brings Predinex closer to a production-ready, institutional platform on Bitcoin.*
