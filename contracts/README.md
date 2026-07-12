# ReasonLayer Intelligent Contract

Single Python Intelligent Contract deployed to GenLayer StudioNet.

## File
- `ReasonLayer.py` -- the contract source

## Deploy
```bash
genlayer deploy --network studionet contracts/ReasonLayer.py
```

## Test (direct mode -- no network)
```bash
pytest tests/contract/ -v
```

## Test (integration mode -- requires localnet)
```bash
genlayer up
pytest tests/contract/ -v --integration
```
