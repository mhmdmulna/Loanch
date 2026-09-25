import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { ShinyButton } from '../magicui/shiny-button'

const appHref = '/app'

const navLinks = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Benefits',     href: '#benefits'     },
  { label: 'For you',      href: '#for-you'      },
  { label: 'Transparency', href: '#transparency' },
]

function BrandMark() {
  return (
    <img src="/primary.svg" alt="" width={24} height={22} className="nb-brand-logo" />
  )
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const reduceMotion = useReducedMotion()

  const close = () => setIsOpen(false)

  return (
    <>
      {/* Skip link — keep above navbar in DOM order */}
      <a className="skip-link" href="#main">Skip to content</a>

      <div className="nb-wrap" role="banner">
        <motion.div
          className="nb-pill"
          initial={reduceMotion ? false : { opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Brand */}
          <a className="nb-brand" href="#top" aria-label="Loanch, back to top">
            <BrandMark />
            <span>loanch<span className="nb-period">.</span></span>
          </a>

          {/* Desktop nav */}
          <nav className="nb-nav" aria-label="Main navigation" id="main-navigation">
            {navLinks.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                className="nb-link"
                initial={reduceMotion ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 + 0.15 }}
                whileHover={reduceMotion ? undefined : { y: -1 }}
              >
                {item.label}
              </motion.a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <ShinyButton
            href={appHref}
            className="nb-cta"
            initial={reduceMotion ? false : { opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.3 }}
            whileHover={reduceMotion ? undefined : { y: -2 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            aria-label="Launch App"
          >
            Launch App
            <ArrowUpRight size={15} strokeWidth={2.2} aria-hidden="true" />
          </ShinyButton>

          {/* Mobile toggle */}
          <motion.button
            className="nb-toggle"
            type="button"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-controls="main-navigation"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(v => !v)}
            whileTap={reduceMotion ? undefined : { scale: 0.9 }}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </motion.button>
        </motion.div>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="nb-mobile"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={reduceMotion ? false : { opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          >
            <motion.button
              className="nb-mobile-close"
              type="button"
              onClick={close}
              aria-label="Close menu"
              whileTap={reduceMotion ? undefined : { scale: 0.9 }}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.18 }}
            >
              <X size={24} />
            </motion.button>

            <nav className="nb-mobile-nav" aria-label="Mobile navigation">
              {navLinks.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  className="nb-mobile-link"
                  onClick={close}
                  initial={reduceMotion ? false : { opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.07 + 0.08 }}
                >
                  {item.label}
                </motion.a>
              ))}

              <ShinyButton
                href={appHref}
                className="nb-mobile-cta"
                onClick={close}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: 16 }}
                transition={{ delay: 0.4 }}
              >
                Launch App
                <ArrowUpRight size={17} aria-hidden="true" />
              </ShinyButton>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
