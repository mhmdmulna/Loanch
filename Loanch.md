# Loanch

> **Loan + Chain**
>
> **Loanch** adalah platform keuangan berbasis blockchain yang menggabungkan mekanisme simpan-pinjam dengan smart contract, sehingga pengelolaan dana, penyaluran pinjaman, pembayaran, staking, dan distribusi keuntungan dapat berjalan secara transparan, terprogram, dan dapat diverifikasi.

---

## 1. Filosofi Nama

Nama **Loanch** berasal dari gabungan dua kata:

- **Loan** — merepresentasikan aktivitas utama sistem, yaitu simpan-pinjam dan penyaluran pembiayaan.
- **Chain** — merepresentasikan blockchain sebagai fondasi sistem keuangan yang transparan dan dapat diprogram.

Nama ini juga terdengar seperti kata **launch**, yang memberikan makna tambahan: membantu seseorang "meluncurkan" kebutuhan, bisnis, pendidikan, atau peluang finansial mereka melalui akses pembiayaan.

Dengan demikian, Loanch membawa tiga makna utama:

> **Loan. Chain. Launch.**

---

## 2. Gambaran Singkat

Loanch adalah sistem keuangan berbasis blockchain yang mempertemukan dua jenis pengguna utama:

1. **Saver** — pengguna yang menyimpan dana.
2. **Borrower** — pengguna yang membutuhkan pinjaman.

Satu wallet dapat menjadi Saver sekaligus Borrower. Verifikasi identitas dilakukan satu kali di tingkat pengguna; penilaian risiko tambahan hanya diperlukan untuk pinjaman.

Berbeda dengan marketplace pinjaman peer-to-peer biasa, saver di Loanch tidak perlu memilih secara langsung siapa yang akan menerima uangnya.

Dana dari banyak saver dikumpulkan ke dalam sebuah **loan pool** yang dikelola oleh smart contract.

Smart contract kemudian mengatur:

- berapa dana yang boleh dipinjamkan,
- berapa dana yang harus tetap menjadi cadangan,
- siapa yang memenuhi syarat untuk meminjam,
- berapa batas pinjaman,
- berapa kewajiban pembayaran,
- bagaimana staking dikunci,
- bagaimana pembayaran dicatat,
- bagaimana keuntungan dibagikan,
- bagaimana penarikan dana dilakukan,
- dan bagaimana kondisi gagal bayar ditangani.

---

## 3. Masalah yang Ingin Diselesaikan

Sistem keuangan tradisional memiliki beberapa masalah yang ingin dieksplorasi oleh Loanch.

### 3.1 Kurangnya Transparansi

Pengguna yang menyimpan uang biasanya hanya mengetahui saldo mereka, tetapi tidak memiliki visibilitas langsung terhadap bagaimana dana tersebut dialokasikan dalam sistem.

Loanch mencoba membuat penggunaan dana dapat diverifikasi melalui blockchain.

### 3.2 Ketergantungan pada Satu Pihak

Pada sistem tradisional, pengguna harus mempercayai institusi untuk:

- mencatat saldo dengan benar,
- menjalankan aturan secara konsisten,
- menghitung pembayaran dengan benar,
- mengelola dana sesuai ketentuan,
- dan membagikan keuntungan secara benar.

Loanch memindahkan sebagian aturan tersebut ke smart contract.

### 3.3 Aturan Finansial yang Tidak Dapat Diverifikasi Langsung

Pada Loanch, aturan penting seperti rasio cadangan, batas pinjaman, distribusi keuntungan, dan status pembayaran dapat dibuat sebagai aturan yang dieksekusi oleh smart contract.

### 3.4 Identitas dan Reputasi Peminjam

Wallet blockchain tidak otomatis menunjukkan apakah seseorang adalah manusia nyata atau apakah ia memiliki riwayat pembayaran yang baik.

Loanch menggabungkan:

- verifikasi identitas,
- riwayat pinjaman,
- riwayat pembayaran,
- dan staking

untuk membangun sistem reputasi finansial.

---

## 4. Konsep Utama

Alur sederhana Loanch:

```text
                    LOANCH

          ┌───────────┴───────────┐
          │                       │
        SAVER                  BORROWER
          │                       │
       Deposit                Loan Request
          │                       │
          └───────────┬───────────┘
                      ▼
               SMART CONTRACT
                      │
          ┌───────────┼───────────┐
          │           │           │
          ▼           ▼           ▼
      Loan Pool    Reserve      Staking
          │
          ▼
      Approved Loan
          │
          ▼
       Borrower
          │
          ▼
      Repayment
          │
          ▼
     Smart Contract
          │
    ┌─────┴──────────┐
    ▼                ▼
 Loan Pool      Profit Distribution
                     │
                     ▼
                   Saver
```

---

## 5. Loan Pool

Loan pool adalah kumpulan dana yang berasal dari banyak saver dan digunakan untuk memberikan pinjaman kepada borrower.

Contoh:

```text
Alice  deposit Rp2 juta ──┐
Budi   deposit Rp5 juta ──┤
Citra  deposit Rp3 juta ──┤
                          ▼
                    LOAN POOL
                    Rp10 juta
```

Dana tersebut kemudian tidak langsung seluruhnya diberikan sebagai pinjaman.

Misalnya Loanch memiliki aturan:

```text
80% → Loan Pool aktif
20% → Liquidity Reserve
```

Jika total deposit adalah Rp100 juta:

```text
Total Deposit
Rp100 juta
    │
    ├── Rp80 juta → Dana yang dapat dipinjamkan
    │
    └── Rp20 juta → Cadangan likuiditas
```

Rasio tersebut merupakan parameter sistem dan dapat diubah sesuai desain ekonomi Loanch. **Cadangan likuiditas 20% tetap bagian dari pokok Saver**, hanya belum dipinjamkan. Cadangan kerugian adalah dana lain yang dikumpulkan dari bagian margin 5%; keduanya tidak boleh dihitung sebagai dana yang sama.

---

## 6. Saver

Saver adalah pengguna yang menyimpan aset pada Loanch.

Saver tidak memilih borrower secara individual.

Sebagai gantinya, mereka berpartisipasi dalam pool.

### Alur Saver

```text
Register
   ↓
Deposit
   ↓
Receive Deposit Position
   ↓
Funds Enter Pool
   ↓
Loans Generate Revenue
   ↓
Saver Receives Share
```

Smart contract mencatat setidaknya:

```text
Saver
├── Deposit Amount
├── Deposit Timestamp
├── Withdrawable Amount
└── Accumulated Return
```

---

## 7. Borrower

Borrower adalah pengguna yang mengajukan pinjaman dari Loanch.

Sebelum mendapatkan pinjaman, borrower harus melewati beberapa pemeriksaan.

Contoh:

```text
Borrower
   ↓
Risk Requirement Passed?
   ↓
Stake Already Locked and Sufficient?
   ↓
Liquidity Available?
   ↓
Loan Approved
```

> **Demo scope:** identity/KYC tidak menjadi syarat deposit atau loan. Metadata identity tetap tersedia untuk integrasi KYC di fase berikutnya.

Data pinjaman dapat berbentuk:

```text
Loan
├── Loan ID
├── Borrower
├── Principal
├── Interest or Margin
├── Duration
├── Total Repayment
├── Amount Paid
├── Remaining Debt
├── Due Date
└── Status
```

---

## 8. Know Your Customer

Loanch menggunakan proses **Know Your Customer**, yaitu proses verifikasi identitas pengguna.

Tujuannya bukan untuk menentukan apakah seseorang pasti mampu membayar pinjaman.

Tujuan utamanya adalah menjawab:

> **Siapa orang di balik akun atau wallet ini?**

Informasi pribadi sensitif sebaiknya tidak disimpan seluruhnya secara terbuka di blockchain.

Model yang lebih aman:

```text
Identity Document
       ↓
Verification System
       ↓
Verification Result
       ↓
Blockchain
```

Status identitas melekat pada pengguna dan berlaku untuk kedua aktivitasnya. Pada MVP admin tepercaya dapat mengatur status verifikasi sederhana; dokumen identitas tidak disimpan di blockchain.

Smart contract cukup menerima informasi seperti:

```text
Identity Verified = True
Age Requirement = Passed
Unique Identity = Confirmed
```

tanpa harus menyimpan seluruh dokumen identitas secara publik.

---

## 9. Credit Assessment

Verifikasi identitas berbeda dari penilaian kemampuan membayar.

```text
Identity Verification
        ↓
"Who are you?"

Credit Assessment
        ↓
"Can you repay?"
```

Loanch dapat menggunakan beberapa indikator untuk menentukan kelayakan pinjaman, misalnya:

- riwayat pembayaran,
- jumlah pinjaman sebelumnya,
- jumlah keterlambatan,
- jumlah staking,
- pendapatan yang telah diverifikasi,
- rasio kewajiban terhadap kemampuan pembayaran,
- dan indikator risiko lainnya.

Smart contract tidak harus melakukan seluruh analisis tersebut sendiri.

Sistem analisis dapat menghasilkan nilai seperti:

```text
Risk Score = 82
Identity Verified = True
Income Verified = True
```

Kemudian smart contract menjalankan aturan:

```text
IF
Identity Verified = True
AND
Risk Score >= Minimum Requirement
AND
Stake >= Minimum Stake
AND
Liquidity Available = True

THEN
Loan Eligible
```

---

## 10. Staking

Staking digunakan sebagai bentuk **skin in the game**.

Borrower mengunci aset sebelum mengajukan pinjaman. Kontrak memeriksa stake terkunci yang cukup sebelum mencairkan loan. Jika wallet tersebut juga Saver, depositnya tetap dipisahkan dari stake dan tidak otomatis menjadi jaminan.

Contoh:

```text
Borrower wants Rp10 juta loan
        ↓
Required Stake Rp500 ribu
        ↓
Stake Locked
        ↓
Loan Active
```

Jika pinjaman dibayar dengan baik:

```text
Loan Completed
      ↓
Stake Unlocked
      ↓
Returned to Borrower
```

Jika borrower gagal memenuhi kewajibannya, sebagian atau seluruh staking dapat diproses berdasarkan aturan sistem.

Contoh:

```text
Default
  ↓
Stake Slashing Rule
  ↓
Compensation / Reserve
```

Staking tidak dianggap sebagai satu-satunya indikator kredibilitas.

Jumlah stake yang besar tidak otomatis berarti seseorang memiliki kemampuan membayar yang baik.

---

## 11. Smart Contract Loanch

Smart contract adalah inti dari Loanch.

Ia berfungsi sebagai mesin aturan finansial yang mengelola dana dan status transaksi.

### 11.1 Deposit

Perilaku:

- menerima aset pengguna,
- mencatat posisi deposit,
- memperbarui total dana,
- memperbarui dana yang tersedia,
- menghitung bagian yang masuk cadangan.

---

### 11.2 Withdrawal

Saver dapat menarik haknya ketika likuiditas cukup. Penarikan tidak boleh memakai stake terkunci, dana platform, atau melebihi hak Saver. Bila likuiditas kurang, transaksi gagal seluruhnya tanpa antrean dan dapat dicoba lagi setelah ada dana masuk. **Withdrawal queue masuk future scope**, bukan MVP.

---

### 11.3 Loan Request

Borrower telah diverifikasi, lolos penilaian risiko, dan mengunci stake sebelum mengajukan pinjaman. Smart contract memeriksa:

```text
Identity Verified?
        ↓
Risk Requirement Passed?
        ↓
Minimum Stake Locked?
        ↓
Loan Limit Passed?
        ↓
Liquidity Available?
        ↓
Approve / Reject
```

---

### 11.4 Loan Creation

Jika permintaan memenuhi aturan, smart contract membuat posisi pinjaman:

```text
Loan #001
Borrower: User A
Principal: Rp5 juta
Duration: 5 bulan
Total Repayment: Rp5,5 juta
Status: Active
```

---

### 11.5 Loan Disbursement

Setelah pinjaman aktif:

```text
Loan Pool
   ↓
Transfer
   ↓
Borrower
```

Total dana tersedia diperbarui secara otomatis.

---

### 11.6 Repayment

Pembayaran melunasi sisa pokok lebih dahulu, lalu margin.

Contoh:

```text
Outstanding:
Rp5,5 juta

Payment:
Rp1,1 juta

Remaining:
Rp4,4 juta
```

Smart contract memperbarui:

- jumlah yang telah dibayar,
- sisa kewajiban,
- waktu pembayaran,
- status pinjaman,
- riwayat borrower.

---

### 11.7 Loan Completion

```text
IF
Remaining Debt = 0

THEN
Loan Status = Completed
AND
Unlock Stake
AND
Update Reputation
```

---

### 11.8 Default Handling

MVP menerapkan masa tenggang **7 hari** setelah jatuh tempo. Bila utang masih tersisa setelah masa tenggang, siapa pun dapat mengirim transaksi untuk menandai loan `Defaulted`. Kontrak tidak berubah status sendiri ketika waktu berlalu; sebelum transaksi default, borrower masih boleh membayar.

Saat default terjadi satu kali, stake loan dipotong sebatas sisa pokok, cadangan kerugian yang berasal dari return menutup kekurangan berikutnya sebatas saldo yang ada, dan sisa kerugian pokok mengurangi klaim pokok Saver secara proporsional. Stake berlebih dikembalikan. Cadangan likuiditas dari deposit Saver bukan dana penanggung rugi terpisah. Margin yang belum dibayar bukan keuntungan. Reputasi borrower turun **20 poin** (minimum nol), dan ia tidak dapat mengambil loan baru pada MVP. Pemulihan setelah default merupakan future scope. Rumus pembukuan ada di `PRD.md`.

---

### 11.9 Profit Distribution

Misalnya sebuah pinjaman:

```text
Principal:
Rp5 juta

Total Repayment:
Rp5,5 juta

Gross Return:
Rp500 ribu
```

Loanch dapat menentukan pembagian:

```text
80% → Saver
15% → Platform
5%  → Cadangan kerugian
```

Bagian Saver dibagikan menurut **share deposit aktif × bobot Saver** ketika margin diterima. Nilai awal bobot semua Saver adalah 1× sehingga hasilnya pro-rata: jika Alice memiliki 10% dan Budi 90% share, keduanya menerima 10% dan 90% dari bagian Saver. Deposit sesudah pembayaran tidak memperoleh return lama. Admin tepercaya dapat mengubah bobot pengguna dalam batas 0,5×–2× dan perubahan berlaku untuk margin berikutnya, tanpa menghitung ulang hak lama. Bobot yang berbeda dari 1× harus ditampilkan kepada pengguna karena mengubah pembagian.

80/15/5 adalah nilai awal. Admin tepercaya dapat mengubah ketiga persentase on-chain dengan total tetap 100%; perubahan hanya berlaku untuk margin yang diterima sesudahnya. Bobot Saver juga dapat diubah satu per satu secara on-chain. Hak yang telah diperoleh tidak dihitung ulang. Perubahan ke algoritme lain, seperti bobot berbasis lama simpan, memerlukan versi kontrak dan migrasi yang ditinjau.

Smart contract menjalankan pembagian secara otomatis.

---

## 12. Liquidity Reserve

Loanch tidak boleh meminjamkan seluruh dana pengguna. Cadangan likuiditas adalah bagian dari klaim pokok Saver; cadangan kerugian yang berasal dari margin adalah saldo terpisah untuk menanggung default. Penarikan Saver dapat menggunakan cadangan likuiditas jika tersedia, sehingga nilai target cadangan dihitung lagi setelah penarikan.

Contoh:

```text
Total Deposits
Rp100 juta

Maximum Active Lending
Rp80 juta

Minimum Reserve
Rp20 juta
```

Smart contract dapat memiliki aturan:

```text
IF
Active Loans + New Loan
>
Maximum Lending Capacity

THEN
Reject New Loan
```

Contoh:

```text
Maximum lending:
Rp80 juta

Active loans:
Rp78 juta

New request:
Rp5 juta

Rp78 juta + Rp5 juta = Rp83 juta

Result:
Rejected
```

Tujuannya adalah menjaga kemampuan sistem untuk memenuhi sebagian kebutuhan penarikan dana.

---

## 13. Financial Reputation

Loanch dapat membangun riwayat finansial pengguna.

Contoh:

```text
Borrower A

Loan #001 → Paid On Time
Loan #002 → Paid On Time
Loan #003 → 5 Days Late
Loan #004 → Paid On Time
```

Riwayat tersebut dapat digunakan untuk membentuk reputasi.

Reputasi dapat memengaruhi:

- batas pinjaman,
- persyaratan staking,
- periode pinjaman,
- tingkat risiko,
- akses ke produk finansial tertentu.

Tujuannya bukan hanya mengetahui berapa banyak uang yang dimiliki seseorang, tetapi bagaimana perilaku finansialnya dari waktu ke waktu.

---

## 14. Mengapa Blockchain?

Loanch tidak menggunakan blockchain hanya sebagai database.

Blockchain digunakan sebagai fondasi untuk menjalankan dan memverifikasi aturan finansial.

### Tanpa Blockchain

```text
Saver
  ↓
Central Server
  ↓
Private Database
  ↓
Internal Rules
  ↓
Borrower
```

Pengguna harus mempercayai operator bahwa aturan dan pencatatan dijalankan dengan benar.

### Dengan Loanch

```text
Saver
  ↓
Smart Contract
  ↓
Programmable Financial Rules
  ↓
Loan Pool
  ↓
Borrower
```

Bagian penting dari sistem dapat diverifikasi.

Blockchain digunakan untuk:

- pencatatan posisi finansial,
- pengelolaan pool,
- pemindahan aset,
- staking,
- status pinjaman,
- pembayaran,
- distribusi hasil,
- dan eksekusi aturan.

---

## 15. Transparansi yang Tetap Menjaga Privasi

Loanch tidak berarti seluruh informasi pengguna harus menjadi publik.

Prinsipnya:

> **Publicly verifiable where necessary, private where sensitive.**

Informasi seperti:

- dokumen identitas,
- alamat rumah,
- pendapatan detail,
- informasi pribadi,

tidak seharusnya ditampilkan secara terbuka.

Sedangkan informasi sistem seperti:

- total dana dalam pool,
- rasio dana yang sedang dipinjamkan,
- jumlah cadangan,
- aturan smart contract,
- dan status transaksi,

dapat dibuat lebih transparan dan dapat diverifikasi.

---

## 16. Mekanisme Keseluruhan

```text
                        LOANCH

                ┌─────────────────┐
                │      USER       │
                └────────┬────────┘
                         │
                 Identity Verification
                         │
            ┌────────────┴────────────┐
            │                         │
            ▼                         ▼
          SAVER                    BORROWER
            │                         │
         Deposit                 Loan Request
            │                         │
            ▼                         ▼
        ┌─────────────────────────────────┐
        │          SMART CONTRACT         │
        │                                 │
        │ Deposit Management              │
        │ Loan Pool Management            │
        │ Liquidity Management            │
        │ Lending Rules                   │
        │ Staking Rules                   │
        │ Repayment Rules                 │
        │ Default Rules                   │
        │ Profit Distribution             │
        └────────────────┬────────────────┘
                         │
                         ▼
                    LOAN POOL
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
           RESERVE              ACTIVE LOANS
                                    │
                                    ▼
                                BORROWERS
                                    │
                                    ▼
                                REPAYMENT
                                    │
                                    ▼
                              SMART CONTRACT
                                    │
                     ┌──────────────┼──────────────┐
                     ▼              ▼              ▼
                  SAVERS         RESERVE        PLATFORM
```

---

## 17. Contoh Skenario

### Tahap 1 — Deposit

Alice, Budi, dan Citra telah memiliki identitas terverifikasi.

Alice:

```text
Deposit Rp10 juta
```

Budi:

```text
Deposit Rp20 juta
```

Citra:

```text
Deposit Rp20 juta
```

Total:

```text
Rp50 juta
```

Dengan reserve 20%:

```text
Rp40 juta → Lending Capacity
Rp10 juta → Liquidity Reserve
```

---

### Tahap 2 — Verifikasi dan Staking

Dani telah diverifikasi dan lolos penilaian risiko, lalu mengunci stake Rp1 juta ekuivalen aset.

---

### Tahap 3 — Loan Request

Dani mengajukan:

```text
Loan:
Rp10 juta

Duration:
10 bulan
```

Sistem memeriksa:

```text
Identity Verified      ✓
Risk Requirement       ✓
Stake Locked           ✓
Loan Limit             ✓
Available Liquidity    ✓
```

Pinjaman disetujui.

---

### Tahap 4 — Disbursement

```text
Loan Pool
Rp40 juta

Loan Dani
Rp10 juta

Remaining Lending Capacity
Rp30 juta
```

---

### Tahap 5 — Repayment

Misalnya total repayment:

```text
Rp11 juta
```

Dani melakukan pembayaran sesuai jadwal.

Setelah seluruh pembayaran selesai:

```text
Loan Status = Completed
Stake = Unlocked
Reputation = Updated
```

---

### Tahap 6 — Distribution

Misalnya return yang dapat dibagikan:

```text
Rp1 juta
```

Aturan:

```text
80% Saver
15% Platform
5% Reserve
```

Hasil:

```text
Rp800 ribu → Saver (Alice Rp160 ribu, Budi Rp320 ribu, Citra Rp320 ribu)
Rp150 ribu → Platform
Rp50 ribu  → Cadangan kerugian
```

---

## 18. Perbedaan Loanch dengan Peer-to-Peer Lending Marketplace

### Marketplace Lending

```text
Lender A ─────→ Borrower A
Lender B ─────→ Borrower B
Lender C ─────→ Borrower A
```

Lender memilih borrower secara langsung.

### Loanch

```text
Saver A ──┐
Saver B ──┤
Saver C ──┤
          ▼
      LOAN POOL
          │
     ┌────┼────┐
     ▼    ▼    ▼
    B1   B2   B3
```

Saver berpartisipasi dalam pool dan sistem mengalokasikan dana berdasarkan aturan yang telah ditetapkan.

---

## 19. Perbedaan Loanch dengan Bank Tradisional

Loanch tidak hanya mencoba mendigitalkan bank.

Tujuannya adalah membuat sebagian aturan finansial menjadi **programmable dan verifiable**.

```text
Traditional Model

User
 ↓
Institution
 ↓
Internal Rules
 ↓
Private Database
```

dibandingkan dengan:

```text
Loanch

User
 ↓
Smart Contract
 ↓
Verifiable Rules
 ↓
Financial Pool
```

Loanch tidak menghilangkan seluruh kebutuhan terhadap institusi, hukum, penilaian risiko, maupun identitas.

Sebaliknya, Loanch menggunakan blockchain untuk bagian yang memang mendapatkan manfaat dari:

- shared state,
- transparansi,
- programmable transactions,
- otomatisasi,
- dan verifikasi.

---

## 20. Nilai Utama Loanch

### Programmable

Aturan finansial tidak hanya tertulis dalam dokumen, tetapi dapat diterjemahkan menjadi aturan smart contract.

### Transparent

Kondisi pool dan mekanisme penting dapat diverifikasi.

### Automated

Pembayaran, perubahan status, staking, dan distribusi hasil dapat diproses otomatis.

### Accountable

Riwayat transaksi dan pinjaman menghasilkan jejak yang sulit dimodifikasi secara sepihak.

### Reputation-Based

Borrower dapat membangun riwayat finansial dari perilaku pembayaran mereka.

---

## 21. Komponen Sistem

Loanch dapat dibagi menjadi beberapa modul.

```text
LOANCH

├── Identity Module
│   └── Know Your Customer
│
├── Saver Module
│   ├── Deposit
│   ├── Position
│   └── Withdrawal
│
├── Lending Module
│   ├── Loan Request
│   ├── Approval
│   ├── Disbursement
│   ├── Repayment
│   └── Default
│
├── Pool Module
│   ├── Available Liquidity
│   ├── Active Loans
│   └── Reserve
│
├── Staking Module
│   ├── Lock
│   ├── Unlock
│   └── Slash
│
├── Reputation Module
│   ├── Payment History
│   └── Risk Indicators
│
└── Distribution Module
    ├── Saver Return
    ├── Platform Revenue
    └── Reserve Allocation
```

---

## 22. Minimum Viable Product

Untuk versi hackathon, Loanch tidak perlu langsung menjadi sistem finansial lengkap.

Versi awal dapat fokus pada:

1. Registrasi pengguna.
2. Verifikasi identitas sederhana.
3. Deposit aset.
4. Loan pool.
5. Pengajuan pinjaman.
6. Pemeriksaan kelayakan berbasis aturan sederhana.
7. Staking borrower.
8. Pencairan pinjaman.
9. Pembayaran pinjaman.
10. Distribusi hasil.
11. Default: stake slashing, cadangan kerugian dari return, kerugian Saver, penalti reputasi.
12. Penarikan langsung atau gagal ketika likuiditas kurang.
13. Dashboard transparansi pool.

Fitur seperti penilaian risiko kompleks, integrasi aset dunia nyata, mekanisme hukum, dan model likuiditas lanjutan dapat menjadi pengembangan berikutnya.

---

## 23. Tantangan yang Harus Diakui

Loanch masih memiliki beberapa masalah yang tidak otomatis diselesaikan oleh blockchain.

### Default Risk

Borrower tetap dapat gagal membayar.

### Liquidity Risk

Dana saver dapat sedang digunakan sebagai pinjaman ketika saver ingin menarik dana.

### Identity Risk

Verifikasi identitas harus memiliki sumber data yang dapat dipercaya.

### Smart Contract Risk

Kesalahan dalam kode dapat berdampak langsung terhadap dana.

### Oracle Risk

Informasi dari dunia nyata tetap membutuhkan sumber data eksternal yang dipercaya.

### Regulation

Aktivitas simpan-pinjam dan penghimpunan dana dapat tunduk pada regulasi finansial di yurisdiksi tempat produk dijalankan.

### Privacy

Informasi finansial pengguna tidak boleh dipublikasikan tanpa desain privasi yang memadai.

---

## 24. Prinsip Desain

Loanch dibangun dengan beberapa prinsip:

> **Blockchain where blockchain matters.**

Tidak semua data harus berada di blockchain.

> **Rules before features.**

Smart contract harus memiliki aturan ekonomi yang jelas sebelum menambah banyak fitur.

> **Transparency without sacrificing privacy.**

Data sistem dapat diverifikasi, tetapi informasi pribadi tetap dilindungi.

> **Staking is an incentive, not identity.**

Staking tidak menggantikan proses identitas maupun penilaian risiko.

> **Liquidity must be designed, not assumed.**

Dana yang sedang dipinjamkan tidak selalu tersedia untuk ditarik.

---

## 25. One-Line Pitch

> **Loanch is a programmable lending bank where deposits, loans, staking, repayments, liquidity, and returns are transparently managed by smart contracts.**

Alternatif:

> **Loanch turns banking rules into verifiable smart contracts.**

Alternatif yang lebih sederhana:

> **Save. Borrow. Build trust on-chain.**

---

## 26. Vision

Loanch ingin mengeksplorasi bagaimana institusi finansial dapat menjadi lebih:

- transparan,
- programmable,
- otomatis,
- dapat diverifikasi,
- dan berbasis reputasi,

tanpa menjadikan blockchain sebagai gimmick.

Visi akhirnya bukan hanya membuat **bank di blockchain**, tetapi membangun:

> **a programmable financial institution powered by verifiable rules.**

---

## 27. Kesimpulan

Loanch menggabungkan konsep simpan-pinjam dengan blockchain dan smart contract.

Saver menyimpan dana ke dalam pool.

Borrower memperoleh pembiayaan berdasarkan aturan kelayakan.

Smart contract mengatur:

```text
Deposit
   ↓
Liquidity
   ↓
Staking
   ↓
Loan
   ↓
Repayment
   ↓
Risk / Default
   ↓
Profit Distribution
   ↓
Reputation
```

Dengan arsitektur ini, blockchain bukan hanya digunakan untuk mencatat transaksi.

Blockchain menjadi **mesin yang menjalankan aturan finansial Loanch**.
