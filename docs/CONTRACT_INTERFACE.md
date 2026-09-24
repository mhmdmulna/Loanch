# LoanchPool contract interface (Phase 10 release candidate)

One ERC-20 asset is used for Saver deposits, loans, repayments, and borrower stake. Identity status remains optional metadata for future integration and does not gate deposits or loans in demo mode. The owner is the trusted MVP configuration authority. There is one active loan per borrower. No personal identity document is stored on-chain.

## Units and rules

- Asset amounts and shares are integer base units of the asset. Initial shares mint 1:1. Later shares mint as `floor(amount * totalShares / saverPrincipalClaims)`; zero-share deposits revert. Principal withdrawals burn `ceil(amount * totalShares / saverPrincipalClaims)` shares. If principal value is zero while shares remain, deposits and withdrawals stop pending a future recapitalization design.
- BPS denominator: 10,000. Initial liquidity reserve: 2,000 BPS of Saver principal claims. This remains Saver principal. Margin distribution: 8,000 Saver / 1,500 platform / 500 loss reserve BPS. These are independent balances.
- Saver weight starts at 10,000 BPS and owner may set 5,000–20,000 BPS. Rewards use a cumulative `1e27` index per weighted share. Accrual is settled before deposit, withdrawal, or weight change. Fractional units carry forward; only whole asset units can be claimed. Remainders from BPS allocation go to the loss reserve.
- MVP lending parameters: no identity gate in demo mode, minimum borrower risk score 60/100, initial reputation 50/100 with minimum eligible 20, loan cap 50% of current Saver principal claims, minimum stake 5% of requested principal rounded up, duration 1–365 days, fixed 10% margin per loan. Duration is seconds in the contract API. Successful completion increases reputation by 5 up to 100; default reduces it by 20 down to zero and permanently blocks new loans in this MVP.
- Loan repayment pays outstanding principal first. Excess over remaining debt reverts. After a 7-day grace period, anyone can default an active loan. The waterfall reclassifies locked stake, then loss reserve, then reduces Saver principal claims through the share price. Unpaid margin has no value.
- Transfers use checks, effects, interactions and a reentrancy guard. Incoming transfers must deliver the exact requested amount; outgoing transfers must debit the exact amount. Non-standard fee tokens are unsupported.
- Direct ERC-20 transfers to the pool do not mint shares or change claims. Fractional reward dust remains reserved in `saverReturnLiability`; a Saver can claim only whole base units. No user-count loop runs during repayment or default.

## Read and write surface

| Role | Function | Purpose |
| --- | --- | --- |
| Owner | `setIdentityVerification(user, verified)` | Optional identity metadata; no financial gate in demo mode |
| Owner | `setBorrowerRiskScore(user, score)` | Score 0–100 |
| Owner | `setRiskThreshold(score)` | Minimum score 0–100 |
| Owner | `setReserveBps(bps)` | Liquidity target 0–10,000 |
| Owner | `setDistributionBps(saver, platform, reserve)` | Must sum to 10,000 |
| Owner | `setSaverWeight(user, bps)` | Weight 5,000–20,000 |
| Owner | `withdrawPlatformRevenue(recipient, amount)` | Transfer only earned platform revenue |
| Saver | `deposit(amount)` / `withdraw(amount)` | Add or remove principal immediately |
| Saver | `claimReturn()` | Transfer accrued return |
| Borrower | `stake(amount)` / `unstake(amount)` | Fund or remove unallocated stake |
| Borrower | `requestLoan(amount, duration)` | Create and disburse one loan atomically |
| Borrower | `repayLoan(loanId, amount)` | Pay principal then margin |
| Anyone | `markDefault(loanId)` | Finalize overdue active loan once |
| Anyone | `getPoolStats()`, `getSaverPosition(user)`, `getBorrowerProfile(user)`, `getLoan(id)`, `previewLoan(user, amount, duration)`, `claimableReturn(user)`, `requiredStake(amount)`, `remainingDebt(id)`, `availableLending()`, `withdrawablePrincipal(user)` | Public state and estimates |

`getPoolStats()` exposes shares, weighted shares, principal claims, liquid pool assets, reserve target, lending capacity, active principal, active loan count, Saver return liability, platform revenue, loss reserve, and locked stake. `getSaverPosition()` exposes shares, weight, weighted shares, principal claim, and claimable return. `previewLoan()` gives a deterministic eligibility reason before a transaction. `defaultLosses(loanId)` exposes unpaid principal, stake used, reserve used, Saver loss, and stake returned. Loan IDs start at 1. `LoanStatus` is None=0, Active=1, Completed=2, Defaulted=3. `Eligibility` is Eligible=0, NotVerified=1, RiskTooLow=2, ReputationTooLow=3, BorrowerBlocked=4, InvalidAmount=5, InvalidDuration=6, ActiveLoanExists=7, InsufficientStake=8, InsufficientLiquidity=9.

The release-candidate ABI is [LoanchPool.json](../contracts/abi/LoanchPool.json). Local fixture addresses are process-specific and are printed by `npm run local:demo`. BOT Chain addresses belong to Phase 11. A security fix may still change this ABI.

## Local integration fixture

`npm run local:demo` uses Hardhat chain ID 31337 with admin `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`, Saver `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`, and Borrower `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`. These are public development accounts and must never be used with real assets. The script prints asset and pool addresses for each new local chain. The sequence is mint/approve → risk → deposit 1,000 → stake 25 → loan 500 for 30 days → repay 550 → claim Saver return. Final loan status is Completed; Saver claim remains 1,000, platform revenue is 7.5, and loss reserve is 2.5 tokens (18 decimals).

Demo customer addresses and target values are configured in `config/demo-customers.mjs`. Run `npm run local:seed-customers` after a local redeploy. The command tops positions up to their configured targets and can be run repeatedly without duplicating the configured deposit or free stake. Configured addresses must be unlocked accounts on the local Hardhat node; private keys must not be stored in the configuration file.

## Phase test matrix

| Phase | Proof |
| --- | --- |
| 2–3 | Constructor, owner permissions, identity, risk and BPS validation |
| 4 | Share minting, weights, reserve, token transfer exactness |
| 5 | Partial/full withdrawal, liquidity and rollback |
| 6 | Stake separation, eligibility and stake sufficiency |
| 7 | Atomic disbursement, one active loan and liquidity cap |
| 8 | Principal-first repayment, weighted return, historical entitlement and completion |
| 9 | Time gate, one-shot default, stake/reserve/Saver loss and reputation |
| 10 | Full-system flows, adversarial token, accounting invariants, gas and static analysis |
