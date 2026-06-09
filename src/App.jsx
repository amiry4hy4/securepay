import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from './context/AppContext';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import Transfer from './pages/Transfer';
import SecurityFlow from './pages/SecurityFlow';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { currentUser } = useContext(AppContext);
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Navigation Layout Wrapper
function Layout({ children }) {
  const { currentUser, logout } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Navigation Bar */}
      <nav className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold tracking-tight text-blue-400 hover:text-blue-300 transition-colors">
            <span className="bg-blue-600 text-white px-2.5 py-1 rounded-md text-sm font-extrabold mr-1 shadow-md shadow-blue-500/20">SP</span>
            <span>SecurePay</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/security" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
              Alur Keamanan
            </Link>
            
            {currentUser ? (
              <>
                <Link to="/" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/transfer" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                  Transfer
                </Link>
                <div className="h-4 w-px bg-slate-700"></div>
                <div className="flex items-center space-x-3">
                  <span className="text-slate-400 text-xs font-mono bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                    user: <span className="text-blue-400 font-bold">{currentUser.username || currentUser}</span>
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="text-xs bg-red-950/65 hover:bg-red-900/80 text-red-300 hover:text-red-200 border border-red-900/50 px-3.5 py-1.5 rounded-lg font-medium transition-all"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-6 flex flex-col justify-start">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 SecurePay Project - UAS Keamanan E-Wallet</p>
          <div className="flex space-x-4">
            <span className="text-slate-600">AES-256-CBC</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-600">SHA-256 + Salt</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-600">Web Crypto API</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/security" element={<SecurityFlow />} />

          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/transfer" 
            element={
              <ProtectedRoute>
                <Transfer />
              </ProtectedRoute>
            } 
          />

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
