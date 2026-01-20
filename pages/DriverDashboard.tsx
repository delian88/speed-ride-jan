
import React, { useState } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { 
  Car, User as UserIcon, DollarSign, Activity, Bell, 
  CheckCircle, Navigation, Shield, LogOut, Zap, Star
} from 'lucide-react';
import { useApp } from '../App';
import { db } from '../database';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Driver } from '../types';
import Logo from '../components/Logo';

const DriverOverview: React.FC<{ driver: Driver, isOnline: boolean, toggleOnline: () => void }> = ({ driver, isOnline, toggleOnline }) => {
  const earningsData = [
    { name: 'Mon', amount: 12000 }, { name: 'Tue', amount: 24000 }, { name: 'Wed', amount: 18000 },
    { name: 'Thu', amount: 32000 }, { name: 'Fri', amount: 45000 }, { name: 'Sat', amount: 56000 }, { name: 'Sun', amount: 38000 },
  ];

  return (
    <main className="p-10 space-y-10 animate-in fade-in duration-500 overflow-y-auto h-full">
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
          <Shield className="w-10 h-10 text-amber-600" />
          <div className="flex-1 text-center md:text-left"><h4 className="text-xl font-black text-amber-900 mb-2">Verification in Progress</h4><p className="text-amber-800 font-medium">Reviewing documents. You'll receive a notification once approved.</p></div>
          <button className="bg-amber-900 text-white font-black px-8 py-4 rounded-2xl hover:bg-amber-800 transition shadow-lg">View Documents</button>
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
    if (newState && driver.isVerified) setTimeout(() => setActiveRequest({ id: 'REQ-101', rider: 'Amaka Eze', pickup: 'Yaba', dropoff: 'Maryland', fare: 4500.00, distance: '8.5km' }), 5000);
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
            <Route path="/earnings" element={<div className="p-12"><h2 className="text-4xl font-black">Earnings History</h2></div>} />
            <Route path="/docs" element={<div className="p-12"><h2 className="text-4xl font-black">Verification Documents</h2></div>} />
            <Route path="/profile" element={<div className="p-12"><h2 className="text-4xl font-black">Driver Settings</h2></div>} />
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
             </div>
             <div className="flex space-x-4">
                <button onClick={() => setActiveRequest(null)} className="flex-1 py-5 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-slate-400">Ignore</button>
                <button onClick={() => setActiveRequest(null)} className="flex-1 py-5 bg-blue-600 hover:bg-blue-700 rounded-2xl font-black shadow-2xl shadow-blue-600/20">Accept Trip</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
