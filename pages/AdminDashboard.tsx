
import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { 
  Users, Car, TrendingUp, AlertCircle, ShieldCheck, 
  Settings, Search, X, Map, LayoutDashboard, 
  Database, PieChart, LogOut, ShieldAlert, CheckCircle, Check, Eye, FileText, Image as ImageIcon,
  MoreVertical, Mail, Phone, Wallet, Star, Zap, DollarSign, Save
} from 'lucide-react';
import { useApp } from '../App';
import { db } from '../database';
import { Driver, User, RideRequest } from '../types';

const AdminSettings: React.FC = () => {
  const [pricePerKm, setPricePerKm] = useState(350);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    db.settings.get().then(s => {
      setPricePerKm(s.pricePerKm);
      setIsLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await db.settings.update({ pricePerKm });
    setIsSaving(false);
    setMessage('Settings synchronized to edge nodes.');
    setTimeout(() => setMessage(''), 3000);
  };

  if (isLoading) return <div className="p-20 text-center animate-pulse">Synchronizing Neural Core...</div>;

  return (
    <main className="p-12 space-y-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Platform Intelligence</h2>
          <p className="text-slate-500 font-bold">Configure the platform's economic and neural parameters.</p>
        </div>
        {message && <div className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl font-black text-xs animate-bounce">{message}</div>}
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <form onSubmit={handleSave} className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-sm space-y-10">
           <div className="flex items-center space-x-4 mb-4">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-3xl"><TrendingUp className="w-6 h-6" /></div>
              <h3 className="text-2xl font-black text-slate-900">Economic Engine</h3>
           </div>
           
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Price Per Kilometer (NGN)</label>
                 <div className="relative">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300 text-lg">₦</div>
                    <input 
                      type="number"
                      value={pricePerKm}
                      onChange={e => setPricePerKm(Number(e.target.value))}
                      className="w-full pl-12 pr-6 py-5 bg-slate-50 border-none rounded-3xl font-black text-2xl text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/10 transition"
                    />
                 </div>
                 <p className="text-xs text-slate-400 font-bold ml-4">This value directly impacts the base fare calculation across all vehicle types.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Elite Multiplier</p>
                    <p className="text-xl font-black text-slate-900">2.2x</p>
                 </div>
                 <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Minimum Base</p>
                    <p className="text-xl font-black text-slate-900">₦500.00</p>
                 </div>
              </div>
           </div>

           <button 
            type="submit" 
            disabled={isSaving}
            className="w-full bg-slate-900 text-white font-black py-5 rounded-[30px] shadow-2xl hover:bg-blue-600 transition flex items-center justify-center space-x-3"
           >
             <Save className="w-5 h-5" />
             <span>{isSaving ? 'Syncing...' : 'Commit Settings'}</span>
           </button>
        </form>

        <div className="space-y-8">
           <div className="bg-blue-600 p-10 rounded-[50px] text-white space-y-6 relative overflow-hidden shadow-2xl shadow-blue-200">
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
              <h3 className="text-xl font-black">Platform Health</h3>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/10 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Latency</p>
                    <p className="text-2xl font-black">24ms</p>
                 </div>
                 <div className="bg-white/10 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Nodes</p>
                    <p className="text-2xl font-black">Active</p>
                 </div>
              </div>
              <p className="text-xs font-bold opacity-80 leading-relaxed">Economic changes propagate to rider apps within 500ms of commitment. Ensure rate parity with local competitors before saving.</p>
           </div>
        </div>
      </div>
    </main>
  );
};

const AdminRiders: React.FC = () => {
  const [riders, setRiders] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.users.getAll().then(all => {
      setRiders(all.filter(u => u.role === 'RIDER'));
      setLoading(false);
    });
  }, []);

  return (
    <main className="p-12 animate-in fade-in duration-500">
       <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm">
          <div className="p-10 flex justify-between items-center">
             <h3 className="text-3xl font-black text-slate-900 tracking-tight">Rider Registry</h3>
             <div className="bg-blue-50 text-blue-600 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest">{riders.length} Registered</div>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                   <th className="px-10 py-6">Rider Name</th>
                   <th className="px-10 py-6">Contact Info</th>
                   <th className="px-10 py-6">Wallet Balance</th>
                   <th className="px-10 py-6">Rating</th>
                </tr>
                {riders.map(rider => (
                  <tr key={rider.id} className="border-t border-slate-50 hover:bg-slate-50 transition">
                     <td className="px-10 py-6">
                        <div className="flex items-center space-x-4">
                           <img src={rider.avatar} className="w-12 h-12 rounded-xl" />
                           <p className="font-black text-slate-900">{rider.name}</p>
                        </div>
                     </td>
                     <td className="px-10 py-6">
                        <p className="text-xs font-bold text-slate-600">{rider.email}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{rider.phone}</p>
                     </td>
                     <td className="px-10 py-6 font-black text-slate-900">₦{rider.balance.toLocaleString()}</td>
                     <td className="px-10 py-6">
                        <div className="flex items-center space-x-1 text-indigo-600 font-black"><Star className="w-3 h-3 fill-indigo-600" /> <span>{rider.rating}</span></div>
                     </td>
                  </tr>
                ))}
             </table>
          </div>
       </div>
    </main>
  );
};

const AdminFleet: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.users.getAll().then(all => {
      setDrivers(all.filter(u => u.role === 'DRIVER') as Driver[]);
      setLoading(false);
    });
  }, []);

  return (
    <main className="p-12 animate-in fade-in duration-500">
       <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm">
          <div className="p-10 flex justify-between items-center">
             <h3 className="text-3xl font-black text-slate-900 tracking-tight">Active Fleet Control</h3>
             <div className="flex space-x-4">
                <div className="bg-emerald-50 text-emerald-600 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest">{drivers.filter(d => d.isOnline).length} Online</div>
                <div className="bg-blue-50 text-blue-600 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest">{drivers.length} Total</div>
             </div>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                   <th className="px-10 py-6">Driver Profile</th>
                   <th className="px-10 py-6">Vehicle Intelligence</th>
                   <th className="px-10 py-6">Status</th>
                   <th className="px-10 py-6">Commission Balance</th>
                </tr>
                {drivers.map(driver => (
                  <tr key={driver.id} className="border-t border-slate-50 hover:bg-slate-50 transition">
                     <td className="px-10 py-6">
                        <div className="flex items-center space-x-4">
                           <img src={driver.avatar} className="w-12 h-12 rounded-xl" />
                           <div><p className="font-black text-slate-900">{driver.name}</p><p className="text-[10px] text-slate-400 font-bold">{driver.email}</p></div>
                        </div>
                     </td>
                     <td className="px-10 py-6">
                        <p className="text-xs font-black text-slate-700">{driver.vehicleModel}</p>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{driver.plateNumber}</p>
                     </td>
                     <td className="px-10 py-6">
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${driver.isOnline ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                           {driver.isOnline ? 'Transmitting' : 'Dormant'}
                        </span>
                     </td>
                     <td className="px-10 py-6 font-black text-slate-900">₦{driver.balance.toLocaleString()}</td>
                  </tr>
                ))}
             </table>
          </div>
       </div>
    </main>
  );
};

const AdminOverview: React.FC<{ stats: any, pendingDrivers: Driver[], handleVerification: (id: string, app: boolean) => void, loading: boolean }> = ({ stats, pendingDrivers, handleVerification, loading }) => {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  return (
    <main className="p-12 space-y-12 animate-in fade-in duration-500 overflow-y-auto h-full pb-32">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Network Sessions', value: stats.activeRides.toLocaleString(), change: '+12%', icon: Car },
          { label: 'Gross Volume', value: '₦' + (stats.revenue/1000000).toFixed(1) + 'M', change: '+8%', icon: TrendingUp },
          { label: 'Node Expansion', value: stats.newUsers.toString(), change: '+24%', icon: Users },
          { label: 'Neural Alerts', value: stats.alerts.toString(), icon: AlertCircle },
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
                <h3 className="text-2xl font-black text-slate-900">Partner Compliance</h3>
                <p className="text-slate-500 font-bold text-sm">Review pending driver applications for biometric and document approval.</p>
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
               <p className="text-xl font-black text-slate-900">Queue Purged!</p>
               <p className="text-slate-500 font-bold">All driver applications have been successfully processed.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="px-10 py-6">Applicant Node</th>
                  <th className="px-10 py-6">Mobile Unit</th>
                  <th className="px-10 py-6">Telemetry</th>
                  <th className="px-10 py-6 text-right">Verification</th>
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
                    <td className="px-10 py-8">
                       <button 
                        onClick={() => setSelectedDriver(driver)}
                        className="flex items-center space-x-2 text-blue-600 font-black text-xs hover:underline uppercase tracking-widest"
                       >
                         <Eye className="w-4 h-4" />
                         <span>Analyze Data</span>
                       </button>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <div className="flex items-center justify-end space-x-3">
                         <button 
                            onClick={() => handleVerification(driver.id, true)}
                            className="px-6 py-3 bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition"
                         >
                            AUTHORIZE
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

      {/* Document Preview Modal */}
      {selectedDriver && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
           <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" onClick={() => setSelectedDriver(null)}></div>
           <div className="relative w-full max-w-4xl bg-white rounded-[60px] shadow-2xl border border-white p-12 max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300">
              <button 
                onClick={() => setSelectedDriver(null)}
                className="absolute top-10 right-10 p-3 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-2xl transition"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="flex items-center space-x-8 mb-16">
                 <img src={selectedDriver.avatar} className="w-24 h-24 rounded-[40px] border-4 border-slate-50 shadow-2xl" />
                 <div>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tight">{selectedDriver.name}</h3>
                    <p className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs">Compliance Core v4.2 • ID: {selectedDriver.id}</p>
                 </div>
              </div>

              <div className="grid md:grid-cols-2 gap-16">
                 <div className="space-y-8">
                    <div className="flex items-center space-x-4">
                       <div className="p-4 bg-indigo-50 text-indigo-600 rounded-3xl"><ShieldCheck className="w-8 h-8" /></div>
                       <h4 className="font-black text-2xl text-slate-900">Driver's License</h4>
                    </div>
                    <div className="aspect-[4/3] bg-slate-100 rounded-[50px] overflow-hidden border-8 border-white shadow-2xl group relative">
                       {selectedDriver.licenseDoc ? (
                         <img src={selectedDriver.licenseDoc} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="License" />
                       ) : (
                         <div className="flex flex-col items-center justify-center h-full text-slate-400">
                           <FileText className="w-16 h-16 mb-4 opacity-20" />
                           <p className="font-black uppercase tracking-widest text-xs">Missing Asset</p>
                         </div>
                       )}
                    </div>
                 </div>
                 
                 <div className="space-y-8">
                    <div className="flex items-center space-x-4">
                       <div className="p-4 bg-indigo-50 text-indigo-600 rounded-3xl"><Users className="w-8 h-8" /></div>
                       <h4 className="font-black text-2xl text-slate-900">Biometric ID (NIN)</h4>
                    </div>
                    <div className="aspect-[4/3] bg-slate-100 rounded-[50px] overflow-hidden border-8 border-white shadow-2xl group relative">
                       {selectedDriver.ninDoc ? (
                         <img src={selectedDriver.ninDoc} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="NIN" />
                       ) : (
                         <div className="flex flex-col items-center justify-center h-full text-slate-400">
                           <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
                           <p className="font-black uppercase tracking-widest text-xs">Missing Asset</p>
                         </div>
                       )}
                    </div>
                 </div>
              </div>

              <div className="mt-20 pt-12 border-t border-slate-100 flex justify-end space-x-6">
                 <button 
                  onClick={() => setSelectedDriver(null)}
                  className="px-12 py-6 bg-slate-100 text-slate-600 font-black rounded-3xl hover:bg-slate-200 transition uppercase tracking-widest text-xs"
                 >
                   Defer Decision
                 </button>
                 <button 
                  onClick={() => {
                    handleVerification(selectedDriver.id, true);
                    setSelectedDriver(null);
                  }}
                  className="px-12 py-6 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-700 transition shadow-[0_25px_50px_-12px_rgba(59,130,246,0.4)] uppercase tracking-widest text-xs"
                 >
                   Validate Node
                 </button>
              </div>
           </div>
        </div>
      )}
    </main>
  );
};

const AdminDashboard: React.FC = () => {
  const { logout } = useApp();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeRides: 0,
    revenue: 0,
    newUsers: 0,
    alerts: 3
  });

  useEffect(() => { 
    loadInitialData(); 
  }, []);

  const loadInitialData = async () => {
    const allUsers = await db.users.getAll();
    const allRides = await db.rides.getAll();
    const allDrivers = allUsers.filter(u => u.role === 'DRIVER') as Driver[];
    
    setDrivers(allDrivers);
    setStats({
       activeRides: allRides.filter(r => r.status !== 'COMPLETED').length,
       revenue: allRides.reduce((acc, r) => acc + r.fare, 0),
       newUsers: allUsers.length,
       alerts: allDrivers.filter(d => !d.isVerified).length
    });
    setLoading(false);
  };

  const handleVerification = async (id: string, approve: boolean) => {
    await db.users.update(id, { isVerified: approve });
    await loadInitialData();
  };

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Neural Matrix', end: true },
    { to: '/admin/riders', icon: Users, label: 'Rider Nodes' },
    { to: '/admin/drivers', icon: Car, label: 'Fleet Matrix' },
    { to: '/admin/settings', icon: Settings, label: 'Intel Core' },
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
          <button onClick={logout} className="mt-10 flex items-center space-x-4 w-full p-4 rounded-2xl hover:bg-red-500/10 text-red-400 transition font-bold text-sm"><LogOut className="w-5 h-5" /> <span>Terminate Matrix</span></button>
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        <header className="h-24 bg-white border-b border-slate-100 px-12 flex items-center justify-between sticky top-0 z-20 shrink-0">
           <h1 className="text-3xl font-black text-slate-900 tracking-tight">Enterprise Console v4.2</h1>
           <div className="flex items-center space-x-6">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition" />
                <input placeholder="Neural Search..." className="pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-600 w-80 transition" />
              </div>
           </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          <Routes>
            <Route path="/" element={<AdminOverview stats={stats} pendingDrivers={drivers.filter(d => !d.isVerified)} handleVerification={handleVerification} loading={loading} />} />
            <Route path="/riders" element={<AdminRiders />} />
            <Route path="/drivers" element={<AdminFleet />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
