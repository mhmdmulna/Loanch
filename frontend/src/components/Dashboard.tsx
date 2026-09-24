import { Card, CardContent, CardHeader } from "./Card"
import { Button } from "./Button"
import { Badge } from "./Badge"
import { WalletStatus, NetworkGuard } from "./WalletComponents"
import { EmptyState, PiggyBankIcon, DocumentIcon } from "./EmptyState"
import { useWallet } from "../hooks/useWallet"
import type { Page } from "../types"

// Mock data for demonstration - clearly labeled as demo
const mockDashboardData = {
  saverPosition: {
    depositAmount: "5,000.00",
    currentBalance: "5,127.50",
    accumulatedReturn: "127.50",
    withdrawableAmount: "5,127.50",
    apr: 8.5
  },
  borrowerPosition: {
    activeLoan: {
      id: "LOAN-001",
      principal: "10,000.00",
      totalRepayment: "10,800.00",
      amountPaid: "2,700.00",
      remainingDebt: "8,100.00",
      dueDate: "2024-06-15",
      stakeAmount: "500.00"
    }
  },
  poolHealth: {
    totalDeposits: "2,450,000",
    activeLoan: "1,960,000", 
    availableLiquidity: "490,000",
    reserveFund: "490,000",
    utilizationRate: 80,
    totalSavers: 1247,
    activeBorrowers: 156
  },
  recentActivity: [
    { id: 1, type: "deposit", amount: "1,000.00", date: "2024-02-15", status: "confirmed" },
    { id: 2, type: "loan_payment", amount: "450.00", date: "2024-02-10", status: "confirmed" },
    { id: 3, type: "return_distribution", amount: "32.50", date: "2024-02-01", status: "confirmed" }
  ]
}

interface DashboardProps {
  onNavigate: (page: Page) => void
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [wallet] = useWallet()

  return (
    <NetworkGuard>
      <div className="min-h-screen bg-slate-950">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-100">Dashboard</h1>
                <p className="text-slate-400 mt-1">Manage your positions and monitor pool activity</p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <WalletStatus showDetails={false} />
                <div className="text-xs text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full">
                  Demo Data - Contract Integration Pending
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Wallet & Network Status */}
          <div className="mb-8">
            <Card>
              <CardContent>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-2">Wallet Status</h3>
                    <WalletStatus showDetails={true} />
                  </div>
                  {wallet.isConnected && wallet.balance && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-100">
                        {parseFloat(wallet.balance).toFixed(4)} BOT
                      </div>
                      <div className="text-sm text-slate-400">Available Balance</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
              <CardHeader>Save & Earn</CardHeader>
              <CardContent>
                <p className="text-slate-400 mb-4">
                  Deposit funds into the loan pool and earn returns from borrower repayments.
                </p>
                <Button fullWidth size="large" onClick={() => onNavigate("saver")}>
                  Start Saving
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
              <CardHeader>Borrow Funds</CardHeader>
              <CardContent>
                <p className="text-slate-400 mb-4">
                  Request a loan after identity verification and staking collateral.
                </p>
                <Button fullWidth size="large" variant="secondary" onClick={() => onNavigate("borrower")}>
                  Request Loan
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Position Summaries */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Saver Position */}
            <div>
              <h2 className="text-xl font-semibold text-slate-100 mb-4">Your Saver Position</h2>
              {mockDashboardData.saverPosition ? (
                <Card>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-2xl font-bold text-emerald-400">
                            {mockDashboardData.saverPosition.currentBalance} BOT
                          </div>
                          <div className="text-sm text-slate-400">Current Balance</div>
                        </div>
                        <Badge variant="success">
                          +{mockDashboardData.saverPosition.apr}% APR
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-slate-400">Deposited</div>
                          <div className="text-slate-100 font-medium">
                            {mockDashboardData.saverPosition.depositAmount} BOT
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400">Total Return</div>
                          <div className="text-emerald-400 font-medium">
                            +{mockDashboardData.saverPosition.accumulatedReturn} BOT
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-700">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-slate-400">Withdrawable</span>
                          <span className="text-sm text-slate-100 font-medium">
                            {mockDashboardData.saverPosition.withdrawableAmount} BOT
                          </span>
                        </div>
                        <Button fullWidth size="small" variant="secondary">
                          Request Withdrawal
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <EmptyState
                  icon={<PiggyBankIcon />}
                  title="No deposits yet"
                  description="Start saving to earn returns on the Loanch platform"
                  action={{
                    label: "Deposit Now",
                    onClick: () => onNavigate("saver")
                  }}
                />
              )}
            </div>

            {/* Borrower Position */}
            <div>
              <h2 className="text-xl font-semibold text-slate-100 mb-4">Your Borrower Position</h2>
              {mockDashboardData.borrowerPosition.activeLoan ? (
                <Card>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-2xl font-bold text-blue-400">
                            {mockDashboardData.borrowerPosition.activeLoan.remainingDebt} BOT
                          </div>
                          <div className="text-sm text-slate-400">Remaining Debt</div>
                        </div>
                        <Badge variant="warning">
                          {mockDashboardData.borrowerPosition.activeLoan.id}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-slate-400">Principal</div>
                          <div className="text-slate-100 font-medium">
                            {mockDashboardData.borrowerPosition.activeLoan.principal} BOT
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400">Paid</div>
                          <div className="text-slate-100 font-medium">
                            {mockDashboardData.borrowerPosition.activeLoan.amountPaid} BOT
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-slate-400">Due Date</div>
                          <div className="text-slate-100 font-medium">
                            {mockDashboardData.borrowerPosition.activeLoan.dueDate}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400">Staked</div>
                          <div className="text-amber-400 font-medium">
                            {mockDashboardData.borrowerPosition.activeLoan.stakeAmount} BOT
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-700 flex gap-2">
                        <Button fullWidth size="small" onClick={() => onNavigate("loans")}>
                          Manage & Repay
                        </Button>
                        <Button fullWidth size="small" variant="secondary" onClick={() => onNavigate("loans")}>
                          View Lifecycle
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <EmptyState
                  icon={<DocumentIcon />}
                  title="No active loans"
                  description="Request a loan to get started with borrowing"
                  action={{
                    label: "Request Loan",
                    onClick: () => onNavigate("borrower")
                  }}
                />
              )}
            </div>
          </div>

          {/* Pool Health */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-100">Pool Health</h2>
              <Button variant="secondary" size="small" onClick={() => onNavigate("pool")}>
                Explore Pool Transparency →
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-100">
                      {mockDashboardData.poolHealth.totalDeposits}
                    </div>
                    <div className="text-sm text-slate-400 mt-1">Total Deposits (BOT)</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {mockDashboardData.poolHealth.activeLoan}
                    </div>
                    <div className="text-sm text-slate-400 mt-1">Active Loans (BOT)</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">
                      {mockDashboardData.poolHealth.availableLiquidity}
                    </div>
                    <div className="text-sm text-slate-400 mt-1">Available Liquidity (BOT)</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-400">
                      {mockDashboardData.poolHealth.utilizationRate}%
                    </div>
                    <div className="text-sm text-slate-400 mt-1">Utilization Rate</div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg font-semibold text-slate-100">
                        {mockDashboardData.poolHealth.totalSavers}
                      </div>
                      <div className="text-sm text-slate-400">Active Savers</div>
                    </div>
                    <div className="w-12 h-12 bg-emerald-500 bg-opacity-20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg font-semibold text-slate-100">
                        {mockDashboardData.poolHealth.activeBorrowers}
                      </div>
                      <div className="text-sm text-slate-400">Active Borrowers</div>
                    </div>
                    <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 0a1 1 0 100 2h.01a1 1 0 100-2H9zm2 0a1 1 0 100 2h.01a1 1 0 100-2H11z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Links to Reputation & Blockchain Transparency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Card className="border-purple-500/20 bg-slate-900/80">
                <CardContent>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-purple-400 font-semibold mb-1">
                        Financial Reputation
                      </div>
                      <div className="text-base font-bold text-slate-100">
                        Tier 2 · Established Borrower
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        100% On-time track record · 5% collateral discount active
                      </p>
                    </div>
                    <Button variant="secondary" size="small" onClick={() => onNavigate("reputation")}>
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900/80">
                <CardContent>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-1">
                        Blockchain Transparency
                      </div>
                      <div className="text-base font-bold text-slate-100">
                        BOT Chain Network
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Testnet ID: 968 · Mainnet ID: 677 · Verified Solvency Invariants
                      </p>
                    </div>
                    <Button variant="secondary" size="small" onClick={() => onNavigate("transparency")}>
                      Inspect Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Recent Activity</h2>
            <Card>
              <CardContent>
                <div className="space-y-4">
                  {mockDashboardData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex justify-between items-center py-3 border-b border-slate-700 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                          {activity.type === "deposit" && (
                            <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                            </svg>
                          )}
                          {activity.type === "loan_payment" && (
                            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                            </svg>
                          )}
                          {activity.type === "return_distribution" && (
                            <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-100">
                            {activity.type === "deposit" && "Deposit"}
                            {activity.type === "loan_payment" && "Loan Payment"}
                            {activity.type === "return_distribution" && "Return Distribution"}
                          </div>
                          <div className="text-xs text-slate-400">{activity.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-slate-100">
                          {activity.type === "deposit" && "+"}
                          {activity.type === "return_distribution" && "+"}
                          {activity.amount} BOT
                        </div>
                        <Badge variant="success" >
                          {activity.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </NetworkGuard>
  )
}
