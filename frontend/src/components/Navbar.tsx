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
    <nav className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick("landing")}>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-100">Loanch</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  BOT Chain
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">Loan · Chain · Launch</p>
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
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors relative ${
                    isActive
                      ? "text-emerald-400 bg-slate-800/80 shadow-inner"
                      : "text-slate-300 hover:text-slate-100 hover:bg-slate-900"
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
            <div className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              Demo Mode
            </div>
            <WalletButton size="small" />
          </div>

          {/* Mobile hamburger button */}
          <div className="flex sm:hidden items-center gap-2">
            <WalletButton size="small" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-slate-100 border border-slate-800"
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
        <div className="lg:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-4 space-y-1">
          <div className="mb-3 px-2 py-1 text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-md">
            Demo Mode — Contracts Pending Deployment
          </div>
          {navItems.map((item) => {
            const isActive = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-800 text-emerald-400 font-semibold"
                    : "text-slate-300 hover:bg-slate-900 hover:text-slate-100"
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
