# Loanch

Loanch is a programmable lending platform targeting BOT Chain. This repository currently contains project initialization only; Loanch features and financial smart-contract logic are intentionally not implemented yet.

## Prerequisites

- Node.js 20.19+ or 22.12+
- npm
- Git

## Install

```bash
npm install
npm install --prefix frontend
```

Copy `.env.example` to `.env` and `frontend/.env.example` to `frontend/.env`, then provide the required BOT Chain and deployment values when they become available. Never commit private keys.

## Commands

```bash
# Frontend development server
npm run frontend:dev

# Frontend checks
npm run frontend:lint
npm run frontend:build

# Solidity compile and tests
npm run compile
npm test
```

## Current scope

- React, TypeScript, Vite, Tailwind CSS, and ethers frontend foundation
- Solidity and Hardhat development environment
- OpenZeppelin Contracts dependency
- Environment and Git configuration
- Placeholder source directories matching the PRD

Feature implementation, deployment scripts, contract ABIs, BOT Chain deployment values, and business logic belong to later phases.
