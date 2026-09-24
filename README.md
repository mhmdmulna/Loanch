# Loanch

Loanch is a share-based lending pool for one ERC-20 asset. This repository is complete through **PRD Phase 10 (local smart contract development and security pass)**. BOT Chain deployment is Phase 11. The React frontend in `frontend/` is a separate parallel track and currently builds as a foundation; the Phase 1–10 roadmap covers the contract, tests, and handoff.

`Loanch.md` defines product and financial rules; `PRD.md` defines the implementation roadmap. The contract interface, error/event catalog, and security review are in [docs/CONTRACT_INTERFACE.md](docs/CONTRACT_INTERFACE.md), [docs/ERRORS_AND_EVENTS.md](docs/ERRORS_AND_EVENTS.md), and [docs/SECURITY_REVIEW.md](docs/SECURITY_REVIEW.md). The Phase 10 release-candidate ABI is [contracts/abi/LoanchPool.json](contracts/abi/LoanchPool.json).

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Install and verify

```bash
npm ci
npm ci --prefix frontend
npm run compile
npm run typecheck
npm run lint
npm test
npm run frontend:lint
npm run frontend:build
```

The contract tests cover verified deposits, share pricing and weights, immediate withdrawals, separate stake, loan eligibility and disbursement, principal-first repayment, return claims, platform revenue, the seven-day default waterfall, token callback reentrancy, and accounting invariants over 20 deterministic fuzz seeds.

## Run the local financial flow

For an isolated Hardhat chain that exits when the script finishes:

```bash
npm run local:demo
```

The script deploys `MockToken` and `LoanchPool`, verifies demo wallets, deposits 1,000 tokens, stakes 25, borrows 500, repays 550, claims the Saver return, and prints addresses and final state. It uses Hardhat's standard public development accounts. `loanStatus: "2"` means Completed.

For a persistent local chain, run these in separate terminals:

```bash
npx hardhat node
npx hardhat run scripts/local-demo.ts --network localhost
```

The local JSON-RPC URL is `http://127.0.0.1:8545`, chain ID `31337`. Use the addresses printed by the script for that node session. To regenerate the ABI after a contract change, run `npm run compile && npm run abi:export`; rerun the full Phase 10 checks before sharing a changed ABI.

The frontend dev server can be started with `npm run frontend:dev`. Its BOT Chain configuration remains for the separate frontend/deployment work; it is not used by the local contract demo.

## Financial parameters

The initial liquidity reserve target is 20% of Saver principal claims. It stays Saver-owned. Margin is split 80% Saver, 15% platform, and 5% loss reserve, with owner-controlled BPS settings for future payments. Saver weight defaults to 1× and may be set to 0.5×–2× for future return. The local MVP uses a minimum risk score of 60, 5% locked stake, at most 50% of Saver principal claims per loan, a 1–365 day duration, and a fixed 10% loan margin. The full rounding and default rules are documented in the interface guide.

No real identity data or private keys are stored on-chain. `MockToken` has unrestricted minting and is only for local tests and demos. `LoanchPool` has not been deployed to BOT Chain.
