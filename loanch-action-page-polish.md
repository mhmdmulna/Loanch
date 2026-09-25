# Loanch — "What Would You Like To Do?" Page Polish Brief

## 1. Scope (Read First)

- **Target:** exactly ONE page — the post-wallet-connect action selection screen ("What would you like to do?") shown after the user clicks **Launch App** and connects MetaMask.
- **Do NOT** touch, restructure, or restyle any other page, route, or flow.
- **Desktop-only.** Do not add, adjust, or worry about mobile/tablet/responsive breakpoints in this pass. Design and implement for standard desktop viewport widths only.
- **Do NOT add "eyebrow text"** (small label/kicker text above headings) anywhere on this page.
- **Do NOT massively reposition components.** Keep the existing layout structure and component placement as-is by default.
  - The ONLY exception: if a button, card, or section currently violates standard UI/UX layout conventions (e.g. broken visual hierarchy, misaligned CTA, poor grouping, inconsistent spacing rhythm), you may adjust *that specific element's* position/alignment to fix it. Justify the change in a one-line comment in your PR/commit before doing it.
- This is a **visual design pass**, not a feature/behavior pass. Do not add, remove, or change any product functionality, routes, states, or logic. No new user-facing behavior may be introduced for visual purposes (per `Loanch.md` rule).

## 2. Mission for This Task

Restate intent: elevate the visual design of the action-selection page from a plain/monotonous card grid into a refined, minimal-but-alive fintech interface — using Loanch's own design tokens (from `design.md` / `Loanch.md` in this repo) — while borrowing *compositional/creative techniques* (not colors, not branding) from the reference screenshots provided separately.

## 3. What To Take From The Reference Screenshots

Only borrow **technique and mood**, not literal styling, colors, or copy:

- Subtle edge light reflections on card corners/edges (soft glow bleeding from a card's top or side edge, low-opacity, no neon).
- Soft ambient background glow/gradient blobs behind key sections — very restrained, low-saturation, never distracting from content.
- Numbered/step indicator badges with soft depth (subtle shadow or ring, not flat).
- Gentle micro-motifs: small accent glyphs (e.g. a tiny sparkle/dot) used sparingly as visual punctuation — optional, only if it doesn't clutter.
- Cards with quiet depth: soft shadow or 1px border + very subtle inner highlight, not glassmorphism, not heavy drop shadows.
- Clear visual hierarchy: primary action stands out (size, weight, or accent background) while secondary actions stay calm/neutral.

**Explicitly do NOT import:** neon/glow overload, gradients as primary background, glassmorphism, drop shadows that are heavy/dark, casino/trading-terminal aesthetics, bright saturated greens as base backgrounds (that's the reference's brand, not Loanch's).

## 4. Loanch Design System — Must Use

Read `design.md` (or `Loanch.md`) in the project folder first and use its tokens exactly. Do not invent new hex values, spacing, or radii. Summary of the palette/system to apply here:

- **Typography:** `Plus Jakarta Sans` family, base 16px/24px line-height. Use the defined type scale (`xs` 12px → `4xl` 40px) for hierarchy — headline for the page question, medium weight for card titles, secondary weight/color for card descriptions.
- **Color:**
  - Base surfaces: `color.surface.base` (#FFFFFF) and `color.surface.subtle` (#F7F9FA)
  - Foundation depth/accent: `color.brand.navy` (#071524), `color.brand.teal` (#064E46) — use these for any dark accent zones, ambient glow tints, or icon containers, not as full-bleed backgrounds unless the page is intentionally dark-mode.
  - Primary interactive accent: `color.brand.emerald` (#0FA78F) for primary actions/highlighted state.
  - Secondary/positive accent: `color.brand.mint` (#31D0A3) used sparingly (icon fills, hover glows, active indicators) — not as large flat fills.
  - Utility accent: `color.brand.blue` (#3B82F6) reserved for informational/utility elements only (links, info icons), not decoration.
  - Text: `color.text.primary` (#0F172A) for headings/body, `color.text.secondary` (#56636D) for supporting copy, `color.text.inverse` (#FFFFFF) on dark surfaces.
  - Borders: `color.border.muted` (#DFE5E8) for card outlines and dividers.
- **Spacing:** use the `space` scale (4/8/12/16/24/32/48px) exclusively — no arbitrary padding/margin values.
- **Radius:** `radius.md` (12px) or `radius.lg` (16px) for cards; `radius.full` for pill buttons/badges; `radius.sm` (8px) for small inline elements. No sharp corners on interactive surfaces.
- **Motion:** `motion.duration.fast` (160ms) for hover/focus micro-interactions, `motion.duration.normal` (220ms) for larger state transitions (card hover lift, active state change). Keep all motion subtle — no bouncy/playful easing, this is a financial product.
- **Numerals:** any numeric values shown on this page (if any figures appear) must use tabular numerals.

Use semantic token names in code/comments where the codebase supports them — never hardcode raw hex values directly in component styles if a semantic token already exists for that purpose.

## 5. Page-Specific Design Direction

### 5.1 Overall Composition
- Keep the existing structure: a central prompt/question + a set of action cards (e.g. "Save", "Borrow", or whatever the current options are) + wallet/network status context if currently present.
- Background: use `color.surface.subtle` or a very restrained navy-tinted ambient glow (radial gradient using `color.brand.navy`/`color.brand.teal` at very low opacity, e.g. 4–8%) positioned behind the card cluster — never covering full viewport at strength.
- Maintain generous whitespace per brand foundations — do not compress spacing to fit more visual elements.

### 5.2 Action Cards
- Each card should read as a distinct, tappable decision surface:
  - Base: `color.surface.base` fill, `color.border.muted` 1px border, `radius.lg`.
  - Subtle top-edge or corner light reflection: a soft linear/radial highlight (white or `color.brand.mint` at ~6–10% opacity) positioned at one corner, mimicking the reference's light-catch effect — must stay understated.
  - Icon or symbol container: small rounded square/circle using a muted tint of `color.brand.emerald` or `color.brand.teal` as background, icon in solid brand color.
  - Title: `font.size.lg` or `xl`, `color.text.primary`, medium/semibold weight.
  - Supporting description: `font.size.sm`, `color.text.secondary`, concise, factual (no hype language — follow Loanch tone rules: no "Amazing!", no "Unlock incredible returns").
  - Do NOT add eyebrow text above the card title.

### 5.3 States (must all be defined, per Loanch component rules)
For every interactive card/button on this page, define:
- **Default**
- **Hover:** slight lift (subtle `transform: translateY(-2px)` or shadow increase), border color shifts toward `color.brand.emerald`, transition at `motion.duration.fast`.
- **Focus-visible:** clear visible focus ring (2px, `color.brand.blue` or `color.brand.emerald`, sufficient contrast) — required for keyboard navigation, non-negotiable per accessibility rules.
- **Active/pressed:** slight scale-down or deepened accent tone.
- **Disabled** (if applicable to any option, e.g. an action unavailable on current network): reduced opacity, no hover/active response, `cursor: not-allowed`, and disabled state must be communicated with more than color alone (e.g. a small lock icon or "Unavailable" label).
- **Loading** (if selecting an action triggers an async step before navigation): inline spinner or skeleton state on that specific card, not a full-page blocker unless that's already the existing behavior.

### 5.4 Wallet / Network Context (if present on this page)
- If the connected wallet address or network is shown here, follow existing Loanch rules: shortened address format (`0x72A1…9F32`) with full value accessible via copy/reveal.
- Wallet/network state must remain visually secondary to the primary decision (the action cards), per the layout priority rule: current financial state/primary action > supporting metadata > blockchain metadata.

## 6. Accessibility (Non-Negotiable, WCAG 2.2 AA)
- Normal text contrast ≥ 4.5:1, large text ≥ 3:1 — verify against actual token combinations used, don't assume.
- Minimum interactive target size 44×44px for every card/button.
- Keyboard-first: all cards must be reachable and actionable via Tab/Enter/Space, with visible focus-visible states as defined above.
- No status or state communicated by color alone.

## 7. Explicit Don'ts (carried from Loanch.md, reinforced for this task)
- No speculative crypto/trading-terminal/casino visual language.
- No excessive neon, glow, gradients, glassmorphism, or heavy shadows.
- No low-contrast text or hidden focus indicators.
- No one-off spacing, radius, color, or typography values outside the defined tokens.
- No ambiguous action labels (use direct verbs consistent with existing Loanch copy style, e.g. "Deposit", "Request loan" — not "Go", "Proceed").
- No new product behavior introduced solely for visual purposes.
- No eyebrow text anywhere on this page.
- No mobile/tablet-specific work in this pass.

## 8. Workflow For The AI Agent
1. Restate in one sentence what you understand the design intent to be for this specific page before starting.
2. Read `design.md`/`Loanch.md` tokens fully before writing any styles.
3. Identify current card/button components used on this page and their existing anatomy.
4. Apply visual refinements described in Section 5 using only the tokens from Section 4.
5. Define and implement all required interaction states (Section 5.3).
6. Verify accessibility requirements (Section 6) against actual rendered contrast/target sizes.
7. Do a final pass to confirm: no eyebrow text added, no component moved unless it fixed a genuine UX-standard violation (and that reasoning is documented), no mobile-specific styles added, no new functionality introduced.
8. Summarize changes made in a short changelog at the end of your work (what visual elements were added/adjusted and why).

## 9. Definition of Done
- Page visually matches the *creative direction* (subtle light reflects, quiet depth, restrained ambient glow, clear hierarchy) shown in the reference, expressed entirely through Loanch's own palette and tokens.
- All interactive elements have complete state coverage (default/hover/focus-visible/active/disabled/loading where relevant).
- Page passes WCAG 2.2 AA contrast and keyboard accessibility checks.
- No eyebrow text present.
- No component relocated except where a documented UX-standard violation justified it.
- No mobile/tablet styling included.
- No functional/behavioral changes to the app.
