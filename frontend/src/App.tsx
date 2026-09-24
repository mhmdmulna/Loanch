import { useState } from "react"
import { Navbar, Footer, LandingPage, Dashboard } from "./components"
import { SaverPage, BorrowerPage, LoansPage, PoolPage, ReputationPage, BlockchainPage } from "./pages"
import type { Page } from "./types"

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("landing")

  const navigate = (page: Page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (currentPage === "landing") {
    return <LandingPage onNavigate={navigate} />
  }

  return (
    <div className="loanch-page flex min-h-screen flex-col text-slate-100">
      <Navbar currentPage={currentPage} onNavigate={navigate} />
      <main className="flex-1">
        {currentPage === "dashboard" && <Dashboard onNavigate={navigate} />}
        {currentPage === "saver" && <SaverPage onNavigate={navigate} />}
        {currentPage === "borrower" && <BorrowerPage onNavigate={navigate} />}
        {currentPage === "loans" && <LoansPage onNavigate={navigate} />}
        {currentPage === "pool" && <PoolPage onNavigate={navigate} />}
        {currentPage === "reputation" && <ReputationPage onNavigate={navigate} />}
        {currentPage === "transparency" && <BlockchainPage onNavigate={navigate} />}
      </main>
      <Footer onNavigate={navigate} />
    </div>
  )
}

export default App
