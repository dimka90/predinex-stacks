import { describe, it, expect, beforeEach } from 'vitest';
import { Cl } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;
const wallet3 = accounts.get('wallet_3')!;

describe('Predinex Pool - Betting and Settlement Tests', () => {

    beforeEach(() => {
        const poolPrincipal = `${deployer}.predinex-pool`;
        simnet.callPublicFn(
            'liquidity-incentives',
            'set-authorized-contract',
            [Cl.principal(poolPrincipal)],
            deployer
        );
    });

    describe('Multiple Bets on Same Pool', () => {
        it('should track multiple bets from different users correctly', () => {
            simnet.callPublicFn(
                'predinex-pool',
                'create-pool',
                [
                    Cl.stringAscii('Multi-bet Pool'),
                    Cl.stringAscii('Test multiple bets'),
                    Cl.stringAscii('Yes'),
                    Cl.stringAscii('No'),
                    Cl.uint(1000)
                ],
                deployer
            );

            // Wallet 1 bets on outcome 0
            simnet.callPublicFn(
                'predinex-pool',
                'place-bet',
                [Cl.uint(1), Cl.uint(0), Cl.uint(50000000)],
                wallet1
            );

            // Wallet 2 bets on outcome 1
            const { result } = simnet.callPublicFn(
                'predinex-pool',
                'place-bet',
                [Cl.uint(1), Cl.uint(1), Cl.uint(75000000)],
                wallet2
            );

            expect(result).toBeOk(Cl.bool(true));
        });

        it('should calculate correct pool totals with multiple bets', () => {
            const { result: createResult } = simnet.callPublicFn(
                'predinex-pool',
                'create-pool',
                [
                    Cl.stringAscii('Pool Totals Test'),
                    Cl.stringAscii('Test pool totals'),
                    Cl.stringAscii('Yes'),
                    Cl.stringAscii('No'),
                    Cl.uint(1000)
                ],
                deployer
            );
            expect(createResult).toBeOk(Cl.uint(1));

            simnet.callPublicFn(
                'predinex-pool',
                'place-bet',
                [Cl.uint(1), Cl.uint(0), Cl.uint(50000000)],
                wallet1
            );

            simnet.callPublicFn(
                'predinex-pool',
                'place-bet',
                [Cl.uint(1), Cl.uint(0), Cl.uint(30000000)],
                wallet2
            );

            const poolData = simnet.callReadOnlyFn(
                'predinex-pool',
                'get-pool-details',
                [Cl.uint(1)],
                deployer
            );
            const pool = (poolData.result as any).value.value;
            expect(pool['total-a'].value.toString()).toBe('80000000');
            expect(pool['total-b'].value.toString()).toBe('0');
            expect(pool['outcome-a-name'].value).toBe("Yes");
            expect(pool['outcome-b-name'].value).toBe("No");
        });
    });

    describe('Settlement with Multiple Bettors', () => {
        it('should distribute winnings correctly to multiple winners', () => {
            simnet.callPublicFn(
                'predinex-pool',
                'create-pool',
                [
                    Cl.stringAscii('Multi-winner Pool'),
                    Cl.stringAscii('Test multi-winner distribution'),
                    Cl.stringAscii('Yes'),
                    Cl.stringAscii('No'),
                    Cl.uint(1000)
                ],
                deployer
            );

            // Multiple bets on outcome 0
            simnet.callPublicFn(
                'predinex-pool',
                'place-bet',
                [Cl.uint(1), Cl.uint(0), Cl.uint(50000000)],
                wallet1
            );

            simnet.callPublicFn(
                'predinex-pool',
                'place-bet',
                [Cl.uint(1), Cl.uint(0), Cl.uint(30000000)],
                wallet2
            );

            // Bet on outcome 1
            simnet.callPublicFn(
                'predinex-pool',
                'place-bet',
                [Cl.uint(1), Cl.uint(1), Cl.uint(20000000)],
                wallet3
            );

            // Settle with outcome 0 as winner
            simnet.callPublicFn(
                'predinex-pool',
                'settle-pool',
                [Cl.uint(1), Cl.uint(0)],
                deployer
            );

            // Wallet 1 claims
            const { result } = simnet.callPublicFn(
                'predinex-pool',
                'claim-winnings',
                [Cl.uint(1)],
                wallet1
            );

            expect(result).toBeOk(Cl.uint(61250000));
        });
    });

    describe('Fee Collection', () => {
        it('should collect 2% fee on settlement', () => {
            simnet.callPublicFn(
                'predinex-pool',
                'create-pool',
                [
                    Cl.stringAscii('Fee Test Pool'),
                    Cl.stringAscii('Test fee collection'),
                    Cl.stringAscii('Yes'),
                    Cl.stringAscii('No'),
                    Cl.uint(1000)
                ],
                deployer
            );

            simnet.callPublicFn(
                'predinex-pool',
                'place-bet',
                [Cl.uint(1), Cl.uint(0), Cl.uint(100000000)],
                wallet1
            );

            const { result } = simnet.callPublicFn(
                'predinex-pool',
                'settle-pool',
                [Cl.uint(1), Cl.uint(0)],
                deployer
            );

            expect(result).toBeOk(Cl.bool(true));
        });
    });


});
