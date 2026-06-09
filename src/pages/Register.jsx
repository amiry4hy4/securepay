import { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import {
  encryptData,
  generateAESKey,
  generateSalt,
  hashPassword
} from '../utils/crypto';

const passwordLevels = [
  { label: 'Sangat Lemah', color: 'bg-red-500', text: 'text-red-300', width: 'w-1/5' },
  { label: 'Lemah', color: 'bg-orange-500', text: 'text-orange-300', width: 'w-2/5' },
  { label: 'Sedang', color: 'bg-yellow-400', text: 'text-yellow-200', width: 'w-3/5' },
  { label: 'Kuat', color: 'bg-lime-500', text: 'text-lime-300', width: 'w-4/5' },
  { label: 'Sangat Kuat', color: 'bg-emerald-500', text: 'text-emerald-300', width: 'w-full' }
];

function getPasswordStrength(password) {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  return passwordLevels[Math.max(0, Math.min(score - 1, passwordLevels.length - 1))];
}

const initialForm = {
  username: '',
  password: '',
  confirmPassword: '',
  pin: ''
};

export default function Register() {
  const navigate = useNavigate();
  const { registerUser, users } = useContext(AppContext);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [technicalSummary, setTechnicalSummary] = useState(null);

  const passwordStrength = useMemo(
    () => getPasswordStrength(form.password),
    [form.password]
  );

  const updateField = (field, value) => {
    setForm(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: '' }));
  };

  const validateForm = () => {
    const nextErrors = {};
    const usernameTaken = users.some(
      user => user.username.toLowerCase() === form.username.trim().toLowerCase()
    );

    if (form.username.trim().length < 4) {
      nextErrors.username = 'Username minimal 4 karakter.';
    } else if (usernameTaken) {
      nextErrors.username = 'Username sudah terdaftar.';
    }

    if (
      form.password.length < 8 ||
      !/[A-Z]/.test(form.password) ||
      !/\d/.test(form.password) ||
      !/[^A-Za-z0-9]/.test(form.password)
    ) {
      nextErrors.password = 'Password minimal 8 karakter, berisi huruf besar, angka, dan simbol.';
    }

    if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = 'Konfirmasi password harus sama.';
    }

    if (!/^\d{6}$/.test(form.pin)) {
      nextErrors.pin = 'PIN harus tepat 6 digit angka.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async event => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const salt = generateSalt();
      const passwordHash = await hashPassword(form.password, salt);
      const aesKey = await generateAESKey();
      const encryptedPin = await encryptData(form.pin, aesKey);
      const userRecord = {
        username: form.username.trim(),
        passwordHash,
        salt,
        encryptedPin: encryptedPin.cipher,
        pinIV: encryptedPin.iv
      };

      sessionStorage.setItem('securepay_aesKey', aesKey);
      await registerUser(userRecord, aesKey);
      setTechnicalSummary(userRecord);
      setForm(initialForm);
    } catch (error) {
      setErrors({
        submit: `Registrasi gagal: ${error.message}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSuccessModal = () => {
    setTechnicalSummary(null);
    navigate('/login');
  };

  return (
    <div className="w-full">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        <section className="rounded-lg border border-slate-700 bg-slate-800/70 p-6 shadow-xl shadow-slate-950/20">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">
              SecurePay
            </p>
            <h1 className="mt-2 text-2xl font-bold text-white">
              Buat akun e-wallet
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Data kredensial diproses di browser dengan Web Crypto API sebelum disimpan.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-medium text-slate-200">Username</span>
              <input
                type="text"
                value={form.username}
                onChange={event => updateField('username', event.target.value)}
                autoComplete="username"
                className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
                placeholder="contoh: secureuser"
              />
              {errors.username && (
                <span className="mt-2 block text-xs text-red-300">{errors.username}</span>
              )}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-200">Password</span>
              <div className="relative mt-2">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={event => updateField('password', event.target.value)}
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-slate-600 bg-slate-950 px-4 py-3 pr-12 text-sm text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
                  placeholder="Minimal 8 karakter"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(current => !current)}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-800 hover:text-white"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 3l18 18" />
                      <path d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58" />
                      <path d="M9.88 4.24A10.73 10.73 0 0112 4c5 0 9 5 9 8a8.22 8.22 0 01-2.14 3.95" />
                      <path d="M6.61 6.61C4.42 8.11 3 10.42 3 12c0 3 4 8 9 8a10.4 10.4 0 004.39-1" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="mt-3">
                <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                  <div className={`h-full rounded-full ${passwordStrength.color} ${passwordStrength.width} transition-all`} />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Kekuatan password</span>
                  <span className={`font-semibold ${passwordStrength.text}`}>
                    {passwordStrength.label}
                  </span>
                </div>
              </div>
              {errors.password && (
                <span className="mt-2 block text-xs text-red-300">{errors.password}</span>
              )}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-200">Konfirmasi password</span>
              <div className="relative mt-2">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={event => updateField('confirmPassword', event.target.value)}
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-slate-600 bg-slate-950 px-4 py-3 pr-12 text-sm text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
                  placeholder="Ulangi password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(current => !current)}
                  aria-label={showConfirmPassword ? 'Sembunyikan konfirmasi password' : 'Tampilkan konfirmasi password'}
                  title={showConfirmPassword ? 'Sembunyikan konfirmasi password' : 'Tampilkan konfirmasi password'}
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-800 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 3l18 18" />
                      <path d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58" />
                      <path d="M9.88 4.24A10.73 10.73 0 0112 4c5 0 9 5 9 8a8.22 8.22 0 01-2.14 3.95" />
                      <path d="M6.61 6.61C4.42 8.11 3 10.42 3 12c0 3 4 8 9 8a10.4 10.4 0 004.39-1" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="mt-2 block text-xs text-red-300">{errors.confirmPassword}</span>
              )}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-200">PIN 6 digit</span>
              <input
                type="password"
                value={form.pin}
                onChange={event => updateField('pin', event.target.value.replace(/\D/g, '').slice(0, 6))}
                inputMode="numeric"
                autoComplete="off"
                className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
                placeholder="••••••"
              />
              {errors.pin && (
                <span className="mt-2 block text-xs text-red-300">{errors.pin}</span>
              )}
            </label>

            {errors.submit && (
              <div className="rounded-lg border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-200">
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
            >
              {isSubmitting ? 'Memproses...' : 'Daftar'}
            </button>
          </form>
        </section>

        <aside className="rounded-lg border border-blue-500/20 bg-blue-950/30 p-6">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/15 text-blue-200">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="11" width="16" height="9" rx="2" />
              <path d="M8 11V7a4 4 0 018 0v4" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Proses keamanan</h2>
          <div className="mt-5 space-y-4">
            <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-4">
              <p className="font-semibold text-slate-100">Password kamu TIDAK disimpan langsung</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Password diproses menjadi nilai hash satu arah sebelum data user dicatat.
              </p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-4">
              <p className="font-semibold text-slate-100">Yang disimpan: hash(password + salt)</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Kombinasi password dan salt menghasilkan hash unik untuk proses login.
              </p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-4">
              <p className="font-semibold text-slate-100">Salt: nilai acak unik untuk setiap user</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Salt mencegah password yang sama menghasilkan hash yang sama antar akun.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {technicalSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-lg border border-emerald-500/30 bg-slate-900 p-6 shadow-2xl shadow-slate-950">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Registrasi berhasil!</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Berikut ringkasan teknis data yang disimpan untuk akun ini.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <SummaryRow label="Salt" value={technicalSummary.salt} />
              <SummaryRow label="Password hash" value={technicalSummary.passwordHash} />
              <SummaryRow label="PIN tersimpan sebagai" value={technicalSummary.encryptedPin} />
            </div>

            <button
              type="button"
              onClick={closeSuccessModal}
              className="mt-6 w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-500"
            >
              Lanjut ke Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-950 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 break-all font-mono text-xs leading-5 text-slate-200">{value}</p>
    </div>
  );
}
