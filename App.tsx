
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { db } from './database';
import { User, Driver, UserRole } from './types';
import Logo from './components/Logo';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import RiderDashboard from './pages/RiderDashboard';
import DriverDashboard from './pages/DriverDashboard';
import AdminDashboard from './pages/AdminDashboard';

interface AppContextType {
  currentUser: User | Driver | null;
  isAuthenticated: boolean;
  login: (user: User | Driver) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | Driver | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('speedride_session');
    if (savedUser && savedUser !== 'undefined') {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Failed to parse session:", err);
        localStorage.removeItem('speedride_session');
      }
    }
    // Simulate a bit of loading for branding impact
    const timer = setTimeout(() => setIsInitializing(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const login = (user: User | Driver) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('speedride_session', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('speedride_session');
  };

  const refreshUser = async () => {
    if (currentUser) {
      const updated = await db.users.getById(currentUser.id);
      if (updated) {
        setCurrentUser(updated);
        localStorage.setItem('speedride_session', JSON.stringify(updated));
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
      <p className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Igniting Core Fusion...</p>
    </div>
  );

  return (
    <AppContext.Provider value={{ currentUser, isAuthenticated, login, logout, refreshUser }}>
      <HashRouter>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            
            <Route path="/rider/*" element={
              isAuthenticated && currentUser?.role === 'RIDER' ? 
              <RiderDashboard /> : <Navigate to="/auth" />
            } />
            
            <Route path="/driver/*" element={
              isAuthenticated && currentUser?.role === 'DRIVER' ? 
              <DriverDashboard /> : <Navigate to="/auth" />
            } />

            <Route path="/admin/*" element={
              isAuthenticated && currentUser?.role === 'ADMIN' ? 
              <AdminDashboard /> : <Navigate to="/auth" />
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;
