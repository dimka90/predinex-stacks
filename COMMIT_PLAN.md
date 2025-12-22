# Git Commit Plan - 50+ Commits for Predinex Improvements

This document outlines the 50+ commits that will be made to improve the Predinex project.

## Utility Files Created (8 files)

### 1. Contract Utilities
- **Commit 1**: feat: add contract-utils for STX/microSTX conversion
- **Commit 2**: feat: add amount formatting utilities to contract-utils
- **Commit 3**: feat: add odds calculation to contract-utils
- **Commit 4**: feat: add winnings calculation to contract-utils
- **Commit 5**: feat: add validation helpers to contract-utils

### 2. Error Handling
- **Commit 6**: feat: create error-handler with custom error classes
- **Commit 7**: feat: add error parsing and formatting to error-handler
- **Commit 8**: feat: add retry logic with exponential backoff
- **Commit 9**: feat: add centralized error logging

### 3. Validators
- **Commit 10**: feat: add pool title validation
- **Commit 11**: feat: add pool description validation
- **Commit 12**: feat: add outcome validation
- **Commit 13**: feat: add duration validation
- **Commit 14**: feat: add bet amount validation
- **Commit 15**: feat: add Stacks address validation
- **Commit 16**: feat: add withdrawal amount validation
- **Commit 17**: feat: add comprehensive form validation

### 4. Type Definitions
- **Commit 18**: feat: add status enums to types
- **Commit 19**: feat: add data structure interfaces
- **Commit 20**: feat: add transaction types
- **Commit 21**: feat: add portfolio types
- **Commit 22**: feat: add API response types

### 5. Configuration
- **Commit 23**: feat: add bet configuration constants
- **Commit 24**: feat: add pool configuration constants
- **Commit 25**: feat: add withdrawal configuration
- **Commit 26**: feat: add API configuration
- **Commit 27**: feat: add UI configuration
- **Commit 28**: feat: add error messages configuration
- **Commit 29**: feat: add success messages configuration
- **Commit 30**: feat: add feature flags

### 6. Logger
- **Commit 31**: feat: create centralized logger utility
- **Commit 32**: feat: add log level support
- **Commit 33**: feat: add context-based logging
- **Commit 34**: feat: add log export functionality
- **Commit 35**: feat: add scoped logger factory

### 7. Cache
- **Commit 36**: feat: create client-side cache utility
- **Commit 37**: feat: add TTL support to cache
- **Commit 38**: feat: add cache cleanup functionality
- **Commit 39**: feat: add getOrSet pattern to cache
- **Commit 40**: feat: add scoped cache factory

### 8. Custom Hooks
- **Commit 41**: feat: create useAsync hook for async operations
- **Commit 42**: feat: add retry logic to useAsync
- **Commit 43**: feat: create useForm hook for form management
- **Commit 44**: feat: add field-level validation to useForm
- **Commit 45**: feat: create useField hook for single fields
- **Commit 46**: feat: create useLocalStorage hook
- **Commit 47**: feat: create useSessionStorage hook

### 9. Documentation
- **Commit 48**: docs: add comprehensive README for lib utilities
- **Commit 49**: docs: add usage examples to README
- **Commit 50**: docs: add best practices guide

## Additional Improvements (Optional - 10+ more commits)

### Frontend Component Improvements
- **Commit 51**: refactor: update BettingSection to use contract-utils
- **Commit 52**: refactor: add validation to BettingSection
- **Commit 53**: refactor: improve error handling in BettingSection
- **Commit 54**: refactor: update CreatePool to use validators
- **Commit 55**: refactor: add logging to CreatePool

### Dashboard Improvements
- **Commit 56**: refactor: update dashboard to use new hooks
- **Commit 57**: refactor: add caching to dashboard data
- **Commit 58**: refactor: improve error handling in dashboard
- **Commit 59**: refactor: add logging to dashboard

### API Integration
- **Commit 60**: refactor: update stacks-api to use error-handler
- **Commit 61**: refactor: add caching to stacks-api
- **Commit 62**: refactor: add logging to stacks-api

## Summary

- **Total Commits**: 50+ (62 with optional improvements)
- **Files Created**: 8 utility files + 1 README
- **Lines of Code**: ~2,500+ lines of well-documented code
- **Coverage**: Utilities, hooks, configuration, documentation

## Commit Strategy

Each commit will:
1. Add a single, focused feature or improvement
2. Include clear, descriptive commit message
3. Be atomic and self-contained
4. Include relevant code comments
5. Follow project conventions

## Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentation
- `test`: Tests
- `chore`: Build, dependencies, etc.

Example:
```
feat: add contract-utils for STX/microSTX conversion

Add utility functions for converting between STX and microSTX amounts.
Includes proper type safety and error handling.

- stxToMicroStx: Convert STX to microSTX
- microStxToStx: Convert microSTX to STX
- formatStxAmount: Format for display

Closes #123
```
