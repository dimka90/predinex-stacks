import { describe, it, expect } from 'vitest';
import { Cl } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;

describe('Liquidity Incentives - Core Functionality Tests', () => {

    describe('Pool Incentive Initialization', () => {
        it('should initialize incentives for a new pool', () => {
            const { result } = simnet.callPublicFn(
                'liquidity-incentives',
                'initialize-pool-incentives',
                [Cl.uint(0)],
                deployer
            );

            expect(result).toBeOk(Cl.bool(true));
        });

        it('should track pool incentive configuration', () => {
            simnet.callPublicFn(
                'liquidity-incentives',
                'initialize-pool-incentives',
                [Cl.uint(0)],
                deployer
            );

            const config = simnet.callReadOnlyFn(
                'liquidity-incentives',
                'get-pool-incentive-config',
                [Cl.uint(0)],
                deployer
            );

            expect(config.result).toBeSome(Cl.tuple({}));
        });
    });

    describe('Early Bird Bonus', () => {
        it('should award early bird bonus to first bettors', () => {
            simnet.callPublicFn(
                'liquidity-incentives',
                'initialize-pool-incentives',
                [Cl.uint(0)],
                deployer
            );

            const { result } = simnet.callPublicFn(
                'liquidity-incentives',
                'record-bet-and-calculate-early-bird',
                [Cl.uint(0), Cl.principal(wallet1), Cl.uint(50000000)],
                deployer
            );

            expect(result).toBeOk(Cl.bool(true));
        });

        it('should check early bird eligibility correctly', () => {
            simnet.callPublicFn(
                'liquidity-incentives',
                'initialize-pool-incentives',
                [Cl.uint(0)],
                deployer
            );

            simnet.callPublicFn(
                'liquidity-incentives',
                'record-bet-and-calculate-early-bird',
                [Cl.uint(0), Cl.principal(wallet1), Cl.uint(50000000)],
                deployer
            );

            const eligible = simnet.callReadOnlyFn(
                'liquidity-incentives',
                'is-early-bird-eligible',
                [Cl.uint(0), Cl.principal(wallet1)],
                deployer
            );

            expect(eligible.result).toBeBool(true);
        });
    });

    describe('Volume Bonus', () => {
        it('should award volume bonus when threshold is reached', () => {
            simnet.callPublicFn(
                'liquidity-incentives',
                'initialize-pool-incentives',
                [Cl.uint(0)],
                deployer
            );

            simnet.callPublicFn(
                'liquidity-incentives',
                'record-bet-and-calculate-early-bird',
                [Cl.uint(0), Cl.principal(wallet1), Cl.uint(1000000000)],
                deployer
            );

            const { result } = simnet.callPublicFn(
                'liquidity-incentives',
                'award-volume-bonus',
                [Cl.uint(0), Cl.principal(wallet1), Cl.uint(1000000000)],
                deployer
            );

            expect(result).toBeOk(Cl.bool(true));
        });
    });

    describe('Referral Bonus', () => {
        it('should award referral bonus for referred users', () => {
            simnet.callPublicFn(
                'liquidity-incentives',
                'initialize-pool-incentives',
                [Cl.uint(0)],
                deployer
            );

            const { result } = simnet.callPublicFn(
                'liquidity-incentives',
                'award-referral-bonus',
                [
                    Cl.principal(wallet1),
                    Cl.principal(wallet2),
                    Cl.uint(0),
                    Cl.uint(50000000)
                ],
                deployer
            );

            expect(result).toBeOk(Cl.bool(true));
        });
    });

    describe('Incentive Claims', () => {
        it('should allow users to claim pending incentives', () => {
            simnet.callPublicFn(
                'liquidity-incentives',
                'initialize-pool-incentives',
                [Cl.uint(0)],
                deployer
            );

            simnet.callPublicFn(
                'liquidity-incentives',
                'deposit-incentive-funds',
                [Cl.uint(1000000000)],
                deployer
            );

            simnet.callPublicFn(
                'liquidity-incentives',
                'record-bet-and-calculate-early-bird',
                [Cl.uint(0), Cl.principal(wallet1), Cl.uint(50000000)],
                deployer
            );

            const { result } = simnet.callPublicFn(
                'liquidity-incentives',
                'claim-incentive',
                [Cl.uint(0), Cl.stringAscii('early-bird')],
                wallet1
            );

            expect(result).toBeOk(Cl.uint(5000000));
        });

        it('should prevent duplicate claims', () => {
            simnet.callPublicFn(
                'liquidity-incentives',
                'initialize-pool-incentives',
                [Cl.uint(0)],
                deployer
            );

            simnet.callPublicFn(
                'liquidity-incentives',
                'deposit-incentive-funds',
                [Cl.uint(1000000000)],
                deployer
            );

            simnet.callPublicFn(
                'liquidity-incentives',
                'record-bet-and-calculate-early-bird',
                [Cl.uint(0), Cl.principal(wallet1), Cl.uint(50000000)],
                deployer
            );

            simnet.callPublicFn(
                'liquidity-incentives',
                'claim-incentive',
                [Cl.uint(0), Cl.stringAscii('early-bird')],
                wallet1
            );

            const { result } = simnet.callPublicFn(
                'liquidity-incentives',
                'claim-incentive',
                [Cl.uint(0), Cl.stringAscii('early-bird')],
                wallet1
            );

            expect(result).toBeErr(Cl.uint(452));
        });
    });
});
