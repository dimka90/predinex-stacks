import { Cl } from '@stacks/transactions';
import { describe, expect, it, beforeEach } from 'vitest';
const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;
describe('Predinex Pool - Core Functionality Tests', () => {
    beforeEach(() => {
        simnet.callPublicFn('liquidity-incentives', 'set-authorized-contract', [Cl.principal(deployer + '.predinex-pool')], deployer);
    });
    it('should allow anyone to create a pool', () => {
        const { result } = simnet.callPublicFn('predinex-pool', 'create-pool', [Cl.stringAscii('BTC'), Cl.stringAscii('Dec'), Cl.stringAscii('Y'), Cl.stringAscii('N'), Cl.uint(1000)], wallet1);
        expect(result).toBeOk(Cl.uint(1));
    });
    it('should correctly report pool details', () => {
        simnet.callPublicFn('predinex-pool', 'create-pool', [Cl.stringAscii('ETH'), Cl.stringAscii('Dec'), Cl.stringAscii('A'), Cl.stringAscii('B'), Cl.uint(500)], deployer);
        const { result } = simnet.callReadOnlyFn('predinex-pool', 'get-pool-details', [Cl.uint(1)], deployer);
        const pool = (result as any).value.value;
        expect(pool.title.value).toBe('ETH');
    });
    it('should allow users to place bets', () => {
        simnet.callPublicFn('predinex-pool', 'create-pool', [Cl.stringAscii('T'), Cl.stringAscii('D'), Cl.stringAscii('A'), Cl.stringAscii('B'), Cl.uint(1000)], deployer);
        const { result } = simnet.callPublicFn('predinex-pool', 'place-bet', [Cl.uint(1), Cl.uint(0), Cl.uint(10000)], wallet1);
        expect(result).toBeOk(Cl.bool(true));
    });
    it('should reject bets with zero amount', () => {
        simnet.callPublicFn('predinex-pool', 'create-pool', [Cl.stringAscii('T'), Cl.stringAscii('D'), Cl.stringAscii('A'), Cl.stringAscii('B'), Cl.uint(1000)], deployer);
        const { result } = simnet.callPublicFn('predinex-pool', 'place-bet', [Cl.uint(1), Cl.uint(0), Cl.uint(0)], wallet1);
        expect(result).toBeErr(Cl.uint(422));
    });
    it('should allow winner to claim', () => {
        simnet.callPublicFn('predinex-pool', 'create-pool', [Cl.stringAscii('C'), Cl.stringAscii('D'), Cl.stringAscii('A'), Cl.stringAscii('B'), Cl.uint(1000)], deployer);
        simnet.callPublicFn('predinex-pool', 'place-bet', [Cl.uint(1), Cl.uint(0), Cl.uint(100000000)], wallet1);
        simnet.callPublicFn('predinex-pool', 'settle-pool', [Cl.uint(1), Cl.uint(0)], deployer);
        const { result } = simnet.callPublicFn('predinex-pool', 'claim-winnings', [Cl.uint(1)], wallet1);
        expect(result).toBeOk(Cl.uint(98000000));
    });
    it('should allow owner to set admin status', () => {
        const { result } = simnet.callPublicFn('predinex-pool', 'set-admin', [Cl.principal(wallet1), Cl.bool(true)], deployer);
        expect(result).toBeOk(Cl.bool(true));
    });
    it('should allow authorized resolution engine to settle pool', () => {
        const { result: createResult } = simnet.callPublicFn('predinex-pool', 'create-pool', [Cl.stringAscii('E'), Cl.stringAscii('D'), Cl.stringAscii('A'), Cl.stringAscii('B'), Cl.uint(1000)], deployer);
        const poolId = (createResult as any).value;
        simnet.callPublicFn('predinex-pool', 'set-authorized-resolution-engine', [Cl.principal(wallet2)], deployer);
        const { result } = simnet.callPublicFn('predinex-pool', 'settle-pool', [poolId, Cl.uint(0)], wallet2);
        expect(result).toBeOk(Cl.bool(true));
    });
});
