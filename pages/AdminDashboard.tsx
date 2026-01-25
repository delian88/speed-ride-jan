
import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { 
  Users, Car, TrendingUp, AlertCircle, ShieldCheck, 
  Settings, Search, X, Map, LayoutDashboard, 
  Database, PieChart, LogOut, ShieldAlert, CheckCircle, Check, Eye, FileText, Image as ImageIcon,
  MoreVertical, Mail, Phone, Wallet, Star, Zap, DollarSign, Save,
  Filter, Trash2, Edit3, ShieldX, UserMinus, Plus, RefreshCw, Activity,
  Ban, ToggleLeft, ToggleRight, MessageSquare, Globe, Gift, HelpCircle,
  MapPin, Clock, ArrowRight, ChevronRight, AlertTriangle,
  User as UserIcon, BarChart3, Bell, ChevronDown, Download, Layers,
  CreditCard, Briefcase, Info, MoreHorizontal
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Legend
} from 'recharts';
import { useApp } from '../App';
import { db } from '../database';
import { Driver, User, RideRequest, UserRole, RideStatus } from '../types';

// --- Mock Data for Dashboard Charts ---

const EARNINGS_DATA = [
  { name: 'Apr 1', value: 18000 },
  { name: 'Nan 2', value: 25000 },
  { name: 'Tue 3', value: 21000 },
  { name: 'Wed 4', value: 28000 },
  { name: 'Thu 5', value: 35000 },
  { name: 'Fri 6', value: 32000 },
  { name: 'Sat 7', value: 42570 },
];

const RIDE_STATS_DATA = [
  { name: 'Apr 1', total: 28000, completed: 22000, incomplete: 6000 },
  { name: 'Man', total: 22000, completed: 18000, incomplete: 4000 },
  { name: 'Tue', total: 25000, completed: 20000, incomplete: 5000 },
  { name: 'Wed', total: 31000, completed: 25000, incomplete: 6000 },
  { name: 'Thu 4', total: 38000, completed: 32000, incomplete: 6000 },
  { name: 'Fri', total: 24000, completed: 19000, incomplete: 5000 },
  { name: 'Sat 5', total: 22000, completed: 18000, incomplete: 4000 },
  { name: 'Sat 6', total: 34000, completed: 28000, incomplete: 6000 },
];

const RIDE_REQUESTS_DATA = [
  { name: 'Standard', value: 1205, color: '#3b82f6' },
  { name: 'Premium', value: 170, color: '#10b981' },
  { name: 'Elite', value: 77, color: '#f59e0b' },
];

const DRIVER_STATS_DATA = [
  { name: 'Online', value: 756, color: '#10b981' },
  { name: 'Offline', value: 93, color: '#94a3b8' },
];

// --- Dashboard Sub-Components ---

const StatCard: React.FC<{ label: string, value: string, sub: string, trend: string, trendUp: boolean, icon: any }> = ({ label, value, sub, trend, trendUp, icon: Icon }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
        <Icon className="w-6 h-6" />
      </div>
      {trend && (
        <div className={`flex items-center text-[10px] font-black px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          <TrendingUp className={`w-3 h-3 mr-1 ${!trendUp && 'rotate-180'}`} />
          {trend}
        </div>
      )}
    </div>
    <p className="text-xs font-bold text-slate-400 mb-1">{label}</p>
    <div className="flex items-baseline space-x-2">
      <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
    </div>
    <p className="text-[10px] font-medium text-slate-400 mt-2">{sub}</p>
  </div>
);

const AdminMainDashboard: React.FC = () => {
  const [rides, setRides] = useState<RideRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.rides.getAll().then(r => {
      setRides(r.slice(-5).reverse());
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto custom-scrollbar bg-[#f8fafc]">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Rides" value="12,584" sub="This Week, previous week" trend="5.8%" trendUp={true} icon={Car} />
        <StatCard label="Revenue" value="$258,932" sub="This Week, previous week" trend="7.4%" trendUp={true} icon={DollarSign} />
        <StatCard label="Active Drivers" value="932" sub="This Week vs previous" trend="1.4%" trendUp={true} icon={Users} />
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
           <div className="flex justify-between mb-4">
              <div className="p-3 bg-slate-50 rounded-2xl text-slate-400"><AlertCircle className="w-6 h-6" /></div>
              <div className="text-right">
                 <p className="text-xs font-bold text-slate-400 mb-1">Cancellation Rate</p>
                 <div className="flex items-center text-[10px] font-black text-red-600 bg-red-50 px-2 py-1 rounded-full"><TrendingUp className="w-3 h-3 mr-1 rotate-180" /> 11.2%</div>
              </div>
           </div>
           <div className="flex items-center space-x-6">
              <div><h3 className="text-3xl font-black text-slate-900 tracking-tight">8.2%</h3><p className="text-[10px] font-medium text-slate-400">This week vs last</p></div>
              <div className="flex-1 h-12 flex items-center justify-center">
                 <div className="relative w-16 h-16">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
                      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="175" strokeDashoffset="40" className="text-orange-500" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black">%</div>
                 </div>
                 <div className="ml-2">
                    <p className="text-[10px] font-black text-slate-900">42,570</p>
                    <p className="text-[8px] font-bold text-slate-400">11.22%</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Analytics Main Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Earnings Chart */}
        <div className="col-span-12 lg:col-span-8 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-900">Earnings</h3>
            <div className="flex items-center space-x-2 bg-slate-50 p-1 rounded-xl">
              {['D', 'M', 'Y'].map(t => (
                <button key={t} className={`px-4 py-1.5 rounded-lg text-[10px] font-black ${t === 'D' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={EARNINGS_DATA}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontSize: '10px'}}
                  cursor={{stroke: '#3b82f6', strokeWidth: 2}}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ride Requests Distribution */}
        <div className="col-span-12 lg:col-span-4 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col">
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
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <p className="text-2xl font-black text-slate-900">1,452</p>
                </div>
             </div>
             <div className="w-full space-y-4">
                {RIDE_REQUESTS_DATA.map((item, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center space-x-3">
                       <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition">
                          <Car className={`w-5 h-5`} style={{color: item.color}} />
                       </div>
                       <div>
                          <p className="text-xs font-black text-slate-900">{item.value.toLocaleString()}</p>
                          <p className="text-[10px] font-bold text-slate-400">{item.name}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="text-[10px] font-black text-emerald-500">▲ 3.2%</div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Ride Statistics Bar Chart */}
        <div className="col-span-12 lg:col-span-8 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-900">Ride Statistics</h3>
            <div className="flex items-center space-x-2 bg-slate-50 p-1 rounded-xl">
              {['Day', 'Week', 'Month'].map(t => (
                <button key={t} className={`px-4 py-1.5 rounded-lg text-[10px] font-black ${t === 'Week' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={RIDE_STATS_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '16px', border: 'none', fontSize: '10px'}} />
                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="completed" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="incomplete" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center mt-6 space-x-8">
             <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-blue-600"></div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Rides</span></div>
             <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-slate-300"></div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completed</span></div>
             <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-orange-400"></div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Incomplete</span></div>
          </div>
        </div>

        {/* Driver Stats & Map Preview */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
           <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-6">Driver Stats</h3>
              <div className="flex items-center space-x-8">
                 <div className="relative w-32 h-32">
                    <ResponsiveContainer width="100%" height="100%">
                       <RePieChart>
                          <Pie data={DRIVER_STATS_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={55} paddingAngle={0} dataKey="value">
                             {DRIVER_STATS_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                          </Pie>
                       </RePieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <p className="text-xl font-black text-slate-900">900</p>
                    </div>
                 </div>
                 <div className="space-y-4 flex-1">
                    {DRIVER_STATS_DATA.map((item, i) => (
                       <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2"><div className={`w-2 h-2 rounded-full`} style={{backgroundColor: item.color}}></div><span className="text-[10px] font-black text-slate-400">{item.name}</span></div>
                          <div className="text-right">
                             <p className="text-xs font-black text-slate-900">{item.value}</p>
                             <p className={`text-[8px] font-black ${item.name === 'Online' ? 'text-emerald-500' : 'text-red-400'}`}>▲ 6%</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="bg-white p-4 rounded-[32px] border border-slate-100 shadow-sm relative h-64 overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80" className="w-full h-full object-cover rounded-[24px] opacity-80" />
              <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition"></div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                 <button className="px-8 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-2xl hover:bg-blue-600 transition">View Live Map</button>
              </div>
              {/* Virtual car icons on map */}
              <div className="absolute top-10 left-20 w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
              <div className="absolute bottom-20 right-20 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg"></div>
              <div className="absolute top-32 right-12 w-4 h-4 bg-orange-400 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
           </div>
        </div>
      </div>

      {/* Recent Trips Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm">
         <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-900">Recent Trips</h3>
            <button className="text-blue-600 font-black text-xs uppercase tracking-widest flex items-center hover:underline">View All <ChevronRight className="w-4 h-4 ml-1" /></button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                     <th className="px-8 py-6">LD</th>
                     <th className="px-8 py-6">Driver ID</th>
                     <th className="px-8 py-6">Driver Name</th>
                     <th className="px-8 py-6">Rider</th>
                     <th className="px-8 py-6">Pickup</th>
                     <th className="px-8 py-6">Drop-off</th>
                     <th className="px-8 py-6">Fare</th>
                     <th className="px-8 py-6 text-right">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr><td colSpan={8} className="p-20 text-center animate-pulse text-slate-400 font-black">Syncing Telemetry...</td></tr>
                  ) : rides.length === 0 ? (
                    <tr><td colSpan={8} className="p-20 text-center text-slate-400 font-black">No neural ride logs recorded.</td></tr>
                  ) : rides.map(ride => (
                    <tr key={ride.id} className="hover:bg-slate-50 transition group">
                       <td className="px-8 py-6 text-xs font-bold text-slate-400">#{ride.id.slice(-4).toUpperCase()}</td>
                       <td className="px-8 py-6">
                          <div className="flex items-center space-x-2">
                             <img src={`https://i.pravatar.cc/150?u=${ride.driverId}`} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                             <span className="text-[10px] font-black text-slate-900">D-{ride.driverId?.slice(-4).toUpperCase()}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-xs font-black text-slate-900">Ben Jacobs</td>
                       <td className="px-8 py-6">
                          <div className="flex items-center space-x-2">
                             <img src={`https://i.pravatar.cc/150?u=${ride.riderId}`} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                             <span className="text-xs font-bold text-slate-900">Eve Cross</span>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-[10px] font-medium text-slate-500 max-w-[150px] truncate">{ride.pickup}</td>
                       <td className="px-8 py-6 text-[10px] font-medium text-slate-500 max-w-[150px] truncate">{ride.dropoff}</td>
                       <td className="px-8 py-6 font-black text-slate-900">${ride.fare.toFixed(2)}</td>
                       <td className="px-8 py-6 text-right">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                             ride.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' :
                             ride.status === 'CANCELLED' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                          }`}>{ride.status}</span>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

// --- Main Dashboard Shell ---

const AdminDashboard: React.FC = () => {
  const { logout, currentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/map', icon: Map, label: 'Live Map' },
    { to: '/admin/users', icon: Users, label: 'Drivers' },
    { to: '/admin/riders', icon: UserIcon, label: 'Riders' },
    { to: '/admin/rides', icon: Car, label: 'Trips' },
    { to: '/admin/payments', icon: DollarSign, label: 'Payments' },
    { to: '/admin/promos', icon: Gift, label: 'Promotions' },
    { to: '/admin/reports', icon: BarChart3, label: 'Reports' },
    { to: '/admin/support', icon: HelpCircle, label: 'Support Hub' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex min-h-screen bg-white overflow-hidden">
      {/* Sidebar - Dark theme like screenshot */}
      <div className="w-64 bg-[#1e293b] text-slate-400 flex flex-col shrink-0">
        <div className="p-8 flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
             <Car className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black text-white tracking-tighter uppercase">SPEEDRIDE</span>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `flex items-center space-x-3 w-full px-4 py-3.5 rounded-xl transition font-black text-[11px] uppercase tracking-widest ${isActive ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/10' : 'hover:bg-white/5 hover:text-white'}`}>
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
              {item.label === 'Drivers' && <ChevronDown className="ml-auto w-4 h-4 opacity-30" />}
            </NavLink>
          ))}
          <button onClick={logout} className="mt-8 flex items-center space-x-3 w-full px-4 py-3.5 rounded-xl hover:bg-red-500/10 text-red-400 transition font-black text-[11px] uppercase tracking-widest">
            <LogOut className="w-5 h-5" /> 
            <span>Log Out</span>
          </button>
        </nav>
        
        <div className="p-8 border-t border-white/5">
           <div className="p-4 bg-white/5 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">System Online</span>
              </div>
              <Activity className="w-4 h-4 text-emerald-500" />
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Implementation */}
        <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-20 shrink-0">
           <div className="flex items-center space-x-8 flex-1">
              <div className="relative w-full max-w-xl">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                 <input 
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                   placeholder="Search for rides, drivers, or riders..." 
                   className="w-full pl-12 pr-6 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition"
                 />
              </div>
           </div>
           
           <div className="flex items-center space-x-4 ml-8">
              <button className="relative p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition">
                 <Bell className="w-5 h-5" />
                 <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
              </button>
              <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition"><Mail className="w-5 h-5" /></button>
              <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition"><Settings className="w-5 h-5" /></button>
              
              <div className="h-8 w-px bg-slate-100 mx-2"></div>
              
              <button className="flex items-center space-x-3 p-1.5 pl-4 hover:bg-slate-50 rounded-2xl transition border border-transparent hover:border-slate-100">
                 <div className="text-right">
                    <p className="text-xs font-black text-slate-900 leading-none mb-1">{currentUser?.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Super Admin</p>
                 </div>
                 <img src={currentUser?.avatar} className="w-10 h-10 rounded-xl object-cover shadow-sm ring-2 ring-slate-50" />
                 <ChevronDown className="w-4 h-4 text-slate-300" />
              </button>
           </div>
        </header>

        {/* Primary Viewport */}
        <div className="flex-1 overflow-hidden relative">
          <Routes>
            <Route path="/" element={<AdminMainDashboard />} />
            {/* Keeping other routes as placeholders for now */}
            <Route path="*" element={<AdminMainDashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
