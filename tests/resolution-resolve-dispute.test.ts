import { Cl } from '@stacks/transactions';
import { describe, expect, it, beforeEach } from 'vitest';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;

describe('predinex-resolution-engine: resolve-dispute', () => {
  beforeEach(() => {
    simnet.callPublicFn('liquidity-incentives', 'set-authorized-contract',
      [Cl.principal(deployer + '.predinex-pool')], deployer);
    simnet.callPublicFn('predinex-pool', 'create-pool', [
      Cl.stringAscii('Resolve Test'), Cl.stringAscii('Desc'),
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

  it('rejects resolution before voting deadline', () => {
    const { result } = simnet.callPublicFn('predinex-resolution-engine',
      'resolve-dispute', [Cl.uint(0)], deployer);
    expect(result).toBeErr(Cl.uint(442));
  });

  it('resolves dispute after voting deadline with majority votes for', () => {
    simnet.callPublicFn('predinex-resolution-engine',
      'vote-on-dispute', [Cl.uint(0), Cl.bool(true)], wallet2);
    // Advance blocks past voting deadline (1008 blocks)
    simnet.mineEmptyBlocks(1010);
    const { result } = simnet.callPublicFn('predinex-resolution-engine',
      'resolve-dispute', [Cl.uint(0)], deployer);
    expect(result).toBeOk(Cl.bool(true));
  });

  it('resolves dispute with majority votes against', () => {
    simnet.callPublicFn('predinex-resolution-engine',
      'vote-on-dispute', [Cl.uint(0), Cl.bool(false)], wallet2);
    simnet.mineEmptyBlocks(1010);
    const { result } = simnet.callPublicFn('predinex-resolution-engine',
      'resolve-dispute', [Cl.uint(0)], deployer);
    expect(result).toBeOk(Cl.bool(false));
  });

  it('rejects resolution of non-existent dispute', () => {
    simnet.mineEmptyBlocks(1010);
    const { result } = simnet.callPublicFn('predinex-resolution-engine',
      'resolve-dispute', [Cl.uint(999)], deployer);
    expect(result).toBeErr(Cl.uint(441));
  });
});
