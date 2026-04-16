import { Cl } from '@stacks/transactions';
import { describe, expect, it, beforeEach } from 'vitest';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;

describe('metric-booster: pulse-n', () => {
  it('increments counter by n', () => {
    simnet.callPublicFn('metric-booster', 'pulse-n', [Cl.uint(50)], wallet1);
    const { result } = simnet.callReadOnlyFn('metric-booster', 'get-counter', [], deployer);
    expect(result).toBeOk(Cl.uint(50));
  });

  it('returns true on success', () => {
    const { result } = simnet.callPublicFn('metric-booster', 'pulse-n', [Cl.uint(10)], wallet1);
    expect(result).toBeOk(Cl.bool(true));
  });

  it('rejects n exceeding MAX-PULSE-AMOUNT (1000)', () => {
    const { result } = simnet.callPublicFn('metric-booster', 'pulse-n', [Cl.uint(1001)], wallet1);
    expect(result).toBeErr(Cl.uint(503));
  });

  it('allows exactly MAX-PULSE-AMOUNT (1000)', () => {
    const { result } = simnet.callPublicFn('metric-booster', 'pulse-n', [Cl.uint(1000)], wallet1);
    expect(result).toBeOk(Cl.bool(true));
  });

  it('rejects pulse-n when paused', () => {
    simnet.callPublicFn('metric-booster', 'toggle-pause', [Cl.bool(true)], deployer);
    const { result } = simnet.callPublicFn('metric-booster', 'pulse-n', [Cl.uint(10)], wallet1);
    expect(result).toBeErr(Cl.uint(502));
  });

  it('accumulates with previous pulses', () => {
    simnet.callPublicFn('metric-booster', 'pulse', [], wallet1);
    simnet.callPublicFn('metric-booster', 'pulse-n', [Cl.uint(9)], wallet1);
    const { result } = simnet.callReadOnlyFn('metric-booster', 'get-counter', [], deployer);
    expect(result).toBeOk(Cl.uint(10));
  });
});
