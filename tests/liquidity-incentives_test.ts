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
Clarinet.test({
    name: "Test referral bonus system",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const referrer = accounts.get('wallet_1')!;
        const referred = accounts.get('wallet_2')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('liquidity-incentives', 'initialize-pool-incentives', [
                types.uint(1)
            ], deployer.address),
            Tx.contractCall('liquidity-incentives', 'award-referral-bonus', [
                types.principal(referrer.address),
                types.principal(referred.address),
                types.uint(1),
                types.uint(10000000) // 10 STX referred bet
            ], deployer.address)
        ]);
        
        assertEquals(block.receipts.length, 2);
        block.receipts[1].result.expectOk();
    },
});
Clarinet.test({
    name: "Test contract pause functionality",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('liquidity-incentives', 'pause-contract', [], deployer.address)
        ]);
        
        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result.expectOk(), types.bool(true));
        
        // Test that operations fail when paused
        let block2 = chain.mineBlock([
            Tx.contractCall('liquidity-incentives', 'initialize-pool-incentives', [
                types.uint(2)
            ], deployer.address)
        ]);
        
        block2.receipts[0].result.expectErr(types.uint(414)); // ERR-INVALID-POOL-STATE
    },
});
Clarinet.test({
    name: "Test emergency mode activation",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('liquidity-incentives', 'enable-emergency-mode', [], deployer.address)
        ]);
        
        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result.expectOk(), types.bool(true));
        
        // Check contract status
        let statusCall = chain.callReadOnlyFn('liquidity-incentives', 'get-contract-status', [], deployer.address);
        let status = statusCall.result.expectOk().expectTuple();
        assertEquals(status['emergency-mode'], types.bool(true));
    },
});
Clarinet.test({
    name: "Test minimum bet amount validation",
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
                types.uint(500000) // 0.5 STX - below minimum
            ], deployer.address)
        ]);
        
        assertEquals(block.receipts.length, 2);
        block.receipts[1].result.expectErr(types.uint(416)); // ERR-MINIMUM-BET-NOT-MET
    },
});
Clarinet.test({
    name: "Test incentive fund deposit and withdrawal",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('liquidity-incentives', 'deposit-incentive-funds', [
                types.uint(100000000) // 100 STX
            ], deployer.address)
        ]);
        
        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result.expectOk(), types.uint(100000000));
        
        // Test withdrawal
        let block2 = chain.mineBlock([
            Tx.contractCall('liquidity-incentives', 'withdraw-unclaimed-incentives', [
                types.uint(50000000) // 50 STX
            ], deployer.address)
        ]);
        
        assertEquals(block2.receipts[0].result.expectOk(), types.uint(50000000));
    },
});
Clarinet.test({
    name: "Test read-only functions for pool stats",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('liquidity-incentives', 'initialize-pool-incentives', [
                types.uint(1)
            ], deployer.address)
        ]);
        
        // Test pool config retrieval
        let configCall = chain.callReadOnlyFn('liquidity-incentives', 'get-pool-incentive-config', [
            types.uint(1)
        ], deployer.address);
        
        let config = configCall.result.expectSome().expectTuple();
        assertEquals(config['early-bird-enabled'], types.bool(true));
        assertEquals(config['volume-bonus-enabled'], types.bool(true));
        
        // Test pool stats
        let statsCall = chain.callReadOnlyFn('liquidity-incentives', 'get-pool-incentive-stats', [
            types.uint(1)
        ], deployer.address);
        
        statsCall.result.expectNone(); // Should be none initially
    },
});
Clarinet.test({
    name: "Test batch claim incentives functionality",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const user1 = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('liquidity-incentives', 'initialize-pool-incentives', [
                types.uint(1)
            ], deployer.address),
            Tx.contractCall('liquidity-incentives', 'deposit-incentive-funds', [
                types.uint(100000000) // 100 STX
            ], deployer.address),
            Tx.contractCall('liquidity-incentives', 'record-bet-and-calculate-early-bird', [
                types.uint(1),
                types.principal(user1.address),
                types.uint(10000000) // 10 STX
            ], deployer.address)
        ]);
        
        // Test batch claim
        let claimBlock = chain.mineBlock([
            Tx.contractCall('liquidity-incentives', 'batch-claim-incentives', [
                types.uint(1),
                types.list([types.ascii("early-bird")])
            ], user1.address)
        ]);
        
        assertEquals(claimBlock.receipts.length, 1);
        claimBlock.receipts[0].result.expectOk();
    },
});
Clarinet.test({
    name: "Test user analytics and performance tracking",
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
                types.uint(5000000) // 5 STX
            ], deployer.address)
        ]);
        
        // Test user analytics
        let analyticsCall = chain.callReadOnlyFn('liquidity-incentives', 'get-user-analytics', [
            types.principal(user1.address),
            types.uint(1)
        ], deployer.address);
        
        let analytics = analyticsCall.result.expectOk().expectTuple();
        assertEquals(analytics['roi'], types.uint(0)); // No loyalty history yet
    },
});
Clarinet.test({
    name: "Test streak bonus eligibility calculation",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const user1 = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('liquidity-incentives', 'initialize-pool-incentives', [
                types.uint(1)
            ], deployer.address)
        ]);
        
        // Test streak bonus eligibility
        let streakCall = chain.callReadOnlyFn('liquidity-incentives', 'calculate-streak-bonus-eligibility', [
            types.uint(1),
            types.principal(user1.address)
        ], deployer.address);
        
        let streak = streakCall.result.expectOk().expectTuple();
        assertEquals(streak['is-eligible'], types.bool(false));
        assertEquals(streak['consecutive-bets'], types.uint(0));
        assertEquals(streak['threshold'], types.uint(5));
    },
});
Clarinet.test({
    name: "Test incentive forecasting functionality",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('liquidity-incentives', 'initialize-pool-incentives', [
                types.uint(1)
            ], deployer.address)
        ]);
        
        // Test forecasting
        let forecastCall = chain.callReadOnlyFn('liquidity-incentives', 'forecast-incentive-demand', [
            types.uint(1),
            types.uint(1000000000) // 1000 STX projected volume
        ], deployer.address);
        
        let forecast = forecastCall.result.expectOk().expectTuple();
        assertEquals(forecast['projected-volume'], types.uint(1000000000));
        assertEquals(forecast['estimated-users'], types.uint(1000)); // 1000 STX / 1 STX min bet
    },
});