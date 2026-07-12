# Testing Guide

## Contract Tests (direct mode)
```bash
pip install genlayer-test
pytest tests/contract/ -v
```

## Contract Tests (integration mode -- requires localnet)
```bash
genlayer up
pytest tests/contract/ -v --integration
```

## Frontend Type Check
```bash
cd frontend && npm run type-check
```
