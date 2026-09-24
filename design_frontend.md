# LOANCH Frontend Redesign Specification

## Purpose

Redesign the LOANCH frontend so it feels authored, precise, premium, and product-specific rather than AI-generated, template-like, or assembled from unrelated trendy components.

This document governs visual, UI, UX, layout, component, interaction, motion, and presentation work only. The existing product behavior must remain intact.

## Absolute non-goals and invariants

Do not change any of the following:

- Smart-contract logic, transaction construction, contract addresses, ABI usage, chain configuration, or contract interaction behavior.
- Wallet connection, account detection, network switching, signing, transaction submission, transaction status, disconnect, or error behavior.
- API endpoints, request/response shapes, data fetching, caching, polling, validation, error semantics, or backend assumptions.
- State-management architecture, domain logic, business rules, calculations, permissions, or authentication behavior.
- Routing behavior, URL structure, route guards, loading semantics, or existing functional flows.
- User-visible functionality. A control may be visually redesigned, but it must still perform the same action with the same inputs and outputs.

State-management changes are allowed only when they are strictly presentational, such as a local open/closed state for a redesigned panel, and must not affect domain state or data flow.

If a visual improvement appears to require a logic change, stop and document the conflict instead of silently changing behavior.

## Required first step: understand the existing frontend

Before modifying anything, inspect the repository and produce an inventory of:

1. Routes and pages.
2. Shared layouts, shells, navigation, headers, footers, providers, and page-level composition.
3. Existing components and their responsibilities.
4. Existing design tokens, CSS, Tailwind configuration, theme variables, fonts, colors, borders, radii, shadows, and breakpoints.
5. All interactive states: default, hover, focus, active, disabled, loading, empty, error, connected wallet, disconnected wallet, pending transaction, success, rejected transaction, and mobile states.
6. Data boundaries and event handlers that must not be disturbed.
7. Existing dependencies and reusable components that should be retained.
8. Current responsive behavior and accessibility behavior.

The audit must explicitly identify AI-slop symptoms, including generic hero copy, excessive gradients, random glows, identical rounded cards, decorative animation without meaning, excessive glassmorphism, weak hierarchy, default typography, arbitrary spacing, overuse of purple/blue crypto conventions, duplicated components, low-information dashboards, and motion that competes with the product.

Capture screenshots or equivalent visual evidence at desktop, tablet, and mobile widths before redesigning. Treat the current implementation as the source of truth for behavior, not as a source of truth for visual quality.

## Recommended implementation stack

Use the existing project stack where possible. The preferred visual implementation stack is:

- React + TypeScript + Vite as the application foundation.
- Tailwind CSS for layout and styling, with a deliberate token layer rather than scattered one-off values.
- shadcn/ui primitives for accessible foundations such as Dialog, DropdownMenu, Tabs, Tooltip, Sheet, Toast, Button, Input, and DataTable patterns.
- Motion for React for purposeful transitions, layout changes, shared-element transitions, and interaction feedback.
- React Bits, Aceternity UI, Motion Primitives, and Magic UI only as pattern/source libraries when a specific interaction or visual technique is needed.
- Three.js and React Three Fiber only for a justified product visualization, not as ambient decoration.
- Existing icon and chart libraries when already present and consistent with the product.

These external libraries are not the design system. They are reference material and implementation primitives. Adapt their code, spacing, colors, motion, and composition into LOANCH’s own visual language. Do not paste a library demo into the product unchanged. Do not add a dependency merely because it is popular.

Prefer the smallest dependency set that produces the required result. Before adding a package, confirm that the same result cannot be achieved with existing components, CSS, SVG, Motion, or a small local component.

## Design direction: LOANCH

LOANCH should communicate programmable on-chain lending: controlled, transparent, exact, composable, and technically credible.

The interface should feel like a financial instrument and an engineering product, not a speculative crypto landing page. Visual confidence should come from structure, typography, information design, and meaningful states—not from visual noise.

### Core visual principles

- Product-specific over fashionable.
- Calm precision over spectacle.
- Information hierarchy over decoration.
- Distinctive composition over generic card grids.
- Functional motion over attention-seeking motion.
- High signal-to-noise ratio.
- Strong contrast and legibility.
- Repetition with controlled variation.
- Every visual element must support comprehension, trust, orientation, or action.

### Anti-patterns to reject

- Hero sections made only from a headline, gradient blob, and two buttons.
- Purple/blue neon gradients used as the default identity.
- Excessive `rounded-2xl` cards with identical padding and shadows.
- Glassmorphism used on every surface.
- Floating particles, cursor trails, marquees, or infinite loops without product meaning.
- Random 3D objects unrelated to lending, collateral, rates, positions, or policy.
- Six different animation styles on one page.
- Copy that could belong to any Web3 protocol.
- Overloaded dashboards where all values have equal emphasis.
- Components selected from libraries without adapting their visual language.
- Motion that delays access to primary actions or obscures transaction state.

## Design tokens and visual foundations

Create or consolidate a small, named token system before restyling every page. Keep tokens in the project’s existing Tailwind/theme mechanism. If the project uses Tailwind v4, prefer theme variables for values that should generate utilities; use regular CSS variables for implementation-only values.

### Color

Define semantic tokens instead of scattering raw hex values:

- `background`, `surface`, `surface-raised`, `surface-inset`.
- `text-primary`, `text-secondary`, `text-muted`, `text-inverse`.
- `border-subtle`, `border-default`, `border-strong`.
- `accent-primary`, `accent-secondary`, `accent-soft`.
- `success`, `warning`, `danger`, `info`.
- Transaction-specific states such as `pending`, `confirmed`, `rejected`, and `unavailable`.

Use a restrained base palette and one recognisable LOANCH accent. Reserve accent and status colors for meaning. Never use color alone to communicate state.

### Typography

Choose a distinctive, highly legible type system with a clear role for display text, body text, labels, figures, and technical metadata. Avoid using the same weight and size for every element.

- Display: controlled, confident, and compact.
- Body: readable at normal product density.
- Numeric values: use tabular or stable numeral treatment where appropriate.
- Technical metadata: use a restrained mono or compact sans treatment only when it improves scanning.
- Labels: short, clear, and never tiny by default.

Define a type scale, line-height scale, maximum measure, and text hierarchy. Do not fix poor hierarchy by simply increasing font size.

### Spacing and grid

Define a consistent spacing scale and page container. Use a strong editorial grid with intentional asymmetry where it improves hierarchy. Establish rules for:

- Maximum content width.
- Desktop and mobile gutters.
- Section spacing.
- Card and panel internal padding.
- Grid columns and gaps.
- Alignment anchors.
- Dense data areas versus explanatory areas.

Avoid making every section a centered stack of equal-width cards.

### Surfaces, borders, and depth

Use depth sparingly. Prefer contrast, alignment, and border treatment over heavy shadows. A surface should have a reason to exist: grouping, emphasis, state isolation, or action context.

Use a limited radius vocabulary. Not every element needs to be pill-shaped or heavily rounded. Use sharper geometry for data and protocol surfaces when it reinforces precision.

## Page and product hierarchy

Map every existing route into a page hierarchy before changing layout. For each page, identify:

1. Primary user goal.
2. Primary action.
3. Most important value or state.
4. Supporting information.
5. Secondary actions.
6. Recovery, loading, empty, and error paths.

The top of a page should answer what this page is, what is currently happening, and what the user can do next. A dashboard should prioritise position, health, risk, rates, and next action—not merely display a collection of widgets.

Use visual grouping to show relationships. Use progressive disclosure for advanced protocol information. Keep transaction and wallet states visible enough to preserve trust, but do not let status chrome overwhelm the task.

## Component architecture

Preserve existing component contracts and event handlers wherever possible. Prefer composition over duplication.

Organise visual work into layers:

- Tokens and theme primitives.
- Accessibility-ready shadcn/ui primitives.
- LOANCH primitives such as `ProtocolMark`, `Metric`, `StatusBadge`, `ActionButton`, `WalletStatus`, `RateDisplay`, and `DataRow`.
- Composed product components such as position summaries, lending panels, collateral breakdowns, transaction timelines, and risk indicators.
- Page layouts and route-specific composition.

Inspect existing components before creating new ones. If an existing component already owns the required behavior, restyle or compose it instead of creating a duplicate with a similar name. Keep presentational wrappers thin and pass content and behavior through props/children. Preserve stable component positions where state continuity matters.

Do not move domain logic into visual components. Do not create fake data to make a redesign look complete. Use the real existing data and states.

## Motion system

Motion must explain a relationship or provide feedback:

- Page entry: restrained opacity and short position transitions.
- Section reveal: stagger only when it improves reading order.
- Hover/focus: subtle color, border, or elevation response.
- Tabs and filters: shared indicators or layout transitions when they clarify continuity.
- Panels and dialogs: clear open/close transitions that preserve orientation.
- Data refresh: avoid dramatic re-animation; use restrained change indication.
- Transaction states: communicate pending, confirmed, rejected, and unavailable states clearly.

Use a small set of durations and easing curves. Avoid perpetual motion unless it represents live protocol activity and can be paused. Do not animate essential content in a way that delays interaction.

Respect reduced motion. Configure Motion so user preferences disable transform-heavy and layout-heavy animation while preserving useful opacity or color feedback. Avoid autoplaying video, parallax, and large-element movement for reduced-motion users.

## Product visualisations

Use visualisation only when it makes protocol information easier to understand. Good candidates include:

- A collateral or position composition view.
- A rate or health trend with real data.
- A transaction lifecycle timeline.
- A compact protocol flow showing deposit, borrow, repay, and withdrawal relationships.
- A spatial metaphor for composability that has direct product meaning.

Prefer accessible SVG, HTML, or existing chart primitives for data. Use Canvas/WebGL/React Three Fiber only when the visual cannot be communicated clearly with simpler primitives. Provide a static, readable fallback and never make a 3D scene the only way to access information.

## Iconography and assets

Use one coherent icon family with consistent stroke weight and optical size. Do not mix random icon sets. Icons must support labels, not replace them for ambiguous actions.

Prefer authentic LOANCH assets: logo variants, protocol marks, chain marks, real product diagrams, and purposeful illustrations. If an asset is missing, create a simple, product-specific SVG or CSS treatment before reaching for a generic stock illustration or AI-generated image.

Do not use decorative assets that imply functionality the product does not have.

## Responsive behavior

Design responsive states intentionally rather than merely stacking desktop cards:

- Define what is primary, secondary, and hidden at each breakpoint.
- Preserve action visibility and wallet/transaction status on small screens.
- Convert dense tables into readable rows, summaries, or progressive disclosure where needed.
- Avoid horizontal overflow except for intentionally scrollable data.
- Keep tap targets accessible and separated.
- Test keyboard, touch, zoom, and narrow viewport behavior.
- Ensure charts and visualisations have mobile-safe labels or summaries.

## Accessibility

Preserve and improve accessibility while redesigning:

- Use semantic landmarks and heading order.
- Maintain visible keyboard focus.
- Ensure contrast for text, controls, borders, charts, and status indicators.
- Provide accessible names and descriptions for icon buttons.
- Keep dialogs, menus, tabs, tooltips, and disclosures keyboard-operable.
- Do not rely on hover alone.
- Announce important transaction state changes appropriately without creating noise.
- Respect reduced motion and user zoom.

## Performance

- Do not introduce Three.js or large animation packages globally for a local visual need.
- Lazy-load heavy visualisation code and non-critical assets.
- Avoid expensive continuous animation, layout thrashing, and unnecessary re-renders.
- Keep images optimised and dimensions explicit.
- Prefer CSS transforms and opacity for simple animation.
- Preserve existing data and wallet performance characteristics.
- Check the production build and inspect for new console errors or hydration/runtime warnings where applicable.

## Phased execution roadmap

### Phase 1 — Audit, visual direction, and foundation

Inspect the existing frontend, document the inventory and AI-slop findings, establish tokens, typography, spacing, surfaces, icon rules, and motion rules, then redesign the shared shell and highest-impact global primitives without changing behavior.

Acceptance criteria:

- Existing routes and functional states still work.
- The audit identifies all relevant pages/components/states and risks.
- A coherent token layer exists and is used by the redesigned foundation.
- The shell, navigation, global buttons, inputs, panels, status elements, and typography no longer look like unrelated defaults.
- Build/lint/type checks pass, or existing failures are recorded separately.
- The result is recognisably LOANCH-specific without relying on decorative noise.

### Phase 2 — Primary product surfaces

Redesign the main dashboard or primary application route, prioritising user goals, protocol health, position information, primary actions, and transaction visibility. Reuse real data and existing handlers.

Acceptance criteria:

- The primary page has a clear first-read hierarchy.
- The most important value and action are obvious at desktop and mobile widths.
- Loading, empty, error, wallet, and transaction states are visually designed.
- No duplicate behavioral modules were introduced.

### Phase 3 — Secondary flows and dense information

Redesign secondary routes, forms, tables, detail views, policy/risk areas, and supporting content. Apply progressive disclosure and consistent data presentation.

Acceptance criteria:

- Dense information is scannable and grouped by meaning.
- Forms preserve all existing validation and submission behavior.
- Advanced information is available without overwhelming the primary task.
- Responsive and keyboard behavior is verified.

### Phase 4 — Meaningful motion and product visualisation

Add only the motion and visualisations justified by the product audit. Integrate Motion with reduced-motion handling. Add Three.js/React Three Fiber only if a specific visualisation has a documented purpose and fallback.

Acceptance criteria:

- Every animation has a documented UX purpose.
- No perpetual decorative motion remains without meaning.
- Reduced-motion behavior is verified.
- Heavy visual code is scoped or lazy-loaded where appropriate.

### Phase 5 — Polish, consistency, and anti-slop review

Perform a whole-product pass for hierarchy, spacing, typography, state coverage, visual consistency, accessibility, performance, and distinctiveness. Remove anything that feels copied from a library demo.

Acceptance criteria:

- All routes share a coherent LOANCH visual language.
- Component variants are intentional and limited.
- There are no unexplained gradients, glows, duplicate cards, random animations, or generic hero patterns.
- Screenshots at desktop, tablet, and mobile show deliberate composition.
- Build, lint, type checks, and relevant existing tests pass.
- A final report records any unresolved issue or any proposed change that would require touching logic.

## Iterative anti-AI-slop review loop

After every phase, review the result as a skeptical design reviewer:

1. Could this belong to any generic crypto dashboard?
2. Does every visual choice have a product or usability reason?
3. Is the hierarchy obvious without explanation?
4. Are there too many cards, pills, gradients, glows, or animations?
5. Does the interface feel authored and specific to LOANCH?
6. Does mobile feel designed rather than collapsed?
7. Are real states represented honestly?
8. Is anything visually impressive but functionally irrelevant?

If the answer indicates AI-slop, template-like, generic, noisy, or library-demo aesthetics, do not stop at reporting it. Rework the affected visual system, composition, component, copy treatment, or motion until it passes. Preserve logic and functionality throughout the iteration.

## Required phase report format

At the end of each phase, report:

- Pages and components inspected.
- Files changed.
- Visual decisions made and why.
- Existing components and libraries reused.
- New dependencies added, with justification.
- Functional invariants checked.
- Build, lint, type, and test results.
- Responsive and accessibility checks performed.
- Remaining visual issues.
- Any blocked improvement that would require a prohibited logic change.

---
