# LoanchPool errors and events (Phase 10 release candidate)

Errors are Solidity custom errors. The frontend should decode them from the ABI and display the suggested meaning.

| Error | Meaning |
| --- | --- |
| `InvalidAsset`, `InvalidReserveRatio`, `InvalidDistribution`, `InvalidScore`, `InvalidWeight` | Invalid deployment or owner configuration |
| `IdentityNotVerified` | Saver identity has not been verified |
| `LoanNotEligible(reason)` | Loan request failed; decode `reason` using the enum in `CONTRACT_INTERFACE.md` |
| `ZeroDeposit`, `ZeroAmount`, `ZeroShares`, `ZeroWeightedShares`, `ZeroPrincipalSharePrice` | Zero or unrepresentable financial position |
| `InsufficientPrincipal`, `InsufficientLiquidity`, `InsufficientStake`, `InsufficientPlatformRevenue` | Requested amount is not available |
| `NothingToClaim` | No whole asset unit of Saver return is currently claimable |
| `InvalidLoanState`, `NotBorrower`, `Overpayment`, `GracePeriodActive` | Loan payment or default condition failed |
| `UnsupportedTokenTransfer` | Asset did not transfer exactly as requested |
| `OwnableUnauthorizedAccount` | Caller is not the owner |
| `OwnableInvalidOwner`, `SafeERC20FailedOperation` | Inherited OpenZeppelin ownership or token operation error |
| `ReentrancyGuardReentrantCall` | Nested financial call blocked |

| Event | UI refresh target |
| --- | --- |
| `IdentityVerificationUpdated`, `BorrowerRiskScoreUpdated`, `RiskThresholdUpdated` | User eligibility |
| `ReserveBpsUpdated`, `DistributionBpsUpdated`, `SaverWeightUpdated` | Pool settings and Saver position |
| `Deposited`, `Withdrawn`, `ReturnClaimed` | Saver position and pool |
| `StakeLocked`, `StakeUnlocked` | Borrower stake |
| `LoanRequested`, `LoanDisbursed`, `LoanRepaid`, `LoanCompleted` | Loan and pool |
| `LoanDefaulted`, `StakeSlashed`, `ReserveUsed`, `SaverLossRecognized`, `ReputationPenalized` | Loan loss and Saver position |
| `ReturnDistributed`, `SaverReturnRedirected` | Return balances and pool |
| `PlatformRevenueWithdrawn` | Platform revenue and pool |

Events contain IDs, actors, and amounts so the frontend can refresh the relevant reads after a transaction receipt. Full event signatures are in the generated ABI once Phase 10 is complete.
