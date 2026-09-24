# Frontend Audit

## Objective

Phase 0 audited the existing repository before frontend implementation. The goal was to identify the frontend stack, boundaries, reusable pieces, and files that are safe or unsafe to modify.

## Product Context Read

- `Loanch.md` was read as the primary source of truth for product scope and business rules.
- `PRD.md` was read as the technical implementation reference.
- The current AGENTS instructions require frontend-only work for this task and forbid backend, database, Solidity, and deployment changes.

## Existing Repository Architecture

The repository is split into:

- Root Hardhat/project configuration.
- `contracts/` for Solidity smart contracts.
- `test/` for smart contract tests.
- `scripts/` for deployment or project scripts.
- `frontend/` for the browser application.

No backend application directory, API routes, Prisma schema, database migrations, or server-side app implementation were found in the current file tree.

## Frontend Stack

The frontend is a Vite app using:

- React `19.2.8`
- React DOM `19.2.8`
- TypeScript `~6.0.2`
- Vite `8.3.0`
- Tailwind CSS `4.3.3`
- `@tailwindcss/vite`
- `ethers` `6.17.0`
- `oxlint`

Context7 documentation confirmed:

- Vite exposes only `VITE_*` variables through `import.meta.env`, and exposed values are strings.
- Tailwind CSS v4 is correctly used with the first-party Vite plugin plus `@import "tailwindcss";` in CSS.

## Frontend Entry Points

- `frontend/src/main.tsx` mounts React into `#root`.
- `frontend/src/App.tsx` currently contains only a minimal initialized placeholder screen.
- `frontend/src/index.css` imports Tailwind and defines root font/rendering defaults.
- `frontend/index.html` is the Vite HTML entry.

## Current Routing

No routing library or route structure is currently implemented.

Implication:

- The next implementation phase can either keep a single-page section navigation or add a lightweight internal route/page model.
- Adding a routing dependency should be justified by actual page complexity, not preference.

## Current Components

No reusable component directory exists yet.

Current UI is entirely inside `frontend/src/App.tsx`.

Needed component groups for future phases:

- Layout and navigation.
- Cards, buttons, badges, inputs, tables, and tooltips.
- Wallet and network state.
- Pool stats and financial metrics.
- Saver forms and transaction states.
- Borrower eligibility, loan calculator, staking, and repayment states.
- Loan timeline and reputation history.

## Styling System

Tailwind CSS v4 is already configured:

- `frontend/vite.config.ts` uses `@tailwindcss/vite`.
- `frontend/src/index.css` imports Tailwind via `@import "tailwindcss";`.

The existing visual style is only a placeholder dark slate screen. There is no design token layer or component-level style standard yet.

## Wallet and Blockchain Integration

Existing files:

- `frontend/src/contracts/config.ts`
- `frontend/src/contracts/addresses.ts`

Current state:

- BOT Chain RPC URL and chain ID are read from Vite env.
- Loanch contract address is read from Vite env.
- `ethers` is installed but no wallet hooks, provider setup, contract ABI, or read/write layer currently exists.

Risks:

- Contract ABI is not present in the frontend.
- Contract address may be unset during UI development.
- Chain ID comes from env as a string and will need explicit parsing before network comparisons.

## Frontend / Backend Boundary

The frontend may own UI, client state, wallet state, contract calls, and browser-safe configuration.

The frontend must not touch:

- `contracts/`
- `test/`
- `scripts/`
- `hardhat.config.ts`
- root deployment or contract configuration
- backend/server/database files if they appear later
- backend-only env variables

## Files Allowed to Change

Safe frontend files:

- `frontend/src/**`
- `frontend/public/**`
- `frontend/index.html`
- `frontend/package.json` and lockfile only if a dependency is truly needed
- `frontend/vite.config.ts` only for frontend build configuration
- `frontend/.env.example` only for browser-safe `VITE_*` frontend variables
- frontend documentation files at the repository root, such as this audit and design documents

## Files Forbidden to Change

Forbidden for this frontend-only task:

- `contracts/**`
- `test/**`
- `scripts/**`
- `hardhat.config.ts`
- root package files unless explicitly needed for frontend scripts
- backend/database/auth/server files if added later
- Solidity ABI generation or deployment artifacts unless explicitly provided as frontend-consumable inputs

## Risks

- Scope is large enough that implementing all phases in one pass would raise regression risk.
- No ABI or deployed contract address means real blockchain integration cannot be completed yet.
- No current route structure means information architecture should be settled before adding views.
- The product must avoid looking like a speculative crypto dashboard; visual choices should stay closer to institutional fintech.
- Fake on-chain data must not be presented as production state.

## Recommended Next Step

Proceed to Phase 1 by documenting product UX architecture before building visual components.
