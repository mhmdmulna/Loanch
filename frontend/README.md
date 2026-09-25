# Loanch Frontend

React, TypeScript, Vite, Tailwind CSS, and ethers frontend for Loanch.

```bash
npm install
npm run dev
npm run lint
npm run build
```

Copy `.env.example` to `.env` and provide the RPC URL, chain ID, and deployed `LoanchPool` address. The checked-in defaults target BOT Chain Mainnet (chain ID 677). The app opens at `/app` from the landing page. MetaMask connection and a matching network are required before the Save and Borrow destinations appear. The configured RPC and MetaMask must point to the same deployed pool.

For Vercel, configure the same `VITE_` variables for Production and redeploy because Vite embeds them during the build. The application has public mainnet fallbacks for RPC, chain ID, explorer, and the deployed pool address, and discovers MetaMask through both EIP-6963 and legacy `window.ethereum` injection. If BOT Chain is missing from MetaMask, the switch action offers to add the network automatically.

The app reads the native BOT balance, Saver position, borrower profile, active loan, and pool stats from the deployed contract. Deposit, withdrawal, stake, unstake, loan request, repayment, and Saver return claim use MetaMask. Identity/KYC is disabled as a financial gate for the current demo. Deposit, stake, and repayment send native BOT directly, so no ERC-20 approval is needed. The UI treats a transaction as confirmed only after its receipt succeeds. Activity shows up to 20 pool transactions sent by the connected wallet, scanning at most the last 5,000 blocks and 200 pool logs. Loan detail and transaction detail read the configured RPC. Balances and transaction hashes are never fabricated.

The bundled ABI comes from `contracts/abi/LoanchPool.json`. Run `npm run abi:export` from the repository root after contract ABI changes to refresh both ABI copies. The smart contract must be deployed separately. On a local Hardhat chain, the RPC process and contract deployment must stay running; restarting the chain invalidates the configured address.
