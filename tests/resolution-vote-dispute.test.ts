import { Cl } from '@stacks/transactions';
import { describe, expect, it, beforeEach } from 'vitest';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;
const wallet3 = accounts.get('wallet_3')!;

describe('predinex-resolution-engine: vote-on-dispute', () => {
  beforeEach(() => {
    simnet.callPublicFn('liquidity-incentives', 'set-authorized-contract',
      [Cl.principal(deployer + '.predinex-pool')], deployer);
    simnet.callPublicFn('predinex-pool', 'create-pool', [
      Cl.stringAscii('Vote Test'), Cl.stringAscii('Desc'),
      Cl.stringAscii('Yes'), Cl.stringAscii('No'), Cl.uint(1000)
    ], deployer);
    simnet.callPublicFn('predinex-pool', 'place-bet',
      [Cl.uint(1), Cl.uint(0), Cl.uint(100000000)], wallet1);
    simnet.callPublicFn('predinex-pool', 'settle-pool',
      [Cl.uint(1), Cl.uint(1)], deployer);
    simnet.callPublicFn('predinex-resolution-engine', 'create-dispute', [
      Cl.uint(1),
      Cl.stringAscii('Incorrect resolution'),
      Cl.none()
    ], wallet1);
  });

  it('casts a vote for the dispute', () => {
    const { result } = simnet.callPublicFn('predinex-resolution-engine',
      'vote-on-dispute', [Cl.uint(0), Cl.bool(true)], wallet2);
    expect(result).toBeOk(Cl.bool(true));
  });

  it('casts a vote against the dispute', () => {
    const { result } = simnet.callPublicFn('predinex-resolution-engine',
      'vote-on-dispute', [Cl.uint(0), Cl.bool(false)], wallet2);
    expect(result).toBeOk(Cl.bool(true));
  });

  it('rejects double voting from same user', () => {
    simnet.callPublicFn('predinex-resolution-engine',
      'vote-on-dispute', [Cl.uint(0), Cl.bool(true)], wallet2);
    const { result } = simnet.callPublicFn('predinex-resolution-engine',
      'vote-on-dispute', [Cl.uint(0), Cl.bool(false)], wallet2);
    expect(result).toBeErr(Cl.uint(444));
  });

  it('rejects vote on non-existent dispute', () => {
    const { result } = simnet.callPublicFn('predinex-resolution-engine',
      'vote-on-dispute', [Cl.uint(999), Cl.bool(true)], wallet2);
    expect(result).toBeErr(Cl.uint(441));
  });

  it('multiple users can vote on same dispute', () => {
    simnet.callPublicFn('predinex-resolution-engine',
      'vote-on-dispute', [Cl.uint(0), Cl.bool(true)], wallet2);
    const { result } = simnet.callPublicFn('predinex-resolution-engine',
      'vote-on-dispute', [Cl.uint(0), Cl.bool(true)], wallet3);
    expect(result).toBeOk(Cl.bool(true));
  });
});
