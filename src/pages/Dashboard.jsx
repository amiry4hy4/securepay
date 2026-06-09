import { useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import WalletCard from '../components/WalletCard';
import TransactionList from '../components/TransactionList';

/**
 * Dashboard page displays the e-wallet overview including
 * WalletCard, navigation links, and the transaction list.
 */
export default function Dashboard() {
  const { currentUser, logout, transactions } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navigation Bar */}
      <nav className="bg-blue-800 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg shadow-inner">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight">SecurePay</span>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link to="/" className="bg-blue-900 text-white px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-200">
                Dashboard
              </Link>
              <Link to="/transfer" className="text-blue-100 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200">
                Transfer
              </Link>
              <Link to="/security" className="text-blue-100 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200">
                Alur Keamanan
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-200 hover:bg-red-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
              >
                Logout
              </button>
            </div>

            {/* Mobile / Quick Logout Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={handleLogout}
                className="text-red-200 hover:bg-red-700 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-500/30 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden bg-blue-900 px-4 py-2.5 flex justify-around border-t border-blue-700 shadow-inner">
          <Link to="/" className="text-white text-xs font-bold py-1">Dashboard</Link>
          <Link to="/transfer" className="text-blue-200 hover:text-white text-xs font-medium py-1">Transfer</Link>
          <Link to="/security" className="text-blue-200 hover:text-white text-xs font-medium py-1">Alur Keamanan</Link>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-8">
        {/* Welcome Card */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 bg-blue-600 h-full"></div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Selamat datang kembali, {currentUser.username}!
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Kelola saldo terenkripsi Anda secara aman di dalam platform SecurePay.
            </p>
          </div>
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg text-xs font-semibold border border-emerald-100 self-start sm:self-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Koneksi Terenkripsi (Web Crypto API)
          </div>
        </div>

        {/* Wallet Display */}
        <section className="flex justify-center w-full">
          <WalletCard />
        </section>

        {/* Transaction History Section */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-xl p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
            Riwayat Transaksi Terbaru
          </h3>
          <TransactionList transactions={transactions} />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 py-6 text-center text-slate-500 text-xs">
        <p>© 2026 SecurePay E-Wallet UAS Project. Built with Web Crypto API.</p>
      </footer>
    </div>
  );
}
