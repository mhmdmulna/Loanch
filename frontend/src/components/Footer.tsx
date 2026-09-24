import type { Page } from "../types"

interface FooterProps {
  onNavigate: (page: Page) => void
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-[var(--loanch-border)] bg-[var(--loanch-bg)] text-sm text-slate-400">
      <div className="loanch-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-[-0.04em] text-slate-100">Loanch</span>
              <span className="loanch-eyebrow text-[9px]">
                BOT Chain
              </span>
            </div>
            <p className="text-slate-300 font-medium">Save. Borrow. Build trust on-chain.</p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              A programmable financial institution interface where deposits, collateral staking, 
              lending capacity, and repayments are governed transparently by immutable smart contracts.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                BOT Testnet: <code className="text-emerald-400">968</code>
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                BOT Mainnet: <code className="text-blue-400">677</code>
              </span>
            </div>
          </div>

          {/* Core Flows */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Core Products</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate("saver")} className="hover:text-emerald-400 transition-colors">
                  Saver Pool & Deposits
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("borrower")} className="hover:text-emerald-400 transition-colors">
                  Borrow & Stake Request
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("loans")} className="hover:text-emerald-400 transition-colors">
                  Loan Management & Repayments
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("dashboard")} className="hover:text-emerald-400 transition-colors">
                  Financial Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Verification & Trust */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Verification & Trust</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate("pool")} className="hover:text-emerald-400 transition-colors">
                  Pool Transparency & Reserves
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("reputation")} className="hover:text-emerald-400 transition-colors">
                  Financial Reputation Profile
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("transparency")} className="hover:text-emerald-400 transition-colors">
                  Blockchain Contract Details
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("landing")} className="hover:text-emerald-400 transition-colors">
                  Protocol Overview
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div>
            Transparent enough to verify. Simple enough to trust.
          </div>
          <div className="text-center sm:text-right">
            Smart contract financial state authority · Built for BOT Chain
          </div>
        </div>
      </div>
    </footer>
  )
}
