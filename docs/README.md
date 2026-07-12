# ReasonLayer

AI-native Validator Intelligence Protocol built on GenLayer.

## Quick Start

### Prerequisites
- Node.js 20+
- Python 3.11+
- GenLayer CLI: `npm install -g genlayer`

### 1. Install frontend dependencies
```bash
cd frontend
npm install
```

### 2. Configure environment
```bash
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_CONTRACT_ADDRESS, CHAIN_ID, RPC_URL after Step 15
```

### 3. Run frontend locally
```bash
npm run dev
```

### 4. Install contract test dependencies
```bash
pip install genlayer-test
```

### 5. Test the contract
```bash
pytest tests/contract/ -v
```

## Documentation
- [Architecture](ARCHITECTURE.md)
- [Contract Specification](CONTRACT_SPEC.md)
- [UI/UX Specification](UI_UX_SPEC.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Testing Guide](TESTING.md)
- [Changelog](CHANGELOG.md)
