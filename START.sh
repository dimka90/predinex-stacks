#!/bin/bash

# Predinex Quick Start Script
# Run this to start the entire project

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║   Predinex - Quick Start                                  ║${NC}"
echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}\n"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js is not installed${NC}"
    echo "Download from: https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"
echo -e "${GREEN}✓ npm found: $(npm --version)${NC}\n"

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo "Please create .env with your configuration"
    echo "See RUN_PROJECT.md for details"
    exit 1
fi

echo -e "${GREEN}✓ .env file found${NC}\n"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}Installing dependencies...${NC}"
    npm install
    echo ""
fi

# Check if web dependencies are installed
if [ ! -d "web/node_modules" ]; then
    echo -e "${BLUE}Installing web dependencies...${NC}"
    cd web
    npm install
    cd ..
    echo ""
fi

echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}Choose what to run:${NC}\n"
echo "1) Start Frontend (http://localhost:3000)"
echo "2) Run Interaction Script"
echo "3) Run Diagnostics"
echo "4) Make Git Commits (50+)"
echo "5) Run All (Frontend + Scripts in separate terminals)"
echo "6) Exit"
echo ""

read -p "Enter choice (1-6): " choice

case $choice in
    1)
        echo -e "\n${BLUE}Starting Frontend...${NC}\n"
        cd web
        npm run dev
        ;;
    2)
        echo -e "\n${BLUE}Running Interaction Script...${NC}\n"
        STACKS_NETWORK="mainnet" npx tsx scripts/interact.ts
        ;;
    3)
        echo -e "\n${BLUE}Running Diagnostics...${NC}\n"
        npx tsx scripts/diagnose-nonce.ts
        ;;
    4)
        echo -e "\n${BLUE}Making Git Commits...${NC}\n"
        bash MAKE_ALL_COMMITS.sh
        ;;
    5)
        echo -e "\n${BLUE}Starting all services...${NC}\n"
        echo -e "${YELLOW}Opening 3 terminals...${NC}\n"
        
        # Terminal 1: Frontend
        echo -e "${GREEN}Terminal 1: Starting Frontend${NC}"
        cd web
        npm run dev &
        FRONTEND_PID=$!
        
        sleep 3
        
        # Terminal 2: Scripts
        echo -e "${GREEN}Terminal 2: Ready for scripts${NC}"
        echo "Run in another terminal:"
        echo "  STACKS_NETWORK=\"mainnet\" npx tsx scripts/interact.ts"
        
        # Terminal 3: Diagnostics
        echo -e "${GREEN}Terminal 3: Ready for diagnostics${NC}"
        echo "Run in another terminal:"
        echo "  npx tsx scripts/diagnose-nonce.ts"
        
        echo -e "\n${YELLOW}Frontend is running at http://localhost:3000${NC}"
        echo "Press Ctrl+C to stop"
        
        wait $FRONTEND_PID
        ;;
    6)
        echo -e "\n${CYAN}Goodbye!${NC}\n"
        exit 0
        ;;
    *)
        echo -e "\n${YELLOW}Invalid choice${NC}\n"
        exit 1
        ;;
esac
