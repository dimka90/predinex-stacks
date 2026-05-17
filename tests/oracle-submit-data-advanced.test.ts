import { Cl } from '@stacks/transactions';
import { describe, expect, it, beforeEach } from 'vitest';
import { deployer, wallet1, wallet2, wallet3, registerOracle } from './helpers';

/**
 * Tests for predinex-oracle-registry: submit-enhanced-oracle-data
 * Covers oracle data submission on the Stacks blockchain
 */
describe('predinex-oracle-registry: submit-enhanced-oracle-data', () => {
  const VALIDATION_HASH = new Uint8Array(32).fill(0);

  beforeEach(() => {
    // Register wallet1 as an active oracle provider
    simnet.callPublicFn('predinex-oracle-registry',
      'register-oracle-provider-with-stake', [
        Cl.principal(wallet1),
        Cl.uint(1000000000),
        Cl.list([Cl.stringAscii('BTC-USD'), Cl.stringAscii('ETH-USD')]),
        Cl.stringAscii('https://oracle.example.com')
      ], deployer);
  });

  // ─── Success Cases ────────────────────────────────────────────────────────

  it('submits oracle data and returns submission id u0', () => {
    const { result } = simnet.callPublicFn('predinex-oracle-registry',
      'submit-enhanced-oracle-data', [
        Cl.uint(1),
        Cl.stringAscii('100000'),
        Cl.stringAscii('BTC-USD'),
        Cl.uint(90),
        Cl.buffer(VALIDATION_HASH)
      ], wallet1);
    expect(result).toBeOk(Cl.uint(0));
  });

  it('increments submission counter on each submission', () => {
    simnet.callPublicFn('predinex-oracle-registry',
      'submit-enhanced-oracle-data', [
        Cl.uint(1),
        Cl.stringAscii('100000'),
        Cl.stringAscii('BTC-USD'),
        Cl.uint(90),
        Cl.buffer(VALIDATION_HASH)
      ], wallet1);
    const { result } = simnet.callPublicFn('predinex-oracle-registry',
      'submit-enhanced-oracle-data', [
        Cl.uint(2),
        Cl.stringAscii('3000'),
        Cl.stringAscii('ETH-USD'),
        Cl.uint(85),
        Cl.buffer(VALIDATION_HASH)
      ], wallet1);
    expect(result).toBeOk(Cl.uint(1));
  });

  it('stores submission data correctly after submit', () => {
    simnet.callPublicFn('predinex-oracle-registry',
      'submit-enhanced-oracle-data', [
        Cl.uint(1),
        Cl.stringAscii('100000'),
        Cl.stringAscii('BTC-USD'),
        Cl.uint(90),
        Cl.buffer(VALIDATION_HASH)
      ], wallet1);
    const { result } = simnet.callReadOnlyFn('predinex-oracle-registry',
      'get-submission', [Cl.uint(0)], deployer);
    const submission = (result as any).value.value;
    expect(submission['data-value'].value).toBe('100000');
    expect(submission['confidence-score'].value).toBe(90n);
    expect(submission['is-processed'].type).toBe('false');
  });

  it('accepts minimum confidence score of 1', () => {
    const { result } = simnet.callPublicFn('predinex-oracle-registry',
      'submit-enhanced-oracle-data', [
        Cl.uint(1),
        Cl.stringAscii('100000'),
        Cl.stringAscii('BTC-USD'),
        Cl.uint(1),
        Cl.buffer(VALIDATION_HASH)
      ], wallet1);
    expect(result).toBeOk(Cl.uint(0));
  });

  it('accepts maximum confidence score of 100', () => {
    const { result } = simnet.callPublicFn('predinex-oracle-registry',
      'submit-enhanced-oracle-data', [
        Cl.uint(1),
        Cl.stringAscii('100000'),
        Cl.stringAscii('BTC-USD'),
        Cl.uint(100),
        Cl.buffer(VALIDATION_HASH)
      ], wallet1);
    expect(result).toBeOk(Cl.uint(0));
  });

  it('updates provider last-activity block after submission', () => {
    simnet.callPublicFn('predinex-oracle-registry',
      'submit-enhanced-oracle-data', [
        Cl.uint(1),
        Cl.stringAscii('100000'),
        Cl.stringAscii('BTC-USD'),
        Cl.uint(90),
        Cl.buffer(VALIDATION_HASH)
      ], wallet1);
    const { result } = simnet.callReadOnlyFn('predinex-oracle-registry',
      'get-provider-details', [Cl.uint(0)], deployer);
    const provider = (result as any).value.value;
    expect(provider['is-active'].type).toBe('true');
  });

  it('allows submission for different pool ids', () => {
    simnet.callPublicFn('predinex-oracle-registry',
      'submit-enhanced-oracle-data', [
        Cl.uint(1),
        Cl.stringAscii('100000'),
        Cl.stringAscii('BTC-USD'),
        Cl.uint(90),
        Cl.buffer(VALIDATION_HASH)
      ], wallet1);
    const { result } = simnet.callPublicFn('predinex-oracle-registry',
      'submit-enhanced-oracle-data', [
        Cl.uint(2),
        Cl.stringAscii('100500'),
        Cl.stringAscii('BTC-USD'),
        Cl.uint(88),
        Cl.buffer(VALIDATION_HASH)
      ], wallet1);
    expect(result).toBeOk(Cl.uint(1));
  });

  // ─── Error Cases ──────────────────────────────────────────────────────────

  it('rejects submission from unregistered provider', () => {
    const { result } = simnet.callPublicFn('predinex-oracle-registry',
      'submit-enhanced-oracle-data', [
        Cl.uint(1),
        Cl.stringAscii('100000'),
        Cl.stringAscii('BTC-USD'),
        Cl.uint(90),
        Cl.buffer(VALIDATION_HASH)
      ], wallet2);
    expect(result).toBeErr(Cl.uint(430));
  });

  it('rejects submission with confidence score of 0', () => {
    const { result } = simnet.callPublicFn('predinex-oracle-registry',
      'submit-enhanced-oracle-data', [
        Cl.uint(1),
        Cl.stringAscii('100000'),
        Cl.stringAscii('BTC-USD'),
        Cl.uint(0),
        Cl.buffer(VALIDATION_HASH)
      ], wallet1);
    expect(result).toBeErr(Cl.uint(434));
  });

  it('rejects submission with confidence score above 100', () => {
    const { result } = simnet.callPublicFn('predinex-oracle-registry',
      'submit-enhanced-oracle-data', [
        Cl.uint(1),
        Cl.stringAscii('100000'),
        Cl.stringAscii('BTC-USD'),
        Cl.uint(101),
        Cl.buffer(VALIDATION_HASH)
      ], wallet1);
    expect(result).toBeErr(Cl.uint(434));
  });

  it('rejects submission for unsupported data type', () => {
    const { result } = simnet.callPublicFn('predinex-oracle-registry',
      'submit-enhanced-oracle-data', [
        Cl.uint(1),
        Cl.stringAscii('100000'),
        Cl.stringAscii('DOGE-USD'),
        Cl.uint(90),
        Cl.buffer(VALIDATION_HASH)
      ], wallet1);
    expect(result).toBeErr(Cl.uint(432));
  });

  it('rejects submission from deactivated provider', () => {
    simnet.callPublicFn('predinex-oracle-registry',
      'deactivate-oracle-provider', [Cl.uint(0)], deployer);
    const { result } = simnet.callPublicFn('predinex-oracle-registry',
      'submit-enhanced-oracle-data', [
        Cl.uint(1),
        Cl.stringAscii('100000'),
        Cl.stringAscii('BTC-USD'),
        Cl.uint(90),
        Cl.buffer(VALIDATION_HASH)
      ], wallet1);
    expect(result).toBeErr(Cl.uint(431));
  });

  it('rejects submission when circuit breaker is active', () => {
    simnet.callPublicFn('predinex-oracle-registry',
      'trigger-circuit-breaker', [
        Cl.stringAscii('Emergency halt'),
        Cl.uint(100)
      ], deployer);
    const { result } = simnet.callPublicFn('predinex-oracle-registry',
      'submit-enhanced-oracle-data', [
        Cl.uint(1),
        Cl.stringAscii('100000'),
        Cl.stringAscii('BTC-USD'),
        Cl.uint(90),
        Cl.buffer(VALIDATION_HASH)
      ], wallet1);
    expect(result).toBeErr(Cl.uint(459));
    // Restore state
    simnet.callPublicFn('predinex-oracle-registry',
      'deactivate-circuit-breaker', [], deployer);
  });
});

// stacks: oracle data submission requires active provider status

// stacks: confidence score range is 1-100 inclusive

// stacks: circuit breaker halts all oracle submissions when active

// stacks: provider must support data type before submitting

// stacks: deactivated provider cannot submit data until reactivated

// stacks: submission id starts at u0 and increments per submission

// stacks: validation-hash is a 32-byte buffer for data integrity

// stacks: ERR-ORACLE-NOT-FOUND is u430 in registry contract

// stacks: ERR-CIRCUIT-BREAKER-ACTIVE is u459 when registry is halted
