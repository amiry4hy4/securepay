# TASKLIST — SecurePay: Implementasi Keamanan E-Wallet
> **Project UAS** | React + Vite | Web Crypto API | AES-256-CBC + SHA-256

---

## Struktur folder project (referensi semua anggota)

```
securepay/
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Register.jsx
│   │   ├── Login.jsx
│   │   ├── Transfer.jsx
│   │   └── SecurityFlow.jsx
│   ├── components/
│   │   ├── WalletCard.jsx
│   │   ├── TransactionList.jsx
│   │   └── EncryptionVisualizer.jsx
│   ├── utils/
│   │   ├── crypto.js
│   │   └── storage.js
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

---

## Tech stack (wajib dipahami semua anggota)

| Layer | Teknologi |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router DOM v6 |
| Styling | Tailwind CSS v3 |
| Enkripsi | Web Crypto API (native browser) |
| State management | React Context API |
| Simulasi DB | localStorage (in-browser) |
| Deploy | Vercel / Netlify |

---

---

# 👤 ILHAM — Project Lead & Frontend Architecture

**Branch:** `main` / `feat/ilham-setup`
**Halaman utama:** `App.jsx`, `Dashboard.jsx`, `WalletCard.jsx`

---

## TASK IL-01 — Setup project React + Vite

**Status:** `[ ]` Belum dikerjakan

### Prompt untuk IDE (Cursor / Windsurf / Claude Code):

```
Buatkan project React + Vite baru bernama "securepay" dengan konfigurasi berikut:

1. Install dependensi:
   - react-router-dom (routing)
   - tailwindcss + postcss + autoprefixer (styling)

2. Buat struktur folder lengkap:
   src/pages/ → Dashboard.jsx, Register.jsx, Login.jsx, Transfer.jsx, SecurityFlow.jsx
   src/components/ → WalletCard.jsx, TransactionList.jsx, EncryptionVisualizer.jsx
   src/utils/ → crypto.js, storage.js
   src/context/ → AppContext.jsx

3. Setup Tailwind CSS (tailwind.config.js + index.css)

4. Buat App.jsx dengan React Router yang menghubungkan semua halaman:
   - "/" → Dashboard (protected, redirect ke /login jika belum login)
   - "/register" → Register
   - "/login" → Login
   - "/transfer" → Transfer (protected)
   - "/security" → SecurityFlow

5. Setiap halaman cukup berisi placeholder dulu:
   export default function NamaHalaman() {
     return <div className="p-8"><h1>Nama Halaman</h1></div>
   }

6. Buat README.md dengan instruksi npm install dan npm run dev.

Gunakan React Context API untuk state global: currentUser, balance, transactions.
Simpan state ke localStorage agar tidak hilang saat refresh.
```

---

## TASK IL-02 — AppContext (state global)

**Status:** `[ ]` Belum dikerjakan
**File:** `src/context/AppContext.jsx`

### Prompt untuk IDE:

```
Buatkan file src/context/AppContext.jsx untuk project React "SecurePay".

Context ini harus menyimpan dan menyediakan state global berikut:
- currentUser: { username, passwordHash, salt } | null
- balance: number (saldo dalam rupiah, disimpan terenkripsi di localStorage)
- transactions: array of { id, type, amount, to/from, encryptedPayload, iv, timestamp }
- aesKey: string (hex 256-bit, di-generate sekali saat register, disimpan di sessionStorage)

Sediakan fungsi:
- login(username, passwordHash) → set currentUser
- logout() → clear currentUser dan aesKey dari session
- updateBalance(newBalance) → enkripsi balance baru lalu simpan ke localStorage
- addTransaction(txData) → tambah ke array transactions
- getDecryptedBalance() → dekripsi dan return balance sebagai number

Gunakan useReducer untuk mengelola state.
Wrap semua dengan localStorage persistence menggunakan useEffect.
Export AppContext dan AppProvider.
```

---

## TASK IL-03 — Dashboard & WalletCard

**Status:** `[ ]` Belum dikerjakan
**File:** `src/pages/Dashboard.jsx`, `src/components/WalletCard.jsx`

### Prompt untuk IDE:

```
Buatkan halaman Dashboard.jsx dan komponen WalletCard.jsx untuk e-wallet "SecurePay".

WalletCard.jsx harus menampilkan:
- Nama user (dari AppContext)
- Saldo terformat: "Rp 1.500.000" (gunakan toLocaleString('id-ID'))
- Badge "AES-256 Encrypted" berwarna biru kecil di bawah saldo
- Tombol "Kirim Transfer" → navigate ke /transfer
- Tombol "Refresh" → re-decrypt dan tampilkan ulang saldo

Dashboard.jsx harus menampilkan:
- WalletCard di bagian atas
- Komponen TransactionList di bawahnya
- Navbar dengan link: Dashboard | Transfer | Alur Keamanan | Logout
- Tampilan responsif dengan Tailwind CSS
- Warna tema: biru (#1e40af) sebagai warna utama

Gunakan useContext(AppContext) untuk mengambil data.
Tampilkan loading spinner saat mendekripsi saldo.
Gunakan Tailwind untuk semua styling — tidak boleh ada inline style.
```

---

## TASK IL-04 — TransactionList component

**Status:** `[ ]` Belum dikerjakan
**File:** `src/components/TransactionList.jsx`

### Prompt untuk IDE:

```
Buatkan komponen TransactionList.jsx untuk SecurePay.

Komponen ini menerima props: transactions (array)

Setiap item transaksi menampilkan:
- Icon panah (→ keluar berwarna merah, ← masuk berwarna hijau)
- Nama pengirim/penerima
- Nominal: "- Rp 50.000" atau "+ Rp 50.000"
- Timestamp: format "09 Jun 2026, 14:30"
- Badge kecil "Encrypted" dengan icon gembok

Tambahkan toggle button "Lihat payload terenkripsi" per transaksi:
- Saat diklik: tampilkan encryptedPayload (hex string) dan IV dalam box monospace
- Tujuan: mendemonstrasikan bahwa data disimpan dalam bentuk terenkripsi

Jika belum ada transaksi, tampilkan empty state:
"Belum ada transaksi. Coba kirim transfer pertama kamu!"

Gunakan Tailwind CSS untuk styling.
```

---

## TASK IL-05 — Integrasi & final review

**Status:** `[ ]` Belum dikerjakan

### Checklist manual:
- [ ] Semua branch di-merge ke `main`
- [ ] Routing berjalan dari Register → Login → Dashboard → Transfer → SecurityFlow
- [ ] State user dan saldo tidak hilang saat navigasi antar halaman
- [ ] Demo flow end-to-end berjalan: Register → Login → Lihat saldo → Transfer → Cek riwayat
- [ ] `npm run build` berhasil tanpa error
- [ ] Deploy ke Vercel, pastikan URL bisa dibuka tim

---

---

# 👤 AMIR — Security Module: Auth & Hashing

**Branch:** `feat/amir-auth`
**Halaman utama:** `Register.jsx`, `Login.jsx`

---

## TASK AM-01 — Utility crypto.js (shared, dikerjakan Amir)

**Status:** `[ ]` Belum dikerjakan
**File:** `src/utils/crypto.js`

> ⚠️ File ini dipakai semua anggota. Kerjakan dan commit lebih dulu sebelum yang lain mulai.

### Prompt untuk IDE:

```
Buatkan file src/utils/crypto.js untuk project React SecurePay.
Gunakan Web Crypto API native browser (bukan library eksternal).

Ekspor fungsi-fungsi berikut:

1. generateSalt(): string
   → Hasilkan 16 byte random, return sebagai hex string (32 karakter)
   → Gunakan crypto.getRandomValues()

2. hashPassword(password: string, salt: string): Promise<string>
   → Gabungkan password + salt menjadi satu string
   → Hash dengan SHA-256 menggunakan crypto.subtle.digest()
   → Return hasil sebagai hex string

3. verifyPassword(inputPassword: string, storedHash: string, salt: string): Promise<boolean>
   → Hash inputPassword + salt, bandingkan dengan storedHash
   → Return true jika cocok, false jika tidak

4. generateAESKey(): Promise<string>
   → Generate AES-256 key menggunakan crypto.subtle.generateKey()
   → Export key ke format raw, return sebagai hex string (64 karakter)

5. encryptData(plaintext: string, keyHex: string): Promise<{ cipher: string, iv: string }>
   → Import keyHex sebagai AES-CBC key
   → Generate IV acak 16 byte
   → Enkripsi plaintext, return ciphertext dan IV keduanya sebagai hex string

6. decryptData(cipherHex: string, ivHex: string, keyHex: string): Promise<string>
   → Import keyHex, dekripsi cipherHex menggunakan ivHex
   → Return plaintext string
   → Throw error jika kunci salah

7. hexToBytes(hex: string): Uint8Array
8. bytesToHex(bytes: Uint8Array): string

Tambahkan JSDoc comment singkat di setiap fungsi.
Tidak boleh ada dependensi eksternal — hanya Web Crypto API.
```

---

## TASK AM-02 — Halaman Register

**Status:** `[ ]` Belum dikerjakan
**File:** `src/pages/Register.jsx`

### Prompt untuk IDE:

```
Buatkan halaman Register.jsx untuk e-wallet SecurePay menggunakan React dan Tailwind CSS.

Form registrasi berisi:
- Input: Username
- Input: Password (type="password", ada toggle show/hide)
- Input: Konfirmasi password
- Input: PIN 6 digit (type="password")
- Tombol "Daftar"

Validasi form:
- Username minimal 4 karakter
- Password minimal 8 karakter, harus mengandung huruf besar, angka, dan simbol
- Konfirmasi password harus sama dengan password
- PIN harus tepat 6 digit angka

Indikator kekuatan password real-time:
- Tampilkan progress bar di bawah field password
- Level: Sangat Lemah | Lemah | Sedang | Kuat | Sangat Kuat
- Warna berubah sesuai level (merah → kuning → hijau)

Proses saat tombol "Daftar" diklik:
1. Panggil generateSalt() dari utils/crypto.js
2. Panggil hashPassword(password, salt)
3. Panggil generateAESKey() untuk kunci enkripsi user
4. Panggil encryptData(pin, aesKey) untuk enkripsi PIN
5. Simpan ke AppContext: { username, passwordHash, salt, encryptedPin, pinIV }
6. Simpan aesKey ke sessionStorage (bukan localStorage — hilang saat tab ditutup)
7. Tampilkan modal "Registrasi berhasil!" dengan ringkasan teknis:
   - Salt: [hex]
   - Password hash: [hex]
   - PIN tersimpan sebagai: [ciphertext terenkripsi]
8. Setelah modal ditutup, redirect ke /login

Tampilkan panel "Proses keamanan" di samping form yang menjelaskan:
- "Password kamu TIDAK disimpan langsung"
- "Yang disimpan: hash(password + salt)"
- "Salt: nilai acak unik untuk setiap user"
Gunakan Tailwind CSS. Import fungsi dari src/utils/crypto.js.
```

---

## TASK AM-03 — Halaman Login + verifikasi hash

**Status:** `[ ]` Belum dikerjakan
**File:** `src/pages/Login.jsx`

### Prompt untuk IDE:

```
Buatkan halaman Login.jsx untuk SecurePay menggunakan React dan Tailwind CSS.

Form login berisi:
- Input: Username
- Input: Password (dengan toggle show/hide)
- Tombol "Masuk"
- Link "Belum punya akun? Daftar" → navigate ke /register

Proses verifikasi saat tombol "Masuk" diklik:
1. Ambil data user dari AppContext berdasarkan username
2. Jika user tidak ditemukan → tampilkan error "Username tidak ditemukan"
3. Panggil verifyPassword(inputPassword, storedHash, salt) dari utils/crypto.js
4. Jika hash cocok → login berhasil, redirect ke Dashboard
5. Jika tidak cocok → tampilkan error "Password salah" + counter percobaan

Fitur keamanan tambahan:
- Setelah 3x percobaan password salah, tampilkan pesan:
  "Akun terkunci sementara. Di sistem nyata, ini akan memblokir login selama 15 menit."
- Tambahkan delay 1 detik setiap percobaan gagal (simulasi anti-brute force)
- Tampilkan loading state saat proses verifikasi berlangsung

Panel edukatif di samping form:
- Judul: "Bagaimana verifikasi bekerja?"
- Langkah: Input → hash(input + salt) → bandingkan dengan hash tersimpan → cocok/tidak
- Visualisasi sederhana dengan panah

Gunakan Tailwind CSS. Import dari src/utils/crypto.js dan src/context/AppContext.jsx.
```

---

---

# 👤 HAFIDIN — Security Module: Transfer E2E

**Branch:** `feat/hafidin-transfer`
**Halaman utama:** `Transfer.jsx`, `EncryptionVisualizer.jsx`

---

## TASK HF-01 — Halaman Transfer E2E

**Status:** `[ ]` Belum dikerjakan
**File:** `src/pages/Transfer.jsx`

### Prompt untuk IDE:

```
Buatkan halaman Transfer.jsx untuk SecurePay — simulasi transfer e-wallet dengan enkripsi end-to-end.

Form transfer berisi:
- Input: Username penerima
- Input: Nominal (angka, format otomatis jadi "Rp 50.000" saat diketik)
- Input: Catatan opsional (max 100 karakter)
- Input: PIN konfirmasi (6 digit)
- Tombol "Kirim Transfer"

Proses saat transfer dikerjakan (tampilkan sebagai step visual, jangan langsung selesai):

Step 1 — "Membangun payload transaksi"
  Buat objek JSON:
  {
    from: currentUser.username,
    to: recipientUsername,
    amount: nominalRupiah,
    note: catatan,
    timestamp: Date.now(),
    txId: randomHex(8)
  }
  Tampilkan JSON ini di layar (plaintext)

Step 2 — "Mengenkripsi payload"
  Panggil encryptData(JSON.stringify(payload), aesKey) dari utils/crypto.js
  Tampilkan: ciphertext (hex) dan IV yang dihasilkan

Step 3 — "Memverifikasi PIN"
  Dekripsi encryptedPin menggunakan decryptData()
  Bandingkan dengan PIN yang diinput user
  Jika salah → batalkan transfer, tampilkan error

Step 4 — "Menyimpan transaksi"
  Simpan { encryptedPayload, iv, timestamp, type: 'debit', amount } ke AppContext
  Kurangi saldo pengirim, tambah saldo penerima (simulasi)
  Tampilkan konfirmasi sukses dengan txId

Setiap step ditampilkan sebagai card dengan status: pending → processing → done
Animasi transisi sederhana antar step menggunakan CSS transition.
Setelah selesai, tampilkan ringkasan dan tombol "Kembali ke Dashboard".

Gunakan Tailwind CSS. Import dari src/utils/crypto.js dan src/context/AppContext.jsx.
```

---

## TASK HF-02 — EncryptionVisualizer component

**Status:** `[ ]` Belum dikerjakan
**File:** `src/components/EncryptionVisualizer.jsx`

### Prompt untuk IDE:

```
Buatkan komponen React EncryptionVisualizer.jsx untuk SecurePay.

Komponen ini menerima props:
- plaintext: string (data sebelum enkripsi)
- ciphertext: string (data setelah enkripsi, hex)
- iv: string (initialization vector, hex)
- step: number (step animasi aktif: 0, 1, 2, 3)

Tampilan terdiri dari 4 kolom horizontal yang dihubungkan panah:

[Plaintext] → [+ IV acak] → [AES-256-CBC] → [Ciphertext]

Setiap kolom berisi:
- Label judul
- Konten (text atau hex, terpotong jika terlalu panjang)
- Badge warna sesuai step

Kolom yang aktif (sesuai props step) diberi border berwarna biru.
Kolom yang sudah selesai diberi checkmark hijau.
Kolom yang belum diberi warna abu.

Di bawah visualizer, tampilkan penjelasan:
- "IV memastikan plaintext yang sama menghasilkan ciphertext berbeda setiap kali"
- "Tanpa kunci AES yang tepat, ciphertext tidak bisa dibaca"

Gunakan Tailwind CSS. Komponen ini murni presentational (tidak ada logic crypto).
Gunakan di Transfer.jsx untuk menampilkan proses enkripsi secara visual.
```

---

## TASK HF-03 — Riwayat transaksi terenkripsi

**Status:** `[ ]` Belum dikerjakan
**File:** Tambahkan section ke `Transfer.jsx` atau buat `TransactionDetail.jsx`

### Prompt untuk IDE:

```
Tambahkan section "Riwayat transfer" di bawah form Transfer.jsx untuk SecurePay.

Ambil data transactions dari AppContext, filter hanya yang bertipe 'debit' dan 'credit'.

Setiap item menampilkan:
- Nominal transfer (+ atau -)
- Username penerima/pengirim
- Waktu: format lokal Indonesia
- Tombol toggle "Lihat data terenkripsi" / "Sembunyikan"

Saat "Lihat data terenkripsi" diklik:
  Tampilkan box monospace dengan:
  - Label "Payload tersimpan di database (AES-256-CBC):"
  - encryptedPayload dalam format hex, wrap setiap 64 karakter
  - Label "IV (Initialization Vector):"
  - IV dalam hex
  - Tombol "Dekripsi & lihat data asli" → panggil decryptData() lalu tampilkan JSON plaintext

Tujuan fitur ini: mendemonstrasikan bahwa data di "database" tersimpan terenkripsi,
bukan plaintext — penting untuk demo UAS.

Gunakan Tailwind CSS. Import dari src/utils/crypto.js dan src/context/AppContext.jsx.
```

---

---

# 👤 RAFIF — Security Flow & Dokumentasi

**Branch:** `feat/rafif-securityflow`
**Halaman utama:** `SecurityFlow.jsx`

---

## TASK RF-01 — Halaman SecurityFlow

**Status:** `[ ]` Belum dikerjakan
**File:** `src/pages/SecurityFlow.jsx`

### Prompt untuk IDE:

```
Buatkan halaman SecurityFlow.jsx untuk SecurePay — halaman edukasi interaktif tentang
sistem keamanan yang diimplementasikan.

Halaman terdiri dari 3 section utama:

--- Section 1: Alur Register & Login ---
Tampilkan diagram alur vertikal dengan langkah-langkah:
1. User input password (plaintext)
2. Generate salt acak (CSPRNG, 128-bit)
3. SHA-256(password + salt) → hash
4. Simpan hash + salt ke "database"
5. Saat login: hash(input + salt) → bandingkan → cocok/tidak

Setiap langkah berupa card dengan:
- Nomor langkah
- Judul singkat
- Penjelasan 1-2 kalimat
- Badge teknologi: SHA-256 / CSPRNG / AES-256

--- Section 2: Alur Enkripsi Transfer ---
Tampilkan diagram alur transfer terenkripsi:
Sender → [Buat payload JSON] → [Generate IV] → [AES-CBC Encrypt] → [Simpan ke DB]
DB → [AES-CBC Decrypt] → [Verifikasi] → Receiver

Gunakan warna berbeda untuk sisi pengirim (biru) dan penerima (hijau).

--- Section 3: Perbandingan teknis ---
Tabel perbandingan AES vs SHA-256:
| Aspek | AES-256-CBC | SHA-256 + Salt |
|-------|-------------|----------------|
| Tujuan | Enkripsi data (bisa di-decrypt) | Hash password (tidak bisa di-reverse) |
| Digunakan untuk | Saldo, PIN, payload transaksi | Password user |
| Kunci dibutuhkan | Ya (256-bit) | Tidak (one-way) |
| IV dibutuhkan | Ya (per enkripsi) | Salt (per user) |

Tambahkan tombol interaktif "Simulasi enkripsi langsung" yang membuka mini-demo:
- Input text bebas
- Klik enkripsi → tampilkan ciphertext
- Klik dekripsi → tampilkan kembali plaintext
(Gunakan encryptData dan decryptData dari utils/crypto.js)

Gunakan Tailwind CSS dengan desain yang bersih dan mudah dipahami untuk presentasi.
```

---

## TASK RF-02 — Halaman About / Tentang Sistem

**Status:** `[ ]` Belum dikerjakan
**File:** `src/pages/About.jsx` (opsional, tambahkan route `/about` di App.jsx Ilham)

### Prompt untuk IDE:

```
Buatkan halaman About.jsx untuk SecurePay — halaman "Tentang Sistem" untuk presentasi UAS.

Konten halaman:

1. Header: Logo + nama "SecurePay" + tagline "Sistem E-Wallet dengan Enkripsi End-to-End"

2. Section "Tim pengembang":
   Tampilkan 4 kartu anggota:
   - Ilham → Project Lead & Frontend Architecture
   - Amir → Security Module: Auth & Password Hashing
   - Hafidin → Security Module: Transfer End-to-End Encryption
   - Rafif → Security Flow Visualization & Dokumentasi

3. Section "Teknologi keamanan yang digunakan":
   - AES-256-CBC: Enkripsi simetris untuk data sensitif
   - SHA-256 + Salt: Hashing password one-way
   - Web Crypto API: Implementasi native browser, tanpa library eksternal
   - CSPRNG: Pembangkit angka acak kriptografis untuk salt dan IV

4. Section "Disclaimer":
   Teks: "Sistem ini adalah simulasi edukatif untuk keperluan UAS.
   Pada sistem produksi nyata, diperlukan backend server, HTTPS,
   dan manajemen kunci yang lebih kompleks."

Desain profesional dengan Tailwind CSS — cocok dijadikan halaman pembuka saat presentasi.
```

---

## TASK RF-03 — Dokumentasi teknis (README.md)

**Status:** `[ ]` Belum dikerjakan

### Prompt untuk IDE:

```
Buatkan README.md lengkap untuk project SecurePay di GitHub.

README harus mencakup:

# SecurePay — Implementasi Keamanan E-Wallet

## Deskripsi singkat (2-3 paragraf)

## Fitur keamanan yang diimplementasikan
- Daftar dengan penjelasan singkat setiap metode

## Tech stack (tabel)

## Cara menjalankan project
- Prerequisites: Node.js 18+, npm
- Clone repo
- npm install
- npm run dev
- Buka http://localhost:5173

## Struktur folder (tree)

## Penjelasan teknis singkat
### SHA-256 + Salt
### AES-256-CBC
### IV (Initialization Vector)

## Alur penggunaan (numbered list)
1. Register akun baru
2. Login dengan verifikasi hash
3. Lihat saldo di Dashboard
4. Kirim transfer terenkripsi
5. Lihat alur keamanan di halaman Security Flow

## Tim
| Nama | NIM | Peran |
|------|-----|-------|
| Ilham | ... | Project Lead |
| Amir | ... | Auth Module |
| Hafidin | ... | Transfer Module |
| Rafif | ... | Security Flow & Docs |

## Lisensi: MIT
```

---

---

## Checklist final — sebelum presentasi UAS

### Demo flow yang harus bisa dijalankan:
- [ ] Buka `/register` → isi form → lihat output hash & salt
- [ ] Buka `/login` → masukkan password → verifikasi hash berhasil
- [ ] Di Dashboard → saldo tampil terformat (sudah didekripsi)
- [ ] Buka `/transfer` → isi form → lihat 4 step enkripsi berjalan
- [ ] Di riwayat transaksi → klik "lihat payload" → tampil ciphertext
- [ ] Klik "dekripsi" → tampil JSON plaintext asli
- [ ] Buka `/security` → jelaskan diagram alur ke audiens
- [ ] Coba input password salah 3x → lihat pesan anti-brute force

### Pembagian narasi saat presentasi:
| Anggota | Bagian yang dibawakan | Durasi estimasi |
|---|---|---|
| Ilham | Intro sistem, arsitektur, demo Dashboard | 3 menit |
| Amir | Demo Register + Login, penjelasan SHA-256 | 3 menit |
| Hafidin | Demo Transfer E2E, visualisasi enkripsi | 3 menit |
| Rafif | Halaman Security Flow, kesimpulan & saran | 3 menit |

---

*File ini dibuat sebagai panduan prompting per anggota. Setiap prompt sudah siap di-paste langsung ke Cursor / Windsurf / Claude Code.*
