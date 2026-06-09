function DeveloperCard({ name, role, details, avatarInitial }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6 flex flex-col justify-between hover:border-slate-500 hover:shadow-lg hover:shadow-blue-950/20 transition-all duration-300">
      <div>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600/15 text-blue-400 font-extrabold text-lg border border-blue-500/20">
            {avatarInitial}
          </div>
          <div>
            <h3 className="font-bold text-white text-base">{name}</h3>
            <p className="text-xs font-semibold text-blue-400 mt-0.5">{role}</p>
          </div>
        </div>
        <p className="mt-4 text-xs leading-5 text-slate-400">{details}</p>
      </div>
    </div>
  );
}

function TechBadge({ title, desc }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5 hover:border-slate-700 transition-colors">
      <h4 className="text-sm font-bold text-white font-mono">{title}</h4>
      <p className="mt-2 text-xs leading-5 text-slate-400">{desc}</p>
    </div>
  );
}

export default function About() {
  const developers = [
    {
      name: 'Ilham',
      role: 'Project Lead & Frontend Architecture',
      details: 'Mendesain struktur routing aplikasi, arsitektur state reducer global, serta layout dasar Dashboard dan antarmuka komponen.',
      avatarInitial: 'IL'
    },
    {
      name: 'Amir',
      role: 'Security Module: Auth & Password Hashing',
      details: 'Mengimplementasikan modul registrasi, validasi kekuatan password, login terproteksi, serta visualisasi alur pencocokan hash sandi.',
      avatarInitial: 'AM'
    },
    {
      name: 'Hafidin',
      role: 'Security Module: Transfer End-to-End Encryption',
      details: 'Mengembangkan formulir transfer, pipeline visualizer enkripsi langkah-demi-langkah, dan riwayat transaksi dengan inspeksi data asli.',
      avatarInitial: 'HF'
    },
    {
      name: 'Rafif',
      role: 'Security Flow Visualization & Dokumentasi',
      details: 'Merancang diagram alur keamanan interaktif, live playground simulator enkripsi, halaman penjelasan, dan dokumentasi proyek.',
      avatarInitial: 'RF'
    }
  ];

  return (
    <div className="w-full space-y-10 pb-12">
      {/* ── Header Section ────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800/80 to-slate-900/60 p-8 shadow-xl shadow-slate-950/30 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay pointer-events-none" />
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="bg-blue-600/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider">
            PROJECT UAS KEAMANAN INFORMASI
          </span>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2.5">
            <span className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-2xl font-extrabold shadow-md shadow-blue-500/20">SP</span>
            SecurePay
          </h1>
          <p className="text-lg font-bold text-slate-200">
            Sistem E-Wallet dengan Enkripsi End-to-End
          </p>
          <p className="text-sm leading-6 text-slate-400 max-w-xl mx-auto">
            SecurePay dirancang untuk menunjukkan implementasi praktis enkripsi simetris AES-256-CBC dan hashing password SHA-256 + Salt menggunakan pustaka native Web Crypto API browser.
          </p>
        </div>
      </section>

      {/* ── Developers Section ────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            👨‍💻 Tim Pengembang
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Kolaborasi anggota tim dalam mewujudkan sistem keamanan transaksi SecurePay.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {developers.map((dev) => (
            <DeveloperCard
              key={dev.name}
              name={dev.name}
              role={dev.role}
              details={dev.details}
              avatarInitial={dev.avatarInitial}
            />
          ))}
        </div>
      </section>

      {/* ── Security Stack Section ────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-xl font-bold text-white">
            🛡️ Teknologi Keamanan yang Digunakan
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Mekanisme kriptografis bawaan browser yang diintegrasikan untuk menjaga keamanan data.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <TechBadge
            title="AES-256-CBC"
            desc="Enkripsi kunci simetris kelas militer yang digunakan untuk menyandikan PIN user, saldo akun, dan data payload rincian transfer sebelum disimpan."
          />
          <TechBadge
            title="SHA-256 + Salt"
            desc="Algoritma hashing satu arah untuk validasi sandi. Salt acak ditambahkan di setiap akun guna mematikan serangan Rainbow Table."
          />
          <TechBadge
            title="Web Crypto API"
            desc="Standardisasi API kriptografi W3C asli browser. Keamanan terjamin cepat tanpa ketergantungan library pihak ketiga."
          />
          <TechBadge
            title="CSPRNG"
            desc="Pembangkit angka acak yang aman (Cryptographically Secure Pseudo-Random Number Generator) untuk menghasilkan salt unik dan IV secara aman."
          />
        </div>
      </section>

      {/* ── Disclaimer Section ────────────────────────────────────────── */}
      <section className="rounded-xl border border-amber-500/20 bg-amber-950/10 p-6">
        <div className="flex gap-4 items-start">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
            ⚠️
          </span>
          <div>
            <h3 className="font-bold text-white text-base">Disclaimer Simulasi</h3>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Sistem ini adalah **simulasi edukatif** untuk memenuhi kriteria penilaian UAS. Pada arsitektur komersial atau sistem produksi nyata, diperlukan server backend mandiri, saluran komunikasi HTTPS/TLS, manajemen kunci enkripsi (KMS) yang dinamis, serta mekanisme proteksi memori yang lebih menyeluruh.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
