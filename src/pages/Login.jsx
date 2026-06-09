import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { verifyPassword } from '../utils/crypto';

const MAX_ATTEMPTS = 3;
const LOCKOUT_DELAY_MS = 1000;

// ── Icon helpers ──────────────────────────────────────────────────────────────
function EyeIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3l18 18" />
      <path d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58" />
      <path d="M9.88 4.24A10.73 10.73 0 0112 4c5 0 9 5 9 8a8.22 8.22 0 01-2.14 3.95" />
      <path d="M6.61 6.61C4.42 8.11 3 10.42 3 12c0 3 4 8 9 8a10.4 10.4 0 004.39-1" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      className="h-5 w-5 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

// ── Verification step component ───────────────────────────────────────────────
function VerifyStep({ step, label, detail, active, done }) {
  return (
    <div className={`flex items-start gap-3 rounded-lg border p-3 transition-all duration-500 ${
      done
        ? 'border-emerald-500/40 bg-emerald-950/30'
        : active
        ? 'border-blue-500/40 bg-blue-950/30'
        : 'border-slate-700 bg-slate-900/50'
    }`}>
      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
        done
          ? 'bg-emerald-500/20 text-emerald-300'
          : active
          ? 'bg-blue-500/20 text-blue-300'
          : 'bg-slate-800 text-slate-500'
      }`}>
        {done ? (
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        ) : (
          step
        )}
      </div>
      <div>
        <p className={`text-sm font-semibold transition-colors ${
          done ? 'text-emerald-300' : active ? 'text-blue-200' : 'text-slate-400'
        }`}>{label}</p>
        <p className="mt-0.5 text-xs leading-5 text-slate-500">{detail}</p>
      </div>
    </div>
  );
}

// ── Arrow divider ─────────────────────────────────────────────────────────────
function Arrow({ active }) {
  return (
    <div className="flex justify-center py-0.5">
      <svg
        className={`h-4 w-4 transition-colors duration-300 ${active ? 'text-blue-400' : 'text-slate-700'}`}
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      >
        <path d="M12 5v14M19 12l-7 7-7-7" />
      </svg>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate();
  const { users, login } = useContext(AppContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Verification visualization state: 0=idle, 1=step1, 2=step2, 3=step3, 4=done
  const [verifyStage, setVerifyStage] = useState(0);

  const isDisabled = isLoading || isLocked;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDisabled) return;

    setError('');
    setIsLoading(true);
    setVerifyStage(1); // Step 1: Ambil data user

    try {
      // Simulate realistic step timing
      await new Promise((r) => setTimeout(r, 350));

      // Step 1 – find user
      const foundUser = users.find(
        (u) => u.username.toLowerCase() === username.trim().toLowerCase()
      );

      if (!foundUser) {
        setVerifyStage(0);
        setError('Username tidak ditemukan.');
        setIsLoading(false);
        return;
      }

      setVerifyStage(2); // Step 2: hash(input + salt)
      await new Promise((r) => setTimeout(r, 350));

      setVerifyStage(3); // Step 3: bandingkan hash
      await new Promise((r) => setTimeout(r, 350));

      // Verify password
      const isMatch = await verifyPassword(password, foundUser.passwordHash, foundUser.salt);

      if (isMatch) {
        setVerifyStage(4); // Done – cocok!
        await new Promise((r) => setTimeout(r, 500));
        // Retrieve aesKey from sessionStorage if available (set during registration)
        login(foundUser);
        navigate('/');
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setVerifyStage(0);

        if (newAttempts >= MAX_ATTEMPTS) {
          setIsLocked(true);
          setError(
            'Akun terkunci sementara. Di sistem nyata, ini akan memblokir login selama 15 menit.'
          );
        } else {
          // Anti-brute force delay
          setError(`Password salah. Percobaan ${newAttempts}/${MAX_ATTEMPTS}.`);
          await new Promise((r) => setTimeout(r, LOCKOUT_DELAY_MS));
        }
        setIsLoading(false);
      }
    } catch (err) {
      setVerifyStage(0);
      setError('Terjadi kesalahan saat verifikasi. Coba lagi.');
      setIsLoading(false);
    }
  };

  const handleResetLock = () => {
    setIsLocked(false);
    setAttempts(0);
    setError('');
    setPassword('');
  };

  return (
    <div className="w-full">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">

        {/* ── Form Card ─────────────────────────────────────────────────── */}
        <section className="rounded-lg border border-slate-700 bg-slate-800/70 p-6 shadow-xl shadow-slate-950/20">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">SecurePay</p>
            <h1 className="mt-2 text-2xl font-bold text-white">Masuk ke akun Anda</h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Verifikasi dilakukan di sisi klien menggunakan Web Crypto API — password tidak pernah dikirim ke server.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {/* Username */}
            <label className="block">
              <span className="text-sm font-medium text-slate-200">Username</span>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                autoComplete="username"
                disabled={isDisabled}
                className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Masukkan username"
              />
            </label>

            {/* Password */}
            <label className="block">
              <span className="text-sm font-medium text-slate-200">Password</span>
              <div className="relative mt-2">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  autoComplete="current-password"
                  disabled={isDisabled}
                  className="w-full rounded-lg border border-slate-600 bg-slate-950 px-4 py-3 pr-12 text-sm text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Masukkan password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  tabIndex={-1}
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-800 hover:text-white"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </label>

            {/* Attempt counter dots */}
            {attempts > 0 && !isLocked && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Percobaan:</span>
                <div className="flex gap-1.5">
                  {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-2.5 w-2.5 rounded-full transition-all ${
                        i < attempts ? 'bg-red-500 scale-110' : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-red-400 font-medium">
                  {MAX_ATTEMPTS - attempts} percobaan tersisa
                </span>
              </div>
            )}

            {/* Error / Lockout banner */}
            {error && (
              <div className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${
                isLocked
                  ? 'border-amber-500/30 bg-amber-950/40 text-amber-200'
                  : 'border-red-500/30 bg-red-950/40 text-red-200'
              }`}>
                <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {isLocked
                    ? <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></>
                    : <><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></>
                  }
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-blue-300">
                <SpinnerIcon />
                <span>Memverifikasi kredensial…</span>
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={isDisabled || !username.trim() || !password}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <SpinnerIcon />
                  Memverifikasi…
                </span>
              ) : isLocked ? (
                'Akun Terkunci'
              ) : (
                'Masuk'
              )}
            </button>

            {/* Reset lockout (demo only) */}
            {isLocked && (
              <button
                type="button"
                id="login-reset-lock"
                onClick={handleResetLock}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-700"
              >
                Reset (Demo) — Coba lagi
              </button>
            )}

            {/* Link to Register */}
            <p className="text-center text-sm text-slate-400">
              Belum punya akun?{' '}
              <Link
                to="/register"
                id="login-to-register"
                className="font-semibold text-blue-400 underline-offset-2 hover:underline"
              >
                Daftar
              </Link>
            </p>
          </form>
        </section>

        {/* ── Educational Panel ──────────────────────────────────────────── */}
        <aside className="rounded-lg border border-blue-500/20 bg-blue-950/30 p-6">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/15 text-blue-200">
            <ShieldIcon />
          </div>
          <h2 className="text-xl font-bold text-white">Bagaimana verifikasi bekerja?</h2>
          <p className="mt-1 text-sm text-slate-400">
            Setiap kali Anda login, browser melakukan langkah-langkah berikut secara lokal.
          </p>

          <div className="mt-5 space-y-1">
            <VerifyStep
              step="1"
              label="Ambil data user"
              detail="Cari user berdasarkan username → dapatkan passwordHash & salt tersimpan"
              active={verifyStage === 1}
              done={verifyStage > 1}
            />
            <Arrow active={verifyStage >= 2} />
            <VerifyStep
              step="2"
              label="Hash input password"
              detail="hash(inputPassword + salt) menggunakan SHA-256 via Web Crypto API"
              active={verifyStage === 2}
              done={verifyStage > 2}
            />
            <Arrow active={verifyStage >= 3} />
            <VerifyStep
              step="3"
              label="Bandingkan hash"
              detail="Hasil hash baru dibandingkan byte-per-byte dengan hash yang tersimpan"
              active={verifyStage === 3}
              done={verifyStage > 3}
            />
            <Arrow active={verifyStage >= 4} />

            {/* Result */}
            <div className={`flex items-center gap-3 rounded-lg border p-3 transition-all duration-500 ${
              verifyStage === 4
                ? 'border-emerald-500/40 bg-emerald-950/30'
                : verifyStage === 0 && attempts > 0
                ? 'border-red-500/40 bg-red-950/30'
                : 'border-slate-700 bg-slate-900/50'
            }`}>
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                verifyStage === 4
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : verifyStage === 0 && attempts > 0
                  ? 'bg-red-500/20 text-red-300'
                  : 'bg-slate-800 text-slate-500'
              }`}>
                {verifyStage === 4 ? (
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : verifyStage === 0 && attempts > 0 ? (
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                ) : (
                  '✓'
                )}
              </div>
              <div>
                <p className={`text-sm font-semibold ${
                  verifyStage === 4
                    ? 'text-emerald-300'
                    : verifyStage === 0 && attempts > 0
                    ? 'text-red-300'
                    : 'text-slate-500'
                }`}>
                  {verifyStage === 4
                    ? 'Hash cocok → Login berhasil!'
                    : verifyStage === 0 && attempts > 0
                    ? 'Hash tidak cocok → Login ditolak'
                    : 'Cocok / Tidak cocok'}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Jika sama persis → akses diberikan, jika tidak → ditolak
                </p>
              </div>
            </div>
          </div>

          {/* Security notes */}
          <div className="mt-6 space-y-3">
            <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-4">
              <p className="font-semibold text-slate-100">Anti-brute force</p>
              <p className="mt-1 text-sm leading-5 text-slate-400">
                Setelah {MAX_ATTEMPTS}x gagal, akun dikunci. Sistem nyata menambah delay eksponensial + blokir IP.
              </p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-4">
              <p className="font-semibold text-slate-100">Salt mencegah rainbow table</p>
              <p className="mt-1 text-sm leading-5 text-slate-400">
                Karena setiap akun punya salt berbeda, hash yang sama tidak bisa dicocokkan antar akun.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
