
import React, { useState, useEffect } from 'react';
import { 
  Car, User as UserIcon, MapPin, DollarSign, 
  TrendingUp, Activity, Bell, SwitchCamera, 
  CheckCircle, Navigation, Shield, LogOut,
  X, Camera, FileText, AlertTriangle, ShieldCheck,
  Star, Smartphone, Zap
} from 'lucide-react';
import { useApp } from '../App';
import { db } from '../database';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Driver } from '../types';

type DriverView = 'DASHBOARD' | 'EARNINGS' | 'PROFILE' | 'DOCS';

const DriverDashboard: React.FC = () => {
  const { currentUser, logout, refreshUser } = useApp();
  const driver = currentUser as Driver;
  const [currentView, setCurrentView] = useState<DriverView>('DASHBOARD');
  const [isOnline, setIsOnline] = useState(driver.isOnline);
  const [activeRequest, setActiveRequest] = useState<any>(null);

  const toggleOnline = async () => {
    const newState = !isOnline;
    setIsOnline(newState);
    await db.users.update(driver.id, { isOnline: newState });
    await refreshUser();
    
    if (newState && driver.isVerified) {
      setTimeout(() => {
        setActiveRequest({
          id: 'REQ-101',
          rider: 'Amaka Eze',
          pickup: 'Yaba College of Tech',
          dropoff: 'Maryland Mall',
          fare: 4500.00,
          distance: '8.5km'
        });
      }, 5000);
    }
  };

  const acceptRide = () => setActiveRequest(null);

  const earningsData = [
    { name: 'Mon', amount: 12000 },
    { name: 'Tue', amount: 24000 },
    { name: 'Wed', amount: 18000 },
    { name: 'Thu', amount: 32000 },
    { name: 'Fri', amount: 45000 },
    { name: 'Sat', amount: 56000 },
    { name: 'Sun', amount: 38000 },
  ];

  const renderDashboard = () => (
    <main className="p-10 space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Welcome, {driver.name}</h1>
          <p className="text-slate-500 font-bold">Your mobility hub is active.</p>
        </div>
        <div className="bg-white p-6 rounded-[30px] shadow-sm border border-slate-50 flex items-center space-x-6">
           <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Weekly Wallet</p>
            <p className="text-3xl font-black text-blue-600">₦{driver.balance.toLocaleString()}</p>
           </div>
           <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
            <DollarSign className="text-blue-600 w-6 h-6" />
           </div>
        </div>
      </div>

      {!driver.isVerified ? (
        <div className="bg-amber-50 border-l-8 border-amber-400 p-8 rounded-[30px] flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-amber-100">
          <div className="bg-amber-100 p-4 rounded-full text-amber-600">
            <Shield className="w-10 h-10" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-xl font-black text-amber-900 mb-2">Verification in Progress</h4>
            <p className="text-amber-800 font-medium">SpeedRide safety team is reviewing your documents. You'll receive a notification once approved to start taking rides.</p>
          </div>
          <button className="bg-amber-900 text-white font-black px-8 py-4 rounded-2xl hover:bg-amber-800 transition shadow-lg">View Documents</button>
        </div>
      ) : (
        <div className="bg-blue-600 p-8 rounded-[30px] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-blue-200">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div>
               <h4 className="text-2xl font-black">Verified Professional</h4>
               <p className="font-bold opacity-80">You are eligible for Premium rides and bonuses.</p>
            </div>
          </div>
          <button 
            onClick={toggleOnline}
            className={`px-10 py-5 rounded-2xl font-black transition-all ${isOnline ? 'bg-red-500 text-white shadow-xl shadow-red-200' : 'bg-white text-blue-600 shadow-xl shadow-white/20'}`}
          >
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
            <div className={`${stat.color} p-5 rounded-3xl`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-50">
        <h3 className="text-2xl font-black text-slate-900 mb-8">Revenue Analytics</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={earningsData}>
              <defs>
                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700}} />
              <Tooltip contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}} />
              <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={5} fill="url(#colorAmt)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      <div className="w-24 md:w-72 bg-slate-900 text-white flex flex-col p-8 space-y-12 shrink-0">
        <div className="flex items-center space-x-3">
           <div className="bg-blue-600 p-2 rounded-xl"><Zap className="w-8 h-8" /></div>
           <span className="hidden md:block text-2xl font-black tracking-tighter uppercase">SPEEDDRIVE</span>
        </div>
        <nav className="flex-1 space-y-3">
          {[
            { id: 'DASHBOARD', label: 'Overview', icon: Activity },
            { id: 'EARNINGS', label: 'Earnings', icon: DollarSign },
            { id: 'DOCS', label: 'Documents', icon: Shield },
            { id: 'PROFILE', label: 'Settings', icon: UserIcon },
          ].map(item => (
            <button key={item.id} onClick={() => setCurrentView(item.id as any)} className={`flex items-center space-x-4 w-full p-4 rounded-2xl transition ${currentView === item.id ? 'bg-white/10 text-blue-400' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
              <item.icon className="w-6 h-6" />
              <span className="hidden md:block font-black text-xs uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="pt-6 border-t border-white/5">
          <a 
            href="https://www.premegagetech.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:block text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 hover:text-blue-400 transition"
          >
            Powered by Premegage Tech
          </a>
          <button onClick={logout} className="flex items-center space-x-4 w-full p-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition">
            <LogOut className="w-6 h-6" />
            <span className="hidden md:block font-black text-xs uppercase tracking-widest">Sign Out</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative overflow-y-auto">
        <header className="h-24 bg-white border-b border-slate-100 flex items-center justify-between px-10 shrink-0">
           <div className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]' : 'bg-slate-300'}`}></div>
              <span className="font-black text-xs uppercase tracking-widest text-slate-700">{isOnline ? "Online & Ready" : "Status: Offline"}</span>
           </div>
           <div className="flex items-center space-x-6">
             <button className="relative p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition"><Bell className="w-6 h-6 text-slate-400" /><div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div></button>
             <div className="flex items-center space-x-3 p-1.5 pr-4 bg-slate-50 rounded-2xl border border-slate-100">
                <img src={driver.avatar} className="w-10 h-10 rounded-xl object-cover" />
                <div className="hidden lg:block">
                  <p className="text-xs font-black text-slate-900">{driver.name}</p>
                  <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{driver.vehicleModel}</p>
                </div>
             </div>
           </div>
        </header>

        {renderDashboard()}

        {activeRequest && (
          <div className="fixed bottom-10 right-10 w-[420px] bg-slate-900 text-white rounded-[40px] shadow-2xl p-8 border border-white/10 animate-in slide-in-from-right-20 duration-500 z-50">
             <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 p-2.5 rounded-2xl"><Car className="w-5 h-5" /></div>
                  <span className="font-black text-xs uppercase tracking-[0.2em] text-blue-400">New Trip Request</span>
                </div>
                <div className="text-xs bg-white/10 px-3 py-1.5 rounded-full font-black text-white/50 border border-white/5">0:15</div>
             </div>
             <div className="space-y-6 mb-10">
                <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center font-black text-xl">{activeRequest.rider[0]}</div>
                      <div><p className="font-black text-lg">{activeRequest.rider}</p><p className="text-xs text-slate-400 font-bold">Rider Rating: 4.8</p></div>
                   </div>
                   <div className="text-right"><p className="text-3xl font-black text-blue-400">₦{activeRequest.fare.toLocaleString()}</p><p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{activeRequest.distance}</p></div>
                </div>
                <div className="space-y-4 relative pl-8 border-l border-dashed border-white/20 ml-6">
                   <div className="relative">
                      <div className="absolute -left-[1.75rem] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-slate-900"></div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pickup</p>
                      <p className="font-bold text-slate-100">{activeRequest.pickup}</p>
                   </div>
                   <div className="relative">
                      <div className="absolute -left-[1.75rem] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-red-500 border-2 border-slate-900"></div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Drop-off</p>
                      <p className="font-bold text-slate-100">{activeRequest.dropoff}</p>
                   </div>
                </div>
             </div>
             <div className="flex space-x-4">
                <button onClick={() => setActiveRequest(null)} className="flex-1 py-5 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-slate-400">Ignore</button>
                <button onClick={acceptRide} className="flex-1 py-5 bg-blue-600 hover:bg-blue-700 rounded-2xl font-black shadow-2xl shadow-blue-600/20">Accept Trip</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
