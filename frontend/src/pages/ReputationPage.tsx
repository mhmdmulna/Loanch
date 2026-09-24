import { Card, CardContent, CardHeader } from "../components/Card"
import { Button } from "../components/Button"
import { Badge, CheckIcon } from "../components/Badge"
import { DEMO_REPUTATION, DEMO_REPUTATION_MILESTONES } from "../data/mockData"
import type { Page } from "../types"

interface ReputationPageProps {
  onNavigate: (page: Page) => void
}

export function ReputationPage({ onNavigate }: ReputationPageProps) {
  const profile = DEMO_REPUTATION
  const milestones = DEMO_REPUTATION_MILESTONES

  return (
    <div className="loanch-page loanch-secondary py-8">
      <div className="loanch-container space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-slate-100">Financial Reputation</h1>
              <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
                Phase 10
              </span>
            </div>
            <p className="text-slate-400 mt-1">
              Verifiable track record built strictly from on-time repayment behavior over time.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="small" onClick={() => onNavigate("loans")}>
              View Loans
            </Button>
            <Button size="small" onClick={() => onNavigate("borrower")}>
              Borrow with Reputation
            </Button>
          </div>
        </div>

        {/* Financial Reputation Overview Banner */}
        <Card className="border-purple-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/20">
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-slate-100">{profile.tierName}</span>
                  <Badge variant="success" icon={<CheckIcon />}>
                    Identity Verified
                  </Badge>
                  <span className="text-xs text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded border border-purple-500/20">
                    Tier {profile.tierLevel}
                  </span>
                </div>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Reputation on Loanch is an objective, programmatic record of your loan history on BOT Chain. 
                  It is not an opaque credit bureau score or arbitrary token game—it reflects real contractual obligations 
                  settled on time, unlocking lower collateral requirements and expanded borrowing capacity.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-right min-w-[200px]">
                <div className="text-[11px] text-slate-400 uppercase tracking-wider">Reputation Status</div>
                <div className="text-lg font-bold text-emerald-400 mt-0.5">{profile.scoreLabel}</div>
                <div className="text-xs text-slate-400 mt-1">100% On-Time Record</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Required 5 Key Financial Reputation Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* 1. Completed Loans */}
          <Card className="border-slate-800">
            <CardContent>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Completed Loans</div>
              <div className="text-2xl font-bold text-slate-100 mt-1">
                {profile.completedLoansCount}
              </div>
              <div className="text-[11px] text-emerald-400 mt-1">Settled in full</div>
            </CardContent>
          </Card>

          {/* 2. On-Time Payments */}
          <Card className="border-slate-800">
            <CardContent>
              <div className="text-xs text-slate-400 uppercase tracking-wider">On-Time Payments</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">
                {profile.onTimePaymentsCount}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">100% punctuality rate</div>
            </CardContent>
          </Card>

          {/* 3. Late Payments */}
          <Card className="border-slate-800">
            <CardContent>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Late Payments</div>
              <div className="text-2xl font-bold text-slate-200 mt-1">
                {profile.latePaymentsCount}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Zero defaults recorded</div>
            </CardContent>
          </Card>

          {/* 4. Current Obligations */}
          <Card className="border-slate-800">
            <CardContent>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Current Obligations</div>
              <div className="text-2xl font-bold text-blue-400 mt-1">
                {profile.currentObligations} BOT
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Active in LOAN-001</div>
            </CardContent>
          </Card>

          {/* 5. Total Repaid */}
          <Card className="border-slate-800">
            <CardContent>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Total Repaid</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">
                {profile.totalRepaid} BOT
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Cumulative on-chain</div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits & Rules Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Reputation Benefits */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-slate-800">
              <CardHeader>
                <h2 className="text-base font-semibold text-slate-100">Reputation Benefits</h2>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Required Collateral Stake:</span>
                    <span className="text-amber-400 font-bold">5% of Loan</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Reduced from standard 10% entry tier due to verified track record.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Borrowing Capacity:</span>
                    <span className="text-slate-100 font-bold">Up to 100,000 BOT</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    High-tier limit available based on successful prior loan completion.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Duration Access:</span>
                    <span className="text-blue-400 font-bold">Up to 12 Months</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Longer terms accessible with zero late payment record.
                  </p>
                </div>

                {/* Default & Penalty Rule Notice */}
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-200/90 space-y-1">
                  <span className="font-semibold text-rose-300 block">Smart Contract Default Policy:</span>
                  <p className="text-[11px] leading-relaxed">
                    A default occurs if obligations remain unpaid 7 days after the due date. The smart contract drops reputation by 20 points, slashes stake towards saver principal protection, and restricts new borrowing until debt is rectified.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Architecture Notice */}
            <Card className="border-slate-800">
              <CardContent className="space-y-2 text-xs text-slate-400 leading-relaxed">
                <span className="font-semibold text-slate-200 block text-sm">
                  Privacy-First Reputation
                </span>
                <p>
                  Loanch adheres to the principle: <em>"Publicly verifiable where necessary, private where sensitive."</em>
                </p>
                <p>
                  Identity documents, income statements, and home addresses are never published to the blockchain. Only cryptographic verification attestations and timestamped repayment milestones are permanently recorded.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right: Repayment History Timeline */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-slate-800">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h2 className="text-base font-semibold text-slate-100">Repayment & Trust Milestones</h2>
                  <span className="text-xs text-slate-400">Chronological Evolution</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-6 my-2">
                  {milestones.map((m) => (
                    <div key={m.id} className="relative">
                      {/* Milestone Dot */}
                      <div className="absolute -left-[31px] top-1 w-5 h-5 rounded-full bg-slate-900 border-2 border-purple-500 flex items-center justify-center text-[10px] text-purple-400 font-bold ring-4 ring-slate-950">
                        ✓
                      </div>

                      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                          <span className="text-sm font-semibold text-slate-100">{m.title}</span>
                          <span className="text-xs text-slate-400">{m.date}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{m.description}</p>
                        <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-wider text-slate-400">Reputation Impact:</span>
                          <span className="text-xs font-medium text-emerald-400">{m.impact}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
