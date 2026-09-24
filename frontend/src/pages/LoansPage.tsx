import { useState } from "react"
import { Card, CardContent, CardHeader } from "../components/Card"
import { Button } from "../components/Button"
import { Badge, CheckIcon, ExclamationIcon } from "../components/Badge"
import { Input } from "../components/Input"
import { EmptyState, DocumentIcon } from "../components/EmptyState"
import { TransactionStatus } from "../components/TransactionStatus"
import { NetworkGuard } from "../components/WalletComponents"
import { DEMO_LOANS } from "../data/mockData"
import type { ExtendedLoan, LoanLifecycleStage, Page, TransactionState } from "../types"

interface LoansPageProps {
  onNavigate: (page: Page) => void
}

const LIFECYCLE_STAGES: { stage: LoanLifecycleStage; label: string; desc: string }[] = [
  { stage: "requested", label: "1. Loan Requested", desc: "Borrower submitted request with verified credentials" },
  { stage: "approved", label: "2. Approved", desc: "Contract validated identity, risk score, & pool liquidity" },
  { stage: "stake-locked", label: "3. Stake Locked", desc: "Skin-in-the-game collateral locked into escrow" },
  { stage: "disbursed", label: "4. Disbursed", desc: "Principal transferred directly to borrower wallet" },
  { stage: "repayment", label: "5. Repayment", desc: "Active payment schedule amortizing principal & margin" },
  { stage: "completed", label: "6. Completed", desc: "Zero debt reached; stake released & reputation updated" },
]

export function LoansPage({ onNavigate }: LoansPageProps) {
  const [loans, setLoans] = useState<ExtendedLoan[]>(DEMO_LOANS)
  const [selectedLoanId, setSelectedLoanId] = useState<string>("LOAN-001")
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
  
  // Repayment form modal state
  const [isRepayModalOpen, setIsRepayModalOpen] = useState(false)
  const [repayAmount, setRepayAmount] = useState("")
  const [txState, setTxState] = useState<TransactionState>("ready")
  const [repaySuccess, setRepaySuccess] = useState(false)

  const selectedLoan = loans.find(l => l.id === selectedLoanId) || loans[0]

  const filteredLoans = loans.filter((loan) => {
    if (filter === "active") return loan.status === "active"
    if (filter === "completed") return loan.status === "completed"
    return true
  })

  // Summary statistics
  const totalBorrowed = loans.reduce((acc, l) => acc + parseFloat(l.principal.replace(/,/g, "")), 0)
  const totalRemaining = loans.reduce((acc, l) => acc + parseFloat(l.remainingDebt.replace(/,/g, "")), 0)
  const totalRepaid = loans.reduce((acc, l) => acc + parseFloat(l.amountPaid.replace(/,/g, "")), 0)
  const activeStake = loans
    .filter(l => l.status === "active")
    .reduce((acc, l) => acc + parseFloat(l.stakedAmount.replace(/,/g, "")), 0)

  const getStageIndex = (stage: LoanLifecycleStage): number => {
    switch (stage) {
      case "requested": return 0
      case "approved": return 1
      case "stake-locked": return 2
      case "disbursed": return 3
      case "repayment": return 4
      case "completed": return 5
      default: return 0
    }
  }

  const handleOpenRepayModal = () => {
    if (!selectedLoan || selectedLoan.status !== "active") return
    setRepayAmount("1350.00")
    setTxState("ready")
    setRepaySuccess(false)
    setIsRepayModalOpen(true)
  }

  const handleExecuteRepayment = async () => {
    const amountNum = parseFloat(repayAmount)
    if (!amountNum || amountNum <= 0) return

    setTxState("preparing")
    await new Promise(r => setTimeout(r, 800))
    setTxState("waiting-wallet")
    await new Promise(r => setTimeout(r, 1200))
    setTxState("submitted")
    await new Promise(r => setTimeout(r, 900))
    setTxState("confirming")
    await new Promise(r => setTimeout(r, 1500))
    setTxState("confirmed")
    await new Promise(r => setTimeout(r, 700))

    // Update loan position state locally for demonstration
    setLoans(prevLoans => prevLoans.map(loan => {
      if (loan.id !== selectedLoan.id) return loan
      const currentDebt = parseFloat(loan.remainingDebt.replace(/,/g, ""))
      const currentPaid = parseFloat(loan.amountPaid.replace(/,/g, ""))
      const newDebt = Math.max(0, currentDebt - amountNum)
      const newPaid = currentPaid + amountNum
      const isComplete = newDebt === 0

      const newRecord = {
        id: `REP-${loan.id}-${loan.repayments.length + 1}`,
        loanId: loan.id,
        date: new Date().toISOString().split("T")[0],
        amount: amountNum.toFixed(2),
        principalPortion: (amountNum * 0.925).toFixed(2),
        marginPortion: (amountNum * 0.075).toFixed(2),
        status: "confirmed" as const,
        note: isComplete ? "Full settlement payment · Loan finalized" : "Installment payment processed",
      }

      return {
        ...loan,
        remainingDebt: newDebt.toFixed(2),
        amountPaid: newPaid.toFixed(2),
        status: isComplete ? ("completed" as const) : loan.status,
        currentStage: isComplete ? ("completed" as const) : loan.currentStage,
        stakeStatus: isComplete ? ("unlocked" as const) : loan.stakeStatus,
        repayments: [newRecord, ...loan.repayments],
      }
    }))

    setRepaySuccess(true)
  }

  return (
    <NetworkGuard>
      <div className="min-h-screen bg-slate-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-slate-100">Loan Management</h1>
                <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
                  Phase 8
                </span>
              </div>
              <p className="text-slate-400 mt-1">
                Monitor repayment schedules, collateral stakes, and verifiable smart contract lifecycle state.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="small" onClick={() => onNavigate("borrower")}>
                Request New Loan
              </Button>
              <Button variant="secondary" size="small" onClick={() => onNavigate("dashboard")}>
                Dashboard
              </Button>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-blue-500/20 bg-slate-900/60">
              <CardContent>
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Active Debt Obligation</div>
                <div className="text-2xl font-bold text-blue-400">
                  {totalRemaining.toLocaleString("en-US", { minimumFractionDigits: 2 })} BOT
                </div>
                <div className="text-xs text-slate-400 mt-1">Principal + remaining margin</div>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/60">
              <CardContent>
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Borrowed</div>
                <div className="text-2xl font-bold text-slate-100">
                  {totalBorrowed.toLocaleString("en-US", { minimumFractionDigits: 2 })} BOT
                </div>
                <div className="text-xs text-slate-400 mt-1">Across {loans.length} lifetime loans</div>
              </CardContent>
            </Card>

            <Card className="border-emerald-500/20 bg-slate-900/60">
              <CardContent>
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Amount Repaid</div>
                <div className="text-2xl font-bold text-emerald-400">
                  {totalRepaid.toLocaleString("en-US", { minimumFractionDigits: 2 })} BOT
                </div>
                <div className="text-xs text-slate-400 mt-1">Returned to pool & savers</div>
              </CardContent>
            </Card>

            <Card className="border-amber-500/20 bg-slate-900/60">
              <CardContent>
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Locked Collateral Stake</div>
                <div className="text-2xl font-bold text-amber-400">
                  {activeStake.toLocaleString("en-US", { minimumFractionDigits: 2 })} BOT
                </div>
                <div className="text-xs text-slate-400 mt-1">Skin-in-the-game held in contract</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Layout: List & Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Loan List */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-100">Your Loans</h2>
                <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      filter === "all" ? "bg-slate-800 text-emerald-400 font-medium" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    All ({loans.length})
                  </button>
                  <button
                    onClick={() => setFilter("active")}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      filter === "active" ? "bg-slate-800 text-emerald-400 font-medium" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Active ({loans.filter(l => l.status === "active").length})
                  </button>
                  <button
                    onClick={() => setFilter("completed")}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      filter === "completed" ? "bg-slate-800 text-emerald-400 font-medium" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Settled ({loans.filter(l => l.status === "completed").length})
                  </button>
                </div>
              </div>

              {filteredLoans.length === 0 ? (
                <EmptyState
                  icon={<DocumentIcon />}
                  title="No loans found"
                  description="You have no loans matching this filter."
                  action={{
                    label: "Request a Loan",
                    onClick: () => onNavigate("borrower"),
                  }}
                />
              ) : (
                <div className="space-y-3">
                  {filteredLoans.map((loan) => {
                    const isSelected = selectedLoan?.id === loan.id
                    return (
                      <div
                        key={loan.id}
                        onClick={() => setSelectedLoanId(loan.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-slate-800/90 border-emerald-500 shadow-md ring-1 ring-emerald-500/30"
                            : "bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-850"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-semibold text-slate-100 text-base">{loan.id}</span>
                            <span className="text-xs text-slate-400 ml-2">({loan.durationMonths} mos)</span>
                          </div>
                          <Badge variant={loan.status === "active" ? "warning" : "success"}>
                            {loan.status === "active" ? "In Repayment" : "Completed"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs py-2 border-t border-slate-800/80 my-2">
                          <div>
                            <span className="text-slate-400 block">Remaining:</span>
                            <span className={`font-semibold text-sm ${loan.status === "active" ? "text-blue-400" : "text-slate-300"}`}>
                              {loan.remainingDebt} BOT
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-400 block">Principal:</span>
                            <span className="text-slate-200 font-medium">{loan.principal} BOT</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
                          <span>Due: {loan.dueDate}</span>
                          <span className="text-amber-400/90">Stake: {loan.stakedAmount} BOT</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Loan Detail, Lifecycle Timeline, & Repayments */}
            <div className="lg:col-span-2 space-y-6">
              {selectedLoan ? (
                <>
                  {/* Loan Header Card */}
                  <Card className="border-slate-800">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-slate-100">{selectedLoan.id}</span>
                            <Badge variant={selectedLoan.status === "active" ? "warning" : "success"}>
                              {selectedLoan.status === "active" ? "Active Obligation" : "Fully Settled"}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            Smart Contract Loan ID · Enforced on BOT Chain
                          </p>
                        </div>
                        {selectedLoan.status === "active" && (
                          <Button onClick={handleOpenRepayModal}>
                            Make Repayment
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-6">
                        <div>
                          <div className="text-xs text-slate-400">Principal</div>
                          <div className="text-lg font-bold text-slate-100">{selectedLoan.principal} BOT</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-400">Total Repayment</div>
                          <div className="text-lg font-bold text-slate-200">{selectedLoan.totalRepayment} BOT</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-400">Amount Paid</div>
                          <div className="text-lg font-bold text-emerald-400">{selectedLoan.amountPaid} BOT</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-400">Remaining Debt</div>
                          <div className="text-lg font-bold text-blue-400">{selectedLoan.remainingDebt} BOT</div>
                        </div>
                      </div>

                      {/* Required Lifecycle Timeline */}
                      <div className="space-y-4 pt-2">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
                            Smart Contract Lifecycle Timeline
                          </h3>
                          <span className="text-xs text-emerald-400 flex items-center gap-1">
                            <CheckIcon /> Verifiable On-Chain
                          </span>
                        </div>

                        <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-6 my-4">
                          {LIFECYCLE_STAGES.map((step, idx) => {
                            const currentIdx = getStageIndex(selectedLoan.currentStage)
                            const isCompleted = idx < currentIdx || (idx === currentIdx && selectedLoan.status === "completed")
                            const isCurrent = idx === currentIdx && selectedLoan.status !== "completed"

                            return (
                              <div key={step.stage} className="relative">
                                {/* Dot */}
                                <div
                                  className={`absolute -left-[31px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                    isCompleted
                                      ? "bg-emerald-500 text-slate-950 ring-4 ring-slate-950"
                                      : isCurrent
                                      ? "bg-blue-500 text-white ring-4 ring-blue-500/20 animate-pulse"
                                      : "bg-slate-800 text-slate-500 ring-4 ring-slate-950"
                                  }`}
                                >
                                  {isCompleted ? "✓" : idx + 1}
                                </div>

                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className={`text-sm font-semibold ${isCompleted ? "text-emerald-400" : isCurrent ? "text-blue-400" : "text-slate-400"}`}>
                                      {step.label}
                                    </span>
                                    {isCurrent && (
                                      <Badge variant="pending">Current State</Badge>
                                    )}
                                    {isCompleted && idx === 5 && (
                                      <Badge variant="success">Finalized</Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-400">{step.desc}</p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Stake State & Smart Contract Rule Explanation */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800">
                        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                              Skin-in-the-game Stake
                            </span>
                            <Badge variant={selectedLoan.stakeStatus === "locked" ? "warning" : "success"}>
                              {selectedLoan.stakeStatus === "locked" ? "Locked in Escrow" : "Unlocked & Returned"}
                            </Badge>
                          </div>
                          <div className="text-2xl font-bold text-amber-300">
                            {selectedLoan.stakedAmount} BOT
                          </div>
                          <p className="text-xs text-amber-200/80 leading-relaxed">
                            {selectedLoan.stakeStatus === "locked"
                              ? "Collateral locked at disbursement. The smart contract automatically releases 100% of this stake back to your wallet once Remaining Debt reaches zero."
                              : "This loan has been fully settled! The smart contract automatically returned your 250.00 BOT stake back to your wallet."}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                          <div className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                            Smart Contract Governance
                          </div>
                          <div className="text-xs text-slate-400 leading-relaxed space-y-2">
                            <p>
                              • <strong>Rule Authority:</strong> Loan state is enforced by deterministic smart contract logic on BOT Chain, not by this web client.
                            </p>
                            <p>
                              • <strong>Default Policy:</strong> A 7-day grace period applies after the due date ({selectedLoan.dueDate}). If unpaid, smart contract default rules trigger stake slashing towards saver principal protection.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Repayment History Table */}
                      <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-base font-semibold text-slate-100">Repayment History</h3>
                          <span className="text-xs text-slate-400">
                            {selectedLoan.repayments.length} confirmed payments
                          </span>
                        </div>

                        {selectedLoan.repayments.length === 0 ? (
                          <div className="text-center py-6 text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">
                            No payments recorded yet for this loan.
                          </div>
                        ) : (
                          <div className="overflow-x-auto rounded-lg border border-slate-800">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
                                <tr>
                                  <th className="px-4 py-3">Date</th>
                                  <th className="px-4 py-3">Total Paid</th>
                                  <th className="px-4 py-3">Principal Amortization</th>
                                  <th className="px-4 py-3">Margin (Interest)</th>
                                  <th className="px-4 py-3">Status</th>
                                  <th className="px-4 py-3">Note</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-800 bg-slate-950">
                                {selectedLoan.repayments.map((rec) => (
                                  <tr key={rec.id} className="hover:bg-slate-900/50">
                                    <td className="px-4 py-3 font-medium text-slate-200">{rec.date}</td>
                                    <td className="px-4 py-3 font-bold text-emerald-400">{rec.amount} BOT</td>
                                    <td className="px-4 py-3 text-slate-300">{rec.principalPortion} BOT</td>
                                    <td className="px-4 py-3 text-slate-400">{rec.marginPortion} BOT</td>
                                    <td className="px-4 py-3">
                                      <Badge variant="success">Confirmed</Badge>
                                    </td>
                                    <td className="px-4 py-3 text-slate-400">{rec.note || "—"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : null}
            </div>
          </div>
        </div>

        {/* Repayment Modal */}
        {isRepayModalOpen && selectedLoan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-100">Make Loan Payment</h3>
                  <p className="text-xs text-slate-400">Repaying {selectedLoan.id} on BOT Chain</p>
                </div>
                <button
                  onClick={() => setIsRepayModalOpen(false)}
                  className="text-slate-400 hover:text-slate-100 text-lg p-1"
                >
                  ✕
                </button>
              </div>

              {repaySuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                    ✓
                  </div>
                  <h4 className="text-lg font-bold text-slate-100">Payment Confirmed!</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    The smart contract has credited your repayment. Principal has been amortized and distributed back towards the Saver pool.
                  </p>
                  <Button onClick={() => setIsRepayModalOpen(false)}>
                    Close and Return to Loan
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {txState !== "ready" && (
                    <TransactionStatus
                      state={txState}
                      message={
                        txState === "preparing" ? "Preparing repayment transaction payload..." :
                        txState === "waiting-wallet" ? "Please sign repayment in your wallet..." :
                        txState === "submitted" ? "Payment submitted to Loanch contract..." :
                        txState === "confirming" ? "Confirming on BOT Chain..." :
                        "Repayment finalized on-chain!"
                      }
                    />
                  )}

                  {txState === "ready" && (
                    <>
                      <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Current Remaining Debt:</span>
                          <span className="text-blue-400 font-bold">{selectedLoan.remainingDebt} BOT</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Repayment Priority:</span>
                          <span className="text-slate-200">Principal Amortized First</span>
                        </div>
                      </div>

                      <Input
                        label="Payment Amount (BOT)"
                        type="text"
                        value={repayAmount}
                        onChange={(e) => setRepayAmount(e.target.value)}
                        placeholder="0.00"
                        required
                      />

                      {/* Quick amount shortcuts */}
                      <div className="flex gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setRepayAmount("1350.00")}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700"
                        >
                          1 Month (~1,350 BOT)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const half = (parseFloat(selectedLoan.remainingDebt.replace(/,/g, "")) / 2).toFixed(2)
                            setRepayAmount(half)
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700"
                        >
                          50% Balance
                        </button>
                        <button
                          type="button"
                          onClick={() => setRepayAmount(selectedLoan.remainingDebt.replace(/,/g, ""))}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700"
                        >
                          Pay in Full
                        </button>
                      </div>

                      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-200 flex gap-2">
                        <ExclamationIcon />
                        <span>
                          Repayments directly reduce your active obligation and contribute toward your on-chain Financial Reputation.
                        </span>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          fullWidth
                          variant="secondary"
                          onClick={() => setIsRepayModalOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          fullWidth
                          onClick={handleExecuteRepayment}
                          disabled={!parseFloat(repayAmount) || parseFloat(repayAmount) <= 0}
                        >
                          Confirm Payment
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </NetworkGuard>
  )
}
