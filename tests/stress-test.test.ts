import { Clarinet, Tx, Chain, Account, types } from "https://deno.land/x/clarinet@v1.0.0/index.ts";
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";

Clarinet.test({
  name: "Stress Test: Create 50 pools rapidly",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const poolCount = 50;
    const block = chain.mineBlock(
      Array.from({ length: poolCount }, (_, i) =>
        Tx.contractCall(
          "predinex-pool",
          "create-pool",
          [
            types.utf8(`Pool ${i + 1}`),
            types.utf8(`Description for pool ${i + 1}`),
            types.utf8("Yes"),
            types.utf8("No"),
            types.uint(1000)
          ],
          deployer.address
        )
      )
    );

    assertEquals(block.receipts.length, poolCount);
    block.receipts.forEach((receipt, i) => {
      receipt.result.expectOk().expectUint(i);
    });
  },
});

Clarinet.test({
  name: "Stress Test: 100 concurrent bets on single pool",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const bettors = Array.from({ length: 100 }, (_, i) => 
      accounts.get(`wallet_${i + 1}`) || accounts.get("deployer")!
    );
    
    // Create pool first
    const createBlock = chain.mineBlock([
      Tx.contractCall(
        "predinex-pool",
        "create-pool",
        [
          types.utf8("Stress Test Pool"),
          types.utf8("Testing concurrent bets"),
          types.utf8("Yes"),
          types.utf8("No"),
          types.uint(10000)
        ],
        deployer.address
      )
    ]);
    const poolId = createBlock.receipts[0].result.expectOk().expectUint(0);

    // Place 100 bets concurrently
    const betAmount = 1000000; // 1 STX
    const betBlock = chain.mineBlock(
      bettors.map((bettor, i) =>
        Tx.contractCall(
          "predinex-pool",
          "place-bet",
          [
            types.uint(poolId),
            types.uint(i % 2), // Alternate outcomes
            types.uint(betAmount)
          ],
          bettor.address
        )
      )
    );

    assertEquals(betBlock.receipts.length, 100);
    betBlock.receipts.forEach((receipt) => {
      receipt.result.expectOk().expectBool(true);
    });

    // Verify pool totals
    const poolResult = chain.callReadOnlyFn(
      "predinex-pool",
      "get-pool",
      [types.uint(poolId)],
      deployer.address
    );
    const pool = poolResult.result.expectSome().expectTuple();
    const totalA = pool["total-a"].expectUint();
    const totalB = pool["total-b"].expectUint();
    assertEquals(totalA + totalB, BigInt(100000000)); // 100 bets * 1 STX
  },
});

Clarinet.test({
  name: "Stress Test: Multiple pools with many bets each",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const poolCount = 10;
    const betsPerPool = 20;
    
    // Create 10 pools
    const createBlock = chain.mineBlock(
      Array.from({ length: poolCount }, (_, i) =>
        Tx.contractCall(
          "predinex-pool",
          "create-pool",
          [
            types.utf8(`Multi-Bet Pool ${i + 1}`),
            types.utf8(`Pool with many bets ${i + 1}`),
            types.utf8("Outcome A"),
            types.utf8("Outcome B"),
            types.uint(5000)
          ],
          deployer.address
        )
      )
    );

    // Place bets on all pools
    const betAmount = 500000; // 0.5 STX
    const allBets: any[] = [];
    
    for (let poolId = 0; poolId < poolCount; poolId++) {
      for (let betIdx = 0; betIdx < betsPerPool; betIdx++) {
        const bettor = accounts.get(`wallet_${(betIdx % 10) + 1}`) || deployer;
        allBets.push(
          Tx.contractCall(
            "predinex-pool",
            "place-bet",
            [
              types.uint(poolId),
              types.uint(betIdx % 2),
              types.uint(betAmount)
            ],
            bettor.address
          )
        );
      }
    }

    // Mine bets in batches to avoid block size limits
    const batchSize = 50;
    for (let i = 0; i < allBets.length; i += batchSize) {
      const batch = allBets.slice(i, i + batchSize);
      const betBlock = chain.mineBlock(batch);
      betBlock.receipts.forEach((receipt) => {
        receipt.result.expectOk();
      });
    }

    // Verify all pools have correct totals
    for (let poolId = 0; poolId < poolCount; poolId++) {
      const poolResult = chain.callReadOnlyFn(
        "predinex-pool",
        "get-pool",
        [types.uint(poolId)],
        deployer.address
      );
      const pool = poolResult.result.expectSome().expectTuple();
      const totalA = pool["total-a"].expectUint();
      const totalB = pool["total-b"].expectUint();
      assertEquals(totalA + totalB, BigInt(betsPerPool * betAmount));
    }
  },
});

Clarinet.test({
  name: "Stress Test: Settlement and claims under load",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const bettorCount = 30;
    
    // Create pool
    const createBlock = chain.mineBlock([
      Tx.contractCall(
        "predinex-pool",
        "create-pool",
        [
          types.utf8("Settlement Stress Test"),
          types.utf8("Testing settlement under load"),
          types.utf8("Winner"),
          types.utf8("Loser"),
          types.uint(1000)
        ],
        deployer.address
      )
    ]);
    const poolId = createBlock.receipts[0].result.expectOk().expectUint(0);

    // Place bets from multiple users
    const betAmount = 1000000;
    const bettors = Array.from({ length: bettorCount }, (_, i) =>
      accounts.get(`wallet_${i + 1}`) || deployer
    );
    
    const betBlock = chain.mineBlock(
      bettors.map((bettor, i) =>
        Tx.contractCall(
          "predinex-pool",
          "place-bet",
          [
            types.uint(poolId),
            types.uint(i < bettorCount / 2 ? 0 : 1), // Half bet on each outcome
            types.uint(betAmount)
          ],
          bettor.address
        )
      )
    );

    // Settle pool
    chain.mineBlock([
      Tx.contractCall(
        "predinex-pool",
        "settle-pool",
        [types.uint(poolId), types.uint(0)], // Outcome 0 wins
        deployer.address
      )
    ]);

    // Claim winnings concurrently
    const winners = bettors.slice(0, Math.floor(bettorCount / 2));
    const claimBlock = chain.mineBlock(
      winners.map((winner) =>
        Tx.contractCall(
          "predinex-pool",
          "claim-winnings",
          [types.uint(poolId)],
          winner.address
        )
      )
    );

    assertEquals(claimBlock.receipts.length, winners.length);
    claimBlock.receipts.forEach((receipt) => {
      receipt.result.expectOk().expectBool(true);
    });
  },
});

