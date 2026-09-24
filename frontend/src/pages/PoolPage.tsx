import { useState } from "react"
import { Card, CardContent, CardHeader } from "../components/Card"
import { Button } from "../components/Button"
import { Badge, CheckIcon, ExclamationIcon } from "../components/Badge"
import { Input } from "../components/Input"
import { DEMO_POOL_TRANSPARENCY } from "../data/mockData"
import type { Page } from "../types"

interface PoolPageProps {
  onNavigate: (page: Page) => void
}

export function PoolPage({ onNavigate }: PoolPageProps) {
  const pool = DEMO_POOL_TRANSPARENCY
  const [testAmount, setTestAmount] = useState<string>("25000")

  const totalDepositsNum = parseFloat(pool.totalDeposits.replace(/,/g, ""))
  const activeLoansNum = parseFloat(pool.activeLoans.replace(/,/g, ""))
  const maxLendingCapacity = totalDepositsNum * (pool.maxLendingRatio / 100)
  const remainingLendingCapacity = Math.max(0, maxLendingCapacity - activeLoansNum)
  
  const testAmountNum = parseFloat(testAmount) || 0
  const projectedActiveLoans = activeLoansNum + testAmountNum
  const fitsCapacity = projectedActiveLoans <= maxLendingCapacity

  return (
    <div className="loanch-page loanch-secondary py-8">
      <div className="loanch-container space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-slate-100">Transparent Pool</h1>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                Phase 9
              </span>
            </div>
            <p className="text-slate-400 mt-1">
              Verifiable on-chain capital allocation, reserve safeguards, and programmatic lending limits.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button size="small" onClick={() => onNavigate("saver")}>
              Deposit to Pool
            </Button>
            <Button variant="secondary" size="small" onClick={() => onNavigate("borrower")}>
              Borrow from Pool
            </Button>
          </div>
        </div>

        {/* Required Concept: Total Pool -> Active Lending -> Available Liquidity -> Reserve */}
        <Card className="border-slate-800 bg-slate-900/60 overflow-hidden">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-slate-100">Pool Capital Pipeline Architecture</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  How saver deposits flow deterministically through smart contract allocation rules
                </p>
              </div>
              <Badge variant="success">Rule Enforced: Max 80% Lending</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Visual Flow diagram */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              
              {/* Step 1: Total Pool */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">1. Total Pool</span>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">100%</span>
                </div>
                <div className="text-2xl font-bold text-slate-100">{pool.totalDeposits} BOT</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Aggregated saver deposits managed as a single shared pool without P2P picking.
                </p>
              </div>

              {/* Step 2: Active Lending */}
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">2. Active Lending</span>
                  <span className="text-[10px] text-blue-300 bg-blue-500/20 px-1.5 py-0.5 rounded">80.0%</span>
                </div>
                <div className="text-2xl font-bold text-blue-400">{pool.activeLoans} BOT</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Capital actively disbursed to verified borrowers with skin-in-the-game stakes.
                </p>
              </div>

              {/* Step 3: Available Liquidity */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">3. Available Liquidity</span>
                  <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded">20.0%</span>
                </div>
                <div className="text-2xl font-bold text-emerald-400">{pool.availableLiquidity} BOT</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Unborrowed funds readily available in the contract for immediate saver withdrawals.
                </p>
              </div>

              {/* Step 4: Reserve */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">4. Mandatory Reserve</span>
                  <span className="text-[10px] text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded">20.0% Min</span>
                </div>
                <div className="text-2xl font-bold text-amber-400">{pool.liquidityReserve} BOT</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enforced reserve floor protecting withdrawal access & system solvency.
                </p>
              </div>
            </div>

            {/* Proportional allocation visual bar */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span>Active Loans (80.0%)</span>
                <span>Liquidity Reserve Floor (20.0%)</span>
              </div>
              <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
                <div className="loanch-pool-bar h-full bg-blue-500" style={{ width: "80%" }} title="80% Active Lending"></div>
                <div className="loanch-pool-bar h-full bg-amber-500" style={{ width: "20%" }} title="20% Reserve"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 6 Key Operational Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card className="border-slate-800">
            <CardContent>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Total Deposits</div>
              <div className="text-xl font-bold text-slate-100 mt-1">2.45M BOT</div>
              <div className="text-[11px] text-emerald-400 mt-1">{pool.totalSavers} Savers</div>
            </CardContent>
          </Card>

          <Card className="border-slate-800">
            <CardContent>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Active Loans</div>
              <div className="text-xl font-bold text-blue-400 mt-1">1.96M BOT</div>
              <div className="text-[11px] text-slate-400 mt-1">{pool.activeBorrowers} Borrowers</div>
            </CardContent>
          </Card>

          <Card className="border-slate-800">
            <CardContent>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Available Liquidity</div>
              <div className="text-xl font-bold text-emerald-400 mt-1">490K BOT</div>
              <div className="text-[11px] text-slate-400 mt-1">Ready for withdrawal</div>
            </CardContent>
          </Card>

          <Card className="border-slate-800">
            <CardContent>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Liquidity Reserve</div>
              <div className="text-xl font-bold text-amber-400 mt-1">490K BOT</div>
              <div className="text-[11px] text-slate-400 mt-1">20% safety buffer</div>
            </CardContent>
          </Card>

          <Card className="border-slate-800">
            <CardContent>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Loss Reserve</div>
              <div className="text-xl font-bold text-purple-400 mt-1">24.5K BOT</div>
              <div className="text-[11px] text-slate-400 mt-1">From 5% margin share</div>
            </CardContent>
          </Card>

          <Card className="border-slate-800">
            <CardContent>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Pool Utilization</div>
              <div className="text-xl font-bold text-slate-100 mt-1">80.0%</div>
              <div className="text-[11px] text-amber-400 mt-1">At Target Ceiling</div>
            </CardContent>
          </Card>
        </div>

        {/* Two-Column Deep Dive: Reserve Explanation & Lending Capacity Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Section 1: Reserve Explanation */}
          <Card className="border-slate-800 space-y-4">
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-100">Why Loanch Keeps Reserves</h2>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <h3 className="font-semibold text-slate-100 text-sm flex items-center gap-2">
                  <CheckIcon /> No 100% Lending Rule
                </h3>
                <p className="text-slate-400">
                  Unlike platforms that lend out 100% of user deposits, Loanch strictly caps active lending at <strong>80% of total deposits</strong>. This guarantees that at all times, a minimum 20% liquidity reserve remains unencumbered in the smart contract.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                <h3 className="font-semibold text-amber-300 text-sm">
                  Crucial Distinction: Liquidity Reserve vs. Loss Reserve
                </h3>
                <ul className="space-y-2 text-slate-400">
                  <li>
                    • <strong className="text-slate-200">Liquidity Reserve (Cadangan Likuiditas):</strong> Equal to 20% of Saver deposits. It remains 100% part of the Savers’ principal, but is held unlent so Savers can execute withdrawals without waiting for loans to mature.
                  </li>
                  <li>
                    • <strong className="text-slate-200">Loss Reserve (Cadangan Kerugian):</strong> A completely separate balance (currently 24,500 BOT) funded strictly from a 5% allocation of borrower margin payments. If any loan defaults after the 7-day grace period and stake compensation, this reserve absorbs the difference before Saver principal is ever affected.
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <h3 className="font-semibold text-slate-100 text-sm">
                  Margin Distribution Split (80% / 15% / 5%)
                </h3>
                <p className="text-slate-400">
                  Whenever a borrower pays margin (interest), the smart contract executes an automated division:
                </p>
                <div className="grid grid-cols-3 gap-2 text-center pt-1 font-medium">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20">
                    80% to Savers
                  </div>
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">
                    15% Platform
                  </div>
                  <div className="p-2 bg-purple-500/10 text-purple-400 rounded border border-purple-500/20">
                    5% Loss Reserve
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Interactive Lending Capacity Simulator & Human-Readable Rule Explanations */}
          <Card className="border-slate-800">
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-100">Lending Capacity Simulator</h2>
                <span className="text-xs text-slate-400">Smart Contract Rule Verification</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-xs text-slate-400 leading-relaxed">
                Test how the Loanch smart contract evaluates whether a requested loan amount can be funded given the current pool utilization and reserve constraints.
              </p>

              <div className="space-y-3">
                <Input
                  label="Simulate New Loan Amount (BOT)"
                  type="text"
                  value={testAmount}
                  onChange={(e) => setTestAmount(e.target.value)}
                  placeholder="e.g. 25000"
                />

                <div className="flex gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setTestAmount("5000")}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700"
                  >
                    5,000 BOT
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestAmount("25000")}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700"
                  >
                    25,000 BOT
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestAmount("100000")}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700"
                  >
                    100,000 BOT (Max Limit)
                  </button>
                </div>
              </div>

              {/* Smart Contract Rule Calculation */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <div className="text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
                  Smart Contract Rule Evaluation
                </div>
                <div className="space-y-1.5 text-slate-400">
                  <div className="flex justify-between">
                    <span>Total Pool Deposits:</span>
                    <span className="text-slate-200 font-medium">2,450,000 BOT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Allowed Lending (80%):</span>
                    <span className="text-slate-200 font-medium">1,960,000 BOT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Active Loans:</span>
                    <span className="text-blue-400 font-medium">1,960,000 BOT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Available Capacity:</span>
                    <span className="text-emerald-400 font-medium">{remainingLendingCapacity.toFixed(2)} BOT</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-800 font-medium">
                    <span>Projected Active Lending:</span>
                    <span className={fitsCapacity ? "text-slate-200" : "text-rose-400"}>
                      {projectedActiveLoans.toLocaleString("en-US", { minimumFractionDigits: 2 })} BOT
                    </span>
                  </div>
                </div>
              </div>

              {/* Human-Readable Rule Explanation Notice */}
              {fitsCapacity ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5 text-emerald-300">
                    <CheckIcon /> Within Pool Capacity
                  </div>
                  <p>
                    This loan request of {testAmountNum.toLocaleString()} BOT fits within the available lending capacity without violating the 20% mandatory reserve.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-200 space-y-2">
                  <div className="font-semibold flex items-center gap-1.5 text-rose-300 text-sm">
                    <ExclamationIcon /> Lending Capacity Limit Exceeded
                  </div>
                  <p className="leading-relaxed">
                    <strong>Smart Contract Rule Explanation:</strong> The requested loan of {testAmountNum.toLocaleString()} BOT cannot be approved because the pool is currently operating at its 80% maximum active lending limit (1,960,000 BOT / 2,450,000 BOT).
                  </p>
                  <p className="leading-relaxed text-rose-300/90">
                    Under Loanch solvency invariants, smart contracts prevent disbursing funds when it would breach the 20% liquidity reserve. To unlock capacity, either existing borrowers must make repayments, or new deposits must enter the pool.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
