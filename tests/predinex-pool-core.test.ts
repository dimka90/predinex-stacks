import { Cl } from '@stacks/transactions';
import { describe, expect, it, beforeEach } from 'vitest';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;
const wallet3 = accounts.get('wallet_3')!;

describe('Predinex Pool - Core Functionality Tests', () => {

    beforeEach(() => {
        // Authorize predinex-pool in liquidity-incentives
        simnet.callPublicFn('liquidity-incentives', 'set-authorized-contract', [Cl.principal(deployer + '.predinex-pool')], deployer);
    });

    describe('Pool Creation', () => {
        it('should allow anyone to create a pool', () => {
            const { result } = simnet.callPublicFn(
                'predinex-pool',
                'create-pool',
                [
                    Cl.stringAscii('BTC Price'),
                    Cl.stringAscii('Will BTC be above 100k?'),
                    Cl.stringAscii('Yes'),
                    Cl.stringAscii('No'),
                    Cl.uint(1000)
                ],
                wallet1
            );
            expect(result).toBeOk(Cl.uint(1));
        });

        it('should correctly report pool details', () => {
            simnet.callPublicFn(
                'predinex-pool',
                'create-pool',
                [
                    Cl.stringAscii('ETH Price'),
                    Cl.stringAscii('ETH above 5k?'),
                    Cl.stringAscii('A'),
                    Cl.stringAscii('B'),
                    Cl.uint(500)
                ],
                deployer
            );

            const { result } = simnet.callReadOnlyFn(
                'predinex-pool',
                'get-pool-details',
                [Cl.uint(1)],
                deployer
            );

            const pool = (result as any).value.value;
            expect(pool.title.value).toBe('ETH Price');
            expect(pool.settled.type).toBe('false');
        });
    });

    describe('Betting Operations', () => {
        it('should allow users to place bets', () => {
            simnet.callPublicFn(
                'predinex-pool',
                'create-pool',
                [
                    Cl.stringAscii('Test Pool'),
                    Cl.stringAscii('Desc'),
                    Cl.stringAscii('A'),
                    Cl.stringAscii('B'),
                    Cl.uint(1000)
                ],
                deployer
            );

            const { result } = simnet.callPublicFn(
                'predinex-pool',
                'place-bet',
                [
                    Cl.uint(1),
                    Cl.uint(0),
                    Cl.uint(50000000)
                ],
                wallet1
            );
            expect(result).toBeOk(Cl.bool(true));
        });

        it('should reject bets with zero amount', () => {
            // Setup
            simnet.callPublicFn('predinex-pool', 'create-pool', [
                Cl.stringAscii('Amount Test'), Cl.stringAscii('Desc'),
                Cl.stringAscii('A'), Cl.stringAscii('B'), Cl.uint(1000)
            ], deployer);

            const { result } = simnet.callPublicFn(
                'predinex-pool',
                'place-bet',
                [Cl.uint(1), Cl.uint(0), Cl.uint(0)],
                wallet1
            );
            expect(result).toBeErr(Cl.uint(422)); // Monolithic error in contract
        });
    });

    describe('Pool Settlement', () => {
        it('should allow admin to settle pool', () => {
            simnet.callPublicFn(
                'predinex-pool',
                'create-pool',
                [
                    Cl.stringAscii('Settlement'),
                    Cl.stringAscii('Desc'),
                    Cl.stringAscii('A'),
                    Cl.stringAscii('B'),
                    Cl.uint(1000)
                ],
                deployer
            );

            const { result } = simnet.callPublicFn(
                'predinex-pool',
                'settle-pool',
                [Cl.uint(1), Cl.uint(0)],
                deployer
            );
            expect(result).toBeOk(Cl.bool(true));
        });

        it('should reject settlement from non-admin', () => {
            // Setup
            const { result: createResult } = simnet.callPublicFn('predinex-pool', 'create-pool', [
                Cl.stringAscii('Settlement Fail'), Cl.stringAscii('Desc'),
                Cl.stringAscii('A'), Cl.stringAscii('B'), Cl.uint(1000)
            ], deployer);
            const poolId = (createResult as any).value;

            const { result } = simnet.callPublicFn(
                'predinex-pool',
                'settle-pool',
                [poolId, Cl.uint(0)],
                wallet1
            );
            expect(result).toBeErr(Cl.uint(401));
        });
    });

    describe('Winnings Claims', () => {
        it('should allow winner to claim', () => {
            simnet.callPublicFn('predinex-pool', 'create-pool', [
                Cl.stringAscii('Claim'), Cl.stringAscii('Desc'),
                Cl.stringAscii('A'), Cl.stringAscii('B'), Cl.uint(1000)
            ], deployer);

            simnet.callPublicFn('predinex-pool', 'place-bet', [
                Cl.uint(1), Cl.uint(0), Cl.uint(100000000)
            ], wallet1);

            simnet.callPublicFn('predinex-pool', 'settle-pool', [
                Cl.uint(1), Cl.uint(0)
            ], deployer);

            const { result } = simnet.callPublicFn(
                'predinex-pool',
                'claim-winnings',
                [Cl.uint(1)],
                wallet1
            );
            expect(result).toBeOk(Cl.uint(98000000)); // 100 STX - 2% fee
        });

        it('should prevent double claiming', () => {
            simnet.callPublicFn('predinex-pool', 'create-pool', [
                Cl.stringAscii('Double Claim'), Cl.stringAscii('Desc'),
                Cl.stringAscii('A'), Cl.stringAscii('B'), Cl.uint(1000)
            ], deployer);

            simnet.callPublicFn('predinex-pool', 'place-bet', [
                Cl.uint(1), Cl.uint(0), Cl.uint(100000000)
            ], wallet1);

            simnet.callPublicFn('predinex-pool', 'settle-pool', [
                Cl.uint(1), Cl.uint(0)
            ], deployer);

            simnet.callPublicFn(
                'predinex-pool',
                'claim-winnings',
                [Cl.uint(1)],
                wallet1
            );

            const { result } = simnet.callPublicFn(
                'predinex-pool',
                'claim-winnings',
                [Cl.uint(1)],
                wallet1
            );

            expect(result).toBeErr(Cl.uint(410));
        });
    });

    describe('Admin and Authorization', () => {
        it('should allow owner to set admin status', () => {
            const { result } = simnet.callPublicFn(
                'predinex-pool',
                'set-admin',
                [Cl.principal(wallet1), Cl.bool(true)],
                deployer
            );
            expect(result).toBeOk(Cl.bool(true));
        });

        it('should reject non-owner setting admin status', () => {
            const { result } = simnet.callPublicFn(
                'predinex-pool',
                'set-admin',
                [Cl.principal(wallet1), Cl.bool(true)],
                wallet1
            );
            expect(result).toBeErr(Cl.uint(401));
        });

        it('should allow owner to set authorized resolution engine', () => {
            const { result } = simnet.callPublicFn(
                'predinex-pool',
                'set-authorized-resolution-engine',
                [Cl.principal(wallet1)],
                deployer
            );
            expect(result).toBeOk(Cl.bool(true));
        });

        it('should reject non-owner setting resolution engine', () => {
            const { result } = simnet.callPublicFn(
                'predinex-pool',
                'set-authorized-resolution-engine',
                [Cl.principal(wallet1)],
                wallet1
            );
            expect(result).toBeErr(Cl.uint(401));
        });

        it('should allow authorized resolution engine to settle pool', () => {
            // Setup
            const { result: createResult } = simnet.callPublicFn('predinex-pool', 'create-pool', [
                Cl.stringAscii('Engine Test'), Cl.stringAscii('Desc'),
                Cl.stringAscii('A'), Cl.stringAscii('B'), Cl.uint(1000)
            ], deployer);

            const poolId = (createResult as any).value;

            simnet.callPublicFn('predinex-pool', 'set-authorized-resolution-engine', [Cl.principal(wallet2)], deployer);

            const { result } = simnet.callPublicFn(
                'predinex-pool',
                'settle-pool',
                [poolId, Cl.uint(0)],
                wallet2
            );
            expect(result).toBeOk(Cl.bool(true));
        });
    });
});
