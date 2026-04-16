import { Cl } from '@stacks/transactions';
import { describe, expect, it, beforeEach } from 'vitest';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;

describe('liquidity-incentives: record-bet-and-calculate-early-bird', () => {
  beforeEach(() => {
    simnet.callPublicFn('liquidity-incentives', 'set-authorized-contract',
      [Cl.principal(deployer + '.predinex-pool')], deployer);
    simnet.callPublicFn('predinex-pool', 'create-pool', [
      Cl.stringAscii('Early Bird Pool'), Cl.stringAscii('Desc'),
      Cl.stringAscii('Yes'), Cl.stringAscii('No'), Cl.uint(1000)
    ], deployer);
  });

  it('records bet tracking when placing a bet', () => {
    simnet.callPublicFn('predinex-pool', 'place-bet',
      [Cl.uint(1), Cl.uint(0), Cl.uint(10000000)], wallet1);
    // Verify bet tracking was updated via pool bet info
    const { result } = simnet.callReadOnlyFn('predinex-pool', 'get-user-bet',
      [Cl.uint(1), Cl.principal(wallet1)], deployer);
    const bet = (result as any).value.value;
    expect(bet['amount-a'].value).toBe(10000000n);
  });

  it('rejects early bird call from unauthorized contract', () => {
    const { result } = simnet.callPublicFn('liquidity-incentives',
      'record-bet-and-calculate-early-bird', [
        Cl.uint(1),
        Cl.principal(wallet1),
        Cl.uint(10000000)
      ], wallet2);
    expect(result).toBeErr(Cl.uint(401));
  });

  it('rejects early bird for bet below minimum amount', () => {
    // Directly call with authorized wallet to test minimum bet check
    simnet.callPublicFn('liquidity-incentives', 'set-authorized-contract',
      [Cl.principal(wallet2)], deployer);
    const { result } = simnet.callPublicFn('liquidity-incentives',
      'record-bet-and-calculate-early-bird', [
        Cl.uint(1),
        Cl.principal(wallet1),
        Cl.uint(100)
      ], wallet2);
    expect(result).toBeErr(Cl.uint(405));
  });

  it('multiple bets accumulate in tracking', () => {
    simnet.callPublicFn('predinex-pool', 'place-bet',
      [Cl.uint(1), Cl.uint(0), Cl.uint(10000000)], wallet1);
    simnet.callPublicFn('predinex-pool', 'place-bet',
      [Cl.uint(1), Cl.uint(0), Cl.uint(10000000)], wallet1);
    const { result } = simnet.callReadOnlyFn('predinex-pool', 'get-user-bet',
      [Cl.uint(1), Cl.principal(wallet1)], deployer);
    const bet = (result as any).value.value;
    expect(bet['amount-a'].value).toBe(20000000n);
  });
});
