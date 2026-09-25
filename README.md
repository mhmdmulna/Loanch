# Loanch

> **Loan + Chain + Launch**
>
> Save. Borrow. Build trust on-chain.

Loanch is a blockchain-based lending platform built on **BOT Chain**. It brings together savers and borrowers through a shared loan pool managed entirely by smart contracts — making deposits, loans, repayments, staking, and profit distribution transparent, programmable, and verifiable.

---

## What Does Loanch Do?

Traditional lending relies on centralized institutions to manage deposits, approve loans, track repayments, and distribute returns. Users have to trust that the institution is handling their money correctly — but they can't actually verify it.

Loanch replaces that trust with code. The core financial rules are written into a Solidity smart contract deployed on BOT Chain, so anyone can audit and verify exactly how the system works.

Here's the basic flow:

```
Savers deposit funds → Loan Pool (smart contract)
                              ↓
            Borrowers request loans from the pool
                              ↓
            Borrowers repay loans with a 10% margin
                              ↓
         Repayments are split: 80% Savers, 15% Platform, 5% Loss Reserve
```

### Two User Roles

A single wallet can act as both a **Saver** and a **Borrower**.

- **Savers** deposit BOT into the loan pool. Their funds are used to issue loans. In return, they earn a share of the margin (interest) paid by borrowers, distributed proportionally based on their share of the pool.

- **Borrowers** lock a stake (5% of the loan amount) as collateral, then request a loan. If they meet the eligibility requirements (verified identity, sufficient risk score, enough liquidity in the pool), the smart contract approves and disburses the loan in a single atomic transaction. Borrowers repay the principal plus a 10% margin. Once fully repaid, their stake is unlocked and returned.

### Key Mechanisms

| Mechanism | Description |
|---|---|
| **Loan Pool** | Aggregated deposits from all savers, used to fund borrower loans. |
| **Liquidity Reserve** | 20% of total deposits is set aside as a reserve to ensure savers can withdraw. |
| **Staking** | Borrowers lock 5% of their loan amount as skin-in-the-game collateral. |
| **Profit Distribution** | Loan margins are split: 80% to savers, 15% to the platform, 5% to a loss reserve. |
| **Reputation** | Borrowers build on-chain reputation through their repayment history. Good payments increase reputation; defaults reduce it by 20 points. |
| **Default Handling** | If a loan isn't repaid within 7 days past the due date, anyone can mark it as defaulted. The borrower's stake is slashed, the loss reserve covers remaining shortfall, and any unrecoverable loss is distributed proportionally among savers. |

---

## How It Works (Step by Step)

### 1. Connect Your Wallet

Open the Loanch app and connect your MetaMask wallet. The app will detect your wallet address and prompt you to switch to the BOT Chain network if you're not already on it.

### 2. Saving (Deposit Funds)

Navigate to the **Save** dashboard and click **Deposit Funds**. Enter the amount of BOT you want to deposit and confirm the transaction. Your funds enter the loan pool and you start earning returns when borrowers repay their loans.

You can view your deposit position, accumulated returns, and withdraw your funds at any time (as long as there is sufficient liquidity in the pool).

### 3. Borrowing (Request a Loan)

Navigate to the **Borrow** dashboard. Before requesting a loan, you need to:

1. **Lock a Stake** — deposit collateral equal to 5% of the amount you want to borrow.
2. **Request a Loan** — specify the loan amount and duration (1 to 365 days).

The smart contract checks your identity verification status, risk score, stake balance, and pool liquidity. If everything checks out, the loan is approved and the funds are sent to your wallet immediately.

### 4. Repaying a Loan

Go to the **Borrow** dashboard and click **Repay a Loan**. You can make partial or full repayments at any time. The total you owe is the principal plus a 10% margin. Once you've fully repaid, your stake is unlocked and your on-chain reputation improves.

### 5. Withdrawing Funds

Savers can withdraw their deposited principal and claim earned returns from the **Save** dashboard. Withdrawals succeed immediately if there is enough liquidity; otherwise, the transaction reverts and you can try again later when more funds become available.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Smart Contract** | Solidity ^0.8.28, OpenZeppelin (Ownable, ReentrancyGuard) |
| **Development & Testing** | Hardhat 3, Mocha, Chai |
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS 4 |
| **Web3 Integration** | ethers.js 6, MetaMask |
| **UI Components** | shadcn/ui, Radix UI, Lucide React, Framer Motion |
| **Blockchain** | BOT Chain Mainnet (Chain ID: 677) |

---

## Project Structure

```
Loanch/
├── contracts/
│   └── LoanchPool.sol          # Core smart contract (all financial rules)
├── test/
│   ├── deposit.test.ts         # Deposit flow tests
│   ├── withdraw.test.ts        # Withdrawal tests
│   ├── loan.test.ts            # Loan creation tests
│   ├── repayment.test.ts       # Repayment flow tests
│   ├── stake.test.ts           # Staking tests
│   ├── default.test.ts         # Default & loss waterfall tests
│   ├── security.test.ts        # Security invariant tests
│   ├── system.test.ts          # End-to-end system tests
│   └── config.test.ts          # Configuration / admin tests
├── scripts/
│   ├── deploy-testnet.ts       # BOT Chain testnet deployment
│   ├── smoke-testnet.ts        # Post-deployment smoke tests
│   ├── local-demo.ts           # Local Hardhat node demo
│   └── seed-local-demo-customer.mjs
├── frontend/
│   └── src/
│       ├── app/                # Main application (AppExperience, dashboards)
│       ├── components/         # Reusable UI components
│       └── index.css           # Landing page styles
├── hardhat.config.ts           # Hardhat configuration
├── Loanch.md                   # Product specification & business rules
├── PRD.md                      # Technical product requirements
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** (v20 or later)
- **MetaMask** browser extension
- **BOT Chain testnet BOT** for transactions

### Installation

```bash
# Clone the repository
git clone https://github.com/mhmdmulna/Loanch.git
cd Loanch

# Install root dependencies (smart contracts)
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Environment Setup

Copy the example environment files and fill in your values:

```bash
# Root .env (for smart contract deployment)
cp .env.example .env
```

Root `.env` variables:

```env
BOT_CHAIN_RPC_URL=https://rpc.bohr.life
BOT_CHAIN_CHAIN_ID=968
BOT_CHAIN_POOL_ADDRESS=<deployed-contract-address>
DEPLOYER_PRIVATE_KEY=<your-private-key>
```

Frontend `.env` (in `frontend/`):

```env
VITE_BOT_CHAIN_RPC_URL=https://rpc.botchain.ai
VITE_BOT_CHAIN_CHAIN_ID=677
VITE_BOT_CHAIN_NAME=BOT Chain Mainnet
VITE_BOT_CHAIN_EXPLORER_URL=https://scan.botchain.ai
VITE_LOANCH_CONTRACT_ADDRESS=0xe42f0fd2623B5019F414865937f3c9bECb9342AE
```

Set the same `VITE_` variables for the Vercel Production environment, then redeploy. Vite embeds these public values at build time. The frontend also includes the verified BOT Chain Mainnet values as safe public defaults so wallet connection does not silently break when a deployment is missing build-time variables.

### Compile & Test the Smart Contract

```bash
# Compile
npm run compile

# Run the full test suite
npm run test
```

### Run the Frontend Locally

```bash
npm run dev
```

This starts the Vite dev server. Open the URL shown in your terminal (usually `http://localhost:5173`).

### Deploy to BOT Chain Testnet

```bash
npm run deploy:testnet
```

After deployment, the script prints the contract address. Update your `.env` files with the new address.

### Run Post-Deployment Smoke Tests

```bash
npm run smoke:testnet
```

---

## Smart Contract Overview

The entire lending system is governed by a single contract: **`LoanchPool.sol`**.

### Core Parameters

| Parameter | Value | Description |
|---|---|---|
| Reserve Ratio | 20% | Minimum portion of deposits held as liquidity reserve |
| Loan Margin | 10% | Fixed margin (interest) charged on every loan |
| Stake Requirement | 5% | Borrower must lock 5% of loan amount as collateral |
| Profit Split | 80 / 15 / 5 | Saver / Platform / Loss Reserve |
| Max Loan Ratio | 50% | Borrower can borrow up to 50% of the pool |
| Min Duration | 1 day | Shortest allowed loan duration |
| Max Duration | 365 days | Longest allowed loan duration |
| Grace Period | 7 days | Time after due date before loan can be marked as defaulted |
| Reputation Penalty | −20 points | Reputation deduction on default |
| Initial Reputation | 50 | Starting reputation score for new borrowers |

### Key Functions

```solidity
// Saver functions
deposit()                   // Deposit BOT into the loan pool
withdraw(amount)            // Withdraw deposited principal
claimReturn()               // Claim earned returns from loan margins

// Borrower functions
stake()                     // Lock collateral before requesting a loan
requestLoan(amount, days)   // Request a loan (auto-approved if eligible)
repayLoan(loanId)           // Make a repayment toward an active loan

// Public
markDefault(loanId)         // Mark an overdue loan as defaulted (permissionless)

// Admin (owner)
setIdentityVerification(user, bool)
setBorrowerRiskScore(user, score)
setDistributionBps(saver, platform, reserve)
setSaverWeight(user, weightBps)
```

### Security

- **ReentrancyGuard** (OpenZeppelin) prevents reentrancy attacks on all state-changing functions.
- **Ownable** (OpenZeppelin) restricts admin functions to the contract owner.
- **Invariant tests** verify that pool accounting stays consistent across all operations.
- **Comprehensive test suite** covers deposits, withdrawals, loans, repayments, defaults, staking, configuration changes, and security edge cases.

---

## Deployment

### BOT Chain Testnet

| Item | Value |
|---|---|
| **Network** | BOT Chain Testnet |
| **Chain ID** | 968 |
| **RPC URL** | `https://rpc.bohr.life` |
| **Contract Address** | `0xd30c9b61AbD2baED7d24e76c57fC7e56E7a1cfe3` |
| **Explorer** | [https://scan.bohr.life/address/0xd30c9b61AbD2baED7d24e76c57fC7e56E7a1cfe3](https://scan.bohr.life/address/0xd30c9b61AbD2baED7d24e76c57fC7e56E7a1cfe3) |

### BOT Chain Mainnet

| Item | Value |
|---|---|
| **Network** | BOT Chain Mainnet |
| **Chain ID** | 677 |
| **RPC URL** | `https://rpc.botchain.ai` |
| **Contract Address** | `0xe42f0fd2623B5019F414865937f3c9bECb9342AE` |
| **Explorer** | [https://scan.botchain.ai/address/0xe42f0fd2623B5019F414865937f3c9bECb9342AE](https://scan.botchain.ai/address/0xe42f0fd2623B5019F414865937f3c9bECb9342AE) |

---

## License

This project was built for the BOT Chain hackathon.
