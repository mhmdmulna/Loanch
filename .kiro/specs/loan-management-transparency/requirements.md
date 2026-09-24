# Requirements Document

## Introduction

This document specifies the requirements for advanced loan management, pool transparency, financial reputation, and blockchain integration features for the Loanch platform. These features enhance the user experience by providing comprehensive loan tracking, transparent pool information, professional reputation management, and progressive blockchain technical details disclosure.

## Glossary

- **Loan_System**: The smart contract and frontend system managing loan lifecycle
- **Pool_Dashboard**: The user interface displaying pool composition and statistics
- **Reputation_Engine**: The system tracking and displaying user financial history
- **Blockchain_Explorer**: External service for viewing blockchain transactions
- **Timeline_Component**: User interface element showing chronological loan progression
- **Utilization_Rate**: Percentage of total deposits currently active as loans
- **Reserve_Ratio**: Percentage of total deposits held as liquidity reserve
- **Stake_State**: Current status of borrower's locked collateral
- **Transaction_Hash**: Unique identifier for blockchain transactions
- **Contract_Address**: Blockchain address of deployed smart contract

## Requirements

### Requirement 1: Loan Management Interface

**User Story:** As a borrower, I want to view and manage my loans comprehensively, so that I can track my obligations and repayment progress effectively.

#### Acceptance Criteria

1. WHEN a user has loans, THE Loan_System SHALL display a complete list of all user loans
2. WHEN a user selects a loan, THE Loan_System SHALL show detailed loan information including principal, total repayment, amount paid, remaining debt, and due date
3. WHEN displaying loan details, THE Loan_System SHALL show current stake state and staking amount
4. WHEN a loan has repayment history, THE Loan_System SHALL display chronological repayment records with dates and amounts
5. WHEN displaying loan lifecycle, THE Timeline_Component SHALL show progression through states: Requested → Approved → Stake Locked → Disbursed → Repayment → Completed
6. THE Loan_System SHALL distinguish between active, completed, and defaulted loan statuses
7. WHEN loan status changes, THE Loan_System SHALL update the display without requiring page refresh

### Requirement 2: Pool Transparency Dashboard

**User Story:** As a user, I want to understand pool composition and financial metrics transparently, so that I can make informed decisions about participation.

#### Acceptance Criteria

1. THE Pool_Dashboard SHALL display total deposits from all savers
2. THE Pool_Dashboard SHALL show total active loans currently disbursed
3. THE Pool_Dashboard SHALL display available liquidity for new loans
4. THE Pool_Dashboard SHALL show reserve fund amount and percentage
5. WHEN displaying utilization, THE Pool_Dashboard SHALL calculate and show utilization rate as active loans divided by total deposits
6. THE Pool_Dashboard SHALL display lending capacity as total deposits minus reserve requirement
7. WHEN showing pool rules, THE Pool_Dashboard SHALL explain reserve ratio requirements in user-friendly language
8. THE Pool_Dashboard SHALL provide visual representation of pool composition showing deposits, active loans, available liquidity, and reserves
9. WHEN pool data changes, THE Pool_Dashboard SHALL update values in real-time

### Requirement 3: Financial Reputation System

**User Story:** As a borrower, I want to view my financial reputation and history professionally, so that I can understand my standing and track my progress.

#### Acceptance Criteria

1. THE Reputation_Engine SHALL display total number of completed loans
2. THE Reputation_Engine SHALL show count of on-time payments made
3. THE Reputation_Engine SHALL display count of late payments with clear distinction
4. WHEN a user has current loans, THE Reputation_Engine SHALL show current obligations and total outstanding debt
5. THE Reputation_Engine SHALL display total amount repaid across all completed loans
6. WHEN showing repayment history, THE Reputation_Engine SHALL display chronological timeline of all loan activities
7. THE Reputation_Engine SHALL present information in professional business format without gamification elements
8. WHEN reputation data is unavailable, THE Reputation_Engine SHALL display appropriate empty states with clear messaging

### Requirement 4: Progressive Blockchain Integration

**User Story:** As a user, I want to access blockchain technical details when needed, so that I can verify transactions and understand the underlying technology without being overwhelmed.

#### Acceptance Criteria

1. THE Blockchain_Explorer SHALL display current network name and chain ID
2. WHERE contract is deployed, THE Blockchain_Explorer SHALL show contract address with copy functionality
3. WHEN real transactions exist, THE Blockchain_Explorer SHALL display actual transaction hashes
4. THE Blockchain_Explorer SHALL provide links to external blockchain explorers when available
5. THE Blockchain_Explorer SHALL hide technical details behind expandable disclosure UI elements
6. THE Blockchain_Explorer SHALL never display fake or placeholder transaction hashes as real transactions
7. WHEN blockchain data is unavailable, THE Blockchain_Explorer SHALL show appropriate loading or unavailable states
8. WHERE technical details are shown, THE Blockchain_Explorer SHALL provide clear labels and context for each piece of information

### Requirement 5: Loan Status Tracking

**User Story:** As a user, I want to track loan status changes accurately, so that I understand the current state and next steps in the loan process.

#### Acceptance Criteria

1. WHEN a loan is requested, THE Loan_System SHALL display "Requested" status with pending approval indication
2. WHEN a loan is approved, THE Loan_System SHALL show "Approved" status and prompt for stake locking
3. WHEN stake is locked, THE Loan_System SHALL display "Stake Locked" status and show disbursement progress
4. WHEN funds are disbursed, THE Loan_System SHALL show "Disbursed" status with repayment schedule
5. WHEN repayments are made, THE Loan_System SHALL show "Repayment" status with progress indicators
6. WHEN a loan is fully repaid, THE Loan_System SHALL display "Completed" status and stake unlock confirmation
7. IF a loan defaults, THE Loan_System SHALL show "Defaulted" status with relevant actions

### Requirement 6: Pool Metrics Calculation

**User Story:** As a system administrator, I want pool metrics calculated accurately, so that users see correct financial information.

#### Acceptance Criteria

1. WHEN calculating utilization rate, THE Pool_Dashboard SHALL use the formula: (active loans / total deposits) * 100
2. WHEN calculating available liquidity, THE Pool_Dashboard SHALL use: total deposits - active loans - reserve requirement
3. WHEN calculating reserve ratio, THE Pool_Dashboard SHALL use: (reserve fund / total deposits) * 100
4. THE Pool_Dashboard SHALL update all calculations when underlying data changes
5. WHEN displaying percentages, THE Pool_Dashboard SHALL round to appropriate decimal places for readability
6. THE Pool_Dashboard SHALL validate that calculated values are mathematically consistent

### Requirement 7: Repayment History Parsing

**User Story:** As a borrower, I want to see detailed repayment history, so that I can track my payment patterns and plan future payments.

#### Acceptance Criteria

1. WHEN displaying repayment records, THE Loan_System SHALL show payment date, amount, and remaining balance after each payment
2. WHEN payments are late, THE Loan_System SHALL indicate lateness with clear visual indicators
3. THE Loan_System SHALL calculate and display total interest paid and principal paid separately
4. WHEN showing payment schedule, THE Loan_System SHALL indicate upcoming due dates
5. THE Loan_System SHALL provide export functionality for repayment history
6. WHEN partial payments are made, THE Loan_System SHALL show how partial amounts are allocated between principal and interest

### Requirement 8: Visual Pool Composition

**User Story:** As a user, I want to see pool composition visually, so that I can quickly understand how funds are allocated.

#### Acceptance Criteria

1. THE Pool_Dashboard SHALL provide graphical representation showing pool fund allocation
2. WHEN displaying visual composition, THE Pool_Dashboard SHALL use distinct colors for deposits, active loans, available liquidity, and reserves  
3. THE Pool_Dashboard SHALL include percentage labels on visual elements
4. WHEN pool composition changes, THE Pool_Dashboard SHALL animate transitions smoothly
5. THE Pool_Dashboard SHALL be accessible with appropriate alt text and labels for screen readers
6. WHERE space is limited, THE Pool_Dashboard SHALL provide responsive design that maintains clarity
