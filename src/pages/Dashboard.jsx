import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import WalletCard from '../components/WalletCard';
import TransactionList from '../components/TransactionList';

/**
 * Dashboard page displays the e-wallet overview including
 * WalletCard and the transaction list.
 */
export default function Dashboard() {
  const { currentUser, transactions } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="w-full space-y-6">
      {/* Welcome Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-800/70 p-6 rounded-lg border border-slate-700 shadow-xl shadow-slate-950/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 bg-blue-600 h-full"></div>
        <div>
          <h1 className="text-2xl font-bold text-white">
            Selamat datang kembali, {currentUser.username}!
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Kelola saldo terenkripsi Anda secara aman di dalam platform SecurePay.
          </p>
        </div>
        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg text-xs font-semibold border border-emerald-500/20 self-start sm:self-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Koneksi Terenkripsi (Web Crypto API)
        </div>
      </div>

      {/* Wallet Display */}
      <section className="flex justify-center w-full">
        <WalletCard />
      </section>

      {/* Transaction History Section */}
      <section className="bg-slate-800/70 rounded-lg border border-slate-700 shadow-xl shadow-slate-950/20 p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-700/60 pb-3">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
          </svg>
          Riwayat Transaksi Terbaru
        </h3>
        <TransactionList transactions={transactions} />
      </section>
    </div>
  );
}
