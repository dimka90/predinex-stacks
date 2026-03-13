#!/bin/bash

# Test Resolution Script
echo "🚀 Starting Resolution Test..."

# 1. Run oracle simulation
echo "🔮 Running Oracle Simulation..."
npx tsx scripts/simulate-oracle-provider.ts

# 2. Check pool status (mock example)
echo "🔍 Checking Pool #0 Status..."
npx tsx scripts/get-pool-info.ts 0

echo "✅ Resolution Test Complete!"
