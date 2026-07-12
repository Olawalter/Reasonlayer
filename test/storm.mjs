/**
 * ReasonLayer End-to-End Storm Test
 * Runs every contract method with real data against StudioNet
 */

import { createClient, simulator } from "genlayer-js";
import { TransactionStatus } from "genlayer-js/types";

const PRIVATE_KEY = "0x561d7e3dec45ea187356132646c3b3970267b4d2f09e4c51bc8b3b691918eef6";
const CONTRACT   = "0x3E0d9159A8740341E489DD4AD58127FCe4F9869B";
const RPC_URL    = "https://studio.genlayer.com/api";
const CHAIN_ID   = 61999;

// ── helpers ──────────────────────────────────────────────────────────────────

function log(section, msg, data) {
  console.log(`\n${"─".repeat(60)}`);
  console.log(`[${section}] ${msg}`);
  if (data !== undefined) console.log(JSON.stringify(data, null, 2));
}

function ok(label, value) {
  console.log(`  ✓ ${label}:`, value ?? "(empty)");
}

function fail(label, err) {
  console.error(`  ✗ ${label}:`, err?.message ?? err);
}

async function waitFinalized(client, hash, label) {
  log("TX", `Waiting for ${label}...`, { hash });
  const receipt = await client.waitForTransactionReceipt({
    hash,
    status: TransactionStatus.FINALIZED,
    retries: 100,
    interval: 5000,
  });
  ok(`${label} finalized`, receipt.transactionHash ?? hash);
  return receipt;
}

// ── client setup ─────────────────────────────────────────────────────────────

const client = createClient({
  endpoint:   RPC_URL,
  chainId:    CHAIN_ID,
  privateKey: PRIVATE_KEY,
});

const address = client.account.address;
log("SETUP", "Test account", { address, contract: CONTRACT });

// ── test data ─────────────────────────────────────────────────────────────────

const EVIDENCE = {
  moniker:          "StormValidator",
  uptime_pct:       99.4,
  governance_votes: 142,
  delegator_count:  387,
  slashing_events:  0,
  validator_age_days: 820,
  pending_disputes: 0,
  stake_amount:     125000,
};

// ── STEP 1: submit_evidence ───────────────────────────────────────────────────

log("STEP 1", "submit_evidence — auto-registers validator + stores signals");
try {
  const hash = await client.writeContract({
    address:      CONTRACT,
    functionName: "submit_evidence",
    args: [
      EVIDENCE.moniker,
      EVIDENCE.uptime_pct,
      EVIDENCE.governance_votes,
      EVIDENCE.delegator_count,
      EVIDENCE.slashing_events,
      EVIDENCE.validator_age_days,
      EVIDENCE.pending_disputes,
      EVIDENCE.stake_amount,
    ],
    value: BigInt(0),
  });
  await waitFinalized(client, hash, "submit_evidence");
} catch (e) {
  fail("submit_evidence", e);
  process.exit(1);
}

// ── STEP 2: read back evidence ────────────────────────────────────────────────

log("STEP 2", "get_evidence — verify stored signals");
try {
  const raw = await client.readContract({
    address:      CONTRACT,
    functionName: "get_evidence",
    args:         [address],
  });
  ok("evidence", JSON.parse(raw));
} catch (e) {
  fail("get_evidence", e);
}

// ── STEP 3: has_evidence ──────────────────────────────────────────────────────

log("STEP 3", "has_evidence — bool check");
try {
  const has = await client.readContract({
    address:      CONTRACT,
    functionName: "has_evidence",
    args:         [address],
  });
  ok("has_evidence", has);
} catch (e) {
  fail("has_evidence", e);
}

// ── STEP 4: evaluate_reputation ───────────────────────────────────────────────

log("STEP 4", "evaluate_reputation — AI consensus (takes ~60–120s)");
try {
  const hash = await client.writeContract({
    address:      CONTRACT,
    functionName: "evaluate_reputation",
    args:         [address],
    value:        BigInt(0),
  });
  await waitFinalized(client, hash, "evaluate_reputation");
} catch (e) {
  fail("evaluate_reputation", e);
  process.exit(1);
}

// ── STEP 5: read reputation ───────────────────────────────────────────────────

log("STEP 5", "get_reputation — AI-scored record");
let reputation = null;
try {
  const raw = await client.readContract({
    address:      CONTRACT,
    functionName: "get_reputation",
    args:         [address],
  });
  reputation = JSON.parse(raw);
  ok("reputation", reputation);
} catch (e) {
  fail("get_reputation", e);
}

// ── STEP 6: get_evaluation_history ───────────────────────────────────────────

log("STEP 6", "get_evaluation_history — audit trail");
try {
  const raw = await client.readContract({
    address:      CONTRACT,
    functionName: "get_evaluation_history",
    args:         [address],
  });
  ok("history", JSON.parse(raw));
} catch (e) {
  fail("get_evaluation_history", e);
}

// ── STEP 7: get_validator ─────────────────────────────────────────────────────

log("STEP 7", "get_validator — profile entry");
try {
  const raw = await client.readContract({
    address:      CONTRACT,
    functionName: "get_validator",
    args:         [address],
  });
  ok("validator", JSON.parse(raw));
} catch (e) {
  fail("get_validator", e);
}

// ── STEP 8: get_validator_registry ───────────────────────────────────────────

log("STEP 8", "get_validator_registry — paginated list");
try {
  const raw = await client.readContract({
    address:      CONTRACT,
    functionName: "get_validator_registry",
    args:         [10, 0],
  });
  const list = JSON.parse(raw);
  ok(`registry (${list.length} validators)`, list.map(v => v.address ?? v.moniker ?? v));
} catch (e) {
  fail("get_validator_registry", e);
}

// ── STEP 9: generate_recommendation ──────────────────────────────────────────

log("STEP 9", "generate_recommendation — AI delegator match (takes ~60s)");
try {
  const hash = await client.writeContract({
    address:      CONTRACT,
    functionName: "generate_recommendation",
    args: [
      address,          // for_address (delegator)
      "high",           // security_priority
      "medium",         // yield_priority
      "low",            // decentralization_priority
      50000,            // min_stake
    ],
    value: BigInt(0),
  });
  await waitFinalized(client, hash, "generate_recommendation");
} catch (e) {
  fail("generate_recommendation", e);
}

// ── STEP 10: get_recommendation ──────────────────────────────────────────────

log("STEP 10", "get_recommendation — read AI match result");
try {
  const raw = await client.readContract({
    address:      CONTRACT,
    functionName: "get_recommendation",
    args:         [address],
  });
  ok("recommendation", JSON.parse(raw));
} catch (e) {
  fail("get_recommendation", e);
}

// ── STEP 11: submit_dispute ───────────────────────────────────────────────────

log("STEP 11", "submit_dispute — file a dispute against own validator (self-test)");
let disputeId = null;
try {
  const hash = await client.writeContract({
    address:      CONTRACT,
    functionName: "submit_dispute",
    args: [
      address,
      "Storm test dispute: validator claims uptime was manually verified at 99.7% not 99.4%",
      "https://explorer-studio.genlayer.com",
    ],
    value: BigInt(0),
  });
  const receipt = await waitFinalized(client, hash, "submit_dispute");
  // try parse dispute_id from receipt logs if available
  ok("dispute submitted", receipt);
} catch (e) {
  fail("submit_dispute", e);
}

// ── STEP 12: trigger_reassessment ────────────────────────────────────────────

log("STEP 12", "trigger_reassessment — re-evaluate after new events (takes ~60s)");
try {
  const hash = await client.writeContract({
    address:      CONTRACT,
    functionName: "trigger_reassessment",
    args:         [address],
    value:        BigInt(0),
  });
  await waitFinalized(client, hash, "trigger_reassessment");
} catch (e) {
  fail("trigger_reassessment", e);
}

// ── STEP 13: get_stats ────────────────────────────────────────────────────────

log("STEP 13", "get_stats — protocol-wide counters");
try {
  const raw = await client.readContract({
    address:      CONTRACT,
    functionName: "get_stats",
    args:         [],
  });
  ok("stats", JSON.parse(raw));
} catch (e) {
  fail("get_stats", e);
}

// ── STEP 14: has_reputation ───────────────────────────────────────────────────

log("STEP 14", "has_reputation — final bool check");
try {
  const has = await client.readContract({
    address:      CONTRACT,
    functionName: "has_reputation",
    args:         [address],
  });
  ok("has_reputation", has);
} catch (e) {
  fail("has_reputation", e);
}

log("DONE", "Storm test complete ✓");
