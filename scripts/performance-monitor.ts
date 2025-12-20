#!/usr/bin/env tsx

/**
 * Performance Monitoring Script for Automated Resolution System
 * 
 * This script monitors system performance, tracks metrics, and provides
 * insights into the health and efficiency of the automated resolution system.
 */

import { Cl } from "@stacks/transactions";
import { initSimnet } from "@hirosystems/clarinet-sdk";

const simnet = await initSimnet();
const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;

interface PerformanceMetrics {
  totalPools: number;
  automatedPools: number;
  successfulResolutions: number;
  failedResolutions: number;
  fallbackResolutions: number;
  totalDisputes: number;
  upheldDisputes: number;
  totalOracleProviders: number;
  activeOracleProviders: number;
  totalOracleSubmissions: number;
  averageOracleReliability: number;
  totalVolume: number;
  totalFeesCollected: number;
  totalFeesDistributed: number;
}

interface OraclePerformance {
  providerId: number;
  address: string;
  reliabilityScore: number;
  totalResolutions: number;
  successfulResolutions: number;
  averageResponseTime: number;
  isActive: boolean;
  dataTypes: string[];
}

interface ResolutionPerformance {
  poolId: number;
  title: string;
  resolutionTime: number;
  attemptCount: number;
  wasSuccessful: boolean;
  fallbackUsed: boolean;
  disputeCreated: boolean;
  disputeUpheld?: boolean;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics;
  private oraclePerformance: OraclePerformance[];
  private resolutionPerformance: ResolutionPerformance[];

  constructor() {
    this.metrics = {
      totalPools: 0,
      automatedPools: 0,
      successfulResolutions: 0,
      failedResolutions: 0,
      fallbackResolutions: 0,
      totalDisputes: 0,
      upheldDisputes: 0,
      totalOracleProviders: 0,
      activeOracleProviders: 0,
      totalOracleSubmissions: 0,
      averageOracleReliability: 0,
      totalVolume: 0,
      totalFeesCollected: 0,
      totalFeesDistributed: 0
    };
    this.oraclePerformance = [];
    this.resolutionPerformance = [];
  }

  async collectSystemMetrics(): Promise<void> {
    console.log("📊 Collecting System Metrics...");

    // Get total pools
    const poolCount = simnet.callReadOnlyFn(
      "predinex-pool",
      "get-pool-count",
      [],
      deployer
    );
    this.metrics.totalPools = Number(poolCount.result.value);

    // Get total oracle providers
    const oracleCount = simnet.callReadOnlyFn(
      "predinex-pool",
      "get-oracle-provider-count",
      [],
      deployer
    );
    this.metrics.totalOracleProviders = Number(oracleCount.result.value);

    // Get total oracle submissions
    const submissionCount = simnet.callReadOnlyFn(
      "predinex-pool",
      "get-oracle-submission-count",
      [],
      deployer
    );
    this.metrics.totalOracleSubmissions = Number(submissionCount.result.value);

    // Get total volume
    const totalVolume = simnet.callReadOnlyFn(
      "predinex-pool",
      "get-total-volume",
      [],
      deployer
    );
    this.metrics.totalVolume = Number(totalVolume.result.value);

    // Get total disputes
    const disputeCount = simnet.callReadOnlyFn(
      "predinex-pool",
      "get-dispute-count",
      [],
      deployer
    );
    this.metrics.totalDisputes = Number(disputeCount.result.value);

    console.log(`✅ Collected basic metrics: ${this.metrics.totalPools} pools, ${this.metrics.totalOracleProviders} oracles`);
  }

  async analyzeOraclePerformance(): Promise<void> {
    console.log("🔮 Analyzing Oracle Performance...");

    let totalReliability = 0;
    let activeCount = 0;

    for (let i = 0; i < this.metrics.totalOracleProviders; i++) {
      const provider = simnet.callReadOnlyFn(
        "predinex-pool",
        "get-oracle-provider",
        [Cl.uint(i)],
        deployer
      );

      if (provider.result.type === "some") {
        const providerData = provider.result.value.data;
        const reliabilityScore = Number(providerData["reliability-score"].value);
        const isActive = providerData["is-active"].value;
        
        const performance: OraclePerformance = {
          providerId: i,
          address: providerData["provider-address"].value,
          reliabilityScore: reliabilityScore,
          totalResolutions: Number(providerData["total-resolutions"].value),
          successfulResolutions: Number(providerData["successful-resolutions"].value),
          averageResponseTime: Number(providerData["average-response-time"].value),
          isActive: isActive,
          dataTypes: [] // Would need additional query to get supported data types
        };

        this.oraclePerformance.push(performance);
        
        if (isActive) {
          activeCount++;
          totalReliability += reliabilityScore;
        }
      }
    }

    this.metrics.activeOracleProviders = activeCount;
    this.metrics.averageOracleReliability = activeCount > 0 ? totalReliability / activeCount : 0;

    console.log(`✅ Analyzed ${this.oraclePerformance.length} oracle providers`);
  }

  async analyzeResolutionPerformance(): Promise<void> {
    console.log("⚙️ Analyzing Resolution Performance...");

    let automatedCount = 0;
    let successfulCount = 0;
    let failedCount = 0;
    let fallbackCount = 0;

    for (let i = 0; i < this.metrics.totalPools; i++) {
      // Check if pool is automated
      const isAutomated = simnet.callReadOnlyFn(
        "predinex-pool",
        "is-pool-automated",
        [Cl.uint(i)],
        deployer
      );

      if (isAutomated.result.value) {
        automatedCount++;

        // Check pool details
        const pool = simnet.callReadOnlyFn(
          "predinex-pool",
          "get-pool",
          [Cl.uint(i)],
          deployer
        );

        if (pool.result.type === "some") {
          const poolData = pool.result.value.data;
          const isSettled = poolData.settled.value;
          const title = poolData.title.data;

          // Check for fallback status
          const fallbackStatus = simnet.callReadOnlyFn(
            "predinex-pool",
            "is-pool-in-fallback",
            [Cl.uint(i)],
            deployer
          );

          const usedFallback = fallbackStatus.result.value;
          
          if (usedFallback) {
            fallbackCount++;
          }

          if (isSettled) {
            if (usedFallback) {
              // Manual resolution after fallback
              this.resolutionPerformance.push({
                poolId: i,
                title: title,
                resolutionTime: 0, // Would need to calculate from timestamps
                attemptCount: 3, // Assume max attempts reached
                wasSuccessful: false,
                fallbackUsed: true,
                disputeCreated: false // Would need to check
              });
            } else {
              // Successful automated resolution
              successfulCount++;
              this.resolutionPerformance.push({
                poolId: i,
                title: title,
                resolutionTime: 0, // Would calculate from timestamps
                attemptCount: 1, // Assume successful on first try
                wasSuccessful: true,
                fallbackUsed: false,
                disputeCreated: false
              });
            }
          }
        }
      }
    }

    this.metrics.automatedPools = automatedCount;
    this.metrics.successfulResolutions = successfulCount;
    this.metrics.fallbackResolutions = fallbackCount;
    this.metrics.failedResolutions = automatedCount - successfulCount - fallbackCount;

    console.log(`✅ Analyzed resolution performance: ${successfulCount}/${automatedCount} successful`);
  }

  generatePerformanceReport(): void {
    console.log("\n📈 PERFORMANCE REPORT");
    console.log("=" .repeat(50));

    // System Overview
    console.log("\n🏗️ SYSTEM OVERVIEW");
    console.log(`Total Pools: ${this.metrics.totalPools}`);
    console.log(`Automated Pools: ${this.metrics.automatedPools} (${((this.metrics.automatedPools / this.metrics.totalPools) * 100).toFixed(1)}%)`);
    console.log(`Total Volume: ${(this.metrics.totalVolume / 1000000).toFixed(2)} STX`);
    console.log(`Total Oracle Providers: ${this.metrics.totalOracleProviders}`);
    console.log(`Active Oracle Providers: ${this.metrics.activeOracleProviders}`);
    console.log(`Total Oracle Submissions: ${this.metrics.totalOracleSubmissions}`);

    // Resolution Performance
    console.log("\n⚙️ RESOLUTION PERFORMANCE");
    const resolutionSuccessRate = this.metrics.automatedPools > 0 
      ? (this.metrics.successfulResolutions / this.metrics.automatedPools) * 100 
      : 0;
    
    console.log(`Successful Resolutions: ${this.metrics.successfulResolutions}`);
    console.log(`Failed Resolutions: ${this.metrics.failedResolutions}`);
    console.log(`Fallback Resolutions: ${this.metrics.fallbackResolutions}`);
    console.log(`Success Rate: ${resolutionSuccessRate.toFixed(1)}%`);
    
    if (this.metrics.fallbackResolutions > 0) {
      const fallbackRate = (this.metrics.fallbackResolutions / this.metrics.automatedPools) * 100;
      console.log(`Fallback Rate: ${fallbackRate.toFixed(1)}%`);
    }

    // Oracle Performance
    console.log("\n🔮 ORACLE PERFORMANCE");
    console.log(`Average Reliability: ${this.metrics.averageOracleReliability.toFixed(1)}%`);
    
    if (this.oraclePerformance.length > 0) {
      console.log("\nTop Performing Oracles:");
      const sortedOracles = this.oraclePerformance
        .filter(o => o.isActive)
        .sort((a, b) => b.reliabilityScore - a.reliabilityScore)
        .slice(0, 3);

      sortedOracles.forEach((oracle, index) => {
        console.log(`${index + 1}. Provider #${oracle.providerId}: ${oracle.reliabilityScore}% reliability (${oracle.totalResolutions} resolutions)`);
      });

      console.log("\nUnderperforming Oracles:");
      const underperforming = this.oraclePerformance
        .filter(o => o.reliabilityScore < 75)
        .sort((a, b) => a.reliabilityScore - b.reliabilityScore);

      if (underperforming.length > 0) {
        underperforming.forEach(oracle => {
          console.log(`⚠️ Provider #${oracle.providerId}: ${oracle.reliabilityScore}% reliability (${oracle.isActive ? 'Active' : 'Inactive'})`);
        });
      } else {
        console.log("✅ No underperforming oracles detected");
      }
    }

    // Dispute Analysis
    console.log("\n⚖️ DISPUTE ANALYSIS");
    console.log(`Total Disputes: ${this.metrics.totalDisputes}`);
    
    if (this.metrics.totalDisputes > 0) {
      const disputeRate = (this.metrics.totalDisputes / this.metrics.automatedPools) * 100;
      console.log(`Dispute Rate: ${disputeRate.toFixed(1)}%`);
      
      if (this.metrics.upheldDisputes > 0) {
        const upheldRate = (this.metrics.upheldDisputes / this.metrics.totalDisputes) * 100;
        console.log(`Upheld Disputes: ${this.metrics.upheldDisputes} (${upheldRate.toFixed(1)}%)`);
      }
    }

    // Health Indicators
    console.log("\n🏥 SYSTEM HEALTH INDICATORS");
    
    const healthIndicators = [
      {
        name: "Resolution Success Rate",
        value: resolutionSuccessRate,
        threshold: 85,
        unit: "%"
      },
      {
        name: "Average Oracle Reliability",
        value: this.metrics.averageOracleReliability,
        threshold: 80,
        unit: "%"
      },
      {
        name: "Active Oracle Ratio",
        value: this.metrics.totalOracleProviders > 0 ? (this.metrics.activeOracleProviders / this.metrics.totalOracleProviders) * 100 : 0,
        threshold: 75,
        unit: "%"
      }
    ];

    healthIndicators.forEach(indicator => {
      const status = indicator.value >= indicator.threshold ? "✅ HEALTHY" : "⚠️ NEEDS ATTENTION";
      console.log(`${indicator.name}: ${indicator.value.toFixed(1)}${indicator.unit} ${status}`);
    });

    // Recommendations
    console.log("\n💡 RECOMMENDATIONS");
    
    if (resolutionSuccessRate < 85) {
      console.log("• Consider improving oracle data quality and reliability");
      console.log("• Review resolution criteria for complexity and accuracy");
    }
    
    if (this.metrics.averageOracleReliability < 80) {
      console.log("• Evaluate underperforming oracle providers");
      console.log("• Consider adding more reliable oracle sources");
    }
    
    if (this.metrics.fallbackResolutions > this.metrics.successfulResolutions * 0.1) {
      console.log("• High fallback rate detected - investigate automation issues");
      console.log("• Consider adjusting retry attempts and timeout settings");
    }
    
    if (this.metrics.totalDisputes > this.metrics.automatedPools * 0.05) {
      console.log("• High dispute rate - review resolution accuracy");
      console.log("• Consider improving oracle consensus mechanisms");
    }

    console.log("\n🎯 Performance monitoring complete!");
  }

  async runFullAnalysis(): Promise<void> {
    console.log("🚀 Starting Performance Analysis...\n");
    
    await this.collectSystemMetrics();
    await this.analyzeOraclePerformance();
    await this.analyzeResolutionPerformance();
    
    this.generatePerformanceReport();
  }
}

// Utility functions for performance testing
class PerformanceTester {
  static async measureResolutionTime(poolId: number): Promise<number> {
    const startTime = Date.now();
    
    const result = simnet.callPublicFn(
      "predinex-pool",
      "attempt-automated-resolution",
      [Cl.uint(poolId)],
      deployer
    );
    
    const endTime = Date.now();
    return endTime - startTime;
  }

  static async stressTestOracleSubmissions(poolId: number, submissionCount: number): Promise<{ successCount: number; averageTime: number }> {
    console.log(`🧪 Stress testing oracle submissions: ${submissionCount} submissions`);
    
    let successCount = 0;
    let totalTime = 0;
    
    for (let i = 0; i < submissionCount; i++) {
      const startTime = Date.now();
      
      const result = simnet.callPublicFn(
        "predinex-pool",
        "submit-oracle-data",
        [
          Cl.uint(poolId),
          Cl.stringAscii(`test-data-${i}`),
          Cl.stringAscii("test"),
          Cl.uint(90)
        ],
        accounts.get("wallet_1")!
      );
      
      const endTime = Date.now();
      totalTime += (endTime - startTime);
      
      if (result.result.type === "ok") {
        successCount++;
      }
    }
    
    return {
      successCount,
      averageTime: totalTime / submissionCount
    };
  }
}

// Main execution
async function main() {
  const monitor = new PerformanceMonitor();
  
  try {
    await monitor.runFullAnalysis();
    
    // Optional: Run performance tests
    console.log("\n🧪 Running Performance Tests...");
    
    // Example stress test (would need actual pools and oracles set up)
    // const stressResults = await PerformanceTester.stressTestOracleSubmissions(0, 10);
    // console.log(`Stress test results: ${stressResults.successCount}/10 successful, avg time: ${stressResults.averageTime}ms`);
    
  } catch (error) {
    console.error("❌ Performance monitoring failed:", error);
    process.exit(1);
  }
}

// Export for use in other scripts
export { PerformanceMonitor, PerformanceTester };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}