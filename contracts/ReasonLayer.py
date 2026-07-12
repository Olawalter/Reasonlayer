# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from genlayer import *
from datetime import datetime, timezone
import json


# Module-level helpers — no `self`, safe to call inside nondet closures
def _parse_json(raw: str) -> dict:
    cleaned = raw.replace("```json", "").replace("```", "").strip()
    return json.loads(cleaned)


def _score_to_tier(score: int) -> str:
    if score < 20: return "Unverified"
    if score < 40: return "Bronze"
    if score < 60: return "Silver"
    if score < 80: return "Trusted"
    return "Elite"


class ReasonLayer(gl.Contract):
    # ── Storage ───────────────────────────────────────────────────────────
    owner: str
    paused: bool
    total_evaluations: u32
    total_disputes: u32

    # Evidence submitted by validators (JSON-encoded)
    evidence: TreeMap[Address, str]

    # Reputation records (JSON-encoded)
    reputations: TreeMap[Address, str]

    # Evaluation history per address (JSON list)
    eval_history: TreeMap[Address, str]

    # Validator registry (JSON-encoded)
    validators: TreeMap[Address, str]

    # Recommendations (JSON-encoded)
    recommendations: TreeMap[Address, str]

    # Disputes
    disputes: TreeMap[str, str]

    # ── Constructor ───────────────────────────────────────────────────────

    def __init__(self) -> None:
        self.owner = str(gl.message.sender_address)
        self.paused = False
        self.total_evaluations = u32(0)
        self.total_disputes = u32(0)

    # ── Helpers ───────────────────────────────────────────────────────────

    def _now(self) -> int:
        return int(datetime.now(timezone.utc).timestamp())

    def _require_not_paused(self) -> None:
        if self.paused:
            raise Exception("Contract is paused")

    def _require_owner(self) -> None:
        if str(gl.message.sender_address) != self.owner:
            raise Exception("Owner only")

    def _parse_json(self, raw: str) -> dict:
        return _parse_json(raw)

    def _score_to_tier(self, score: int) -> str:
        return _score_to_tier(score)

    # ── View Methods ──────────────────────────────────────────────────────

    @gl.public.view
    def get_evidence(self, address: str) -> str:
        return self.evidence.get(Address(address), "")

    @gl.public.view
    def has_evidence(self, address: str) -> bool:
        return Address(address) in self.evidence

    @gl.public.view
    def get_reputation(self, address: str) -> str:
        return self.reputations.get(Address(address), "")

    @gl.public.view
    def has_reputation(self, address: str) -> bool:
        return Address(address) in self.reputations

    @gl.public.view
    def get_evaluation_history(self, address: str) -> str:
        return self.eval_history.get(Address(address), "[]")

    @gl.public.view
    def get_validator(self, address: str) -> str:
        return self.validators.get(Address(address), "")

    @gl.public.view
    def get_validator_registry(self, limit: u32, offset: u32) -> str:
        result = []
        count = 0
        skipped = 0
        for addr in self.validators:
            if skipped < int(offset):
                skipped += 1
                continue
            if count >= int(limit):
                break
            result.append(json.loads(self.validators[addr]))
            count += 1
        return json.dumps(result)

    @gl.public.view
    def get_recommendation(self, address: str) -> str:
        return self.recommendations.get(Address(address), "")

    @gl.public.view
    def get_stats(self) -> str:
        total_validators = 0
        for _ in self.validators:
            total_validators += 1
        return json.dumps({
            "total_evaluations": int(self.total_evaluations),
            "total_validators":  total_validators,
            "total_disputes":    int(self.total_disputes),
        })

    # ── Evidence Submission ───────────────────────────────────────────────

    @gl.public.write
    def submit_evidence(
        self,
        moniker: str,
        uptime_pct: str,
        slashing_events: u32,
        governance_votes: u32,
        delegator_count: u32,
        validator_age_days: u32,
        missed_blocks: u32,
        disputes_won: u32,
        disputes_lost: u32,
        website: str,
        additional_notes: str,
    ) -> None:
        self._require_not_paused()
        sender = gl.message.sender_address
        if not moniker.strip():
            raise Exception("moniker cannot be empty")

        self.evidence[sender] = json.dumps({
            "address":            str(sender),
            "moniker":            moniker.strip()[:64],
            "uptime_pct":         float(uptime_pct),
            "slashing_events":    int(slashing_events),
            "governance_votes":   int(governance_votes),
            "delegator_count":    int(delegator_count),
            "validator_age_days": int(validator_age_days),
            "missed_blocks":      int(missed_blocks),
            "disputes_won":       int(disputes_won),
            "disputes_lost":      int(disputes_lost),
            "website":            website.strip()[:256],
            "additional_notes":   additional_notes.strip()[:512],
            "submitted_at":       self._now(),
        })

        # Auto-register or update validator profile
        self.validators[sender] = json.dumps({
            "address":          str(sender),
            "moniker":          moniker.strip()[:64],
            "website":          website.strip()[:256],
            "is_active":        True,
            "registered_at":    self._now(),
            "uptime_pct":       float(uptime_pct),
            "slashing_events":  int(slashing_events),
            "governance_votes": int(governance_votes),
            "delegator_count":  int(delegator_count),
        })

    # ── AI Reputation Evaluation ──────────────────────────────────────────
    # Equivalence: tier must match exactly; score within ±8; confidence must agree.

    @gl.public.write
    def evaluate_reputation(self, address: str) -> None:
        self._require_not_paused()
        addr = Address(address)
        if addr not in self.evidence:
            raise Exception("No evidence submitted. Submit evidence first.")

        ev = json.loads(self.evidence[addr])

        prompt = (
            "You are an AI trust adjudicator for ReasonLayer, a decentralized validator intelligence protocol.\n"
            "Evaluate the reputation of this validator based on their submitted on-chain evidence.\n\n"
            "<evidence>\n"
            "Address: " + address + "\n"
            "Moniker: " + ev.get("moniker", "") + "\n"
            "Uptime: " + str(ev.get("uptime_pct", 0)) + "%\n"
            "Missed Blocks: " + str(ev.get("missed_blocks", 0)) + "\n"
            "Slashing Events: " + str(ev.get("slashing_events", 0)) + "\n"
            "Governance Votes: " + str(ev.get("governance_votes", 0)) + "\n"
            "Delegator Count: " + str(ev.get("delegator_count", 0)) + "\n"
            "Validator Age (days): " + str(ev.get("validator_age_days", 0)) + "\n"
            "Disputes Won: " + str(ev.get("disputes_won", 0)) + "\n"
            "Disputes Lost: " + str(ev.get("disputes_lost", 0)) + "\n"
            "Notes: " + ev.get("additional_notes", "") + "\n"
            "</evidence>\n\n"
            "Scoring rules:\n"
            "  - Start at 50 (neutral baseline)\n"
            "  - Uptime >= 99%: +15; 95-98.9%: +8; 90-94.9%: +3; < 90%: -10\n"
            "  - Each slashing event: -20 (floor 5)\n"
            "  - Missed blocks > 100: -5\n"
            "  - Governance votes >= 100: +10; >= 50: +5\n"
            "  - Delegator count >= 500: +10; >= 200: +5; >= 50: +2\n"
            "  - Validator age >= 730 days: +10; >= 365 days: +5\n"
            "  - Disputes won: +3 each (max +10)\n"
            "  - Disputes lost: -10 each\n"
            "  - Clamp to 0-100\n\n"
            "Tier: 0-19 Unverified | 20-39 Bronze | 40-59 Silver | 60-79 Trusted | 80-100 Elite\n\n"
            "Respond ONLY with a valid JSON object. No markdown. Required keys:\n"
            '  "score": integer 0-100\n'
            '  "tier": one of "Unverified","Bronze","Silver","Trusted","Elite"\n'
            '  "confidence": one of "high","medium","low"\n'
            '  "summary": 2-3 sentence string\n'
            '  "strengths": array of up to 4 strings\n'
            '  "risk_factors": array of strings (empty if none)\n'
        )

        def leader_fn():
            raw = gl.nondet.exec_prompt(prompt)
            data = _parse_json(raw)
            score = max(0, min(100, int(data.get("score", 50))))
            tier = _score_to_tier(score)
            conf = str(data.get("confidence", "medium")).lower()
            if conf not in ("high", "medium", "low"):
                conf = "medium"
            return {
                "score":        score,
                "tier":         tier,
                "confidence":   conf,
                "summary":      str(data.get("summary", "")),
                "strengths":    data.get("strengths", []),
                "risk_factors": data.get("risk_factors", []),
            }

        def validator_fn(leader_result) -> bool:
            if not isinstance(leader_result, gl.vm.Return):
                return False
            mine = leader_fn()
            data = leader_result.calldata
            return (
                data["tier"] == mine["tier"]
                and abs(data["score"] - mine["score"]) <= 8
                and data["confidence"] == mine["confidence"]
            )

        result = gl.vm.run_nondet_unsafe(leader_fn, validator_fn)

        now = self._now()
        ev_id = int(self.total_evaluations)

        record = {
            "ev_id":        ev_id,
            "address":      address,
            "score":        result["score"],
            "tier":         result["tier"],
            "confidence":   result["confidence"],
            "summary":      result["summary"],
            "strengths":    result["strengths"],
            "risk_factors": result["risk_factors"],
            "evaluated_at": now,
        }

        prev_count = 0
        if addr in self.reputations:
            prev = json.loads(self.reputations[addr])
            prev_count = prev.get("evaluation_count", 0)

        self.reputations[addr] = json.dumps({
            "address":           address,
            "score":             result["score"],
            "tier":              result["tier"],
            "confidence":        result["confidence"],
            "summary":           result["summary"],
            "strengths":         result["strengths"],
            "risk_factors":      result["risk_factors"],
            "last_evaluated_at": now,
            "evaluation_count":  prev_count + 1,
        })

        history = json.loads(self.eval_history.get(addr, "[]"))
        history.append(record)
        self.eval_history[addr] = json.dumps(history)

        self.total_evaluations = u32(ev_id + 1)

    @gl.public.write
    def trigger_reassessment(self, address: str) -> None:
        self.evaluate_reputation(address)

    # ── Validator Recommendation ──────────────────────────────────────────
    # Equivalence: prompt_non_comparative

    @gl.public.write
    def generate_recommendation(
        self,
        for_address: str,
        security_priority: str,
        governance_priority: str,
        decentralization_priority: str,
        notes: str,
    ) -> None:
        self._require_not_paused()
        addr = Address(for_address)

        candidates = []
        count = 0
        for vaddr in self.validators:
            v = json.loads(self.validators[vaddr])
            if not v.get("is_active", False):
                continue
            rep_str = self.reputations.get(vaddr, "")
            rep = json.loads(rep_str) if rep_str else None
            candidates.append({
                "address":          str(vaddr),
                "moniker":          v.get("moniker", ""),
                "uptime_pct":       v.get("uptime_pct", 0),
                "slashing_events":  v.get("slashing_events", 0),
                "governance_votes": v.get("governance_votes", 0),
                "delegator_count":  v.get("delegator_count", 0),
                "reputation_score": rep["score"] if rep else None,
                "reputation_tier":  rep["tier"] if rep else "Unverified",
            })
            count += 1
            if count >= 20:
                break

        if count == 0:
            raise Exception("No active validators with evidence on record yet.")

        context = json.dumps({
            "for_address": for_address,
            "user_preferences": {
                "security_priority":         security_priority,
                "governance_priority":       governance_priority,
                "decentralization_priority": decentralization_priority,
                "notes":                     notes,
            },
            "candidate_validators": candidates,
        })

        task = (
            "You are a validator recommendation engine. "
            "Review the user preferences and the candidate validators list. "
            "Select exactly ONE validator that best matches the user's priorities. "
            "High security priority: prefer high uptime, zero slashing. "
            "High governance priority: prefer more governance votes. "
            "High decentralization priority: prefer fewer delegators (community-run)."
        )

        criteria = (
            "Return a JSON object with exactly three keys: "
            '"recommended_address" (the wallet address string verbatim from candidate_validators), '
            '"confidence" (one of "high", "medium", "low"), and '
            '"reasoning" (2-3 sentences explaining the selection). '
            "No markdown. JSON only."
        )

        result = gl.eq_principle.prompt_non_comparative(
            lambda: context,
            task=task,
            criteria=criteria,
        )

        parsed = self._parse_json(result) if isinstance(result, str) else result

        self.recommendations[addr] = json.dumps({
            "for_address": for_address,
            "preferences": {
                "security_priority":         security_priority,
                "governance_priority":       governance_priority,
                "decentralization_priority": decentralization_priority,
                "notes":                     notes,
            },
            "recommended_address": parsed.get("recommended_address", ""),
            "confidence":          str(parsed.get("confidence", "medium")),
            "reasoning":           str(parsed.get("reasoning", "")),
            "generated_at":        self._now(),
        })

    # ── Dispute ───────────────────────────────────────────────────────────

    @gl.public.write
    def submit_dispute(self, target: str, reason: str, evidence_url: str) -> None:
        self._require_not_paused()
        sender = gl.message.sender_address
        if not reason.strip():
            raise Exception("reason cannot be empty")
        target_addr = Address(target)
        if str(sender) == str(target_addr):
            raise Exception("Cannot dispute yourself")

        d_id = int(self.total_disputes)
        self.disputes[str(d_id)] = json.dumps({
            "d_id":         d_id,
            "target":       str(target_addr),
            "raised_by":    str(sender),
            "reason":       reason.strip()[:1024],
            "evidence_url": evidence_url.strip()[:512],
            "resolution":   "pending",
            "ai_verdict":   "",
            "raised_at":    self._now(),
            "resolved_at":  0,
        })
        self.total_disputes = u32(d_id + 1)

    @gl.public.write
    def resolve_dispute(self, dispute_id: u32) -> None:
        self._require_not_paused()
        key = str(int(dispute_id))
        if key not in self.disputes:
            raise Exception("Dispute not found")
        dispute = json.loads(self.disputes[key])
        if dispute.get("resolution") != "pending":
            raise Exception("Dispute already resolved")

        context = json.dumps({
            "target":       dispute.get("target", ""),
            "raised_by":    dispute.get("raised_by", ""),
            "reason":       dispute.get("reason", ""),
            "evidence_url": dispute.get("evidence_url", ""),
        })

        def evaluate():
            prompt = (
                "You are an AI arbitrator for ReasonLayer.\n"
                "Assess this dispute:\n<dispute>\n" + context + "\n</dispute>\n\n"
                'Return "upheld" if the reason is serious and evidence credible.\n'
                'Return "rejected" if vague or bad-faith.\n'
                "Respond ONLY with JSON. No markdown.\n"
                'Keys: "verdict" ("upheld" or "rejected"), "reasoning" (2-3 sentences), "confidence" (0-100)\n'
            )
            raw = gl.nondet.exec_prompt(prompt)
            data = _parse_json(raw)
            verdict = str(data.get("verdict", "")).lower().strip()
            if verdict not in ("upheld", "rejected"):
                raise Exception("Invalid verdict: " + verdict)
            return json.dumps({
                "verdict":    verdict,
                "reasoning":  str(data.get("reasoning", "")),
                "confidence": int(data.get("confidence", 50)),
            }, sort_keys=True)

        result_str = gl.eq_principle.prompt_comparative(
            evaluate,
            principle='The "verdict" field must match exactly. Reasoning may differ.',
        )

        parsed = self._parse_json(result_str) if isinstance(result_str, str) else result_str
        dispute["resolution"]  = parsed["verdict"]
        dispute["ai_verdict"]  = parsed["reasoning"]
        dispute["resolved_at"] = self._now()
        self.disputes[key] = json.dumps(dispute)

    # ── Admin ─────────────────────────────────────────────────────────────

    @gl.public.write
    def pause_contract(self) -> None:
        self._require_owner()
        self.paused = True

    @gl.public.write
    def unpause_contract(self) -> None:
        self._require_owner()
        self.paused = False
