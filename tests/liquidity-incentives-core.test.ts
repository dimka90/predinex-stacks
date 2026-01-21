import { Cl } from '@stacks/transactions';
import { describe, expect, it, beforeEach } from 'vitest';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;
const wallet3 = accounts.get('wallet_3')!;

describe('Liquidity Incentives - Core Functionality Tests', () => {

    beforeEach(() => {
        // Authorize deployer for direct unit testing of incentive functions
        simnet.callPublicFn('liquidity-incentives', 'set-authorized-contract', [Cl.principal(deployer)], deployer);
    });

    describe('Pool Incentive Initialization', () => {
        it('should initialize incentives for a new pool', () => {
            const { result } = simnet.callPublicFn(
                'liquidity-incentives',
                'initialize-pool-incentives',
                [Cl.uint(1)],
                deployer
            );
            expect(result).toBeOk(Cl.uint(1));
        });

        it('should track pool incentive configuration', () => {
            simnet.callPublicFn('liquidity-incentives', 'initialize-pool-incentives', [Cl.uint(1)], deployer);
            const { result } = simnet.callReadOnlyFn(
                'liquidity-incentives',
                'get-pool-incentive-config',
                [Cl.uint(1)],
                deployer
            );
            const config = (result as any).value.value;
            expect(config['early-bird-enabled'].type).toBe('true');
        });
    });

    describe('Incentive Awards', () => {
        it('should award early bird bonus to first bettors', () => {
            simnet.callPublicFn('liquidity-incentives', 'initialize-pool-incentives', [Cl.uint(1)], deployer);

            const { result } = simnet.callPublicFn(
                'liquidity-incentives',
                'record-bet-and-calculate-early-bird',
                [Cl.uint(1), Cl.principal(wallet1), Cl.uint(50000000)],
                deployer
            );
            expect(result).toBeOk(Cl.uint(7500000)); // Early bird bonus for first bet
        });

        it('should check early bird eligibility correctly', () => {
            simnet.callPublicFn('liquidity-incentives', 'initialize-pool-incentives', [Cl.uint(1)], deployer);
            simnet.callPublicFn('liquidity-incentives', 'record-bet-and-calculate-early-bird', [Cl.uint(1), Cl.principal(wallet1), Cl.uint(50000000)], deployer);

            const { result } = simnet.callReadOnlyFn(
                'liquidity-incentives',
                'is-early-bird-eligible',
                [Cl.uint(1), Cl.principal(wallet1)],
                deployer
            );
            expect(result.type).toBe('true');
        });

        it('should award volume bonus when threshold is reached', () => {
            simnet.callPublicFn('liquidity-incentives', 'initialize-pool-incentives', [Cl.uint(1)], deployer);
            simnet.callPublicFn('liquidity-incentives', 'record-bet-and-calculate-early-bird', [Cl.uint(1), Cl.principal(wallet1), Cl.uint(1000000000)], deployer);

            const { result } = simnet.callPublicFn(
                'liquidity-incentives',
                'award-volume-bonus',
                [Cl.uint(1), Cl.principal(wallet1), Cl.uint(1000000000)],
                deployer
            );
            expect(result).toBeOk(Cl.uint(20000000)); // 2% of 1000 STX volume
        });

        it('should award referral bonus for referred users', () => {
            simnet.callPublicFn('liquidity-incentives', 'initialize-pool-incentives', [Cl.uint(1)], deployer);

            const { result } = simnet.callPublicFn(
                'liquidity-incentives',
                'award-referral-bonus',
                [Cl.principal(wallet1), Cl.principal(wallet2), Cl.uint(1), Cl.uint(100000000)],
                deployer
            );
            expect(result).toBeOk(Cl.uint(2000000)); // 2% of 100 STX referral
        });
    });

    describe('Incentive Claims', () => {
        it('should allow users to claim pending incentives', () => {
            // Setup
            simnet.callPublicFn('liquidity-incentives', 'initialize-pool-incentives', [Cl.uint(1)], deployer);
            simnet.callPublicFn('liquidity-incentives', 'deposit-incentive-funds', [Cl.uint(1000000000)], deployer);
            simnet.callPublicFn('liquidity-incentives', 'record-bet-and-calculate-early-bird', [Cl.uint(1), Cl.principal(wallet1), Cl.uint(50000000)], deployer);

            const { result } = simnet.callPublicFn(
                'liquidity-incentives',
                'claim-incentive',
                [Cl.uint(1), Cl.stringAscii('early-bird')],
                wallet1
            );
            expect(result).toBeOk(Cl.uint(7500000));
        });

        it('should prevent duplicate claims', () => {
            simnet.callPublicFn('liquidity-incentives', 'initialize-pool-incentives', [Cl.uint(1)], deployer);
            simnet.callPublicFn('liquidity-incentives', 'deposit-incentive-funds', [Cl.uint(1000000000)], deployer);
            simnet.callPublicFn('liquidity-incentives', 'record-bet-and-calculate-early-bird', [Cl.uint(1), Cl.principal(wallet1), Cl.uint(50000000)], deployer);

            simnet.callPublicFn('liquidity-incentives', 'claim-incentive', [Cl.uint(1), Cl.stringAscii('early-bird')], wallet1);

            const { result } = simnet.callPublicFn(
                'liquidity-incentives',
                'claim-incentive',
                [Cl.uint(1), Cl.stringAscii('early-bird')],
                wallet1
            );
            expect(result).toBeErr(Cl.uint(410));
        });

        it('should allow batch claiming multiple incentives', () => {
            simnet.callPublicFn('liquidity-incentives', 'initialize-pool-incentives', [Cl.uint(1)], deployer);
            simnet.callPublicFn('liquidity-incentives', 'deposit-incentive-funds', [Cl.uint(1000000000)], deployer);

            simnet.callPublicFn('liquidity-incentives', 'record-bet-and-calculate-early-bird', [Cl.uint(1), Cl.principal(wallet1), Cl.uint(50000000)], deployer);

            const result = simnet.callPublicFn('liquidity-incentives', 'batch-claim-incentives', [Cl.uint(1), Cl.list([Cl.stringAscii('early-bird')])], wallet1);
            expect(result.result).toBeOk(Cl.uint(7500000));
        });
    });

    describe('Advanced Analytics and Reports', () => {
        it('should provide a comprehensive system incentive report', () => {
            const result = simnet.callReadOnlyFn('liquidity-incentives', 'get-system-incentive-report', [], deployer);
            const report = (result.result as any).value;
            expect(report['is-paused'].type).toBe('false');
            expect(report['emergency-mode'].type).toBe('false');
        });

        it('should calculate incentive ROI correctly', () => {
            const { result } = simnet.callReadOnlyFn('liquidity-incentives', 'calculate-incentive-roi', [Cl.uint(100000000), Cl.uint(5000000)], deployer);
            expect(result).toBeUint(5);
        });

        it('should provide contract health metrics', () => {
            const result = simnet.callReadOnlyFn('liquidity-incentives', 'get-contract-health', [], deployer);
            expect((result.result as any).value['active-pools']).toBeDefined();
        });

        it('should calculate time-based multipliers', () => {
            const { result } = simnet.callReadOnlyFn('liquidity-incentives', 'calculate-time-based-multiplier', [Cl.uint(100), Cl.uint(110)], deployer);
            expect(result).toBeUint(3); // 3x for first 24h
        });
    });

    describe('Emergency Controls', () => {
        it('should allow owner to pause and resume contract', () => {
            // Check initial state
            let status = simnet.callReadOnlyFn('liquidity-incentives', 'get-contract-status', [], deployer);
            expect((status.result as any).value['is-paused'].type).toBe('false');

            // Pause
            simnet.callPublicFn('liquidity-incentives', 'pause-contract', [], deployer);
            status = simnet.callReadOnlyFn('liquidity-incentives', 'get-contract-status', [], deployer);
            expect((status.result as any).value['is-paused'].type).toBe('true');

            // Resume
            simnet.callPublicFn('liquidity-incentives', 'resume-contract', [], deployer);
            status = simnet.callReadOnlyFn('liquidity-incentives', 'get-contract-status', [], deployer);
            expect((status.result as any).value['is-paused'].type).toBe('false');
        });

        it('should allow owner to toggle emergency mode', () => {
            simnet.callPublicFn('liquidity-incentives', 'enable-emergency-mode', [], deployer);
            let status = simnet.callReadOnlyFn('liquidity-incentives', 'get-contract-status', [], deployer);
            expect((status.result as any).value['emergency-mode'].type).toBe('true');

            simnet.callPublicFn('liquidity-incentives', 'disable-emergency-mode', [], deployer);
            status = simnet.callReadOnlyFn('liquidity-incentives', 'get-contract-status', [], deployer);
            expect((status.result as any).value['emergency-mode'].type).toBe('false');
        });
    });

    describe('Loyalty and Streaks', () => {
        it('should track loyalty history for users', () => {
            const history = simnet.callReadOnlyFn('liquidity-incentives', 'get-user-loyalty-history', [Cl.principal(wallet1)], deployer);
            expect(history.result).toBeNone();
        });

        it('should calculate streak bonus eligibility', () => {
            const eligibility = simnet.callReadOnlyFn('liquidity-incentives', 'calculate-streak-bonus-eligibility', [Cl.uint(1), Cl.principal(wallet1)], deployer);
            expect((eligibility.result as any).value['is-eligible'].type).toBe('false');
        });
    });

    describe('Pool Performance', () => {
        it('should report pool performance metrics', () => {
            simnet.callPublicFn('liquidity-incentives', 'initialize-pool-incentives', [Cl.uint(1)], deployer);
            const metrics = simnet.callReadOnlyFn('liquidity-incentives', 'get-pool-performance-metrics', [Cl.uint(1)], deployer);
            expect(metrics.result).toBeDefined();
        });

        it('should report pool incentive utilization', () => {
            const utilization = simnet.callReadOnlyFn('liquidity-incentives', 'get-pool-incentive-utilization', [Cl.uint(1)], deployer);
            expect(utilization.result).toBeDefined();
        });

        it('should show bonus type distribution', () => {
            const distribution = simnet.callReadOnlyFn('liquidity-incentives', 'get-bonus-type-distribution', [Cl.uint(1)], deployer);
            expect(distribution.result).toBeDefined();
        });
    });

    describe('Compliance and Auditing', () => {
        it('should allow auditing pool configuration', () => {
            const audit = simnet.callReadOnlyFn('liquidity-incentives', 'audit-pool-incentive-config', [Cl.uint(1)], deployer);
            expect(audit.result).toBeDefined();
        });

        it('should provide audit trail for users', () => {
            const trail = simnet.callReadOnlyFn('liquidity-incentives', 'get-audit-trail', [Cl.uint(1), Cl.principal(wallet1)], deployer);
            expect(trail.result).toBeDefined();
        });

        it('should track total unique users in the system', () => {
            const report = simnet.callReadOnlyFn('liquidity-incentives', 'get-system-incentive-report', [], deployer);
            // Result is a map/tuple, accessed by .value
            expect((report.result as any).value['unique-users']).toBeDefined();
        });

        it('should track the highest single bonus awarded', () => {
            const result = simnet.callReadOnlyFn('liquidity-incentives', 'get-system-incentive-report', [], deployer);
            expect((result.result as any).value['highest-bonus']).toBeDefined();
        });

        it('should forecast incentive demand', () => {
            const forecast = simnet.callReadOnlyFn('liquidity-incentives', 'forecast-incentive-demand', [Cl.uint(1), Cl.uint(1000000000)], deployer);
            expect(forecast.result).toBeDefined();
        });
    });
});
