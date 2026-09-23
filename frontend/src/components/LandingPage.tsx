import { Button } from "./Button"
import { Card, CardContent, CardHeader } from "./Card"
import { WalletButton } from "./WalletComponents"

type Page = "landing" | "dashboard" | "saver" | "borrower"

interface LandingPageProps {
  onNavigate: (page: Page) => void
}

const mockPoolData = {
  totalDeposits: "2,450,000",
  activeLoan: "1,960,000", 
  availableLiquidity: "490,000",
  reserveFund: "490,000",
  utilizationRate: 80
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-950">
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="text-xl font-bold text-slate-100">Loanch</div>
              <div className="hidden sm:block text-xs font-semibold uppercase tracking-wide text-emerald-400">
                Loan Chain Launch
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="secondary" size="small" onClick={() => onNavigate("dashboard")}>
                Explore Pool
              </Button>
              <WalletButton size="small" />
            </div>
          </div>
        </div>
      </nav>

      <section className="relative py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-slate-100 mb-6">
            Save. Borrow. Build trust on-chain.
          </h1>
          <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto">
            Loanch is a programmable lending platform where deposits, loans, staking, repayments, 
            and returns are transparently managed by smart contracts on BOT Chain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <WalletButton size="large">Connect Wallet to Start</WalletButton>
            <Button variant="secondary" size="large" onClick={() => onNavigate("dashboard")}>
              Explore Pool Transparency
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">Live Pool Status</h2>
            <p className="text-slate-400">Real-time transparency into the Loanch lending pool</p>
            <div className="mt-2 text-xs text-amber-400 bg-amber-500/10 inline-block px-3 py-1 rounded-full">
              Demo Data - Contract Integration Pending
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">{mockPoolData.totalDeposits}</div>
                  <div className="text-sm text-slate-400 mt-1">Total Deposits (BOT)</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{mockPoolData.activeLoan}</div>
                  <div className="text-sm text-slate-400 mt-1">Active Loans (BOT)</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-100">{mockPoolData.availableLiquidity}</div>
                  <div className="text-sm text-slate-400 mt-1">Available Liquidity (BOT)</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">{mockPoolData.utilizationRate}%</div>
                  <div className="text-sm text-slate-400 mt-1">Utilization Rate</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">How Loanch Works</h2>
            <p className="text-slate-400">A simple, transparent financial flow powered by smart contracts</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-2">1. Savers Deposit</h3>
              <p className="text-slate-400">
                Savers deposit assets into the shared loan pool. Funds are automatically allocated between lending capacity and liquidity reserves.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 0a1 1 0 100 2h.01a1 1 0 100-2H9zm2 0a1 1 0 100 2h.01a1 1 0 100-2H11z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-2">2. Borrowers Stake and Request</h3>
              <p className="text-slate-400">
                Verified borrowers stake collateral and request loans. Smart contracts check eligibility, stake requirements, and available liquidity.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-2">3. Repayment and Returns</h3>
              <p className="text-slate-400">
                Borrowers repay loans with interest. Returns are automatically distributed to savers, platform, and reserves according to predefined rules.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-100 mb-6">For Savers</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-2">Pool-Based Returns</h3>
                    <p className="text-slate-400">No need to choose individual borrowers. Your deposits join a shared pool and earn returns from all loan activity.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-2">Transparent Reserves</h3>
                    <p className="text-slate-400">See exactly how much is in lending vs. liquidity reserves. Withdraw when liquidity is available.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-2">Smart Contract Rules</h3>
                    <p className="text-slate-400">Distribution rules are programmed into smart contracts. No manual intervention in profit sharing.</p>
                  </div>
                </div>
              </div>
            </div>
            <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
              <CardHeader>Save and Earn</CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-emerald-400 mb-2">8.5%</div>
                    <div className="text-sm text-slate-400">Average APY (Demo)</div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Pool Value</span>
                      <span className="text-slate-100">2.45M BOT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Active Savers</span>
                      <span className="text-slate-100">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Available Liquidity</span>
                      <span className="text-emerald-400">490K BOT</span>
                    </div>
                  </div>
                  <Button fullWidth onClick={() => onNavigate("saver")}>Start Saving</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
              <CardHeader>Borrow with Confidence</CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-400 mb-2">12%</div>
                    <div className="text-sm text-slate-400">Competitive Rate (Demo)</div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Min Stake Required</span>
                      <span className="text-slate-100">5% of loan</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Max Loan Amount</span>
                      <span className="text-slate-100">100K BOT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Loan Duration</span>
                      <span className="text-blue-400">1-12 months</span>
                    </div>
                  </div>
                  <Button fullWidth variant="secondary" onClick={() => onNavigate("borrower")}>Request Loan</Button>
                </div>
              </CardContent>
            </Card>
            <div>
              <h2 className="text-3xl font-bold text-slate-100 mb-6">For Borrowers</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-2">Identity and Reputation Based</h3>
                    <p className="text-slate-400">Build your financial reputation through on-time payments. Better history leads to better terms.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-2">Stake-Backed Loans</h3>
                    <p className="text-slate-400">Stake a small percentage of your loan amount as skin in the game. Stake is returned when loan is completed.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-2">Automated Processing</h3>
                    <p className="text-slate-400">Once eligibility is confirmed, loan approval and disbursement are handled by smart contracts automatically.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-xl font-bold text-slate-100 mb-4">Loanch</div>
            <p className="text-slate-400 text-sm mb-8">
              Programmable lending platform powered by smart contracts on BOT Chain.
            </p>
            <p className="text-slate-400 text-sm">Copyright 2024 Loanch. All rights reserved.</p>
            <p className="text-slate-500 text-xs mt-2">Built for BOT Chain hackathon</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
