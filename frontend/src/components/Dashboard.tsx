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
    depositAmount: "5,000.00", currentBalance: "5,127.50", accumulatedReturn: "127.50", withdrawableAmount: "5,127.50", apr: 8.5
  },
  borrowerPosition: {
    activeLoan: { id: "LOAN-001", principal: "10,000.00", totalRepayment: "10,800.00", amountPaid: "2,700.00", remainingDebt: "8,100.00", dueDate: "2024-06-15", stakeAmount: "500.00" }
  },
  poolHealth: {
    totalDeposits: "2,450,000", activeLoan: "1,960,000", availableLiquidity: "490,000", reserveFund: "490,000", utilizationRate: 80, totalSavers: 1247, activeBorrowers: 156
  },
  recentActivity: [
    { id: 1, type: "deposit", amount: "1,000.00", date: "2024-02-15", status: "confirmed" },
    { id: 2, type: "loan_payment", amount: "450.00", date: "2024-02-10", status: "confirmed" },
    { id: 3, type: "return_distribution", amount: "32.50", date: "2024-02-01", status: "confirmed" }
  ]
}

interface DashboardProps { onNavigate: (page: Page) => void }

export function Dashboard({ onNavigate }: DashboardProps) {
  const [wallet] = useWallet()

  return (
    <NetworkGuard>
      <div className="loanch-page">
        <header className="border-b border-[var(--loanch-border)] bg-[var(--loanch-surface)]">
          <div className="loanch-container py-7 sm:py-9">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="loanch-eyebrow mb-3">Account overview · Demo environment</div>
                <h1 className="text-3xl font-semibold tracking-[-0.05em] text-slate-100 sm:text-4xl">Dashboard</h1>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">Your saver position, active obligation, and the pool conditions that shape your next action.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <WalletStatus showDetails={false} />
                <span className="rounded-md border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300">Demo data · integration pending</span>
              </div>
            </div>
          </div>
        </header>

        <main className="loanch-container space-y-8 py-8 sm:py-10">
          <section className="loanch-panel overflow-hidden">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
              <div className="border-b border-[var(--loanch-border)] p-5 sm:p-7 lg:border-b-0 lg:border-r">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="loanch-eyebrow mb-2">Wallet context</div>
                    <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-100">Ready to manage your positions</h2>
                    <div className="mt-4"><WalletStatus showDetails={true} /></div>
                  </div>
                  {wallet.isConnected && wallet.balance && (
                    <div className="sm:text-right"><div className="loanch-number text-3xl font-semibold text-slate-100">{parseFloat(wallet.balance).toFixed(4)}</div><div className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">Available BOT</div></div>
                  )}
                </div>
              </div>
              <div className="flex flex-col justify-between bg-[var(--loanch-surface-inset)] p-5 sm:p-7">
                <div><div className="loanch-eyebrow mb-2">Next action</div><p className="max-w-xs text-sm leading-relaxed text-slate-300">Choose whether to add capital to the pool or request funding against verified eligibility and stake.</p></div>
                <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"><Button fullWidth size="medium" onClick={() => onNavigate("saver")}>Start saving</Button><Button fullWidth size="medium" variant="secondary" onClick={() => onNavigate("borrower")}>Request loan</Button></div>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"><div><div className="loanch-eyebrow mb-2">Personal positions</div><h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-100">What you currently control</h2></div><span className="text-xs text-slate-500">Values shown in BOT · demonstration state</span></div>
            <div className="grid gap-5 lg:grid-cols-2">
              <div>{mockDashboardData.saverPosition ? <Card className="h-full"><CardHeader><div className="flex items-center justify-between gap-3"><span>Saver position</span><Badge variant="success">+{mockDashboardData.saverPosition.apr}% APR</Badge></div></CardHeader><CardContent><div className="flex flex-wrap items-end justify-between gap-4"><div><div className="loanch-number text-4xl font-semibold tracking-[-0.06em] text-[var(--loanch-accent)]">{mockDashboardData.saverPosition.currentBalance}</div><div className="mt-1 text-sm text-slate-400">Current balance</div></div><div className="text-left sm:text-right"><div className="loanch-number text-lg text-emerald-300">+{mockDashboardData.saverPosition.accumulatedReturn}</div><div className="text-xs text-slate-500">Accumulated return</div></div></div><dl className="mt-7 grid grid-cols-2 gap-4 border-t border-[var(--loanch-border)] pt-5 text-sm"><div><dt className="text-slate-500">Deposited</dt><dd className="loanch-number mt-1 text-slate-200">{mockDashboardData.saverPosition.depositAmount}</dd></div><div><dt className="text-slate-500">Withdrawable</dt><dd className="loanch-number mt-1 text-slate-200">{mockDashboardData.saverPosition.withdrawableAmount}</dd></div></dl><Button fullWidth size="small" variant="secondary" className="mt-6">Request withdrawal</Button></CardContent></Card> : <EmptyState icon={<PiggyBankIcon />} title="No deposits yet" description="Start saving to earn returns on the Loanch platform" action={{ label: "Deposit Now", onClick: () => onNavigate("saver") }} />}</div>
              <div>{mockDashboardData.borrowerPosition.activeLoan ? <Card className="h-full"><CardHeader><div className="flex items-center justify-between gap-3"><span>Borrower position</span><Badge variant="warning">{mockDashboardData.borrowerPosition.activeLoan.id}</Badge></div></CardHeader><CardContent><div className="flex flex-wrap items-end justify-between gap-4"><div><div className="loanch-number text-4xl font-semibold tracking-[-0.06em] text-sky-300">{mockDashboardData.borrowerPosition.activeLoan.remainingDebt}</div><div className="mt-1 text-sm text-slate-400">Remaining debt</div></div><div className="text-left sm:text-right"><div className="loanch-number text-lg text-slate-200">{mockDashboardData.borrowerPosition.activeLoan.amountPaid}</div><div className="text-xs text-slate-500">Paid to date</div></div></div><dl className="mt-7 grid grid-cols-2 gap-4 border-t border-[var(--loanch-border)] pt-5 text-sm"><div><dt className="text-slate-500">Due date</dt><dd className="mt-1 text-slate-200">{mockDashboardData.borrowerPosition.activeLoan.dueDate}</dd></div><div><dt className="text-slate-500">Stake locked</dt><dd className="loanch-number mt-1 text-amber-300">{mockDashboardData.borrowerPosition.activeLoan.stakeAmount}</dd></div></dl><div className="mt-6 grid gap-2 sm:grid-cols-2"><Button fullWidth size="small" onClick={() => onNavigate("loans")}>Manage & repay</Button><Button fullWidth size="small" variant="secondary" onClick={() => onNavigate("loans")}>View lifecycle</Button></div></CardContent></Card> : <EmptyState icon={<DocumentIcon />} title="No active loans" description="Request a loan to get started with borrowing" action={{ label: "Request Loan", onClick: () => onNavigate("borrower") }} />}</div>
            </div>
          </section>

          <section>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><div className="loanch-eyebrow mb-2">Protocol conditions</div><h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-100">Pool health</h2></div><Button variant="secondary" size="small" onClick={() => onNavigate("pool")}>Explore pool transparency →</Button></div>
            <div className="loanch-panel overflow-hidden"><div className="grid divide-y divide-[var(--loanch-border)] md:grid-cols-4 md:divide-x md:divide-y-0"><div className="p-5"><div className="loanch-eyebrow text-slate-500">Total deposits</div><div className="loanch-number mt-3 text-2xl text-slate-100">{mockDashboardData.poolHealth.totalDeposits}</div><div className="mt-1 text-xs text-slate-500">BOT</div></div><div className="p-5"><div className="loanch-eyebrow text-slate-500">Active loans</div><div className="loanch-number mt-3 text-2xl text-sky-300">{mockDashboardData.poolHealth.activeLoan}</div><div className="mt-1 text-xs text-slate-500">BOT outstanding</div></div><div className="p-5"><div className="loanch-eyebrow text-slate-500">Available liquidity</div><div className="loanch-number mt-3 text-2xl text-emerald-300">{mockDashboardData.poolHealth.availableLiquidity}</div><div className="mt-1 text-xs text-slate-500">BOT ready</div></div><div className="bg-[var(--loanch-surface-inset)] p-5"><div className="loanch-eyebrow text-slate-500">Utilization</div><div className="loanch-number mt-3 text-2xl text-amber-300">{mockDashboardData.poolHealth.utilizationRate}%</div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full bg-amber-300" style={{ width: `${mockDashboardData.poolHealth.utilizationRate}%` }} /></div></div></div><div className="grid border-t border-[var(--loanch-border)] sm:grid-cols-2"><div className="flex items-center justify-between border-b border-[var(--loanch-border)] p-5 sm:border-b-0 sm:border-r"><span className="text-sm text-slate-400">Active savers</span><span className="loanch-number text-lg text-slate-100">{mockDashboardData.poolHealth.totalSavers.toLocaleString()}</span></div><div className="flex items-center justify-between p-5"><span className="text-sm text-slate-400">Active borrowers</span><span className="loanch-number text-lg text-slate-100">{mockDashboardData.poolHealth.activeBorrowers.toLocaleString()}</span></div></div></div>
          </section>

          <section className="grid gap-5 lg:grid-cols-2"><Card><CardContent><div className="loanch-eyebrow mb-2">Financial reputation</div><h3 className="text-lg font-semibold text-slate-100">Tier 2 · Established borrower</h3><p className="mt-2 text-sm leading-relaxed text-slate-400">100% on-time track record · 5% collateral discount active</p><Button variant="secondary" size="small" className="mt-5" onClick={() => onNavigate("reputation")}>View profile</Button></CardContent></Card><Card><CardContent><div className="loanch-eyebrow mb-2">Blockchain transparency</div><h3 className="text-lg font-semibold text-slate-100">BOT Chain network</h3><p className="mt-2 text-sm leading-relaxed text-slate-400">Testnet ID: 968 · Mainnet ID: 677 · Verified solvency invariants</p><Button variant="secondary" size="small" className="mt-5" onClick={() => onNavigate("transparency")}>Inspect details</Button></CardContent></Card></section>

          <section><div className="mb-4 flex items-end justify-between gap-3"><div><div className="loanch-eyebrow mb-2">Ledger view</div><h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-100">Recent activity</h2></div><span className="hidden text-xs text-slate-500 sm:block">Latest recorded events</span></div><Card><CardContent><div className="divide-y divide-[var(--loanch-border)]">{mockDashboardData.recentActivity.map((activity) => <div key={activity.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--loanch-border)] bg-[var(--loanch-surface-inset)] text-sm text-[var(--loanch-accent)]" aria-hidden="true">{activity.type === "deposit" ? "↓" : activity.type === "loan_payment" ? "↗" : "＋"}</div><div><div className="text-sm font-semibold text-slate-100">{activity.type === "deposit" && "Deposit"}{activity.type === "loan_payment" && "Loan payment"}{activity.type === "return_distribution" && "Return distribution"}</div><div className="text-xs text-slate-500">{activity.date}</div></div></div><div className="flex items-center justify-between gap-4 sm:justify-end"><span className="loanch-number text-sm text-slate-200">{activity.type !== "loan_payment" && "+"}{activity.amount} BOT</span><Badge variant="success">{activity.status}</Badge></div></div>)}</div></CardContent></Card></section>
        </main>
      </div>
    </NetworkGuard>
  )
}
