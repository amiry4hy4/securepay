import { useState } from 'react';

/**
 * Formats a timestamp to "DD MMM YYYY, HH:mm" in Indonesian locale style.
 * @param {number|string} timestamp - The timestamp to format.
 * @returns {string} The formatted date-time string.
 */
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

/**
 * TransactionList component displays a list of transactions with
 * expandable panels containing the encrypted payload and IV.
 * @param {Object} props - Component properties.
 * @param {Array} props.transactions - Array of transaction objects.
 */
export default function TransactionList({ transactions = [] }) {
  const [expandedTx, setExpandedTx] = useState({});

  const toggleExpand = (id) => {
    setExpandedTx((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
        <svg className="w-12 h-12 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 12H4M12 4v16"></path>
        </svg>
        <p className="text-slate-600 font-medium">Belum ada transaksi.</p>
        <p className="text-slate-400 text-xs mt-1">Coba kirim transfer pertama kamu!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((tx) => {
        const isDebit = tx.type === 'debit';
        const isExpanded = !!expandedTx[tx.id];

        return (
          <div
            key={tx.id || tx.timestamp}
            className="border border-slate-100 rounded-xl bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
          >
            {/* Main info row */}
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Direction indicator */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-lg ${
                    isDebit ? 'text-red-600 bg-red-50' : 'text-emerald-600 bg-emerald-50'
                  }`}
                >
                  {isDebit ? '→' : '←'}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm sm:text-base">
                    {isDebit ? `Transfer ke ${tx.to}` : `Transfer dari ${tx.from}`}
                  </h4>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {formatTimestamp(tx.timestamp)}
                  </p>
                </div>
              </div>

              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                <span
                  className={`font-extrabold text-sm sm:text-base ${
                    isDebit ? 'text-red-600' : 'text-emerald-600'
                  }`}
                >
                  {isDebit ? '-' : '+'} Rp {tx.amount.toLocaleString('id-ID')}
                </span>

                {/* Encrypted badge */}
                <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                  Encrypted
                </div>
              </div>
            </div>

            {/* Toggle bar */}
            <div className="bg-slate-50 px-4 py-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider">
                ID Transaksi: {tx.id || 'N/A'}
              </span>
              <button
                onClick={() => toggleExpand(tx.id)}
                className="text-blue-600 hover:text-blue-700 text-xs font-semibold flex items-center gap-1 transition-colors active:scale-95"
              >
                {isExpanded ? 'Sembunyikan' : 'Lihat payload terenkripsi'}
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>

            {/* Expandable encrypted payload panel */}
            {isExpanded && (
              <div className="bg-slate-900 p-4 border-t border-slate-800 text-slate-300 text-xs font-mono space-y-3">
                <div>
                  <p className="text-blue-400 font-bold uppercase tracking-wider text-[10px] mb-1">
                    Encrypted Payload (Ciphertext Hex):
                  </p>
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800 break-all select-all text-slate-200">
                    {tx.encryptedPayload || 'N/A'}
                  </div>
                </div>

                <div>
                  <p className="text-blue-400 font-bold uppercase tracking-wider text-[10px] mb-1">
                    Initialization Vector (IV Hex):
                  </p>
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800 break-all select-all text-slate-200">
                    {tx.iv || 'N/A'}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
