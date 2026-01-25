
import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { db } from './database';
import { User, Driver } from './types';
import Logo from './components/Logo';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import RiderDashboard from './pages/RiderDashboard';
import DriverDashboard from './pages/DriverDashboard';
import AdminDashboard from './pages/AdminDashboard';

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
    const savedUser = localStorage.getItem('speedride_session');
    if (savedUser && savedUser !== 'undefined') {
      try {
        const user = JSON.parse(savedUser);
        if (user && user.id && user.token) {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        localStorage.removeItem('speedride_session');
      }
    }
    const timer = setTimeout(() => setIsInitializing(false), 1500);
    return () => clearTimeout(timer);
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
    showToast(`Neural Link Established. Welcome, ${userWithToken.name}`, 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('speedride_session');
    showToast("Node Disconnected. Safe travels.", 'info');
  };

  const refreshUser = async () => {
    if (currentUser && currentUser.id) {
      try {
        const updated = await db.users.getById(currentUser.id);
        if (updated) {
          const freshUser = { ...updated, token: currentUser.token };
          setCurrentUser(freshUser);
          localStorage.setItem('speedride_session', JSON.stringify(freshUser));
        }
      } catch (e) {
        console.error("Failed to refresh user from core", e);
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
      <p className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Synchronizing with Core Database...</p>
    </div>
  );

  return (
    <AppContext.Provider value={{ currentUser, isAuthenticated, login, logout, refreshUser, showToast }}>
      <HashRouter>
        <div className="min-h-screen bg-gray-50 flex flex-col relative">
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
