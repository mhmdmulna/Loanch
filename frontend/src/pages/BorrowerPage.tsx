import { useState } from "react"
import { Card, CardContent, CardHeader } from "../components/Card"
import { Button } from "../components/Button"
import { Input } from "../components/Input"
import { Badge, CheckIcon, ExclamationIcon, XIcon } from "../components/Badge"
import { NetworkGuard } from "../components/WalletComponents"
import { TransactionStatus } from "../components/TransactionStatus"
// import { useWallet } from "../hooks/useWallet"
import type { TransactionState } from "../types"

// Mock eligibility data - clearly labeled as demo
const mockEligibility = {
  identityVerified: true,
  riskRequirement: true,
  minimumStake: true,
  liquidityAvailable: true,
  loanLimitPassed: true
}

const mockPoolData = {
  availableLiquidity: "490,000",
  maxLoanAmount: "100,000",
  minStakePercentage: 5,
  interestRate: 12
}

type Page = "landing" | "dashboard" | "saver" | "borrower"

interface BorrowerPageProps {
  onNavigate: (page: Page) => void
}

export function BorrowerPage({ onNavigate }: BorrowerPageProps) {
  // const [wallet] = useWallet()
  const [loanAmount, setLoanAmount] = useState("")
  const [duration, setDuration] = useState("6")
  const [showReview, setShowReview] = useState(false)
  const [txState, setTxState] = useState<TransactionState>("ready")
  const [showSuccess, setShowSuccess] = useState(false)
  const [hasActiveLoan] = useState(false) // Demo: user has no active loan

  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setLoanAmount(value)
    }
  }

  const loanAmountNum = parseFloat(loanAmount) || 0
  const durationNum = parseInt(duration) || 6
  const totalRepayment = loanAmountNum * (1 + (mockPoolData.interestRate / 100) * (durationNum / 12))
  const requiredStake = loanAmountNum * (mockPoolData.minStakePercentage / 100)
  const monthlyPayment = totalRepayment / durationNum

  const handleReviewLoan = () => {
    if (loanAmountNum > 0 && durationNum > 0) {
      setShowReview(true)
    }
  }

  const handleConfirmRequest = async () => {
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
    setLoanAmount("")
    setDuration("6")
    setTxState("ready")
  }

  const handleBackToForm = () => {
    setShowReview(false)
    setTxState("ready")
  }

  const allEligibilityMet = Object.values(mockEligibility).every(v => v === true)

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
                <h1 className="text-3xl font-bold text-slate-100">Borrow Funds</h1>
                <p className="text-slate-400 mt-1">Request a loan from the Loanch pool</p>
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
                  <h3 className="text-2xl font-bold text-slate-100 mb-2">Loan Request Submitted!</h3>
                  <p className="text-slate-400 mb-4">
                    The smart contract has processed your loan request. Your funds will be disbursed shortly.
                  </p>
                  <Button onClick={() => setShowSuccess(false)}>
                    View Active Loan
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Loan Display */}
          {hasActiveLoan && !showSuccess && (
            <Card className="mb-8 border-blue-500">
              <CardHeader>Your Active Loan</CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-3xl font-bold text-blue-400">8,100.00 BOT</div>
                      <div className="text-sm text-slate-400">Remaining Debt</div>
                    </div>
                    <Badge variant="warning">LOAN-001</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                    <div>
                      <div className="text-sm text-slate-400">Principal</div>
                      <div className="text-lg font-semibold text-slate-100">10,000.00 BOT</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">Amount Paid</div>
                      <div className="text-lg font-semibold text-slate-100">2,700.00 BOT</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-slate-400">Due Date</div>
                      <div className="text-sm font-medium text-slate-100">2024-06-15</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">Staked</div>
                      <div className="text-sm font-medium text-amber-400">500.00 BOT</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-700">
                    <Button fullWidth>Make Payment</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Eligibility Checklist */}
          {!hasActiveLoan && !showReview && (
            <Card className="mb-8">
              <CardHeader>Eligibility Requirements</CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg">
                    {mockEligibility.identityVerified ? (
                      <Badge variant="success" icon={<CheckIcon />}>Verified</Badge>
                    ) : (
                      <Badge variant="error" icon={<XIcon />}>Not Verified</Badge>
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-100">Identity Verified</div>
                      <div className="text-xs text-slate-400">KYC process completed</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg">
                    {mockEligibility.riskRequirement ? (
                      <Badge variant="success" icon={<CheckIcon />}>Passed</Badge>
                    ) : (
                      <Badge variant="error" icon={<XIcon />}>Failed</Badge>
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-100">Risk Requirement</div>
                      <div className="text-xs text-slate-400">Credit assessment approved</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg">
                    {mockEligibility.minimumStake ? (
                      <Badge variant="success" icon={<CheckIcon />}>Available</Badge>
                    ) : (
                      <Badge variant="error" icon={<XIcon />}>Insufficient</Badge>
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-100">Minimum Stake</div>
                      <div className="text-xs text-slate-400">Collateral requirement met</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg">
                    {mockEligibility.liquidityAvailable ? (
                      <Badge variant="success" icon={<CheckIcon />}>Available</Badge>
                    ) : (
                      <Badge variant="warning" icon={<ExclamationIcon />}>Limited</Badge>
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-100">Pool Liquidity</div>
                      <div className="text-xs text-slate-400">{mockPoolData.availableLiquidity} BOT available</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg">
                    {mockEligibility.loanLimitPassed ? (
                      <Badge variant="success" icon={<CheckIcon />}>Within Limit</Badge>
                    ) : (
                      <Badge variant="error" icon={<XIcon />}>Exceeded</Badge>
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-100">Loan Limit</div>
                      <div className="text-xs text-slate-400">Max {mockPoolData.maxLoanAmount} BOT per loan</div>
                    </div>
                  </div>
                </div>

                {!allEligibilityMet && (
                  <div className="mt-4 bg-rose-500/10 border border-rose-500/30 rounded-lg p-4">
                    <div className="flex gap-3">
                      <ExclamationIcon />
                      <div className="text-sm text-rose-200">
                        You do not meet all eligibility requirements. Complete the requirements above to request a loan.
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Loan Calculator */}
          {!hasActiveLoan && !showReview && allEligibilityMet && (
            <Card>
              <CardHeader>Loan Calculator</CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Loan Amount Input */}
                  <div>
                    <Input
                      label="Loan Amount (BOT)"
                      type="text"
                      value={loanAmount}
                      onChange={handleLoanAmountChange}
                      placeholder="0.00"
                      required
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      Maximum: {mockPoolData.maxLoanAmount} BOT
                    </p>
                  </div>

                  {/* Duration Input */}
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-100">
                      Loan Duration (Months) <span className="text-rose-500 ml-1">*</span>
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-600 rounded-lg text-slate-100 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    >
                      <option value="3">3 months</option>
                      <option value="6">6 months</option>
                      <option value="9">9 months</option>
                      <option value="12">12 months</option>
                    </select>
                  </div>

                  {/* Loan Summary */}
                  {loanAmountNum > 0 && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-blue-400 mb-3">
                        Estimated Repayment
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Principal</span>
                          <span className="text-slate-100 font-medium">
                            {loanAmountNum.toLocaleString()} BOT
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Interest Rate</span>
                          <span className="text-slate-100 font-medium">
                            {mockPoolData.interestRate}% annual
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Duration</span>
                          <span className="text-slate-100 font-medium">
                            {durationNum} months
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-blue-500/30">
                          <span className="text-slate-400 font-semibold">Total Repayment</span>
                          <span className="text-blue-400 font-bold">
                            {totalRepayment.toFixed(2)} BOT
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Monthly Payment</span>
                          <span className="text-slate-100 font-medium">
                            ~{monthlyPayment.toFixed(2)} BOT
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Required Stake */}
                  {loanAmountNum > 0 && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-amber-400 mb-3">
                        Required Stake
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Stake Percentage</span>
                          <span className="text-slate-100 font-medium">
                            {mockPoolData.minStakePercentage}% of loan
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-semibold">Required Amount</span>
                          <span className="text-amber-400 font-bold">
                            {requiredStake.toFixed(2)} BOT
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-amber-200 mt-3">
                        Your stake will be locked during the loan period and returned when you complete all payments.
                      </p>
                    </div>
                  )}

                  {/* Smart Contract Note */}
                  <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                    <div className="flex gap-3">
                      <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div className="text-sm text-slate-300">
                        <strong className="text-slate-100">Smart Contract Approval:</strong> The final loan approval is determined by the Loanch smart contract based on your eligibility, pool liquidity, and loan terms. This interface only helps you prepare your request.
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    fullWidth
                    size="large"
                    onClick={handleReviewLoan}
                    disabled={loanAmountNum <= 0 || loanAmountNum > parseFloat(mockPoolData.maxLoanAmount.replace(/,/g, ""))}
                  >
                    Review Loan Request
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Review Screen */}
          {showReview && (
            <Card>
              <CardHeader>Review Loan Request</CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Transaction State */}
                  {txState !== "ready" && (
                    <TransactionStatus
                      state={txState}
                      message={
                        txState === "preparing" ? "Preparing your loan request..." :
                        txState === "waiting-wallet" ? "Please confirm the stake lock and loan request in your wallet" :
                        txState === "submitted" ? "Loan request submitted to smart contract" :
                        txState === "confirming" ? "Smart contract is processing your request..." :
                        "Loan approved and funds disbursed!"
                      }
                    />
                  )}

                  {txState === "ready" && (
                    <>
                      {/* Loan Summary */}
                      <div className="bg-slate-900 rounded-lg p-6 space-y-4">
                        <div className="text-center pb-4 border-b border-slate-700">
                          <div className="text-sm text-slate-400 mb-1">Loan Amount</div>
                          <div className="text-4xl font-bold text-blue-400">
                            {loanAmount} BOT
                          </div>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Duration</span>
                            <span className="text-slate-100 font-medium">{duration} months</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Interest Rate</span>
                            <span className="text-slate-100 font-medium">{mockPoolData.interestRate}% annual</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Total Repayment</span>
                            <span className="text-blue-400 font-medium">{totalRepayment.toFixed(2)} BOT</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Monthly Payment</span>
                            <span className="text-slate-100 font-medium">~{monthlyPayment.toFixed(2)} BOT</span>
                          </div>
                          <div className="flex justify-between pt-3 border-t border-slate-700">
                            <span className="text-slate-400">Required Stake</span>
                            <span className="text-amber-400 font-bold">{requiredStake.toFixed(2)} BOT</span>
                          </div>
                        </div>
                      </div>

                      {/* Stake Status */}
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-amber-400 mb-2">Stake Status</h4>
                        <div className="text-sm text-amber-200">
                          <p className="mb-2">
                            <strong>{requiredStake.toFixed(2)} BOT</strong> will be locked as collateral when you submit this request.
                          </p>
                          <p className="text-xs">
                            Your stake will be returned automatically when you complete all loan payments. If you default, the stake may be used according to the smart contract rules.
                          </p>
                        </div>
                      </div>

                      {/* Important Notes */}
                      <div className="space-y-3">
                        <div className="flex gap-2 text-sm text-slate-300">
                          <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>The smart contract will verify all eligibility requirements before approval</span>
                        </div>
                        <div className="flex gap-2 text-sm text-slate-300">
                          <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Funds will be disbursed directly to your wallet upon approval</span>
                        </div>
                        <div className="flex gap-2 text-sm text-slate-300">
                          <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Your repayment history will build your financial reputation on-chain</span>
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
                          onClick={handleConfirmRequest}
                        >
                          Submit Loan Request
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
