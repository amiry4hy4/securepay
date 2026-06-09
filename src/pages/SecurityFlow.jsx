import { useState, useEffect } from 'react';
import { generateAESKey, encryptData, decryptData } from '../utils/crypto';

// ── Icons ──────────────────────────────────────────────────────────────────
function LockIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

function UnlockIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 019.9-1" />
    </svg>
  );
}

function ShieldCheckIcon({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function KeyIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  );
}

export default function SecurityFlow() {
  // Live Simulator States
  const [simPlaintext, setSimPlaintext] = useState('SecurePay Rahasia 123');
  const [simCiphertext, setSimCiphertext] = useState('');
  const [simIV, setSimIV] = useState('');
  const [simKeyHex, setSimKeyHex] = useState('');
  const [simDecrypted, setSimDecrypted] = useState('');
  const [simError, setSimError] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  // Generate an ephemeral simulator AES key on mount
  useEffect(() => {
    async function initKey() {
      try {
        const key = await generateAESKey();
        setSimKeyHex(key);
      } catch (err) {
        console.error('Failed to generate simulation AES key:', err);
      }
    }
    initKey();
  }, []);

  const handleSimulateEncrypt = async () => {
    if (!simPlaintext.trim() || !simKeyHex) return;
    setIsSimulating(true);
    setSimError('');
    setSimDecrypted('');
    try {
      const result = await encryptData(simPlaintext, simKeyHex);
      setSimCiphertext(result.cipher);
      setSimIV(result.iv);
    } catch (err) {
      setSimError(`Enkripsi Gagal: ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSimulateDecrypt = async () => {
    if (!simCiphertext || !simIV || !simKeyHex) return;
    setIsSimulating(true);
    setSimError('');
    try {
      const result = await decryptData(simCiphertext, simIV, simKeyHex);
      setSimDecrypted(result);
    } catch (err) {
      setSimError(`Dekripsi Gagal: ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleRegenerateKey = async () => {
    setSimError('');
    setSimCiphertext('');
    setSimIV('');
    setSimDecrypted('');
    try {
      const key = await generateAESKey();
      setSimKeyHex(key);
    } catch (err) {
      setSimError(`Gagal generate key baru: ${err.message}`);
    }
  };

  // Register & Login Flow Card Steps
  const authSteps = [
    {
      num: 1,
      title: 'User Input Password',
      desc: 'Pengguna memasukkan password dalam bentuk plaintext pada form registrasi.',
      tech: 'User Input',
      techColor: 'bg-slate-700 text-slate-200'
    },
    {
      num: 2,
      title: 'Generate Salt Acak',
      desc: 'Sistem men-generate salt 16-byte acak secara kriptografis menggunakan CSPRNG.',
      tech: 'CSPRNG (128-bit)',
      techColor: 'bg-blue-900/50 text-blue-300 border border-blue-800'
    },
    {
      num: 3,
      title: 'Hashing SHA-256',
      desc: 'Password plaintext digabungkan dengan salt lalu di-hash menggunakan algoritma SHA-256.',
      tech: 'SHA-256',
      techColor: 'bg-cyan-900/50 text-cyan-300 border border-cyan-800'
    },
    {
      num: 4,
      title: 'Simpan ke Database',
      desc: 'Hasil hash password beserta salt disimpan ke media penyimpanan (localStorage). Password asli dibuang.',
      tech: 'LocalStorage / DB',
      techColor: 'bg-purple-900/50 text-purple-300 border border-purple-800'
    },
    {
      num: 5,
      title: 'Verifikasi Login',
      desc: 'Saat login, input password digabung salt tersimpan, di-hash ulang, lalu dibandingkan dengan hash tersimpan.',
      tech: 'Verification Logic',
      techColor: 'bg-emerald-900/50 text-emerald-300 border border-emerald-800'
    }
  ];

  return (
    <div className="w-full space-y-10 pb-12">
      {/* ── Page Header ───────────────────────────────────────────────── */}
      <section className="rounded-lg border border-slate-700 bg-slate-800/70 p-6 shadow-xl shadow-slate-950/20">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-400">
              Edukasi Kriptografi
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-white tracking-tight">
              Alur Keamanan SecurePay
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Bagaimana data e-wallet Anda dilindungi secara end-to-end langsung di dalam browser menggunakan Web Crypto API.
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <ShieldCheckIcon />
          </div>
        </div>
      </section>

      {/* ── Section 1: Alur Register & Login ──────────────────────────── */}
      <section className="space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-sm font-extrabold text-white">1</span>
            Alur Registrasi & Autentikasi Login (Password Hashing)
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Sistem menggunakan kombinasi SHA-256 dan Salt unik per user untuk mengamankan data password tanpa menyimpannya langsung.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          {authSteps.map((step) => (
            <div
              key={step.num}
              className="relative rounded-lg border border-slate-700 bg-slate-900/40 p-4 flex flex-col justify-between hover:border-slate-600 transition-all duration-300 group"
            >
              <div>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  {step.num}
                </span>
                <h3 className="mt-3 text-sm font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-400">{step.desc}</p>
              </div>
              <div className="mt-4">
                <span className={`inline-block px-2.5 py-1 text-[10px] font-mono font-bold rounded ${step.techColor}`}>
                  {step.tech}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 2: Alur Enkripsi Transfer ─────────────────────────── */}
      <section className="space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-sm font-extrabold text-white">2</span>
            Alur Enkripsi Transfer E2E (AES-256-CBC)
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Detail bagaimana payload transaksi diamankan dari sisi pengirim (Sender) hingga diterima oleh penerima (Receiver).
          </p>
        </div>

        <div className="space-y-6">
          {/* Sender Side */}
          <div className="rounded-xl border border-blue-900/30 bg-blue-950/10 p-6">
            <div className="mb-4 flex items-center gap-2 text-blue-400 font-bold text-sm tracking-wider uppercase">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
              Sisi Pengirim (Sender Side)
            </div>
            
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-lg border border-blue-900/40 bg-slate-900/60 p-4">
                <div className="text-xs font-mono text-blue-300 font-bold mb-1">1. Build Payload</div>
                <p className="text-xs text-slate-400">
                  Data transaksi (pengirim, penerima, nominal, catatan) dikemas menjadi objek JSON.
                </p>
              </div>
              
              <div className="rounded-lg border border-blue-900/40 bg-slate-900/60 p-4">
                <div className="text-xs font-mono text-blue-300 font-bold mb-1">2. CSPRNG IV</div>
                <p className="text-xs text-slate-400">
                  Generate Initialization Vector (IV) acak 16-byte untuk memastikan keunikan enkripsi.
                </p>
              </div>
              
              <div className="rounded-lg border border-blue-900/40 bg-slate-900/60 p-4">
                <div className="text-xs font-mono text-blue-300 font-bold mb-1">3. AES Encrypt</div>
                <p className="text-xs text-slate-400">
                  Payload JSON dienkripsi menggunakan kunci AES-256 user + IV dalam mode CBC.
                </p>
              </div>
              
              <div className="rounded-lg border border-blue-900/40 bg-slate-900/60 p-4">
                <div className="text-xs font-mono text-blue-300 font-bold mb-1">4. Save DB (LocalStorage)</div>
                <p className="text-xs text-slate-400">
                  Hanya Ciphertext (hex) dan IV yang disimpan di "database" lokal. Plaintext dibuang.
                </p>
              </div>
            </div>
          </div>

          {/* Connection Divider */}
          <div className="flex items-center justify-center gap-2 py-1">
            <div className="h-px flex-grow bg-slate-800" />
            <span className="px-3 py-1.5 rounded-full border border-slate-700 bg-slate-900 text-xs font-mono font-bold text-slate-400">
              DATABASE PERSISTENCE (CIPHERTEXT & IV)
            </span>
            <div className="h-px flex-grow bg-slate-800" />
          </div>

          {/* Receiver Side */}
          <div className="rounded-xl border border-emerald-900/30 bg-emerald-950/10 p-6">
            <div className="mb-4 flex items-center gap-2 text-emerald-400 font-bold text-sm tracking-wider uppercase">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Sisi Penerima (Receiver Side)
            </div>
            
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-lg border border-emerald-900/40 bg-slate-900/60 p-4">
                <div className="text-xs font-mono text-emerald-300 font-bold mb-1">1. Fetch Ciphertext</div>
                <p className="text-xs text-slate-400">
                  Penerima mengunduh data transaksi terenkripsi (ciphertext + IV) dari database.
                </p>
              </div>
              
              <div className="rounded-lg border border-emerald-900/40 bg-slate-900/60 p-4">
                <div className="text-xs font-mono text-emerald-300 font-bold mb-1">2. Import AES Key</div>
                <p className="text-xs text-slate-400">
                  Browser mengimpor kunci AES-256 penerima untuk memulai modul Web Crypto API.
                </p>
              </div>
              
              <div className="rounded-lg border border-emerald-900/40 bg-slate-900/60 p-4">
                <div className="text-xs font-mono text-emerald-300 font-bold mb-1">3. AES Decrypt</div>
                <p className="text-xs text-slate-400">
                  Ciphertext didekripsi dengan kunci AES penerima + IV untuk menghasilkan JSON asli.
                </p>
              </div>
              
              <div className="rounded-lg border border-emerald-900/40 bg-slate-900/60 p-4">
                <div className="text-xs font-mono text-emerald-300 font-bold mb-1">4. Verifikasi & Tampilkan</div>
                <p className="text-xs text-slate-400">
                  Browser mem-parsing JSON plaintext, memvalidasi integritas data, dan merendernya di layar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Perbandingan Teknis ────────────────────────────── */}
      <section className="space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-sm font-extrabold text-white">3</span>
            Perbandingan Teknis Kriptografi
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Perbedaan fundamental antara fungsi enkripsi simetris (AES) dan fungsi hash satu arah (SHA-256).
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900/50 shadow-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-950/60 text-xs font-extrabold uppercase text-slate-400">
                <th className="p-4">Aspek</th>
                <th className="p-4 border-l border-slate-800 text-blue-300">AES-256-CBC</th>
                <th className="p-4 border-l border-slate-800 text-cyan-300">SHA-256 + Salt</th>
              </tr>
            </thead>
            <tbody className="text-xs leading-5 text-slate-300 font-medium">
              <tr className="border-b border-slate-800">
                <td className="p-4 font-bold bg-slate-950/10">Tujuan</td>
                <td className="p-4 border-l border-slate-800">Enkripsi data dua arah (dapat didekripsi kembali ke bentuk semula).</td>
                <td className="p-4 border-l border-slate-800">Hashing satu arah (tidak dapat diubah kembali ke data asli).</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="p-4 font-bold bg-slate-950/10">Digunakan Untuk</td>
                <td className="p-4 border-l border-slate-800">Saldo user, PIN keamanan, payload detail riwayat transaksi.</td>
                <td className="p-4 border-l border-slate-800">Kredensial password utama pengguna untuk otentikasi login.</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="p-4 font-bold bg-slate-950/10">Kunci Dibutuhkan</td>
                <td className="p-4 border-l border-slate-800 font-mono text-[10px] text-slate-400">Ya (kunci simetris 256-bit rahasia).</td>
                <td className="p-4 border-l border-slate-800">Tidak membutuhkan kunci (menggunakan fungsi matematis terstandar).</td>
              </tr>
              <tr>
                <td className="p-4 font-bold bg-slate-950/10">Parameter Unik</td>
                <td className="p-4 border-l border-slate-800">IV (Initialization Vector) per operasi enkripsi.</td>
                <td className="p-4 border-l border-slate-800">Salt (nilai acak unik yang di-generate per akun).</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Simulasi Enkripsi Langsung (Interactive Mini-Demo) ────────── */}
      <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-6 shadow-xl">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-500 text-xs text-white">▶</span>
              Simulasi Kriptografi Langsung
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Demo langsung Web Crypto API menggunakan kunci ephemeral yang dibuat saat halaman dibuka.
            </p>
          </div>
          <button
            type="button"
            onClick={handleRegenerateKey}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-950 px-3.5 py-2 text-xs font-bold text-slate-300 hover:border-blue-400 hover:text-white transition-all"
          >
            <KeyIcon className="h-3.5 w-3.5" />
            Regenerate AES Key
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
          {/* Inputs & Controls */}
          <div className="space-y-4">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Plaintext Input</span>
              <textarea
                value={simPlaintext}
                onChange={(e) => setSimPlaintext(e.target.value)}
                rows={3}
                placeholder="Ketik data rahasia di sini..."
                className="mt-2 w-full resize-none rounded-lg border border-slate-600 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
              />
            </label>

            {/* Simulation Key Bar */}
            <div className="rounded-lg border border-slate-700/80 bg-slate-950/60 p-3 flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kunci AES-256 Ephemeral (Hex)</span>
              <code className="text-xs font-mono font-bold text-blue-400 select-all break-all leading-5">
                {simKeyHex || 'Membuat kunci ephemeral...'}
              </code>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleSimulateEncrypt}
                disabled={isSimulating || !simPlaintext.trim() || !simKeyHex}
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-bold text-white shadow-md shadow-blue-950/30 hover:bg-blue-500 transition-colors disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
              >
                <LockIcon className="h-4 w-4" />
                Enkripsi (Encrypt)
              </button>

              <button
                type="button"
                onClick={handleSimulateDecrypt}
                disabled={isSimulating || !simCiphertext || !simIV || !simKeyHex}
                className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 text-sm font-bold text-white shadow-md shadow-emerald-950/30 hover:bg-emerald-500 transition-colors disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
              >
                <UnlockIcon className="h-4 w-4" />
                Dekripsi (Decrypt)
              </button>
            </div>

            {simError && (
              <div className="rounded-lg border border-red-500/30 bg-red-950/45 px-4 py-3 text-xs text-red-200">
                {simError}
              </div>
            )}
          </div>

          {/* Cryptographic Monospace Console */}
          <div className="rounded-lg border border-slate-700 bg-slate-950 p-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500">Output Kriptografi</span>
                <span className="inline-flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              </div>

              {/* IV Display */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">IV (Initialization Vector) - 16 bytes:</span>
                <pre className="overflow-x-auto rounded border border-slate-800/80 bg-slate-900/60 p-2 font-mono text-xs text-slate-300">
                  {simIV || '(Menunggu enkripsi...)'}
                </pre>
              </div>

              {/* Ciphertext Display */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Ciphertext (AES-CBC Hex):</span>
                <pre className="max-h-24 overflow-y-auto whitespace-pre-wrap break-all rounded border border-slate-800/80 bg-slate-900/60 p-2 font-mono text-xs text-yellow-300 leading-relaxed">
                  {simCiphertext || '(Menunggu enkripsi...)'}
                </pre>
              </div>

              {/* Decrypted Display */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Decrypted Plaintext:</span>
                <pre className="overflow-x-auto rounded border border-slate-800/80 bg-slate-900/60 p-2 font-mono text-xs text-emerald-300 font-semibold">
                  {simDecrypted || '(Menunggu dekripsi...)'}
                </pre>
              </div>
            </div>

            <div className="mt-5 text-[10px] font-mono leading-relaxed text-slate-600">
              * Mode: AES-CBC. Padding: PKCS#7. Key Size: 256-bit. IV dibangkitkan acak per enkripsi demi keamanan.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
