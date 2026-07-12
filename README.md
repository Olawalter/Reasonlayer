# ReasonLayer

**AI-native Validator Intelligence Protocol on GenLayer**

ReasonLayer is a decentralized trust adjudication protocol where multiple GenLayer AI validator nodes reach consensus on validator trustworthiness. It is not a reputation calculator — it is a system where AI *is* the validator.

No backend. No oracle. No admin keys. Every reputation score, recommendation, and dispute resolution runs through GenLayer's Intelligent Contract and AI consensus.

---

## What Makes This GenLayer-Native

Traditional smart contracts are deterministic — every node runs the same code and reaches the exact same output. That means no LLMs, no judgment, no contextual reasoning. Only arithmetic.

GenLayer solves this with **Optimistic Democracy**: multiple AI-enabled validator nodes independently reason about the same prompt, then vote on whether their conclusions are *equivalent* — not identical. ReasonLayer is built entirely on this primitive.

---

## Protocol Flow

```
Wallet Connect → Submit Evidence → AI Evaluation → Consensus → Reputation Finalized
                                        ↓
                               gl.nondet.exec_prompt()
                            (3 nodes, independent reasoning)
                                        ↓
                               Equivalence Check
                          (tier match · score ±8 · confidence agree)
                                        ↓
                               On-chain Record
                      (score · tier · strengths · risk_factors · summary)
```

1. **Connect Wallet** — protocol retrieves on-chain identity, no sign-up
2. **Submit Evidence** — uptime %, governance votes, delegator count, slashing history, age, disputes
3. **Evidence Assembled** — stored on-chain in `TreeMap[Address, str]`; no score exists yet
4. **AI Reasoning** — `gl.nondet.exec_prompt()` invoked; each node reasons independently
5. **Independent Consensus** — 3 validator nodes return score, tier, confidence, and reasoning
6. **Equivalence Verified** — GenLayer checks semantic agreement, not identical output
7. **Reputation Finalized** — score, tier, and confidence written to chain as immutable state
8. **Explainable Record** — strengths, risk factors, and summary stored alongside the score
9. **Validator Recommendation** — delegators set preferences; AI matches them to best validator
10. **Continuous Reassessment** — new on-chain events trigger re-evaluation

---

## GenLayer Capabilities Used

### 1. `gl.vm.run_nondet_unsafe` — Non-Deterministic AI Consensus

The core of `evaluate_reputation()`. Multiple validator nodes run the same prompt independently. Their outputs are passed through a custom equivalence function before any result is written to state.

```python
@gl.public.write
def evaluate_reputation(self, address: str) -> None:
    result = gl.vm.run_nondet_unsafe(leader_fn, equivalence_fn)
    # result is only written if equivalence_fn approves all node outputs
```

**Why `run_nondet_unsafe` and not a simple view?** Because reputation is a *judgment* — it requires contextual reasoning that produces different but semantically equivalent outputs across nodes. A deterministic function cannot adjudicate trust.

---

### 2. `gl.nondet.exec_prompt()` — LLM Inference Inside the Contract

The actual AI call made inside `leader_fn`. Each validator node calls this independently against the same evidence, receiving its own LLM response. No two outputs are identical — that is by design.

```python
def leader_fn():
    response = gl.nondet.exec_prompt(prompt)
    data = json.loads(response)
    return {
        "score":        data["score"],        # 0–100
        "tier":         data["tier"],         # Unverified | Bronze | Silver | Trusted | Elite
        "confidence":   data["confidence"],   # low | medium | high
        "summary":      data["summary"],
        "strengths":    data["strengths"],
        "risk_factors": data["risk_factors"],
    }
```

---

### 3. Custom Equivalence Function — Semantic Tolerance

ReasonLayer defines its own equivalence rule rather than requiring bit-for-bit identical outputs. This is what makes AI consensus practical: LLMs naturally produce slightly different scores on each run, but they converge on the same *conclusion*.

```python
def equivalence_fn(output):
    mine = leader_fn()
    data = json.loads(output)
    return (
        data["tier"] == mine["tier"]                 # tier must match exactly
        and abs(data["score"] - mine["score"]) <= 8  # scores within ±8 points
        and data["confidence"] == mine["confidence"] # confidence must agree
    )
```

**Design decision — why ±8?** A score of 74 and 81 represent the same validator quality. Requiring identical scores would cause consensus to fail on every run. ±8 is tight enough to reject genuinely divergent assessments while tolerating natural LLM variance within a tier boundary.

**Design decision — why exact tier match?** Tier is the outcome users act on. A validator calling themselves `Trusted` when another node says `Silver` is a material disagreement, even if scores are numerically close. Tiers are the hard contract.

---

### 4. `gl.eq_principle.prompt_non_comparative` — Recommendation Equivalence

Used in `generate_recommendation()`. Validator nodes do not re-run the leader's recommendation from scratch — they assess whether the leader's output satisfies the delegator's stated preferences. The question is not "what is the best validator?" but "does this recommendation meet these criteria?"

```python
@gl.public.write
def generate_recommendation(self, for_address: str, security_priority: str, ...) -> None:
    # Leader picks the best validator given preferences
    # Validator nodes check: does this recommendation satisfy the criteria?
    gl.eq_principle.prompt_non_comparative(result_json, criteria_prompt)
```

**Why non-comparative here?** The recommendation is preference-weighted and subjective. Asking every node to re-derive it would produce different validators being recommended — not because the answer is wrong, but because multiple correct answers may exist. `prompt_non_comparative` lets nodes verify the *quality* of the leader's answer without requiring them to agree on the exact same validator.

---

### 5. `gl.eq_principle.prompt_comparative` — Dispute Resolution

Used in `resolve_dispute()`. When a dispute is filed against a validator's reputation, the contract presents both sides — the dispute claim and the existing reputation record — and asks validator nodes to rule on which is correct. Verdict must match exactly.

```python
@gl.public.write
def resolve_dispute(self, dispute_id: u32) -> None:
    # Both sides presented in structured format
    # All nodes must reach the same verdict: "upheld" or "rejected"
    gl.eq_principle.prompt_comparative(dispute_json, resolution_prompt)
```

**Why comparative here, not non-comparative?** A dispute has a binary outcome — upheld or rejected. There is no room for "close enough." If two nodes disagree on whether a validator was wrongly scored, that is a real disagreement that must be surfaced, not tolerated. Comparative equivalence enforces this hard agreement.

---

### 6. `TreeMap[Address, str]` — Fully On-Chain Storage

All data lives in GenLayer's native typed storage. No IPFS, no centralized database, no external calls.

```python
evidence:        TreeMap[Address, str]   # submitted validator signals
reputations:     TreeMap[Address, str]   # AI-evaluated reputation records
eval_history:    TreeMap[Address, str]   # full evaluation audit trail
validators:      TreeMap[Address, str]   # auto-registered validator profiles
recommendations: TreeMap[Address, str]   # AI-generated delegator recommendations
disputes:        TreeMap[str, str]       # filed and resolved disputes
```

Each value is a JSON-encoded struct. GenLayer's storage is schemaless at the VM level, so JSON gives flexibility while keeping all state verifiable on-chain.

---

### 7. Auto-Registration Pattern

Evidence submission auto-registers the validator in a single transaction. No separate `register()` call needed.

```python
def submit_evidence(self, moniker, uptime_pct, ...) -> None:
    self.evidence[sender] = json.dumps({ ... })
    self.validators[sender] = json.dumps({ ... })  # auto-register in same tx
```

**Why?** Requiring two transactions creates failure states. If `register()` succeeds but `submit_evidence()` fails, the validator is in a broken half-registered state. A single atomic write eliminates that class of bug entirely.

---

## Scoring Model

The AI prompt receives all signals and reasons holistically — not through rigid arithmetic. This means the AI can contextualise: a validator with 98.9% uptime and zero slashings is not meaningfully worse than 99.0%, and a formula would penalise them unfairly.

| Signal | Guidance to AI |
|---|---|
| Uptime ≥ 99% | Strong positive |
| Each slashing event | Strong negative (−20 equivalent) |
| Governance votes ≥ 100 | Positive engagement signal |
| Delegator count ≥ 500 | Network trust signal |
| Validator age ≥ 730 days | Longevity and commitment |
| Baseline | 50 — neutral starting point |

## Trust Tiers

| Tier | Score Range | Meaning |
|---|---|---|
| Unverified | 0–19 | No reliable signals |
| Bronze | 20–39 | Early-stage validator |
| Silver | 40–59 | Competent, limited history |
| Trusted | 60–79 | Established, consistent |
| Elite | 80–100 | Exceptional track record |

---

## Contract

**File:** `contracts/ReasonLayer.py`  
**Network:** GenLayer StudioNet (Chain ID 61999)  
**Address:** `0x3E0d9159A8740341E489DD4AD58127FCe4F9869B`

### Write Methods

| Method | GenLayer Primitive | Description |
|---|---|---|
| `submit_evidence(...)` | — | Store on-chain signals, auto-register validator |
| `evaluate_reputation(address)` | `gl.vm.run_nondet_unsafe` | AI consensus reputation evaluation |
| `trigger_reassessment(address)` | `gl.vm.run_nondet_unsafe` | Re-evaluate on new events |
| `generate_recommendation(...)` | `gl.eq_principle.prompt_non_comparative` | AI-matched validator recommendation |
| `submit_dispute(target, reason, url)` | — | File a dispute against a reputation |
| `resolve_dispute(dispute_id)` | `gl.eq_principle.prompt_comparative` | AI-arbitrated dispute resolution |

### View Methods

| Method | Returns |
|---|---|
| `get_evidence(address)` | JSON — submitted validator signals |
| `get_reputation(address)` | JSON — AI reputation record |
| `get_evaluation_history(address)` | JSON array — full evaluation audit trail |
| `get_validator(address)` | JSON — validator profile |
| `get_validator_registry(limit, offset)` | JSON array — paginated registry |
| `get_recommendation(address)` | JSON — latest AI recommendation |
| `get_stats()` | JSON — protocol-wide counters |
| `has_evidence(address)` | bool |
| `has_reputation(address)` | bool |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Intelligent Contract | Python · GenLayer SDK |
| genlayer-js | `1.1.8` (pinned) |
| Chain | GenLayer StudioNet · Chain ID 61999 |
| Frontend | Next.js 16 · TypeScript · Tailwind CSS |
| Wallet | wagmi v2 · `injected()` connector (MetaMask / Rabby) |
| State | TanStack Query v5 · Zustand |
| Animations | Framer Motion |
| RPC reads | `gen_call` via genlayer-js |
| RPC writes | `eth_sendTransaction` via `window.ethereum` |

---

## Local Development

### Prerequisites

- Node.js 20+
- MetaMask or Rabby browser extension
- GEN tokens on StudioNet

### Setup

```bash
git clone https://github.com/Olawalter/Reasonlayer.git
cd Reasonlayer/frontend
npm install
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x3E0d9159A8740341E489DD4AD58127FCe4F9869B
NEXT_PUBLIC_CHAIN_ID=61999
NEXT_PUBLIC_RPC_URL=https://studio.genlayer.com/api
NEXT_PUBLIC_APP_NAME=ReasonLayer
```

```bash
npm run dev
# → http://localhost:3000
```

The app auto-switches MetaMask to StudioNet on any write call. If your wallet is on a different network, you will be prompted to switch before the transaction is sent.

**StudioNet config:**

| Field | Value |
|---|---|
| Network Name | Genlayer Studio Network |
| Chain ID | 61999 |
| RPC URL | https://studio.genlayer.com/api |
| Currency Symbol | GEN |
| Explorer | https://explorer-studio.genlayer.com |

---

## Project Structure

```
ReasonLayer/
├── contracts/
│   └── ReasonLayer.py              # GenLayer Intelligent Contract
├── frontend/
│   ├── src/
│   │   ├── app/                    # Next.js App Router pages
│   │   ├── components/
│   │   │   ├── layout/             # Page views (Evidence, Evaluate, Dashboard…)
│   │   │   └── ui/                 # Reusable components
│   │   ├── hooks/                  # useEvidence, useReputation, useValidator…
│   │   ├── lib/
│   │   │   ├── genlayer/           # contract.ts · client.ts · types.ts
│   │   │   └── wallet/             # wagmi config (injected connector only)
│   │   └── store/                  # Zustand profile + UI stores
│   └── vercel.json
└── README.md
```

---

## Why GenLayer for This

| Requirement | Why Traditional Chains Fail | How GenLayer Solves It |
|---|---|---|
| Contextual reputation scoring | `score = uptime × 0.5` is rigid arithmetic | AI reads all signals holistically |
| Tolerating LLM variance | Deterministic VMs require identical outputs | Custom equivalence allows ±8 score drift |
| Decentralised recommendations | No on-chain LLM inference | `prompt_non_comparative` verifies recommendation quality |
| Trustless dispute arbitration | Requires off-chain arbiters or multisig | `prompt_comparative` — nodes rule autonomously |
| Explainability | Smart contracts store numbers, not reasoning | Strengths, risk factors, and summary stored on-chain |

---

## Live

**Frontend:** [validex-app.vercel.app](https://validex-app.vercel.app)  
**Contract:** `0x3E0d9159A8740341E489DD4AD58127FCe4F9869B` on GenLayer StudioNet  
**Explorer:** [explorer-studio.genlayer.com](https://explorer-studio.genlayer.com)

---

*Built on [GenLayer](https://genlayer.com) — the first blockchain with native AI consensus.*
