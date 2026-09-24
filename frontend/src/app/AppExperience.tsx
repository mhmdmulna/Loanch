import { useCallback, useEffect, useState, type MouseEvent, type ReactNode } from 'react'
import {
  ArrowDownLeft, ArrowRight, ArrowUpRight, Check, ChevronRight,
  Copy, ExternalLink, FileText, Landmark, Menu, Network, ShieldCheck, Wallet, X,
} from 'lucide-react'
import { LOANCH_CONTRACT_ADDRESS } from '../contracts/addresses'
import { botChainConfig } from '../contracts/config'
import { expectedChainId, shortAddress, useWallet, type WalletState } from './useWallet'
import './app.css'

type Wallet = ReturnType<typeof useWallet>
type TransactionStage = 'idle' | 'awaiting-wallet' | 'submitted' | 'confirming' | 'confirmed' | 'failed'
type FormKind = 'deposit' | 'withdraw' | 'request' | 'repay'

const nav = [
  { href: '/app', label: 'App Entry' },
  { href: '/app/save', label: 'Save' },
  { href: '/app/borrow', label: 'Borrow' },
  { href: '/app/activity', label: 'Activity' },
  { href: '/app/transparency', label: 'Transparency' },
  { href: '/app/settings', label: 'Settings' },
]

const transactionLabels: Record<TransactionStage, string> = {
  idle: 'Idle',
  'awaiting-wallet': 'Awaiting wallet',
  submitted: 'Submitted',
  confirming: 'Confirming',
  confirmed: 'Confirmed',
  failed: 'Failed',
}

function useAppPath() {
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])
  const navigate = useCallback((href: string) => {
    if (window.location.pathname === href) return
    window.history.pushState(null, '', href)
    setPath(href)
    window.scrollTo(0, 0)
  }, [])
  return { path, navigate }
}

function AppLink({ href, navigate, children, className = '', current }: {
  href: string
  navigate: (href: string) => void
  children: ReactNode
  className?: string
  current?: boolean
}) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    navigate(href)
  }
  return <a href={href} className={className} aria-current={current ? 'page' : undefined} onClick={onClick}>{children}</a>
}

function ActionLink({ href, navigate, children, secondary = false }: {
  href: string
  navigate: (href: string) => void
  children: ReactNode
  secondary?: boolean
}) {
  return <AppLink href={href} navigate={navigate} className={`la-button ${secondary ? 'la-button--secondary' : 'la-button--primary'}`}>
    {children}<ArrowRight size={17} aria-hidden="true" />
  </AppLink>
}

function PageHeader({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return <div className="la-page-heading">
    <div><h1>{title}</h1>{description && <p>{description}</p>}</div>
    {children && <div className="la-page-actions">{children}</div>}
  </div>
}

function Section({ title, description, children, className = '' }: {
  title: string
  description?: string
  children: ReactNode
  className?: string
}) {
  return <section className={`la-section ${className}`} aria-label={title}>
    <div className="la-section-heading"><h2>{title}</h2>{description && <p>{description}</p>}</div>
    {children}
  </section>
}

function Notice({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'warning' | 'success' }) {
  return <div className={`la-notice la-notice--${tone}`} role={tone === 'warning' ? 'status' : undefined}>{children}</div>
}

function EmptyState({ title, description, children }: { title: string; description: string; children?: ReactNode }) {
  return <div className="la-empty">
    <div className="la-empty-mark" aria-hidden="true"><FileText size={26} strokeWidth={1.5} /></div>
    <h3>{title}</h3><p>{description}</p>{children && <div className="la-empty-actions">{children}</div>}
  </div>
}

function DataLine({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return <div className="la-data-line"><span>{label}{hint && <small>{hint}</small>}</span><strong>{value}</strong></div>
}

function UnavailableMetric({ label, detail }: { label: string; detail: string }) {
  return <div className="la-metric"><h3>{label}</h3><strong aria-label={`${label} unavailable`}>—</strong><p>{detail}</p></div>
}

function TransactionStatusTracker({ stage = 'idle' }: { stage?: TransactionStage }) {
  const sequence: TransactionStage[] = ['idle', 'awaiting-wallet', 'submitted', 'confirming', 'confirmed']
  const activeIndex = stage === 'failed' ? 4 : sequence.indexOf(stage)
  return <div className="la-tracker" aria-live="polite">
    <div className="la-tracker-top"><h3>Transaction status</h3><span>{transactionLabels[stage]}</span></div>
    <ol>
      {sequence.map((step, index) => {
        const label = stage === 'failed' && index === 4 ? 'Failed' : transactionLabels[step]
        return <li key={step} className={index < activeIndex ? 'is-complete' : index === activeIndex ? 'is-current' : ''}>
          <span aria-hidden="true">{index < activeIndex ? <Check size={13} /> : index + 1}</span>{label}
        </li>
      })}
    </ol>
    <p>{stage === 'idle' ? 'No transaction has been started.' : stage === 'failed' ? 'The transaction did not complete.' : `Current state: ${transactionLabels[stage]}.`}</p>
  </div>
}

function WalletPanel({ wallet, compact = false }: { wallet: Wallet; compact?: boolean }) {
  const { status, address, chainId, error, hasMetaMask, connect, switchNetwork } = wallet
  const title: Record<WalletState, string> = {
    disconnected: 'Connect MetaMask',
    connecting: 'Waiting for MetaMask',
    connected: 'Wallet connected',
    rejected: 'Connection not completed',
    'wrong-network': 'Network check required',
  }
  const detail: Record<WalletState, string> = {
    disconnected: error || 'Connect your wallet to choose Save or Borrow and view your account.',
    connecting: 'Approve the request in MetaMask, then return to Loanch.',
    connected: 'Your wallet is ready. You can use the same account for saving and borrowing.',
    rejected: error || 'The connection request was rejected. You can try again.',
    'wrong-network': error || 'Switch to the configured BOT Chain network to continue.',
  }

  return <section className={`la-wallet-panel ${compact ? 'la-wallet-panel--compact' : ''}`} aria-label="Wallet and network status">
    <div className="la-wallet-symbol" aria-hidden="true"><Wallet size={23} strokeWidth={1.7} /></div>
    <div className="la-wallet-copy">
      <h2>{title[status]}</h2><p aria-live="polite">{detail[status]}</p>
      {address && <p className="la-wallet-meta">Address: <code title={address}>{shortAddress(address)}</code> <span className="la-sr-only">{address}</span></p>}
      {chainId !== null && <p className="la-wallet-meta">Current chain ID: {chainId.toString()}</p>}
    </div>
    <div className="la-wallet-actions">
      {status === 'wrong-network' && expectedChainId !== null && hasMetaMask
        ? <button className="la-button la-button--primary" type="button" onClick={switchNetwork}>Switch to BOT Chain<ArrowRight size={17} aria-hidden="true" /></button>
        : status === 'connected'
          ? <span className="la-connected-state"><Check size={17} aria-hidden="true" /> Connected</span>
          : hasMetaMask
            ? <button className="la-button la-button--primary" type="button" onClick={connect} disabled={status === 'connecting'}>{status === 'connecting' ? 'Connecting…' : 'Connect MetaMask'}<ArrowRight size={17} aria-hidden="true" /></button>
            : <a className="la-button la-button--primary" href="https://metamask.io/download/" target="_blank" rel="noreferrer">Install MetaMask<ExternalLink size={17} aria-hidden="true" /></a>}
    </div>
  </section>
}

function EntryPage({ wallet, navigate }: { wallet: Wallet; navigate: (href: string) => void }) {
  const ready = wallet.status === 'connected'
  if (!ready) return <>
    <PageHeader title="Connect to Loanch" description="Connect MetaMask and verify the BOT Chain network to enter the app." />
    <WalletPanel wallet={wallet} />
    <p className="la-help-text">After connecting, choose whether to Save or Borrow. The same wallet can do both.</p>
  </>

  return <>
    <PageHeader title="What would you like to do?" description="Choose an action for today. One wallet can save and borrow." />
    <WalletPanel wallet={wallet} />
    <div className="la-choice-grid" aria-label="Choose a financial action">
      <ActionCard title="Save" description="Deposit funds into the loan pool and earn your share of returns." action="Deposit funds" href="/app/save" navigate={navigate} enabled={ready} icon={<ArrowDownLeft size={24} />} />
      <ActionCard title="Borrow" description="Request a loan based on your eligibility and available liquidity." action="Request a loan" href="/app/borrow" navigate={navigate} enabled={ready} icon={<ArrowUpRight size={24} />} />
    </div>
  </>
}

function ActionCard({ title, description, action, href, navigate, enabled, icon }: {
  title: string; description: string; action: string; href: string
  navigate: (href: string) => void; enabled: boolean; icon: ReactNode
}) {
  const inner = <><span className="la-choice-icon" aria-hidden="true">{icon}</span><span className="la-choice-body"><strong>{title}</strong><span>{description}</span></span><span className="la-choice-action">{action}<ArrowRight size={18} aria-hidden="true" /></span></>
  return enabled
    ? <AppLink href={href} navigate={navigate} className="la-choice">{inner}</AppLink>
    : <div className="la-choice la-choice--disabled" aria-disabled="true">{inner}</div>
}

function AccessNote({ wallet }: { wallet: Wallet }) {
  return wallet.status === 'connected' ? null : <WalletPanel wallet={wallet} compact />
}

function SaveDashboard({ wallet, navigate }: { wallet: Wallet; navigate: (href: string) => void }) {
  return <>
    <PageHeader title="Save" description="Your deposit position and the actions available for the shared pool.">
      <ActionLink href="/app/save/deposit" navigate={navigate}>Deposit funds</ActionLink>
      <ActionLink href="/app/save/withdraw" navigate={navigate} secondary>Withdraw</ActionLink>
    </PageHeader>
    <AccessNote wallet={wallet} />
    <div className="la-dashboard-grid">
      <div className="la-feature-panel">
        <h2>Your savings</h2><p>Position data will appear here when the contract read integration is available.</p>
        <div className="la-figure" aria-label="Savings balance unavailable">— <span>pool asset units</span></div>
        <DataLine label="Deposited principal" value="Unavailable" />
        <DataLine label="Accumulated return" value="Unavailable" />
        <DataLine label="Withdrawable amount" value="Unavailable" />
      </div>
      <div className="la-side-panel">
        <h2>Next action</h2><p>Review a deposit or withdrawal. The contract actions are not connected yet, so no funds will move.</p>
        <div className="la-stack-actions">
          <ActionLink href="/app/save/deposit" navigate={navigate}>Prepare deposit</ActionLink>
          <ActionLink href="/app/save/withdraw" navigate={navigate} secondary>Prepare withdrawal</ActionLink>
        </div>
      </div>
    </div>
    <Section title="Pool context" description="Current pool figures require a live contract read.">
      <div className="la-metric-grid"><UnavailableMetric label="Pool liquidity" detail="Live value unavailable" /><UnavailableMetric label="Your pool share" detail="Live value unavailable" /><UnavailableMetric label="Saver weight" detail="Live value unavailable" /></div>
    </Section>
  </>
}

function BorrowDashboard({ wallet, navigate }: { wallet: Wallet; navigate: (href: string) => void }) {
  return <>
    <PageHeader title="Borrow" description="Check your loan status, then prepare a request or repayment.">
      <ActionLink href="/app/borrow/request" navigate={navigate}>Request a loan</ActionLink>
      <ActionLink href="/app/borrow/repay" navigate={navigate} secondary>Repay a loan</ActionLink>
    </PageHeader>
    <AccessNote wallet={wallet} />
    <div className="la-dashboard-grid">
      <div className="la-feature-panel">
        <h2>Your borrowing</h2><p>Loan and repayment data is not connected to a live source yet.</p>
        <div className="la-figure" aria-label="Outstanding debt unavailable">— <span>pool asset units</span></div>
        <DataLine label="Active loan" value="Unavailable" />
        <DataLine label="Amount repaid" value="Unavailable" />
        <DataLine label="Locked stake" value="Unavailable" />
      </div>
      <div className="la-side-panel">
        <h2>Before you request</h2>
        <p>Identity verification, risk eligibility, required stake, loan limit, and pool liquidity must be checked using real sources.</p>
        <ActionLink href="/app/borrow/request" navigate={navigate}>Review requirements</ActionLink>
      </div>
    </div>
    <Section title="Loan history">
      <EmptyState title="Loan data unavailable" description="No live loan source is connected. Existing loans will appear here once the contract read integration is available." />
    </Section>
  </>
}

const formContent: Record<FormKind, { title: string; description: string; label: string; preview: string; blocked: string }> = {
  deposit: {
    title: 'Deposit funds', description: 'Prepare an amount to deposit into the shared loan pool.',
    label: 'Deposit amount', preview: 'Amount to deposit',
    blocked: 'Deposits are unavailable until the pool asset and contract write integration are connected.',
  },
  withdraw: {
    title: 'Withdraw', description: 'Review the amount you want to withdraw from your Saver position.',
    label: 'Withdrawal amount', preview: 'Amount to withdraw',
    blocked: 'Your withdrawable position and available liquidity cannot be verified yet. Withdrawal is unavailable.',
  },
  request: {
    title: 'Request a loan', description: 'Prepare a request. Eligibility and liquidity must be confirmed from live sources.',
    label: 'Requested amount', preview: 'Requested principal',
    blocked: 'Identity, risk, stake, loan limit, and pool liquidity are not connected. Loan requests are unavailable.',
  },
  repay: {
    title: 'Repay a loan', description: 'Repayment requires a real active loan and a verified outstanding amount.',
    label: 'Repayment amount', preview: 'Amount to repay',
    blocked: 'No active loan source is connected. Repayment is unavailable.',
  },
}

function FinancialForm({ kind, wallet, navigate }: { kind: FormKind; wallet: Wallet; navigate: (href: string) => void }) {
  const [amount, setAmount] = useState('')
  const [reviewing, setReviewing] = useState(false)
  const details = formContent[kind]
  const backHref = kind === 'deposit' || kind === 'withdraw' ? '/app/save' : '/app/borrow'
  const amountValid = /^(?:\d+)(?:\.\d+)?$/.test(amount) && /[1-9]/.test(amount)
  const canEnter = wallet.status === 'connected' && (kind === 'deposit' || kind === 'request')

  return <>
    <PageHeader title={details.title} description={details.description}>
      <ActionLink href={backHref} navigate={navigate} secondary>Back to {kind === 'deposit' || kind === 'withdraw' ? 'Save' : 'Borrow'}</ActionLink>
    </PageHeader>
    <AccessNote wallet={wallet} />
    <div className="la-flow-grid">
      <div className="la-form-panel">
        <h2>{reviewing ? 'Review details' : 'Enter amount'}</h2>
        {!reviewing ? <>
          <label className="la-field" htmlFor="loanch-amount"><span>{details.label}</span><span className="la-input-wrap"><input
            id="loanch-amount" type="text" inputMode="decimal" autoComplete="off" value={amount}
            onChange={event => setAmount(event.target.value)} placeholder="0.00"
            disabled={!canEnter} aria-describedby="loanch-amount-hint"
            aria-invalid={amount.length > 0 && !amountValid}
          /><span>asset units</span></span></label>
          <p className="la-field-hint" id="loanch-amount-hint">Enter an amount in the pool asset. Asset details and limits are not available yet.</p>
          {amount.length > 0 && !amountValid && <p className="la-field-error" role="alert">Enter an amount greater than zero.</p>}
          <button className="la-button la-button--primary" type="button" disabled={!canEnter || !amountValid} onClick={() => setReviewing(true)}>Review {kind === 'request' ? 'request' : kind}<ArrowRight size={17} aria-hidden="true" /></button>
        </> : <>
          <div className="la-review"><DataLine label={details.preview} value={`${amount} asset units`} /><DataLine label="From wallet" value={wallet.address ? shortAddress(wallet.address) : 'Unavailable'} /><DataLine label="Network" value={expectedChainId?.toString() ?? 'Not configured'} /><DataLine label="Execution" value="Unavailable" /></div>
          <Notice tone="warning">{details.blocked} No transaction will be sent.</Notice>
          <div className="la-inline-actions"><button className="la-button la-button--secondary" type="button" onClick={() => setReviewing(false)}>Edit amount</button><button className="la-button la-button--primary" type="button" disabled>Confirm {kind}</button></div>
        </>}
      </div>
      <div className="la-flow-aside">
        <Notice tone="warning">{details.blocked}</Notice>
        {kind === 'request' && <div className="la-requirements">
          <h2>Eligibility checks</h2>
          {['Identity verification', 'Risk requirement', 'Available stake', 'Loan limit', 'Pool liquidity'].map(item => <DataLine key={item} label={item} value="Unavailable" />)}
        </div>}
        {(kind === 'withdraw' || kind === 'repay') && <EmptyState title={kind === 'withdraw' ? 'Position unavailable' : 'Active loan unavailable'} description="The amount available for this action must come from a live contract read." />}
        <TransactionStatusTracker />
      </div>
    </div>
  </>
}

function LoanDetail({ id, wallet, navigate }: { id: string; wallet: Wallet; navigate: (href: string) => void }) {
  return <>
    <PageHeader title="Loan detail" description="Loan information is shown only when retrieved from a live source.">
      <ActionLink href="/app/borrow" navigate={navigate} secondary>Back to Borrow</ActionLink>
    </PageHeader>
    <AccessNote wallet={wallet} />
    <Section title="Loan record">
      <DataLine label="Requested loan ID" value={id} />
      <EmptyState title="Loan record unavailable" description="This route is ready for a loan read. No loan status, balance, due date, or repayment has been verified." />
    </Section>
  </>
}

function ActivityPage({ navigate }: { navigate: (href: string) => void }) {
  return <>
    <PageHeader title="Activity" description="Your verified deposits, withdrawals, loans, and repayments will appear here." />
    <Section title="Transaction history">
      <EmptyState title="No transaction source connected" description="Loanch is not reading contract events or account history yet. No transaction has been invented for this list.">
        <ActionLink href="/app" navigate={navigate} secondary>Return to App Entry</ActionLink>
      </EmptyState>
    </Section>
    <Section title="How status is shown" description="A transaction is confirmed only after an on-chain receipt is available.">
      <TransactionStatusTracker />
    </Section>
  </>
}

function TransactionDetail({ hash, navigate }: { hash: string; navigate: (href: string) => void }) {
  const validHash = /^0x[0-9a-fA-F]{64}$/.test(hash)
  return <>
    <PageHeader title="Transaction detail" description="Transaction information must be verified against a live source.">
      <ActionLink href="/app/activity" navigate={navigate} secondary>Back to Activity</ActionLink>
    </PageHeader>
    <Section title="Transaction reference">
      <DataLine label="Hash from URL" value={validHash ? hash : 'Invalid hash'} />
      <Notice tone="warning">{validHash ? 'This hash has not been checked against a blockchain provider. Its action, status, timestamp, and confirmation are unavailable.' : 'A transaction hash must contain 0x followed by 64 hexadecimal characters.'}</Notice>
      <TransactionStatusTracker />
    </Section>
  </>
}

function TransparencyPage() {
  const contractAddress = LOANCH_CONTRACT_ADDRESS?.trim() || ''
  const [copied, setCopied] = useState(false)
  const copyAddress = async () => {
    if (!contractAddress) return
    try {
      await navigator.clipboard.writeText(contractAddress)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }
  return <>
    <PageHeader title="Transparency" description="Pool figures and contract references, presented only when they can be verified." />
    <Section title="Pool overview" description="Live metrics are not available until the frontend is connected to a contract read source.">
      <div className="la-metric-grid la-metric-grid--four">
        <UnavailableMetric label="Pool liquidity" detail="Live value unavailable" />
        <UnavailableMetric label="Total deposited" detail="Live value unavailable" />
        <UnavailableMetric label="Total borrowed" detail="Live value unavailable" />
        <UnavailableMetric label="Repayments collected" detail="Live value unavailable" />
      </div>
    </Section>
    <Section title="Verification">
      <div className="la-verification-grid">
        <div className="la-panel"><h3>Network configuration</h3><DataLine label="Expected chain ID" value={botChainConfig.chainId || 'Not configured'} /><DataLine label="RPC URL" value={botChainConfig.rpcUrl ? 'Configured' : 'Not configured'} /><p>Configuration indicates a target network; it does not prove that contract data has been verified.</p></div>
        <div className="la-panel"><h3>Contract reference</h3>
          <p className="la-contract-address">{contractAddress || 'Not configured'}</p>
          {contractAddress && <button className="la-button la-button--secondary" type="button" onClick={copyAddress}>{copied ? 'Copied' : 'Copy address'}<Copy size={16} aria-hidden="true" /></button>}
          <p>Pool readings and activity references are unavailable until the live contract integration is connected.</p>
        </div>
      </div>
    </Section>
  </>
}

function SettingsPage({ wallet }: { wallet: Wallet }) {
  return <>
    <PageHeader title="Settings" description="Review wallet and network context for this session." />
    <WalletPanel wallet={wallet} />
    <Section title="Connection details">
      <div className="la-panel">
        <DataLine label="Wallet" value={wallet.address || 'Not connected'} />
        <DataLine label="Current chain ID" value={wallet.chainId?.toString() ?? 'Unavailable'} />
        <DataLine label="Expected chain ID" value={expectedChainId?.toString() ?? 'Not configured'} />
        <DataLine label="Contract write actions" value="Not connected" />
      </div>
    </Section>
  </>
}

function NotFoundPage({ navigate }: { navigate: (href: string) => void }) {
  return <><PageHeader title="Page not found" description="This app route does not exist." /><ActionLink href="/app" navigate={navigate}>Go to App Entry</ActionLink></>
}

function AppContent({ path, wallet, navigate }: { path: string; wallet: Wallet; navigate: (href: string) => void }) {
  if (path === '/app' || path === '/app/') return <EntryPage wallet={wallet} navigate={navigate} />
  if ((/^\/app\/save(?:\/|$)/.test(path) || /^\/app\/borrow(?:\/|$)/.test(path)) && wallet.status !== 'connected') return <>
    <PageHeader title="Connect to continue" description="Connect MetaMask and verify the BOT Chain network before choosing a financial action." />
    <WalletPanel wallet={wallet} />
    <div className="la-gate-return"><ActionLink href="/app" navigate={navigate} secondary>Back to App Entry</ActionLink></div>
  </>
  if (path === '/app/save') return <SaveDashboard wallet={wallet} navigate={navigate} />
  if (path === '/app/save/deposit') return <FinancialForm kind="deposit" wallet={wallet} navigate={navigate} />
  if (path === '/app/save/withdraw') return <FinancialForm kind="withdraw" wallet={wallet} navigate={navigate} />
  if (path === '/app/borrow') return <BorrowDashboard wallet={wallet} navigate={navigate} />
  if (path === '/app/borrow/request') return <FinancialForm kind="request" wallet={wallet} navigate={navigate} />
  if (path === '/app/borrow/repay') return <FinancialForm kind="repay" wallet={wallet} navigate={navigate} />
  if (/^\/app\/borrow\/loan\/[^/]+$/.test(path)) return <LoanDetail id={path.slice('/app/borrow/loan/'.length)} wallet={wallet} navigate={navigate} />
  if (path === '/app/activity') return <ActivityPage navigate={navigate} />
  if (/^\/app\/transactions\/[^/]+$/.test(path)) return <TransactionDetail hash={path.slice('/app/transactions/'.length)} navigate={navigate} />
  if (path === '/app/transparency') return <TransparencyPage />
  if (path === '/app/settings') return <SettingsPage wallet={wallet} />
  return <NotFoundPage navigate={navigate} />
}

function AppExperience() {
  const wallet = useWallet()
  const { path, navigate } = useAppPath()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigateAndClose = (href: string) => {
    setMobileOpen(false)
    navigate(href)
  }
  const activeNav = path.startsWith('/app/save') ? '/app/save'
    : path.startsWith('/app/borrow') ? '/app/borrow'
      : path.startsWith('/app/activity') || path.startsWith('/app/transactions/') ? '/app/activity'
        : path.startsWith('/app/transparency') ? '/app/transparency'
          : path.startsWith('/app/settings') ? '/app/settings' : '/app'

  return <div className="loanch-app">
    <a className="la-skip" href="#app-main">Skip to content</a>
    <div className="la-shell">
      <aside className={`la-sidebar ${mobileOpen ? 'la-sidebar--open' : ''}`} aria-label="App navigation">
        <a className="la-logo" href="/" aria-label="Loanch home"><span className="la-logo-mark" aria-hidden="true"><span /><span /><span /></span>loanch<span>.</span></a>
        <nav aria-label="App pages">
          {nav.map(item => <AppLink key={item.href} href={item.href} navigate={navigateAndClose} current={activeNav === item.href} className="la-nav-link">{item.label}<ChevronRight size={16} aria-hidden="true" /></AppLink>)}
        </nav>
        <div className="la-sidebar-foot"><ShieldCheck size={18} aria-hidden="true" /><span>Financial activity requires on-chain verification.</span></div>
      </aside>
      <div className="la-main-column">
        <header className="la-topbar">
          <button className="la-menu-button" type="button" aria-label={mobileOpen ? 'Close app menu' : 'Open app menu'} aria-expanded={mobileOpen} onClick={() => setMobileOpen(value => !value)}>{mobileOpen ? <X size={22} /> : <Menu size={22} />}</button>
          <span className="la-topbar-title"><Landmark size={18} aria-hidden="true" /> Loanch app</span>
          <AppLink href="/app/settings" navigate={navigateAndClose} className="la-topbar-wallet">
            <span className={`la-status-dot la-status-dot--${wallet.status}`} aria-hidden="true" />
            <span>{wallet.address ? shortAddress(wallet.address) : wallet.status === 'connecting' ? 'Connecting' : 'Connect wallet'}</span>
          </AppLink>
        </header>
        <main className="la-main" id="app-main"><AppContent path={path} wallet={wallet} navigate={navigateAndClose} /></main>
        <footer className="la-footer"><span>Loanch · Loan, Chain, Launch</span><span><Network size={15} aria-hidden="true" /> {wallet.status === 'connected' ? 'Network verified' : 'Network not verified'}</span></footer>
      </div>
    </div>
  </div>
}

export default AppExperience

