import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Ensure contract can be initialized",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('liquidity-incentives', 'initialize-pool-incentives', [
                types.uint(1)
            ], deployer.address)
        ]);
        
        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result.expectOk(), types.uint(1));
    },
});
Clarinet.test({
    name: "Test early bird bonus calculation",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const user1 = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('liquidity-incentives', 'initialize-pool-incentives', [
                types.uint(1)
            ], deployer.address),
            Tx.contractCall('liquidity-incentives', 'record-bet-and-calculate-early-bird', [
                types.uint(1),
                types.principal(user1.address),
                types.uint(1000000) // 1 STX
            ], deployer.address)
        ]);
        
        assertEquals(block.receipts.length, 2);
        assertEquals(block.receipts[0].result.expectOk(), types.uint(1));
        block.receipts[1].result.expectOk();
    },
});
Clarinet.test({
    name: "Test unauthorized access prevention",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const user1 = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('liquidity-incentives', 'initialize-pool-incentives', [
                types.uint(1)
            ], user1.address)
        ]);
        
        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectErr(types.uint(401)); // ERR-UNAUTHORIZED
    },
});
Clarinet.test({
    name: "Test volume bonus award functionality",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const user1 = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('liquidity-incentives', 'initialize-pool-incentives', [
                types.uint(1)
            ], deployer.address),
            Tx.contractCall('liquidity-incentives', 'record-bet-and-calculate-early-bird', [
                types.uint(1),
                types.principal(user1.address),
                types.uint(500000000) // 500 STX
            ], deployer.address),
            Tx.contractCall('liquidity-incentives', 'award-volume-bonus', [
                types.uint(1),
                types.principal(user1.address),
                types.uint(1000000000) // 1000 STX pool volume
            ], deployer.address)
        ]);
        
        assertEquals(block.receipts.length, 3);
        block.receipts[2].result.expectOk();
    },
});