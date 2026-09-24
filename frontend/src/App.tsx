import { useState } from "react"
import { LandingPage } from "./components/LandingPage"
import { Dashboard } from "./components/Dashboard"
import { SaverPage } from "./pages/SaverPage"
import { BorrowerPage } from "./pages/BorrowerPage"

type Page = "landing" | "dashboard" | "saver" | "borrower"

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("landing")

  const navigate = (page: Page) => {
    setCurrentPage(page)
  }

  // Simple navigation - in a real app, this would use React Router
  switch (currentPage) {
    case "dashboard":
      return <Dashboard onNavigate={navigate} />
    case "saver":
      return <SaverPage onNavigate={navigate} />
    case "borrower":
      return <BorrowerPage onNavigate={navigate} />
    default:
      return <LandingPage onNavigate={navigate} />
  }
}

export default App
