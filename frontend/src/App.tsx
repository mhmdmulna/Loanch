import { useState, useEffect, type ReactNode } from 'react'
import { useLenis } from './hooks/useLenis'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowDownRight, ArrowUpRight, Check, ChevronRight, CircleDollarSign, Database, GitBranch, Layers3, LockKeyhole, ShieldCheck, Wallet } from 'lucide-react'
import FaultyTerminal from './components/FaultyTerminal/FaultyTerminal'
import { Navbar } from './components/Navbar/Navbar'
import { TextAnimate } from './components/magicui/text-animate'
import { ShinyButton } from './components/magicui/shiny-button'
import { HoloCard } from './components/ui/holo-card'
import AppExperience from './app/AppExperience'

const HERO_WORDS = [
  'Lend',
  'Borrow',
  'Grow',
  'Fund',
  'Invest',
  'Earn',
  'Build',
  'Finance',
]

const steps = [
  { number: '01', title: 'Savers deposit', description: 'Funds enter a shared lending pool.', icon: Wallet },
  { number: '02', title: 'Funds are allocated', description: 'Eligible borrowers receive loans under set rules.', icon: Layers3 },
  { number: '03', title: 'Borrowers repay', description: 'Repayments flow back through the contract.', icon: ArrowDownRight },
  { number: '04', title: 'Returns are distributed', description: 'Savers receive their share of collected returns.', icon: CircleDollarSign },
]
const benefits = [
  { title: 'Transparent by design', description: 'See how funds move through the pool.', icon: ShieldCheck },
  { title: 'Rules, automated', description: 'Smart contracts manage lending and repayments.', icon: GitBranch },
  { title: 'On-chain accounting', description: 'Key financial activity can be independently checked.', icon: Database },
  { title: 'One shared pool', description: 'Savers deposit; the system allocates eligible loans.', icon: Layers3 },
]

function FooterBrand() {
  return <a className="brand brand--inverse" href="#top" aria-label="Loanch, back to top">
    <img src="/primary.svg" alt="" width={26} height={24} className="brand-logo" />
    <span>loanch<span className="brand-period">.</span></span>
  </a>
}

function Entrance({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion()
  return <motion.div className={className} initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.14 }} transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1], delay }}>{children}</motion.div>
}
const appHref = '/app'

function PrimaryLink({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion()
  return <ShinyButton className={`button button--primary ${className}`} href={appHref} whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }} transition={{ duration: 0.18 }}>{children}<ArrowUpRight size={18} strokeWidth={2} aria-hidden="true" /></ShinyButton>
}

function LandingPage() {
  useLenis()
  const reduceMotion = useReducedMotion()
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % HERO_WORDS.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return <div className="site-shell" id="top">
    <Navbar />

    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-beams" aria-hidden="true">
          <FaultyTerminal
            scale={2}
            gridMul={[2, 1]}
            digitSize={0.8}
            timeScale={0.9}
            pause={Boolean(reduceMotion)}
            scanlineIntensity={1}
            glitchAmount={1}
            flickerAmount={1}
            noiseAmp={1}
            chromaticAberration={0}
            dither={0}
            curvature={0.44}
            tint="#31D0A3"
            mouseReact={true}
            mouseStrength={0.3}
            pageLoadAnimation={false}
            brightness={1}
            dpr={1}
          />
        </div>
        <div className="hero-grid container">
          <div className="hero-content"><Entrance>
            <h1 id="hero-title">
              Save together.
              <br />
              <span className="whitespace-nowrap">
                <span className="inline-block relative">
                  <TextAnimate
                    animation="slideUp"
                    by="word"
                    as="span"
                    className="inline-block"
                    startOnView={false}
                  >
                    {HERO_WORDS[wordIndex]}
                  </TextAnimate>
                </span>{' '}
                with clarity.
              </span>
            </h1>
            <p className="hero-description">Deposits fund a shared pool. Borrower repayments generate returns, with key activity recorded on-chain.</p>
            <div className="hero-actions"><PrimaryLink>Launch App</PrimaryLink></div>
          </Entrance></div>
          <Entrance className="hero-visual" delay={0.1}>
            <div className="flex w-full items-center justify-center p-2">
              <div data-theme="dark" className="w-[440px] max-w-full">
                <HoloCard maxTilt={16} aspect={1.586} label="Loanch Shared Liquidity Pool">
                  <div className="flex items-start justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#31d0a3]">
                      LOANCH
                    </span>
                    <span className="rounded-full border border-[rgba(49,208,163,0.3)] bg-[rgba(49,208,163,0.12)] px-2.5 py-0.5 text-[10px] font-bold text-[#8ce6d0]">
                      ON-CHAIN POOL
                    </span>
                  </div>

                  <div className="my-2">
                    <p className="text-2xl font-bold tracking-tight text-white">
                      Shared Liquidity
                    </p>
                    <p className="mt-1 text-sm text-[#b4c7cb]">
                      Deposits fund borrowers. Repayments return yield, recorded transparently.
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#94a3b8]">
                    <span className="font-mono font-semibold tracking-widest text-[#31d0a3]">POOL #0001</span>
                    <span>Verifiable Rules</span>
                  </div>
                </HoloCard>
              </div>
            </div>
          </Entrance>
        </div></section>

      <section className="section process-section" id="how-it-works" aria-labelledby="process-title"><div className="container">
        <Entrance className="section-heading process-heading"><div><h2 id="process-title">A simple flow.<br />Clear at every step.</h2></div><p>From deposit to distribution, the pool follows predefined rules.</p></Entrance>
        <div className="steps-grid">{steps.map((step, index) => { const Icon = step.icon; return <Entrance className="step" key={step.number} delay={index * 0.06}><div className="step-top"><span>{step.number}</span><Icon size={23} strokeWidth={1.6} aria-hidden="true" /></div><div className="step-rule" aria-hidden="true"><span /></div><h3>{step.title}</h3><p>{step.description}</p></Entrance> })}</div>
      </div></section>

      <section className="section benefits-section" id="benefits" aria-labelledby="benefits-title"><div className="container benefits-layout">
        <Entrance className="benefits-intro"><h2 id="benefits-title">Built for financial clarity.</h2><p>Simple lending, with rules and records you can inspect.</p><a className="inline-link" href="#transparency">Explore transparency <ArrowUpRight size={17} aria-hidden="true" /></a></Entrance>
        <div className="benefits-grid">{benefits.map((benefit, index) => { const Icon = benefit.icon; return <Entrance className="benefit" key={benefit.title} delay={index * 0.05}><span className="benefit-icon"><Icon size={22} strokeWidth={1.7} aria-hidden="true" /></span><h3>{benefit.title}</h3><p>{benefit.description}</p></Entrance> })}</div>
      </div></section>

      <section className="section roles-section" id="for-you" aria-labelledby="roles-title"><div className="container">
        <Entrance className="section-heading roles-heading"><div><h2 id="roles-title">Your role. One shared system.</h2></div><p>Save into the pool or borrow from it.</p></Entrance>
        <div className="roles-grid">
          <Entrance className="role-card role-card--saver"><div className="role-card-top"><span className="role-icon"><Wallet size={25} strokeWidth={1.7} /></span><span className="role-index">01 / SAVER</span></div><h3>Put funds to work.</h3><p>Deposit into the pool and receive a share of returns from borrower repayments.</p><div className="role-card-bottom"><span>Deposit funds <ChevronRight size={17} /> Pool position <ChevronRight size={17} /> Returns</span><ArrowUpRight size={21} /></div></Entrance>
          <Entrance className="role-card role-card--borrower" delay={0.08}><div className="role-card-top"><span className="role-icon"><ArrowUpRight size={25} strokeWidth={1.7} /></span><span className="role-index">02 / BORROWER</span></div><h3>Borrow with clear terms.</h3><p>Apply for a loan, receive funds when eligible, and build a repayment record.</p><div className="role-card-bottom"><span>Request loan <ChevronRight size={17} /> Receive funds <ChevronRight size={17} /> Repay</span><ArrowUpRight size={21} /></div></Entrance>
        </div>
      </div></section>

      <section className="section transparency-section" id="transparency" aria-labelledby="transparency-title"><div className="container transparency-layout">
        <Entrance className="transparency-copy"><h2 id="transparency-title">See the record.<br />Verify the rules.</h2><p>Pool activity, loans, repayments, and distributions are recorded on-chain so key financial activity can be independently verified.</p><div className="privacy-note"><LockKeyhole size={19} strokeWidth={1.7} aria-hidden="true" /><span>Sensitive personal information stays off-chain.</span></div></Entrance>
        <Entrance className="ledger" delay={0.08}><div className="ledger-header"><span><span className="ledger-mark"><Database size={17} /></span> On-chain accounting</span><span className="ledger-label">VERIFIABLE</span></div>
          {[['Deposits', Wallet], ['Pool allocation', Layers3], ['Repayments', ArrowDownRight], ['Return distribution', CircleDollarSign]].map(([label, Icon]) => { const RowIcon = Icon as typeof Wallet; return <div className="ledger-row" key={label as string}><span className="ledger-row-icon"><RowIcon size={17} /></span><span>{label as string}</span><span>Recorded <Check size={15} /></span></div> })}
          <div className="ledger-footer"><span>Important activity, open to inspection.</span><ArrowUpRight size={18} /></div>
        </Entrance>
      </div></section>

      <section className="final-cta" aria-labelledby="cta-title"><div className="container final-cta-inner"><Entrance><h2 id="cta-title">Lending you can follow.</h2><p>Save, borrow, and verify the flow.</p></Entrance><PrimaryLink className="button--light">Launch App</PrimaryLink></div></section>
    </main>

    <footer className="site-footer"><div className="container footer-main"><div><FooterBrand /></div><nav aria-label="Footer navigation"><a href="#how-it-works">How it works</a><a href="#for-you">For you</a><a href="#transparency">Transparency</a></nav><div className="footer-project-links"><a href="https://github.com/zaidunk/Loanch" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15} aria-hidden="true" /></a><a href="https://github.com/zaidunk/Loanch/blob/main/Loanch.md" target="_blank" rel="noreferrer">Project overview <ArrowUpRight size={15} aria-hidden="true" /></a></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Loanch</span><span>Loan · Chain · Launch</span></div></footer>
  </div>
}

function App() {
  const isAppRoute = typeof window !== 'undefined' && /^\/app(?:\/|$)/.test(window.location.pathname)

  return isAppRoute ? <AppExperience /> : <LandingPage />
}

export default App
