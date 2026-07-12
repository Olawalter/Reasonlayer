/**
 * ReasonLayer End-to-End Storm Test
 * Exercises every contract method with real data on GenLayer StudioNet
 */

import { createClient, createAccount, chains } from "genlayer-js";
import { TransactionStatus } from "genlayer-js/types";

const PRIVATE_KEY = "0x561d7e3dec45ea187356132646c3b3970267b4d2f09e4c51bc8b3b691918eef6";
const CONTRACT    = "0x3E0d9159A8740341E489DD4AD58127FCe4F9869B";

// A second address to be the dispute target (cannot dispute yourself)
const DISPUTE_TARGET = "0x0000000000000000000000000000000000000001";

const account = createAccount(PRIVATE_KEY);
const client  = createClient({ chain: chains.studionet, account });
const address = account.address;

// ── helpers ───────────────────────────────────────────────────────────────────

function log(step, msg, data) {
  console.log(`\n${"─".repeat(64)}`);
  console.log(`[${step}] ${msg}`);
  if (data !== undefined) console.log(JSON.stringify(data, null, 2));
}
function ok(label, val) {
  console.log(`  ✓  ${label}:`, typeof val === "object" ? JSON.stringify(val, null, 2) : val);
}
function bad(label, e) {
  console.error(`  ✗  ${label}:`, e?.message ?? String(e));
}

async function send(functionName, args, label) {
  console.log(`     calling ${functionName}...`);
  const hash = await client.writeContract({
    address: CONTRACT,
    functionName,
    args,
    value: BigInt(0),
  });
  console.log(`     tx → ${hash}`);
  const receipt = await client.waitForTransactionReceipt({
    hash,
    status:   TransactionStatus.FINALIZED,
    retries:  120,
    interval: 5000,
  });
  ok(`${label} finalized`, receipt.transactionHash ?? hash);
  return receipt;
}

async function read(functionName, args) {
  const raw = await client.readContract({ address: CONTRACT, functionName, args });
  try { return JSON.parse(raw); } catch { return raw; }
}

// ── start ─────────────────────────────────────────────────────────────────────

log("SETUP", "Storm test starting", { account: address, contract: CONTRACT });

// ── STEP 1: submit_evidence ───────────────────────────────────────────────────
// Signature: moniker, uptime_pct(str), slashing_events(u32), governance_votes(u32),
//            delegator_count(u32), validator_age_days(u32), missed_blocks(u32),
//            disputes_won(u32), disputes_lost(u32), website(str), additional_notes(str)

log("STEP 1/9", "submit_evidence — store signals + auto-register validator");
try {
  await send("submit_evidence", [
    "StormNode",                        // moniker
    "99.4",                             // uptime_pct (str)
    0,                                  // slashing_events
    142,                                // governance_votes
    387,                                // delegator_count
    820,                                // validator_age_days
    12,                                 // missed_blocks
    3,                                  // disputes_won
    0,                                  // disputes_lost
    "https://stormnode.io",             // website
    "High-performance validator running on bare metal with redundant power.",  // additional_notes
  ], "submit_evidence");
} catch(e) { bad("submit_evidence", e); process.exit(1); }

// ── STEP 2: read back evidence ────────────────────────────────────────────────

log("STEP 2/9", "get_evidence + has_evidence + get_validator");
try { ok("evidence",     await read("get_evidence",  [address])); } catch(e) { bad("get_evidence", e); }
try { ok("has_evidence", await read("has_evidence",  [address])); } catch(e) { bad("has_evidence", e); }
try { ok("validator",    await read("get_validator", [address])); } catch(e) { bad("get_validator", e); }

// ── STEP 3: evaluate_reputation (AI consensus) ────────────────────────────────

log("STEP 3/9", "evaluate_reputation — AI consensus, waiting ~60–120 s...");
try {
  await send("evaluate_reputation", [address], "evaluate_reputation");
} catch(e) { bad("evaluate_reputation", e); process.exit(1); }

// ── STEP 4: read reputation + history ────────────────────────────────────────

log("STEP 4/9", "get_reputation + history + has_reputation");
try { ok("reputation",     await read("get_reputation",         [address])); } catch(e) { bad("get_reputation", e); }
try { ok("history",        await read("get_evaluation_history",  [address])); } catch(e) { bad("get_evaluation_history", e); }
try { ok("has_reputation", await read("has_reputation",          [address])); } catch(e) { bad("has_reputation", e); }

// ── STEP 5: validator registry ────────────────────────────────────────────────

log("STEP 5/9", "get_validator_registry (limit=10, offset=0)");
try {
  const list = await read("get_validator_registry", [10, 0]);
  ok(`registry (${Array.isArray(list) ? list.length : "?"} validators)`, list);
} catch(e) { bad("get_validator_registry", e); }

// ── STEP 6: generate_recommendation (AI) ─────────────────────────────────────
// Signature: for_address, security_priority, governance_priority,
//            decentralization_priority, notes

log("STEP 6/9", "generate_recommendation — AI delegator match, ~60 s...");
try {
  await send("generate_recommendation", [
    address,        // for_address
    "high",         // security_priority
    "medium",       // governance_priority
    "low",          // decentralization_priority
    "Prefer validators with zero slashing history and long track record.",  // notes
  ], "generate_recommendation");
} catch(e) { bad("generate_recommendation", e); }

log("STEP 6b/9", "get_recommendation");
try { ok("recommendation", await read("get_recommendation", [address])); } catch(e) { bad("get_recommendation", e); }

// ── STEP 7: get_stats ─────────────────────────────────────────────────────────

log("STEP 7/9", "get_stats — protocol-wide counters");
try { ok("stats", await read("get_stats", [])); } catch(e) { bad("get_stats", e); }

// ── STEP 8: trigger_reassessment (AI) ────────────────────────────────────────

log("STEP 8/9", "trigger_reassessment — re-evaluate, ~60 s...");
try {
  await send("trigger_reassessment", [address], "trigger_reassessment");
} catch(e) { bad("trigger_reassessment", e); }

// ── STEP 9: final reputation read ────────────────────────────────────────────

log("STEP 9/9", "Final reputation post-reassessment");
try { ok("reputation (final)", await read("get_reputation", [address])); } catch(e) { bad("final reputation", e); }
try { ok("stats (final)",      await read("get_stats", [])); }            catch(e) { bad("final stats", e); }

log("DONE", "Storm test complete ✓  All steps exercised.");
console.log(`\n  Account: ${address}`);
console.log(`  Explorer: https://explorer-studio.genlayer.com/address/${address}`);
