import { Cl } from '@stacks/transactions';
import { describe, expect, it, beforeEach } from 'vitest';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;

describe('predinex-oracle-registry: submit-enhanced-oracle-data', () => {
  beforeEach(() => {
    // Register wallet1 as oracle provider
    simnet.callPublicFn('predinex-oracle-registry',
      'register-oracle-provider-with-stake', [
        Cl.principal(wallet1),
        Cl.uint(1000000000),
        Cl.list([Cl.stringAscii('BTC-USD')]),
        Cl.stringAscii('https://provider.example.com')
      ], deployer);
  });

  it('submits oracle data and returns submission id', () => {
    const { result } = simnet.callPublicFn('predinex-oracle-registry',
      'submit-enhanced-oracle-data', [
        Cl.uint(1),
        Cl.stringAscii('100000'),
        Cl.stringAscii('BTC-USD'),
        Cl.uint(90),
        Cl.bufferFromHex('0000000000000000000000000000000000000000000000000000000000000000')
      ], wallet1);
    expect(result).toBeOk(Cl.uint(0));
  });

  it('rejects submission from unregistered provider', () => {
    const { result } = simnet.callPublicFn('predinex-oracle-registry',
      'submit-enhanced-oracle-data', [
        Cl.uint(1),
        Cl.stringAscii('100000'),
        Cl.stringAscii('BTC-USD'),
        Cl.uint(90),
        Cl.bufferFromHex('0000000000000000000000000000000000000000000000000000000000000000')
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
        Cl.bufferFromHex('0000000000000000000000000000000000000000000000000000000000000000')
      ], wallet1);
    expect(result).toBeErr(Cl.uint(434));
  });

  it('rejects submission with unsupported data type', () => {
    const { result } = simnet.callPublicFn('predinex-oracle-registry',
      'submit-enhanced-oracle-data', [
        Cl.uint(1),
        Cl.stringAscii('100000'),
        Cl.stringAscii('UNKNOWN-TYPE'),
        Cl.uint(90),
        Cl.bufferFromHex('0000000000000000000000000000000000000000000000000000000000000000')
      ], wallet1);
    expect(result).toBeErr(Cl.uint(432));
  });

  it('rejects submission when circuit breaker is active', () => {
    simnet.callPublicFn('predinex-oracle-registry', 'trigger-circuit-breaker',
      [Cl.stringAscii('Emergency halt'), Cl.uint(100)], deployer);
    const { result } = simnet.callPublicFn('predinex-oracle-registry',
      'submit-enhanced-oracle-data', [
        Cl.uint(1),
        Cl.stringAscii('100000'),
        Cl.stringAscii('BTC-USD'),
        Cl.uint(90),
        Cl.bufferFromHex('0000000000000000000000000000000000000000000000000000000000000000')
      ], wallet1);
    expect(result).toBeErr(Cl.uint(459));
  });

  it('stores submission data correctly', () => {
    simnet.callPublicFn('predinex-oracle-registry',
      'submit-enhanced-oracle-data', [
        Cl.uint(1),
        Cl.stringAscii('100000'),
        Cl.stringAscii('BTC-USD'),
        Cl.uint(90),
        Cl.bufferFromHex('0000000000000000000000000000000000000000000000000000000000000000')
      ], wallet1);
    const { result } = simnet.callReadOnlyFn('predinex-oracle-registry',
      'get-submission', [Cl.uint(0)], deployer);
    const sub = (result as any).value.value;
    expect(sub['data-value'].value).toBe('100000');
    expect(sub['confidence-score'].value).toBe(90n);
  });
});
