# Loanch Frontend

React, TypeScript, Vite, Tailwind CSS, and ethers frontend for Loanch.

```bash
npm install
npm run dev
npm run lint
npm run build
```

Copy `.env.example` to `.env` and provide the RPC URL, chain ID, and deployed `LoanchPool` address. The app opens at `/app` from the landing page. MetaMask connection and a matching network are required before the Save and Borrow destinations appear. The configured RPC and MetaMask must point to the same deployed pool.

The app reads the pool asset, Saver position, borrower profile, active loan, and pool stats from the deployed contract. Deposit, withdrawal, stake, unstake, loan request, repayment, and Saver return claim use MetaMask. Identity/KYC is disabled as a financial gate for the current demo. Deposit, stake, and repayment ask for an exact ERC-20 allowance when needed. The UI treats a transaction as confirmed only after its receipt succeeds. Activity shows up to 20 pool transactions sent by the connected wallet, scanning at most the last 5,000 blocks and 200 pool logs. Loan detail and transaction detail read the configured RPC. Balances and transaction hashes are never fabricated.

The bundled ABI comes from `contracts/abi/LoanchPool.json`. Run `npm run abi:export` from the repository root after contract ABI changes to refresh both ABI copies. The smart contract must be deployed separately. On a local Hardhat chain, the RPC process and contract deployment must stay running; restarting the chain invalidates the configured address.
