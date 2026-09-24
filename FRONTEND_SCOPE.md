# Frontend Scope

This document defines the frontend/backend boundary for Loanch frontend work.

## Frontend Owns

- Presentation, layout, navigation, and visual hierarchy.
- Client-side interaction states for wallet, network, forms, and transactions.
- Client-side state derived from wallet connection and contract reads.
- Wallet connection UX, including disconnected, connected, wrong-network, pending, confirmed, and failed states.
- BOT Chain network display and client-side network switching prompts.
- Blockchain read/write calls from the browser through the existing frontend contract configuration.
- UI validation before requesting a wallet signature.
- Human-readable loading, empty, error, and transaction states.
- Frontend mock data used for product UI development, if isolated and clearly labeled.
- Frontend documentation, including audit, UX architecture, design system, and completion reports.

## Backend Owns

This repository currently does not expose an application backend directory or API implementation. If a backend is added later, it owns:

- API routes and server-side business logic.
- Database access, schema, migrations, and persistence.
- Authentication backend and server middleware.
- Private identity verification workflow and sensitive user metadata.
- Any off-chain verification or risk service implementation.

Frontend work must adapt to existing backend interfaces instead of modifying them.

## Smart Contracts Own

- On-chain financial rules and authoritative state.
- Deposit, withdrawal, liquidity, reserve, lending, staking, repayment, completion, and distribution logic.
- Contract events and contract-level validation.

Frontend work must not modify Solidity files, deployment scripts, Hardhat configuration, or contract tests unless the user explicitly changes the scope.

## Current Frontend Configuration Boundary

- Public browser configuration is read through `frontend/src/contracts/config.ts` and `frontend/src/contracts/addresses.ts`.
- Vite exposes only `VITE_*` variables to browser code. These values are bundled client-side and must not contain secrets.
- Contract addresses must remain configuration-driven and must not be replaced with fake production addresses.

## Integration Dependencies

- A deployed Loanch contract address is needed for real production reads and writes.
- BOT Chain explorer URLs are needed before production transaction links can be final.
- If identity verification is not available on-chain or through a backend, the frontend may show clearly labeled demo/mock verification states only.
