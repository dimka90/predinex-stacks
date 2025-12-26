#!/usr/bin/env tsx

import { Cl } from "@stacks/transactions";
import { initSimnet } from "@hirosystems/clarinet-sdk";

const simnet = await initSimnet();
const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const user1 = accounts.get("wallet_1")!;
const user2 = accounts.get("wallet_2")!;
const user3 = accounts.get("wallet_3")!;

console.log("⚖️ Dispute System Simulation Starting...");

// Create a test pool for dispute simulation
console.log("\n🏊 Creating Test Pool for Dispute...");

const poolResult = simnet.callPublicFn(
  "predinex-pool",
  "create-pool",
  [
    Cl.stringAscii("Controversial Sports Outcome"),
    Cl.stringAscii("Did Team A win the championship game?"),
    Cl.stringAscii("Team A Won"),
    Cl.stringAscii("Team A Lost"),
    Cl.uint(100) // Short duration for testing
  ],
  deployer
);

let poolId = 0;
if (poolResult.result.type === "ok") {
  poolId = Number(poolResult.result.value.value);
  console.log(`✅ Dispute test pool created with ID: ${poolId}`);
}

// Add some betting activity to create value in the pool
console.log("\n🎲 Adding Betting Activity...");

const bets = [
  { bettor: user1, outcome: 0, amount: 1000000 }, // 1 STX on Team A Won
  { bettor: user2, outcome: 1, amount: 800000 },  // 0.8 STX on Team A Lost
  { bettor: user3, outcome: 0, amount: 500000 }   // 0.5 STX on Team A Won
];

for (const bet of bets) {
  const betResult = simnet.callPublicFn(
    "predinex-pool",
    "place-bet",
    [Cl.uint(poolId), Cl.uint(bet.outcome), Cl.uint(bet.amount)],
    bet.bettor
  );

  if (betResult.result.type === "ok") {
    console.log(`✅ ${bet.bettor} bet ${bet.amount} microSTX on outcome ${bet.outcome}`);
  }
}

// Settle the pool (this would normally be done by automated resolution)
console.log("\n🏁 Settling Pool (Simulating Automated Resolution)...");

const settleResult = simnet.callPublicFn(
  "predinex-pool",
  "settle-pool",
  [Cl.uint(poolId), Cl.uint(0)], // Team A Won
  deployer
);

if (settleResult.result.type === "ok") {
  console.log(`✅ Pool settled with outcome: Team A Won`);
}

// Create a dispute - user2 disagrees with the outcome
console.log("\n⚖️ Creating Dispute...");

const disputeResult = simnet.callPublicFn(
  "predinex-pool",
  "create-dispute",
  [
    Cl.uint(poolId),
    Cl.stringAscii("The game was actually won by Team B based on official league records. The automated resolution used incorrect data source."),
    Cl.some(Cl.bufferFromHex("1234567890abcdef")) // Evidence hash
  ],
  user2
);

let disputeId = 0;
if (disputeResult.result.type === "ok") {
  disputeId = Number(disputeResult.result.value.value);
  console.log(`✅ Dispute created with ID: ${disputeId}`);
  console.log(`💰 Dispute bond: 5% of pool value (${(1000000 + 800000 + 500000) * 0.05} microSTX)`);
}

// Query dispute details
console.log("\n📋 Querying Dispute Details...");

const disputeDetails = simnet.callReadOnlyFn(
  "predinex-pool",
  "get-dispute",
  [Cl.uint(disputeId)],
  deployer
);

if (disputeDetails.result.type === "some") {
  console.log(`📊 Dispute Status: Active`);
  console.log(`📊 Disputer: ${user2}`);
  console.log(`📊 Voting Deadline: Block ${disputeDetails.result.value.data["voting-deadline"].value}`);
}

// Simulate community voting on the dispute
console.log("\n🗳️ Simulating Community Voting...");

const votes = [
  { voter: user1, vote: false, reason: "I watched the game, Team A definitely won" },
  { voter: user3, vote: true, reason: "Checked official records, Team B won" },
  { voter: deployer, vote: false, reason: "Multiple sources confirm Team A victory" }
];

for (const vote of votes) {
  const voteResult = simnet.callPublicFn(
    "predinex-pool",
    "vote-on-dispute",
    [Cl.uint(disputeId), Cl.bool(vote.vote)],
    vote.voter
  );

  if (voteResult.result.type === "ok") {
    console.log(`✅ ${vote.voter} voted ${vote.vote ? "FOR" : "AGAINST"} the dispute`);
    console.log(`   Reason: ${vote.reason}`);
  }
}

// Check voting status
console.log("\n📊 Checking Vote Counts...");

const updatedDispute = simnet.callReadOnlyFn(
  "predinex-pool",
  "get-dispute",
  [Cl.uint(disputeId)],
  deployer
);

if (updatedDispute.result.type === "some") {
  const votesFor = updatedDispute.result.value.data["votes-for"].value;
  const votesAgainst = updatedDispute.result.value.data["votes-against"].value;
  console.log(`📊 Votes FOR dispute: ${votesFor}`);
  console.log(`📊 Votes AGAINST dispute: ${votesAgainst}`);
  console.log(`📊 Current outcome: ${Number(votesFor) > Number(votesAgainst) ? "Dispute will be UPHELD" : "Dispute will be REJECTED"}`);
}

// Fast forward time to simulate voting deadline passing
console.log("\n⏰ Fast-forwarding time to voting deadline...");
simnet.mineEmptyBlocks(1010); // Mine blocks to pass voting deadline

// Resolve the dispute
console.log("\n🏛️ Resolving Dispute...");

const resolveResult = simnet.callPublicFn(
  "predinex-pool",
  "resolve-dispute",
  [Cl.uint(disputeId)],
  deployer
);

if (resolveResult.result.type === "ok") {
  const disputeUpheld = resolveResult.result.value.value;
  console.log(`✅ Dispute resolved: ${disputeUpheld ? "UPHELD" : "REJECTED"}`);
  
  if (disputeUpheld) {
    console.log(`💰 Dispute bond refunded to ${user2}`);
    console.log(`🔄 Original resolution should be overturned`);
  } else {
    console.log(`💰 Dispute bond forfeited to contract`);
    console.log(`✅ Original resolution stands`);
  }
}

// Check final dispute status
console.log("\n📋 Final Dispute Status...");

const finalDispute = simnet.callReadOnlyFn(
  "predinex-pool",
  "get-dispute",
  [Cl.uint(disputeId)],
  deployer
);

if (finalDispute.result.type === "some") {
  const status = finalDispute.result.value.data["status"].data;
  const resolution = finalDispute.result.value.data["resolution"];
  console.log(`📊 Final Status: ${status}`);
  console.log(`📊 Resolution: ${resolution.type === "some" ? (resolution.value.value ? "Upheld" : "Rejected") : "None"}`);
}

// Query system statistics
console.log("\n📈 System Statistics...");

const disputeCount = simnet.callReadOnlyFn(
  "predinex-pool",
  "get-dispute-count",
  [],
  deployer
);
console.log(`📊 Total Disputes: ${disputeCount.result.value}`);

// Check if users voted
for (const vote of votes) {
  const hasVoted = simnet.callReadOnlyFn(
    "predinex-pool",
    "has-user-voted-on-dispute",
    [Cl.uint(disputeId), Cl.principal(vote.voter)],
    deployer
  );
  console.log(`📊 ${vote.voter} voted: ${hasVoted.result.value}`);
}

console.log("\n🎯 Dispute System Simulation Complete!");
console.log("\n📈 Summary:");
console.log(`- 1 Pool created with ${bets.length} bets totaling ${bets.reduce((sum, bet) => sum + bet.amount, 0)} microSTX`);
console.log(`- 1 Dispute created with 5% bond requirement`);
console.log(`- ${votes.length} Community votes cast`);
console.log(`- Dispute resolved through democratic voting process`);
console.log(`- System demonstrates trustless dispute resolution`);