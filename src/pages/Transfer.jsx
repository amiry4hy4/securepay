import { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import EncryptionVisualizer from '../components/EncryptionVisualizer';
import { AppContext } from '../context/AppContext';
import { decryptData, encryptData } from '../utils/crypto';

const PROCESS_DELAY_MS = 700;

const processSteps = [
  'Membangun payload transaksi',
  'Mengenkripsi payload',
  'Memverifikasi PIN',
  'Menyimpan transaksi'
];

const initialForm = {
  recipientUsername: '',
  amount: '',
  note: '',
  pin: ''
};

function wait(ms = PROCESS_DELAY_MS) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomHex(length) {
  const bytes = new Uint8Array(Math.ceil(length / 2));
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, length);
}

function parseAmount(value) {
  return Number(String(value).replace(/\D/g, '')) || 0;
}

function formatRupiah(value) {
  const amount = parseAmount(value);
  if (!amount) return '';
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

function formatDate(timestamp) {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(timestamp));
}

function StepStatusIcon({ status }) {
  if (status === 'done') {
    return (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    );
  }

  if (status === 'processing') {
    return (
      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    );
  }

  return <span className="h-2 w-2 rounded-full bg-current" />;
}

function ProcessStepCard({ index, title, status }) {
  return (
    <div
      className={`rounded-lg border p-4 transition-all duration-500 ${
        status === 'done'
          ? 'border-emerald-500/40 bg-emerald-950/25'
          : status === 'processing'
          ? 'border-blue-400/50 bg-blue-950/35 shadow-lg shadow-blue-950/20'
          : 'border-slate-700 bg-slate-900/60'
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
            status === 'done'
              ? 'bg-emerald-500/15 text-emerald-300'
              : status === 'processing'
              ? 'bg-blue-500/15 text-blue-200'
              : 'bg-slate-800 text-slate-500'
          }`}
        >
          <StepStatusIcon status={status} />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Step {index + 1}
          </p>
          <h3 className="text-sm font-bold text-slate-100">{title}</h3>
        </div>
      </div>
      <p
        className={`mt-3 text-xs font-semibold capitalize ${
          status === 'done'
            ? 'text-emerald-300'
            : status === 'processing'
            ? 'text-blue-200'
            : 'text-slate-500'
        }`}
      >
        {status}
      </p>
    </div>
  );
}

function DetailBlock({ label, value }) {
  if (!value) return null;

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-950/70 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-blue-300">{label}</p>
      <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap break-all font-mono text-xs leading-5 text-slate-200">
        {value}
      </pre>
    </div>
  );
}

export default function Transfer() {
  const {
    addTransaction,
    aesKey,
    balance,
    currentUser,
    updateBalance,
    users
  } = useContext(AppContext);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [activeStep, setActiveStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [encryptionVisualStep, setEncryptionVisualStep] = useState(0);
  const [payload, setPayload] = useState(null);
  const [encryptedResult, setEncryptedResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successSummary, setSuccessSummary] = useState(null);

  const amount = useMemo(() => parseAmount(form.amount), [form.amount]);
  const plaintext = payload ? JSON.stringify(payload, null, 2) : '';

  const updateField = (field, value) => {
    setForm(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: '' }));
  };

  const validateForm = () => {
    const nextErrors = {};
    const recipient = form.recipientUsername.trim();
    const recipientUser = users.find(
      user => user.username.toLowerCase() === recipient.toLowerCase()
    );

    if (!recipient) {
      nextErrors.recipientUsername = 'Username penerima wajib diisi.';
    } else if (!recipientUser) {
      nextErrors.recipientUsername = 'Username penerima tidak ditemukan.';
    } else if (recipientUser.username === currentUser.username) {
      nextErrors.recipientUsername = 'Tidak bisa transfer ke akun sendiri.';
    }

    if (amount <= 0) {
      nextErrors.amount = 'Nominal harus lebih dari Rp 0.';
    } else if (amount > balance) {
      nextErrors.amount = 'Saldo tidak cukup untuk transfer ini.';
    }

    if (form.note.length > 100) {
      nextErrors.note = 'Catatan maksimal 100 karakter.';
    }

    if (!/^\d{6}$/.test(form.pin)) {
      nextErrors.pin = 'PIN harus tepat 6 digit.';
    }

    if (!aesKey) {
      nextErrors.submit = 'AES key tidak tersedia. Silakan login ulang.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const appendRecipientTransaction = transaction => {
    const storageKey = `securepay_transactions_${transaction.to}`;
    const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const creditTransaction = {
      ...transaction,
      type: 'credit',
      id: `${transaction.id}-credit`
    };

    localStorage.setItem(storageKey, JSON.stringify([creditTransaction, ...existing]));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (isProcessing || !validateForm()) return;

    setIsProcessing(true);
    setErrors({});
    setActiveStep(-1);
    setCompletedSteps([]);
    setEncryptionVisualStep(0);
    setPayload(null);
    setEncryptedResult(null);
    setSuccessSummary(null);

    try {
      setActiveStep(0);
      const nextPayload = {
        from: currentUser.username,
        to: form.recipientUsername.trim(),
        amount,
        note: form.note.trim(),
        timestamp: Date.now(),
        txId: randomHex(8)
      };
      setPayload(nextPayload);
      setEncryptionVisualStep(0);
      await wait();
      setCompletedSteps(current => [...current, 0]);

      setActiveStep(1);
      setEncryptionVisualStep(1);
      await wait(350);
      setEncryptionVisualStep(2);
      const encryptedPayload = await encryptData(JSON.stringify(nextPayload), aesKey);
      setEncryptedResult(encryptedPayload);
      setEncryptionVisualStep(3);
      await wait();
      setCompletedSteps(current => [...new Set([...current, 1])]);

      setActiveStep(2);
      const storedPin = await decryptData(currentUser.encryptedPin, currentUser.pinIV, aesKey);
      await wait();
      if (storedPin !== form.pin) {
        throw new Error('PIN salah. Transfer dibatalkan.');
      }
      setCompletedSteps(current => [...new Set([...current, 2])]);

      setActiveStep(3);
      await wait();
      const transaction = {
        id: nextPayload.txId,
        encryptedPayload: encryptedPayload.cipher,
        iv: encryptedPayload.iv,
        timestamp: nextPayload.timestamp,
        type: 'debit',
        amount,
        from: nextPayload.from,
        to: nextPayload.to,
        note: nextPayload.note
      };

      addTransaction(transaction);
      appendRecipientTransaction(transaction);
      await updateBalance(balance - amount);
      setCompletedSteps(current => [...new Set([...current, 3])]);
      setActiveStep(4);
      setSuccessSummary({
        txId: nextPayload.txId,
        to: nextPayload.to,
        amount,
        timestamp: nextPayload.timestamp
      });
      setForm(initialForm);
    } catch (error) {
      setErrors({ submit: error.message });
      setActiveStep(-1);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStepStatus = index => {
    if (completedSteps.includes(index)) return 'done';
    if (activeStep === index) return 'processing';
    return 'pending';
  };

  return (
    <div className="w-full space-y-6">
      <section className="rounded-lg border border-slate-700 bg-slate-800/70 p-6 shadow-xl shadow-slate-950/20">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">
              SecurePay Transfer
            </p>
            <h1 className="mt-2 text-2xl font-bold text-white">
              Transfer e-wallet terenkripsi end-to-end
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Payload transaksi dibuat sebagai JSON, dienkripsi dengan AES-256-CBC, lalu disimpan sebagai ciphertext.
            </p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-950/70 px-4 py-3 text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Saldo aktif</p>
            <p className="mt-1 text-lg font-extrabold text-emerald-300">
              Rp {Number(balance || 0).toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(320px,0.85fr)_minmax(0,1.15fr)]">
        <section className="rounded-lg border border-slate-700 bg-slate-800/70 p-6 shadow-xl shadow-slate-950/20">
          <h2 className="text-lg font-bold text-white">Form transfer</h2>
          <form className="mt-5 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-medium text-slate-200">Username penerima</span>
              <input
                type="text"
                value={form.recipientUsername}
                onChange={event => updateField('recipientUsername', event.target.value)}
                disabled={isProcessing}
                className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="contoh: securefriend"
              />
              {errors.recipientUsername && (
                <span className="mt-2 block text-xs text-red-300">{errors.recipientUsername}</span>
              )}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-200">Nominal</span>
              <input
                type="text"
                value={form.amount}
                onChange={event => updateField('amount', formatRupiah(event.target.value))}
                inputMode="numeric"
                disabled={isProcessing}
                className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Rp 50.000"
              />
              {errors.amount && (
                <span className="mt-2 block text-xs text-red-300">{errors.amount}</span>
              )}
            </label>

            <label className="block">
              <span className="flex items-center justify-between text-sm font-medium text-slate-200">
                <span>Catatan opsional</span>
                <span className="text-xs text-slate-500">{form.note.length}/100</span>
              </span>
              <textarea
                value={form.note}
                onChange={event => updateField('note', event.target.value.slice(0, 100))}
                disabled={isProcessing}
                rows={3}
                className="mt-2 w-full resize-none rounded-lg border border-slate-600 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Catatan singkat untuk penerima"
              />
              {errors.note && (
                <span className="mt-2 block text-xs text-red-300">{errors.note}</span>
              )}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-200">PIN konfirmasi</span>
              <input
                type="password"
                value={form.pin}
                onChange={event => updateField('pin', event.target.value.replace(/\D/g, '').slice(0, 6))}
                inputMode="numeric"
                autoComplete="off"
                disabled={isProcessing}
                className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="6 digit"
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
              disabled={isProcessing}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
            >
              {isProcessing ? 'Memproses transfer...' : 'Kirim Transfer'}
            </button>
          </form>
        </section>

        <section className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {processSteps.map((title, index) => (
              <ProcessStepCard
                key={title}
                index={index}
                title={title}
                status={getStepStatus(index)}
              />
            ))}
          </div>

          <EncryptionVisualizer
            plaintext={plaintext}
            ciphertext={encryptedResult?.cipher || ''}
            iv={encryptedResult?.iv || ''}
            step={encryptionVisualStep}
          />

          <div className="grid gap-4">
            <DetailBlock label="Plaintext payload" value={plaintext} />
            <DetailBlock label="Ciphertext hex" value={encryptedResult?.cipher} />
            <DetailBlock label="Initialization vector" value={encryptedResult?.iv} />
          </div>
        </section>
      </div>

      {successSummary && (
        <section className="rounded-lg border border-emerald-500/40 bg-emerald-950/25 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-emerald-300">
                Transfer berhasil
              </p>
              <h2 className="mt-2 text-xl font-bold text-white">
                TxID {successSummary.txId}
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                Rp {successSummary.amount.toLocaleString('id-ID')} terkirim ke {successSummary.to} pada {formatDate(successSummary.timestamp)}.
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-500"
            >
              Kembali ke Dashboard
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
