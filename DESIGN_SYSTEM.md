# Design System

## Objective

Phase 2 defines the visual and interaction design standards for Loanch. This design system establishes a reusable, accessible, and coherent foundation for all frontend pages and flows implemented in subsequent phases.

## Design Philosophy

- **Institutional Fintech**: Premium, calm, and approachable. Avoid crypto-trading dashboard aesthetics.
- **Clarity over Decoration**: Every element serves a purpose. Whitespace is intentional.
- **Accessibility First**: High contrast, readable typography, semantic HTML, keyboard navigation.
- **Blockchain-Aware**: Present blockchain states clearly without overwhelming beginners.
- **Dark-First**: Primary theme uses a sophisticated dark palette; light theme is secondary.

## Color Palette

### Primary Brand Colors

| Token | Value | Use Case |
|-------|-------|----------|
| `emerald-50` | #f0fdf4 | Light backgrounds, hover states |
| `emerald-100` | #dcfce7 | Subtle highlights |
| `emerald-400` | #4ade80 | Success, active states, trust accents |
| `emerald-500` | #22c55e | Primary action, verified states |
| `emerald-600` | #16a34a | Primary button hover |
| `emerald-700` | #15803d | Primary button active |

### Neutral Palette (Dark Theme)

| Token | Value | Use Case |
|-------|-------|----------|
| `slate-50` | #f8fafc | Text on dark, contrast |
| `slate-100` | #f1f5f9 | Light text, secondary UI |
| `slate-300` | #cbd5e1 | Borders, dividers |
| `slate-400` | #94a3b8 | Secondary text |
| `slate-500` | #64748b | Muted text |
| `slate-700` | #334155 | Card backgrounds |
| `slate-800` | #1e293b | Secondary backgrounds |
| `slate-900` | #0f172a | Primary background |
| `slate-950` | #020617 | Deep background, overlays |

### Semantic Colors

| Token | Value | Use Case |
|-------|-------|----------|
| `blue-400` | #60a5fa | Info, interactive, links |
| `blue-500` | #3b82f6 | Primary links, hover |
| `amber-400` | #fbbf24 | Warnings, pending states |
| `amber-500` | #f59e0b | Warning text |
| `rose-400` | #f87171 | Errors, rejected states |
| `rose-500` | #ef4444 | Error text |

### Transaction State Colors

| State | Color | Hex | Use Case |
|-------|-------|-----|----------|
| Pending | Amber | #f59e0b | Tx submitted, awaiting confirmation |
| Confirmed | Emerald | #22c55e | Tx confirmed on-chain |
| Failed | Rose | #ef4444 | Tx reverted or rejected |
| Rejected | Rose | #dc2626 | User rejected in wallet |

## Typography

### Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

### Scale and Hierarchy

| Size | CSS | Use Case | Line-height |
|------|-----|----------|-------------|
| H1 | 2.25rem (36px) | Page titles | 2.5rem (1.1x) |
| H2 | 1.875rem (30px) | Section titles | 2.25rem (1.2x) |
| H3 | 1.5rem (24px) | Card titles, subsections | 2rem (1.33x) |
| H4 | 1.25rem (20px) | Form section titles | 1.75rem (1.4x) |
| Body Large | 1rem (16px) | Primary text, body | 1.5rem (1.5x) |
| Body Regular | 0.9375rem (15px) | Secondary text | 1.5rem (1.6x) |
| Body Small | 0.875rem (14px) | Captions, labels | 1.375rem (1.57x) |
| Label | 0.8125rem (13px) | Form labels, badges | 1.25rem (1.54x) |
| Caption | 0.75rem (12px) | Metadata, timestamps | 1rem (1.33x) |

### Font Weights

| Weight | Value | Use Case |
|--------|-------|----------|
| Regular | 400 | Body text |
| Medium | 500 | Form labels, button text |
| Semibold | 600 | Section titles (H3, H4) |
| Bold | 700 | Page titles (H1, H2) |

## Spacing

All spacing follows a consistent 4px grid system.

### Space Scale

| Token | Pixels | REM | Use Case |
|-------|--------|-----|----------|
| `xs` | 4px | 0.25rem | Tight spacing |
| `sm` | 8px | 0.5rem | Components, gaps |
| `md` | 12px | 0.75rem | Component padding, margins |
| `lg` | 16px | 1rem | Content padding, section gaps |
| `xl` | 20px | 1.25rem | Container padding, large gaps |
| `2xl` | 24px | 1.5rem | Page sections, large spacing |
| `3xl` | 32px | 2rem | Section dividers |
| `4xl` | 40px | 2.5rem | Major sections |

### Commonly Used Combinations

| Pattern | Value | Use Case |
|---------|-------|----------|
| Card Padding | 1.5rem (24px) | Standard card interior |
| Input Height | 2.5rem (40px) | Form inputs |
| Button Height | 2.5rem (40px) | Primary buttons |
| Large Button Height | 3rem (48px) | Full-width CTA buttons |
| Section Margin | 2rem (32px) | Between page sections |

## Components

### Buttons

#### Primary Button

- **Background**: Emerald-500 (`#22c55e`)
- **Padding**: 0.625rem (10px) horizontal × 0.5rem (8px) vertical (for 40px height)
- **Border Radius**: 0.5rem (8px)
- **Font**: Body Large (16px), Semibold (600), white text
- **Hover**: Emerald-600 (`#16a34a`)
- **Active**: Emerald-700 (`#15803d`)
- **Disabled**: Slate-700 with 50% opacity, cursor not-allowed
- **Focus**: Outline 2px solid Emerald-400, offset 2px

#### Secondary Button

- **Background**: Slate-800
- **Border**: 1px solid Slate-600
- **Padding**: 0.625rem (10px) horizontal × 0.5rem (8px) vertical
- **Font**: Body Large (16px), Semibold (600), Slate-100 text
- **Hover**: Slate-700 background
- **Focus**: Outline 2px solid Blue-400

#### Danger Button

- **Background**: Rose-500
- **Padding**: Same as primary
- **Font**: Body Large (16px), Semibold (600), white text
- **Hover**: Rose-600
- **Focus**: Outline 2px solid Rose-300

#### Button Sizes

| Size | Padding | Font | Height |
|------|---------|------|--------|
| Small | 0.5rem (8px) horizontal | Body Small (14px) | 2rem (32px) |
| Medium | 0.625rem (10px) horizontal | Body Large (16px) | 2.5rem (40px) |
| Large | 0.75rem (12px) horizontal | Body Large (16px) | 3rem (48px) |

#### Button States

- **Loading**: Display spinner icon, disable pointer events, reduce opacity to 75%
- **Disabled**: Gray out, cursor not-allowed, no hover effects
- **Icon Button**: Same padding rules, optional text label

### Inputs

#### Text Input

- **Background**: Slate-950 (dark background)
- **Border**: 1px solid Slate-600
- **Border Radius**: 0.5rem (8px)
- **Padding**: 0.75rem (12px)
- **Font**: Body Large (16px), Slate-100 text
- **Placeholder**: Slate-500 color
- **Focus**: Border color Emerald-500, outline 1px offset 0px, shadow 0 0 0 3px rgba(34, 197, 94, 0.1)
- **Error**: Border color Rose-500, same shadow with rose
- **Disabled**: Background Slate-800, text Slate-500, cursor not-allowed

#### Textarea

- **Same as text input but**
- **Min Height**: 6rem (96px)
- **Resize**: vertical only

#### Select / Dropdown

- **Background**: Slate-950
- **Border**: 1px solid Slate-600
- **Padding**: 0.75rem (12px)
- **Font**: Body Large (16px)
- **Icon**: Chevron down, Slate-400, 1rem size

#### Checkbox

- **Size**: 1.25rem (20px) × 1.25rem (20px)
- **Border**: 2px solid Slate-500
- **Border Radius**: 0.25rem (4px)
- **Checked Background**: Emerald-500
- **Checked Icon**: White checkmark
- **Focus**: Outline 2px solid Blue-400, offset 2px

#### Radio Button

- **Size**: 1.25rem (20px) diameter
- **Border**: 2px solid Slate-500
- **Checked Fill**: Emerald-500 (inner circle, 0.5rem diameter)
- **Focus**: Outline 2px solid Blue-400, offset 2px

#### Form Label

- **Font**: Label (13px), Medium (500), Slate-100 text
- **Margin Below**: 0.5rem (8px)
- **Required Indicator**: Red asterisk, Slate-100 text

#### Form Error Message

- **Font**: Caption (12px), Regular (400), Rose-400 text
- **Margin Top**: 0.25rem (4px)
- **Icon**: Optional warning icon, Rose-400, 1rem

#### Form Success Message

- **Font**: Caption (12px), Regular (400), Emerald-400 text
- **Margin Top**: 0.25rem (4px)

### Cards

#### Card Container

- **Background**: Slate-800
- **Border**: 1px solid Slate-700
- **Border Radius**: 0.75rem (12px)
- **Padding**: 1.5rem (24px)
- **Box Shadow**: 0 4px 6px -1px rgba(0, 0, 0, 0.3)

#### Card Header

- **Font**: H3 (24px), Bold (700), Slate-50 text
- **Margin Bottom**: 1rem (16px)
- **Border Below**: Optional 1px solid Slate-700

#### Card Sections

- **Divider**: 1px solid Slate-700
- **Margin**: 1rem (16px) top and bottom

#### Card Footer

- **Background**: Optional Slate-900 overlay
- **Padding**: 1rem (16px) 1.5rem (24px)
- **Border Top**: 1px solid Slate-700
- **Alignment**: flex justify-between, align-center

#### Highlighted Card

- **Border Color**: Emerald-500
- **Border Width**: 2px
- **Background**: Slate-800 or with subtle gradient overlay

### Badges

#### Badge Base

- **Border Radius**: 9999px (fully rounded)
- **Padding**: 0.375rem (6px) horizontal × 0.25rem (4px) vertical
- **Font**: Label (13px), Medium (500)

#### Success Badge

- **Background**: Emerald-500 with 20% opacity
- **Text**: Emerald-300
- **Icon**: Optional checkmark

#### Warning Badge

- **Background**: Amber-500 with 20% opacity
- **Text**: Amber-300

#### Error Badge

- **Background**: Rose-500 with 20% opacity
- **Text**: Rose-300

#### Neutral Badge

- **Background**: Slate-700
- **Text**: Slate-300

#### Pending Badge

- **Background**: Amber-500 with 20% opacity
- **Text**: Amber-200
- **Icon**: Optional spinner animation

### Tables

#### Table Container

- **Background**: Slate-800
- **Border**: 1px solid Slate-700
- **Border Radius**: 0.75rem (12px)
- **Overflow**: auto, responsive

#### Table Header

- **Background**: Slate-900
- **Font**: Label (13px), Semibold (600), Slate-200 text
- **Padding**: 1rem (16px)
- **Border Bottom**: 1px solid Slate-700
- **Text Align**: left (default), center or right for numeric

#### Table Row

- **Border Bottom**: 1px solid Slate-700
- **Hover**: Background Slate-700 with 50% opacity transition

#### Table Cell

- **Padding**: 1rem (16px)
- **Font**: Body Regular (15px), Slate-100 text
- **Vertical Align**: middle

#### Table Footer

- **Background**: Slate-900
- **Font**: Label (13px), Slate-400 text
- **Padding**: 1rem (16px)

#### Sortable Column

- **Cursor**: pointer
- **Icon**: Sort chevron, Slate-500 (unsorted), Emerald-400 (sorted)
- **Hover**: Background Slate-800

### Tooltips

#### Tooltip Trigger

- **Icon**: Question circle, 1rem (16px), Slate-400 color
- **Cursor**: help
- **Focus**: Outline 2px Blue-400

#### Tooltip Content

- **Background**: Slate-950
- **Border**: 1px solid Slate-700
- **Padding**: 0.75rem (12px)
- **Font**: Body Small (14px), Slate-200 text
- **Border Radius**: 0.5rem (8px)
- **Box Shadow**: 0 10px 15px -3px rgba(0, 0, 0, 0.5)
- **Max Width**: 16rem (256px)
- **Arrow**: 0.5rem (8px) triangle, Slate-950 background
- **Z-index**: 50

#### Tooltip Position

- **Default**: Above trigger
- **Alternate**: Right, left, below if above would be cut off
- **Offset**: 0.5rem (8px) from trigger

### Transaction States

All transaction states are displayed as badges or in-line status messages.

#### State: Ready

- **Badge**: Neutral (Slate-700)
- **Icon**: Optional play icon
- **Message**: "Ready to proceed"

#### State: Preparing

- **Badge**: Amber (warning)
- **Icon**: Hourglass or clock
- **Message**: "Preparing transaction..."
- **Animation**: Optional fade pulse

#### State: Waiting for Wallet

- **Badge**: Amber
- **Icon**: Wallet icon
- **Message**: "Waiting for wallet signature..."

#### State: Submitted

- **Badge**: Amber
- **Icon**: Checkmark (outlined)
- **Message**: "Transaction submitted"

#### State: Confirming on Chain

- **Badge**: Amber
- **Icon**: Spinner
- **Message**: "Confirming on BOT Chain..."
- **Animation**: Continuous spin

#### State: Confirmed

- **Badge**: Emerald (success)
- **Icon**: Checkmark (solid)
- **Message**: "Confirmed on BOT Chain"
- **Optional**: Transaction hash link

#### State: Failed

- **Badge**: Rose (error)
- **Icon**: X or exclamation
- **Message**: "Transaction failed"
- **Details**: Reason or error code (small text)

#### State: Rejected

- **Badge**: Rose
- **Icon**: X
- **Message**: "Transaction rejected"
- **Details**: "User cancelled in wallet"

### Loading States

#### Skeleton Screen

- **Placeholder Background**: Slate-700
- **Animate**: Pulse from 75% to 100% opacity, 2s duration, ease-in-out
- **Border Radius**: Match component being replaced

#### Spinner

- **Icon**: Circular loading spinner, 1.5rem (24px) default
- **Color**: Emerald-500 (default), or match context
- **Animation**: Rotate 360° over 1s, linear, infinite
- **Variants**: Small (1rem), large (2rem)

#### Loading Text

- **Font**: Body Small (14px), Slate-500
- **Icon**: Optional spinner (small), 0.75rem
- **Layout**: flex, align-center, gap 0.5rem

#### Progress Bar

- **Height**: 0.25rem (4px)
- **Background**: Slate-700
- **Progress Color**: Emerald-500
- **Border Radius**: 9999px
- **Animation**: Optional smooth width transition, 300ms

### Empty States

#### Empty State Container

- **Background**: Slate-800
- **Border**: 1px dashed Slate-700
- **Border Radius**: 0.75rem (12px)
- **Padding**: 3rem (48px) 2rem (32px)
- **Text Align**: center

#### Empty State Icon

- **Size**: 3rem (48px)
- **Color**: Slate-600
- **Margin Bottom**: 1rem (16px)

#### Empty State Title

- **Font**: H3 (24px), Semibold (600), Slate-100
- **Margin Bottom**: 0.5rem (8px)

#### Empty State Description

- **Font**: Body Regular (15px), Slate-400
- **Margin Bottom**: 1.5rem (24px)
- **Max Width**: 30rem (480px)
- **Margin Auto**: centered

#### Empty State Action

- **Button**: Primary or secondary as appropriate
- **Margin**: Above description

#### Examples

**No Deposits Yet**

```
Icon: Piggy bank (Slate-600)
Title: "No deposits yet"
Description: "Start saving to earn returns on the Loanch platform"
Action: "Deposit Now"
```

**No Active Loans**

```
Icon: Document (Slate-600)
Title: "No active loans"
Description: "Request a loan to get started"
Action: "Request Loan"
```

**No Activity**

```
Icon: Activity log (Slate-600)
Title: "No activity"
Description: "Your transactions will appear here"
Action: None
```

### Error States

#### Error Message (Inline)

- **Background**: Rose-500 with 10% opacity
- **Border**: 1px solid Rose-500
- **Border Radius**: 0.5rem (8px)
- **Padding**: 1rem (16px)
- **Font**: Body Small (14px), Rose-200 text
- **Icon**: Exclamation circle, Rose-500, 1.25rem

#### Error Message (Toast / Notification)

- **Position**: Bottom right, 1rem from edges
- **Z-index**: 50
- **Background**: Rose-900 with 95% opacity
- **Border**: 1px solid Rose-700
- **Border Radius**: 0.5rem (8px)
- **Padding**: 1rem (16px)
- **Font**: Body Small (14px), Rose-200 text
- **Icon**: Exclamation, 1.25rem, Rose-400
- **Close Button**: Optional, Slate-400 hover Rose-300
- **Animation**: Slide up 300ms ease-out
- **Auto Dismiss**: 6s (optional)

#### Error Boundary

- **Display**: "Something went wrong"
- **Message**: Optional technical details (for dev mode)
- **Action**: "Reload" button or link to home

## Responsive Rules

### Breakpoints

| Name | Min-width | Use Case |
|------|-----------|----------|
| Mobile | 0px | Small phones |
| Tablet | 640px (40rem) | iPad, large phones |
| Desktop | 1024px (64rem) | Desktop, laptop |
| Wide | 1280px (80rem) | Large monitors |

### Fluid Spacing

- Use percentage-based widths and max-widths where appropriate.
- Container max-width: 1200px (75rem) on desktop.
- Padding scales: 1rem (mobile) → 1.5rem (tablet) → 2rem (desktop).

### Typography Scaling

- H1: 32px (mobile) → 36px (tablet) → 48px (desktop)
- H2: 24px (mobile) → 28px (tablet) → 36px (desktop)
- Body: 14px (mobile) → 15px (tablet) → 16px (desktop)

### Component Stacking

- Cards: 1 column (mobile) → 2 columns (tablet) → 3+ columns (desktop)
- Forms: Full width (mobile) → 50% width (tablet) → 33% width or inline (desktop)
- Tables: Horizontal scroll (mobile), full view (tablet+)

### Touch Targets

- Minimum 44px × 44px on mobile (buttons, links, inputs)
- Adequate spacing (8px minimum) between interactive elements

## Accessibility Rules

### Color Contrast

- All text vs. background must meet WCAG AA minimum (4.5:1 for normal text, 3:1 for large)
- Do not rely on color alone to convey information (e.g., red ≠ error; use icon + label)

### Keyboard Navigation

- Tab order follows visual flow (top-left to bottom-right)
- Skip-to-main-content link available
- Focus indicators visible on all interactive elements (2px outline, 2px offset, Emerald-400 or Blue-400)
- Modals trap focus within until closed
- Escape key closes modals and dropdowns

### Semantic HTML

- Use `<button>`, `<a>`, `<form>`, `<label>`, `<fieldset>`, `<legend>`
- Use `<header>`, `<main>`, `<nav>`, `<footer>` for page structure
- Use `<table>` for tabular data, with `<thead>`, `<tbody>`, `<th>`, `<td>`
- Use `<article>`, `<section>` for content structure

### ARIA and Labels

- Every form input has a visible `<label>` or aria-label
- Icons use aria-label or aria-hidden as appropriate
- Use aria-live for dynamic content updates
- Use aria-current for active navigation
- Use aria-describedby for error messages linked to inputs
- Use role="alert" for critical error messages

### Screen Reader Optimization

- Use descriptive link text (not "click here")
- Provide alt text for images (or aria-hidden if decorative)
- Use aria-expanded for collapsible sections
- Announce loading states and transaction progress via aria-live regions

### Focus Management

- Set focus to form errors or error messages on form submission
- Set focus to success message or next logical location after successful action
- Restore focus to triggering button after modal closes

### Motion and Animation

- Provide prefers-reduced-motion support: disable animations if user preference set
- Use max 3-second animations
- Avoid flashing or flickering content

## Implementation Notes

### CSS-in-JS vs. Tailwind

This design system is built for Tailwind CSS v4. All sizing, spacing, and color values use Tailwind tokens.

Example primary button in Tailwind:

```html
<button class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 disabled:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg focus:outline-2 focus:outline-offset-2 focus:outline-emerald-400 transition-colors">
  Click me
</button>
```

### Component Library Approach

As Loanch frontend grows, consider these options:

1. **Composable React Components**: Build Button, Input, Card, etc. as reusable React components that apply these standards.
2. **Storybook Integration**: Document component variations and states for design review.
3. **CSS Modules or Tailwind Utilities**: Extract common patterns into utility or component classes.

### Future Dark/Light Theme Support

The palette above is dark-first. To support light mode:

- Invert neutral colors: Slate-50 ↔ Slate-950
- Keep semantic colors (Emerald, Rose, Amber, Blue) with adjusted opacity
- Use CSS custom properties or Tailwind themes to toggle

## Verification Checklist

Before implementing pages:

- [ ] All colors meet WCAG AA contrast requirements
- [ ] All spacing uses the 4px grid system
- [ ] All interactive elements have clear focus states
- [ ] Typography hierarchy is consistent and readable
- [ ] Responsive breakpoints tested on mobile, tablet, desktop
- [ ] Empty and error states designed for all user flows
- [ ] Loading states communicate progress clearly
- [ ] Accessibility tested with keyboard navigation and screen reader

---

**This design system is a living document. Update it as new components, patterns, or requirements emerge.**
