#!/usr/bin/env tsx

import { Cl } from "@stacks/transactions";
import { describe, expect, it, beforeAll } from "vitest";
import { initSimnet } from "@hirosystems/clarinet-sdk";

const simnet = await initSimnet();

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("Oracle System Tests", () => {
  beforeAll(() => {
    console.log("Testing Automated Market Resolution System");
  });

  it("should register oracle providers", () => {
    // Register first oracle provider
    const registerResult = simnet.callPublicFn(
      "predinex-pool",
      "register-oracle-provider",
      [
        Cl.principal(wallet1),
        Cl.list([
          Cl.stringAscii("price"),
          Cl.stringAscii("weather"),
          Cl.stringAscii("sports")
        ])
      ],
      deployer
    );

    expect(registerResult.result).toBeOk(Cl.uint(0));
    console.log("✅ Oracle provider registered successfully");
  });

  it("should submit oracle data", () => {
    // First register oracle provider
    simnet.callPublicFn(
      "predinex-pool",
      "register-oracle-provider",
      [
        Cl.principal(wallet1),
        Cl.list([Cl.stringAscii("price")])
      ],
      deployer
    );

    // Create a test pool first
    const poolResult = simnet.callPublicFn(
      "predinex-pool",
      "create-pool",
      [
        Cl.stringAscii("Test Oracle Pool"),
        Cl.stringAscii("Testing oracle integration"),
        Cl.stringAscii("Yes"),
        Cl.stringAscii("No"),
        Cl.uint(1000)
      ],
      deployer
    );

    expect(poolResult.result).toBeOk(Cl.uint(0));

    // Submit oracle data
    const submitResult = simnet.callPublicFn(
      "predinex-pool",
      "submit-oracle-data",
      [
        Cl.uint(0), // pool-id
        Cl.stringAscii("42.50"), // data-value
        Cl.stringAscii("price"), // data-type
        Cl.uint(95) // confidence-score
      ],
      wallet1
    );

    expect(submitResult.result).toBeOk(Cl.uint(0));
    console.log("✅ Oracle data submitted successfully");
  });

  it("should configure pool for automated resolution", () => {
    // Register oracle provider
    simnet.callPublicFn(
      "predinex-pool",
      "register-oracle-provider",
      [
        Cl.principal(wallet1),
        Cl.list([Cl.stringAscii("price")])
      ],
      deployer
    );

    // Create pool
    const poolResult = simnet.callPublicFn(
      "predinex-pool",
      "create-pool",
      [
        Cl.stringAscii("Automated Pool"),
        Cl.stringAscii("Pool with automated resolution"),
        Cl.stringAscii("Above $50"),
        Cl.stringAscii("Below $50"),
        Cl.uint(100)
      ],
      deployer
    );

    expect(poolResult.result).toBeOk(Cl.uint(0));

    // Configure automated resolution
    const configResult = simnet.callPublicFn(
      "predinex-pool",
      "configure-pool-resolution",
      [
        Cl.uint(0), // pool-id
        Cl.list([Cl.uint(0)]), // oracle-sources
        Cl.stringAscii("price > 50"), // resolution-criteria
        Cl.stringAscii("numeric"), // criteria-type
        Cl.some(Cl.uint(50)), // threshold-value
        Cl.stringAscii("AND"), // logical-operator
        Cl.uint(3) // retry-attempts
      ],
      deployer
    );

    expect(configResult.result).toBeOk(Cl.bool(true));
    console.log("✅ Pool configured for automated resolution");
  });

  it("should create and resolve disputes", () => {
    // Setup: Create pool and settle it
    const poolResult = simnet.callPublicFn(
      "predinex-pool",
      "create-pool",
      [
        Cl.stringAscii("Dispute Test Pool"),
        Cl.stringAscii("Pool for testing disputes"),
        Cl.stringAscii("Option A"),
        Cl.stringAscii("Option B"),
        Cl.uint(100)
      ],
      deployer
    );

    // Place some bets
    simnet.callPublicFn(
      "predinex-pool",
      "place-bet",
      [Cl.uint(0), Cl.uint(0), Cl.uint(100000)],
      wallet1
    );

    // Settle the pool
    simnet.callPublicFn(
      "predinex-pool",
      "settle-pool",
      [Cl.uint(0), Cl.uint(0)],
      deployer
    );

    // Create dispute
    const disputeResult = simnet.callPublicFn(
      "predinex-pool",
      "create-dispute",
      [
        Cl.uint(0), // pool-id
        Cl.stringAscii("Incorrect resolution based on evidence"), // dispute-reason
        Cl.some(Cl.bufferFromHex("deadbeef")) // evidence-hash
      ],
      wallet2
    );

    expect(disputeResult.result).toBeOk(Cl.uint(0));
    console.log("✅ Dispute created successfully");

    // Vote on dispute
    const voteResult = simnet.callPublicFn(
      "predinex-pool",
      "vote-on-dispute",
      [Cl.uint(0), Cl.bool(true)], // dispute-id, vote
      wallet1
    );

    expect(voteResult.result).toBeOk(Cl.bool(true));
    console.log("✅ Vote cast on dispute");
  });

  it("should handle fee distribution", () => {
    // Register oracle provider
    simnet.callPublicFn(
      "predinex-pool",
      "register-oracle-provider",
      [
        Cl.principal(wallet1),
        Cl.list([Cl.stringAscii("price")])
      ],
      deployer
    );

    // Create pool with some value
    simnet.callPublicFn(
      "predinex-pool",
      "create-pool",
      [
        Cl.stringAscii("Fee Test Pool"),
        Cl.stringAscii("Pool for testing fees"),
        Cl.stringAscii("High"),
        Cl.stringAscii("Low"),
        Cl.uint(100)
      ],
      deployer
    );

    // Place bets to create pool value
    simnet.callPublicFn(
      "predinex-pool",
      "place-bet",
      [Cl.uint(0), Cl.uint(0), Cl.uint(1000000)], // 1 STX
      wallet1
    );

    // Collect resolution fee
    const feeResult = simnet.callPublicFn(
      "predinex-pool",
      "collect-resolution-fee",
      [Cl.uint(0)],
      deployer
    );

    expect(feeResult.result).toBeOk(Cl.uint(5000)); // 0.5% of 1 STX
    console.log("✅ Resolution fee collected");

    // Distribute oracle fees
    const distributeResult = simnet.callPublicFn(
      "predinex-pool",
      "distribute-oracle-fees",
      [Cl.uint(0), Cl.list([Cl.uint(0)])],
      deployer
    );

    expect(distributeResult.result).toBeOk(Cl.bool(true));
    console.log("✅ Oracle fees distributed");
  });

  it("should query oracle system state", () => {
    // Register oracle provider
    simnet.callPublicFn(
      "predinex-pool",
      "register-oracle-provider",
      [
        Cl.principal(wallet1),
        Cl.list([Cl.stringAscii("test")])
      ],
      deployer
    );

    // Query oracle provider
    const providerResult = simnet.callReadOnlyFn(
      "predinex-pool",
      "get-oracle-provider",
      [Cl.uint(0)],
      deployer
    );

    expect(providerResult.result).toBeSome();
    console.log("✅ Oracle provider queried successfully");

    // Check oracle count
    const countResult = simnet.callReadOnlyFn(
      "predinex-pool",
      "get-oracle-provider-count",
      [],
      deployer
    );

    expect(countResult.result).toBeUint(1);
    console.log("✅ Oracle provider count correct");
  });
});

console.log("🎯 Oracle System Test Suite Complete!");