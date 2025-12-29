import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Test double claim prevention",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const user1 = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('liquidity-incentives', 'initialize-pool-incentives', [
                types.uint(1)
            ], deployer.address),
            Tx.contractCall('liquidity-incentives', 'deposit-incentive-funds', [
                types.uint(100000000)
            ], deployer.address),
            Tx.contractCall('liquidity-incentives', 'record-bet-and-calculate-early-bird', [
                types.uint(1),
                types.principal(user1.address),
                types.uint(10000000)
            ], deployer.address)
        ]);
        
        // First claim should succeed
        let claim1 = chain.mineBlock([
            Tx.contractCall('liquidity-incentives', 'claim-incentive', [
                types.uint(1),
                types.ascii("early-bird")
            ], user1.address)
        ]);
        claim1.receipts[0].result.expectOk();
        
        // Second claim should fail
        let claim2 = chain.mineBlock([
            Tx.contractCall('liquidity-incentives', 'claim-incentive', [
                types.uint(1),
                types.ascii("early-bird")
            ], user1.address)
        ]);
        claim2.receipts[0].result.expectErr(types.uint(410)); // ERR-ALREADY-CLAIMED
    },
});
Clarinet.test({
    name: "Test insufficient balance error handling",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const user1 = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('liquidity-incentives', 'initialize-pool-incentives', [
                types.uint(1)
            ], deployer.address),
            // Don't deposit funds - contract balance is 0
            Tx.contractCall('liquidity-incentives', 'record-bet-and-calculate-early-bird', [
                types.uint(1),
                types.principal(user1.address),
                types.uint(10000000)
            ], deployer.address)
        ]);
        
        // Claim should fail due to insufficient balance
        let claim = chain.mineBlock([
            Tx.contractCall('liquidity-incentives', 'claim-incentive', [
                types.uint(1),
                types.ascii("early-bird")
            ], user1.address)
        ]);
        claim.receipts[0].result.expectErr(types.uint(424)); // ERR-INSUFFICIENT-BALANCE
    },
});