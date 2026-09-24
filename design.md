# LOANCH Logo & Visual Identity

## 1. Brand Context

LOANCH is a blockchain-based financial application for pooled lending. The name comes from **Loan + Chain**, with a secondary association to **launch**: helping users start a financial need, business, education plan, or opportunity through access to programmable credit.

The identity must not look like a generic crypto token, exchange, bank seal, or lending marketplace. LOANCH is closer to a programmable financial institution: users deposit into a shared pool, verified borrowers receive loans under deterministic rules, repayments flow back through smart contracts, and returns are distributed according to transparent accounting.

Primary product sources reviewed:

- `Loanch.md`: product concept, business rules, user roles, lending workflow, reputation, staking, and financial principles.
- `PRD.md`: technical architecture, MVP scope, BOT Chain target, smart contract responsibilities, accounting rules, and frontend requirements.
- Existing implementation and design files: `README.md`, `DESIGN_SYSTEM.md`, `frontend/src/index.css`, `frontend/src/App.tsx`, `frontend/src/components/LandingPage.tsx`, and `frontend/public/favicon.svg`.

The current frontend is a dark-first React/Vite/Tailwind product with emerald primary actions, blue informational states, slate neutrals, and a placeholder purple favicon. The final logo direction should replace the placeholder with a calmer financial technology identity that fits the existing dashboard direction.

## 2. Product Understanding

LOANCH is a **programmable on-chain lending platform**, not a direct peer-to-peer lending marketplace.

Saver behavior:

- Savers deposit assets into a shared loan pool.
- Savers do not manually choose borrowers.
- Deposits create a saver position and potential return claim.
- Withdrawals are possible only when liquidity is sufficient.

Borrower behavior:

- Borrowers must be identity verified.
- Borrowers need risk eligibility and sufficient locked stake.
- A loan request that passes rules is created and disbursed atomically.
- Repayment pays principal first, then margin.
- Completed loans unlock stake and update reputation.

System behavior:

- Smart contracts manage deposits, liquidity reserve, active loans, staking, repayments, returns, and defaults.
- The initial reserve model keeps 20% as liquidity reserve.
- Return distribution starts at 80% saver, 15% platform, 5% loss reserve.
- Default handling uses stake first, then loss reserve, then proportional saver principal haircut.
- Sensitive identity documents stay off-chain; only verification outcomes belong on-chain.

The strongest brand idea is therefore not "blockchain" or "loan" alone. The strongest idea is:

> **A trusted financial flow governed by verifiable rules.**

The logo should express pooled capital moving through a controlled system, then returning through a reliable rule engine.

## 3. Brand Positioning

Traditional Finance ←→ Modern Finance: **75% modern finance**. LOANCH uses smart contracts and wallet interaction, but it still handles serious lending, repayment, liquidity, and default risk.

Institutional ←→ Consumer: **60% institutional, 40% consumer**. The system needs institutional credibility because it manages pooled funds, but the interface must remain accessible to savers and borrowers.

Conservative ←→ Innovative: **35% conservative, 65% innovative**. The product is new-generation financial infrastructure, but it cannot look experimental with user funds.

Technical ←→ Human: **55% technical, 45% human**. The rules are programmable, but the main promise is understandable financial access and trust.

Serious ←→ Playful: **85% serious, 15% personality**. Personality should come from a subtle symbol idea, not from cartoon forms, neon, or novelty.

Complex ←→ Simple: **25% complex, 75% simple**. The system underneath is complex; the brand should make it feel organized and legible.

Centralized ←→ Decentralized: **45% centralized, 55% decentralized**. LOANCH uses trusted admin controls in the MVP for verification and configuration, while financial state and rules are verifiable on-chain.

Brand personality:

- Trustworthy
- Precise
- Modern
- Financial
- Transparent
- Controlled
- Accessible
- Technically credible

Avoid personality traits that are not supported by the product, such as playful, rebellious, anonymous, speculative, or meme-driven.

## 4. Design Philosophy

LOANCH should meet the professional simplicity bar of Stripe, Microsoft product identities, Linear, Ramp, Wise, Revolut, and Coinbase without copying their forms.

Core visual principles:

- Use one clear geometric idea.
- Make the symbol recognizable without the wordmark.
- Communicate movement and rules without literal arrows, coins, chains, blocks, shields, locks, or nodes.
- Keep the mark strong in one color.
- Make the identity feel like software users can trust with financial state.

Design target:

```text
70% professional fintech
20% modern technology
10% distinctive personality
```

The personality should come from the interaction between shapes: a pooled center, a continuous route, and a controlled return path.

## 5. Logo Concept Exploration

### Concept 1: Controlled Capital Loop

Core idea: Capital enters a shared pool, moves through lending, and returns through repayment and distribution.

Product connection: This directly reflects the saver deposit → loan pool → borrower → repayment → smart contract distribution flow in `Loanch.md`.

Visual mechanism: A compact rounded-square symbol containing a continuous loop path. The path bends around a central negative-space pool and subtly forms an abstract `L`.

Memorability: Strong. The loop can be recognized as LOANCH's own financial flow rather than a generic wallet or coin.

Scalability: Strong at favicon and app-icon size because the silhouette is compact and the inner negative space is simple.

Risk: If drawn with arrows, it becomes generic payments. The final version must imply motion through geometry, not arrowheads.

### Concept 2: Pool Axis

Core idea: Multiple saver inputs converge into a single regulated pool, then one loan output emerges.

Product connection: LOANCH pools saver deposits and disburses borrower loans by rules rather than direct matching.

Visual mechanism: Two vertical rounded forms connect into a central horizontal channel. The center gap represents the smart contract rule layer.

Memorability: Medium. It is accurate but may look like a generic infrastructure or database mark.

Scalability: Strong, though it risks being too abstract.

Risk: Could resemble cloud infrastructure or a payment processor if not paired with a distinctive wordmark.

### Concept 3: Verified Rule Gate

Core idea: Borrowing happens only after identity, risk, stake, and liquidity checks pass through a rule gate.

Product connection: Loan eligibility is a central smart contract responsibility in the PRD.

Visual mechanism: A geometric `L` passing through a narrow central aperture, with the aperture representing deterministic checks.

Memorability: Medium. The gate is conceptually strong but may overemphasize borrower approval instead of the whole financial system.

Scalability: Strong in monochrome.

Risk: May look like a security product if the gate becomes shield-like.

### Concept 4: Reputation Ledger

Core idea: Financial history accumulates into a trustworthy visible record.

Product connection: LOANCH tracks repayment history, default penalties, and borrower reputation.

Visual mechanism: Stacked horizontal marks form a subtle `L`, with one continuous line turning upward to represent improved reputation.

Memorability: Medium. It is clean, but repayment history is a supporting feature rather than the primary system idea.

Scalability: Good if limited to three strokes.

Risk: Could look like analytics, accounting software, or a checklist.

### Concept 5: Loan + Chain Wordmark

Core idea: Make the typography carry the identity through a custom `O` or `CH` relationship.

Product connection: The name itself encodes Loan + Chain.

Visual mechanism: A custom `O` contains a small cut or internal link-like counter; `CH` could share a subtle connecting stroke.

Memorability: Medium for the wordmark, weak for a standalone app icon unless paired with a symbol.

Scalability: Wordmark works in navigation and documents; not enough for favicon alone.

Risk: Forced wordplay may compromise legibility or drift into literal chain-link cliche.

### Concept 6: Launch Vector

Core idea: LOANCH helps capital launch productive activity.

Product connection: The name has a secondary "launch" meaning.

Visual mechanism: An upward diagonal cut through an `L` symbol.

Memorability: Medium-high.

Scalability: Strong.

Risk: Too close to startup/rocket/growth language and less specific to pooled smart-contract lending.

## 6. Selected Logo Direction

Final concept: **Controlled Capital Loop**

Use a compact geometric symbol that combines:

- a pooled center,
- a continuous capital route,
- a subtle `L` gesture,
- and a controlled return path.

This direction best represents LOANCH because the product is not simply "loans on-chain." Its distinct mechanism is pooled deposits governed by smart contracts, disbursed to eligible borrowers, then returned and distributed through deterministic accounting.

The symbol should look like a financial flow made simple. It should not show a coin, chain, block, lock, shield, or bank column.

## 7. Symbol Construction

The standalone symbol is called the **Loop L**.

Base grid:

```text
Canvas: 24 x 24 units
Outer symbol bounds: 20 x 20 units
Outer corner radius: 5 units
Stroke / path thickness: 4 units
Internal gap: 3 units minimum
Optical overshoot: 0.25 unit on rounded terminals
```

Construction:

1. Start with a rounded-square optical container occupying x=2 to x=22 and y=2 to y=22. The container is not drawn in the default logo; it defines the app icon safe area.
2. Draw a continuous thick path that begins at the upper-left quadrant, travels right, turns downward on the right side, returns left along the lower third, then turns upward into a short vertical stem. This creates an abstract `L` without literally writing the letter.
3. Preserve a central negative-space pool measuring approximately 7 x 7 units. This space represents shared liquidity and transparency.
4. Use rounded joins with a radius matching half the path thickness.
5. Do not add arrowheads. Direction is implied by the open terminal rhythm and the loop geometry.
6. Keep the top-left and lower-left terminals slightly open, separated by at least 3 units, so the mark does not become a closed chain link.

Recommended shape behavior:

- The top segment represents saver deposits entering the pool.
- The right turn represents smart contract allocation.
- The lower segment represents borrower disbursement and repayment movement.
- The upward inner stem represents returns and reputation rising back into the system.

The mark should be optically balanced, not mathematically overcomplicated. At 16px, the user should see a bold loop-like `L` with a clear center gap.

## 8. Wordmark

The primary wordmark is uppercase:

```text
LOANCH
```

Recommended direction:

- Use a geometric/humanist sans-serif base.
- Prefer **Geist** or **Inter** for product implementation because both are available, readable, and compatible with the existing frontend direction.
- For final brand artwork, customize from a geometric sans base rather than using the raw font unchanged.

Wordmark treatment:

- Use uppercase letters for authority and compactness.
- Use medium-heavy weight, approximately 650-700.
- Keep letter spacing tight but readable: `0.01em` to `0.03em`.
- Use a custom `O` with a very subtle horizontal counter correction so it echoes the symbol's central pool.
- Give the `A` a clean triangular counter; do not remove the crossbar if readability suffers.
- Keep `CH` normal. Do not force a literal chain connection.

Wordmark proportions:

```text
Symbol height: 1.00x
Wordmark cap height: 0.48x symbol height
Gap between symbol and wordmark: 0.38x symbol width
Primary lockup width ratio: symbol 1 : wordmark 3.2-3.6
```

The wordmark should feel stable and financial, while the symbol provides the distinctive idea.

## 9. Color System

Recommended color strategy: **Blue primary with emerald functional accent**.

Reasoning:

- Blue better communicates financial trust, clarity, and infrastructure.
- Emerald should remain in the interface for positive financial activity, verified states, successful transactions, and saver returns.
- This preserves the current frontend's emerald language while giving the core brand a more durable fintech foundation.

Primary brand colors:

```yaml
brand:
  loanch-blue: "#2563EB"
  loanch-blue-hover: "#1D4ED8"
  loanch-navy: "#0B1F33"
  loanch-ink: "#07111F"
  loanch-sky: "#60A5FA"
  loanch-emerald: "#10B981"
  loanch-emerald-deep: "#047857"
```

Neutral system:

```yaml
neutral:
  background-dark: "#020617"
  surface-dark: "#0F172A"
  surface-raised: "#1E293B"
  border-dark: "#334155"
  text-primary-dark: "#F8FAFC"
  text-secondary-dark: "#CBD5E1"
  text-muted-dark: "#94A3B8"
  background-light: "#F8FAFC"
  surface-light: "#FFFFFF"
  border-light: "#E2E8F0"
  text-primary-light: "#0F172A"
  text-secondary-light: "#475569"
```

Semantic colors:

```yaml
semantic:
  success: "#10B981"
  info: "#3B82F6"
  pending: "#F59E0B"
  error: "#EF4444"
  defaulted: "#DC2626"
```

Logo color rules:

- Primary full-color symbol: `#2563EB`.
- Optional accent version: blue symbol with one small terminal or inner segment in `#10B981`, used only at large sizes above 64px.
- Monochrome must be the default for small sizes, legal contexts, and low-color environments.
- Gradients are not required for recognition.

Gradient policy:

- Avoid gradients inside the logo for product UI.
- A subtle brand gradient may be used in marketing backgrounds only: `#2563EB` to `#10B981` at low opacity over navy.
- Never use the current purple favicon palette as a brand color.

## 10. Typography

Logo font direction: **Geist Sans customized** or **Inter customized**.

Product UI font: **Inter**.

Heading font: **Inter** or **Geist Sans**, semibold to bold.

Body font: **Inter**, regular to medium.

Why this fits LOANCH:

- Inter already appears in `frontend/src/index.css`, so it aligns with implementation.
- Geist and Inter both support a clean fintech UI without feeling sci-fi.
- The shapes are neutral enough to let the symbol carry the brand idea.
- Both scale well in dashboards, tables, wallet states, and transaction flows.

Avoid:

- Sci-fi extended fonts.
- Serif fonts.
- Overly rounded consumer banking fonts.
- Decorative blockchain-style type.

## 11. Logo Variants

### Primary Logo

Symbol + `LOANCH` wordmark in a horizontal lockup.

Use in:

- website navigation,
- dashboard header,
- documentation cover,
- investor/demo deck,
- hackathon submission materials.

### Symbol Only

Use the Loop L icon without wordmark.

Use in:

- favicon,
- mobile app icon,
- wallet UI,
- sidebar collapsed state,
- loading state,
- social avatar,
- notification icon.

### Wordmark Only

Use when vertical space is extremely limited but text clarity matters.

Use in:

- footer,
- legal pages,
- narrow documentation headers,
- monochrome print contexts.

### Monochrome

Approved colors:

- Black: `#000000`
- White: `#FFFFFF`
- Navy: `#0B1F33`

Use monochrome whenever color reproduction is unreliable or when the logo sits over complex backgrounds.

### Primary Color

Use `#2563EB` for the symbol and `#0F172A` or `#F8FAFC` for the wordmark depending on background.

### Small Size

For 16-24px, use the symbol only:

- Remove any accent color.
- Increase the central negative-space pool by approximately 0.5 unit.
- Use one solid color.
- Do not use the wordmark.

## 12. Clear Space

Define `X` as the symbol height.

Minimum clear space:

```text
Primary logo: 0.35X on all sides
Symbol only: 0.25X on all sides
Wordmark only: height of the "O" counter on all sides
```

No text, icons, borders, card edges, or UI controls should enter this area.

When used in a navbar, the visual clear space may be built into the logo asset so the mark does not crowd adjacent navigation items.

## 13. Minimum Size

Digital:

```text
Full logo minimum width: 112px
Preferred navbar width: 128-156px
Symbol minimum size: 16px
Preferred favicon/app icon size: 24px and above
Social avatar minimum: 96px
```

Print:

```text
Full logo minimum width: 28mm
Symbol minimum size: 6mm
```

Below these sizes, use the symbol only or plain text `LOANCH`.

## 14. Background Usage

Light backgrounds:

- Use blue symbol `#2563EB`.
- Use navy or slate wordmark `#0F172A`.
- Maintain strong contrast against white or `#F8FAFC`.

Dark backgrounds:

- Use blue symbol `#60A5FA` or white symbol.
- Use white wordmark `#F8FAFC`.
- Use `#2563EB` only when contrast is sufficient.

Brand color backgrounds:

- On blue, use white logo.
- On navy, use white wordmark with `#60A5FA` symbol if color is allowed.
- On emerald, use white logo only; do not combine emerald background with blue symbol.

Neutral UI surfaces:

- On dark cards, use white wordmark and blue symbol.
- On light cards, use navy wordmark and blue symbol.

Photographic backgrounds:

- Use white monochrome logo.
- Place only over calm, low-detail areas.
- Add a dark overlay if contrast is not guaranteed.

Gradient backgrounds:

- Use monochrome white logo.
- Do not place the full-color logo over a gradient.

## 15. Logo Misuse

Do not:

- Stretch, compress, skew, or distort the logo.
- Rotate the symbol.
- Add shadows, glows, bevels, metallic effects, or 3D extrusion.
- Add random gradients to the logo.
- Change brand colors outside the approved palette.
- Add outlines around the mark.
- Place the logo on low-contrast backgrounds.
- Put the symbol inside a coin, hexagon, shield, lock, or chain-link container.
- Use the purple placeholder favicon as a brand direction.
- Modify the wordmark letter spacing arbitrarily.
- Replace the wordmark with a sci-fi or decorative font.
- Add arrowheads to the symbol.
- Use the symbol as a literal loading spinner if rotation makes it look like a generic refresh icon.

## 16. Visual Language

The logo creates a broader visual system based on controlled financial flow.

Core motifs:

- Rounded rectangular pathways.
- Central negative-space pools.
- Split states: reserve, active lending, stake, return.
- Continuous routes that imply movement without arrows.
- Calm blue infrastructure with emerald success accents.

UI expression:

- Pool cards can use a central "pool" metric with surrounding reserve, active loan, and liquidity indicators.
- Flow diagrams should use thick rounded paths instead of thin blockchain-node diagrams.
- Transaction progress can use the same loop language: prepared → wallet signature → submitted → confirmed.
- Borrower eligibility can be shown as rule checkpoints passing through a single gate, not as a security shield.

Marketing expression:

- Hero backgrounds may use oversized, low-opacity Loop L path fragments.
- Use the visual language to show money moving through rules, not speculative crypto energy.
- Avoid cyberpunk glow, coin stacks, and node constellations.

Data visualization:

- Use blue for system state and pool totals.
- Use emerald for positive returns, verified states, completed repayment, and claimable return.
- Use amber for pending transactions, utilization warnings, and grace period.
- Use red only for failed transactions, defaulted loans, and blocked borrower states.

Blockchain visualization:

- Represent smart contract interaction as rule layers and state transitions.
- Show on-chain activity as verifiable steps, not as literal blocks.
- Use transaction hashes and explorer links in restrained secondary text.

## 17. UI Integration

Navigation:

- Use the primary horizontal logo on desktop.
- Use symbol-only on mobile or collapsed sidebar.
- Replace the current plain `Loanch` text in the navbar with the lockup once artwork exists.

Dashboard:

- Use the Loop L icon as the product mark in the sidebar.
- Pool overview should make the "pool, reserve, active loan, available liquidity" structure visually central.
- Cards should remain restrained, using slate surfaces and clear numeric hierarchy.

Saver flow:

- Use emerald accents for deposit success, accumulated return, and claimable return.
- Use blue for pool infrastructure values such as total deposits and available liquidity.

Borrower flow:

- Use blue for loan request, eligibility, disbursement, and repayment infrastructure.
- Use emerald only when identity is verified, loan is completed, or stake is unlocked successfully.
- Use amber for pending wallet signature or pending chain confirmation.

Transaction states:

- The logo should not become the only indicator of state.
- Always pair color with text labels or icons for accessibility.

## 18. Design Tokens

```yaml
colors:
  primary: "#2563EB"
  primary-hover: "#1D4ED8"
  primary-soft: "#DBEAFE"
  primary-on-dark: "#60A5FA"
  secondary: "#0B1F33"
  accent: "#10B981"
  accent-hover: "#047857"
  background: "#020617"
  surface: "#0F172A"
  surface-soft: "#1E293B"
  surface-light: "#FFFFFF"
  text-primary: "#F8FAFC"
  text-secondary: "#CBD5E1"
  text-muted: "#94A3B8"
  text-on-light: "#0F172A"
  border: "#334155"
  border-light: "#E2E8F0"
  success: "#10B981"
  info: "#3B82F6"
  warning: "#F59E0B"
  error: "#EF4444"

typography:
  logo-font: "Geist Sans or Inter, customized"
  body-font: "Inter, ui-sans-serif, system-ui, sans-serif"
  heading-font: "Inter or Geist Sans"
  logo-weight: 700
  heading-weight: 650
  body-weight: 400

geometry:
  logo-grid: "24 units"
  logo-path-thickness: "4 units"
  logo-corner-radius: "5 units outer / 2 units path joins"
  ui-corner-radius: "8px default, 12px for major cards"
  stroke-width: "1px UI borders, 2px focus rings"
  spacing-unit: "4px"
```

## 19. Implementation Guidelines

Logo asset delivery should include:

- `loanch-logo-primary.svg`
- `loanch-logo-primary-dark.svg`
- `loanch-symbol.svg`
- `loanch-symbol-small.svg`
- `loanch-wordmark.svg`
- `loanch-logo-mono-black.svg`
- `loanch-logo-mono-white.svg`
- `favicon.svg`
- `apple-touch-icon.png`

SVG requirements:

- Use simple paths.
- Remove editor metadata.
- Use currentColor where useful for monochrome UI usage.
- Keep the viewBox square for symbol-only assets.
- Avoid embedded raster effects, filters, and gradients in the default logo.

Frontend replacement guidance:

- Replace `frontend/public/favicon.svg` with the final Loop L favicon.
- Replace text-only navbar brand with the primary logo asset.
- Keep `Inter` in `frontend/src/index.css` unless the project explicitly adopts Geist.
- Update the existing emerald-first UI gradually: primary brand can be blue while emerald remains the success/action accent if the current product screens depend on it.

Accessibility:

- Logo images should use `alt="LOANCH"` when linked to home.
- Decorative symbol fragments should use `aria-hidden="true"`.
- Ensure the logo has at least 3:1 contrast as a graphical object and 4.5:1 for wordmark text where applicable.

## 20. Final Creative Direction

Final concept: **Controlled Capital Loop**

Why it represents LOANCH:

LOANCH is built around pooled capital governed by smart contract rules. The selected symbol turns that mechanism into a simple visual idea: capital enters, moves through a controlled route, returns, and remains visible through a central pool.

Symbol meaning:

The Loop L combines a subtle `L`, a central liquidity pool, and a continuous financial route. It is not a literal chain, but it still feels on-chain because it communicates verifiable movement through a rule-based system.

Wordmark direction:

Use uppercase `LOANCH` in a customized geometric sans. Keep it readable, stable, and compact. The name already carries the Loan + Chain idea, so the wordmark should not over-explain it.

Color direction:

Use blue as the primary brand color for trust and infrastructure. Keep emerald as a restrained financial-success accent. Avoid purple, neon, coin-gold, and heavy gradients.

Typography direction:

Use Inter or Geist Sans, with a custom wordmark treatment for final brand artwork. Product UI should remain clean, highly legible, and dashboard-friendly.

Visual personality:

Professional, precise, transparent, and slightly clever. The central negative-space pool gives the mark its distinctiveness without making it playful or decorative.

Why it is memorable:

The symbol has a compact silhouette and a clear internal void. It can stand alone as an app icon while still linking back to LOANCH's core mechanism.

Why it scales:

The mark uses one thick continuous form, no thin line art, no tiny nodes, no gradients, and no literal financial symbols. It remains legible at 16-24px.

Why it fits the product:

The concept comes from LOANCH's actual workflow: pooled saver deposits, smart contract allocation, borrower disbursement, repayment, reserve handling, and return distribution. It communicates complex financial infrastructure made simple.

Final validation:

- [x] Logo concept comes from actual LOANCH functionality.
- [x] `Loanch.md` was read.
- [x] `PRD.md` was read.
- [x] Existing implementation and design files were inspected.
- [x] No unsupported product assumptions were introduced.
- [x] Professional, modern, fintech, trustworthy, and slightly distinctive.
- [x] Avoids generic Web3 imagery.
- [x] Works as symbol, wordmark, full lockup, monochrome, favicon, and app icon.
- [x] Color system, typography, clear space, minimum size, misuse rules, UI integration, and tokens are defined.

Creative checkpoint:

If the word LOANCH disappeared, the symbol should still feel like a deliberate financial technology brand: structured, trustworthy, and based on controlled capital movement. It should still look credible five years from now because it relies on geometry and product meaning rather than blockchain trend language.
