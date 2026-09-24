import { useState } from "react"
import { Card, CardContent, CardHeader } from "../components/Card"
import { Button } from "../components/Button"
import { Input } from "../components/Input"
import { Badge } from "../components/Badge"
import { NetworkGuard } from "../components/WalletComponents"
import { TransactionStatus } from "../components/TransactionStatus"
import { useWallet } from "../hooks/useWallet"
import type { TransactionState } from "../types"

// Mock pool data - clearly labeled as demo
const mockPoolData = {
  totalDeposits: "2,450,000",
  currentAPR: 8.5,
  totalSavers: 1247,
  availableLiquidity: "490,000"
}

type Page = "landing" | "dashboard" | "saver" | "borrower"

interface SaverPageProps {
  onNavigate: (page: Page) => void
}

export function SaverPage({ onNavigate }: SaverPageProps) {
  const [wallet] = useWallet()
  const [depositAmount, setDepositAmount] = useState("")
  const [showReview, setShowReview] = useState(false)
  const [txState, setTxState] = useState<TransactionState>("ready")
  const [showSuccess, setShowSuccess] = useState(false)

  // Mock current position - clearly labeled as demo
  const mockPosition = {
    depositAmount: "5,000.00",
    currentBalance: "5,127.50",
    accumulatedReturn: "127.50",
    withdrawableAmount: "5,127.50"
  }

  const hasPosition = true // Demo: user has existing position

  const handleDepositAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setDepositAmount(value)
    }
  }

  const handleReviewDeposit = () => {
    if (parseFloat(depositAmount) > 0) {
      setShowReview(true)
    }
  }

  const handleConfirmDeposit = async () => {
    // Simulate transaction flow
    setTxState("preparing")
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setTxState("waiting-wallet")
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setTxState("submitted")
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setTxState("confirming")
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setTxState("confirmed")
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setShowSuccess(true)
    setShowReview(false)
    setDepositAmount("")
    setTxState("ready")
  }

  const handleBackToForm = () => {
    setShowReview(false)
    setTxState("ready")
  }

  const walletBalance = wallet.balance ? parseFloat(wallet.balance) : 0
  const depositAmountNum = parseFloat(depositAmount) || 0
  const hasInsufficientBalance = depositAmountNum > walletBalance
  const expectedNewBalance = hasPosition 
    ? parseFloat(mockPosition.currentBalance.replace(/,/g, "")) + depositAmountNum
    : depositAmountNum

  return (
    <NetworkGuard>
      <div className="min-h-screen bg-slate-950">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Button variant="secondary" size="small" onClick={() => onNavigate("dashboard")} className="mb-4">
              ? Back to Dashboard
            </Button>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-slate-100">Save & Earn</h1>
                <p className="text-slate-400 mt-1">Deposit funds and earn returns from loan activity</p>
              </div>
              <div className="text-xs text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full">
                Demo Mode
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Success State */}
          {showSuccess && (
            <Card className="mb-8 border-emerald-500">
              <CardContent>
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-100 mb-2">Deposit Confirmed!</h3>
                  <p className="text-slate-400 mb-4">
                    Your deposit has been added to the pool and will start earning returns from loan activity.
                  </p>
                  <Button onClick={() => setShowSuccess(false)}>
                    View Updated Position
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Saver Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">{mockPoolData.currentAPR}%</div>
                  <div className="text-sm text-slate-400 mt-1">Current APR</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-100">{mockPoolData.totalDeposits}</div>
                  <div className="text-sm text-slate-400 mt-1">Total Pool (BOT)</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{mockPoolData.totalSavers}</div>
                  <div className="text-sm text-slate-400 mt-1">Active Savers</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Position */}
          {hasPosition && !showSuccess && (
            <Card className="mb-8">
              <CardHeader>Your Current Position</CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-3xl font-bold text-emerald-400">
                        {mockPosition.currentBalance} BOT
                      </div>
                      <div className="text-sm text-slate-400">Current Balance</div>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                    <div>
                      <div className="text-sm text-slate-400">Total Deposited</div>
                      <div className="text-lg font-semibold text-slate-100">
                        {mockPosition.depositAmount} BOT
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">Accumulated Return</div>
                      <div className="text-lg font-semibold text-emerald-400">
                        +{mockPosition.accumulatedReturn} BOT
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-400">Withdrawable Amount</span>
                      <span className="text-sm font-medium text-slate-100">
                        {mockPosition.withdrawableAmount} BOT
                      </span>
                    </div>
                    <p className="text-xs text-amber-400 mb-3">
                      Withdrawals are subject to pool liquidity availability
                    </p>
                    <Button fullWidth variant="secondary" size="small">
                      Request Withdrawal
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Deposit Form or Review */}
          {!showReview ? (
            <Card>
              <CardHeader>Make a Deposit</CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Wallet Balance Display */}
                  <div className="bg-slate-900 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Available in Wallet</span>
                      <span className="text-lg font-semibold text-slate-100">
                        {wallet.balance ? parseFloat(wallet.balance).toFixed(4) : "0.0000"} BOT
                      </span>
                    </div>
                  </div>

                  {/* Deposit Amount Input */}
                  <div>
                    <Input
                      label="Deposit Amount"
                      type="text"
                      value={depositAmount}
                      onChange={handleDepositAmountChange}
                      placeholder="0.00"
                      error={hasInsufficientBalance ? "Insufficient balance in wallet" : undefined}
                      required
                    />
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="small"
                        variant="secondary"
                        onClick={() => setDepositAmount((walletBalance * 0.25).toFixed(4))}
                      >
                        25%
                      </Button>
                      <Button
                        size="small"
                        variant="secondary"
                        onClick={() => setDepositAmount((walletBalance * 0.5).toFixed(4))}
                      >
                        50%
                      </Button>
                      <Button
                        size="small"
                        variant="secondary"
                        onClick={() => setDepositAmount((walletBalance * 0.75).toFixed(4))}
                      >
                        75%
                      </Button>
                      <Button
                        size="small"
                        variant="secondary"
                        onClick={() => setDepositAmount(walletBalance.toFixed(4))}
                      >
                        MAX
                      </Button>
                    </div>
                  </div>

                  {/* Expected Pool Position Preview */}
                  {depositAmountNum > 0 && !hasInsufficientBalance && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-emerald-400 mb-3">
                        Expected Pool Position
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">New Balance</span>
                          <span className="text-slate-100 font-medium">
                            {expectedNewBalance.toLocaleString()} BOT
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Expected APR</span>
                          <span className="text-emerald-400 font-medium">
                            ~{mockPoolData.currentAPR}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Estimated Annual Return</span>
                          <span className="text-emerald-400 font-medium">
                            ~{(expectedNewBalance * mockPoolData.currentAPR / 100).toFixed(2)} BOT
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Return Disclaimer */}
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                    <div className="flex gap-3">
                      <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div className="text-sm text-amber-200">
                        <strong className="font-semibold">Returns are not guaranteed.</strong> Returns are generated from borrower loan repayments and distributed according to smart contract rules. Actual returns may vary based on loan activity and pool performance.
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    fullWidth
                    size="large"
                    onClick={handleReviewDeposit}
                    disabled={depositAmountNum <= 0 || hasInsufficientBalance}
                  >
                    Review Deposit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>Review Your Deposit</CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Transaction State */}
                  {txState !== "ready" && (
                    <TransactionStatus
                      state={txState}
                      message={
                        txState === "preparing" ? "Preparing your deposit transaction..." :
                        txState === "waiting-wallet" ? "Please confirm the transaction in your wallet" :
                        txState === "submitted" ? "Transaction submitted to BOT Chain" :
                        txState === "confirming" ? "Waiting for blockchain confirmation..." :
                        "Deposit confirmed on BOT Chain!"
                      }
                    />
                  )}

                  {txState === "ready" && (
                    <>
                      {/* Deposit Summary */}
                      <div className="bg-slate-900 rounded-lg p-6 space-y-4">
                        <div className="text-center pb-4 border-b border-slate-700">
                          <div className="text-sm text-slate-400 mb-1">Deposit Amount</div>
                          <div className="text-4xl font-bold text-emerald-400">
                            {depositAmount} BOT
                          </div>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">From Wallet</span>
                            <span className="text-slate-100 font-medium">
                              {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">To Pool</span>
                            <span className="text-slate-100 font-medium">Loanch Pool</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Network</span>
                            <span className="text-slate-100 font-medium">BOT Chain</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Expected APR</span>
                            <span className="text-emerald-400 font-medium">~{mockPoolData.currentAPR}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Important Notes */}
                      <div className="space-y-3">
                        <div className="flex gap-2 text-sm text-slate-300">
                          <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Your funds will be added to the loan pool and become available for lending</span>
                        </div>
                        <div className="flex gap-2 text-sm text-slate-300">
                          <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Returns accumulate from borrower repayments and are distributed automatically</span>
                        </div>
                        <div className="flex gap-2 text-sm text-slate-300">
                          <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Withdrawals are processed based on available pool liquidity</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button
                          fullWidth
                          variant="secondary"
                          onClick={handleBackToForm}
                        >
                          Back
                        </Button>
                        <Button
                          fullWidth
                          onClick={handleConfirmDeposit}
                        >
                          Confirm Deposit
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </NetworkGuard>
  )
}
