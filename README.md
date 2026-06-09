# SecurePay — E-Wallet Security Demonstration

SecurePay is a React + Vite application developed to simulate and demonstrate modern e-wallet security features using native Web Crypto APIs.

## Fitur Utama (Simulasi)
- **Register & Login**: Password hashed using **SHA-256 + Salt** on the client side.
- **Enkripsi Saldo & PIN**: Sensitive values are stored encrypted in `localStorage` using **AES-256-CBC**.
- **Transfer End-to-End**: Secure transactions utilizing encryption payload visualizers showing exact ciphertext transitions.
- **Security Flow Visualization**: Visual walkthroughs demonstrating encryption operations for learning.

## Tech Stack
- **Frontend**: React 18 + Vite
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v3 + PostCSS
- **Cryptography**: Web Crypto API (native browser, no external library dependencies)
- **State management**: React Context API
- **Local DB**: `localStorage` and `sessionStorage`

---

## Cara Menjalankan Project Secara Lokal

### Prasyarat
Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) (versi 18 ke atas disarankan) dan `npm`.

### 1. Jalankan Install Dependensi
Buka terminal di direktori project `securepay/` lalu jalankan perintah:
```bash
npm install
```

### 2. Jalankan Server Development
Setelah instalasi selesai, jalankan server development lokal:
```bash
npm run dev
```

### 3. Buka Aplikasi di Browser
Setelah server berjalan, buka browser dan kunjungi:
[http://localhost:5173](http://localhost:5173)

---

## Lisensi
Project ini dibuat untuk keperluan UAS Mata Kuliah Keamanan Informasi.
