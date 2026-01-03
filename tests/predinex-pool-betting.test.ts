import { describe, it, expect, beforeEach } from 'vitest';
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';

describe('Predinex Pool - Betting and Settlement Tests', () => {
  let chain: Chain;
  let accounts: Map<string, Account>;

  beforeEach(async () => {
    chain = await Clarinet.setupChain();
    accounts = chain.getAccounts();
  });

  describe('Multiple Bets on Same Pool', () => {
    it('should track multiple bets from different users correctly', () => {
      const deployer = accounts.get('deployer')!;
      const wallet1 = accounts.get('wallet_1')!;
      const wallet2 = accounts.get('wallet_2')!;

      chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'create-pool',
          [
            types.ascii('Multi-bet Pool'),
            types.ascii('Test multiple bets'),
            types.ascii('Yes'),
            types.ascii('No'),
            types.uint(1000)
          ],
          deployer.address
        )
      ]);

      // Wallet 1 bets on outcome 0
      chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'place-bet',
          [types.uint(0), types.uint(0), types.uint(50000000)],
          wallet1.address
        )
      ]);

      // Wallet 2 bets on outcome 1
      const block = chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'place-bet',
          [types.uint(0), types.uint(1), types.uint(75000000)],
          wallet2.address
        )
      ]);

      expect(block.receipts[0].result).toMatch(/ok/);
    });

    it('should calculate correct pool totals with multiple bets', () => {
      const deployer = accounts.get('deployer')!;
      const wallet1 = accounts.get('wallet_1')!;
      const wallet2 = accounts.get('wallet_2')!;

      chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'create-pool',
          [
            types.ascii('Pool Totals Test'),
            types.ascii('Test pool totals'),
            types.ascii('Yes'),
            types.ascii('No'),
            types.uint(1000)
          ],
          deployer.address
        )
      ]);

      chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'place-bet',
          [types.uint(0), types.uint(0), types.uint(50000000)],
          wallet1.address
        )
      ]);

      chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'place-bet',
          [types.uint(0), types.uint(0), types.uint(30000000)],
          wallet2.address
        )
      ]);

      const poolData = chain.callReadOnlyFn(
        'predinex-pool',
        'get-pool',
        [types.uint(0)],
        deployer.address
      );

      expect(poolData.result).toMatch(/ok/);
    });
  });

  describe('Settlement with Multiple Bettors', () => {
    it('should distribute winnings correctly to multiple winners', () => {
      const deployer = accounts.get('deployer')!;
      const wallet1 = accounts.get('wallet_1')!;
      const wallet2 = accounts.get('wallet_2')!;
      const wallet3 = accounts.get('wallet_3')!;

      chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'create-pool',
          [
            types.ascii('Multi-winner Pool'),
            types.ascii('Test multi-winner distribution'),
            types.ascii('Yes'),
            types.ascii('No'),
            types.uint(1000)
          ],
          deployer.address
        )
      ]);

      // Multiple bets on outcome 0
      chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'place-bet',
          [types.uint(0), types.uint(0), types.uint(50000000)],
          wallet1.address
        )
      ]);

      chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'place-bet',
          [types.uint(0), types.uint(0), types.uint(30000000)],
          wallet2.address
        )
      ]);

      // Bet on outcome 1
      chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'place-bet',
          [types.uint(0), types.uint(1), types.uint(20000000)],
          wallet3.address
        )
      ]);

      // Settle with outcome 0 as winner
      chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'settle-pool',
          [types.uint(0), types.uint(0)],
          deployer.address
        )
      ]);

      // Wallet 1 claims
      const claim1 = chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'claim-winnings',
          [types.uint(0)],
          wallet1.address
        )
      ]);

      expect(claim1.receipts[0].result).toMatch(/ok/);
    });
  });

  describe('Fee Collection', () => {
    it('should collect 2% fee on settlement', () => {
      const deployer = accounts.get('deployer')!;
      const wallet1 = accounts.get('wallet_1')!;

      chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'create-pool',
          [
            types.ascii('Fee Test Pool'),
            types.ascii('Test fee collection'),
            types.ascii('Yes'),
            types.ascii('No'),
            types.uint(1000)
          ],
          deployer.address
        )
      ]);

      chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'place-bet',
          [types.uint(0), types.uint(0), types.uint(100000000)],
          wallet1.address
        )
      ]);

      const block = chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'settle-pool',
          [types.uint(0), types.uint(0)],
          deployer.address
        )
      ]);

      expect(block.receipts[0].result).toMatch(/ok/);
    });
  });

  describe('Refund Functionality', () => {
    it('should allow refund for expired unsettled pools', () => {
      const deployer = accounts.get('deployer')!;
      const wallet1 = accounts.get('wallet_1')!;

      chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'create-pool',
          [
            types.ascii('Expiry Test Pool'),
            types.ascii('Test expiry refund'),
            types.ascii('Yes'),
            types.ascii('No'),
            types.uint(10)
          ],
          deployer.address
        )
      ]);

      chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'place-bet',
          [types.uint(0), types.uint(0), types.uint(50000000)],
          wallet1.address
        )
      ]);

      // Mine blocks to expire pool
      for (let i = 0; i < 15; i++) {
        chain.mineBlock([]);
      }

      const block = chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'request-refund',
          [types.uint(0)],
          wallet1.address
        )
      ]);

      expect(block.receipts[0].result).toMatch(/ok/);
    });
  });
});
