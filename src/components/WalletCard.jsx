import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

/**
 * WalletCard component displays the current user's balance,
 * encryption status badge, and action buttons.
 */
export default function WalletCard() {
  const { currentUser, balance, getDecryptedBalance } = useContext(AppContext);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const navigate = useNavigate();

  const handleRefresh = async () => {
    setIsDecrypting(true);
    // Simulate slight processing latency for visual feedback of the decryption
    await new Promise((resolve) => setTimeout(resolve, 800));
    await getDecryptedBalance();
    setIsDecrypting(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleRefresh();
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formattedBalance = isNaN(balance) ? 0 : balance;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100 max-w-md w-full mx-auto relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 bg-blue-500 rounded-full opacity-10 blur-xl"></div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Saldo</p>
          <div className="flex items-center gap-3 mt-1">
            {isDecrypting ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-slate-500 text-sm animate-pulse">Mendekripsi...</span>
              </div>
            ) : (
              <h2 className="text-3xl font-extrabold text-slate-800">
                Rp {formattedBalance.toLocaleString('id-ID')}
              </h2>
            )}
          </div>
        </div>
        <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-blue-100 flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
          Active
        </div>
      </div>

      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
          AES-256 Encrypted
        </span>
        <p className="text-slate-500 text-xs mt-2">
          Pemilik Wallet: <span className="font-semibold text-slate-700">{currentUser?.username || 'Guest'}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <button
          onClick={() => navigate('/transfer')}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-md shadow-blue-200 active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
          Kirim Transfer
        </button>
        <button
          onClick={handleRefresh}
          disabled={isDecrypting}
          className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50"
        >
          <svg className={`w-4 h-4 ${isDecrypting ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17.21"></path>
          </svg>
          Refresh
        </button>
      </div>
    </div>
  );
}
