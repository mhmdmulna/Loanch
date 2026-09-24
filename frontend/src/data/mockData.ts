/**
 * Mock & Demonstration Data for Loanch Frontend
 * 
 * DISCLAIMER:
 * This data is purely for demonstration and UI testing while smart contracts
 * are being deployed to BOT Chain. It is isolated here and NEVER presented
 * as live on-chain data. Real transactions, hashes, and contract state will
 * replace this layer upon deployment.
 */

import type { ExtendedLoan, PoolTransparencyData, ReputationProfile } from "../types"

// Phase 8 Demo Loans
export const DEMO_LOANS: ExtendedLoan[] = [
  {
    id: "LOAN-001",
    borrowerAddress: "0x71C...89A2",
    principal: "10,000.00",
    totalRepayment: "10,800.00",
    amountPaid: "2,700.00",
    remainingDebt: "8,100.00",
    dueDate: "2024-06-15",
    status: "active",
    interestRate: 12,
    stakedAmount: "500.00",
    stakeStatus: "locked",
    durationMonths: 6,
    currentStage: "repayment",
    stageTimestamps: {
      requested: "2024-01-15 10:24 UTC",
      approved: "2024-01-15 10:25 UTC",
      stakeLocked: "2024-01-15 10:26 UTC",
      disbursed: "2024-01-15 10:28 UTC",
      repaymentStarted: "2024-02-10 14:15 UTC",
    },
    repayments: [
      {
        id: "REP-001-1",
        loanId: "LOAN-001",
        date: "2024-02-10",
        amount: "1,350.00",
        principalPortion: "1,250.00",
        marginPortion: "100.00",
        status: "confirmed",
        note: "Installment 1 of 6 - On time",
      },
      {
        id: "REP-001-2",
        loanId: "LOAN-001",
        date: "2024-03-10",
        amount: "1,350.00",
        principalPortion: "1,250.00",
        marginPortion: "100.00",
        status: "confirmed",
        note: "Installment 2 of 6 - On time",
      },
    ],
  },
  {
    id: "LOAN-000",
    borrowerAddress: "0x71C...89A2",
    principal: "5,000.00",
    totalRepayment: "5,300.00",
    amountPaid: "5,300.00",
    remainingDebt: "0.00",
    dueDate: "2023-12-01",
    status: "completed",
    interestRate: 12,
    stakedAmount: "250.00",
    stakeStatus: "unlocked",
    durationMonths: 4,
    currentStage: "completed",
    stageTimestamps: {
      requested: "2023-08-01 09:10 UTC",
      approved: "2023-08-01 09:12 UTC",
      stakeLocked: "2023-08-01 09:14 UTC",
      disbursed: "2023-08-01 09:15 UTC",
      repaymentStarted: "2023-09-01 11:00 UTC",
      completed: "2023-12-01 16:30 UTC",
    },
    repayments: [
      {
        id: "REP-000-1",
        loanId: "LOAN-000",
        date: "2023-09-01",
        amount: "1,325.00",
        principalPortion: "1,250.00",
        marginPortion: "75.00",
        status: "confirmed",
        note: "Installment 1 of 4 - On time",
      },
      {
        id: "REP-000-2",
        loanId: "LOAN-000",
        date: "2023-10-01",
        amount: "1,325.00",
        principalPortion: "1,250.00",
        marginPortion: "75.00",
        status: "confirmed",
        note: "Installment 2 of 4 - On time",
      },
      {
        id: "REP-000-3",
        loanId: "LOAN-000",
        date: "2023-11-01",
        amount: "1,325.00",
        principalPortion: "1,250.00",
        marginPortion: "75.00",
        status: "confirmed",
        note: "Installment 3 of 4 - On time",
      },
      {
        id: "REP-000-4",
        loanId: "LOAN-000",
        date: "2023-12-01",
        amount: "1,325.00",
        principalPortion: "1,250.00",
        marginPortion: "75.00",
        status: "confirmed",
        note: "Final Installment - Loan fully settled, stake unlocked",
      },
    ],
  },
]

// Phase 9 Demo Pool Transparency
export const DEMO_POOL_TRANSPARENCY: PoolTransparencyData = {
  totalDeposits: "2,450,000.00",
  activeLoans: "1,960,000.00", // 80% active lending
  availableLiquidity: "490,000.00", // 20% available
  liquidityReserve: "490,000.00", // 20% mandatory liquidity reserve
  lossReserve: "24,500.00", // 5% allocation from cumulative borrower margin
  utilizationRate: 80.0,
  maxLendingRatio: 80.0,
  reserveRatio: 20.0,
  totalSavers: 1247,
  activeBorrowers: 156,
  defaultRate: 0.0,
  currentCapacity: "0.00", // at 80% limit, new loans need repayment or more deposits
}

// Phase 10 Demo Reputation Profile
export const DEMO_REPUTATION: ReputationProfile = {
  address: "0x71C...89A2",
  isIdentityVerified: true,
  verificationDate: "2023-07-20",
  tierName: "Established Borrower",
  tierLevel: 2,
  completedLoansCount: 1,
  onTimePaymentsCount: 6,
  latePaymentsCount: 0,
  currentObligations: "8,100.00",
  totalRepaid: "8,000.00", // 5,300 + 2,700
  collateralDiscountPercent: 50, // 5% stake instead of 10% standard
  maxBorrowLimit: "100,000.00",
  scoreLabel: "Exemplary Track Record",
}

// Phase 10 Reputation History Milestones
export interface ReputationMilestone {
  id: string
  date: string
  type: "verification" | "loan_disbursed" | "payment" | "loan_completed" | "tier_upgrade"
  title: string
  description: string
  impact: string
}

export const DEMO_REPUTATION_MILESTONES: ReputationMilestone[] = [
  {
    id: "MS-001",
    date: "2023-07-20",
    type: "verification",
    title: "Cryptographic Identity Verified",
    description: "KYC credentials verified off-chain; verification state anchored on-chain.",
    impact: "Borrowing eligibility unlocked",
  },
  {
    id: "MS-002",
    date: "2023-08-01",
    type: "loan_disbursed",
    title: "First Loan Disbursed (LOAN-000)",
    description: "5,000 BOT principal disbursed with 250 BOT locked stake (5%).",
    impact: "Active loan obligation initiated",
  },
  {
    id: "MS-003",
    date: "2023-09-01 to 2023-12-01",
    type: "payment",
    title: "4 Consecutive On-Time Payments",
    description: "All scheduled repayments executed on or before due date without default.",
    impact: "+4 on-time records added to financial history",
  },
  {
    id: "MS-004",
    date: "2023-12-01",
    type: "loan_completed",
    title: "LOAN-000 Fully Paid Off",
    description: "Smart contract verified zero remaining balance. 250 BOT stake automatically unlocked.",
    impact: "Upgraded to Tier 2: 100K BOT limit & 5% collateral requirement",
  },
  {
    id: "MS-005",
    date: "2024-01-15",
    type: "loan_disbursed",
    title: "Second Loan Disbursed (LOAN-001)",
    description: "10,000 BOT loan approved under Tier 2 terms with 500 BOT stake locked.",
    impact: "Tier 2 standing verified by smart contract",
  },
  {
    id: "MS-006",
    date: "2024-03-10",
    type: "payment",
    title: "Installment #2 Settled On-Time",
    description: "1,350 BOT paid, reducing debt to 8,100 BOT.",
    impact: "Reputation score maintained at 100% on-time",
  },
]

// Phase 11 BOT Chain Network & Verification Info
export const BOT_CHAIN_INFO = {
  testnetChainId: 968,
  mainnetChainId: 677,
  tokenSymbol: "BOT",
  tokenDecimals: 18,
  defaultRpcUrl: "https://rpc.testnet.botchain.network", // example testnet RPC
  explorerBaseUrl: "https://explorer.testnet.botchain.network", // example testnet explorer
}
