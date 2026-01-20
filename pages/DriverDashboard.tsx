
import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { 
  Car, User as UserIcon, DollarSign, Activity, Bell, 
  CheckCircle, Navigation, Shield, LogOut, Zap, Star,
  TrendingUp, Calendar, ArrowUpRight, FileText, Camera, Save, AlertTriangle
} from 'lucide-react';
import { useApp } from '../App';
import { db } from '../database';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Driver, RideRequest } from '../types';
import Logo from '../components/Logo';

const DriverOverview: React.FC<{ driver: Driver, isOnline: boolean, toggleOnline: () => void }> = ({ driver, isOnline, toggleOnline }) => {
  const earningsData = [
    { name: 'Mon', amount: 12000 }, { name: 'Tue', amount: 24000 }, { name: 'Wed', amount: 18000 },
    { name: 'Thu', amount: 32000 }, { name: 'Fri', amount: 45000 }, { name: 'Sat', amount: 56000 }, { name: 'Sun', amount: 38000 },
  ];

  return (
    <main className="p-10 space-y-10 animate-in fade-in duration-500 overflow-y-auto h-full pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Welcome, {driver.name}</h1>
          <p className="text-slate-500 font-bold">Your mobility hub is active.</p>
        </div>
        <div className="bg-white p-6 rounded-[30px] shadow-sm border border-slate-50 flex items-center space-x-6">
           <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Weekly Wallet</p><p className="text-3xl font-black text-blue-600">₦{driver.balance.toLocaleString()}</p></div>
           <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center"><DollarSign className="text-blue-600 w-6 h-6" /></div>
        </div>
      </div>

      {!driver.isVerified ? (
        <div className="bg-amber-50 border-l-8 border-amber-400 p-8 rounded-[30px] flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-amber-100">
          <AlertTriangle className="w-10 h-10 text-amber-600" />
          <div className="flex-1 text-center md:text-left"><h4 className="text-xl font-black text-amber-900 mb-2">Verification in Progress</h4><p className="text-amber-800 font-medium">Reviewing documents. You'll receive a notification once approved.</p></div>
          <NavLink to="/driver/docs" className="bg-amber-900 text-white font-black px-8 py-4 rounded-2xl hover:bg-amber-800 transition shadow-lg whitespace-nowrap">Manage Docs</NavLink>
        </div>
      ) : (
        <div className="bg-blue-600 p-8 rounded-[30px] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-blue-200">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center"><CheckCircle className="w-10 h-10" /></div>
            <div><h4 className="text-2xl font-black">Verified Professional</h4><p className="font-bold opacity-80">Eligible for Premium rides and bonuses.</p></div>
          </div>
          <button onClick={toggleOnline} className={`px-10 py-5 rounded-2xl font-black transition-all ${isOnline ? 'bg-red-500 text-white shadow-xl shadow-red-200' : 'bg-white text-blue-600 shadow-xl shadow-white/20'}`}>
            {isOnline ? "Go Offline" : "Go Online Now"}
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { label: 'Successful Trips', value: '342', color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle },
          { label: 'Active Rating', value: driver.rating.toString(), color: 'bg-indigo-50 text-indigo-600', icon: Star },
          { label: 'Total KM', value: '2,840', color: 'bg-blue-50 text-blue-600', icon: Navigation },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50 flex items-center space-x-6 hover:shadow-xl transition-all duration-500">
            <div className={`${stat.color} p-5 rounded-3xl`}><stat.icon className="w-8 h-8" /></div>
            <div><p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p><p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p></div>
          </div>
        ))}
      </div>
      
      <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-50">
        <h3 className="text-2xl font-black text-slate-900 mb-8">Revenue Analytics</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700}} />
              <Tooltip contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}} />
              <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={5} fill="#3b82f633" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
};

const DriverEarnings: React.FC<{ driver: Driver }> = ({ driver }) => {
  return (
    <main className="p-10 space-y-10 animate-in slide-in-from-right-10 duration-500 overflow-y-auto h-full pb-32">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Earnings Hub</h2>
        <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition">Request Payout</button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-slate-900 text-white p-10 rounded-[50px] relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-10"><DollarSign className="w-32 h-32" /></div>
           <p className="text-xs font-black uppercase tracking-[0.3em] opacity-60 mb-2">Available for Payout</p>
           <p className="text-5xl font-black">₦{driver.balance.toLocaleString()}</p>
        </div>
        <div className="bg-white p-10 rounded-[50px] border border-slate-100 flex flex-col justify-center">
           <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Earnings Today</p>
           <div className="flex items-center space-x-2">
              <TrendingUp className="text-emerald-500 w-6 h-6" />
              <p className="text-3xl font-black text-slate-900">₦18,450.00</p>
           </div>
        </div>
        <div className="bg-white p-10 rounded-[50px] border border-slate-100 flex flex-col justify-center">
           <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Completed Trips</p>
           <div className="flex items-center space-x-2">
              <Calendar className="text-blue-500 w-6 h-6" />
              <p className="text-3xl font-black text-slate-900">14 Trips</p>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-900">Recent Revenue</h3>
          <button className="text-blue-600 font-black text-xs uppercase tracking-widest hover:underline">Download CSV</button>
        </div>
        <div className="space-y-2 p-6">
           {[1,2,3,4,5].map(i => (
             <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl hover:bg-slate-100 transition group cursor-pointer">
                <div className="flex items-center space-x-4">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm"><ArrowUpRight className="w-6 h-6" /></div>
                   <div>
                      <p className="font-black text-slate-900">Trip Fare Credit</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Oct {10+i}, 2026 • 15:3{i} PM</p>
                   </div>
                </div>
                <p className="text-xl font-black text-slate-900">+₦{(2400 + i * 150).toLocaleString()}</p>
             </div>
           ))}
        </div>
      </div>
    </main>
  );
};

const DriverDocs: React.FC<{ driver: Driver }> = ({ driver }) => {
  return (
    <main className="p-10 space-y-10 animate-in slide-in-from-right-10 duration-500 overflow-y-auto h-full pb-32">
      <h2 className="text-4xl font-black text-slate-900 tracking-tight">Credentials</h2>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
           <div className="flex items-center space-x-4">
              <div className="p-4 bg-blue-50 rounded-2xl text-blue-600"><FileText className="w-6 h-6" /></div>
              <div><h4 className="font-black text-xl text-slate-900">Driver's License</h4><p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Required for Compliance</p></div>
           </div>
           <div className="aspect-[4/3] bg-slate-100 rounded-[40px] border-4 border-white shadow-xl overflow-hidden group relative">
              <img src={driver.licenseDoc || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800'} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                 <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-110 transition">Update License</button>
              </div>
           </div>
        </div>
        <div className="space-y-6">
           <div className="flex items-center space-x-4">
              <div className="p-4 bg-blue-50 rounded-2xl text-blue-600"><Shield className="w-6 h-6" /></div>
              <div><h4 className="font-black text-xl text-slate-900">National ID (NIN)</h4><p className="text-xs text-slate-500 font-bold uppercase tracking-widest">ID Verification Status</p></div>
           </div>
           <div className="aspect-[4/3] bg-slate-100 rounded-[40px] border-4 border-white shadow-xl overflow-hidden group relative">
              <img src={driver.ninDoc || 'https://images.unsplash.com/photo-1557221162-8e6d24a6825c?w=800'} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                 <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-110 transition">Update NIN</button>
              </div>
           </div>
        </div>
      </div>
    </main>
  );
};

const DriverSettings: React.FC<{ driver: Driver }> = ({ driver }) => {
  const { refreshUser } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: driver.name,
    phone: driver.phone,
    vehicleModel: driver.vehicleModel,
    plateNumber: driver.plateNumber,
    avatar: driver.avatar
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.users.update(driver.id, formData);
    await refreshUser();
    setIsEditing(false);
  };

  return (
    <main className="p-10 space-y-10 animate-in slide-in-from-right-10 duration-500 overflow-y-auto h-full pb-32">
      <div className="flex justify-between items-center">
         <h2 className="text-4xl font-black text-slate-900 tracking-tight">Driver Profile</h2>
         <button onClick={() => setIsEditing(!isEditing)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-blue-600 transition">{isEditing ? 'Cancel' : 'Edit Profile'}</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <form onSubmit={handleUpdate} className="lg:col-span-2 bg-white p-10 rounded-[50px] border border-slate-100 space-y-10">
           <div className="flex items-center space-x-8">
              <div className="relative group">
                 <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-slate-50 shadow-xl">
                    <img src={formData.avatar} className="w-full h-full object-cover" />
                 </div>
                 {isEditing && (
                   <label className="absolute -bottom-2 -right-2 p-3 bg-blue-600 text-white rounded-2xl shadow-xl cursor-pointer hover:bg-blue-700 transition">
                      <Camera className="w-5 h-5" />
                      <input type="file" className="hidden" accept="image/*" />
                   </label>
                 )}
              </div>
              <div>
                 <h3 className="text-2xl font-black text-slate-900">{formData.name}</h3>
                 <p className="text-slate-400 font-bold text-sm">Tesla Partner Fleet • {driver.vehicleType}</p>
              </div>
           </div>

           <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
                 <input disabled={!isEditing} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 transition disabled:opacity-50" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Phone Number</label>
                 <input disabled={!isEditing} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 transition disabled:opacity-50" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Vehicle Model</label>
                 <input disabled={!isEditing} value={formData.vehicleModel} onChange={e => setFormData({...formData, vehicleModel: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 transition disabled:opacity-50" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Plate Number</label>
                 <input disabled={!isEditing} value={formData.plateNumber} onChange={e => setFormData({...formData, plateNumber: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 transition disabled:opacity-50" />
              </div>
           </div>

           {isEditing && (
             <div className="flex justify-end">
                <button type="submit" className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition flex items-center space-x-2">
                   <Save className="w-5 h-5" />
                   <span>Commit Changes</span>
                </button>
             </div>
           )}
        </form>

        <div className="space-y-8">
           <div className="bg-slate-900 p-10 rounded-[50px] text-white space-y-6">
              <h3 className="text-xl font-black">Account Integrity</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                    <span className="text-xs font-black uppercase tracking-widest opacity-60">Status</span>
                    <span className="text-emerald-500 font-black text-xs uppercase tracking-widest">Active</span>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                    <span className="text-xs font-black uppercase tracking-widest opacity-60">Trips Today</span>
                    <span className="text-blue-400 font-black text-xs uppercase tracking-widest">12 Completed</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </main>
  );
};

const DriverDashboard: React.FC = () => {
  const { currentUser, logout, refreshUser } = useApp();
  const driver = currentUser as Driver;
  const [isOnline, setIsOnline] = useState(driver.isOnline);
  const [activeRequest, setActiveRequest] = useState<any>(null);

  const toggleOnline = async () => {
    const newState = !isOnline;
    setIsOnline(newState);
    await db.users.update(driver.id, { isOnline: newState });
    await refreshUser();
    if (newState && driver.isVerified) {
       setTimeout(() => setActiveRequest({ 
         id: 'REQ-101', 
         rider: 'Amaka Eze', 
         pickup: 'Yaba Tech Hub', 
         dropoff: 'Eko Atlantic', 
         fare: 8400.00, 
         distance: '14.2km' 
       }), 3000);
    }
  };

  const navItems = [
    { to: '/driver', icon: Activity, label: 'Overview', end: true },
    { to: '/driver/earnings', icon: DollarSign, label: 'Earnings' },
    { to: '/driver/docs', icon: Shield, label: 'Documents' },
    { to: '/driver/profile', icon: UserIcon, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      <div className="w-24 md:w-72 bg-slate-900 text-white flex flex-col p-8 space-y-12 shrink-0">
        <div className="flex items-center space-x-3">
           <Logo className="h-16 w-auto brightness-0 invert" />
        </div>
        <nav className="flex-1 space-y-3">
          {navItems.map(item => (
            <NavLink 
              key={item.to} 
              to={item.to} 
              end={item.end} 
              className={({ isActive }) => `flex items-center space-x-4 w-full p-4 rounded-2xl transition ${isActive ? 'bg-white/10 text-blue-400' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <item.icon className="w-6 h-6 shrink-0" />
              <span className="hidden md:block font-black text-xs uppercase tracking-widest">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="pt-6 border-t border-white/5 space-y-4">
          <a href="https://www.premegagetech.com" target="_blank" rel="noopener noreferrer" className="hidden md:block text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-blue-400 transition">
            Powered by Premegage Tech
          </a>
          <button onClick={logout} className="flex items-center space-x-4 w-full p-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition">
            <LogOut className="w-6 h-6 shrink-0" />
            <span className="hidden md:block font-black text-xs uppercase tracking-widest">Sign Out</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden bg-white">
        <header className="h-24 bg-white border-b border-slate-100 flex items-center justify-between px-10 shrink-0">
           <div className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]' : 'bg-slate-300'}`}></div>
              <span className="font-black text-xs uppercase tracking-widest text-slate-700">{isOnline ? "Online & Ready" : "Status: Offline"}</span>
           </div>
           <div className="flex items-center space-x-6">
             <button className="relative p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition"><Bell className="w-6 h-6 text-slate-400" /><div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div></button>
             <div className="flex items-center space-x-3 p-1.5 pr-4 bg-slate-50 rounded-2xl border border-slate-100">
                <img src={driver.avatar} className="w-10 h-10 rounded-xl object-cover" />
                <div className="hidden lg:block"><p className="text-xs font-black text-slate-900">{driver.name}</p><p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{driver.vehicleModel}</p></div>
             </div>
           </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          <Routes>
            <Route path="/" element={<DriverOverview driver={driver} isOnline={isOnline} toggleOnline={toggleOnline} />} />
            <Route path="/earnings" element={<DriverEarnings driver={driver} />} />
            <Route path="/docs" element={<DriverDocs driver={driver} />} />
            <Route path="/profile" element={<DriverSettings driver={driver} />} />
          </Routes>
        </div>

        {activeRequest && (
          <div className="fixed bottom-10 right-10 w-[420px] bg-slate-900 text-white rounded-[40px] shadow-2xl p-8 border border-white/10 animate-in slide-in-from-right-20 duration-500 z-50">
             <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-3"><Car className="w-5 h-5 text-blue-400" /><span className="font-black text-xs uppercase tracking-[0.2em] text-blue-400">New Trip Request</span></div>
                <div className="text-xs bg-white/10 px-3 py-1.5 rounded-full font-black text-white/50 border border-white/5">0:15</div>
             </div>
             <div className="space-y-6 mb-10">
                <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-4"><div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center font-black text-xl">{activeRequest.rider[0]}</div><div><p className="font-black text-lg">{activeRequest.rider}</p><p className="text-xs text-slate-400 font-bold">Rider Rating: 4.8</p></div></div>
                   <div className="text-right"><p className="text-3xl font-black text-blue-400">₦{activeRequest.fare.toLocaleString()}</p><p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{activeRequest.distance}</p></div>
                </div>
                <div className="space-y-2">
                   <div className="flex items-center space-x-3 text-xs font-bold text-slate-400"><div className="w-2 h-2 rounded-full bg-emerald-500"></div><span>PICKUP: {activeRequest.pickup}</span></div>
                   <div className="flex items-center space-x-3 text-xs font-bold text-slate-400"><div className="w-2 h-2 rounded-full bg-blue-500"></div><span>DEST: {activeRequest.dropoff}</span></div>
                </div>
             </div>
             <div className="flex space-x-4">
                <button onClick={() => setActiveRequest(null)} className="flex-1 py-5 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-slate-400 transition">Ignore</button>
                <button onClick={() => setActiveRequest(null)} className="flex-1 py-5 bg-blue-600 hover:bg-blue-700 rounded-2xl font-black shadow-2xl shadow-blue-600/20 transition">Accept Trip</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
