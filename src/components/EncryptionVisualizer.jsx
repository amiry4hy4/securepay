const columns = [
  {
    title: 'Plaintext',
    key: 'plaintext',
    empty: 'Payload JSON belum dibuat'
  },
  {
    title: '+ IV acak',
    key: 'iv',
    empty: 'Menunggu IV'
  },
  {
    title: 'AES-256-CBC',
    key: 'algorithm',
    empty: 'Menunggu proses'
  },
  {
    title: 'Ciphertext',
    key: 'ciphertext',
    empty: 'Menunggu ciphertext'
  }
];

function CheckIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="h-5 w-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  );
}

function getContent(key, plaintext, ciphertext, iv) {
  if (key === 'plaintext') return plaintext;
  if (key === 'iv') return iv;
  if (key === 'ciphertext') return ciphertext;
  return ciphertext ? 'Encrypt(payload, key, IV)' : 'AES-CBC engine';
}

export default function EncryptionVisualizer({
  plaintext = '',
  ciphertext = '',
  iv = '',
  step = 0
}) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-5">
      <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-stretch">
        {columns.map((column, index) => {
          const active = step === index;
          const done = step > index;
          const content = getContent(column.key, plaintext, ciphertext, iv);

          return (
            <div key={column.key} className="contents">
              <div
                className={`min-h-36 rounded-lg border p-4 transition-all duration-500 ${
                  active
                    ? 'border-blue-400 bg-blue-950/40 shadow-lg shadow-blue-950/30'
                    : done
                    ? 'border-emerald-500/40 bg-emerald-950/25'
                    : 'border-slate-700 bg-slate-950/70'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-slate-100">{column.title}</h3>
                  <span
                    className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-bold transition-colors ${
                      done
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : active
                        ? 'bg-blue-500/15 text-blue-200'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {done ? <CheckIcon /> : index + 1}
                  </span>
                </div>

                <p className="mt-4 max-h-20 overflow-hidden break-all font-mono text-xs leading-5 text-slate-300">
                  {content || column.empty}
                </p>
              </div>

              {index < columns.length - 1 && (
                <div className="flex items-center justify-center md:px-1">
                  <ArrowIcon />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid gap-3 text-sm text-slate-400 md:grid-cols-2">
        <div className="rounded-lg border border-slate-700 bg-slate-950/60 p-3">
          IV memastikan plaintext yang sama menghasilkan ciphertext berbeda setiap kali
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-950/60 p-3">
          Tanpa kunci AES yang tepat, ciphertext tidak bisa dibaca
        </div>
      </div>
    </div>
  );
}
