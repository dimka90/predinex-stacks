import { Cl } from '@stacks/transactions';
import { describe, expect, it, beforeEach } from 'vitest';
const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
describe('Liquidity Incentives - Core Functionality Tests', () => {
    beforeEach(() => {
        simnet.callPublicFn('liquidity-incentives', 'set-authorized-contract', [Cl.principal(deployer)], deployer);
    });
    it('should initialize incentives', () => {
        const { result } = simnet.callPublicFn('liquidity-incentives', 'initialize-pool-incentives', [Cl.uint(1)], deployer);
        expect(result).toBeOk(Cl.uint(1));
    });
    it('should award early bird bonus', () => {
        simnet.callPublicFn('liquidity-incentives', 'initialize-pool-incentives', [Cl.uint(1)], deployer);
        const { result } = simnet.callPublicFn('liquidity-incentives', 'record-bet-and-calculate-early-bird', [Cl.uint(1), Cl.principal(wallet1), Cl.uint(50000000)], deployer);
        expect(result).toBeOk(Cl.uint(7500000));
    });
    it('should provide system reports', () => {
        const result = simnet.callReadOnlyFn('liquidity-incentives', 'get-system-incentive-report', [], deployer);
        expect((result.result as any).value['is-paused'].type).toBe('false');
    });
});
