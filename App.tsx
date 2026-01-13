
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { db } from './database';
import { User, Driver, UserRole } from './types';

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
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
    setIsInitializing(false);
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
    <div className="h-screen w-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
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
