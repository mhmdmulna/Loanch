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
6. Sistem memeriksa identitas dan kelayakan risiko.
7. Borrower mengunci stake sebelum loan request.
8. Smart contract mencairkan pinjaman.
9. Borrower melakukan repayment.
10. Smart contract memperbarui status loan.
11. Stake dibuka kembali setelah loan selesai.
12. Return didistribusikan sesuai aturan sistem.
13. Loan yang melewati masa tenggang dapat ditandai default, dengan pemotongan stake, penggunaan cadangan, kerugian Saver, dan penalti reputasi.
14. User dapat melihat transparansi kondisi pool melalui dashboard.

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
Select One Phase
   ↓
Implement Only That Scope
   ↓
Compile + Unit Test
   ↓
Run Existing Regression Tests
   ↓
Review Accounting and Security
   ↓
Publish Contract Handoff Artifacts
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

- Menggunakan identitas terverifikasi yang sama dengan Borrower.
- Deposit asset.
- Melihat posisi deposit.
- Melihat estimated/accumulated return.
- Withdrawal langsung saat likuiditas cukup; jika kurang transaksi revert tanpa state pending.

### Borrower

- Mendapat status identity verification sederhana.
- Mendapat risk eligibility sederhana.
- Mengunci stake sebelum request loan.
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
- Default setelah masa tenggang, loss waterfall dan penalti reputasi.

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
- advanced tokenomics,
- withdrawal queue,
- repayment dan recovery setelah default,
- perubahan algoritme pembobotan Saver tanpa migrasi kontrak.

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

Gunakan `ethers.js` pada seluruh contoh implementasi. `wagmi + viem` hanya alternatif satu paket; jangan menggabungkan keduanya tanpa kebutuhan teknis yang jelas.

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
│  │              │       │ ethers.js            │  │
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
- liquidity and loss reserve accounting,
- withdrawal rules,
- loan state,
- loan principal,
- repayment amount,
- remaining debt,
- staking,
- stake unlock,
- stake slash dan loss accounting ketika default,
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
├── user identity dan borrower risk state
├── loan request
├── loan creation
├── disbursement
│
├── staking
├── repayment
├── loan completion dan default
│
└── profit distribution dan loss accounting
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

## 9.1 User, Saver, dan Borrower

Satu address dapat menjadi kedua peran. Identitas disimpan sekali; risiko dan reputasi terkait kemampuan meminjam.

```solidity
mapping(address => bool) public identityVerified;
mapping(address => BorrowerProfile) public borrowerProfiles;

struct BorrowerProfile {
    uint256 riskScore; // 0..100
    uint256 reputation; // 0..100
    bool blockedAfterDefault;
}
```

Deposit dan loan memerlukan identitas terverifikasi. Loan juga memerlukan skor risiko yang memenuhi ambang. Admin tepercaya mengatur status demo; tidak ada dokumen identitas pribadi di chain.

Posisi Saver berbasis `shares`, `weightBps`, `weightedShares`, `rewardDebt`, dan `claimableReturn`. Bobot default 10.000 BPS (1×) harus diinisialisasi saat deposit pertama; batas bobot 5.000–20.000 BPS (0,5×–2×). `weightedShares = shares × weightBps / BPS`, dan simpan `totalWeightedShares` global. Gunakan indeks return per weighted share dan nilai klaim pokok per share biasa agar return serta kerugian dapat dibukukan tanpa iterasi seluruh Saver. `depositedAmount` menjadi nilai turunan dari share, bukan angka tetap ketika terjadi kerugian. Tidak ada `pendingWithdrawal`.

## 9.2 Loan

```solidity
enum LoanStatus { None, Active, Completed, Defaulted }

struct Loan {
    uint256 id;
    address borrower;
    uint256 principal;
    uint256 principalOutstanding;
    uint256 totalRepayment;
    uint256 amountPaid;
    uint256 dueDate;
    uint256 stakeAmount;
    LoanStatus status;
}
```

Loan request yang lolos langsung membuat loan, mengalokasikan stake, dan mencairkan dana secara atomik. Tidak ada status `Requested` yang menunggu persetujuan. Untuk MVP, satu borrower hanya boleh memiliki satu loan aktif.

## 9.3 Pool dan Parameter

`BPS = 10_000`; nilai awal `reserveBps = 2_000`, `saverBps = 8_000`, `platformBps = 1_500`, dan `reserveReturnBps = 500`. Tiga BPS pembagian return harus berjumlah 10.000. Pisahkan `liquidityReserveTarget` (20% dari klaim pokok Saver, hanya batas loan baru dan tetap milik Saver) dari `lossReserveAmount` (akumulasi bagian margin 5%, penanggung rugi setelah stake). Jangan memakai 20% deposit sebagai modal penanggung rugi independen. Stake, return yang dapat diklaim, dan platform revenue dicatat terpisah dari dana yang boleh dipinjamkan. `withdraw(amount)` menarik pokok berdasarkan nilai share saat ini; `claimReturn()` menarik return yang sudah menjadi hak Saver, dan kedua operasi memeriksa likuiditas tanpa mengurangi hak dua kali.

---

# 10. Core Contract Functions

Target interface (nama final dapat disesuaikan bersama tes):

```solidity
function deposit(uint256 amount) external;
function withdraw(uint256 amount) external; // langsung atau revert, tanpa antrean
function stake(uint256 amount) external;
function requestLoan(uint256 amount, uint256 duration) external returns (uint256 loanId);
function repayLoan(uint256 loanId, uint256 amount) external;
function markDefault(uint256 loanId) external; // permissionless setelah tenggang
function claimReturn() external;

function setIdentityVerification(address user, bool verified) external; // admin
function setBorrowerRiskScore(address user, uint256 score) external; // admin
function setDistributionBps(uint256 saver, uint256 platform, uint256 reserve) external; // admin
function setSaverWeight(address user, uint256 weightBps) external; // admin, 5_000..20_000

function getPoolStats() external view returns (...);
function getSaverPosition(address user) external view returns (...);
function getLoan(uint256 loanId) external view returns (...);
function getBorrowerProfile(address user) external view returns (...);
```

Stake bebas harus sudah terkunci sebelum `requestLoan`; jumlah yang dialokasikan ke loan aktif tidak dapat dipakai ulang. Stake bebas yang belum dialokasikan dapat ditarik dengan fungsi tersendiri; stake aktif tidak bisa. Simpan due date dan stake per loan. Jangan berikan admin jalan pintas untuk menandai default sebelum syarat waktu terpenuhi.

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
event StakeUnlocked(address indexed borrower, uint256 amount);
event LoanDefaulted(uint256 indexed loanId, uint256 unpaidPrincipal);
event StakeSlashed(uint256 indexed loanId, uint256 amount);
event ReserveUsed(uint256 indexed loanId, uint256 amount);
event SaverLossRecognized(uint256 indexed loanId, uint256 amount);
event ReputationPenalized(address indexed borrower, uint256 newScore);
event DistributionBpsUpdated(uint256 saver, uint256 platform, uint256 reserve);
event SaverWeightUpdated(address indexed user, uint256 oldWeightBps, uint256 newWeightBps);
event IdentityVerificationUpdated(address indexed user, bool verified);
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
saverPrincipalClaims (share-adjusted)
liquidPoolAssets
liquidityReserveTarget
lossReserveAmount
activeLoanPrincipal
saverReturnLiability
platformRevenue
lockedStake (segregated)
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

Definisi: `liquidPoolAssets` adalah saldo token likuid setelah stake terkunci dipisahkan. Dana untuk loan baru dibatasi oleh `liquidPoolAssets - liquidityReserveTarget - lossReserveAmount - saverReturnLiability - platformRevenue`; hitung dengan pemeriksaan batas sebelum pengurangan agar tidak underflow. Penarikan pokok dibatasi oleh `liquidPoolAssets - lossReserveAmount - saverReturnLiability - platformRevenue` dan klaim pokok Saver; klaim return dibatasi oleh likuiditas sesudah kewajiban pihak lain dipisahkan. Reserve likuiditas boleh membantu penarikan pokok, lalu targetnya dihitung ulang. `liquidityReserveTarget` tetap termasuk klaim Saver; `lossReserveAmount` merupakan bagian margin yang terpisah. Keduanya label pembukuan atas token yang sama, bukan token baru. Setelah default, nilai klaim Saver harus diturunkan sebelum penarikan berikutnya. Jangan menghitung stake sebagai modal pool.

Accounting implementation harus diuji menggunakan invariant tests.

---

# 13. Core Financial Invariants

Contract tidak boleh melanggar rules berikut.

### Pool

```text
availableLending >= 0
liquidityReserveTarget >= 0
lossReserveAmount >= 0
liquidPoolAssets + activeLoanPrincipal >= saverPrincipalClaims + saverReturnLiability + platformRevenue + lossReserveAmount, kecuali ketika kerugian belum diselesaikan dalam transaksi atomik
```

### Withdrawal

```text
withdrawAmount <= saver principal claim (share-adjusted)
withdrawAmount <= liquid funds after segregated liabilities; otherwise revert, no pending state
claimReturn <= accrued user return and liquid funds after other liabilities
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
double default/slash
withdrawal of phantom principal after loss
```

---

# 14. Loan State Machine

```text
requestLoan + validation + disbursement → Active
Active + remainingDebt == 0 → Completed
Active + remainingDebt > 0 + time > dueDate + 7 hari + markDefault → Defaulted
```

`Completed` dan `Defaulted` terminal untuk MVP. Sampai `markDefault` dicatat, loan yang terlambat masih bisa dilunasi. Tidak ada perubahan status otomatis hanya karena jam berlalu; siapa pun boleh memicu `markDefault` bila syaratnya terpenuhi. Eksekusi kedua dan transisi balik revert.

---

# 15. Saver Flow — Technical

```text
User
 ↓
Connect MetaMask
 ↓
Check BOT Chain
 ↓
Check identityVerified
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

Partial repayment mempertahankan status Active. Setiap pembayaran melunasi pokok dahulu, lalu margin; return diakui hanya untuk margin yang benar-benar diterima. Pembayaran setelah jatuh tempo tetapi sebelum default tetap diterima. Setelah Defaulted tidak ada repayment pada MVP.

---

# 18. Profit Distribution and Default

## 18.1 Return Saver

Margin yang benar-benar diterima dibagi dengan BPS awal 80% Saver, 15% platform, 5% reserve. Bagian Saver dibagi berdasarkan **weighted shares saat margin diterima**: `userReturn = saverAllocation * userWeightedShares / totalWeightedShares`. Bobot setiap Saver awalnya 10.000 BPS (1×), sehingga perhitungan awal identik dengan pro-rata share biasa. Gunakan indeks reward kumulatif per weighted share dan reward debt; tidak boleh mengiterasi semua wallet pada setiap repayment. Deposit baru tidak berhak atas return lampau. Setelah terjadi kerugian, share baru dicetak berdasarkan nilai pokok per share terbaru; deposit baru tidak boleh membayar kerugian lama. Jika klaim pokok menjadi nol sementara share lama masih beredar, hentikan deposit/withdraw normal sampai mekanisme recapitalization ditentukan; jangan reset harga share diam-diam. Selesaikan akrual milik user sebelum deposit/withdraw atau perubahan bobot; simpan sisa pembulatan agar tidak dibayar ganda.

Admin tepercaya boleh mengubah ketiga BPS lewat transaksi `setDistributionBps` jika jumlahnya persis 10.000. Admin juga boleh mengubah `weightBps` suatu Saver dalam rentang 5.000–20.000: selesaikan akrual return lama miliknya pada bobot sebelumnya, keluarkan weighted shares lama dari total global, masukkan nilai baru, kemudian simpan reward debt pada indeks saat ini. Ini membuat rumus pembagian dapat disetel secara dinamis **tanpa mengubah return lampau** dan tanpa loop seluruh Saver. Saat deposit atau withdrawal, lakukan langkah akrual dan perbarui kedua total share dengan urutan serupa; cegah `weightedShares == 0` untuk posisi nonnol akibat pembulatan. Event dan bobot efektif ditampilkan pada dashboard agar kebijakan admin terlihat. Jika margin diterima ketika `totalWeightedShares == 0`, arahkan bagian Saver ke cadangan kerugian dan emit event. Algoritme lain di luar bobot per Saver memerlukan kontrak versi baru, tes, dan migrasi hak yang ada.

## 18.2 Default dan Kerugian

Pada loan creation, simpan `dueDate` dan `principalOutstanding`. `markDefault(loanId)` hanya boleh jika status Active, `block.timestamp > dueDate + 7 days`, dan utang belum lunas. Siapa pun boleh memanggil; sekali saja. Repayment menurunkan principalOutstanding dahulu, baru mencatat margin. Margin belum dibayar tidak menjadi kerugian pokok atau return.

Waterfall atomik: (1) potong `min(stakeAmount, principalOutstanding)` dari stake loan untuk menutup pokok dan kembalikan sisanya, (2) gunakan `min(lossReserveAmount, remainingLoss)` dari cadangan kerugian yang terkumpul dari margin, (3) catat sisa kerugian terhadap klaim pokok Saver pro-rata melalui penurunan nilai pokok per share. Perbarui active principal dan status tepat sekali. Kurangi reputasi 20 poin, minimum nol, dan blokir pinjaman baru bagi borrower default. Penagihan/recovery setelah default di luar MVP.

Contoh: sisa pokok 100, stake 10, cadangan kerugian dari return 20: 70 mengurangi klaim Saver. Jika Alice memiliki 10% dan Budi 90% share, kerugian masing-masing 7 dan 63. Cadangan likuiditas dari deposit tidak dihitung sebagai 20 cadangan kerugian dalam contoh ini. Kewajiban return yang sudah terakumulasi tetap dibukukan terpisah; apabila aset tidak cukup, jangan menampilkan seluruhnya seolah langsung dapat ditarik. Uji pembulatan, solvabilitas, penarikan beruntun, pengguna yang sekaligus Saver dan Borrower, serta pencairan baru setelah default. Tidak boleh ada loop semua Saver.

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
ethers.js (BrowserProvider + Contract)
    ↓
MetaMask / BOT Chain
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
share issuance after loss uses current price; zero-price state guarded
pool increases correctly
reserve calculated correctly
saver position updated
```

### Withdrawal

```text
withdraw within balance
withdraw above balance rejected
withdraw when liquidity insufficient reverts and creates no pending state
double withdrawal rejected
```

### Borrower

```text
unverified user deposit and loan rejected
same verified wallet can deposit and borrow
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
locked stake cannot be reused across active loans
```

### Distribution

```text
saver allocation correct
platform allocation correct
reserve allocation correct
total allocation equals expected amount
unequal share pro-rata at default 1x weight, deposit between repayments, rounding
changing a Saver weight settles prior rewards and affects future margin only
dynamic distribution BPS applies only to future margin
```

### Default

```text
before grace period rejected; late repayment before default accepted
liquidity reserve cannot be counted as separate first-loss capital
loss reserve from margin is depleted before Saver haircut
any caller can default eligible loan once
stake slash limited to unpaid principal and surplus returned
reserve covers next; remainder reduces Saver claim
reputation penalty bounded at zero; future loan blocked
subsequent withdrawal reflects loss; no double compensation
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
User identity verified and risk score set
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
verify user identity
update risk score
update distribution BPS
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

# 38. Implementation Roadmap — Smart Contract Track

Roadmap ini mengatur pekerjaan **smart contract, automated tests, deployment, dan contract handoff**. Implementasi frontend dikerjakan oleh rekan secara paralel dan tidak menjadi bagian dari fase-fase ini.

## 38.1 Execution Rule

Codex hanya mengerjakan **satu fase dalam satu task**. Jangan melanjutkan otomatis ke fase berikutnya. Setiap fase harus berakhir dengan:

```text
implementation for current phase only
      ↓
compile succeeds
      ↓
new phase tests pass
      ↓
all previous tests still pass
      ↓
diff and accounting review
      ↓
phase report + frontend handoff update
```

Jika sebuah keputusan dari fase sebelumnya harus diubah, perbarui spesifikasi, jelaskan dampaknya, dan jalankan kembali seluruh regression test yang terpengaruh.

## 38.2 Frontend Parallel Boundary

Tim smart contract menyediakan interface stabil bagi rekan frontend melalui:

```text
contracts/abi/LoanchPool.json
deployments/bot-chain.json
docs/CONTRACT_INTERFACE.md
docs/ERRORS_AND_EVENTS.md
.env.example
```

Handoff minimal berisi:

- contract address dan chain ID,
- Application Binary Interface (ABI),
- daftar fungsi read dan write,
- parameter serta return value,
- custom error dan arti untuk user,
- event yang digunakan untuk refresh data,
- contoh data demo dan urutan transaksi,
- perubahan interface sejak handoff sebelumnya.

Frontend tidak perlu menunggu seluruh kontrak selesai. ABI sementara boleh diberikan setelah suatu modul lolos tes, tetapi harus diberi label `provisional`. Breaking change wajib dicatat segera.

## 38.3 Dependency Order

```text
1. Specification Freeze
2. Project Foundation
3. Identity and Configuration
4. Deposit and Share Accounting
5. Saver Withdrawal
6. Stake and Eligibility
7. Loan Creation and Disbursement
8. Repayment and Return Distribution
9. Default and Loss Accounting
10. Full-System Security Validation
11. BOT Chain Deployment
12. Demo and Submission Validation
```

---

# 39. Phase 1 — Specification and Interface Freeze

## Goal

Mengubah aturan PRD menjadi kontrak interface yang tidak ambigu sebelum menulis fitur baru.

## Work

1. Audit implementasi yang sudah ada; jangan menulis ulang kode yang telah benar.
2. Tetapkan asset token tunggal untuk deposit, loan, repayment, dan stake pada MVP.
3. Finalkan state, struct, fungsi, custom error, event, dan access role yang dibutuhkan.
4. Finalkan unit accounting: BPS, share precision, reward index precision, pembulatan, dan urutan checks-effects-interactions.
5. Petakan setiap business rule ke fungsi dan test case.
6. Buat `docs/CONTRACT_INTERFACE.md` serta `docs/ERRORS_AND_EVENTS.md` versi awal.

## Required Decisions

```text
one verified wallet can be Saver and Borrower
verified identity required for deposit and loan
one active loan per borrower
stake locked before requestLoan
withdraw is immediate or reverts
principal repaid before margin
grace period = 7 days
default waterfall = stake → loss reserve → Saver principal haircut
initial return split = 80% / 15% / 5%
Saver weight = 0.5x–2x; default 1x
```

## Definition of Done

- Tidak ada rule penting yang masih memiliki dua interpretasi.
- Function/event/error matrix selesai.
- Test matrix untuk seluruh fase tersedia.
- Belum ada perubahan behavior kontrak kecuali perbaikan dokumentasi.

## Frontend Handoff

Kirim draft fungsi read/write, event, custom error, dan bentuk data. Tandai ABI sebagai `provisional`.

---

# 40. Phase 2 — Project and Contract Foundation

## Goal

Menyiapkan fondasi kompilasi, deployment lokal, dan keamanan dasar.

## Implement

```text
Hardhat + TypeScript configuration
OpenZeppelin dependencies
MockToken
LoanchPool contract skeleton
Ownable or AccessControl
ReentrancyGuard
SafeERC20
Pausable only if used by defined emergency policy
deployment fixture and local deploy script
```

Constructor harus menolak alamat asset nol dan parameter awal invalid. Jangan mengimplementasikan deposit, loan, atau distribution penuh pada fase ini.

## Tests

- deployment dengan parameter valid,
- zero asset address rejected,
- invalid BPS rejected,
- admin role benar,
- non-admin privileged call rejected,
- mock token mint dan approve bekerja dalam fixture.

## Definition of Done

`compile`, unit tests fase ini, dan static type checks berhasil. Deployment lokal menghasilkan contract address dan fixture dapat digunakan oleh seluruh test berikutnya.

## Frontend Handoff

Berikan chain config lokal, alamat mock token/contract lokal, dan ABI skeleton.

---

# 41. Phase 3 — Identity, Risk, and System Configuration

## Goal

Menyelesaikan authorization dan parameter yang menjadi dependency bagi seluruh flow berikutnya.

## Implement

```text
identityVerified mapping
BorrowerProfile: riskScore, reputation, blockedAfterDefault
setIdentityVerification
setBorrowerRiskScore
reserveBps and risk threshold
distribution BPS setters
parameter update events
read functions for user status and active config
```

Semua setter harus memiliki access control, range validation, dan event. Perubahan parameter berlaku ke transaksi berikutnya serta tidak mengubah hak yang telah tercatat.

## Tests

- verified status dapat dipakai oleh address yang sama sebagai Saver dan Borrower,
- non-admin setter rejected,
- risk score di luar 0–100 rejected,
- distribution BPS yang totalnya bukan 10.000 rejected,
- setiap perubahan menghasilkan event dan read result terbaru.

## Definition of Done

Seluruh konfigurasi dapat dibaca, diperbarui secara aman, dan tidak ada financial transfer dalam fase ini.

## Frontend Handoff

Berikan fungsi status user/config, event perubahan, custom error, dan nilai parameter awal.

---

# 42. Phase 4 — Deposit, Shares, and Pool Accounting

## Goal

Membangun sumber kebenaran untuk pokok Saver dan kapasitas dana pool sebelum fitur lending dibuat.

## Implement

```text
deposit
share minting
totalShares
Saver principal claim view
liquidPoolAssets accounting
liquidityReserveTarget
availableLending view
Saver default weight initialization
weightedShares and totalWeightedShares updates
setSaverWeight with 5.000–20.000 BPS bounds
pool statistics read functions
```

Deposit harus menghitung share berdasarkan nilai pokok per share saat ini. Deposit setelah kerugian tidak boleh memperoleh hak atas nilai lama. Transfer token aktual dan accounting internal harus tetap cocok.

## Tests

- unverified user deposit rejected,
- zero deposit rejected,
- first deposit dan multiple Saver deposit,
- share proporsi untuk deposit berbeda,
- reserve target dan available lending benar,
- default Saver weight diinisialisasi 1×,
- perubahan Saver weight memperbarui user weighted shares dan total global,
- Saver weight di luar 5.000–20.000 BPS rejected,
- fee-on-transfer atau unsupported token behavior rejected,
- direct token transfer tidak menciptakan Saver claim,
- rounding tidak menghasilkan posisi bernilai nol untuk deposit yang diterima.

## Invariants Introduced

```text
total user shares == totalShares
reported principal claims follow share value
availableLending never exceeds lendable liquid assets
locked stake is not part of pool assets
```

## Definition of Done

Deposit dan seluruh pool read function lolos unit test serta regression test fase sebelumnya. Belum ada withdrawal atau lending.

## Frontend Handoff

Kirim ABI untuk `deposit`, approval requirement, Saver position, pool stats, event deposit, dan custom error terkait.

---

# 43. Phase 5 — Saver Withdrawal

## Goal

Membuktikan bahwa Saver dapat menarik pokok dengan pembukuan yang benar sebelum dana pool mulai dipinjamkan.

## Implement

```text
withdraw principal by asset amount
share burn
liquidity check
immediate transfer or full revert
```

Tidak ada withdrawal queue atau pending withdrawal. Return claim belum diimplementasikan pada fase ini karena margin dan reward index baru dibuat pada Phase 8.

## Tests

- partial dan full withdrawal,
- withdrawal melebihi klaim rejected,
- insufficient liquidity reverts tanpa perubahan state,
- double withdrawal rejected,
- share, weighted share, dan pool stats konsisten setelah withdrawal,
- checks-effects-interactions dan reentrancy protection efektif.

## Definition of Done

Deposit → partial withdraw → full withdraw berhasil tanpa selisih token atau accounting. Tidak ada state pending setelah revert.

## Frontend Handoff

Berikan estimasi withdrawable principal, fungsi withdrawal, error insufficient liquidity, dan event withdrawal.

---

# 44. Phase 6 — Stake and Borrower Eligibility

## Goal

Memisahkan dana stake dari pool dan memastikan semua syarat borrower dapat diuji sebelum loan creation.

## Implement

```text
stake free balance
withdraw unused stake
stake allocation helpers
minimum stake rule
identity, risk, reputation, and blocked checks
loan amount and duration validation
eligibility preview/read function
```

Stake harus masuk ke pembukuan terpisah. Deposit Saver pada wallet yang sama tidak otomatis menjadi stake. Stake yang telah dialokasikan tidak dapat ditarik atau dipakai ulang.

## Tests

- stake dan unstake bebas,
- zero stake rejected,
- stake tidak menaikkan available lending,
- unverified/low-risk/blocked borrower tidak eligible,
- insufficient stake rejected,
- wallet yang sama dapat memiliki deposit dan stake terpisah,
- allocated stake tidak dapat ditarik atau dialokasikan dua kali.

## Definition of Done

Semua eligibility rule memiliki hasil deterministic melalui view function dan helper internal. Belum ada dana loan yang dicairkan.

## Frontend Handoff

Berikan stake balance, required stake, eligibility result/reason, fungsi stake/unstake, event, dan error.

---

# 45. Phase 7 — Loan Creation and Disbursement

## Goal

Membuat loan aktif secara atomik setelah seluruh prasyarat terpenuhi.

## Implement

```text
requestLoan
loan ID generation
stake allocation per loan
Loan struct creation
dueDate calculation
principalOutstanding
one-active-loan guard
available lending check
single disbursement transfer
loan read functions
```

Validasi, state update, stake allocation, dan transfer harus terjadi dalam satu transaksi. Jika transfer gagal, seluruh perubahan revert.

## Tests

- eligible request succeeds,
- setiap eligibility failure rejected,
- insufficient available lending rejected,
- principal, due date, stake, dan status tercatat benar,
- disbursement hanya sekali,
- second active loan rejected,
- pool accounting turun sesuai principal,
- reserve target dan loss reserve tidak ikut dicairkan,
- reentrancy pada disbursement tidak dapat mengulang loan.

## Definition of Done

Deposit → stake → request loan → disbursement dapat dijalankan pada local chain, dengan seluruh invariants tetap benar.

## Frontend Handoff

Kirim ABI loan request/read, bentuk Loan, status enum, event disbursement, dan contoh loan ID.

---

# 46. Phase 8 — Repayment, Completion, and Return Distribution

## Goal

Menutup happy path loan dan membagikan margin tanpa iterasi seluruh Saver.

## Implement

```text
partial repayment
principal-first allocation
margin recognition
Saver/platform/loss-reserve distribution
accumulated return per weighted share
reward debt settlement
claimReturn
dynamic distribution BPS
dynamic Saver weight update
loan completion
stake unlock
successful-payment reputation update
```

Saat bobot Saver berubah, settle return lama pada bobot sebelumnya sebelum mengganti weighted shares. Perubahan BPS dan bobot hanya memengaruhi margin sesudah transaksi konfigurasi.

## Tests

- partial repayment mempertahankan status Active,
- pokok dilunasi sebelum margin diakui,
- overpayment ditangani sesuai interface final,
- full repayment menghasilkan Completed dan stake unlock,
- 80/15/5 awal tepat termasuk rounding,
- deposit yang masuk di antara dua repayment tidak mendapat return pertama,
- bobot 0,5×/1×/2× menghasilkan pembagian yang benar,
- perubahan bobot menyelesaikan return lama dan hanya memengaruhi return berikutnya,
- perubahan BPS hanya memengaruhi margin berikutnya,
- return claim tidak mengurangi pokok Saver,
- claim tidak dapat dilakukan dua kali,
- tidak ada loop seluruh Saver.

## Definition of Done

Happy path penuh dari deposit hingga claim return lulus. Saldo token aktual sama dengan seluruh kewajiban dan aset yang dicatat setelah toleransi rounding yang terdokumentasi.

## Frontend Handoff

Kirim fungsi repayment/claim, view breakdown pokok dan margin, return allocation aktif, Saver weight, status Completed, dan event terkait.

---

# 47. Phase 9 — Default and Loss Accounting

## Goal

Menangani loan macet tanpa membuat saldo semu atau membayar kompensasi dua kali.

## Implement

```text
permissionless markDefault
due date + fixed 7-day grace check
stake slashing up to principalOutstanding
surplus stake return
lossReserveAmount consumption
Saver principal value-per-share haircut
active principal cleanup
20-point reputation penalty, minimum zero
blockedAfterDefault
terminal Defaulted state
```

`markDefault` harus atomik dan hanya dapat berhasil sekali. Cadangan likuiditas dari deposit Saver tidak boleh dihitung sebagai cadangan kerugian terpisah.

## Tests

- default sebelum akhir grace period rejected,
- late repayment sebelum `markDefault` tetap diterima,
- caller mana pun dapat menandai default yang eligible,
- second default/slash rejected,
- stake menutup kerugian lebih dahulu dan surplus dikembalikan,
- loss reserve menutup tahap kedua,
- sisa kerugian menurunkan klaim Saver secara proporsional,
- Saver baru setelah loss memperoleh share pada harga terbaru,
- reputasi tidak underflow dan borrower diblokir,
- repayment setelah Defaulted rejected,
- withdrawal setelah default menggunakan nilai klaim terbaru,
- zero-principal-share state memiliki guard yang ditetapkan PRD.

## Definition of Done

Skenario default penuh lulus dan persamaan solvabilitas tetap benar setelah haircut. Tidak ada klaim pokok atau return yang melebihi aset yang benar-benar tersedia.

## Frontend Handoff

Berikan timestamp eligibility default, loss breakdown, status Defaulted, nilai Saver setelah haircut, event waterfall, dan error waktu/status.

---

# 48. Phase 10 — Full-System Tests and Security Pass

## Goal

Menguji interaksi antarmodul dan mengunci behavior sebelum deployment publik.

## Required Test Suites

```text
unit tests from every phase
complete happy path
complete default path
multiple Saver with unequal deposits and weights
deposit and withdrawal between repayments
parameter changes between repayments
rounding and minimum amount boundaries
access-control abuse
reentrancy attempts
double execution
pause behavior if implemented
invariant/fuzz tests for accounting
```

## Security Work

1. Run Slither and triage every finding.
2. Review all external calls and token transfer assumptions.
3. Review authorization for every privileged function.
4. Review checks-effects-interactions and nonReentrant coverage.
5. Review share inflation/donation and rounding attacks.
6. Review insolvency and zero-value edge cases.
7. Confirm no unbounded loop depends on user count.

## Exit Gate

- Full test suite passes repeatedly from a clean install.
- Tidak ada high-severity finding yang belum diselesaikan.
- Medium finding memiliki fix atau alasan penerimaan yang terdokumentasi.
- Gas estimate untuk fungsi utama dicatat.
- ABI dinyatakan `release candidate` dan dibekukan kecuali ada security fix.

## Frontend Handoff

Kirim release-candidate ABI, final event/error table, demo accounts, dan local integration fixture.

---

# 49. Phase 11 — BOT Chain Testnet Deployment

## Goal

Menerapkan build yang telah diaudit ke BOT Chain dan memastikan behavior sama dengan local tests.

## Deployment Steps

```text
verify deployer testnet balance
load RPC, chain ID, and deployer key from environment
compile from clean checkout
run full tests and Slither gate
deploy asset/mock asset if required
deploy LoanchPool with recorded constructor args
configure initial admin parameters
record transaction hashes and addresses
verify source on explorer if supported
run deployment smoke tests
```

## Smoke Tests

- contract reads berhasil,
- admin configuration sesuai,
- test user verification,
- small deposit dan withdrawal,
- small stake, loan, dan repayment dengan demo fixture,
- event dapat dibaca dari explorer atau RPC.

Jangan menjalankan default path di contract demo utama bila membutuhkan manipulasi waktu. Gunakan deployment khusus demo atau duration/grace configuration yang memang dirancang sebelum deployment; jangan menambah admin bypass tersembunyi.

## Definition of Done

Deployment dapat direproduksi, address dan constructor args terdokumentasi, smoke tests lulus, dan artifact cocok dengan source commit.

## Frontend Handoff

Kirim:

```text
BOT Chain RPC URL
chain ID
asset address
LoanchPool address
deployment block
final ABI
explorer links
tested demo transaction sequence
```

---

# 50. Phase 12 — Integration and Submission Validation

Fase ini memvalidasi hasil gabungan bersama frontend milik rekan. Tim smart contract tidak mengambil alih implementasi frontend.

## Contract-Side Tasks

1. Membantu memetakan error revert ke pesan UI melalui dokumentasi.
2. Memastikan setiap read/write yang digunakan frontend tersedia pada ABI final.
3. Memeriksa transaction sequence pada aplikasi terhadap aturan kontrak.
4. Memperbaiki contract hanya jika ditemukan bug, lalu mengulang Phase 10 dan redeploy bila bytecode berubah.
5. Menyediakan seed/demo script yang reproducible.

## Submission Checklist

```text
[ ] Solidity source and exact commit documented
[ ] all tests pass
[ ] security review documented
[ ] BOT Chain contract address and transaction recorded
[ ] final ABI shared with frontend
[ ] environment variable names documented
[ ] deposit, withdrawal, stake, loan, repayment, and claim tested
[ ] default behavior demonstrated through tests or dedicated demo deployment
[ ] frontend reads correct values from deployed contract
[ ] frontend handles custom errors and transaction states
[ ] README and demo flow complete
```

---

# 51. Codex Execution Protocol

Gunakan satu prompt per fase. Format dasar:

```text
Read Loanch.md, PRD.md, AGENTS.md, and the current repository.

Implement Phase <N> only: <phase name>.

Before coding:
- inspect existing implementation and tests,
- identify files and invariants affected,
- do not reimplement behavior that already passes the phase requirements.

During implementation:
- stay inside the phase scope,
- do not build frontend code,
- add meaningful tests for this phase,
- preserve all behavior from completed phases.

Before finishing:
- run compile,
- run the new tests,
- run the full regression suite,
- review the diff for accounting and access-control issues,
- update ABI/interface documentation if the public contract changed.

Report:
- files changed,
- behavior implemented,
- test commands and results,
- frontend handoff changes,
- risks or blockers for the next phase.

Stop after Phase <N>. Do not start the next phase.
```

Setelah satu fase selesai, review hasilnya sebelum memberikan prompt fase berikutnya. Urutan fase hanya boleh dilewati jika seluruh dependency fase tersebut memang sudah tersedia dan telah diuji.

---

# 52. Recommended MCP Setup

High priority untuk smart contract track:

```text
GitHub MCP
Context7 MCP
OpenZeppelin Contracts MCP
```

Digunakan oleh rekan frontend atau pada Phase 12:

```text
Playwright MCP
Chrome DevTools MCP
```

Optional jika verification menggunakan service off-chain:

```text
Supabase MCP
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
ethers.js
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
default waterfall and reputation penalty work
withdraw reverts when liquidity is insufficient
distribution and dynamic BPS update work
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

# 55. Architecture Reference

Satu diagram arsitektur terdapat di Section 6. Tanggung jawab data dijelaskan di Section 7, sedangkan kontrak dan aturan pembukuan ada di Section 8–18. Perbarui bagian tersebut ketika implementasi berubah.

---

# 56. Summary

Technical direction untuk Loanch MVP:

```text
Frontend
React + TypeScript + Vite + Tailwind

Web3
ethers.js + MetaMask

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
