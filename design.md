# Loanch

## Mission
Create implementation-ready, token-driven frontend design guidance for Loanch that is optimized for trust, financial clarity, consistency, accessibility, and fast delivery across the web application.

## Brand
- Product/brand: Loanch
- Meaning: Loan + Chain + Launch
- Audience: savers, borrowers, and web3 users
- Product surface: financial web application
- Brand personality: trustworthy, transparent, calm, modern, technical, precise
- Visual direction: clean fintech interface with deep navy foundations, teal surfaces, emerald/mint accents, restrained blue utility color, soft geometry, generous whitespace, and minimal decoration

## Style Foundations
- Visual style: clean, trustworthy, modern, minimal, financial-data-first
- Main font style: `font.family.primary=Plus Jakarta Sans`, `font.family.stack="Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`, `font.size.base=16px`, `font.weight.base=400`, `font.lineHeight.base=24px`

- Typography scale: `font.size.xs=12px`, `font.size.sm=14px`, `font.size.md=16px`, `font.size.lg=18px`, `font.size.xl=20px`, `font.size.2xl=24px`, `font.size.3xl=32px`, `font.size.4xl=40px`
- Color palette: `color.brand.navy=#071524`, `color.brand.teal=#064E46`, `color.brand.emerald=#0FA78F`, `color.brand.mint=#31D0A3`, `color.brand.blue=#3B82F6`, `color.text.primary=#0F172A`, `color.text.secondary=#56636D`, `color.surface.base=#FFFFFF`, `color.surface.subtle=#F7F9FA`, `color.border.muted=#DFE5E8`, `color.text.inverse=#FFFFFF`
- Spacing scale: `space.1=4px`, `space.2=8px`, `space.3=12px`, `space.4=16px`, `space.5=24px`, `space.6=32px`, `space.7=48px`
- Radius/shadow/motion tokens: `radius.sm=8px`, `radius.md=12px`, `radius.lg=16px`, `radius.xl=24px`, `radius.full=9999px` | `motion.duration.fast=160ms`, `motion.duration.normal=220ms`
- Financial numbers should use tabular numerals where supported.
- Layout should prioritize current financial state, primary action, transaction status, supporting metrics, then blockchain metadata.

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Minimum interactive target should be `44x44px`.
- Normal text contrast must be at least `4.5:1`; large text must be at least `3:1`.
- Status must not rely on color alone.
- Important asynchronous states such as transaction submitted, confirmed, or failed must be accessible to screen readers.

## Writing Tone
Concise, calm, factual, confident, implementation-focused.

Financial and transaction copy should avoid hype or promotional language.

Prefer:
- `Deposit`
- `Withdraw`
- `Request loan`
- `Repay loan`
- `Switch to BOT Chain`
- `Deposit confirmed`

Avoid:
- `Proceed`
- `Go`
- `Amazing!`
- `Unlock incredible returns`

## Rules: Do
- Use semantic tokens, not raw hex values, in reusable component guidance.
- Financial values must include both amount and asset/unit.
- Every interactive component must define default, hover, focus-visible, active, disabled, loading, and error states.
- Async components should define loading, empty, success, and error states where relevant.
- Blockchain transaction UI must distinguish wallet approval, transaction submission, confirmation, and failure.
- Wallet and network states must be explicit and actionable.
- Component behavior should specify responsive and long-content handling.
- Interactive components must support keyboard, pointer, and touch behavior.
- Shared primitives should be reused across Saver and Borrower interfaces.
- Important blockchain details should remain available but visually secondary to user-facing financial information.

## Rules: Don't
- Do not use speculative crypto, trading-terminal, or casino-like visual language.
- Do not use excessive neon, glow, gradients, glassmorphism, or heavy shadows.
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing, radius, color, or typography exceptions.
- Do not use ambiguous labels for financial actions.
- Do not communicate transaction success before on-chain confirmation.
- Do not expose raw contract errors as primary user-facing messages when a readable explanation is available.
- Do not use color as the only status indicator.
- Do not hide or truncate critical financial or blockchain data without a way to reveal or copy the full value.
- Do not introduce new product behavior solely for visual purposes.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Reuse Loanch foundations and semantic tokens.
3. Define component anatomy, variants, interactions, and states.
4. Define responsive, loading, empty, error, and long-content behavior.
5. Add testable accessibility requirements.
6. End with a QA checklist.

## Required Output Structure
- Context and goals.
- Design tokens and foundations.
- Component-level rules.
- Responsive and state behavior.
- Accessibility requirements.
- Content and tone standards.
- Anti-patterns.
- QA checklist.

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include default, hover, focus-visible, active, disabled, loading, and error states.
- Include mobile, tablet, and desktop behavior.
- Include long financial values, wallet addresses, transaction hashes, overflow, empty states, and error handling.
- Financial status components should combine text with color and/or icon.
- Wallet addresses should normally use shortened presentation such as `0x72A1…9F32`, while keeping the full address accessible.
- Transaction states should follow: `Idle → Awaiting Wallet → Submitted → Confirming → Confirmed / Failed`.

## Quality Gates
- Every non-negotiable rule must use `must`.
- Every recommendation should use `should`.
- Every accessibility rule must be testable in implementation.
- Financial state must have higher visual priority than decorative elements.
- Existing behavior from `Loanch.md` and `PRD.md` must be preserved.
- Teams should prefer system consistency over local visual exceptions.