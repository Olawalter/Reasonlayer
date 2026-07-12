# Contract Specification

File: `contracts/ReasonLayer.py`

## State
See contract source for full dataclass definitions.

## View Methods
- get_member(address)
- get_validator(address)
- get_trust_passport(address)
- get_evaluations(address, limit, offset)
- get_recommendations(address)
- get_validator_registry(limit, offset)
- get_endorsements(address)
- get_dispute(dispute_id)
- is_registered(address)
- get_stats()

## Write Methods (Deterministic)
- register_member(display_name, bio)
- register_validator(moniker, website)
- update_profile(display_name, bio)
- submit_endorsement(target)
- submit_dispute(target, reason, evidence_url)
- set_validator_uptime(address, score)  [admin]
- grant_role(address, role)             [owner]
- pause_contract()                      [owner]
- unpause_contract()                    [owner]

## AI Leader Functions
- request_trust_evaluation(address) -- Equivalence: run_nondet_unsafe, partial field match
- generate_recommendations(for_address) -- Equivalence: prompt_non_comparative
- resolve_dispute(dispute_id) -- Equivalence: prompt_comparative
