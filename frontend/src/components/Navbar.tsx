import { useState } from "react"
import { WalletButton } from "./WalletComponents"
import type { Page } from "../types"

interface NavbarProps {
  currentPage: Page
  onNavigate: (page: Page) => void
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems: { id: Page; label: string; badge?: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "saver", label: "Save" },
    { id: "borrower", label: "Borrow" },
    { id: "loans", label: "Loans" },
    { id: "pool", label: "Pool Transparency" },
    { id: "reputation", label: "Reputation" },
    { id: "transparency", label: "Blockchain" },
  ]

  const handleNavClick = (page: Page) => {
    onNavigate(page)
    setMobileMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--loanch-border)] bg-[var(--loanch-bg)]/95 backdrop-blur">
      <div className="loanch-container">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="flex cursor-pointer items-center gap-3" onClick={() => handleNavClick("landing")}>
            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--loanch-accent)]/40 bg-[var(--loanch-accent)]/10">
              <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-[-0.04em] text-slate-100">Loanch</span>
                <span className="loanch-eyebrow hidden sm:inline text-[9px]">
                  BOT Chain
                </span>
              </div>
              <p className="hidden text-[10px] text-slate-400 sm:block">Loan · Chain · Launch</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-[var(--loanch-surface-raised)] text-[var(--loanch-accent)]"
                      : "text-slate-400 hover:bg-[var(--loanch-surface)] hover:text-slate-100"
                  }`}
                >
                  {item.label}
                  {item.badge && (
                    <span className="ml-1.5 text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Right actions: Wallet & Demo indicator */}
          <div className="hidden sm:flex items-center space-x-3">
            <div className="flex items-center gap-1.5 rounded-md border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] text-amber-300">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
              Demo Mode
            </div>
            <WalletButton size="small" />
          </div>

          {/* Mobile hamburger button */}
          <div className="flex sm:hidden items-center gap-2">
            <WalletButton size="small" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-md border border-[var(--loanch-border)] bg-[var(--loanch-surface)] p-2 text-slate-300 hover:text-slate-100"
              aria-label="Toggle navigation"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="space-y-1 border-b border-[var(--loanch-border)] bg-[var(--loanch-bg)] px-4 pb-4 pt-2 lg:hidden">
          <div className="mb-3 rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-[11px] text-amber-300">
            Demo Mode — Contracts Pending Deployment
          </div>
          {navItems.map((item) => {
            const isActive = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--loanch-surface-raised)] font-semibold text-[var(--loanch-accent)]"
                    : "text-slate-300 hover:bg-[var(--loanch-surface)] hover:text-slate-100"
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      )}
    </nav>
  )
}
