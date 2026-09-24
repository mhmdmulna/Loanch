# Loanch Frontend

React, TypeScript, Vite, Tailwind CSS, and ethers frontend for Loanch.

```bash
npm install
npm run dev
npm run lint
npm run build
```

Copy `.env.example` to `.env` and provide the BOT Chain chain ID to enable the wallet network check. The app opens at `/app` from the landing page. MetaMask connection and a matching network are required before the Save and Borrow destinations appear.

The app includes `/app/save`, deposit and withdrawal boundaries, `/app/borrow`, request, loan detail and repayment boundaries, `/app/activity`, transaction detail, `/app/transparency`, and `/app/settings`. These are frontend surfaces only. Contract reads, writes, eligibility, liquidity, positions, activity, and pool metrics are not connected; the UI shows unavailable states and cannot submit a financial transaction. No demo balances or transaction hashes are generated.
