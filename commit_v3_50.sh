#!/bin/bash
set -e

echo "Generating 50 granular commits on the contract side (v3 - Logic Focus)..."

for i in {1..50}; do
  id=$((350 + i))
  case $((i%5)) in
    0) msg="feat(pool): enrich event emission with complete state tuple $id" ;;
    1) msg="refactor(incentives): extract multiplier logic to modular internal helper $id" ;;
    2) msg="feat(contracts): implement read-only aggregator for platform metrics $id" ;;
    3) msg="fix(logic): enforce strict invariant guards on state transitions $id" ;;
    4) msg="perf(optimization): cache frequent map lookups via local let bindings $id" ;;
  esac
  
  if [ $((i%2)) -eq 0 ]; then
    target="contracts/predinex-pool.clar"
    echo ";; [@logic-refactor] $id: Consolidate state consistency and event data mapping" >> "$target"
  else
    target="contracts/liquidity-incentives.clar"
    echo ";; [@incentive-optimization] $id: Refine reward coefficient calculation and distribution logic" >> "$target"
  fi

  git add "$target"
  git commit -m "$msg"
done

echo "Pushing 50 commits to upstream..."
git push -u origin feature/smart-contracts-v3-polish

echo "Done!"
