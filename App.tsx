
import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { db } from './database';
import { User, Driver } from './types';
import Logo from './components/Logo';
import { CheckCircle, AlertCircle, X, Info, Settings, Database } from 'lucide-react';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import RiderDashboard from './pages/RiderDashboard';
import DriverDashboard from './pages/DriverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import FleetPage from './pages/FleetPage';
import SafetyPage from './pages/SafetyPage';
import DrivePage from './pages/DrivePage';
import HowItWorksPage from './pages/HowItWorksPage';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface AppContextType {
  currentUser: (User & { token?: string }) | (Driver & { token?: string }) | null;
  isAuthenticated: boolean;
  login: (user: any) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  showToast: (message: string, type?: ToastType) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize DB (handles PG or Fallback internally)
        await db.init();
        
        // Handle session
        const savedUser = localStorage.getItem('speedride_session');
        if (savedUser && savedUser !== 'undefined') {
          try {
            const user = JSON.parse(savedUser);
            if (user?.id && user?.token) {
              // Verify user still exists in DB
              const fresh = await db.users.getById(user.id);
              if (fresh) {
                setCurrentUser({ ...fresh, token: user.token });
                setIsAuthenticated(true);
              } else {
                localStorage.removeItem('speedride_session');
              }
            }
          } catch (err) {
            localStorage.removeItem('speedride_session');
          }
        }
      } catch (err: any) {
        console.error("Boot sequence soft error:", err);
      } finally {
        setTimeout(() => setIsInitializing(false), 800);
      }
    };

    initializeApp();
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const login = (userWithToken: any) => {
    setCurrentUser(userWithToken);
    setIsAuthenticated(true);
    localStorage.setItem('speedride_session', JSON.stringify(userWithToken));
    showToast(`Link Established. Welcome, ${userWithToken.name}`, 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('speedride_session');
    showToast("Node Disconnected. Safe travels.", 'info');
  };

  const refreshUser = async () => {
    if (currentUser?.id) {
      try {
        const updated = await db.users.getById(currentUser.id);
        if (updated) {
          const freshUser = { ...updated, token: currentUser.token };
          setCurrentUser(freshUser);
          localStorage.setItem('speedride_session', JSON.stringify(freshUser));
        }
      } catch (e) {
        console.error("Failed to refresh user", e);
      }
    }
  };

  if (isInitializing) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-white animate-in fade-in duration-700">
      <div className="relative mb-8">
        <Logo className="h-48 w-auto logo-ignition" />
        <div className="absolute -inset-4 bg-orange-500/10 rounded-full blur-2xl animate-pulse -z-10"></div>
      </div>
      <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
        <div className="absolute inset-0 bg-blue-600 animate-loading-bar"></div>
      </div>
      <p className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">loading .....</p>
    </div>
  );

  return (
    <AppContext.Provider value={{ currentUser, isAuthenticated, login, logout, refreshUser, showToast }}>
      <HashRouter>
        <div className="min-h-screen bg-gray-50 flex flex-col relative">
          {/* Fallback Engine Notice (Only in Dev/Mock mode) */}
          {db.isLocal() && (
            <div className="fixed bottom-4 left-4 z-[9999] group">
              <div className="bg-amber-500 text-white p-3 rounded-2xl shadow-xl flex items-center space-x-2 cursor-help border-2 border-amber-400">
                <Database className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase tracking-widest">Mock Engine Active</span>
              </div>
              <div className="absolute bottom-full left-0 mb-2 w-64 bg-slate-900 text-white p-4 rounded-2xl text-[10px] font-medium opacity-0 group-hover:opacity-100 transition shadow-2xl pointer-events-none border border-white/10">
                <p className="mb-2 text-amber-400 font-black uppercase tracking-widest flex items-center gap-2">
                  <Database className="w-3 h-3" /> Sandbox Environment
                </p>
                SpeedRide is running on a persistent local database because no <code className="text-blue-400">DATABASE_URL</code> was detected. Data will persist in this browser.
              </div>
            </div>
          )}

          {/* Toast Container */}
          <div className="fixed top-24 right-6 z-[9999] flex flex-col items-end space-y-3 pointer-events-none">
            {toasts.map(toast => (
              <div 
                key={toast.id} 
                className={`pointer-events-auto flex items-center space-x-3 px-6 py-4 rounded-[24px] shadow-2xl animate-in slide-in-from-right-10 duration-300 border backdrop-blur-md ${
                  toast.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-900' :
                  toast.type === 'error' ? 'bg-red-50 border-red-100 text-red-900' :
                  'bg-white border-slate-100 text-slate-900'
                }`}
              >
                {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
                <span className="font-black text-xs uppercase tracking-widest">{toast.message}</span>
                <button 
                  onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                  className="p-1 hover:bg-black/5 rounded-lg transition"
                >
                  <X className="w-4 h-4 opacity-40" />
                </button>
              </div>
            ))}
          </div>

          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/fleet" element={<FleetPage />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route path="/drive" element={<DrivePage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/rider/*" element={isAuthenticated && currentUser?.role === 'RIDER' ? <RiderDashboard /> : <Navigate to="/auth" />} />
            <Route path="/driver/*" element={isAuthenticated && currentUser?.role === 'DRIVER' ? <DriverDashboard /> : <Navigate to="/auth" />} />
            <Route path="/admin/*" element={isAuthenticated && currentUser?.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/auth" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;
