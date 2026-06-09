# SecurePay — E-Wallet Security Demonstration

SecurePay adalah aplikasi e-wallet berbasis React + Vite yang dikembangkan untuk mendemonstrasikan implementasi praktis konsep keamanan kriptografis sisi klien (client-side cryptography). Sistem ini memanfaatkan standardisasi **Web Crypto API** native browser (W3C Standard) tanpa bergantung pada library eksternal, guna menjamin kinerja tinggi, transparansi, dan keamanan langsung di lingkungan browser pengguna.

Proyek ini diajukan untuk memenuhi persyaratan ujian akhir semester (UAS) mata kuliah Keamanan Informasi.

---

## Fitur Utama & Aspek Keamanan

1. **Registrasi & Autentikasi Pengguna (SHA-256 + Salt)**:
   - Password pengguna tidak pernah disimpan dalam bentuk teks biasa (plaintext).
   - Saat registrasi, password digabungkan dengan **Salt 128-bit** unik yang dihasilkan oleh generator acak kriptografis (CSPRNG).
   - Pasangan ini di-hash dengan **SHA-256** dan disimpan di `localStorage` bersama salt-nya.
   - Saat login, password input digabungkan dengan salt tersimpan dan dicocokkan dengan hash tersimpan.

2. **Perlindungan Data Sensitif (AES-256-CBC)**:
   - Saldo pengguna dan PIN 6-digit dienkripsi secara simetris menggunakan algoritma **AES-256-CBC**.
   - Kunci enkripsi AES dihasilkan secara dinamis saat pendaftaran, disimpan secara aman di `sessionStorage` (akan terhapus jika tab ditutup), dan digunakan untuk mendekripsi saldo pada saat dimuat di Dashboard.

3. **Transfer End-to-End & Transaksi Terenkripsi**:
   - Transfer diproses dengan memadukan data transaksi ke dalam payload JSON plaintext.
   - Payload tersebut dienkripsi dengan kunci AES-256 pengirim menggunakan **Initialization Vector (IV)** acak 16-byte.
   - PIN pengguna divalidasi dengan mendekripsi PIN terenkripsi yang disimpan saat registrasi, lalu dibandingkan dengan PIN yang diinput saat transfer.
   - Rincian transaksi disimpan sebagai ciphertext hex dan IV hex di `localStorage` masing-masing penerima dan pengirim.

4. **Visualisasi Enkripsi & Edukasi Keamanan**:
   - Komponen visualizer langkah-demi-langkah interaktif yang melacak tahapan perubahan plaintext JSON menjadi ciphertext terenkripsi.
   - Halaman **Alur Keamanan** khusus yang menyajikan diagram alur visual, tabel komparatif AES vs SHA-256, serta Playground Simulasi Kriptografi langsung.

---

## Penjelasan Teknis Kriptografi

### 1. SHA-256 + Salt
Fungsi hash satu arah (one-way function) yang mengubah input teks biasa dengan panjang dinamis menjadi nilai keluaran 256-bit (64 karakter heksadesimal) yang konstan. Penggunaan **Salt** acak 16-byte yang dihasilkan oleh `crypto.getRandomValues()` mencegah serangan kamus (dictionary attack) dan pencocokan tabel pelangi (rainbow table) jika database bocor, karena hash yang dihasilkan untuk sandi yang sama akan berbeda untuk setiap pengguna.

### 2. AES-256-CBC
Standar enkripsi simetris (Advanced Encryption Standard) dengan panjang kunci 256-bit menggunakan mode operasi **Cipher Block Chaining (CBC)**. Mode ini memerlukan **Initialization Vector (IV)** 16-byte yang berbeda untuk setiap operasi enkripsi. Jika dua blok teks biasa identik, hasil ciphertext-nya akan sepenuhnya berbeda berkat pengkorelasian blok sebelumnya dengan IV acak tersebut.

---

## Struktur Folder Proyek

```
securepay/
├── docs/
│   └── TASKLIST_SecurePay.md    # Panduan tasklist tim
├── public/                      # Aset publik statis
├── src/
│   ├── components/
│   │   ├── EncryptionVisualizer.jsx  # Komponen presentasi alur enkripsi
│   │   ├── TransactionList.jsx       # Riwayat transaksi dengan debugger payload
│   │   └── WalletCard.jsx            # Kartu saldo terenkripsi & tombol refresh
│   ├── context/
│   │   └── AppContext.jsx            # Reducer global dan sinkronisasi localStorage
│   ├── pages/
│   │   ├── About.jsx                 # Halaman tim dan detail sistem
│   │   ├── Dashboard.jsx             # Panel utama pengguna (dilindungi)
│   │   ├── Login.jsx                 # Halaman login dengan visualizer langkah
│   │   ├── Register.jsx              # Registrasi dengan kekuatan sandi & detail salt
│   │   ├── SecurityFlow.jsx          # Edukasi diagram alur & playground simulator
│   │   └── Transfer.jsx              # Simulasi transfer E2E 4-step & inspeksi DB
│   ├── utils/
│   │   ├── crypto.js                 # Pustaka wrapper fungsi Web Crypto API
│   │   └── storage.js                # Helper akses database lokal
│   ├── App.jsx                       # Routing utama React Router
│   ├── index.css                     # Konfigurasi styling Tailwind
│   └── main.jsx                      # Entrypoint aplikasi React
├── package.json                      # Konfigurasi dependensi npm
├── tailwind.config.js                # Kustomisasi utility styling
└── vite.config.js                    # Konfigurasi builder Vite
```

---

## Cara Menjalankan Proyek Secara Lokal

### Prasyarat
- Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) (versi 18 ke atas) dan `npm`.

### 1. Kloning Repositori & Masuk ke Direktori
```bash
cd securepay
```

### 2. Instalasi Dependensi
Jalankan perintah berikut untuk mengunduh modul React, React Router, dan Tailwind CSS:
```bash
npm install
```

### 3. Menjalankan Server Development Lokal
Jalankan server pengembangan Vite untuk menjalankan aplikasi di browser:
```bash
npm run dev
```
Setelah server aktif, buka browser Anda dan akses:  
👉 **[http://localhost:5173](http://localhost:5173)**

### 4. Build Proyek untuk Produksi
Gunakan perintah build untuk memeriksa kompatibilitas kompilasi aset:
```bash
npm run build
```

### 5. Linting Kode
Verifikasi kepatuhan kode terhadap standar dengan menjalankan linter:
```bash
npm run lint
```

---

## Alur Demo Penggunaan Aplikasi (E2E Flow)

1. **Registrasi Akun Baru (`/register`)**:
   - Buka halaman daftar, masukkan username unik, password kuat, dan PIN 6-digit.
   - Perhatikan indikator kekuatan password real-time dan panel visualizer salt/hash di samping.
   - Klik "Daftar" dan amati ringkasan modal teknis yang menampilkan data hex asli sebelum diarahkan ke halaman login.

2. **Login Pengguna (`/login`)**:
   - Masukkan username dan password Anda.
   - Amati visualisasi 4-langkah verifikasi yang menyala secara dinamis sewaktu hash dicocokkan.
   - Coba masukkan password salah 3 kali untuk memicu mekanisme penguncian akun (anti-brute force delay).

3. **Dashboard & Wallet (`/`)**:
   - Halaman ini dilindungi secara ketat. Pengguna akan dilempar ke login jika belum diautentikasi.
   - Saldo didekripsi secara otomatis. Anda bisa mengeklik tombol **Refresh** untuk memicu ulang dekripsi saldo dari `localStorage`.

4. **Kirim Transfer Terenkripsi (`/transfer`)**:
   - Masukkan username penerima (buat akun kedua terlebih dahulu), nominal transfer, dan catatan opsional.
   - Masukkan PIN 6-digit konfirmasi Anda.
   - Amati visualizer enkripsi 4-langkah yang memproses payload JSON menjadi data terenkripsi dan membandingkan kecocokan PIN.
   - Kembali ke dashboard atau lihat riwayat transaksi di bawah. Klik **"Lihat data terenkripsi"** dan klik **"Dekripsi & lihat data asli"** untuk menginspeksi representasi ciphertext.

5. **Edukasi & Tentang Proyek (`/security` & `/about`)**:
   - Pelajari diagram alur dan bandingkan performa teknis AES vs SHA-256.
   - Coba playground enkripsi interaktif langsung dengan memasukkan pesan khusus dan melihat ciphertext hex-nya.
   - Kunjungi menu **Tentang** untuk meninjau profil pengembang proyek.

---

## Tim Pengembang (Mahasiswa Keamanan Informasi)

| Nama Anggota | NIM | Peran / Fokus Implementasi |
|---|---|---|
| **Ilham** | *(Mahasiswa)* | Project Lead & Frontend Architecture |
| **Amir** | *(Mahasiswa)* | Security Module: Auth & Password Hashing |
| **Hafidin** | *(Mahasiswa)* | Security Module: Transfer End-to-End Encryption |
| **Rafif** | *(Mahasiswa)* | Security Flow Visualization & Dokumentasi |

---

## Lisensi
Aplikasi demonstrasi ini dirilis di bawah lisensi **MIT**. Dibuat murni untuk tujuan akademis dan edukasi UAS.
