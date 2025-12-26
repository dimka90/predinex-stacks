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

