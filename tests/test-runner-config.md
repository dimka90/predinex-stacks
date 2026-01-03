# Test Runner Configuration

## Known Issues and Fixes

### Issue: Circular Dependency in predinex-pool.clar

**Error:**
```
error: detected interdependent functions (find-provider-id-by-address, filter-events-by-type, find-provider-by-address...)
```

**Root Cause:**
The `predinex-pool.clar` contract has duplicate function definitions that create circular dependencies:
- `find-provider-id-by-address` is defined twice (lines 1363 and 1542)
- `get-provider-id-by-address` is defined twice (lines 1357 and 1536)

**Fix Required:**
Remove duplicate function definitions from the contract. The functions should only be defined once.

### Workaround for Testing

Until the contract is fixed, you can:

1. **Test individual contracts separately:**
   ```bash
   clarinet test --filter predinex-pool-core
   ```

2. **Use Clarinet check to validate:**
   ```bash
   clarinet check
   ```

3. **Run tests for other contracts:**
   ```bash
   npm run test -- tests/liquidity-incentives-core.test.ts
   ```

## Test Execution Strategy

### Phase 1: Contract Validation
```bash
clarinet check
```
This validates all Clarity contracts for syntax and dependency issues.

### Phase 2: Unit Tests
```bash
npm run test
```
Runs all Vitest unit tests for contracts.

### Phase 3: Integration Tests
```bash
npm run test -- tests/*-comprehensive.test.ts
```
Runs comprehensive integration tests.

## Test File Structure

```
tests/
├── predinex-pool-core.test.ts          # Core pool functionality
├── predinex-pool-betting.test.ts       # Betting and settlement
├── liquidity-incentives-core.test.ts   # Incentives system
└── README.md                            # Test documentation
```

## Running Tests Successfully

### Option 1: Fix Contract First
1. Remove duplicate functions from `contracts/predinex-pool.clar`
2. Run `clarinet check` to validate
3. Run `npm run test`

### Option 2: Test Individual Components
```bash
# Test specific file
npm run test -- tests/predinex-pool-core.test.ts

# Test with pattern
npm run test -- --grep "Pool Creation"
```

## Expected Test Results

Once contract is fixed, you should see:
```
✓ tests/predinex-pool-core.test.ts (15 tests)
✓ tests/predinex-pool-betting.test.ts (12 tests)
✓ tests/liquidity-incentives-core.test.ts (18 tests)

Test Files  3 passed (3)
     Tests  45 passed (45)
```

## Next Steps

1. **Fix Contract:** Remove duplicate function definitions
2. **Validate:** Run `clarinet check`
3. **Test:** Run `npm run test`
4. **Report:** Generate coverage with `npm run test:report`
