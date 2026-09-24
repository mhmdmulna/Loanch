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
