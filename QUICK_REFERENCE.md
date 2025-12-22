# Quick Reference - Predinex Utilities

## Contract Utils

```typescript
import { stxToMicroStx, microStxToStx, formatStxAmount, calculateOdds } from '@/lib/contract-utils';

// Conversions
const microStx = stxToMicroStx(10); // 10,000,000
const stx = microStxToStx(10000000); // 10
const formatted = formatStxAmount(10000000); // "10.00 STX"

// Calculations
const odds = calculateOdds(5000000, 10000000); // 50%
const winnings = calculatePotentialWinnings(1000000, 5000000, 5000000); // ~1,000,000
const profitLoss = calculateProfitLoss(1000000, 1500000); // 500,000
```

## Error Handling

```typescript
import { parseContractError, retryWithBackoff, logError } from '@/lib/error-handler';

// Parse errors
try {
  await contractCall();
} catch (error) {
  const message = parseContractError(error);
  logError('ContractCall', error);
}

// Retry with backoff
const result = await retryWithBackoff(() => fetchData(), 3, 1000);
```

## Validation

```typescript
import { validatePoolCreationForm, validateBetAmount } from '@/lib/validators';

// Single field validation
const validation = validateBetAmount(10);
if (!validation.valid) console.error(validation.error);

// Form validation
const result = validatePoolCreationForm({
  title: 'Bitcoin Price',
  description: 'Will Bitcoin reach $100k?',
  outcomeA: 'Yes',
  outcomeB: 'No',
  duration: 144,
});

if (!result.valid) {
  console.error(result.errors); // { title: '', description: '', ... }
}
```

## Types

```typescript
import { PoolStatus, BetStatus, ClaimStatus, PoolData, UserBetData } from '@/lib/types';

const pool: PoolData = {
  id: 1,
  title: 'Bitcoin Price',
  status: PoolStatus.ACTIVE,
  // ...
};

const bet: UserBetData = {
  poolId: 1,
  status: BetStatus.ACTIVE,
  claimStatus: ClaimStatus.UNCLAIMED,
  // ...
};
```

## Configuration

```typescript
import { BET_CONFIG, POOL_CONFIG, ERROR_MESSAGES } from '@/lib/config';

const minBet = BET_CONFIG.MINIMUM_BET; // 0.1
const maxDuration = POOL_CONFIG.MAXIMUM_DURATION; // 1,000,000
const errorMsg = ERROR_MESSAGES.INSUFFICIENT_BALANCE;
```

## Logger

```typescript
import { createScopedLogger } from '@/lib/logger';

const log = createScopedLogger('MyComponent');

log.debug('Debug message', { data: 'value' });
log.info('Info message', { data: 'value' });
log.warn('Warning message', { data: 'value' });
log.error('Error message', { data: 'value' });
```

## Cache

```typescript
import { createScopedCache } from '@/lib/cache';

const poolCache = createScopedCache('pools');

// Set
poolCache.set('pool-1', poolData, 5 * 60 * 1000);

// Get
const cached = poolCache.get('pool-1');

// Get or set
const data = await poolCache.getOrSet('pool-1', () => fetchPool(1));

// Clear
poolCache.clear();
```

## Hooks

### useAsync

```typescript
import { useAsync } from '@/lib/hooks/useAsync';

const { data, loading, error, execute } = useAsync(
  () => fetchPools(),
  {
    onSuccess: (data) => console.log('Success', data),
    onError: (error) => console.error('Error', error),
    immediate: true,
  }
);

// Manual execution
await execute();
```

### useForm

```typescript
import { useForm } from '@/lib/hooks/useForm';

const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm({
  initialValues: { title: '', amount: 0 },
  validate: (values) => {
    const errors = {};
    if (!values.title) errors.title = 'Required';
    return errors;
  },
  onSubmit: async (values) => {
    console.log('Submit', values);
  },
});

// In JSX
<form onSubmit={handleSubmit}>
  <input
    name="title"
    value={values.title}
    onChange={handleChange}
    onBlur={handleBlur}
  />
  {touched.title && errors.title && <span>{errors.title}</span>}
</form>
```

### useField

```typescript
import { useField } from '@/lib/hooks/useForm';

const field = useField('', (value) => {
  if (!value) return 'Required';
  if (value.length < 5) return 'Too short';
});

<input
  value={field.value}
  onChange={field.handleChange}
  onBlur={field.handleBlur}
/>
{field.touched && field.error && <span>{field.error}</span>}
```

### useLocalStorage

```typescript
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';

const [user, setUser, removeUser] = useLocalStorage('user', null);

// Set
setUser({ id: 1, name: 'John' });

// Get
console.log(user); // { id: 1, name: 'John' }

// Remove
removeUser();
```

## Common Patterns

### Form with Validation

```typescript
import { useForm } from '@/lib/hooks/useForm';
import { validatePoolCreationForm } from '@/lib/validators';

const { values, errors, handleChange, handleSubmit } = useForm({
  initialValues: {
    title: '',
    description: '',
    outcomeA: '',
    outcomeB: '',
    duration: 144,
  },
  validate: (values) => {
    const result = validatePoolCreationForm(values);
    return result.errors;
  },
  onSubmit: async (values) => {
    // Create pool
  },
});
```

### Async Data Fetching

```typescript
import { useAsync } from '@/lib/hooks/useAsync';
import { createScopedCache } from '@/lib/cache';

const poolCache = createScopedCache('pools');

const { data: pools, loading, error } = useAsync(
  () => poolCache.getOrSet('all', () => fetchPools()),
  { immediate: true }
);
```

### Error Handling

```typescript
import { parseContractError, logError } from '@/lib/error-handler';
import { createScopedLogger } from '@/lib/logger';

const log = createScopedLogger('BettingComponent');

try {
  await placeBet();
} catch (error) {
  const message = parseContractError(error);
  logError('PlaceBet', error);
  log.error('Bet failed', { message });
}
```

## File Locations

- **Utilities**: `web/app/lib/`
- **Hooks**: `web/app/lib/hooks/`
- **Types**: `web/app/lib/types.ts`
- **Config**: `web/app/lib/config.ts`
- **Documentation**: `web/app/lib/README.md`

## Import Paths

```typescript
// Utilities
import { ... } from '@/lib/contract-utils';
import { ... } from '@/lib/error-handler';
import { ... } from '@/lib/validators';
import { ... } from '@/lib/logger';
import { ... } from '@/lib/cache';

// Hooks
import { ... } from '@/lib/hooks/useAsync';
import { ... } from '@/lib/hooks/useForm';
import { ... } from '@/lib/hooks/useLocalStorage';

// Types & Config
import { ... } from '@/lib/types';
import { ... } from '@/lib/config';
```

## Tips

1. Always use scoped loggers for better debugging
2. Use validators before sending data to contract
3. Cache frequently accessed data
4. Use useForm for all form inputs
5. Handle errors consistently with error-handler
6. Use TypeScript types for better IDE support
7. Check feature flags before using new features
8. Use retry logic for network operations
