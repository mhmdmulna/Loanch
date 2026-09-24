# Rangkuman Frontend Loanch (GMT)

Ringkasan struktur dan isi frontend, non-coding. Fokusnya: ada page apa aja, isinya apa, alurnya gimana.

---

## 1. Gambaran Umum

Loanch itu platform lending (pinjam-meminjam) berbasis smart contract di jaringan **BOT Chain**. Modelnya pool-based: penabung (saver) naruh duit ke satu pool bareng, peminjam (borrower) ngajuin pinjaman dari pool itu, dan semua aturan keuangan diatur smart contract, bukan manual.

Frontend-nya bikin pengalaman pakai produk ini, dari kenalan produk, nabung, minjam, bayar cicilan, sampai lihat transparansi pool dan reputasi.

- Jenis aplikasi: **Single Page Application (SPA)**. Ganti halaman pakai state di `App.tsx`, bukan router URL beneran.
- Stack: React 19, TypeScript, Vite, Tailwind CSS v4, ethers (buat wallet/blockchain).
- Bahasa UI: Inggris. Gaya visual: fintech gelap yang kalem dan premium, bukan dashboard crypto yang rame.
- Status: **masih demo**. Data pool, pinjaman, reputasi itu mock/dummy di file terpisah. Kontrak belum di-deploy, jadi banyak label "Demo Mode".

---

## 2. Struktur Folder

```
frontend/
├─ public/                  → favicon
├─ index.html               → entry HTML (title: "Loanch - Save. Borrow. Build trust on-chain.")
└─ src/
   ├─ App.tsx               → otak navigasi (nentuin page mana yang tampil)
   ├─ main.tsx              → mount React ke #root
   ├─ index.css             → token warna, font, style global, animasi
   ├─ components/           → komponen UI reusable + beberapa "page" besar
   ├─ pages/                → halaman-halaman utama
   ├─ hooks/                → useWallet (logic wallet)
   ├─ contracts/            → config.ts + addresses.ts (baca env Vite)
   ├─ data/                 → mockData.ts (data demo)
   └─ types/                → definisi tipe TypeScript
```

Pembagian kerja:
- **components/** isinya UI kit (Button, Card, Badge, dll) plus `LandingPage`, `Dashboard`, `Navbar`, `Footer`.
- **pages/** isinya halaman fitur: Saver, Borrower, Loans, Pool, Reputation, Blockchain.

---

## 3. Navigasi & Alur Halaman

Ada **8 "page"** yang bisa dibuka:

| Page (id) | Label di Navbar | Fungsi singkat |
|---|---|---|
| landing | (halaman depan) | Kenalan produk |
| dashboard | Dashboard | Ringkasan posisi & kondisi pool |
| saver | Save | Nabung ke pool & tarik dana |
| borrower | Borrow | Cek eligibility & ajukan pinjaman |
| loans | Loans | Kelola pinjaman, cicilan, lifecycle |
| pool | Pool Transparency | Transparansi pool & reserve |
| reputation | Reputation | Rekam jejak keuangan on-chain |
| transparency | Blockchain | Detail jaringan BOT Chain & kontrak |

Catatan penting soal layout:
- **Landing page** tampil full-screen **tanpa** Navbar & Footer bawaan. Dia punya nav sendiri yang mengapung (floating) di atas hero.
- Semua page lain pakai pola: **Navbar (atas) + konten (tengah) + Footer (bawah)**.
- Ganti halaman selalu auto-scroll ke atas dengan animasi halus.

---

## 4. Detail Isi Tiap Halaman

### 4.1 Landing Page (halaman depan)

Pintu masuk pertama, tugasnya jelasin Loanch dalam < 30 detik.

- **Nav floating**: logo "Loanch", tombol "Explore Pool", tombol Connect Wallet.
- **Hero**: background animasi topografi 3D (interaktif ngikutin mouse). Judul besar "Save. Borrow. Build trust on-chain." + 1 paragraf penjelasan produk. Dua CTA: "Connect Wallet to Start" dan "Explore Pool Transparency".
- **Live Pool Status**: 4 kartu angka demo, Total Deposits, Active Loans, Available Liquidity, Utilization Rate. Ada badge "Demo Data".
- **How Loanch Works**: 3 langkah, Savers Deposit, Borrowers Stake and Request, Repayment and Returns.
- **For Savers**: 3 poin nilai (pool-based returns, transparan, aturan smart contract) + kartu "Save and Earn" (APY demo 8.5%, daftar saver, tombol Start Saving).
- **For Borrowers**: kartu "Borrow with Confidence" (bunga demo 12%, min stake 5%, max 100K BOT, durasi 1-12 bulan, tombol Request Loan) + 3 poin nilai (identity/reputation based, stake-backed, automated).
- **Footer**.

### 4.2 Dashboard

Jawab pertanyaan "duit gua sekarang gimana?".

- **Header**: label "Account overview, Demo environment" + tombol WalletStatus + badge "Demo data".
- **Panel wallet context**: sapaan + status wallet + saldo BOT + panel "Next action" dengan 2 tombol gede (Start saving / Request loan).
- **Personal positions**: 2 kartu, Saver position (saldo, accumulated return, deposited, withdrawable, tombol Request withdrawal) dan Borrower position (remaining debt, paid, due date, stake locked, tombol Manage & repay + View lifecycle). Kalau kosong, muncul EmptyState.
- **Pool health**: Total deposits, Active loans, Available liquidity, Utilization (dengan bar), plus Active savers & Active borrowers.
- **2 kartu pintasan**: Financial reputation (Tier 2) dan Blockchain transparency (BOT Chain).
- **Recent activity**: daftar aktivitas terakhir (deposit, loan payment, return distribution).

### 4.3 Save (Saver Page)

Alur nabung duit ke pool.

- **Header**: "Save & Earn" + badge "Demo Mode".
- **3 kartu overview**: Current APR, Total Pool (BOT), Active Savers.
- **Current Position** (kalau udah punya): current balance, total deposited, accumulated return, withdrawable amount, catatan "withdraw tergantung likuiditas pool", tombol Request Withdrawal.
- **Form Deposit**: lihat saldo wallet, input jumlah deposit, tombol cepat 25% / 50% / 75% / MAX, preview "Expected Pool Position" (new balance, expected APR, estimasi return tahunan), panel disclaimer "Returns are not guaranteed", tombol Review Deposit.
- **Review Deposit**: ringkasan (jumlah, from wallet, to pool, network BOT Chain, APR), 3 poin catatan penting, tombol Back / Confirm Deposit.
- **Success state**: layar "Deposit Confirmed!".
- Simulasi alur transaksi (preparing → waiting wallet → submitted → confirming → confirmed).

### 4.4 Borrow (Borrower Page)

Alur ngajuin pinjaman.

- **Header**: "Borrow Funds" + badge "Demo Mode".
- **Eligibility Checklist**: 5 syarat, Identity Verified (KYC), Risk Requirement, Minimum Stake, Pool Liquidity, Loan Limit. Tiap item ada badge lolos/tidak.
- **Loan Calculator** (kalau semua syarat kepenuhan): input Loan Amount, pilih durasi (3/6/9/12 bulan), panel "Estimated Repayment" (principal, bunga 12% tahunan, durasi, total repayment, cicilan bulanan), panel "Required Stake" (5% dari pinjaman + penjelasan stake dikunci), catatan "Smart Contract Approval" (approval final ditentukan kontrak), tombol Review Loan Request.
- **Review screen**: ringkasan pinjaman, "Stake Status" (stake bakal dikunci sebagai jaminan), 3 poin penting, tombol Back / Submit Loan Request.
- **Success state**: "Loan Request Submitted!" + tombol ke halaman Loans.
- **Active Loan card** (kalau ada pinjaman jalan): remaining debt, principal, amount paid, due date, staked.

### 4.5 Loans (Loan Management)

Halaman paling padat. Fokusnya monitor cicilan, collateral, dan lifecycle.

- **Header**: "Loan Management" + badge "Phase 8", tombol Request New Loan & Dashboard.
- **4 KPI cards**: Active Debt Obligation, Total Borrowed, Total Amount Repaid, Locked Collateral Stake.
- **Layout 2 kolom**:
  - **Kiri**: daftar "Your Loans" dengan filter All / Active / Settled. Tiap item: id loan, durasi, status, remaining, principal, due date, stake.
  - **Kanan**: detail loan terpilih.
- **Detail Loan**: header loan + status, 4 angka utama (principal, total repayment, amount paid, remaining debt), lalu:
  - **Lifecycle Timeline** (6 tahap): 1. Loan Requested, 2. Approved, 3. Stake Locked, 4. Disbursed, 5. Repayment, 6. Completed. Ada indikator tahap selesai / sedang berjalan.
  - **Stake State** (skin-in-the-game): locked di escrow atau unlocked saat lunas, plus status.
  - **Smart Contract Governance**: penjelasan rule authority + default policy (grace period 7 hari, kalau telat stake di-slash buat proteksi saver).
  - **Repayment History** (tabel): tanggal, total paid, principal amortization, margin (bunga), status, catatan.
- **Repayment Modal**: input jumlah bayar, tombol cepat (1 bulan ~1.350 BOT / 50% / Pay in Full), catatan reputasi, tombol Cancel / Confirm Payment. Ada state sukses "Payment Confirmed!".

### 4.6 Pool Transparency

Bikin transparansi pool kelihatan terang benderang.

- **Header**: "Transparent Pool" + badge "Phase 9", tombol Deposit / Borrow.
- **Pool Capital Pipeline** (4 langkah visual): 1. Total Pool (100%), 2. Active Lending (80%), 3. Available Liquidity (20%), 4. Mandatory Reserve (20% min). Ada bar proporsi 80% pinjaman vs 20% reserve.
- **6 metrik operasional**: Total Deposits, Active Loans, Available Liquidity, Liquidity Reserve, Loss Reserve, Pool Utilization.
- **Kenapa Loanch Simpan Reserve**: penjelasan "No 100% Lending Rule" (cuma boleh lending max 80%), bedain **Liquidity Reserve** vs **Loss Reserve**, dan split margin 80% Saver / 15% Platform / 5% Loss Reserve.
- **Lending Capacity Simulator**: input simulasi jumlah pinjaman, sistem hitung apakah masih masuk kapasitas pool (max 80%) atau nggak, plus penjelasan rule kalau kebablasan.

### 4.7 Reputation (Financial Reputation)

Nunjukin rekam jejak keuangan dari perilaku bayar cicilan.

- **Header**: "Financial Reputation" + badge "Phase 10", tombol View Loans / Borrow with Reputation.
- **Banner overview**: tier user (Established Borrower, Tier 2), badge Identity Verified, penjelasan reputasi (bukan skor kredit opak, tapi catatan kontrak on-chain), status "Exemplary Track Record", 100% on-time.
- **5 metrik kunci**: Completed Loans, On-Time Payments, Late Payments, Current Obligations, Total Repaid.
- **Reputation Benefits**: Required Collateral Stake (5% of loan), Borrowing Capacity (up to 100K BOT), Duration Access (up to 12 bulan), plus notice default policy (telat > 7 hari: reputasi turun 20 poin, stake di-slash, dilarang pinjam lagi).
- **Privacy-First Reputation**: penjelasan data sensitif (KTP, gaji, alamat) nggak pernah dipublish ke blockchain.
- **Repayment & Trust Milestones** (timeline): daftar milestone kronologis (verifikasi identitas, loan cair, bayar tepat waktu, loan lunas, upgrade tier, dll) plus dampaknya ke reputasi.

### 4.8 Blockchain (Blockchain Transparency)

Halaman teknis, prinsipnya "human-readable dulu, teknis belakangan".

- **Header**: "Blockchain Transparency" + badge "Phase 11", tombol Pool Transparency / Dashboard.
- **Banner prinsip**: "Human-Readable Result First, Technical Blockchain Data Second", tombol Show/Hide Technical Invariants.
- **BOT Chain Network card**: target ekosistem, Testnet Chain ID (968), Mainnet Chain ID (677), token BOT (18 desimal), Chain ID yang lagi konek, plus tombol connect/switch network sesuai status wallet.
- **Smart Contract Configuration card**: alamat kontrak Loanch (atau "Not Configured"), tombol copy, status konfigurasi, dan status explorer link (kalau belum ada deploy, ditulis "unavailable").
- **Transaction Verification & Hash Policy**: penjelasan tegas, **nggak pernah bikin hash transaksi palsu**. Semua alur simulasi dikasih label "Demo / Simulation Mode".
- **Technical Invariants** (tersembunyi, muncul kalau diklik): 4 invariant smart contract, Solvency Conservation, Mandatory Liquidity Reserve Floor, Skin-in-the-Game Collateral, Deterministic Distribution Formula.

---

## 5. Komponen UI Reusable (Design System)

Dipakai lintas halaman biar konsisten:

- **Button**: varian primary / secondary / danger, ukuran small / medium / large, dukung loading & full width.
- **Card** (+ CardHeader, CardContent, CardFooter): panel dasar tempat konten.
- **Badge**: varian success / warning / error / neutral / pending, bisa ada ikon & animasi pulse. Termasuk ikon CheckIcon, ExclamationIcon, XIcon.
- **Input & TextArea**: input dengan label, state error & success, ikon, atribut aksesibilitas.
- **EmptyState**: tampilan "belum ada data" + ikon (PiggyBank, Document, Activity) + tombol aksi.
- **TransactionStatus & TransactionIndicator**: nampilin status transaksi + link verify ke explorer kalau ada hash real.
- **Spinner / Skeleton / ProgressBar**: indikator loading & progress.
- **WalletComponents**: WalletButton (connect / switch network / tampil alamat + disconnect), WalletStatus (ringkas/ detail), NetworkGuard (gerbang yang minta connect wallet & network bener sebelum halaman kebuka).
- **Navbar**: nav sticky, 7 link utama, indikator "Demo Mode", tombol wallet, menu hamburger buat mobile.
- **Footer**: brand + misi, kolom Core Products, kolom Verification & Trust, info chain (Testnet 968 / Mainnet 677), tagline.
- **Topography**: komponen background animasi 3D (khusus hero landing).

---

## 6. Logic & Konfigurasi Pendukung

- **useWallet (hook)**: deteksi wallet browser (MetaMask dll) via ethers. Ngurus connect, disconnect, cek chain ID, baca saldo BOT, switch network ke BOT Chain (plus auto-add network kalau belum ada), dan reaksi ke event accountsChanged / chainChanged.
- **contracts/config.ts**: baca RPC URL, Chain ID, Explorer URL dari env Vite (`VITE_*`).
- **contracts/addresses.ts**: baca alamat kontrak Loanch dari env.
- **data/mockData.ts**: semua data demo, pinjaman (LOAN-001 aktif, LOAN-000 lunas), pool transparency, profil reputasi + milestones, info BOT Chain. Ada disclaimer jelas, data demo nggak pernah ditampilin sebagai state on-chain asli.

---

## 7. Pola UX Penting (berlaku di semua flow)

- **Model state transaksi**: Ready → Preparing → Waiting for wallet → Submitted → Confirming → Confirmed (plus Failed & Rejected). Tiap state jelasin apa yang lagi terjadi & next-nya apa.
- **NetworkGuard**: halaman fitur (Save, Borrow, Loans, Dashboard) dikunci kalau wallet belum connect atau salah network, dengan instruksi jelas.
- **Demo mode**: label "Demo Mode" muncul di Navbar, header halaman, dan angka-angka, biar jelas ini belum data asli.
- **Aksesibilitas**: label form kelihatan, focus state jelas, error diumumin ke screen reader (aria-live, role alert), dukung reduced motion.
- **Prinsip desain**: hasil yang gampang dimengerti dulu, detail blockchain teknis kedua (progressive disclosure).

---

## 8. Design System (Ringkas)

- **Tema**: gelap, kesan institusi keuangan, tenang & presisi.
- **Warna**: background nyaris hitam kehijauan (#07100f), surface (#0b1715 / #12221f), accent **limau/hijau terang #c7f36b**, plus warna status (sukses hijau, warning amber, danger rose, info biru).
- **Font**: sans "Aptos / Segoe UI", mono "Cascadia Mono" buat angka & metadata teknis.
- **Layout**: container maksimal lebar, sudut relatif tajam (radius kecil), bayangan dipakai hemat.
- **Motion**: animasi masuk halaman halus, bar pool ber-transisi, dialog muncul dengan animasi kecil. Semua hormatin preferensi reduced motion.

---

## 9. Catatan Status & Batasan

- Frontend ini masih **tahap demo/foundation**. Belum ada backend, belum ada kontrak ter-deploy.
- Alur transaksi (deposit, pinjam, bayar) **disimulasikan**, dan **nggak bikin hash transaksi palsu**. Hash & konfirmasi asli baru muncul setelah transaksi beneran mined di BOT Chain.
- Buat integrasi live butuh: alamat kontrak Loanch yang udah deploy + ABI final, plus env RPC URL, Chain ID, dan Explorer URL BOT Chain.
- Verifikasi identitas & risk scoring tetap jadi tanggung jawab integrasi eksternal (di UI cuma ditampilin sebagai state demo).

---

Dokumen sumber terkait di repo: `PRD.md`, `Loanch.md`, `FRONTEND_SCOPE.md`, `UX_ARCHITECTURE.md`, `design_frontend.md`, `DESIGN_SYSTEM.md`, `FRONTEND_AUDIT.md`, `FRONTEND_COMPLETION_REPORT.md`.
