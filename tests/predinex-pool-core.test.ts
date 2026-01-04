import { describe, it, expect, beforeEach } from 'vitest';
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';

describe('Predinex Pool - Core Functionality Tests', () => {
  let chain: Chain;
  let accounts: Map<string, Account>;

  beforeEach(async () => {
    chain = await Clarinet.setupChain();
    accounts = chain.getAccounts();
  });

  describe('Pool Creation', () => {
    it('should create a new prediction pool with valid parameters', () => {
      const deployer = accounts.get('deployer')!;
      
      const block = chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'create-pool',
          [
            types.ascii('Will Bitcoin reach $100k?'),
            types.ascii('Prediction market for Bitcoin price milestone'),
            types.ascii('Yes'),
            types.ascii('No'),
            types.uint(1000)
          ],
          deployer.address
        )
      ]);

      expect(block.receipts.length).toBe(1);
      expect(block.receipts[0].result).toMatch(/ok/);
    });

    it('should reject pool creation with empty title', () => {
      const deployer = accounts.get('deployer')!;
      
      const block = chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'create-pool',
          [
            types.ascii(''),
            types.ascii('Description'),
            types.ascii('Yes'),
            types.ascii('No'),
            types.uint(1000)
          ],
          deployer.address
        )
      ]);

      expect(block.receipts[0].result).toMatch(/err/);
    });

    it('should reject pool creation with invalid duration', () => {
      const deployer = accounts.get('deployer')!;
      
      const block = chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'create-pool',
          [
            types.ascii('Test Pool'),
            types.ascii('Description'),
            types.ascii('Yes'),
            types.ascii('No'),
            types.uint(0)
          ],
          deployer.address
        )
      ]);

      expect(block.receipts[0].result).toMatch(/err/);
    });
  });

  describe('Betting Functionality', () => {
    it('should allow users to place bets on a pool', () => {
      const deployer = accounts.get('deployer')!;
      const wallet1 = accounts.get('wallet_1')!;

      // Create pool
      chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'create-pool',
          [
            types.ascii('Test Pool'),
            types.ascii('Description'),
            types.ascii('Yes'),
            types.ascii('No'),
            types.uint(1000)
          ],
          deployer.address
        )
      ]);

      // Place bet
      const block = chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'place-bet',
          [
            types.uint(0),
            types.uint(0),
            types.uint(50000000)
          ],
          wallet1.address
        )
      ]);

      expect(block.receipts[0].result).toMatch(/ok/);
    });

    it('should reject bets below minimum amount', () => {
      const deployer = accounts.get('deployer')!;
      const wallet1 = accounts.get('wallet_1')!;

      chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'create-pool',
          [
            types.ascii('Test Pool'),
            types.ascii('Description'),
            types.ascii('Yes'),
            types.ascii('No'),
            types.uint(1000)
          ],
          deployer.address
        )
      ]);

      const block = chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'place-bet',
          [
            types.uint(0),
            types.uint(0),
            types.uint(1000)
          ],
          wallet1.address
        )
      ]);

      expect(block.receipts[0].result).toMatch(/err/);
    });

    it('should reject bets on invalid outcomes', () => {
      const deployer = accounts.get('deployer')!;
      const wallet1 = accounts.get('wallet_1')!;

      chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'create-pool',
          [
            types.ascii('Test Pool'),
            types.ascii('Description'),
            types.ascii('Yes'),
            types.ascii('No'),
            types.uint(1000)
          ],
          deployer.address
        )
      ]);

      const block = chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'place-bet',
          [
            types.uint(0),
            types.uint(5),
            types.uint(50000000)
          ],
          wallet1.address
        )
      ]);

      expect(block.receipts[0].result).toMatch(/err/);
    });
  });

  describe('Pool Settlement', () => {
    it('should allow pool creator to settle pool with winning outcome', () => {
      const deployer = accounts.get('deployer')!;
      const wallet1 = accounts.get('wallet_1')!;

      chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'create-pool',
          [
            types.ascii('Test Pool'),
            types.ascii('Description'),
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
          [
            types.uint(0),
            types.uint(0),
            types.uint(50000000)
          ],
          wallet1.address
        )
      ]);

      const block = chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'settle-pool',
          [
            types.uint(0),
            types.uint(0)
          ],
          deployer.address
        )
      ]);

      expect(block.receipts[0].result).toMatch(/ok/);
    });

    it('should reject settlement by non-creator', () => {
      const deployer = accounts.get('deployer')!;
      const wallet1 = accounts.get('wallet_1')!;

      chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'create-pool',
          [
            types.ascii('Test Pool'),
            types.ascii('Description'),
            types.ascii('Yes'),
            types.ascii('No'),
            types.uint(1000)
          ],
          deployer.address
        )
      ]);

      const block = chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'settle-pool',
          [
            types.uint(0),
            types.uint(0)
          ],
          wallet1.address
        )
      ]);

      expect(block.receipts[0].result).toMatch(/err/);
    });
  });

  describe('Winnings Claim', () => {
    it('should allow winners to claim their winnings', () => {
      const deployer = accounts.get('deployer')!;
      const wallet1 = accounts.get('wallet_1')!;

      chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'create-pool',
          [
            types.ascii('Test Pool'),
            types.ascii('Description'),
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
          [
            types.uint(0),
            types.uint(0),
            types.uint(50000000)
          ],
          wallet1.address
        )
      ]);

      chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'settle-pool',
          [
            types.uint(0),
            types.uint(0)
          ],
          deployer.address
        )
      ]);

      const block = chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'claim-winnings',
          [types.uint(0)],
          wallet1.address
        )
      ]);

      expect(block.receipts[0].result).toMatch(/ok/);
    });

    it('should reject duplicate claims', () => {
      const deployer = accounts.get('deployer')!;
      const wallet1 = accounts.get('wallet_1')!;

      chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'create-pool',
          [
            types.ascii('Test Pool'),
            types.ascii('Description'),
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
          [
            types.uint(0),
            types.uint(0),
            types.uint(50000000)
          ],
          wallet1.address
        )
      ]);

      chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'settle-pool',
          [
            types.uint(0),
            types.uint(0)
          ],
          deployer.address
        )
      ]);

      chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'claim-winnings',
          [types.uint(0)],
          wallet1.address
        )
      ]);

      const block = chain.mineBlock([
        Tx.contractCall(
          'predinex-pool',
          'claim-winnings',
          [types.uint(0)],
          wallet1.address
        )
      ]);

      expect(block.receipts[0].result).toMatch(/err/);
    });
  });
});
