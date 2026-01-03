import { describe, it, expect, beforeEach } from 'vitest';
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';

describe('Liquidity Incentives - Core Functionality Tests', () => {
  let chain: Chain;
  let accounts: Map<string, Account>;

  beforeEach(async () => {
    chain = await Clarinet.setupChain();
    accounts = chain.getAccounts();
  });

  describe('Pool Incentive Initialization', () => {
    it('should initialize incentives for a new pool', () => {
      const deployer = accounts.get('deployer')!;

      const block = chain.mineBlock([
        Tx.contractCall(
          'liquidity-incentives',
          'initialize-pool-incentives',
          [types.uint(0)],
          deployer.address
        )
      ]);

      expect(block.receipts[0].result).toMatch(/ok/);
    });

    it('should track pool incentive configuration', () => {
      const deployer = accounts.get('deployer')!;

      chain.mineBlock([
        Tx.contractCall(
          'liquidity-incentives',
          'initialize-pool-incentives',
          [types.uint(0)],
          deployer.address
        )
      ]);

      const config = chain.callReadOnlyFn(
        'liquidity-incentives',
        'get-pool-incentive-config',
        [types.uint(0)],
        deployer.address
      );

      expect(config.result).toMatch(/ok/);
    });
  });

  describe('Early Bird Bonus', () => {
    it('should award early bird bonus to first bettors', () => {
      const deployer = accounts.get('deployer')!;
      const wallet1 = accounts.get('wallet_1')!;

      chain.mineBlock([
        Tx.contractCall(
          'liquidity-incentives',
          'initialize-pool-incentives',
          [types.uint(0)],
          deployer.address
        )
      ]);

      const block = chain.mineBlock([
        Tx.contractCall(
          'liquidity-incentives',
          'record-bet-and-calculate-early-bird',
          [types.uint(0), types.principal(wallet1.address), types.uint(50000000)],
          deployer.address
        )
      ]);

      expect(block.receipts[0].result).toMatch(/ok/);
    });

    it('should check early bird eligibility correctly', () => {
      const deployer = accounts.get('deployer')!;
      const wallet1 = accounts.get('wallet_1')!;

      chain.mineBlock([
        Tx.contractCall(
          'liquidity-incentives',
          'initialize-pool-incentives',
          [types.uint(0)],
          deployer.address
        )
      ]);

      chain.mineBlock([
        Tx.contractCall(
          'liquidity-incentives',
          'record-bet-and-calculate-early-bird',
          [types.uint(0), types.principal(wallet1.address), types.uint(50000000)],
          deployer.address
        )
      ]);

      const eligible = chain.callReadOnlyFn(
        'liquidity-incentives',
        'is-early-bird-eligible',
        [types.uint(0), types.principal(wallet1.address)],
        deployer.address
      );

      expect(eligible.result).toMatch(/true/);
    });
  });

  describe('Volume Bonus', () => {
    it('should award volume bonus when threshold is reached', () => {
      const deployer = accounts.get('deployer')!;
      const wallet1 = accounts.get('wallet_1')!;

      chain.mineBlock([
        Tx.contractCall(
          'liquidity-incentives',
          'initialize-pool-incentives',
          [types.uint(0)],
          deployer.address
        )
      ]);

      chain.mineBlock([
        Tx.contractCall(
          'liquidity-incentives',
          'record-bet-and-calculate-early-bird',
          [types.uint(0), types.principal(wallet1.address), types.uint(1000000000)],
          deployer.address
        )
      ]);

      const block = chain.mineBlock([
        Tx.contractCall(
          'liquidity-incentives',
          'award-volume-bonus',
          [types.uint(0), types.principal(wallet1.address), types.uint(1000000000)],
          deployer.address
        )
      ]);

      expect(block.receipts[0].result).toMatch(/ok/);
    });

    it('should check volume bonus eligibility', () => {
      const deployer = accounts.get('deployer')!;
      const wallet1 = accounts.get('wallet_1')!;

      chain.mineBlock([
        Tx.contractCall(
          'liquidity-incentives',
          'initialize-pool-incentives',
          [types.uint(0)],
          deployer.address
        )
      ]);

      const eligible = chain.callReadOnlyFn(
        'liquidity-incentives',
        'is-volume-bonus-eligible',
        [types.uint(0), types.principal(wallet1.address), types.uint(1000000000)],
        deployer.address
      );

      expect(eligible.result).toMatch(/true/);
    });
  });

  describe('Referral Bonus', () => {
    it('should award referral bonus for referred users', () => {
      const deployer = accounts.get('deployer')!;
      const referrer = accounts.get('wallet_1')!;
      const referred = accounts.get('wallet_2')!;

      chain.mineBlock([
        Tx.contractCall(
          'liquidity-incentives',
          'initialize-pool-incentives',
          [types.uint(0)],
          deployer.address
        )
      ]);

      const block = chain.mineBlock([
        Tx.contractCall(
          'liquidity-incentives',
          'award-referral-bonus',
          [
            types.principal(referrer.address),
            types.principal(referred.address),
            types.uint(0),
            types.uint(50000000)
          ],
          deployer.address
        )
      ]);

      expect(block.receipts[0].result).toMatch(/ok/);
    });

    it('should validate referral eligibility', () => {
      const deployer = accounts.get('deployer')!;
      const referrer = accounts.get('wallet_1')!;
      const referred = accounts.get('wallet_2')!;

      chain.mineBlock([
        Tx.contractCall(
          'liquidity-incentives',
          'initialize-pool-incentives',
          [types.uint(0)],
          deployer.address
        )
      ]);

      const eligible = chain.callReadOnlyFn(
        'liquidity-incentives',
        'can-award-referral-bonus',
        [
          types.principal(referrer.address),
          types.principal(referred.address),
          types.uint(0)
        ],
        deployer.address
      );

      expect(eligible.result).toMatch(/true/);
    });
  });

  describe('Incentive Claims', () => {
    it('should allow users to claim pending incentives', () => {
      const deployer = accounts.get('deployer')!;
      const wallet1 = accounts.get('wallet_1')!;

      chain.mineBlock([
        Tx.contractCall(
          'liquidity-incentives',
          'initialize-pool-incentives',
          [types.uint(0)],
          deployer.address
        )
      ]);

      chain.mineBlock([
        Tx.contractCall(
          'liquidity-incentives',
          'deposit-incentive-funds',
          [types.uint(1000000000)],
          deployer.address
        )
      ]);

      chain.mineBlock([
        Tx.contractCall(
          'liquidity-incentives',
          'record-bet-and-calculate-early-bird',
          [types.uint(0), types.principal(wallet1.address), types.uint(50000000)],
          deployer.address
        )
      ]);

      const block = chain.mineBlock([
        Tx.contractCall(
          'liquidity-incentives',
          'claim-incentive',
          [types.uint(0), types.ascii('early-bird')],
          wallet1.address
        )
      ]);

      expect(block.receipts[0].result).toMatch(/ok/);
    });

    it('should prevent duplicate claims', () => {
      const deployer = accounts.get('deployer')!;
      const wallet1 = accounts.get('wallet_1')!;

      chain.mineBlock([
        Tx.contractCall(
          'liquidity-incentives',
          'initialize-pool-incentives',
          [types.uint(0)],
          deployer.address
        )
      ]);

      chain.mineBlock([
        Tx.contractCall(
          'liquidity-incentives',
          'deposit-incentive-funds',
          [types.uint(1000000000)],
          deployer.address
        )
      ]);

      chain.mineBlock([
        Tx.contractCall(
          'liquidity-incentives',
          'record-bet-and-calculate-early-bird',
          [types.uint(0), types.principal(wallet1.address), types.uint(50000000)],
          deployer.address
        )
      ]);

      chain.mineBlock([
        Tx.contractCall(
          'liquidity-incentives',
          'claim-incentive',
          [types.uint(0), types.ascii('early-bird')],
          wallet1.address
        )
      ]);

      const block = chain.mineBlock([
        Tx.contractCall(
          'liquidity-incentives',
          'claim-incentive',
          [types.uint(0), types.ascii('early-bird')],
          wallet1.address
        )
      ]);

      expect(block.receipts[0].result).toMatch(/err/);
    });
  });
});
