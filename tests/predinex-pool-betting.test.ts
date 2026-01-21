import { Cl } from '@stacks/transactions';
import { describe, expect, it, beforeEach } from 'vitest';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;
const wallet3 = accounts.get('wallet_3')!;

describe('Predinex Pool - Betting Logic Tests', () => {

    beforeEach(() => {
        simnet.callPublicFn('liquidity-incentives', 'set-authorized-contract', [Cl.principal(deployer + '.predinex-pool')], deployer);
    });

    describe('Multi-user Betting', () => {
        it('should handle multiple users betting on same outcome', () => {
            simnet.callPublicFn('predinex-pool', 'create-pool', [
                Cl.stringAscii('Multi User'), Cl.stringAscii('Desc'),
                Cl.stringAscii('A'), Cl.stringAscii('B'), Cl.uint(1000)
            ], deployer);

            simnet.callPublicFn('predinex-pool', 'place-bet', [Cl.uint(1), Cl.uint(0), Cl.uint(50000000)], wallet1);
            simnet.callPublicFn('predinex-pool', 'place-bet', [Cl.uint(1), Cl.uint(0), Cl.uint(30000000)], wallet2);

            const { result } = simnet.callReadOnlyFn('predinex-pool', 'get-pool-details', [Cl.uint(1)], deployer);
            const pool = (result as any).value.value;
            expect(pool['total-a'].value.toString()).toBe('80000000');
        });

        it('should distribute winnings correctly to multiple winners', () => {
            // Setup: Pool with 100 STX on A, 100 STX on B
            simnet.callPublicFn('predinex-pool', 'create-pool', [
                Cl.stringAscii('Winner Dist'), Cl.stringAscii('Desc'),
                Cl.stringAscii('A'), Cl.stringAscii('B'), Cl.uint(1000)
            ], deployer);

            simnet.callPublicFn('predinex-pool', 'place-bet', [Cl.uint(1), Cl.uint(0), Cl.uint(100000000)], wallet1);
            simnet.callPublicFn('predinex-pool', 'place-bet', [Cl.uint(1), Cl.uint(1), Cl.uint(100000000)], wallet2);

            simnet.callPublicFn('predinex-pool', 'settle-pool', [Cl.uint(1), Cl.uint(0)], deployer);

            const claim1 = simnet.callPublicFn('predinex-pool', 'claim-winnings', [Cl.uint(1)], wallet1);
            expect(claim1.result).toBeOk(Cl.uint(196000000)); // (100+100) * 0.98
        });
    });

    describe('Platform Fees', () => {
        it('should correctly track settlement and fee deduction', () => {
            simnet.callPublicFn('predinex-pool', 'create-pool', [
                Cl.stringAscii('Fee Test'), Cl.stringAscii('Desc'),
                Cl.stringAscii('A'), Cl.stringAscii('B'), Cl.uint(1000)
            ], deployer);

            simnet.callPublicFn('predinex-pool', 'place-bet', [Cl.uint(1), Cl.uint(0), Cl.uint(100000000)], wallet1);
            simnet.callPublicFn('predinex-pool', 'place-bet', [Cl.uint(1), Cl.uint(1), Cl.uint(100000000)], wallet2);

            simnet.callPublicFn('predinex-pool', 'settle-pool', [Cl.uint(1), Cl.uint(0)], deployer);

            simnet.callPublicFn('predinex-pool', 'claim-winnings', [Cl.uint(1)], wallet1);

            const { result } = simnet.callReadOnlyFn('predinex-pool', 'get-pool-details', [Cl.uint(1)], deployer);
            expect((result as any).value.value['settled'].type).toBe('true');
        });
    });

    describe('Outcome Validation', () => {
        it('should allow settling outcome A or B', () => {
            simnet.callPublicFn('predinex-pool', 'create-pool', [
                Cl.stringAscii('A/B Test'), Cl.stringAscii('Desc'),
                Cl.stringAscii('A'), Cl.stringAscii('B'), Cl.uint(1000)
            ], deployer);

            const { result } = simnet.callPublicFn('predinex-pool', 'settle-pool', [Cl.uint(1), Cl.uint(1)], deployer);
            expect(result).toBeOk(Cl.bool(true));
        });
    });

    describe('Edge Cases and Winnings', () => {
        it('should allow multiple bets by the same user on different outcomes', () => {
            simnet.callPublicFn('predinex-pool', 'create-pool', [
                Cl.stringAscii('Mixed Bet Pool'), Cl.stringAscii('Desc'),
                Cl.stringAscii('Yes'), Cl.stringAscii('No'), Cl.uint(1000)
            ], deployer);

            simnet.callPublicFn('predinex-pool', 'place-bet', [Cl.uint(1), Cl.uint(0), Cl.uint(50000000)], wallet1);
            const { result } = simnet.callPublicFn('predinex-pool', 'place-bet', [Cl.uint(1), Cl.uint(1), Cl.uint(30000000)], wallet1);

            expect(result).toBeOk(Cl.bool(true));

            const userBet = simnet.callReadOnlyFn('predinex-pool', 'get-user-bet', [Cl.uint(1), Cl.principal(wallet1)], wallet1);
            const val = (userBet.result as any).value.value;
            expect(val['amount-a'].value.toString()).toBe('50000000');
            expect(val['amount-b'].value.toString()).toBe('30000000');
            expect(val['total-bet'].value.toString()).toBe('80000000');
        });

        it('should reject claiming winnings before settlement', () => {
            simnet.callPublicFn('predinex-pool', 'create-pool', [
                Cl.stringAscii('Early Claim Pool'), Cl.stringAscii('Desc'),
                Cl.stringAscii('Yes'), Cl.stringAscii('No'), Cl.uint(1000)
            ], deployer);

            simnet.callPublicFn('predinex-pool', 'place-bet', [Cl.uint(1), Cl.uint(0), Cl.uint(50000000)], wallet1);

            const { result } = simnet.callPublicFn('predinex-pool', 'claim-winnings', [Cl.uint(1)], wallet1);
            expect(result).toBeErr(Cl.uint(412));
        });

        it('should reject claiming if no bet was placed', () => {
            simnet.callPublicFn('predinex-pool', 'create-pool', [
                Cl.stringAscii('No Bet Claim'), Cl.stringAscii('Desc'),
                Cl.stringAscii('Yes'), Cl.stringAscii('No'), Cl.uint(1000)
            ], deployer);

            simnet.callPublicFn('predinex-pool', 'settle-pool', [Cl.uint(1), Cl.uint(0)], deployer);

            const { result } = simnet.callPublicFn('predinex-pool', 'claim-winnings', [Cl.uint(1)], wallet3);
            expect(result).toBeErr(Cl.uint(411));
        });

        it('should reject claiming if bet on losing outcome', () => {
            simnet.callPublicFn('predinex-pool', 'create-pool', [
                Cl.stringAscii('Loser Claim'), Cl.stringAscii('Desc'),
                Cl.stringAscii('Yes'), Cl.stringAscii('No'), Cl.uint(1000)
            ], deployer);

            simnet.callPublicFn('predinex-pool', 'place-bet', [Cl.uint(1), Cl.uint(1), Cl.uint(50000000)], wallet1);
            simnet.callPublicFn('predinex-pool', 'settle-pool', [Cl.uint(1), Cl.uint(0)], deployer);

            const { result } = simnet.callPublicFn('predinex-pool', 'claim-winnings', [Cl.uint(1)], wallet1);
            expect(result).toBeErr(Cl.uint(411));
        });

        it('should handle large pool amounts for fee calculation', () => {
            simnet.callPublicFn('predinex-pool', 'create-pool', [
                Cl.stringAscii('Large Pool'), Cl.stringAscii('Desc'),
                Cl.stringAscii('Yes'), Cl.stringAscii('No'), Cl.uint(1000)
            ], deployer);

            simnet.callPublicFn('predinex-pool', 'place-bet', [Cl.uint(1), Cl.uint(0), Cl.uint(1000000000000)], wallet1);

            const { result } = simnet.callPublicFn('predinex-pool', 'settle-pool', [Cl.uint(1), Cl.uint(0)], deployer);
            expect(result).toBeOk(Cl.bool(true));
        });

        it('should track pool volume correctly across multiple bets', () => {
            simnet.callPublicFn('predinex-pool', 'create-pool', [
                Cl.stringAscii('Volume Pool'), Cl.stringAscii('Desc'),
                Cl.stringAscii('Yes'), Cl.stringAscii('No'), Cl.uint(1000)
            ], deployer);

            simnet.callPublicFn('predinex-pool', 'place-bet', [Cl.uint(1), Cl.uint(0), Cl.uint(50000000)], wallet1);
            simnet.callPublicFn('predinex-pool', 'place-bet', [Cl.uint(1), Cl.uint(1), Cl.uint(50000000)], wallet2);

            const poolDetails = simnet.callReadOnlyFn('predinex-pool', 'get-pool-details', [Cl.uint(1)], deployer);
            const pool = (poolDetails.result as any).value.value;
            expect(pool['total-a'].value.toString()).toBe('50000000');
            expect(pool['total-b'].value.toString()).toBe('50000000');
        });

        it('should enforce pool expiry constraints for betting', () => {
            simnet.callPublicFn('predinex-pool', 'create-pool', [
                Cl.stringAscii('Expiry Pool'), Cl.stringAscii('Desc'),
                Cl.stringAscii('Yes'), Cl.stringAscii('No'), Cl.uint(10)
            ], deployer);

            // Advance blocks
            simnet.mineEmptyBlocks(20);

            const { result } = simnet.callPublicFn('predinex-pool', 'place-bet', [Cl.uint(1), Cl.uint(0), Cl.uint(50000000)], wallet1);
            expect(result).toBeErr(Cl.uint(422));
        });

        it('should correctly report pool creation data', () => {
            simnet.callPublicFn('predinex-pool', 'create-pool', [
                Cl.stringAscii('Metadata Pool'), Cl.stringAscii('Desc'),
                Cl.stringAscii('Yes'), Cl.stringAscii('No'), Cl.uint(1000)
            ], deployer);

            const { result } = simnet.callReadOnlyFn('predinex-pool', 'get-creation-data', [Cl.uint(1)], deployer);
            expect((result as any).value.value['creator'].value).toBe(deployer);
        });
    });
});
