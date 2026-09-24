# UX Architecture

## Objective

Phase 1 turns `Loanch.md` into a frontend information architecture for a hackathon-ready product experience. This document defines the user journeys, page hierarchy, transaction flow, empty states, and error states before visual implementation.

## Product Requirements from Loanch.md

Loanch is a programmable lending platform where savers and borrowers interact through a loan pool governed by smart contracts.

Core requirements reflected in the frontend:

- Savers deposit into a shared loan pool instead of choosing individual borrowers.
- Borrowers request loans after identity verification, risk eligibility, stake requirements, and liquidity checks.
- The loan pool must expose total deposits, reserve, active loans, available liquidity, lending capacity, and utilization.
- Staking is an incentive and commitment mechanism, not a replacement for identity or credit assessment.
- Smart contracts are the authority for financial state and rule enforcement.
- Sensitive identity data stays private; only verification states should be shown.
- Financial reputation is based on repayment behavior over time.
- Blockchain should be useful and verifiable without overwhelming beginners.

## UX Decisions

- Use a calm premium fintech interface rather than a crypto trading dashboard.
- Use role-based entry points: Save and Borrow.
- Put pool transparency close to the primary actions so users understand where funds go.
- Use progressive disclosure for blockchain details: human-readable result first, technical transaction data second.
- Prefer "Financial Reputation" over "Credit Score" unless the actual implementation exposes a formal score.
- Use explanation panels for rules only where they help the user decide or act.

## Temporary Frontend Assumptions

- If no deployed contract address is configured, the UI may show clearly labeled demo data for layout and flow validation.
- Demo data must live in isolated frontend files and must not be presented as live on-chain state.
- Identity verification may be represented as a frontend demo state until a contract or backend source exists.
- Explorer links should be disabled or labeled unavailable until real contract/transaction data exists.

## Primary Personas

## Modern Saver

Question: "What happens to my money?"

Needs:

- Understand how deposits enter the pool.
- See reserve and active lending clearly.
- See available withdrawal liquidity.
- Understand returns are generated from loan activity and are not guaranteed.
- Avoid borrower-by-borrower decision complexity.

## Borrower

Question: "Can I borrow, how much, and what do I need to do?"

Needs:

- See eligibility requirements before committing.
- Understand required stake.
- Understand repayment amount and due date.
- Know why a loan request can or cannot proceed.
- See stake unlock conditions.

## Navigation Model

Recommended MVP navigation:

- Overview
- Save
- Borrow
- Loans
- Pool
- Reputation
- Activity

Optional later navigation:

- Learn
- Wallet

For initial implementation, a single React app can render sections/views without adding a routing dependency. Full URL routes can be added later if page complexity or deep-linking requires them.

## Page Hierarchy

## Landing / Overview

Purpose:

- Explain Loanch in under 30 seconds.
- Offer Connect Wallet, Save, Borrow, and Explore Pool.
- Show a pool status preview.

Primary content:

- Hero: "Save. Borrow. Build trust on-chain."
- Short product message.
- Wallet/network state.
- Pool stats preview.
- How Loanch works.
- Saver and borrower paths.
- Trust, privacy, reputation, BOT Chain, and footer.

## Dashboard

Purpose:

- Answer "What is happening with my money?"

Primary content:

- Wallet and network status.
- Current role selector or role summary.
- Saver position summary.
- Borrower obligation summary.
- Pool health.
- Recent activity.

## Save

Purpose:

- Guide deposit and withdrawal decisions.

Flow:

- Deposit amount.
- Expected pool position.
- Return disclaimer.
- Review deposit.
- Wallet confirmation state.
- Success with transaction details.
- Withdrawal request and liquidity state.

## Borrow

Purpose:

- Guide eligibility, staking, loan request, and repayment.

Flow:

- Eligibility checklist.
- Loan amount and duration.
- Estimated repayment.
- Required stake.
- Review.
- Stake lock.
- Request loan.
- Active loan and repayment state.

## Loans

Purpose:

- Show active and historical loans with lifecycle visibility.

Primary content:

- Loan list.
- Loan detail summary.
- Repayment history.
- Stake state.
- Lifecycle timeline.

## Pool

Purpose:

- Make Loanch transparency visible.

Primary content:

- Total deposits.
- Active loans.
- Available liquidity.
- Reserve.
- Lending capacity.
- Utilization.
- Explanation of why reserve exists.

## Reputation

Purpose:

- Show financial behavior over time.

Primary content:

- Completed loans.
- On-time payments.
- Late payments.
- Current obligations.
- Total repaid.
- Professional timeline of repayment history.

## Activity

Purpose:

- Provide transaction and product history.

Primary content:

- Deposits.
- Withdrawal requests.
- Stakes.
- Loan disbursements.
- Repayments.
- Return distributions.
- Technical details when available.

## MVP Path

The primary demo path is:

1. Connect wallet.
2. See BOT Chain/network state.
3. Choose Save or Borrow.
4. Complete the main action.
5. See the resulting position or loan state.
6. Verify transaction details when available.

## Saver Journey

1. User opens app and sees pool status.
2. User connects wallet.
3. User chooses Save.
4. User enters deposit amount.
5. UI previews pool position and warns returns are not guaranteed.
6. User reviews network, wallet, pool, and amount.
7. User confirms in wallet.
8. UI shows pending and confirmed states.
9. User sees updated position and transaction details.
10. User can request withdrawal if liquidity is available.

## Borrower Journey

1. User opens app and sees Borrow path.
2. User connects wallet.
3. UI shows verification and eligibility checklist.
4. User enters loan amount and duration.
5. UI calculates estimated repayment and required stake.
6. UI explains stake lock and unlock condition.
7. User reviews the request.
8. Smart contract is described as the authority.
9. User confirms request in wallet.
10. UI shows active loan, remaining debt, stake state, and repayment action.

## Transaction Flow

All write actions should use this user-facing state model:

- Ready
- Preparing
- Waiting for wallet
- Submitted
- Confirming on BOT Chain
- Confirmed
- Failed

Each state should answer:

- What is happening?
- Why does it matter?
- What can the user do next?

## Empty States

Required empty states:

- No wallet connected.
- No deposits yet.
- No active loan.
- No repayment history.
- No activity yet.
- Contract not configured.
- Explorer unavailable.

Empty states should guide the next action without creating fake urgency.

## Error States

Required error states:

- Wrong network.
- Insufficient balance.
- Insufficient liquidity.
- Insufficient stake.
- Loan rejected by rules.
- Wallet signature rejected.
- Transaction reverted.
- Contract unavailable.
- Connection failure.

Every error should explain:

- What happened.
- Why it happened.
- What the user can do next.

## Accessibility Requirements

- Use semantic landmarks for header, main, sections, forms, and footer.
- Every form input needs a visible label.
- Use visible focus states.
- Use accessible button names.
- Do not rely on color alone for financial states.
- Keep contrast high across dark and light surfaces.

## Architecture Review Gate

Visual implementation should start only after this information architecture is accepted or intentionally revised.
