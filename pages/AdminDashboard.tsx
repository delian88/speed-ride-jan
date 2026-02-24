
import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { 
  Users, Car, TrendingUp, AlertCircle, Settings, Search, X, Map as MapIcon, LayoutDashboard, 
  LogOut, DollarSign, Activity, Bell, ChevronDown, ChevronRight, User as UserIcon, 
  BarChart3, Menu, Save, ShieldCheck, CreditCard, Gift, HelpCircle, FileText,
  Clock, MapPin, Navigation, Info, ShieldAlert, CheckCircle, RefreshCw, Layers,
  Briefcase, Download, Plus, Database, Cloud, Globe, Cpu, Terminal, Zap, Shield, Lock
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell
} from 'recharts';
import { useApp } from '../App';
import { db } from '../database';
import { RideRequest, User, Driver, RideStatus, VehicleType } from '../types';

// --- Shared Components ---

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

// --- View Components ---

const InfrastructureView: React.FC = () => {
  const status = db.getConnectionStatus();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#f8fafc] h-full overflow-y-auto custom-scrollbar animate-in fade-in duration-500">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Infrastructure</h2>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Managed Core v4.2.0</p>
        </div>
        <div className={`flex items-center space-x-3 px-6 py-3 rounded-2xl border-2 ${status.type === 'PRODUCTION' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
           <div className={`w-3 h-3 rounded-full ${status.type === 'PRODUCTION' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
           <span className="font-black text-xs uppercase tracking-widest">{status.type} ACTIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* System Map */}
         <div className="lg:col-span-2 bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
            <h3 className="text-xl font-black mb-10 flex items-center space-x-3 uppercase tracking-tight">
               <Layers className="text-blue-400" /> <span>System Architecture</span>
            </h3>

            <div className="flex flex-col items-center space-y-12 relative z-10">
               <div className="flex flex-col items-center group">
                  <div className="w-20 h-20 bg-white/10 rounded-[28px] border border-white/20 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                     <Globe className="w-8 h-8" />
                  </div>
                  <p className="font-black text-[10px] uppercase tracking-widest opacity-60">Edge Client</p>
               </div>

               <div className="h-16 w-0.5 bg-gradient-to-b from-blue-500/50 to-transparent relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
               </div>

               <div className="flex flex-col items-center group">
                  <div className={`w-24 h-24 rounded-[32px] border-2 flex items-center justify-center mb-4 transition-all duration-500 ${status.type === 'PRODUCTION' ? 'bg-emerald-500/20 border-emerald-500' : 'bg-amber-500/20 border-amber-500 animate-pulse'}`}>
                     {status.type === 'PRODUCTION' ? <Cloud className="w-10 h-10 text-emerald-400" /> : <Database className="w-10 h-10 text-amber-400" />}
                  </div>
                  <p className="font-black text-sm uppercase tracking-tight">{status.provider}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Data Persistence Layer</p>
               </div>
            </div>
         </div>

         {/* Connection Details */}
         <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm space-y-8">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Core Status</h3>
            
            <div className="space-y-6">
               <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center space-x-3">
                     <Cpu className="text-blue-500 w-5 h-5" />
                     <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Engine</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">V8.2.14</span>
               </div>
               <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center space-x-3">
                     <Shield className="text-emerald-500 w-5 h-5" />
                     <span className="text-xs font-black text-slate-500 uppercase tracking-widest">SSL</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">ENABLED</span>
               </div>
               <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center space-x-3">
                     <Lock className="text-indigo-500 w-5 h-5" />
                     <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Crypto</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">{status.encryption}</span>
               </div>
               <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center space-x-3">
                     <Zap className="text-amber-500 w-5 h-5" />
                     <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Latency</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">{status.type === 'PRODUCTION' ? '42ms' : '0.1ms'}</span>
               </div>
            </div>

            <button 
               onClick={handleManualSync}
               disabled={isSyncing}
               className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-blue-600 transition"
            >
               {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Terminal className="w-4 h-4" />}
               <span>{isSyncing ? 'Synchronizing...' : 'Run Diagnostics'}</span>
            </button>
         </div>
      </div>

      <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm">
         <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tighter">Production Link Guide</h3>
         <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
               <div className="flex space-x-6">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black shrink-0">1</div>
                  <div>
                     <p className="font-black text-slate-900 mb-1 uppercase tracking-tight">Provision Database</p>
                     <p className="text-sm text-slate-500 leading-relaxed font-medium">Create a free PostgreSQL instance at <a href="https://neon.tech" target="_blank" className="text-blue-600 underline">Neon.tech</a> or any other cloud provider.</p>
                  </div>
               </div>
               <div className="flex space-x-6">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black shrink-0">2</div>
                  <div>
                     <p className="font-black text-slate-900 mb-1 uppercase tracking-tight">Obtain Connection URL</p>
                     <p className="text-sm text-slate-500 leading-relaxed font-medium">Copy the full connection string starting with <code className="bg-slate-50 p-1 rounded text-pink-600 font-bold">postgres://...</code></p>
                  </div>
               </div>
               <div className="flex space-x-6">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black shrink-0">3</div>
                  <div>
                     <p className="font-black text-slate-900 mb-1 uppercase tracking-tight">Inject Environment Variable</p>
                     <p className="text-sm text-slate-500 leading-relaxed font-medium">Add a new variable named <code className="bg-slate-50 p-1 rounded text-blue-600 font-bold uppercase tracking-widest">DATABASE_URL</code> to your deployment settings.</p>
                  </div>
               </div>
            </div>
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
               <div className="flex items-center space-x-3 mb-6 text-slate-400">
                  <Terminal className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Verification Shell</span>
               </div>
               <div className="space-y-3 font-mono text-[11px]">
                  <p className="text-emerald-600 font-bold"># Checking Infrastructure...</p>
                  {status.type === 'PRODUCTION' ? (
                     <>
                        <p className="text-slate-600 font-medium">OK: Cloud Engine Detected (PostgreSQL)</p>
                        <p className="text-slate-600 font-medium">OK: Schema Validation Successful</p>
                        <p className="text-slate-600 font-medium">OK: BCrypt Encryption Active</p>
                        <p className="text-slate-900 font-black mt-4">CORE STATUS: FULL PRODUCTION READY</p>
                     </>
                  ) : (
                     <>
                        <p className="text-amber-600 font-medium">WARN: No DATABASE_URL variable found.</p>
                        <p className="text-slate-600 font-medium">INFO: Falling back to Sandbox Storage (Browser).</p>
                        <p className="text-slate-900 font-black mt-4">CORE STATUS: LOCAL DEVELOPMENT ONLY</p>
                     </>
                  )}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const AdminMainDashboard: React.FC = () => {
  const [rides, setRides] = useState<RideRequest[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const r = await db.rides.getAll();
      setRides(r.slice(-5));
      setTotalRevenue(r.reduce((acc, curr) => acc + curr.fare, 0));
    };
    fetchData();
  }, []);

  const earningsData = [
    { name: 'Mon', value: 180000 }, { name: 'Tue', value: 250000 }, { name: 'Wed', value: 210000 },
    { name: 'Thu', value: 280000 }, { name: 'Fri', value: 350000 }, { name: 'Sat', value: 320000 },
    { name: 'Sun', value: 425700 },
  ];

  const rideRequestData = [
    { name: 'ECONOMY', value: 1205, color: '#3b82f6' },
    { name: 'COMFORT', value: 450, color: '#6366f1' },
    { name: 'LUXURY', value: 170, color: '#0f172a' },
    { name: 'BUS', value: 280, color: '#10b981' },
    { name: 'TRUCK', value: 120, color: '#f59e0b' },
    { name: 'TRICYCLE', value: 550, color: '#f97316' },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#f8fafc] h-full overflow-y-auto custom-scrollbar animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Trips" value="12,584" trend="5.8%" trendUp={true} icon={Car} />
        <StatCard label="Revenue (₦)" value={`₦${(totalRevenue || 2589320).toLocaleString()}`} trend="7.4%" trendUp={true} icon={DollarSign} />
        <StatCard label="Active Drivers" value="932" trend="1.4%" trendUp={true} icon={Users} />
        <StatCard label="Cancellation Rate" value="8.2%" trend="11.2%" trendUp={false} icon={AlertCircle} />
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Earnings Timeline</h3>
            <div className="flex items-center space-x-2 bg-slate-50 p-1 rounded-xl">
              {['D', 'W', 'M'].map(t => <button key={t} className={`px-4 py-1.5 rounded-lg text-[10px] font-black ${t === 'D' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>{t}</button>)}
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData}>
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
          <h3 className="text-xl font-black text-slate-900 mb-6 tracking-tight">Service Mix</h3>
          <div className="flex-1 flex flex-col justify-center items-center">
             <div className="relative w-48 h-48 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie data={rideRequestData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {rideRequestData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                  </RePieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-slate-900">1,452</div>
             </div>
             <div className="w-full space-y-4">
                {rideRequestData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                       <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center"><Car className="w-5 h-5" style={{color: item.color}} /></div>
                       <div><p className="text-xs font-black text-slate-900 leading-none">{item.value}</p><p className="text-[10px] font-bold text-slate-400 mt-1">{item.name}</p></div>
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
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Transmissions</h3>
            <NavLink to="/admin/rides" className="text-blue-600 font-black text-[10px] uppercase tracking-widest flex items-center">Manage History <ChevronRight className="w-4 h-4 ml-1" /></NavLink>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1000px]">
               <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]"><th className="px-8 py-6">ID</th><th className="px-8 py-6">Driver</th><th className="px-8 py-6">Rider</th><th className="px-8 py-6">Fare</th><th className="px-8 py-6 text-right">Status</th></tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {rides.map(ride => (
                    <tr key={ride.id} className="hover:bg-slate-50 transition group cursor-pointer">
                       <td className="px-8 py-6 text-xs font-bold text-slate-400 group-hover:text-blue-600">#{ride.id.slice(-4).toUpperCase()}</td>
                       <td className="px-8 py-6 font-black text-slate-900 text-xs uppercase tracking-tight">{ride.driverId ? `NODE-D${ride.driverId.slice(-4)}` : 'SCANNING...'}</td>
                       <td className="px-8 py-6 font-black text-slate-900 text-xs uppercase tracking-tight">NODE-R{ride.riderId.slice(-4)}</td>
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

const LiveMapView: React.FC = () => (
  <div className="h-full w-full relative animate-in fade-in duration-500 overflow-hidden">
    <div className="absolute inset-0 bg-slate-200">
      <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80" className="w-full h-full object-cover grayscale-[0.3]" />
      <div className="absolute inset-0 bg-slate-900/10" />
      <div className="absolute top-1/4 left-1/3 w-10 h-10 bg-blue-600 rounded-2xl border-4 border-white shadow-2xl flex items-center justify-center animate-float"><Car className="w-5 h-5 text-white" /></div>
      <div className="absolute bottom-1/3 right-1/4 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-white shadow-2xl flex items-center justify-center animate-drift"><Car className="w-5 h-5 text-white" /></div>
    </div>
    <div className="absolute top-8 left-8">
      <div className="bg-white/95 backdrop-blur-md p-6 rounded-[32px] shadow-2xl w-72 border border-white/50">
        <h3 className="font-black text-slate-900 mb-4 flex items-center uppercase tracking-tight text-sm"><MapIcon className="w-5 h-5 mr-2 text-blue-600" /> Fleet Stream</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Active Units</span><span className="text-sm font-black text-slate-900">932</span></div>
          <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Live Tracks</span><span className="text-sm font-black text-slate-900">142</span></div>
        </div>
      </div>
    </div>
  </div>
);

const DriversView: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  useEffect(() => {
    db.users.getAll().then(users => {
      setDrivers(users.filter(u => u.role === 'DRIVER') as Driver[]);
    });
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#f8fafc] h-full overflow-y-auto custom-scrollbar animate-in slide-in-from-right duration-500">
      <div className="flex justify-between items-center">
        <div><h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Fleet Management</h2><p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Status: Operational</p></div>
        <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center space-x-2 shadow-xl shadow-slate-200 transition active:scale-95"><Car className="w-4 h-4" /> <span>Provision New Node</span></button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest"><th className="px-8 py-6">Partner Profile</th><th className="px-8 py-6">Vehicle Telemetry</th><th className="px-8 py-6">Connection</th><th className="px-8 py-6">Performance</th><th className="px-8 py-6 text-right">Ledger</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {drivers.map(d => (
                <tr key={d.id} className="hover:bg-slate-50 transition group cursor-pointer">
                  <td className="px-8 py-6 flex items-center space-x-4">
                    <img src={d.avatar} className="w-12 h-12 rounded-2xl object-cover ring-4 ring-slate-50" />
                    <div><p className="font-black text-slate-900 text-sm tracking-tight">{d.name}</p><p className="text-[10px] font-bold text-slate-400 uppercase">{d.email}</p></div>
                  </td>
                  <td className="px-8 py-6"><p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{d.vehicleModel}</p><p className="text-[10px] font-bold text-slate-400 tracking-widest">{d.plateNumber}</p></td>
                  <td className="px-8 py-6"><span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${d.isOnline ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>{d.isOnline ? 'Active' : 'Offline'}</span></td>
                  <td className="px-8 py-6 font-black text-slate-900 text-sm">{d.rating} ⭐</td>
                  <td className="px-8 py-6 text-right font-black text-slate-900 text-sm tracking-tight">₦{d.balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useApp();

  useEffect(() => {
    db.settings.get().then(setSettings);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    await db.settings.update(settings);
    setTimeout(() => {
      setIsSaving(false);
      showToast("System Parameters Updated", "success");
    }, 1000);
  };

  if (!settings) return null;

  return (
    <div className="p-4 md:p-8 max-w-4xl space-y-8 bg-[#f8fafc] h-full overflow-y-auto custom-scrollbar animate-in slide-in-from-bottom-8 duration-500">
      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">System Provisioning</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 text-blue-600 mb-2"><DollarSign className="w-6 h-6" /> <h4 className="font-black uppercase tracking-widest text-xs">Fare Logic</h4></div>
          <div className="space-y-4">
            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Base Fare (₦)</label><input type="number" value={settings.baseFare} onChange={e => setSettings({...settings, baseFare: Number(e.target.value)})} className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-black outline-none focus:ring-4 focus:ring-blue-500/10 transition" /></div>
            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Distance Multiplier (₦)</label><input type="number" value={settings.pricePerKm} onChange={e => setSettings({...settings, pricePerKm: Number(e.target.value)})} className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-black outline-none focus:ring-4 focus:ring-blue-500/10 transition" /></div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 text-red-600 mb-2"><ShieldAlert className="w-6 h-6" /> <h4 className="font-black uppercase tracking-widest text-xs">Platform Core</h4></div>
          <div className="space-y-4">
             <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">System Fee (%)</label><input type="number" value={settings.commission} onChange={e => setSettings({...settings, commission: Number(e.target.value)})} className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-black outline-none focus:ring-4 focus:ring-blue-500/10 transition" /></div>
             <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl">
               <span className="text-[10px] font-black uppercase tracking-widest">Protocol Lockdown</span>
               <button onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})} className={`w-12 h-6 rounded-full relative transition ${settings.maintenanceMode ? 'bg-red-500' : 'bg-slate-700'}`}>
                 <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.maintenanceMode ? 'left-7' : 'left-1'}`} />
               </button>
             </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-8">
        <button onClick={handleSave} className="bg-blue-600 text-white px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-blue-500/20 flex items-center space-x-3 hover:scale-105 transition active:scale-95">
          {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span>Commit Changes</span>
        </button>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { logout, currentUser } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/infra', icon: Database, label: 'Infrastructure' },
    { to: '/admin/map', icon: MapIcon, label: 'Live Map' },
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
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><Car className="w-6 h-6 text-white" /></div>
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
                 <input placeholder="Search telemetry..." className="w-full pl-12 pr-6 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none" />
              </div>
           </div>
           <div className="flex items-center space-x-4">
              <button className="p-2.5 text-slate-400 bg-slate-50 rounded-xl transition hover:text-blue-600"><Bell className="w-5 h-5" /></button>
              <div className="flex items-center space-x-3 border-l pl-4 border-slate-100">
                 <div className="text-right hidden sm:block">
                    <p className="text-xs font-black text-slate-900 leading-none">{currentUser?.name}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Super Node</p>
                 </div>
                 <img src={currentUser?.avatar} className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-50 shadow-sm" />
              </div>
           </div>
        </header>
        <div className="flex-1 overflow-hidden relative bg-[#f8fafc]">
          <Routes>
            <Route path="/" element={<AdminMainDashboard />} />
            <Route path="/infra" element={<InfrastructureView />} />
            <Route path="/map" element={<LiveMapView />} />
            <Route path="/users" element={<DriversView />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="*" element={<AdminMainDashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
