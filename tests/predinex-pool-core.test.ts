import { describe, it, expect } from 'vitest';
import { Cl } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;

describe('Predinex Pool - Core Functionality Tests', () => {

    describe('Pool Creation', () => {
        it('should create a new prediction pool with valid parameters', () => {
            const { result } = simnet.callPublicFn(
                'predinex-pool',
                'create-pool',
                [
                    Cl.stringAscii('Will Bitcoin reach $100k?'),
                    Cl.stringAscii('Prediction market for Bitcoin price milestone'),
                    Cl.stringAscii('Yes'),
                    Cl.stringAscii('No'),
                    Cl.uint(1000)
                ],
                deployer
            );

            expect(result).toBeOk(Cl.uint(0));
        });

        it('should reject pool creation with empty title', () => {
            const { result } = simnet.callPublicFn(
                'predinex-pool',
                'create-pool',
                [
                    Cl.stringAscii(''),
                    Cl.stringAscii('Description'),
                    Cl.stringAscii('Yes'),
                    Cl.stringAscii('No'),
                    Cl.uint(1000)
                ],
                deployer
            );

            expect(result).toBeErr(Cl.uint(420));
        });

        it('should reject pool creation with invalid duration', () => {
            const { result } = simnet.callPublicFn(
                'predinex-pool',
                'create-pool',
                [
                    Cl.stringAscii('Test Pool'),
                    Cl.stringAscii('Description'),
                    Cl.stringAscii('Yes'),
                    Cl.stringAscii('No'),
                    Cl.uint(0)
                ],
                deployer
            );

            expect(result).toBeErr(Cl.uint(420));
        });
    });

    describe('Betting Functionality', () => {
        it('should allow users to place bets on a pool', () => {
            simnet.callPublicFn(
                'predinex-pool',
                'create-pool',
                [
                    Cl.stringAscii('Test Pool'),
                    Cl.stringAscii('Description'),
                    Cl.stringAscii('Yes'),
                    Cl.stringAscii('No'),
                    Cl.uint(1000)
                ],
                deployer
            );

            const { result } = simnet.callPublicFn(
                'predinex-pool',
                'place-bet',
                [
                    Cl.uint(0),
                    Cl.uint(0),
                    Cl.uint(50000000)
                ],
                wallet1
            );

            expect(result).toBeOk(Cl.tuple({ "early-bettor": Cl.bool(true), "market-maker": Cl.bool(false) }));
        });

        it('should reject bets below minimum amount', () => {
            simnet.callPublicFn(
                'predinex-pool',
                'create-pool',
                [
                    Cl.stringAscii('Test Pool'),
                    Cl.stringAscii('Description'),
                    Cl.stringAscii('Yes'),
                    Cl.stringAscii('No'),
                    Cl.uint(1000)
                ],
                deployer
            );

            const { result } = simnet.callPublicFn(
                'predinex-pool',
                'place-bet',
                [
                    Cl.uint(0),
                    Cl.uint(0),
                    Cl.uint(1000)
                ],
                wallet1
            );

            expect(result).toBeErr(Cl.uint(422));
        });

        it('should reject bets on invalid outcomes', () => {
            simnet.callPublicFn(
                'predinex-pool',
                'create-pool',
                [
                    Cl.stringAscii('Test Pool'),
                    Cl.stringAscii('Description'),
                    Cl.stringAscii('Yes'),
                    Cl.stringAscii('No'),
                    Cl.uint(1000)
                ],
                deployer
            );

            const { result } = simnet.callPublicFn(
                'predinex-pool',
                'place-bet',
                [
                    Cl.uint(0),
                    Cl.uint(5),
                    Cl.uint(50000000)
                ],
                wallet1
            );

            expect(result).toBeErr(Cl.uint(422));
        });
    });

    describe('Pool Settlement', () => {
        it('should allow pool creator to settle pool with winning outcome', () => {
            simnet.callPublicFn(
                'predinex-pool',
                'create-pool',
                [
                    Cl.stringAscii('Test Pool'),
                    Cl.stringAscii('Description'),
                    Cl.stringAscii('Yes'),
                    Cl.stringAscii('No'),
                    Cl.uint(1000)
                ],
                deployer
            );

            simnet.callPublicFn(
                'predinex-pool',
                'place-bet',
                [
                    Cl.uint(0),
                    Cl.uint(0),
                    Cl.uint(50000000)
                ],
                wallet1
            );

            const { result } = simnet.callPublicFn(
                'predinex-pool',
                'settle-pool',
                [
                    Cl.uint(0),
                    Cl.uint(0)
                ],
                deployer
            );

            expect(result).toBeOk(Cl.bool(true));
        });

        it('should reject settlement by non-creator', () => {
            simnet.callPublicFn(
                'predinex-pool',
                'create-pool',
                [
                    Cl.stringAscii('Test Pool'),
                    Cl.stringAscii('Description'),
                    Cl.stringAscii('Yes'),
                    Cl.stringAscii('No'),
                    Cl.uint(1000)
                ],
                deployer
            );

            const { result } = simnet.callPublicFn(
                'predinex-pool',
                'settle-pool',
                [
                    Cl.uint(0),
                    Cl.uint(0)
                ],
                wallet1
            );

            expect(result).toBeErr(Cl.uint(401));
        });
    });

    describe('Winnings Claim', () => {
        it('should allow winners to claim their winnings', () => {
            simnet.callPublicFn(
                'predinex-pool',
                'create-pool',
                [
                    Cl.stringAscii('Test Pool'),
                    Cl.stringAscii('Description'),
                    Cl.stringAscii('Yes'),
                    Cl.stringAscii('No'),
                    Cl.uint(1000)
                ],
                deployer
            );

            simnet.callPublicFn(
                'predinex-pool',
                'place-bet',
                [
                    Cl.uint(0),
                    Cl.uint(0),
                    Cl.uint(50000000)
                ],
                wallet1
            );

            simnet.callPublicFn(
                'predinex-pool',
                'settle-pool',
                [
                    Cl.uint(0),
                    Cl.uint(0)
                ],
                deployer
            );

            const { result } = simnet.callPublicFn(
                'predinex-pool',
                'claim-winnings',
                [Cl.uint(0)],
                wallet1
            );

            expect(result).toBeOk(Cl.uint(49000000));
        });

        it('should reject duplicate claims', () => {
            simnet.callPublicFn(
                'predinex-pool',
                'create-pool',
                [
                    Cl.stringAscii('Test Pool'),
                    Cl.stringAscii('Description'),
                    Cl.stringAscii('Yes'),
                    Cl.stringAscii('No'),
                    Cl.uint(1000)
                ],
                deployer
            );

            simnet.callPublicFn(
                'predinex-pool',
                'place-bet',
                [
                    Cl.uint(0),
                    Cl.uint(0),
                    Cl.uint(50000000)
                ],
                wallet1
            );

            simnet.callPublicFn(
                'predinex-pool',
                'settle-pool',
                [
                    Cl.uint(0),
                    Cl.uint(0)
                ],
                deployer
            );

            simnet.callPublicFn(
                'predinex-pool',
                'claim-winnings',
                [Cl.uint(0)],
                wallet1
            );

            const { result } = simnet.callPublicFn(
                'predinex-pool',
                'claim-winnings',
                [Cl.uint(0)],
                wallet1
            );

            expect(result).toBeErr(Cl.uint(410));
        });
    });
});
