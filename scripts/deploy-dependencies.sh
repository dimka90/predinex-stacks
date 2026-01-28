#!/bin/bash

# Predinex Contracts - Quick Deploy Script
# Deploys contracts in correct dependency order

set -e  # Exit on error

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Predinex - Multi-Contract Deployment                   ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}\n"

echo -e "${YELLOW}⚠️  This will deploy 2 contracts (takes ~30 minutes):${NC}"
echo -e "   1. predinex-oracle-registry.clar (dependency)"
echo -e "   2. liquidity-incentives.clar (dependency)"
echo -e ""
echo -e "${YELLOW}⚠️  After these deploy successfully, you'll need to UPDATE${NC}"
echo -e "${YELLOW}   your predinex-pool.clar contract with the deployed addresses!${NC}"
echo -e ""

read -p "Continue? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    exit 1
fi

echo -e "\n${GREEN}Starting deployment...${NC}\n"

# Deploy Oracle Registry
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}STEP 1: Deploying predinex-oracle-registry${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

PRIVATE_KEY="${PRIVATE_KEY}" STACKS_NETWORK=mainnet WALLET_ADDRESS=SP2WWKKF25SED3K5P6ETY7MDDNBQH50GPSP8EJM8N npx tsx scripts/deploy-single.ts predinex-oracle-registry

echo -e "\n${YELLOW}⏰ Waiting 15 minutes for confirmation...${NC}"
sleep 900  # 15 minutes

# Deploy Liquidity Incentives
echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}STEP 2: Deploying liquidity-incentives${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

PRIVATE_KEY="${PRIVATE_KEY}" STACKS_NETWORK=mainnet WALLET_ADDRESS=SP2WWKKF25SED3K5P6ETY7MDDNBQH50GPSP8EJM8N npx tsx scripts/deploy-single.ts liquidity-incentives

echo -e "\n${GREEN}✅ Dependencies deployed!${NC}"
echo -e "${YELLOW}⚠️  Now you need to:${NC}"
echo -e "   1. Check both deployments on explorer"
echo -e "   2. Update predinex-pool.clar with the new contract addresses"
echo -e "   3. Run deployment for predinex-pool.clar"
echo -e ""
