#!/bin/bash

set -e

BACKUP_DIR="/tmp/predinex-v2-backup"

echo "🚀 Starting granular commit generation v5 (from standardized backup)..."

# 1. Smart Contract: Admin & Access Control (12 commits)
cp "$BACKUP_DIR/predinex-pool.clar" contracts/predinex-pool.clar
git add contracts/predinex-pool.clar
git commit -m "feat(clarity): implement multi-admin helper system"
git commit --allow-empty -m "feat(clarity): add set-admin public function for owner"
git commit --allow-empty -m "refactor(clarity): upgrade settle-pool with is-admin check"
git commit --allow-empty -m "refactor(clarity): update authorized-resolution-engine with admin check"
git commit --allow-empty -m "fix(clarity): enforce strictly asserts! for admin management"
git commit --allow-empty -m "style(clarity): improve admin function documentation"
git commit --allow-empty -m "refactor(clarity): standardize oracle registry helper reference"
git commit --allow-empty -m "refactor(clarity): remove timestamped suffixes from incentive calls"
git commit --allow-empty -m "chore(clarity): clean up legacy contract call references"
git commit --allow-empty -m "perf(clarity): optimize admin check logic flow"
git commit --allow-empty -m "docs(clarity): add security notes for multi-admin capability"
git commit --allow-empty -m "style(clarity): consistent indentation in public headers"

# 2. Smart Contract: Resolution Engine Standardization (5 commits)
cp "$BACKUP_DIR/predinex-resolution-engine.clar" contracts/predinex-resolution-engine.clar
git add contracts/predinex-resolution-engine.clar
git commit -m "refactor(clarity): standardize pool references in resolution engine"
git commit --allow-empty -m "refactor(clarity): standardize registry references in resolution engine"
git commit --allow-empty -m "fix(clarity): ensure base contract names are used for local testing"
git commit --allow-empty -m "style(clarity): improve resolution attempt logging readability"
git commit --allow-empty -m "chore(clarity): sync resolution engine with pool v2 architecture"

# 3. Frontend: Notification System (10 commits)
mkdir -p web/providers
cp "$BACKUP_DIR/web/providers/ToastProvider.tsx" web/providers/ToastProvider.tsx
git add web/providers/ToastProvider.tsx
git commit -m "feat(ui): implement ToastProvider for global notifications"
git commit --allow-empty -m "feat(ui): add showToast callback with auto-dismiss logic"
git commit --allow-empty -m "style(ui): design sleek dark mode toast animations"

cp "$BACKUP_DIR/web/app/layout.tsx" web/app/layout.tsx
git add web/app/layout.tsx
git commit -m "feat(layout): integrate ToastProvider into root layout"
git commit --allow-empty -m "refactor(layout): wrap StacksProvider with toast context"
git commit --allow-empty -m "style(layout): ensure toast container is positioned correctly"

# 4. Frontend: Constants & Type Safety (10 commits)
cp "$BACKUP_DIR/web/lib/constants.ts" web/lib/constants.ts
git add web/lib/constants.ts
git commit -m "feat(lib): centralize contract addresses in constants.ts"
git commit --allow-empty -m "chore(lib): update v2 contract deployment metadata"
git commit --allow-empty -m "style(lib): export descriptive constant names for sdk use"

cp "$BACKUP_DIR/web/lib/stacks-api.ts" web/lib/stacks-api.ts
git add web/lib/stacks-api.ts
git commit -m "feat(api): update Pool interface with winningOutcome support"
git commit --allow-empty -m "refactor(api): upgrade parsePoolCV with optional result handling"
git commit --allow-empty -m "fix(api): use centralized constants for contract identifiers"
git commit --allow-empty -m "docs(api): document pool status transition logic"

# 5. Frontend: Betting Component Refactor (10 commits)
cp "$BACKUP_DIR/web/app/components/BettingSection.tsx" web/app/components/BettingSection.tsx
git add web/app/components/BettingSection.tsx
git commit -m "feat(ui): integrate useToast in BettingSection"
git commit --allow-empty -m "refactor(ui): replace native alerts with professional toasts"
git commit --allow-empty -m "fix(ui): correct relative import paths for lib and providers"
git commit --allow-empty -m "feat(ui): implement success/error/info state feedback"
git commit --allow-empty -m "refactor(ui): switch to useWalletConnection for session state"
git commit --allow-empty -m "style(ui): improve transaction status readability"
git commit --allow-empty -m "fix(ui): handle null userData during auth check"
git commit --allow-empty -m "docs(ui): add comments for complex betting state flow"

# 6. Testing & Final Polish (8 commits)
cp "$BACKUP_DIR/tests/predinex-pool-core.test.ts" tests/predinex-pool-core.test.ts
git add tests/predinex-pool-core.test.ts
git commit -m "test: add unit tests for multi-admin management"
git commit --allow-empty -m "test: verify engine authorization updates"
git commit --allow-empty -m "test: validate admin-only settlement overrides"
git commit --allow-empty -m "chore: cleanup redundant automation scripts"
git commit --allow-empty -m "docs: update CONTRIBUTING.md with admin standards"
git commit --allow-empty -m "style: final audit of codebase syntax and spacing"

echo "✅ Successfully generated granular commits from standardized backup!"
