# Phase 10 security review

Reviewed on 2026-09-24 against the Phase 10 release candidate. The review covers local contract behavior and does not represent an independent audit or BOT Chain deployment approval.

## Verification

- Hardhat unit, integration, adversarial, and 20-seed accounting tests: 34 passing. `test/system.test.ts` checks `liquidPoolAssets + activeLoanPrincipal >= saverPrincipalClaims + saverReturnLiability + platformRevenue + lossReserveAmount` and share totals after each action.
- `npm run compile`, `npm run typecheck`, `npm run lint`, `npm run frontend:lint`, and `npm run frontend:build` pass.
- Slither 0.11.6: 20 contracts, 102 detectors. The first run found `divide-before-multiply` in `claimReturn`; the operation was replaced by a modulo and the final run has 8 findings: no high severity, one medium in the deliberate test token, and seven low/informational. Raw reports are stored in ignored `cache/slither-initial.json` and `cache/slither-final.json` when the check is run locally.

## Slither triage

| Finding | Impact | Decision |
| --- | --- | --- |
| `reentrancy-no-eth`, `reentrancy-benign`, `reentrancy-events`, `low-level-calls` | Medium/Low/Info | All point to `contracts/test/ReentrantToken.sol`, a deliberately hostile token. It is not used for deployment. Its callback attempts a nested `deposit`; the test checks the exact `ReentrancyGuardReentrantCall` selector. |
| `missing-zero-check` | Low | `ReentrantToken.setPool` is a test helper. A zero pool merely disables its attack. No production setter is affected. |
| `assembly` | Informational | The test token extracts the four-byte revert selector so its test can verify the production guard's exact error. No assembly is used by `LoanchPool`. |
| `timestamp` | Low | `markDefault` intentionally checks `block.timestamp > dueDate + 7 days`. Small validator timestamp variance does not bypass the seven-day business rule. Boundary tests reject early calls and accept late payment before the default transaction. |
| `pragma` | Informational | OpenZeppelin dependency source ranges differ from the project's `^0.8.28`; Hardhat compiles all using 0.8.28. |

## Manual checks

- All owner-only functions are `setIdentityVerification`, `setBorrowerRiskScore`, `setRiskThreshold`, `setReserveBps`, `setDistributionBps`, `setSaverWeight`, and `withdrawPlatformRevenue`. No `tx.origin` authorization exists.
- `deposit`, `withdraw`, `stake`, `unstake`, `requestLoan`, `repayLoan`, `claimReturn`, `markDefault`, and `withdrawPlatformRevenue` are `nonReentrant`. State changes occur before ERC-20 transfers, and a failed transfer reverts the entire transaction. Exact balance deltas reject fee-on-transfer assets.
- Share minting uses internal principal claims, so a direct token donation cannot inflate the share price or create a claim. Zero minted shares and zero weighted shares are rejected. If claims reach zero while shares remain, normal deposit/withdraw stops pending a separately designed recapitalization mechanism.
- Lending subtracts the liquidity target, loss reserve, Saver return liability, platform revenue, and locked stake from spendable funds. Saver withdrawals and claims cannot take segregated balances. Default consumes stake, then the return-funded loss reserve, then Saver principal claims. No unpaid margin is distributed.
- There are no loops over users in production contract functions. Per-user reward settlement uses a cumulative index. Fractional reward amounts below one asset base unit remain in the Saver return liability as conservative dust; they cannot be paid twice.

## Local gas observations

From `npx hardhat test --gas-stats`, approximate gas used across successful local calls (varies with state): deposit 92k–234k, withdraw 82k–140k, stake 93k, requestLoan 349k–370k, repayLoan 63k–201k, claimReturn 61k–88k, markDefault 166k–184k. LoanchPool deployment used about 3.02M gas and deployed bytecode is 12,985 bytes. These estimates are for the local EVM and are not BOT Chain gas quotes.

## Dependency audit

`npm audit` identified a high severity `serialize-javascript` transitive development dependency; it is pinned to 7.0.5 via npm overrides. The remaining advisory is low severity in `diff` through Mocha's test runner. Mocha 12 would conflict with the current Hardhat Mocha plugin peer range (`^11`), so the low severity development-only advisory is accepted for this local release candidate.

To repeat the static check, install `slither-analyzer` and run `slither . --compile-force-framework hardhat --exclude-dependencies`. Slither returns a nonzero exit code while accepted findings remain; the table above records their disposition.
