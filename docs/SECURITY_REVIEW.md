# Phase 10 security review

Reviewed on 2026-09-25 against the native-BOT Phase 10 release candidate. The review covers local contract behavior and does not represent an independent audit.

## Verification

- Hardhat unit, integration, adversarial, and 20-seed accounting tests: 31 passing. `test/system.test.ts` checks `liquidPoolAssets + activeLoanPrincipal >= saverPrincipalClaims + saverReturnLiability + platformRevenue + lossReserveAmount` and share totals after each action.
- `npm run compile`, `npm run typecheck`, `npm run lint`, `npm run frontend:lint`, and `npm run frontend:build` pass.
- Slither 0.11.6 analyzed 10 contracts with 102 detectors. The final run reports no high or medium findings and seven accepted low/informational findings. The raw report is stored in ignored `cache/slither-native-final.json`.

## Slither triage

| Finding | Impact | Decision |
| --- | --- | --- |
| Native callback reentrancy | Covered by test | `NativeReentrantReceiver` attempts a nested withdrawal from its receive callback; the test checks the exact `ReentrancyGuardReentrantCall` selector. |
| Low-level native call | Required interaction | `_transferOut` uses `call{value: amount}` after state updates, checks success, and every value-moving entry point is `nonReentrant`. |
| `assembly` | Informational | The test receiver extracts the four-byte revert selector so its test can verify the production guard's exact error. No assembly is used by `LoanchPool`. |
| `reentrancy-benign` | Low | Two findings are limited to the adversarial test receiver intentionally updating observation flags around its callback. Production `LoanchPool` has no state write after native transfer. |
| `missing-inheritance` | Informational | Slither suggests production should inherit the minimal interface declared only by the adversarial test helper. No production behavior or safety depends on that test interface. |
| `timestamp` | Low | `markDefault` intentionally checks `block.timestamp > dueDate + 7 days`. Small validator timestamp variance does not bypass the seven-day business rule. Boundary tests reject early calls and accept late payment before the default transaction. |
| `pragma` | Informational | OpenZeppelin dependency source ranges differ from the project's `^0.8.28`; Hardhat compiles all using 0.8.28. |

## Manual checks

- All owner-only functions are `setIdentityVerification`, `setBorrowerRiskScore`, `setRiskThreshold`, `setReserveBps`, `setDistributionBps`, `setSaverWeight`, and `withdrawPlatformRevenue`. No `tx.origin` authorization exists.
- `deposit`, `withdraw`, `stake`, `unstake`, `requestLoan`, `repayLoan`, `claimReturn`, `markDefault`, and `withdrawPlatformRevenue` are `nonReentrant`. State changes occur before native BOT transfers, and a failed recipient call reverts the entire transaction.
- Share minting uses `msg.value` and internal principal claims. The receive handler rejects direct BOT transfers. Zero minted shares and zero weighted shares are rejected. If claims reach zero while shares remain, normal deposit/withdraw stops pending a separately designed recapitalization mechanism.
- Lending subtracts the liquidity target, loss reserve, Saver return liability, platform revenue, and locked stake from spendable funds. Saver withdrawals and claims cannot take segregated balances. Default consumes stake, then the return-funded loss reserve, then Saver principal claims. No unpaid margin is distributed.
- There are no loops over users in production contract functions. Per-user reward settlement uses a cumulative index. Fractional reward amounts below one wei remain in the Saver return liability as conservative dust; they cannot be paid twice.

## Local gas observations

From `npx hardhat test --gas-stats`, approximate gas used across successful local calls (varies with state): deposit 67k–191k, withdraw 71k–126k, stake 70k, requestLoan 333k–375k, repayLoan 41k–176k, claimReturn 48k–77k, markDefault 166k–184k. LoanchPool deployment used about 2.86M gas and deployed bytecode is 12,218 bytes. These estimates are for the local EVM and are not BOT Chain gas quotes.

## Dependency audit

`npm audit` identified a high severity `serialize-javascript` transitive development dependency; it is pinned to 7.0.5 via npm overrides. The remaining advisory is low severity in `diff` through Mocha's test runner. Mocha 12 would conflict with the current Hardhat Mocha plugin peer range (`^11`), so the low severity development-only advisory is accepted for this local release candidate.

To repeat the static check, install `slither-analyzer` and run `slither . --compile-force-framework hardhat --exclude-dependencies`. Slither returns a nonzero exit code while accepted findings remain; the table above records their disposition.
