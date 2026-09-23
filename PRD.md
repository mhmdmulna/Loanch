# Loanch — Technical Product Requirements Document (PRD)

> **Loan + Chain**  
> Technical implementation plan for the Loanch hackathon MVP.

---

## 1. Document Purpose

Dokumen ini merupakan acuan teknikal untuk pengembangan **Loanch**, sebuah platform keuangan berbasis blockchain yang menggabungkan mekanisme simpan-pinjam dengan smart contract.

Dokumen ini tidak menggantikan `Loanch.md`.

- `Loanch.md` = source of truth untuk konsep produk, aturan bisnis, dan gambaran high-level.
- `PRD.md` = source of truth untuk implementasi teknikal.

Jika terjadi konflik antara detail teknikal di dokumen ini dengan aturan bisnis di `Loanch.md`, aturan bisnis di `Loanch.md` harus dipertahankan dan implementasi teknikal harus menyesuaikan.

---

## 2. Product Goal

Membangun MVP Loanch yang memungkinkan:

1. User menghubungkan wallet.
2. User berinteraksi dengan BOT Chain.
3. Saver melakukan deposit ke loan pool.
4. Sistem menyisihkan liquidity reserve.
5. Borrower mengajukan pinjaman.
6. Sistem memeriksa eligibility sederhana.
7. Borrower mengunci stake.
8. Smart contract mencairkan pinjaman.
9. Borrower melakukan repayment.
10. Smart contract memperbarui status loan.
11. Stake dibuka kembali setelah loan selesai.
12. Return didistribusikan sesuai aturan sistem.
13. User dapat melihat transparansi kondisi pool melalui dashboard.

MVP harus berfungsi end-to-end dan dapat didemonstrasikan pada jaringan BOT Chain.

---

## 3. Technical Principles

### 3.1 Blockchain Where Blockchain Matters

Blockchain digunakan untuk data dan aturan yang membutuhkan:

- verifiability,
- shared state,
- programmable transactions,
- asset movement,
- financial state,
- transaction history.

Tidak semua data harus disimpan on-chain.

### 3.2 Private Data Stays Off-Chain

Data seperti:

- dokumen identitas,
- alamat,
- informasi personal,
- raw income data,

tidak disimpan langsung di blockchain.

Smart contract hanya menerima hasil yang dibutuhkan untuk keputusan sistem, misalnya:

```text
identityVerified = true
riskScore = 82
incomeVerified = true
```

### 3.3 Business Rules Must Be Deterministic

Aturan seperti:

- reserve ratio,
- loan eligibility,
- staking requirement,
- repayment,
- loan state,
- profit distribution,

harus memiliki hasil yang deterministic dan dapat diuji.

### 3.4 Smart Contract Accounting First

Untuk Loanch, correctness pada accounting lebih penting daripada banyaknya fitur.

Setiap perubahan finansial harus menghasilkan state yang konsisten.

### 3.5 Incremental Development

Development dilakukan per fitur:

```text
Implement
   ↓
Compile
   ↓
Unit Test
   ↓
Security Check
   ↓
Frontend Integration
   ↓
End-to-End Test
```

Tidak mengimplementasikan seluruh sistem sekaligus.

---

# 4. MVP Scope

## 4.1 In Scope

MVP harus mencakup:

### User

- Connect wallet.
- Detect wallet address.
- Detect current blockchain network.
- Switch ke BOT Chain.
- Display transaction status.

### Saver

- Deposit asset.
- Melihat posisi deposit.
- Melihat estimated/accumulated return.
- Request withdrawal.
- Withdrawal jika liquidity tersedia.

### Borrower

- Mendapat status identity verification sederhana.
- Mendapat risk eligibility sederhana.
- Mengunci stake.
- Mengajukan loan.
- Mendapat loan jika memenuhi rules.
- Melakukan repayment.
- Melihat loan status.
- Mendapat stake kembali setelah loan selesai.

### Pool

- Total deposits.
- Available liquidity.
- Reserve.
- Active lending amount.
- Active loans.

### Lending

- Loan request.
- Loan eligibility check.
- Loan creation.
- Loan disbursement.
- Partial repayment.
- Full repayment.
- Loan completion.

### Distribution

- Profit allocation.
- Saver return allocation.
- Platform allocation.
- Reserve allocation.

### Dashboard

Menampilkan sekurang-kurangnya:

- total pool,
- available liquidity,
- reserve,
- active loans,
- wallet balance/position,
- loan status,
- recent user transactions.

---

## 4.2 Out of Scope for Hackathon MVP

Tidak perlu membangun:

- credit scoring berbasis machine learning,
- integrasi bank nyata,
- fiat settlement,
- legal enforcement,
- production-grade Know Your Customer,
- real-world asset integration,
- complex liquidation engine,
- sophisticated oracle network,
- cross-chain lending,
- governance protocol,
- dynamic interest-rate market,
- advanced tokenomics.

Jika dibutuhkan untuk demo, fitur external verification boleh menggunakan mock atau admin-controlled verification.

---

# 5. Recommended Tech Stack

## 5.1 Frontend

```text
React
TypeScript
Vite
Tailwind CSS
```

Responsibilities:

- user interface,
- dashboard,
- saver flow,
- borrower flow,
- transaction status,
- contract data visualization.

---

## 5.2 Web3 Integration

Recommended:

```text
ethers.js
MetaMask
```

Responsibilities:

- wallet connection,
- network detection,
- network switching,
- smart contract reads,
- smart contract writes,
- transaction receipt tracking.

Alternative:

```text
wagmi
viem
```

Jika menggunakan `ethers.js`, tidak perlu menambahkan `wagmi + viem` kecuali terdapat kebutuhan spesifik.

---

## 5.3 Smart Contract

```text
Solidity
OpenZeppelin Contracts
```

Solidity digunakan untuk seluruh core financial rules.

OpenZeppelin digunakan untuk reusable security primitives jika relevan, seperti:

- access control,
- pausable mechanism,
- reentrancy protection,
- token interfaces.

---

## 5.4 Smart Contract Development

```text
Hardhat
Chai
```

Hardhat digunakan untuk:

- compile,
- local development,
- deployment scripts,
- test execution.

Chai digunakan sebagai assertion library di automated tests.

Contoh:

```javascript
expect(poolBalance).to.equal(expectedBalance)
```

---

## 5.5 Security Tooling

```text
Slither
```

Digunakan untuk static analysis Solidity.

Security review tetap harus dilakukan secara manual terhadap business logic dan accounting.

---

## 5.6 Blockchain

```text
BOT Chain
```

BOT Chain merupakan target deployment untuk hackathon.

Konfigurasi jaringan disimpan melalui environment/configuration dan tidak di-hardcode ke business logic.

---

## 5.7 Deployment

Frontend:

```text
Vercel
```

Alternatif:

```text
Netlify
GitHub Pages
```

Smart contract:

```text
Hardhat
+
Remix IDE untuk final deployment/compliance workflow
```

---

## 5.8 Optional Off-Chain Layer

Jika dibutuhkan:

```text
Node.js
TypeScript
Supabase / PostgreSQL
```

Digunakan hanya untuk data yang tidak sesuai disimpan on-chain seperti:

- identity verification status source,
- private metadata,
- raw risk inputs,
- user profile metadata.

Untuk MVP sederhana, layer ini dapat diganti dengan mock verification.

---

# 6. High-Level Architecture

```text
┌─────────────────────────────────────────────────────┐
│                    USER BROWSER                     │
│                                                     │
│  React + TypeScript + Tailwind                      │
│                                                     │
│  ┌──────────────┐       ┌────────────────────────┐  │
│  │ UI / Pages   │──────▶│ Web3 Integration      │  │
│  │              │       │ wagmi + viem          │  │
│  └──────────────┘       └───────────┬────────────┘  │
└─────────────────────────────────────┼───────────────┘
                                      │
                                   MetaMask
                                      │
                                      ▼
┌─────────────────────────────────────────────────────┐
│                     BOT CHAIN                       │
│                                                     │
│                 LOANCH CONTRACTS                    │
│                                                     │
│  Deposit                                            │
│  Pool Accounting                                    │
│  Reserve                                            │
│  Lending                                            │
│  Staking                                            │
│  Repayment                                          │
│  Distribution                                       │
│                                                     │
└───────────────────────┬─────────────────────────────┘
                        │
                        │ optional verified result
                        ▼
┌─────────────────────────────────────────────────────┐
│                 OFF-CHAIN SERVICE                   │
│                                                     │
│  Identity Verification / Risk Input                 │
│  Node.js + TypeScript                               │
│  Supabase                                           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

# 7. On-Chain vs Off-Chain Responsibility

## 7.1 On-Chain

Smart contract bertanggung jawab atas:

- deposits,
- pool accounting,
- reserve accounting,
- withdrawal rules,
- loan state,
- loan principal,
- repayment amount,
- remaining debt,
- staking,
- stake unlock,
- stake slash jika diimplementasikan,
- financial state transitions,
- profit distribution,
- important financial events.

---

## 7.2 Off-Chain

Off-chain system bertanggung jawab atas:

- raw identity documents,
- sensitive personal information,
- raw income data,
- verification workflow,
- complex risk analysis,
- private user metadata.

Smart contract tidak perlu mengetahui data mentah tersebut.

Smart contract cukup menerima nilai seperti:

```text
verified
risk score
eligibility flag
```

---

# 8. Smart Contract Architecture

Untuk MVP, arsitektur contract sebaiknya tidak dibuat terlalu terfragmentasi.

Recommended initial structure:

```text
LoanchPool.sol
│
├── deposit
├── withdrawal
├── reserve accounting
├── available liquidity
│
├── borrower verification state
├── loan request
├── loan creation
├── disbursement
│
├── staking
├── repayment
├── loan completion
│
└── profit distribution
```

Jika contract menjadi terlalu besar, logic dapat dipisahkan kemudian.

Potential future split:

```text
LoanchPool.sol
LoanchLending.sol
LoanchStaking.sol
LoanchIdentity.sol
```

Namun modularisasi tidak boleh dilakukan hanya demi arsitektur jika menambah kompleksitas hackathon.

---

# 9. Core Smart Contract State

Contoh state minimal.

## 9.1 Saver Position

```solidity
struct SaverPosition {
    uint256 depositedAmount;
    uint256 withdrawableAmount;
    uint256 accumulatedReturn;
}
```

---

## 9.2 Loan

```solidity
enum LoanStatus {
    None,
    Requested,
    Active,
    Completed,
    Defaulted
}
```

```solidity
struct Loan {
    uint256 id;
    address borrower;
    uint256 principal;
    uint256 totalRepayment;
    uint256 amountPaid;
    uint256 remainingDebt;
    uint256 dueDate;
    uint256 stakeAmount;
    LoanStatus status;
}
```

Exact fields dapat disesuaikan selama tidak mengubah aturan bisnis.

---

## 9.3 Borrower Eligibility

Minimal state:

```solidity
struct BorrowerProfile {
    bool identityVerified;
    uint256 riskScore;
    uint256 reputation;
}
```

Untuk hackathon, verification dapat diatur oleh trusted/admin address.

---

# 10. Core Contract Functions

Minimum target interface:

```solidity
function deposit(uint256 amount) external;
```

```solidity
function requestWithdrawal(uint256 amount) external;
```

```solidity
function withdraw() external;
```

```solidity
function stake(uint256 amount) external;
```

```solidity
function requestLoan(
    uint256 amount,
    uint256 duration
) external;
```

```solidity
function repayLoan(
    uint256 loanId,
    uint256 amount
) external;
```

Read functions:

```solidity
function getPoolStats() external view returns (...);
```

```solidity
function getSaverPosition(address user) external view returns (...);
```

```solidity
function getLoan(uint256 loanId) external view returns (...);
```

```solidity
function getBorrowerProfile(address user) external view returns (...);
```

Admin / verification function jika dibutuhkan:

```solidity
function setBorrowerVerification(
    address user,
    bool verified,
    uint256 riskScore
) external;
```

Exact naming dapat berubah, tetapi responsibility harus dipertahankan.

---

# 11. Contract Events

Semua financial action penting harus menghasilkan event.

Recommended:

```solidity
event Deposited(
    address indexed saver,
    uint256 amount
);
```

```solidity
event WithdrawalRequested(
    address indexed saver,
    uint256 amount
);
```

```solidity
event Withdrawn(
    address indexed saver,
    uint256 amount
);
```

```solidity
event StakeLocked(
    address indexed borrower,
    uint256 amount
);
```

```solidity
event LoanRequested(
    uint256 indexed loanId,
    address indexed borrower,
    uint256 amount
);
```

```solidity
event LoanDisbursed(
    uint256 indexed loanId,
    address indexed borrower,
    uint256 amount
);
```

```solidity
event LoanRepaid(
    uint256 indexed loanId,
    uint256 amount,
    uint256 remainingDebt
);
```

```solidity
event LoanCompleted(
    uint256 indexed loanId
);
```

```solidity
event StakeUnlocked(
    address indexed borrower,
    uint256 amount
);
```

Events digunakan untuk:

- transparency,
- frontend updates,
- transaction history,
- debugging,
- explorer visibility.

---

# 12. Pool Accounting

Core variables:

```text
totalDeposits
availableLiquidity
reserveAmount
activeLoanPrincipal
platformRevenue
```

Conceptual accounting:

```text
Deposit
  ↓
Total Pool
  ├── Available Lending Liquidity
  └── Reserve
```

Loan disbursement:

```text
Available Liquidity
      ↓
  Active Loan
```

Repayment:

```text
Borrower
   ↓
Repayment
   ↓
Principal → Pool
Return    → Distribution
```

Accounting implementation harus diuji menggunakan invariant tests.

---

# 13. Core Financial Invariants

Contract tidak boleh melanggar rules berikut.

### Pool

```text
availableLiquidity >= 0
reserveAmount >= 0
```

### Withdrawal

```text
withdrawAmount <= saver available balance
```

### Lending

```text
newLoan <= available lending capacity
```

### Loan

```text
remainingDebt >= 0
```

Completed loan:

```text
remainingDebt == 0
status == Completed
```

### Stake

Active loan:

```text
stakeLocked == true
```

Completed loan:

```text
stakeLocked == false
```

### Double Execution Protection

Tidak boleh terjadi:

```text
double withdrawal
double loan disbursement
double repayment after completion
double stake unlock
```

---

# 14. Loan State Machine

```text
REQUESTED
    │
    │ eligibility passed
    ▼
ACTIVE
    │
    ├── repayment complete
    │        ↓
    │    COMPLETED
    │
    └── default condition
             ↓
         DEFAULTED
```

State transition yang tidak valid harus di-revert.

Contoh:

```text
Completed → Active
```

tidak boleh terjadi.

```text
Defaulted → Requested
```

tidak boleh terjadi pada loan yang sama.

---

# 15. Saver Flow — Technical

```text
User
 ↓
Connect MetaMask
 ↓
Check BOT Chain
 ↓
Enter Deposit Amount
 ↓
Approve Asset if Required
 ↓
deposit()
 ↓
MetaMask Confirmation
 ↓
Transaction Pending
 ↓
Transaction Confirmed
 ↓
Refresh Saver Position
 ↓
Refresh Pool Stats
```

Frontend harus memberikan state:

```text
idle
wallet-required
wrong-network
awaiting-signature
pending
success
error
```

---

# 16. Borrower Flow — Technical

```text
Connect Wallet
 ↓
Verification Status
 ↓
Eligibility Status
 ↓
Stake Asset
 ↓
requestLoan()
 ↓
Smart Contract Validation
 ↓
Loan Created
 ↓
Loan Disbursed
 ↓
Loan Active
```

Contract harus mengecek setidaknya:

```text
identity verified
risk threshold
minimum stake
loan limit
available liquidity
```

---

# 17. Repayment Flow

```text
Borrower
 ↓
Select Active Loan
 ↓
Input Repayment Amount
 ↓
repayLoan()
 ↓
Update amountPaid
 ↓
Update remainingDebt
 ↓
remainingDebt == 0 ?
 ↓ yes
Loan Completed
 ↓
Stake Unlocked
 ↓
Reputation Updated
```

Partial repayment harus tetap mempertahankan loan dalam status active.

---

# 18. Profit Distribution

Untuk MVP, distribution logic mengikuti parameter yang telah ditetapkan oleh Loanch.

Conceptual:

```text
Repayment Return
      │
      ├── Saver Allocation
      ├── Platform Allocation
      └── Reserve Allocation
```

Parameter distribution harus:

- tersimpan secara eksplisit,
- diuji,
- tidak menghasilkan total allocation > 100%.

Gunakan basis point atau constant denominator untuk menghindari floating point.

Contoh:

```solidity
uint256 constant BPS = 10_000;
```

```text
8000 = 80%
1500 = 15%
500  = 5%
```

---

# 19. Token / Asset Strategy for MVP

Smart contract sebaiknya menggunakan asset berbasis token standar untuk memudahkan:

- deposits,
- loan transfer,
- repayment,
- staking,
- balance accounting.

Untuk development/test:

```text
MockToken.sol
```

dapat digunakan.

Mock token hanya digunakan untuk testing/demo jika sesuai environment hackathon.

Tidak menggunakan nilai Rupiah langsung sebagai unit Solidity.

UI boleh menampilkan equivalent value untuk kebutuhan demo.

---

# 20. Frontend Architecture

Recommended:

```text
src/
├── app/
├── components/
├── pages/
├── hooks/
├── contracts/
├── config/
├── services/
├── types/
└── utils/
```

---

## 20.1 Pages

Recommended MVP pages:

```text
/
Dashboard

/saver
Saver Dashboard

/borrow
Borrower Dashboard

/loans/:id
Loan Detail
```

---

## 20.2 Components

Potential components:

```text
ConnectWalletButton
NetworkGuard
PoolStats
DepositForm
WithdrawalForm
SaverPositionCard
LoanRequestForm
StakeForm
LoanCard
RepaymentForm
TransactionStatus
```

---

# 21. Web3 Frontend Layer

Recommended hooks:

```text
useWallet
useNetwork
usePoolStats
useSaverPosition
useDeposit
useWithdrawal
useBorrowerProfile
useRequestLoan
useLoan
useRepayLoan
```

Frontend components tidak perlu memanggil low-level contract methods secara langsung jika dapat dibungkus dalam hooks.

Example:

```text
DepositForm
    ↓
useDeposit()
    ↓
wagmi
    ↓
viem
    ↓
Loanch Contract
```

---

# 22. Contract Configuration

Frontend harus memisahkan contract configuration dari UI.

Example:

```text
src/contracts/
├── abi/
│   └── Loanch.json
├── addresses.ts
└── config.ts
```

Example:

```typescript
export const LOANCH_CONTRACT_ADDRESS =
  import.meta.env.VITE_LOANCH_CONTRACT_ADDRESS
```

Contract address tidak di-hardcode di banyak file.

---

# 23. Environment Variables

Example `.env.example`:

```bash
VITE_BOT_CHAIN_RPC_URL=
VITE_BOT_CHAIN_CHAIN_ID=
VITE_LOANCH_CONTRACT_ADDRESS=
```

Jika menggunakan backend:

```bash
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

Jika deploy script membutuhkan private key:

```bash
DEPLOYER_PRIVATE_KEY=
```

Private key:

- tidak boleh di-commit,
- tidak boleh dimasukkan README,
- tidak boleh disimpan di source code.

---

# 24. Repository Structure

Recommended:

```text
loanch/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.example
│
├── contracts/
│   ├── LoanchPool.sol
│   └── MockToken.sol
│
├── test/
│   ├── deposit.test.ts
│   ├── lending.test.ts
│   ├── staking.test.ts
│   ├── repayment.test.ts
│   └── distribution.test.ts
│
├── scripts/
│   └── deploy.ts
│
├── hardhat.config.ts
│
├── Loanch.md
├── PRD.md
├── AGENTS.md
├── README.md
├── package.json
└── .gitignore
```

---

# 25. Codex Development Rules

Codex harus membaca:

```text
Loanch.md
PRD.md
AGENTS.md
```

sebelum melakukan perubahan besar.

Recommended instruction:

```text
Loanch.md is the source of truth for business rules.

PRD.md is the source of truth for technical architecture.

Do not change product scope or financial rules unless explicitly requested.

When changing smart contract logic:
1. explain the affected invariant,
2. update tests,
3. run tests,
4. run security checks.
```

---

# 26. Testing Strategy

Testing dibagi menjadi beberapa level.

---

## 26.1 Smart Contract Unit Tests

Tool:

```text
Hardhat
Chai
```

Minimum test cases:

### Deposit

```text
deposit succeeds
zero deposit rejected
pool increases correctly
reserve calculated correctly
saver position updated
```

### Withdrawal

```text
withdraw within balance
withdraw above balance rejected
withdraw when liquidity insufficient
double withdrawal rejected
```

### Borrower

```text
unverified borrower rejected
risk requirement failure rejected
insufficient stake rejected
```

### Loan

```text
loan request succeeds
insufficient liquidity rejected
loan amount recorded correctly
disbursement happens once
```

### Repayment

```text
partial repayment
full repayment
remaining debt correct
overpayment handled
completed loan cannot repay again
```

### Stake

```text
stake locked
stake unavailable during active loan
stake unlocked after completion
```

### Distribution

```text
saver allocation correct
platform allocation correct
reserve allocation correct
total allocation equals expected amount
```

---

# 27. Integration Testing

Integration test harus menguji complete financial flow.

Example:

```text
Saver deposits 1000
 ↓
Reserve created
 ↓
Borrower verified
 ↓
Borrower stakes
 ↓
Borrower requests 500
 ↓
Loan approved
 ↓
500 transferred
 ↓
Borrower repays
 ↓
Loan completed
 ↓
Stake unlocked
 ↓
Return distributed
```

Setelah flow selesai, seluruh accounting harus konsisten.

---

# 28. End-to-End Testing

Recommended:

```text
Playwright
```

End-to-end testing untuk frontend:

```text
Open application
 ↓
Connect wallet
 ↓
Check BOT Chain
 ↓
Deposit
 ↓
Confirm transaction
 ↓
Pool updated
```

Borrower flow:

```text
Connect wallet
 ↓
Check eligibility
 ↓
Stake
 ↓
Request loan
 ↓
Loan visible
 ↓
Repay
 ↓
Loan completed
```

Wallet confirmation tertentu dapat tetap membutuhkan manual interaction tergantung testing setup.

---

# 29. Security Requirements

Setiap Solidity change harus diperiksa terhadap:

- reentrancy,
- access control,
- unauthorized withdrawal,
- unauthorized admin action,
- double execution,
- incorrect accounting,
- integer rounding,
- invalid state transitions,
- unsafe external calls,
- denial-of-service conditions,
- insufficient validation.

Recommended tooling:

```text
Slither
```

Slither bukan pengganti manual review.

---

# 30. Access Control

Jika terdapat privileged action seperti:

```text
verify borrower
update risk score
pause contract
```

harus menggunakan explicit role/access control.

Tidak menggunakan:

```text
tx.origin
```

untuk authorization.

---

# 31. Reentrancy Protection

Function yang memindahkan asset harus mengikuti:

```text
Checks
 ↓
Effects
 ↓
Interactions
```

Jika diperlukan, gunakan OpenZeppelin reentrancy protection.

Contoh area yang perlu perhatian khusus:

```text
withdraw
loan disbursement
repayment distribution
stake return
```

---

# 32. Error Handling

Recommended menggunakan custom errors jika sesuai.

Example:

```solidity
error InsufficientLiquidity();
error NotVerified();
error InsufficientStake();
error InvalidLoanState();
```

Frontend harus menerjemahkan error menjadi user-readable message.

Example:

```text
InsufficientLiquidity
→
"Pool currently does not have enough available liquidity."
```

---

# 33. Network Handling

Frontend harus:

1. mendeteksi chain aktif,
2. mengetahui apakah user berada di BOT Chain,
3. mencegah transaction jika chain salah,
4. menyediakan action untuk switch network.

Conceptual:

```text
Wallet Connected?
      ↓
Correct Chain?
   ↓        ↓
  Yes       No
   ↓         ↓
Enable    Request
Actions   Network Switch
```

---

# 34. Deployment Strategy

## 34.1 Local Development

```text
Hardhat Local Network
```

Flow:

```text
compile
deploy local
run tests
connect frontend
```

---

## 34.2 BOT Chain Deployment

Final deployment:

```text
Solidity Contract
      ↓
Compile
      ↓
Deploy
      ↓
BOT Chain
      ↓
Contract Address
      ↓
Frontend Config
```

Remix dapat digunakan untuk final deployment sesuai workflow hackathon.

Hardhat tetap digunakan selama development dan automated testing.

---

# 35. Deployment Outputs

Setelah deployment, dokumentasikan:

```text
Network
Chain ID
Contract Address
Deployment Transaction
Explorer URL
Frontend URL
Repository URL
```

README harus memiliki bagian deployment.

---

# 36. Frontend Deployment

Recommended:

```text
Vercel
```

Build command:

```bash
npm run build
```

atau equivalent package manager yang digunakan.

Production environment harus memiliki:

```text
BOT Chain configuration
Loanch contract address
```

---

# 37. Observability for MVP

Tidak perlu production observability kompleks.

Minimal:

Frontend:

```text
console errors during development
transaction status
contract revert reason
```

Blockchain:

```text
events
transaction hash
block explorer
```

Important events harus dapat digunakan untuk tracing demo.

---

# 38. Development Workflow

Recommended development sequence:

```text
PHASE 1
Project Setup

        ↓

PHASE 2
Core Solidity Contract

        ↓

PHASE 3
Unit Tests

        ↓

PHASE 4
Security Review

        ↓

PHASE 5
Frontend Mock UI

        ↓

PHASE 6
Wallet Integration

        ↓

PHASE 7
Contract Integration

        ↓

PHASE 8
Identity / Eligibility Layer

        ↓

PHASE 9
End-to-End Testing

        ↓

PHASE 10
BOT Chain Deployment

        ↓

PHASE 11
Production Frontend Deployment

        ↓

PHASE 12
Submission Verification
```

---

# 39. Phase 1 — Project Setup

Tasks:

```text
Initialize repository
Initialize frontend
Initialize Hardhat
Install OpenZeppelin
Configure linting
Configure environment variables
Add Loanch.md
Add PRD.md
Add AGENTS.md
```

Definition of Done:

```text
frontend starts locally
Hardhat compiles sample contract
repository structure ready
```

---

# 40. Phase 2 — Core Solidity

Implement:

```text
MockToken
Deposit
Saver Position
Pool
Reserve
Borrower Profile
Stake
Loan Request
Loan Creation
Disbursement
Repayment
Loan Completion
Distribution
```

Tidak mengintegrasikan frontend pada fase ini.

---

# 41. Phase 3 — Smart Contract Testing

Target:

```text
all core financial flows covered
all failure scenarios covered
all state transitions tested
```

No unresolved failing test sebelum lanjut.

---

# 42. Phase 4 — Security Pass

Actions:

```text
manual contract review
run Slither
review access control
review external calls
review state transitions
review financial invariants
```

Tidak menambah fitur baru pada fase ini kecuali dibutuhkan untuk memperbaiki vulnerability.

---

# 43. Phase 5 — Frontend Mock UI

Build UI menggunakan mock data.

Pages:

```text
Dashboard
Saver
Borrower
Loan Detail
```

Tujuan:

memastikan UX dapat dibangun tanpa tergantung blockchain integration.

---

# 44. Phase 6 — Wallet Integration

Implement:

```text
MetaMask connect
wallet state
BOT Chain detection
network switch
wallet address display
```

Tidak melakukan seluruh contract integration sekaligus.

---

# 45. Phase 7 — Contract Integration

Integrasikan satu per satu.

Sequence:

```text
1. Read pool stats
2. Deposit
3. Read saver position
4. Withdrawal
5. Read borrower profile
6. Stake
7. Loan request
8. Read loan state
9. Repayment
10. Distribution state
```

Setiap satu integration:

```text
implement
test
fix
commit
```

baru lanjut.

---

# 46. Phase 8 — Verification Layer

Untuk MVP, verification dapat menggunakan trusted/admin workflow.

Example:

```text
User identity mock verified
      ↓
Admin / Verification Service
      ↓
setBorrowerVerification()
      ↓
Contract
```

Production-grade Know Your Customer tidak diperlukan.

---

# 47. Phase 9 — Full End-to-End Test

Complete scenario:

```text
Saver A deposit
Saver B deposit
      ↓
Pool created
      ↓
Reserve allocated
      ↓
Borrower verified
      ↓
Borrower stakes
      ↓
Loan requested
      ↓
Loan disbursed
      ↓
Partial repayment
      ↓
Final repayment
      ↓
Loan completed
      ↓
Stake unlocked
      ↓
Return distributed
```

Semua UI dan contract state harus sinkron.

---

# 48. Phase 10 — BOT Chain Deployment

Checklist:

```text
contracts compile
tests pass
Slither reviewed
deployment wallet ready
BOT Chain configured
contract deployed
contract address recorded
explorer verification checked if available
```

---

# 49. Phase 11 — Production Frontend

Tasks:

```text
set production contract address
set BOT Chain network config
build frontend
deploy frontend
test live environment
```

---

# 50. Phase 12 — Submission Verification

Checklist:

```text
[ ] Solidity source available
[ ] Contract deployed to BOT Chain
[ ] Contract address documented
[ ] Frontend connected to deployed contract
[ ] Wallet connection works
[ ] BOT Chain detection works
[ ] Deposit works
[ ] Loan flow works
[ ] Repayment works
[ ] Public frontend URL works
[ ] Repository accessible
[ ] README complete
[ ] Deployment information documented
[ ] Demo scenario tested
```

---

# 51. Suggested Codex Workflow

Codex tidak diberikan task seperti:

```text
"Build the entire Loanch application."
```

Gunakan incremental prompt.

Example:

```text
Read Loanch.md and PRD.md.

Implement only the deposit and pool accounting
logic in Solidity.

Do not implement lending yet.

Add tests for:
- successful deposit
- zero deposit
- multiple savers
- reserve calculation

Run all tests before finishing.
```

Kemudian:

```text
Read Loanch.md and PRD.md.

Implement loan request and eligibility checking.

Do not modify deposit behavior.

Update tests and run the complete suite.
```

Pattern:

```text
Read Context
     ↓
Implement Small Scope
     ↓
Run
     ↓
Test
     ↓
Review Diff
     ↓
Fix
     ↓
Commit
```

---

# 52. Recommended MCP Setup

High priority:

```text
GitHub MCP
Context7 MCP
OpenZeppelin Contracts MCP
Playwright MCP
```

Optional:

```text
Supabase MCP
Chrome DevTools MCP
```

Responsibilities:

### GitHub MCP

```text
repository
commits
issues
pull requests
code review context
```

### Context7 MCP

```text
latest library documentation
wagmi
viem
Hardhat
React
OpenZeppelin
```

### OpenZeppelin Contracts MCP

```text
Solidity patterns
OpenZeppelin primitives
contract implementation guidance
```

### Playwright MCP

```text
browser interaction
UI testing
end-to-end validation
```

### Supabase MCP

```text
off-chain database
identity metadata
private application data
```

---

# 53. Recommended Skills

Recommended project skills:

```text
loanch-domain
loanch-smart-contract
loanch-testing
solidity-security-review
contract-invariant-checker
web3-frontend
bot-chain
hackathon-submission
```

Priority:

```text
1. loanch-domain
2. loanch-smart-contract
3. loanch-testing
4. bot-chain
```

---

# 54. Definition of Done — MVP

Loanch MVP dianggap selesai jika:

### Smart Contract

```text
deposit works
pool accounting correct
reserve accounting correct
loan request works
eligibility rules work
staking works
disbursement works
repayment works
loan completion works
stake unlock works
distribution works
```

### Frontend

```text
wallet connect works
BOT Chain detection works
pool dashboard works
saver flow works
borrower flow works
transaction states visible
```

### Testing

```text
unit tests pass
integration flow passes
critical invariants tested
Slither reviewed
```

### Deployment

```text
contract deployed on BOT Chain
frontend deployed publicly
frontend uses deployed contract
```

### Documentation

```text
README complete
contract address documented
setup documented
deployment documented
demo flow documented
```

---

# 55. Final Technical Architecture

```text
                        LOANCH
                           │
                           ▼
                React + TypeScript + Vite
                           │
                      Tailwind CSS
                           │
                           ▼
                     wagmi + viem
                           │
                           ▼
                        MetaMask
                           │
                           ▼
                       BOT Chain
                           │
                           ▼
                    Solidity Contracts
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
       Saver            Lending          Staking
          │                │                │
          └────────┬───────┴────────┬───────┘
                   │                │
                   ▼                ▼
               Loan Pool        Repayment
                   │                │
                   ▼                ▼
                Reserve        Distribution
                                    │
                         ┌──────────┼──────────┐
                         ▼          ▼          ▼
                       Saver     Platform    Reserve


Optional Off-Chain Layer
─────────────────────────────────────────────

Identity / Risk Service
          │
          ▼
Node.js + TypeScript
          │
          ▼
Supabase
          │
          ▼
Verified Result / Risk Score
          │
          ▼
Loanch Smart Contract
```

---

# 56. Summary

Technical direction untuk Loanch MVP:

```text
Frontend
React + TypeScript + Vite + Tailwind

Web3
wagmi + viem + MetaMask

Smart Contract
Solidity + OpenZeppelin

Development
Hardhat + Chai

Security
Slither + manual invariant review

Blockchain
BOT Chain

Deployment
Remix / Hardhat → BOT Chain
Vercel → Frontend

Optional Off-Chain
Node.js + TypeScript + Supabase
```

Prioritas engineering:

```text
Correctness
   ↓
Security
   ↓
End-to-End Functionality
   ↓
UX
   ↓
Additional Features
```

Loanch harus terlebih dahulu memiliki financial state yang benar dan dapat diuji sebelum menambah kompleksitas lain.
