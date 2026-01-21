import { Cl } from '@stacks/transactions';
import { describe, expect, it, beforeEach } from 'vitest';
const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;
describe('Predinex Pool - Betting Logic Tests', () => {
    beforeEach(() => {
        simnet.callPublicFn('liquidity-incentives', 'set-authorized-contract', [Cl.principal(deployer + '.predinex-pool')], deployer);
    });
    it('should handle multi-user betting', () => {
        simnet.callPublicFn('predinex-pool', 'create-pool', [Cl.stringAscii('M'), Cl.stringAscii('D'), Cl.stringAscii('A'), Cl.stringAscii('B'), Cl.uint(1000)], deployer);
        simnet.callPublicFn('predinex-pool', 'place-bet', [Cl.uint(1), Cl.uint(0), Cl.uint(50000000)], wallet1);
        simnet.callPublicFn('predinex-pool', 'place-bet', [Cl.uint(1), Cl.uint(0), Cl.uint(30000000)], wallet2);
        const { result } = simnet.callReadOnlyFn('predinex-pool', 'get-pool-details', [Cl.uint(1)], deployer);
        expect((result as any).value.value['total-a'].value.toString()).toBe('80000000');
    });
    it('should distribute winnings correctly', () => {
        simnet.callPublicFn('predinex-pool', 'create-pool', [Cl.stringAscii('W'), Cl.stringAscii('D'), Cl.stringAscii('A'), Cl.stringAscii('B'), Cl.uint(1000)], deployer);
        simnet.callPublicFn('predinex-pool', 'place-bet', [Cl.uint(1), Cl.uint(0), Cl.uint(100000000)], wallet1);
        simnet.callPublicFn('predinex-pool', 'place-bet', [Cl.uint(1), Cl.uint(1), Cl.uint(100000000)], wallet2);
        simnet.callPublicFn('predinex-pool', 'settle-pool', [Cl.uint(1), Cl.uint(0)], deployer);
        const { result } = simnet.callPublicFn('predinex-pool', 'claim-winnings', [Cl.uint(1)], wallet1);
        expect(result).toBeOk(Cl.uint(196000000));
    });
});
