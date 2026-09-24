/**
 * Global type definitions for Loanch frontend
 */

// Transaction state types
export type TransactionState =
  | 'ready'
  | 'preparing'
  | 'waiting-wallet'
  | 'submitted'
  | 'confirming'
  | 'confirmed'
  | 'failed'
  | 'rejected'

export interface TransactionStatus {
  state: TransactionState
  message: string
  txHash?: string
  error?: string
}

// Component prop types
export type ButtonVariant = 'primary' | 'secondary' | 'danger'
export type ButtonSize = 'small' | 'medium' | 'large'
export type BadgeVariant = 'success' | 'warning' | 'error' | 'neutral' | 'pending'
export type InputType = 'text' | 'email' | 'number' | 'password' | 'tel'

// UI State
export interface LoadingState {
  isLoading: boolean
  message?: string
}

export interface ErrorState {
  hasError: boolean
  message?: string
  code?: string
}

// Wallet types
export interface WalletState {
  isConnected: boolean
  address?: string
  chainId?: number
  balance?: string
}

// Pool types (placeholder for backend integration)
export interface PoolStats {
  totalDeposits: string
  activeLoan: string
  availableLiquidity: string
  reserveFund: string
  lendingCapacity: string
  utilizationRate: number
}

// Position types
export interface SaverPosition {
  id: string
  depositAmount: string
  depositDate: string
  currentBalance: string
  accumulatedReturn: string
  withdrawableAmount: string
}

export interface LoanPosition {
  id: string
  principal: string
  totalRepayment: string
  amountPaid: string
  remainingDebt: string
  dueDate: string
  status: 'active' | 'completed' | 'defaulted'
  interestRate: number
  stakedAmount: string
}

// Phase 8: Loan Management Types
export type LoanLifecycleStage =
  | 'requested'
  | 'approved'
  | 'stake-locked'
  | 'disbursed'
  | 'repayment'
  | 'completed'

export interface RepaymentRecord {
  id: string
  loanId: string
  date: string
  amount: string
  principalPortion: string
  marginPortion: string
  status: 'confirmed' | 'pending' | 'late'
  txHash?: string
  note?: string
}

export interface ExtendedLoan extends LoanPosition {
  borrowerAddress: string
  durationMonths: number
  stakeStatus: 'locked' | 'unlocked' | 'slashed'
  currentStage: LoanLifecycleStage
  stageTimestamps: {
    requested: string
    approved?: string
    stakeLocked?: string
    disbursed?: string
    repaymentStarted?: string
    completed?: string
  }
  repayments: RepaymentRecord[]
}

// Phase 9: Pool Transparency Types
export interface PoolTransparencyData {
  totalDeposits: string
  activeLoans: string
  availableLiquidity: string
  liquidityReserve: string
  lossReserve: string
  utilizationRate: number
  maxLendingRatio: number
  reserveRatio: number
  totalSavers: number
  activeBorrowers: number
  defaultRate: number
  currentCapacity: string
}

// Phase 10: Financial Reputation Types
export interface ReputationProfile {
  address: string
  isIdentityVerified: boolean
  verificationDate: string
  tierName: string
  tierLevel: number
  completedLoansCount: number
  onTimePaymentsCount: number
  latePaymentsCount: number
  currentObligations: string
  totalRepaid: string
  collateralDiscountPercent: number
  maxBorrowLimit: string
  scoreLabel: string
}

// Phase 11: Blockchain Transparency Types
export interface BlockchainConfigState {
  networkName: string
  chainId: number
  expectedChainId: number
  isCorrectNetwork: boolean
  rpcUrl?: string
  contractAddress?: string
  isContractConfigured: boolean
  explorerUrl?: string
  isExplorerAvailable: boolean
}

// App Page Navigation Type
export type Page =
  | 'landing'
  | 'dashboard'
  | 'saver'
  | 'borrower'
  | 'loans'
  | 'pool'
  | 'reputation'
  | 'transparency'

