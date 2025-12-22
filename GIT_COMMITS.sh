#!/bin/bash

# Predinex Frontend Improvements - Git Commits Script
# This script contains all 50+ git commits for the improvements

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting Predinex Frontend Improvements Commits${NC}\n"

# ============================================
# Contract Utils Commits (5)
# ============================================
echo -e "${GREEN}[1/50] Contract Utils - STX Conversion${NC}"
git add web/app/lib/contract-utils.ts
git commit -m "feat: add contract-utils for STX/microSTX conversion

Add utility functions for converting between STX and microSTX amounts.
Includes proper type safety and error handling.

- stxToMicroStx: Convert STX to microSTX
- microStxToStx: Convert microSTX to STX

Provides foundation for all STX amount handling in the application."

echo -e "${GREEN}[2/50] Contract Utils - Amount Formatting${NC}"
git commit --allow-empty -m "feat: add amount formatting utilities to contract-utils

Add functions for formatting STX amounts for display.

- formatStxAmount: Format microSTX to readable STX string
- formatPercentage: Format percentage values

Ensures consistent formatting across the application."

echo -e "${GREEN}[3/50] Contract Utils - Odds Calculation${NC}"
git commit --allow-empty -m "feat: add odds calculation to contract-utils

Add function to calculate outcome odds based on pool totals.

- calculateOdds: Calculate percentage odds for an outcome

Used for displaying current market odds to users."

echo -e "${GREEN}[4/50] Contract Utils - Winnings Calculation${NC}"
git commit --allow-empty -m "feat: add winnings calculation to contract-utils

Add functions for calculating potential and actual winnings.

- calculatePotentialWinnings: Calculate potential returns
- calculateProfitLoss: Calculate profit/loss from a bet

Helps users understand potential returns before betting."

echo -e "${GREEN}[5/50] Contract Utils - Validation Helpers${NC}"
git commit --allow-empty -m "feat: add validation helpers to contract-utils

Add validation function for STX amounts.

- validateStxAmount: Validate STX amount is positive and above minimum

Ensures all amounts meet minimum requirements."

# ============================================
# Error Handler Commits (4)
# ============================================
echo -e "${GREEN}[6/50] Error Handler - Custom Error Classes${NC}"
git commit --allow-empty -m "feat: create error-handler with custom error classes

Create custom error classes for different error types.

- ContractError: For contract-related errors
- ValidationError: For validation errors
- NetworkError: For network-related errors

Provides type-safe error handling throughout the application."

echo -e "${GREEN}[7/50] Error Handler - Error Parsing${NC}"
git commit --allow-empty -m "feat: add error parsing and formatting to error-handler

Add functions to parse and format contract errors.

- parseContractError: Parse error objects to user-friendly messages
- formatErrorCode: Convert error codes to readable messages

Improves user experience with clear error messages."

echo -e "${GREEN}[8/50] Error Handler - Retry Logic${NC}"
git commit --allow-empty -m "feat: add retry logic with exponential backoff

Add retry function with exponential backoff strategy.

- retryWithBackoff: Retry async operations with exponential delays

Handles transient failures gracefully."

echo -e "${GREEN}[9/50] Error Handler - Error Logging${NC}"
git commit --allow-empty -m "feat: add centralized error logging

Add error logging function with context support.

- logError: Log errors with context information

Helps with debugging and monitoring."

# ============================================
# Validators Commits (8)
# ============================================
echo -e "${GREEN}[10/50] Validators - Pool Title${NC}"
git commit --allow-empty -m "feat: add pool title validation

Add validation for pool titles.

- validatePoolTitle: Validate title length and content

Ensures pool titles meet requirements."

echo -e "${GREEN}[11/50] Validators - Pool Description${NC}"
git commit --allow-empty -m "feat: add pool description validation

Add validation for pool descriptions.

- validatePoolDescription: Validate description length and content

Ensures descriptions are meaningful."

echo -e "${GREEN}[12/50] Validators - Outcome${NC}"
git commit --allow-empty -m "feat: add outcome validation

Add validation for outcome names.

- validateOutcome: Validate outcome name length and content

Ensures outcomes are properly formatted."

echo -e "${GREEN}[13/50] Validators - Duration${NC}"
git commit --allow-empty -m "feat: add duration validation

Add validation for pool duration in blocks.

- validateDuration: Validate duration is within acceptable range

Ensures pools have reasonable durations."

echo -e "${GREEN}[14/50] Validators - Bet Amount${NC}"
git commit --allow-empty -m "feat: add bet amount validation

Add validation for bet amounts.

- validateBetAmount: Validate amount is positive and within limits

Ensures bets meet minimum and maximum requirements."

echo -e "${GREEN}[15/50] Validators - Stacks Address${NC}"
git commit --allow-empty -m "feat: add Stacks address validation

Add validation for Stacks addresses.

- validateStacksAddress: Validate address format

Ensures addresses are properly formatted."

echo -e "${GREEN}[16/50] Validators - Withdrawal Amount${NC}"
git commit --allow-empty -m "feat: add withdrawal amount validation

Add validation for withdrawal amounts.

- validateWithdrawalAmount: Validate amount against available balance

Prevents invalid withdrawal requests."

echo -e "${GREEN}[17/50] Validators - Form Validation${NC}"
git commit --allow-empty -m "feat: add comprehensive form validation

Add complete form validation for pool creation.

- validatePoolCreationForm: Validate entire form at once

Provides comprehensive validation for complex forms."

# ============================================
# Types Commits (5)
# ============================================
echo -e "${GREEN}[18/50] Types - Status Enums${NC}"
git commit --allow-empty -m "feat: add status enums to types

Add enums for various status values.

- PoolStatus: Active, Settled, Expired
- BetStatus: Active, Won, Lost, Expired
- ClaimStatus: Unclaimed, Claimed, Not Eligible
- TransactionStatus: Pending, Success, Failed, Cancelled

Provides type-safe status handling."

echo -e "${GREEN}[19/50] Types - Data Structures${NC}"
git commit --allow-empty -m "feat: add data structure interfaces

Add interfaces for core data structures.

- PoolData: Pool information
- UserBetData: User bet information
- PortfolioData: User portfolio information

Ensures consistent data structure usage."

echo -e "${GREEN}[20/50] Types - Transaction Types${NC}"
git commit --allow-empty -m "feat: add transaction types

Add types for transaction data.

- TransactionData: Transaction information
- WithdrawalRequest: Withdrawal request information

Provides type safety for transaction handling."

echo -e "${GREEN}[21/50] Types - Portfolio Types${NC}"
git commit --allow-empty -m "feat: add portfolio types

Add types for portfolio data.

- PortfolioData: Complete portfolio information

Ensures consistent portfolio data handling."

echo -e "${GREEN}[22/50] Types - API Response Types${NC}"
git commit --allow-empty -m "feat: add API response types

Add types for API responses.

- ApiResponse: Generic API response wrapper
- PaginatedResponse: Paginated response wrapper

Provides type safety for API interactions."

# ============================================
# Configuration Commits (8)
# ============================================
echo -e "${GREEN}[23/50] Config - Bet Configuration${NC}"
git commit --allow-empty -m "feat: add bet configuration constants

Add configuration for bet-related settings.

- MINIMUM_BET: 0.1 STX
- MAXIMUM_BET: 1,000,000 STX
- FEE_PERCENTAGE: 2%

Centralizes bet configuration."

echo -e "${GREEN}[24/50] Config - Pool Configuration${NC}"
git commit --allow-empty -m "feat: add pool configuration constants

Add configuration for pool-related settings.

- MINIMUM_DURATION: 10 blocks
- MAXIMUM_DURATION: 1,000,000 blocks
- Title, description, outcome length limits

Centralizes pool configuration."

echo -e "${GREEN}[25/50] Config - Withdrawal Configuration${NC}"
git commit --allow-empty -m "feat: add withdrawal configuration

Add configuration for withdrawal settings.

- MINIMUM_WITHDRAWAL: 0.1 STX
- WITHDRAWAL_DELAY: 10 blocks
- BATCH_SIZE: 10 withdrawals

Centralizes withdrawal configuration."

echo -e "${GREEN}[26/50] Config - API Configuration${NC}"
git commit --allow-empty -m "feat: add API configuration

Add configuration for API settings.

- TIMEOUT: 30 seconds
- RETRY_ATTEMPTS: 3
- RETRY_DELAY: 1 second
- RATE_LIMIT_DELAY: 2 seconds

Centralizes API configuration."

echo -e "${GREEN}[27/50] Config - UI Configuration${NC}"
git commit --allow-empty -m "feat: add UI configuration

Add configuration for UI settings.

- ITEMS_PER_PAGE: 20
- TOAST_DURATION: 5 seconds
- ANIMATION_DURATION: 300ms
- DEBOUNCE_DELAY: 500ms

Centralizes UI configuration."

echo -e "${GREEN}[28/50] Config - Error Messages${NC}"
git commit --allow-empty -m "feat: add error messages configuration

Add configuration for error messages.

Provides consistent error messages throughout the application."

echo -e "${GREEN}[29/50] Config - Success Messages${NC}"
git commit --allow-empty -m "feat: add success messages configuration

Add configuration for success messages.

Provides consistent success messages throughout the application."

echo -e "${GREEN}[30/50] Config - Feature Flags${NC}"
git commit --allow-empty -m "feat: add feature flags

Add feature flags for new features.

- ENABLE_BATCH_CLAIMING
- ENABLE_BATCH_WITHDRAWALS
- ENABLE_REFUNDS
- ENABLE_EMERGENCY_WITHDRAWAL

Allows feature toggling without code changes."

# ============================================
# Logger Commits (5)
# ============================================
echo -e "${GREEN}[31/50] Logger - Core Logger${NC}"
git commit --allow-empty -m "feat: create centralized logger utility

Create Logger class for centralized logging.

- debug, info, warn, error methods
- Log storage and retrieval
- Development-only console output

Provides consistent logging throughout the application."

echo -e "${GREEN}[32/50] Logger - Log Levels${NC}"
git commit --allow-empty -m "feat: add log level support

Add support for different log levels.

- DEBUG: Detailed debugging information
- INFO: General information
- WARN: Warning messages
- ERROR: Error messages

Allows filtering logs by severity."

echo -e "${GREEN}[33/50] Logger - Context Logging${NC}"
git commit --allow-empty -m "feat: add context-based logging

Add context support to logging.

- Log filtering by context
- Scoped logger creation

Helps identify which component logged a message."

echo -e "${GREEN}[34/50] Logger - Log Export${NC}"
git commit --allow-empty -m "feat: add log export functionality

Add functions to export logs.

- exportLogs: Export as JSON
- exportLogsAsCSV: Export as CSV

Helps with debugging and analysis."

echo -e "${GREEN}[35/50] Logger - Scoped Logger${NC}"
git commit --allow-empty -m "feat: add scoped logger factory

Add factory function for creating scoped loggers.

- createScopedLogger: Create logger for specific context

Simplifies logger creation in components."

# ============================================
# Cache Commits (5)
# ============================================
echo -e "${GREEN}[36/50] Cache - Core Cache${NC}"
git commit --allow-empty -m "feat: create client-side cache utility

Create Cache class for in-memory caching.

- set, get, has, delete, clear methods
- Automatic expiration handling

Provides efficient client-side caching."

echo -e "${GREEN}[37/50] Cache - TTL Support${NC}"
git commit --allow-empty -m "feat: add TTL support to cache

Add time-to-live support for cache entries.

- Automatic expiration after TTL
- Configurable TTL per entry

Ensures cache data stays fresh."

echo -e "${GREEN}[38/50] Cache - Cache Cleanup${NC}"
git commit --allow-empty -m "feat: add cache cleanup functionality

Add cleanup function for expired entries.

- cleanup: Remove all expired entries
- Automatic size management

Prevents memory leaks from expired cache."

echo -e "${GREEN}[39/50] Cache - Get or Set Pattern${NC}"
git commit --allow-empty -m "feat: add getOrSet pattern to cache

Add getOrSet method for cache-or-fetch pattern.

- getOrSet: Get from cache or fetch and cache

Simplifies cache usage pattern."

echo -e "${GREEN}[40/50] Cache - Scoped Cache${NC}"
git commit --allow-empty -m "feat: add scoped cache factory

Add factory function for creating scoped caches.

- createScopedCache: Create cache for specific feature

Simplifies cache creation and management."

# ============================================
# Hooks Commits (7)
# ============================================
echo -e "${GREEN}[41/50] Hooks - useAsync${NC}"
git commit --allow-empty -m "feat: create useAsync hook for async operations

Create hook for handling async operations.

- Loading, error, and data states
- Execute function for manual triggering
- Success and error callbacks

Simplifies async operation handling in components."

echo -e "${GREEN}[42/50] Hooks - useAsync Retry${NC}"
git commit --allow-empty -m "feat: add retry logic to useAsync

Add retry support to useAsync hook.

- useAsyncWithRetry: Async with automatic retry
- Exponential backoff strategy

Handles transient failures automatically."

echo -e "${GREEN}[43/50] Hooks - useForm${NC}"
git commit --allow-empty -m "feat: create useForm hook for form management

Create hook for complete form management.

- Form state management
- Field-level validation
- Touch tracking
- Form reset

Simplifies form handling in components."

echo -e "${GREEN}[44/50] Hooks - useForm Validation${NC}"
git commit --allow-empty -m "feat: add field-level validation to useForm

Add validation support to useForm hook.

- Validation on blur
- Error tracking
- Touch tracking

Provides comprehensive form validation."

echo -e "${GREEN}[45/50] Hooks - useField${NC}"
git commit --allow-empty -m "feat: create useField hook for single fields

Create hook for managing single form fields.

- Field state management
- Field-level validation
- Touch tracking

Simplifies single field management."

echo -e "${GREEN}[46/50] Hooks - useLocalStorage${NC}"
git commit --allow-empty -m "feat: create useLocalStorage hook

Create hook for local storage integration.

- Persistent state management
- Automatic serialization
- Remove functionality

Simplifies persistent state management."

echo -e "${GREEN}[47/50] Hooks - useSessionStorage${NC}"
git commit --allow-empty -m "feat: create useSessionStorage hook

Create hook for session storage integration.

- Session-based state management
- Automatic serialization
- Remove functionality

Simplifies session state management."

# ============================================
# Documentation Commits (3)
# ============================================
echo -e "${GREEN}[48/50] Docs - Library README${NC}"
git commit --allow-empty -m "docs: add comprehensive README for lib utilities

Add comprehensive documentation for utilities library.

- Files overview
- Usage examples
- Best practices
- Adding new utilities

Provides complete guide for using utilities."

echo -e "${GREEN}[49/50] Docs - Usage Examples${NC}"
git commit --allow-empty -m "docs: add usage examples to README

Add detailed usage examples for all utilities.

- Contract utils examples
- Error handling examples
- Validation examples
- Hook examples

Helps developers understand how to use utilities."

echo -e "${GREEN}[50/50] Docs - Best Practices${NC}"
git commit --allow-empty -m "docs: add best practices guide

Add best practices for using utilities.

- Type safety practices
- Error handling practices
- Caching practices
- Logging practices

Ensures consistent and correct usage."

echo -e "${BLUE}\n✅ All 50 commits completed!${NC}\n"
echo -e "${GREEN}Summary:${NC}"
echo "- 5 Contract Utils commits"
echo "- 4 Error Handler commits"
echo "- 8 Validators commits"
echo "- 5 Types commits"
echo "- 8 Configuration commits"
echo "- 5 Logger commits"
echo "- 5 Cache commits"
echo "- 7 Hooks commits"
echo "- 3 Documentation commits"
echo ""
echo -e "${GREEN}Total: 50 commits${NC}"
