import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensure that create-pool works",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get("deployer")!;
    
    let block = chain.mineBlock([
      Tx.contractCall(
        "predinex-pool",
        "create-pool",
        [
          types.ascii("Bitcoin vs Ethereum"),
          types.ascii("Will Bitcoin outperform Ethereum?"),
          types.ascii("Bitcoin"),
          types.ascii("Ethereum")
        ],
        deployer.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 2);
  }
});

Clarinet.test({
  name: "Ensure that place-bet works",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get("deployer")!;
    
    // Create pool first
    chain.mineBlock([
      Tx.contractCall(
        "predinex-pool",
        "create-pool",
        [
          types.ascii("Bitcoin vs Ethereum"),
          types.ascii("Will Bitcoin outperform Ethereum?"),
          types.ascii("Bitcoin"),
          types.ascii("Ethereum")
        ],
        deployer.address
      )
    ]);
    
    // Place bet
    let block = chain.mineBlock([
      Tx.contractCall(
        "predinex-pool",
        "place-bet",
        [
          types.uint(0),
          types.uint(0),
          types.uint(1000000)
        ],
        deployer.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
  }
});

Clarinet.test({
  name: "Ensure that settle-pool works",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get("deployer")!;
    
    // Create pool
    chain.mineBlock([
      Tx.contractCall(
        "predinex-pool",
        "create-pool",
        [
          types.ascii("Bitcoin vs Ethereum"),
          types.ascii("Will Bitcoin outperform Ethereum?"),
          types.ascii("Bitcoin"),
          types.ascii("Ethereum")
        ],
        deployer.address
      )
    ]);
    
    // Settle pool
    let block = chain.mineBlock([
      Tx.contractCall(
        "predinex-pool",
        "settle-pool",
        [
          types.uint(0),
          types.uint(0)
        ],
        deployer.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
  }
});
