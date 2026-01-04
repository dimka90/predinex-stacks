# Predinex Test Suite

Comprehensive test suite for Predinex smart contracts and core functionality.

## Test Files

### Smart Contract Tests

#### `predinex-pool-core.test.ts`
Tests for core pool functionality:
- Pool creation with validation
- Parameter validation (title, description, duration)
- Error handling for invalid inputs

#### `predinex-pool-betting.test.ts`
Tests for betting and settlement:
- Multiple bets from different users
- Pool total calculations
- Settlement with multiple bettors
- Fee collection (2% on settlement)
- Refund functionality for expired pools

#### `liquidity-incentives-core.test.ts`
Tests for liquidity incentives:
- Pool incentive initialization
- Early bird bonus calculation and eligibility
- Volume bonus awards and eligibility
- Referral bonus tracking
- Incentive claims and duplicate prevention

## Running Tests

### Run all tests
```bash
npm run test
```

### Run specific test file
```bash
npm run test -- tests/predinex-pool-core.test.ts
```

### Run with coverage
```bash
npm run test:report
```

## Test Coverage

The test suite covers:

1. **Pool Management** (15 tests)
   - Creation validation
   - Parameter constraints
   - Error handling

2. **Betting System** (12 tests)
   - Single and multiple bets
   - Outcome validation
   - Minimum bet enforcement

3. **Settlement & Claims** (10 tests)
   - Pool settlement
   - Winnings distribution
   - Duplicate claim prevention

4. **Incentives** (18 tests)
   - Early bird bonuses
   - Volume bonuses
   - Referral bonuses
   - Claim validation

## Key Test Scenarios

### Pool Creation
- ✅ Valid pool creation
- ✅ Empty title rejection
- ✅ Invalid duration rejection

### Betting
- ✅ Valid bet placement
- ✅ Minimum amount enforcement
- ✅ Invalid outcome rejection
- ✅ Multiple bets tracking

### Settlement
- ✅ Creator-only settlement
- ✅ Fee collection
- ✅ Winnings distribution

### Incentives
- ✅ Early bird eligibility
- ✅ Volume threshold detection
- ✅ Referral tracking
- ✅ Claim window validation

## Test Assertions

All tests use standard assertions:
- `expect(result).toMatch(/ok/)` - Success validation
- `expect(result).toMatch(/err/)` - Error validation
- `expect(value).toBe(expected)` - Equality checks

## Future Test Additions

- Edge case testing for large numbers
- Stress testing with many pools
- Oracle integration tests
- Dispute resolution tests
- Cross-contract interaction tests
