
import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
// Added Plus icon to imports
import { 
  Users, Car, TrendingUp, AlertCircle, Settings, Search, X, Map as MapIcon, LayoutDashboard, 
  LogOut, DollarSign, Activity, Bell, ChevronDown, ChevronRight, User as UserIcon, 
  BarChart3, Menu, Save, ShieldCheck, CreditCard, Gift, HelpCircle, FileText,
  Clock, MapPin, Navigation, Info, ShieldAlert, CheckCircle, RefreshCw, Layers,
  Briefcase, Download, Plus
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

  const earningsData = [
    { name: 'Mon', value: 180000 }, { name: 'Tue', value: 250000 }, { name: 'Wed', value: 210000 },
    { name: 'Thu', value: 280000 }, { name: 'Fri', value: 350000 }, { name: 'Sat', value: 320000 },
    { name: 'Sun', value: 425700 },
  ];

  const rideRequestData = [
    { name: 'Economy', value: 1205, color: '#3b82f6' },
    { name: 'Premium', value: 170, color: '#10b981' },
    { name: 'XL', value: 77, color: '#f59e0b' },
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
            <h3 className="text-xl font-black text-slate-900">Earnings Timeline</h3>
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
          <h3 className="text-xl font-black text-slate-900 mb-6">Service Mix</h3>
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
            <h3 className="text-xl font-black text-slate-900">Recent Transmissions</h3>
            <NavLink to="/admin/rides" className="text-blue-600 font-black text-xs uppercase tracking-widest flex items-center">View All <ChevronRight className="w-4 h-4 ml-1" /></NavLink>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1000px]">
               <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]"><th className="px-8 py-6">ID</th><th className="px-8 py-6">Driver</th><th className="px-8 py-6">Rider</th><th className="px-8 py-6">Fare</th><th className="px-8 py-6 text-right">Status</th></tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {rides.map(ride => (
                    <tr key={ride.id} className="hover:bg-slate-50 transition">
                       <td className="px-8 py-6 text-xs font-bold text-slate-400">#{ride.id.slice(-4).toUpperCase()}</td>
                       <td className="px-8 py-6 font-black text-slate-900 text-xs">{ride.driverId ? `D-${ride.driverId.slice(-4)}` : 'Searching...'}</td>
                       <td className="px-8 py-6 font-black text-slate-900 text-xs">R-{ride.riderId.slice(-4)}</td>
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
  <div className="h-full w-full relative animate-in fade-in duration-500">
    <div className="absolute inset-0 bg-slate-200">
      {/* Mock Map View */}
      <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80" className="w-full h-full object-cover opacity-60 grayscale-[0.3]" />
      <div className="absolute inset-0 bg-blue-900/5 backdrop-blur-[2px]" />
      
      {/* Moving Car Markers */}
      <div className="absolute top-1/4 left-1/3 w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center animate-bounce"><Car className="w-4 h-4 text-white" /></div>
      <div className="absolute bottom-1/3 right-1/4 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white shadow-xl flex items-center justify-center"><Car className="w-4 h-4 text-white" /></div>
      <div className="absolute top-1/2 right-1/2 w-8 h-8 bg-orange-400 rounded-full border-4 border-white shadow-xl flex items-center justify-center animate-pulse"><Car className="w-4 h-4 text-white" /></div>
    </div>

    <div className="absolute top-8 left-8 space-y-4">
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-[32px] border border-white/50 shadow-2xl w-72">
        <h3 className="font-black text-slate-900 mb-4 flex items-center"><MapIcon className="w-5 h-5 mr-2 text-blue-600" /> Live Tracking</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-500">Active Drivers</span><span className="text-sm font-black text-slate-900">932</span></div>
          <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-500">Active Rides</span><span className="text-sm font-black text-slate-900">142</span></div>
          <div className="pt-4 border-t border-slate-100 flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /><span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Real-time Stream OK</span></div>
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
        <div><h2 className="text-2xl font-black text-slate-900">Fleet Management</h2><p className="text-slate-500 font-bold text-sm">Managing {drivers.length} registered vehicle nodes.</p></div>
        <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center space-x-2"><Car className="w-4 h-4" /> <span>Add Driver</span></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Online Now" value={drivers.filter(d => d.isOnline).length.toString()} trend="2.4%" trendUp={true} icon={Activity} />
        <StatCard label="Verified" value={drivers.filter(d => d.isVerified).length.toString()} trend="0.8%" trendUp={true} icon={ShieldCheck} />
        <StatCard label="Average Rating" value="4.82" trend="0.1%" trendUp={true} icon={TrendingUp} />
        <StatCard label="Active Trips" value="12" trend="12%" trendUp={true} icon={MapPin} />
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest"><th className="px-8 py-5">Driver Node</th><th className="px-8 py-5">Vehicle</th><th className="px-8 py-5">Status</th><th className="px-8 py-5">Rating</th><th className="px-8 py-5 text-right">Balance</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {drivers.map(d => (
                <tr key={d.id} className="hover:bg-slate-50 transition group">
                  <td className="px-8 py-6 flex items-center space-x-3">
                    <img src={d.avatar} className="w-10 h-10 rounded-xl object-cover" />
                    <div><p className="font-black text-slate-900 text-sm">{d.name}</p><p className="text-[10px] font-bold text-slate-400">{d.email}</p></div>
                  </td>
                  <td className="px-8 py-6"><p className="text-xs font-black text-slate-900 uppercase">{d.vehicleModel}</p><p className="text-[10px] font-bold text-slate-400">{d.plateNumber}</p></td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${d.isOnline ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                      {d.isOnline ? 'Connected' : 'Offline'}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black text-slate-900 text-sm">{d.rating} ⭐</td>
                  <td className="px-8 py-6 text-right font-black text-slate-900 text-sm">₦{d.balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const RidersView: React.FC = () => {
  const [riders, setRiders] = useState<User[]>([]);
  useEffect(() => {
    db.users.getAll().then(users => {
      setRiders(users.filter(u => u.role === 'RIDER'));
    });
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#f8fafc] h-full overflow-y-auto custom-scrollbar animate-in slide-in-from-right duration-500">
      <div className="flex justify-between items-center">
        <div><h2 className="text-2xl font-black text-slate-900">Rider Directory</h2><p className="text-slate-500 font-bold text-sm">Active mobility nodes across the ecosystem.</p></div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest"><th className="px-8 py-5">Rider Profile</th><th className="px-8 py-5">Total Trips</th><th className="px-8 py-5">Rating</th><th className="px-8 py-5 text-right">Wallet Balance</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {riders.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 transition group">
                  <td className="px-8 py-6 flex items-center space-x-3">
                    <img src={r.avatar} className="w-10 h-10 rounded-xl object-cover" />
                    <div><p className="font-black text-slate-900 text-sm">{r.name}</p><p className="text-[10px] font-bold text-slate-400">{r.phone}</p></div>
                  </td>
                  <td className="px-8 py-6 text-xs font-black text-slate-900">42 Trips</td>
                  <td className="px-8 py-6 font-black text-slate-900 text-sm">{r.rating} ⭐</td>
                  <td className="px-8 py-6 text-right font-black text-slate-900 text-sm">₦{r.balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const TripsView: React.FC = () => {
  const [rides, setRides] = useState<RideRequest[]>([]);
  useEffect(() => {
    db.rides.getAll().then(r => setRides(r.reverse()));
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#f8fafc] h-full overflow-y-auto custom-scrollbar animate-in slide-in-from-right duration-500">
      <div className="flex justify-between items-center">
        <div><h2 className="text-2xl font-black text-slate-900">Trip Telemetry</h2><p className="text-slate-500 font-bold text-sm">Full lifecycle history of urban movements.</p></div>
        <div className="flex space-x-3">
          <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400"><Download className="w-5 h-5" /></button>
          <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest">Filter Logs</button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-8 py-5">Trip ID</th>
                <th className="px-8 py-5">Rider</th>
                <th className="px-8 py-5">Driver</th>
                <th className="px-8 py-5">Route (Pickup → Drop)</th>
                <th className="px-8 py-5">Fare</th>
                <th className="px-8 py-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rides.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 transition">
                  <td className="px-8 py-6 text-xs font-bold text-slate-400">#{r.id.slice(-4).toUpperCase()}</td>
                  <td className="px-8 py-6 font-black text-slate-900 text-xs">R-{r.riderId.slice(-4)}</td>
                  <td className="px-8 py-6 font-black text-slate-900 text-xs">{r.driverId ? `D-${r.driverId.slice(-4)}` : 'N/A'}</td>
                  <td className="px-8 py-6 text-[10px] font-bold text-slate-500 max-w-[200px] truncate">{r.pickup} → {r.dropoff}</td>
                  <td className="px-8 py-6 font-black text-slate-900">₦{r.fare.toLocaleString()}</td>
                  <td className="px-8 py-6 text-right"><span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${r.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const PaymentsView: React.FC = () => (
  <div className="p-4 md:p-8 space-y-8 bg-[#f8fafc] h-full overflow-y-auto custom-scrollbar animate-in slide-in-from-right duration-500">
    <div className="flex justify-between items-center">
      <div><h2 className="text-2xl font-black text-slate-900">Financial Ledger</h2><p className="text-slate-500 font-bold text-sm">System liquidity and driver payouts tracking.</p></div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard label="Net Payouts" value="₦1,240,500" trend="12%" trendUp={true} icon={Briefcase} />
      <StatCard label="Escrow Balance" value="₦420,800" trend="5.2%" trendUp={true} icon={ShieldCheck} />
      <StatCard label="Tax Collected" value="₦84,200" trend="8.1%" trendUp={true} icon={Layers} />
    </div>

    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm text-center py-20">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300"><CreditCard className="w-8 h-8" /></div>
      <h3 className="text-xl font-black text-slate-900 mb-2">Transaction History</h3>
      <p className="text-slate-400 font-bold max-w-md mx-auto">No pending settlements found. All driver balances are synced with the neural ledger.</p>
    </div>
  </div>
);

const PromotionsView: React.FC = () => (
  <div className="p-4 md:p-8 space-y-8 bg-[#f8fafc] h-full overflow-y-auto custom-scrollbar animate-in slide-in-from-right duration-500">
    <div className="flex justify-between items-center">
      <div><h2 className="text-2xl font-black text-slate-900">Promotions</h2><p className="text-slate-500 font-bold text-sm">Fueling growth through neural incentives.</p></div>
      <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center space-x-2"><Plus className="w-4 h-4" /> <span>New Promo</span></button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm border-l-4 border-l-blue-600 flex justify-between items-center">
        <div>
          <h4 className="font-black text-slate-900 mb-1">WELCOME2026</h4>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">50% Discount • First Ride</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-black text-blue-600">Active</p>
          <p className="text-[10px] font-bold text-slate-400">142 Redeemed</p>
        </div>
      </div>
      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm border-l-4 border-l-emerald-500 flex justify-between items-center opacity-60">
        <div>
          <h4 className="font-black text-slate-900 mb-1">LAGOSDRIVE</h4>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">₦500 Fixed Discount</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-black text-slate-400">Expired</p>
        </div>
      </div>
    </div>
  </div>
);

const ReportsView: React.FC = () => (
  <div className="p-4 md:p-8 space-y-8 bg-[#f8fafc] h-full overflow-y-auto custom-scrollbar animate-in slide-in-from-right duration-500">
    <div className="flex justify-between items-center">
      <div><h2 className="text-2xl font-black text-slate-900">Advanced Reports</h2><p className="text-slate-500 font-bold text-sm">Drill down into operational efficiency.</p></div>
    </div>
    <div className="bg-white p-12 rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
      <BarChart3 className="w-16 h-16 text-slate-100 mb-6" />
      <h3 className="text-xl font-black text-slate-900">Analytics Engine Idle</h3>
      <p className="text-slate-400 font-bold max-w-sm mt-2">Generate quarterly audits or driver performance metrics by selecting a time frame.</p>
      <button className="mt-8 px-10 py-4 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest">Initialize Report</button>
    </div>
  </div>
);

const SupportView: React.FC = () => (
  <div className="p-4 md:p-8 space-y-8 bg-[#f8fafc] h-full overflow-y-auto custom-scrollbar animate-in slide-in-from-right duration-500">
    <div className="flex justify-between items-center">
      <div><h2 className="text-2xl font-black text-slate-900">Support Hub</h2><p className="text-slate-500 font-bold text-sm">Assisting riders and partners 24/7.</p></div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-start space-x-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400"><HelpCircle /></div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <h4 className="font-black text-slate-900 text-sm">Issue with Payment ID #4521</h4>
                <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Pending</span>
              </div>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">Rider claims double charge on their GTBank card during peak hours. Needs manual verification...</p>
              <div className="mt-4 flex items-center space-x-4"><button className="text-[10px] font-black uppercase tracking-widest text-blue-600">Reply Now</button><span className="text-[10px] font-bold text-slate-400">2h ago</span></div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl h-fit">
        <h4 className="font-black text-xl mb-4">Support Stats</h4>
        <div className="space-y-6">
          <div className="flex justify-between items-center"><div><p className="text-[10px] font-black text-slate-500 uppercase">Avg Response</p><p className="font-black">12m 4s</p></div><TrendingUp className="text-emerald-500 w-5 h-5" /></div>
          <div className="flex justify-between items-center"><div><p className="text-[10px] font-black text-slate-500 uppercase">Open Tickets</p><p className="font-black">24</p></div><Activity className="text-blue-500 w-5 h-5" /></div>
          <button className="w-full py-4 bg-white/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] mt-4">View All Archive</button>
        </div>
      </div>
    </div>
  </div>
);

const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    db.settings.get().then(setSettings);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    await db.settings.update(settings);
    setTimeout(() => setIsSaving(false), 1000);
  };

  if (!settings) return null;

  return (
    <div className="p-4 md:p-8 max-w-4xl space-y-8 bg-[#f8fafc] h-full overflow-y-auto custom-scrollbar animate-in slide-in-from-bottom-8 duration-500">
      <h2 className="text-3xl font-black text-slate-900">System Provisioning</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 text-blue-600 mb-2"><DollarSign className="w-6 h-6" /> <h4 className="font-black uppercase tracking-widest text-xs">Fare Configuration</h4></div>
          <div className="space-y-4">
            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Base Fare (₦)</label><input type="number" value={settings.baseFare} onChange={e => setSettings({...settings, baseFare: Number(e.target.value)})} className="w-full p-4 bg-slate-50 border rounded-2xl font-black outline-none focus:ring-2 focus:ring-blue-600" /></div>
            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Price Per KM (₦)</label><input type="number" value={settings.pricePerKm} onChange={e => setSettings({...settings, pricePerKm: Number(e.target.value)})} className="w-full p-4 bg-slate-50 border rounded-2xl font-black outline-none" /></div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 text-red-600 mb-2"><ShieldAlert className="w-6 h-6" /> <h4 className="font-black uppercase tracking-widest text-xs">Security Protocol</h4></div>
          <div className="space-y-4">
             <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Platform Commission (%)</label><input type="number" value={settings.commission} onChange={e => setSettings({...settings, commission: Number(e.target.value)})} className="w-full p-4 bg-slate-50 border rounded-2xl font-black outline-none" /></div>
             <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl">
               <span className="text-xs font-black uppercase">Maintenance Mode</span>
               <button onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})} className={`w-12 h-6 rounded-full relative transition ${settings.maintenanceMode ? 'bg-red-500' : 'bg-slate-700'}`}>
                 <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.maintenanceMode ? 'left-7' : 'left-1'}`} />
               </button>
             </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-8">
        <button onClick={handleSave} className="bg-blue-600 text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/20 flex items-center space-x-3 hover:scale-105 transition active:scale-95">
          {isSaving ? <Activity className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span>Commit Changes</span>
        </button>
      </div>
    </div>
  );
};

// --- Main Shell ---

const AdminDashboard: React.FC = () => {
  const { logout, currentUser } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/map', icon: MapIcon, label: 'Live Map' },
    { to: '/admin/users', icon: Users, label: 'Drivers' },
    { to: '/admin/riders', icon: UserIcon, label: 'Riders' },
    { to: '/admin/rides', icon: Car, label: 'Trips' },
    { to: '/admin/payments', icon: CreditCard, label: 'Payments' },
    { to: '/admin/promos', icon: Gift, label: 'Promotions' },
    { to: '/admin/reports', icon: BarChart3, label: 'Reports' },
    { to: '/admin/support', icon: HelpCircle, label: 'Support Hub' },
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
                 <input placeholder="Search telemetry..." className="w-full pl-12 pr-6 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none" />
              </div>
           </div>
           <div className="flex items-center space-x-4">
              <button className="p-2.5 text-slate-400 bg-slate-50 rounded-xl transition"><Bell className="w-5 h-5" /></button>
              <div className="flex items-center space-x-3">
                 <div className="text-right hidden sm:block">
                    <p className="text-xs font-black text-slate-900 leading-none">{currentUser?.name}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Super Node</p>
                 </div>
                 <img src={currentUser?.avatar} className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-50 shadow-sm" />
              </div>
           </div>
        </header>
        <div className="flex-1 overflow-hidden relative">
          <Routes>
            <Route path="/" element={<AdminMainDashboard />} />
            <Route path="/map" element={<LiveMapView />} />
            <Route path="/users" element={<DriversView />} />
            <Route path="/riders" element={<RidersView />} />
            <Route path="/rides" element={<TripsView />} />
            <Route path="/payments" element={<PaymentsView />} />
            <Route path="/promos" element={<PromotionsView />} />
            <Route path="/reports" element={<ReportsView />} />
            <Route path="/support" element={<SupportView />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="*" element={<AdminMainDashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
