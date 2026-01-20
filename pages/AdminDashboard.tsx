
import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { 
  Users, Car, TrendingUp, AlertCircle, ShieldCheck, 
  Settings, Search, X, Map, LayoutDashboard, 
  Database, PieChart, LogOut, ShieldAlert, CheckCircle, Check
} from 'lucide-react';
import { useApp } from '../App';
import { db } from '../database';
import { Driver } from '../types';

const AdminOverview: React.FC<{ stats: any, pendingDrivers: Driver[], handleVerification: (id: string, app: boolean) => void, loading: boolean }> = ({ stats, pendingDrivers, handleVerification, loading }) => (
  <main className="p-12 space-y-12 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        { label: 'Active Sessions', value: stats.activeRides.toLocaleString(), change: '+12%', icon: Car },
        { label: 'Gross Revenue', value: '₦' + (stats.revenue/1000000).toFixed(1) + 'M', change: '+8%', icon: TrendingUp },
        { label: 'New Partners', value: stats.newUsers.toString(), change: '+24%', icon: Users },
        { label: 'System Alerts', value: stats.alerts.toString(), icon: AlertCircle },
      ].map((stat, i) => (
        <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50 hover:shadow-2xl transition duration-500">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 rounded-2xl bg-blue-50 text-blue-600">
              <stat.icon className="w-7 h-7" />
            </div>
            {stat.change && <span className="text-xs font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">{stat.change}</span>}
          </div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
          <p className="text-4xl font-black text-slate-900 tracking-tight">{stat.value}</p>
        </div>
      ))}
    </div>

    <div className="bg-white rounded-[40px] shadow-sm border border-slate-50 overflow-hidden">
      <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center space-x-4">
           <ShieldAlert className="w-8 h-8 text-blue-600" />
           <div>
              <h3 className="text-2xl font-black text-slate-900">Partner Verification</h3>
              <p className="text-slate-500 font-bold text-sm">Review pending driver applications for compliance.</p>
           </div>
        </div>
        <span className="bg-blue-600 text-white text-xs font-black px-4 py-2 rounded-xl shadow-lg shadow-blue-500/20">{pendingDrivers.length} PENDING</span>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-20 text-center"><div className="animate-spin h-10 w-10 border-t-2 border-blue-600 rounded-full mx-auto"></div></div>
        ) : pendingDrivers.length === 0 ? (
          <div className="p-20 text-center space-y-4">
             <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
             <p className="text-xl font-black text-slate-900">Queue Clear!</p>
             <p className="text-slate-500 font-bold">All driver applications have been processed.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-10 py-6">Applicant Profile</th>
                <th className="px-10 py-6">Hardware Details</th>
                <th className="px-10 py-6 text-right">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pendingDrivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-slate-50 transition group">
                  <td className="px-10 py-8">
                    <div className="flex items-center space-x-4">
                       <img src={driver.avatar} className="w-14 h-14 rounded-2xl border-4 border-white shadow-md" />
                       <div>
                          <p className="font-black text-slate-900 leading-none mb-1">{driver.name}</p>
                          <p className="text-xs text-slate-400 font-bold">{driver.email}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                     <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 w-fit">
                       <p className="text-xs font-black text-slate-900">{driver.vehicleModel}</p>
                       <p className="text-[10px] font-black text-blue-600 tracking-widest uppercase">{driver.plateNumber}</p>
                     </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                     <div className="flex items-center justify-end space-x-3">
                       <button 
                          onClick={() => handleVerification(driver.id, true)}
                          className="px-6 py-3 bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition"
                       >
                          APPROVE
                       </button>
                       <button className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition"><X className="w-6 h-6" /></button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  </main>
);

const AdminDashboard: React.FC = () => {
  const { logout } = useApp();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats] = useState({
    activeRides: 1248,
    revenue: 12450000,
    newUsers: 452,
    alerts: 3
  });

  useEffect(() => { loadDrivers(); }, []);

  const loadDrivers = async () => {
    const allUsers = await db.users.getAll();
    const allDrivers = allUsers.filter(u => u.role === 'DRIVER') as Driver[];
    setDrivers(allDrivers);
    setLoading(false);
  };

  const handleVerification = async (id: string, approve: boolean) => {
    await db.users.update(id, { isVerified: approve });
    await loadDrivers();
  };

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Summary', end: true },
    { to: '/admin/riders', icon: Users, label: 'Riders' },
    { to: '/admin/drivers', icon: Car, label: 'Fleet' },
    { to: '/admin/map', icon: Map, label: 'Traffic' },
    { to: '/admin/financials', icon: Database, label: 'Finance' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden">
      <div className="w-72 bg-slate-900 text-slate-400 p-8 flex flex-col shrink-0">
        <div className="flex items-center space-x-3 text-white mb-12">
          <ShieldCheck className="w-10 h-10 text-blue-500" />
          <span className="text-2xl font-black tracking-tighter uppercase">SPEEDADMIN</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink 
              key={item.to} 
              to={item.to} 
              end={item.end} 
              className={({ isActive }) => `flex items-center space-x-4 w-full p-4 rounded-2xl transition font-bold text-sm ${isActive ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'hover:bg-white/5 hover:text-white'}`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
          <button onClick={logout} className="mt-10 flex items-center space-x-4 w-full p-4 rounded-2xl hover:bg-red-500/10 text-red-400 transition font-bold text-sm"><LogOut className="w-5 h-5" /> <span>Terminate Session</span></button>
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        <header className="h-24 bg-white border-b border-slate-100 px-12 flex items-center justify-between sticky top-0 z-20 shrink-0">
           <h1 className="text-3xl font-black text-slate-900 tracking-tight">Enterprise Console</h1>
           <div className="flex items-center space-x-6">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition" />
                <input placeholder="Global Search..." className="pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-600 w-80 transition" />
              </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto relative">
          <Routes>
            <Route path="/" element={<AdminOverview stats={stats} pendingDrivers={drivers.filter(d => !d.isVerified)} handleVerification={handleVerification} loading={loading} />} />
            <Route path="/riders" element={<div className="p-12"><h2 className="text-4xl font-black">Rider Management</h2></div>} />
            <Route path="/drivers" element={<div className="p-12"><h2 className="text-4xl font-black">Fleet Fleet Control</h2></div>} />
            <Route path="/map" element={<div className="p-12"><h2 className="text-4xl font-black">Global Traffic Map</h2></div>} />
            <Route path="/financials" element={<div className="p-12"><h2 className="text-4xl font-black">Revenue Analytics</h2></div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
