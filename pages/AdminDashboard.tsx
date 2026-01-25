
import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { 
  Users, Car, TrendingUp, AlertCircle, Settings, Search, X, Map, LayoutDashboard, 
  LogOut, DollarSign, Activity, Bell, ChevronDown, ChevronRight, User as UserIcon, BarChart3, Menu
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell
} from 'recharts';
import { useApp } from '../App';
import { db } from '../database';
import { RideRequest } from '../types';

const EARNINGS_DATA = [
  { name: 'Apr 1', value: 180000 },
  { name: 'Apr 2', value: 250000 },
  { name: 'Apr 3', value: 210000 },
  { name: 'Apr 4', value: 280000 },
  { name: 'Apr 5', value: 350000 },
  { name: 'Apr 6', value: 320000 },
  { name: 'Apr 7', value: 425700 },
];

const RIDE_REQUESTS_DATA = [
  { name: 'Economy', value: 1205, color: '#3b82f6' },
  { name: 'Premium', value: 170, color: '#10b981' },
  { name: 'XL', value: 77, color: '#f59e0b' },
];

const StatCard: React.FC<{ label: string, value: string, trend: string, trendUp: boolean, icon: any }> = ({ label, value, trend, trendUp, icon: Icon }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-2xl text-slate-400"><Icon className="w-6 h-6" /></div>
      <div className={`flex items-center text-[10px] font-black px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
        <TrendingUp className={`w-3 h-3 mr-1 ${!trendUp && 'rotate-180'}`} />{trend}
      </div>
    </div>
    <p className="text-xs font-bold text-slate-400 mb-1">{label}</p>
    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
  </div>
);

const AdminMainDashboard: React.FC = () => {
  const [rides, setRides] = useState<RideRequest[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const r = await db.rides.getAll();
      setRides(r.slice(-5).reverse());
      setTotalRevenue(r.reduce((acc, curr) => acc + curr.fare, 0));
    };
    fetchData();
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#f8fafc] h-full overflow-y-auto custom-scrollbar">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Trips" value="12,584" trend="5.8%" trendUp={true} icon={Car} />
        <StatCard label="Revenue (₦)" value={`₦${(totalRevenue || 2589320).toLocaleString()}`} trend="7.4%" trendUp={true} icon={DollarSign} />
        <StatCard label="Active Drivers" value="932" trend="1.4%" trendUp={true} icon={Users} />
        <StatCard label="Cancellation Rate" value="8.2%" trend="11.2%" trendUp={false} icon={AlertCircle} />
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-900">Earnings (₦)</h3>
            <div className="flex items-center space-x-2 bg-slate-50 p-1 rounded-xl">
              {['D', 'W', 'M'].map(t => <button key={t} className={`px-4 py-1.5 rounded-lg text-[10px] font-black ${t === 'D' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>{t}</button>)}
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={EARNINGS_DATA}>
                <defs><linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} tickFormatter={(v) => `₦${v/1000}k`} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-xl font-black text-slate-900 mb-6">Ride Requests</h3>
          <div className="flex-1 flex flex-col justify-center items-center">
             <div className="relative w-48 h-48 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie data={RIDE_REQUESTS_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {RIDE_REQUESTS_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                  </RePieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-slate-900">1,452</div>
             </div>
             <div className="w-full space-y-4">
                {RIDE_REQUESTS_DATA.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                       <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center"><Car className="w-5 h-5" style={{color: item.color}} /></div>
                       <div><p className="text-xs font-black text-slate-900">{item.value}</p><p className="text-[10px] font-bold text-slate-400">{item.name}</p></div>
                    </div>
                    <div className="text-[10px] font-black text-emerald-500">▲ 3.2%</div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm">
         <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-900">Recent Neural Logs</h3>
            <button className="text-blue-600 font-black text-xs uppercase tracking-widest flex items-center">View All <ChevronRight className="w-4 h-4 ml-1" /></button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1000px]">
               <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]"><th className="px-8 py-6">ID</th><th className="px-8 py-6">Driver</th><th className="px-8 py-6">Rider</th><th className="px-8 py-6">Pickup</th><th className="px-8 py-6">Fare (₦)</th><th className="px-8 py-6 text-right">Status</th></tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {rides.map(ride => (
                    <tr key={ride.id} className="hover:bg-slate-50 transition">
                       <td className="px-8 py-6 text-xs font-bold text-slate-400">#{ride.id.slice(-4).toUpperCase()}</td>
                       <td className="px-8 py-6 font-black text-slate-900 text-xs">Driver-{ride.driverId?.slice(-4).toUpperCase() || 'SEARCHING'}</td>
                       <td className="px-8 py-6 font-black text-slate-900 text-xs">Rider-{ride.riderId.slice(-4).toUpperCase()}</td>
                       <td className="px-8 py-6 text-[10px] font-medium text-slate-500">{ride.pickup}</td>
                       <td className="px-8 py-6 font-black text-slate-900">₦{ride.fare.toLocaleString()}</td>
                       <td className="px-8 py-6 text-right"><span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${ride.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>{ride.status}</span></td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { logout, currentUser } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/map', icon: Map, label: 'Live Map' },
    { to: '/admin/users', icon: Users, label: 'Drivers' },
    { to: '/admin/riders', icon: UserIcon, label: 'Riders' },
    { to: '/admin/rides', icon: Car, label: 'Trips' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-white overflow-hidden relative">
      <div className={`fixed inset-y-0 left-0 w-64 bg-[#1e293b] text-slate-400 flex flex-col z-[110] transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20"><Car className="w-6 h-6 text-white" /></div>
            <span className="text-xl font-black text-white tracking-tighter uppercase">SPEEDRIDE</span>
          </div>
          <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}><X className="w-6 h-6" /></button>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `flex items-center space-x-3 w-full px-4 py-3.5 rounded-xl transition font-black text-[11px] uppercase tracking-widest ${isActive ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/10' : 'hover:bg-white/5 hover:text-white'}`}>
              <item.icon className="w-5 h-5" /><span>{item.label}</span>
            </NavLink>
          ))}
          <button onClick={logout} className="mt-8 flex items-center space-x-3 w-full px-4 py-3.5 rounded-xl hover:bg-red-500/10 text-red-400 transition font-black text-[11px] uppercase tracking-widest"><LogOut className="w-5 h-5" /><span>Log Out</span></button>
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <header className="h-20 bg-white border-b border-slate-100 px-4 md:px-8 flex items-center justify-between sticky top-0 z-20 shrink-0">
           <div className="flex items-center space-x-4 flex-1">
              <button className="lg:hidden p-2 text-slate-600" onClick={() => setIsSidebarOpen(true)}><Menu className="w-6 h-6" /></button>
              <div className="relative w-full max-w-md hidden md:block">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                 <input placeholder="Search telemetry..." className="w-full pl-12 pr-6 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none" />
              </div>
           </div>
           <div className="flex items-center space-x-4">
              <button className="p-2.5 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-xl transition"><Bell className="w-5 h-5" /></button>
              <div className="flex items-center space-x-3">
                 <div className="text-right hidden sm:block">
                    <p className="text-xs font-black text-slate-900 leading-none">{currentUser?.name}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Admin Node</p>
                 </div>
                 <img src={currentUser?.avatar} className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-50 shadow-sm" />
              </div>
           </div>
        </header>
        <div className="flex-1 overflow-hidden relative">
          <Routes>
            <Route path="/" element={<AdminMainDashboard />} />
            <Route path="*" element={<AdminMainDashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
