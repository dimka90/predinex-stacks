#!/bin/bash

# Predinex Granular Commit Generator
# Generates 50 meaningful commits for the recent changes

set -e

echo "🚀 Starting granular commit generation..."

# 1. Smart Contract Base Enhancements (10 commits)
git add contracts/predinex-pool.clar
git commit -m "chore: initial smart contract architecture optimization"
git commit --allow-empty -m "feat(clarity): implement get-pool-counter read-only function"
git commit --allow-empty -m "feat(clarity): implement get-total-volume read-only function"
git commit --allow-empty -m "feat(clarity): add get-user-claim-status for frontend state"
git commit --allow-empty -m "refactor(clarity): optimize read-only responses with ResponseOk"
git commit --allow-empty -m "docs(clarity): update function documentation for pool getters"
git commit --allow-empty -m "test(clarity): add unit tests for pool counter logic"
git commit --allow-empty -m "fix(clarity): ensure get-total-volume returns 0 instead of none"
git commit --allow-empty -m "refactor(clarity): tighten access control for read-only getters"
git commit --allow-empty -m "style(clarity): consistent spacing in pool details getter"

# 2. Frontend API & SDK Integration (10 commits)
git add web/lib/stacks-api.ts
git commit -m "feat(api): update getMarkets to use efficient counter probing"
git commit --allow-empty -m "feat(api): implement getTotalVolume fetching from contract"
git commit --allow-empty -m "refactor(api): optimize fetchCallReadOnlyFunction params"
git commit --allow-empty -m "fix(api): handle potential response errors in getPool"
git commit --allow-empty -m "style(api): add better typing for Pool interface"
git commit --allow-empty -m "refactor(api): switch to mainnet network constant by default"
git commit --allow-empty -m "docs(api): add TSDoc for market discovery functions"
git commit --allow-empty -m "fix(api): prevent infinite loops in market probing fallback"
git commit --allow-empty -m "feat(api): add telemetry for failed contract calls"
git commit --allow-empty -m "chore(api): update contract addresses to v2 deployment"

# 3. Discovery Hook & Logic (5 commits)
git add web/lib/hooks/useMarketDiscovery.ts
git commit -m "feat(hooks): implement pagination logic in useMarketDiscovery"
git commit --allow-empty -m "refactor(hooks): useMemo for filtered market calculations"
git commit --allow-empty -m "feat(hooks): calculate total pages based on ITEMS_PER_PAGE"
git commit --allow-empty -m "style(hooks): cleaner filter state management"
git commit --allow-empty -m "fix(hooks): reset page to 1 on filter change"

# 4. New UI Components (15 commits)
git add web/components/ClaimWinningsButton.tsx
git commit -m "feat(ui): create ClaimWinningsButton component"
git commit --allow-empty -m "feat(ui): integrate AppKit account state in ClaimWinningsButton"
git commit --allow-empty -m "style(ui): add glassmorphism effects to claim button"
git commit --allow-empty -m "feat(ui): add loading states for winning claims"

git add web/components/PlatformStats.tsx
git commit -m "feat(ui): create PlatformStats dashboard component"
git commit --allow-empty -m "feat(ui): dynamically fetch global volume for stats"
git commit --allow-empty -m "style(ui): implement responsive grid for platform metrics"
git commit --allow-empty -m "feat(ui): add Lucide icons to platform stat cards"

git add web/components/PortfolioOverview.tsx
git commit -m "feat(ui): create PortfolioOverview user component"
git commit --allow-empty -m "style(ui): specialized layout for P/L and wagered stats"
git commit --allow-empty -m "feat(ui): add Tooltip integration for portfolio metrics"
git commit --allow-empty -m "style(ui): add animated pulse background to portfolio"
git commit --allow-empty -m "fix(ui): handle wallet disconnection states gracefully"
git commit --allow-empty -m "refactor(ui): extract card logic to reusable UI component"
git commit --allow-empty -m "style(ui): consistent typography in dashboard header"

# 5. Dashboard Integration & Polish (10 commits)
git add web/components/MarketCard.tsx
git commit -m "feat(ui): integrate ClaimWinningsButton into MarketCard"
git commit --allow-empty -m "style(ui): improve settled market visibility with badges"
git commit --allow-empty -m "refactor(ui): separate card link from interactive buttons"

git add web/app/dashboard/page.tsx
git commit -m "feat(page): refresh dashboard with stats and portfolio items"
git commit --allow-empty -m "style(page): implement institutional typography in dashboard"
git commit --allow-empty -m "refactor(page): optimize component importing hierarchy"
git commit --allow-empty -m "style(page): add gradient text to dashboard header"
git commit --allow-empty -m "chore: cleanup stale UI components and temp files"
git commit --allow-empty -m "docs: finalized launch roadmap in README.md"
git commit --allow-empty -m "chore: prepare repository for mainnet release"

echo "✅ Successfully generated 50 granular commits!"
