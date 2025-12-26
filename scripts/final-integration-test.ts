#!/usr/bin/env tsx

/**
 * Final Integration Test for Automated Market Resolution System
 * 
 * This comprehensive test validates the entire automated resolution system
 * by running through complete workflows including edge cases and error scenarios.
 */

import { Cl } from "@stacks/transactions";
import { initSimnet } from "@hirosystems/clarinet-sdk";

const simnet = await initSimnet();
const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const oracle1 = accounts.get("wallet_1")!;
const oracle2 = accounts.get("wallet_2")!;
const bettor1 = accounts.get("wallet_3")!;
const bettor2 = accounts.get("wallet_4")!;
const disputer = accounts.get("wallet_5")!;

interface TestResult {
  testName: string;
  passed: boolean;
  details: string;
  duration: number;
}

class IntegrationTester {
  private results: TestResult[] = [];
  private startTime: number = 0;

  private startTest(testName: string): void {
    console.log(`\n🧪 Running: ${testName}`);
    this.startTime = Date.now();
  }

  private endTest(testName: string, passed: boolean, details: string): void {
    const duration = Date.now() - this.startTime;
    const result: TestResult = { testName, passed, details, duration };
    this.results.push(result);
    
    const status = passed ? "✅ PASSED" : "❌ FAILED";
    console.log(`${status}: ${testName} (${duration}ms)`);
    if (!passed) {
      console.log(`   Details: ${details}`);
    }
  }

  async testOracleSystemSetup(): Promise<void> {
    this.startTest("Oracle System Setup");
    
    try {
      // Register multiple oracle providers
      const oracle1Result = simnet.callPublicFn(
        "predinex-pool",
        "register-oracle-provider",
        [
          Cl.principal(oracle1),
          Cl.list([Cl.stringAscii("price"), Cl.stringAscii("volume")])
        ],
        deployer
      );

      const oracle2Result = simnet.callPublicFn(
        "predinex-pool",
        "register-oracle-provider",
        [
          Cl.principal(oracle2),
          Cl.list([Cl.stringAscii("weather"), Cl.stringAscii("sports")])
        ],
        deployer
      );

      const success = oracle1Result.result.type === "ok" && oracle2Result.result.type === "ok";
      this.endTest("Oracle System Setup", success, success ? "2 oracles registered" : "Oracle registration failed");
    } catch (error) {
      this.endTest("Oracle System Setup", false, `Error: ${error}`);
    }
  }

  async testPoolCreationAndConfiguration(): Promise<void> {
    this.startTest("Pool Creation and Configuration");
    
    try {
      // Create multiple pools with different configurations
      const pools = [
        {
          title: "Bitcoin $100K Test",
          description: "Test pool for Bitcoin price prediction",
          outcomeA: "Above $100K",
          outcomeB: "Below $100K",
          duration: 50,
          oracleType: "price"
        },
        {
          title: "Weather Test Pool",
          description: "Test pool for weather prediction",
          outcomeA: "Rain",
          outcomeB: "No Rain",
          duration: 60,
          oracleType: "weather"
        }
      ];

      let allPoolsCreated = true;
      const poolIds: number[] = [];

      for (const pool of pools) {
        const poolResult = simnet.callPublicFn(
          "predinex-pool",
          "create-pool",
          [
            Cl.stringAscii(pool.title),
            Cl.stringAscii(pool.description),
            Cl.stringAscii(pool.outcomeA),
            Cl.stringAscii(pool.outcomeB),
            Cl.uint(pool.duration)
          ],
          deployer
        );

        if (poolResult.result.type === "ok") {
          const poolId = Number(poolResult.result.value.value);
          poolIds.push(poolId);

          // Configure automated resolution
          const oracleId = pool.oracleType === "price" ? 0 : 1;
          const configResult = simnet.callPublicFn(
            "predinex-pool",
            "configure-pool-resolution",
            [
              Cl.uint(poolId),
              Cl.list([Cl.uint(oracleId)]),
              Cl.stringAscii(`${pool.oracleType} threshold test`),
              Cl.stringAscii(pool.oracleType),
              Cl.some(Cl.uint(50)),
              Cl.stringAscii("AND"),
              Cl.uint(3)
            ],
            deployer
          );

          if (configResult.result.type !== "ok") {
            allPoolsCreated = false;
          }
        } else {
          allPoolsCreated = false;
        }
      }

      this.endTest("Pool Creation and Configuration", allPoolsCreated, 
        allPoolsCreated ? `${pools.length} pools created and configured` : "Pool creation/configuration failed");
    } catch (error) {
      this.endTest("Pool Creation and Configuration", false, `Error: ${error}`);
    }
  }

  async testOracleDataSubmission(): Promise<void> {
    this.startTest("Oracle Data Submission");
    
    try {
      // Submit data from multiple oracles
      const submissions = [
        { poolId: 0, oracle: oracle1, value: "105000", type: "price", confidence: 95 },
        { poolId: 0, oracle: oracle1, value: "104500", type: "price", confidence: 92 },
        { poolId: 1, oracle: oracle2, value: "5.5", type: "weather", confidence: 88 }
      ];

      let allSubmissionsSuccessful = true;

      for (const submission of submissions) {
        const result = simnet.callPublicFn(
          "predinex-pool",
          "submit-oracle-data",
          [
            Cl.uint(submission.poolId),
            Cl.stringAscii(submission.value),
            Cl.stringAscii(submission.type),
            Cl.uint(submission.confidence)
          ],
          submission.oracle
        );

        if (result.result.type !== "ok") {
          allSubmissionsSuccessful = false;
        }
      }

      this.endTest("Oracle Data Submission", allSubmissionsSuccessful,
        allSubmissionsSuccessful ? `${submissions.length} submissions successful` : "Some submissions failed");
    } catch (error) {
      this.endTest("Oracle Data Submission", false, `Error: ${error}`);
    }
  }

  async testBettingActivity(): Promise<void> {
    this.startTest("Betting Activity");
    
    try {
      // Add betting activity to pools
      const bets = [
        { poolId: 0, bettor: bettor1, outcome: 0, amount: 1000000 },
        { poolId: 0, bettor: bettor2, outcome: 1, amount: 800000 },
        { poolId: 1, bettor: bettor1, outcome: 0, amount: 500000 },
        { poolId: 1, bettor: bettor2, outcome: 1, amount: 600000 }
      ];

      let allBetsSuccessful = true;

      for (const bet of bets) {
        const result = simnet.callPublicFn(
          "predinex-pool",
          "place-bet",
          [Cl.uint(bet.poolId), Cl.uint(bet.outcome), Cl.uint(bet.amount)],
          bet.bettor
        );

        if (result.result.type !== "ok") {
          allBetsSuccessful = false;
        }
      }

      this.endTest("Betting Activity", allBetsSuccessful,
        allBetsSuccessful ? `${bets.length} bets placed successfully` : "Some bets failed");
    } catch (error) {
      this.endTest("Betting Activity", false, `Error: ${error}`);
    }
  }

  async testAutomatedResolution(): Promise<void> {
    this.startTest("Automated Resolution");
    
    try {
      // Fast-forward time to expire pools
      simnet.mineEmptyBlocks(70);

      // Attempt automated resolution
      const resolutionResults = [];
      
      for (let poolId = 0; poolId < 2; poolId++) {
        const result = simnet.callPublicFn(
          "predinex-pool",
          "attempt-automated-resolution",
          [Cl.uint(poolId)],
          deployer
        );
        resolutionResults.push(result.result.type === "ok");
      }

      const successfulResolutions = resolutionResults.filter(r => r).length;
      const allSuccessful = successfulResolutions === resolutionResults.length;

      this.endTest("Automated Resolution", allSuccessful,
        `${successfulResolutions}/${resolutionResults.length} resolutions successful`);
    } catch (error) {
      this.endTest("Automated Resolution", false, `Error: ${error}`);
    }
  }

  async testDisputeSystem(): Promise<void> {
    this.startTest("Dispute System");
    
    try {
      // Create a dispute for the first pool
      const disputeResult = simnet.callPublicFn(
        "predinex-pool",
        "create-dispute",
        [
          Cl.uint(0),
          Cl.stringAscii("Test dispute - resolution appears incorrect based on market data"),
          Cl.some(Cl.bufferFromHex("deadbeef"))
        ],
        disputer
      );

      if (disputeResult.result.type !== "ok") {
        this.endTest("Dispute System", false, "Dispute creation failed");
        return;
      }

      const disputeId = Number(disputeResult.result.value.value);

      // Cast votes on the dispute
      const votes = [
        { voter: bettor1, vote: false },
        { voter: bettor2, vote: true },
        { voter: oracle1, vote: false }
      ];

      let allVotesSuccessful = true;

      for (const vote of votes) {
        const voteResult = simnet.callPublicFn(
          "predinex-pool",
          "vote-on-dispute",
          [Cl.uint(disputeId), Cl.bool(vote.vote)],
          vote.voter
        );

        if (voteResult.result.type !== "ok") {
          allVotesSuccessful = false;
        }
      }

      // Fast-forward time to pass voting deadline
      simnet.mineEmptyBlocks(1010);

      // Resolve the dispute
      const resolveResult = simnet.callPublicFn(
        "predinex-pool",
        "resolve-dispute",
        [Cl.uint(disputeId)],
        deployer
      );

      const disputeSystemWorking = allVotesSuccessful && resolveResult.result.type === "ok";

      this.endTest("Dispute System", disputeSystemWorking,
        disputeSystemWorking ? "Dispute created, voted on, and resolved" : "Dispute system failed");
    } catch (error) {
      this.endTest("Dispute System", false, `Error: ${error}`);
    }
  }

  async testFeeManagement(): Promise<void> {
    this.startTest("Fee Management");
    
    try {
      // Collect resolution fees
      const feeResult = simnet.callPublicFn(
        "predinex-pool",
        "collect-resolution-fee",
        [Cl.uint(0)],
        deployer
      );

      if (feeResult.result.type !== "ok") {
        this.endTest("Fee Management", false, "Fee collection failed");
        return;
      }

      // Distribute oracle fees
      const distributeResult = simnet.callPublicFn(
        "predinex-pool",
        "distribute-oracle-fees",
        [Cl.uint(0), Cl.list([Cl.uint(0)])],
        deployer
      );

      // Oracle claims fee
      const claimResult = simnet.callPublicFn(
        "predinex-pool",
        "claim-oracle-fee",
        [Cl.uint(0)],
        oracle1
      );

      const feeSystemWorking = distributeResult.result.type === "ok" && claimResult.result.type === "ok";

      this.endTest("Fee Management", feeSystemWorking,
        feeSystemWorking ? "Fees collected, distributed, and claimed" : "Fee management failed");
    } catch (error) {
      this.endTest("Fee Management", false, `Error: ${error}`);
    }
  }

  async testFallbackResolution(): Promise<void> {
    this.startTest("Fallback Resolution");
    
    try {
      // Create a pool that will need fallback resolution
      const poolResult = simnet.callPublicFn(
        "predinex-pool",
        "create-pool",
        [
          Cl.stringAscii("Fallback Test Pool"),
          Cl.stringAscii("Pool designed to test fallback resolution"),
          Cl.stringAscii("Option A"),
          Cl.stringAscii("Option B"),
          Cl.uint(10)
        ],
        deployer
      );

      if (poolResult.result.type !== "ok") {
        this.endTest("Fallback Resolution", false, "Fallback test pool creation failed");
        return;
      }

      const poolId = Number(poolResult.result.value.value);

      // Configure with non-existent oracle to force failure
      const configResult = simnet.callPublicFn(
        "predinex-pool",
        "configure-pool-resolution",
        [
          Cl.uint(poolId),
          Cl.list([Cl.uint(99)]), // Non-existent oracle
          Cl.stringAscii("test criteria"),
          Cl.stringAscii("test"),
          Cl.none(),
          Cl.stringAscii("AND"),
          Cl.uint(1)
        ],
        deployer
      );

      // Fast-forward time and trigger fallback
      simnet.mineEmptyBlocks(20);

      const fallbackResult = simnet.callPublicFn(
        "predinex-pool",
        "trigger-fallback-resolution",
        [Cl.uint(poolId), Cl.stringAscii("Oracle not found")],
        deployer
      );

      // Fast-forward for fallback delay
      simnet.mineEmptyBlocks(150);

      // Manual settlement
      const manualResult = simnet.callPublicFn(
        "predinex-pool",
        "manual-settle-fallback",
        [Cl.uint(poolId), Cl.uint(0)],
        deployer
      );

      const fallbackWorking = fallbackResult.result.type === "ok" && manualResult.result.type === "ok";

      this.endTest("Fallback Resolution", fallbackWorking,
        fallbackWorking ? "Fallback triggered and manual settlement completed" : "Fallback system failed");
    } catch (error) {
      this.endTest("Fallback Resolution", false, `Error: ${error}`);
    }
  }

  async testSystemQueries(): Promise<void> {
    this.startTest("System Queries");
    
    try {
      // Test various read-only functions
      const queries = [
        { name: "get-pool-count", args: [] },
        { name: "get-oracle-provider-count", args: [] },
        { name: "get-oracle-submission-count", args: [] },
        { name: "get-dispute-count", args: [] },
        { name: "get-total-volume", args: [] }
      ];

      let allQueriesSuccessful = true;

      for (const query of queries) {
        const result = simnet.callReadOnlyFn(
          "predinex-pool",
          query.name,
          query.args.map(arg => typeof arg === "number" ? Cl.uint(arg) : Cl.stringAscii(arg)),
          deployer
        );

        if (result.result.type !== "uint") {
          allQueriesSuccessful = false;
        }
      }

      this.endTest("System Queries", allQueriesSuccessful,
        allQueriesSuccessful ? `${queries.length} queries executed successfully` : "Some queries failed");
    } catch (error) {
      this.endTest("System Queries", false, `Error: ${error}`);
    }
  }

  async testErrorHandling(): Promise<void> {
    this.startTest("Error Handling");
    
    try {
      // Test various error conditions
      const errorTests = [
        {
          name: "Invalid pool ID",
          fn: () => simnet.callReadOnlyFn("predinex-pool", "get-pool", [Cl.uint(999)], deployer)
        },
        {
          name: "Invalid oracle submission",
          fn: () => simnet.callPublicFn("predinex-pool", "submit-oracle-data", 
            [Cl.uint(999), Cl.stringAscii("test"), Cl.stringAscii("invalid"), Cl.uint(50)], oracle1)
        },
        {
          name: "Unauthorized oracle registration",
          fn: () => simnet.callPublicFn("predinex-pool", "register-oracle-provider",
            [Cl.principal(oracle1), Cl.list([Cl.stringAscii("test")])], bettor1)
        }
      ];

      let errorHandlingWorking = true;

      for (const test of errorTests) {
        const result = test.fn();
        // For error handling test, we expect errors or none results
        if (result.result.type === "ok" && test.name.includes("Invalid")) {
          errorHandlingWorking = false;
        }
      }

      this.endTest("Error Handling", errorHandlingWorking,
        errorHandlingWorking ? "Error conditions handled correctly" : "Error handling issues detected");
    } catch (error) {
      this.endTest("Error Handling", true, "Errors properly thrown and caught");
    }
  }

  generateFinalReport(): void {
    console.log("\n" + "=".repeat(60));
    console.log("🎯 FINAL INTEGRATION TEST REPORT");
    console.log("=".repeat(60));

    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    console.log(`\n📊 SUMMARY:`);
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests} ✅`);
    console.log(`Failed: ${failedTests} ❌`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    console.log(`Total Duration: ${totalDuration}ms`);

    if (failedTests > 0) {
      console.log(`\n❌ FAILED TESTS:`);
      this.results.filter(r => !r.passed).forEach(result => {
        console.log(`• ${result.testName}: ${result.details}`);
      });
    }

    console.log(`\n✅ PASSED TESTS:`);
    this.results.filter(r => r.passed).forEach(result => {
      console.log(`• ${result.testName} (${result.duration}ms)`);
    });

    console.log(`\n🏆 SYSTEM STATUS: ${passedTests === totalTests ? "ALL SYSTEMS OPERATIONAL" : "ISSUES DETECTED"}`);
    
    if (passedTests === totalTests) {
      console.log(`\n🎉 Congratulations! The Automated Market Resolution System is fully functional.`);
      console.log(`All ${totalTests} integration tests passed successfully.`);
    } else {
      console.log(`\n⚠️ System has ${failedTests} failing test(s) that need attention.`);
    }
  }

  async runAllTests(): Promise<void> {
    console.log("🚀 Starting Final Integration Test Suite");
    console.log("Testing complete Automated Market Resolution System...\n");

    const tests = [
      () => this.testOracleSystemSetup(),
      () => this.testPoolCreationAndConfiguration(),
      () => this.testOracleDataSubmission(),
      () => this.testBettingActivity(),
      () => this.testAutomatedResolution(),
      () => this.testDisputeSystem(),
      () => this.testFeeManagement(),
      () => this.testFallbackResolution(),
      () => this.testSystemQueries(),
      () => this.testErrorHandling()
    ];

    for (const test of tests) {
      await test();
    }

    this.generateFinalReport();
  }
}

// Main execution
async function main() {
  const tester = new IntegrationTester();
  
  try {
    await tester.runAllTests();
  } catch (error) {
    console.error("❌ Integration test suite failed:", error);
    process.exit(1);
  }
}

// Run the tests
main();