
import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { 
  Car, DollarSign, Activity, Bell, CheckCircle, Navigation, Shield, LogOut, Star, 
  TrendingUp, Calendar, ArrowUpRight, AlertTriangle, Menu, X, Loader2, MapPin, Clock, History
} from 'lucide-react';
import { useApp } from '../App';
import { db } from '../database';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Driver, RideRequest, RideStatus } from '../types';

const DriverOverview: React.FC<{ driver: Driver, isOnline: boolean, toggleOnline: () => void }> = ({ driver, isOnline, toggleOnline }) => {
  const [rides, setRides] = useState<RideRequest[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetch = async () => {
      const userRides = await db.rides.getByUser(driver.id);
      const userTrans = await db.transactions.getForUser(driver.id);
      setRides(userRides.filter(r => r.status === RideStatus.COMPLETED));
      setTransactions(userTrans.slice(0, 5));
      setLoading(false);
    };
    fetch();
    const int = setInterval(fetch, 10000);
    return () => clearInterval(int);
  }, [driver.id]);

  const earningsToday = rides
    .filter(r => new Date(r.createdAt).toDateString() === new Date().toDateString())
    .reduce((acc, r) => acc + (r.fare * 0.85), 0); // Estimating based on typical commission

  return (
    <main className="p-6 md:p-10 space-y-8 overflow-y-auto h-full pb-32 bg-[#fcfcfc] custom-scrollbar">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div><h1 className="text-3xl font-black text-slate-900 tracking-tight">Driver Hub: {driver.name}</h1><p className="text-slate-500 font-bold">Node active via SpeedRide 2026 Production Core.</p></div>
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex items-center space-x-6">
           <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Available Earning</p><p className="text-2xl font-black text-blue-600">₦{driver.balance.toLocaleString()}</p></div>
           <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><DollarSign /></div>
        </div>
      </div>

      <div className="bg-slate-900 p-8 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]" />
        <div className="flex items-center space-x-6 relative z-10">
          <div className={`w-4 h-4 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
          <div><h4 className="text-xl font-black">{isOnline ? 'Accepting Incoming Signals' : 'Signals Offline'}</h4><p className="font-bold opacity-60">Status dictates dispatch eligibility.</p></div>
        </div>
        <button onClick={toggleOnline} className={`relative z-10 px-10 py-5 rounded-3xl font-black transition-all transform hover:scale-105 active:scale-95 ${isOnline ? 'bg-red-500 text-white shadow-xl shadow-red-500/20' : 'bg-blue-600 text-white shadow-xl shadow-blue-500/20'}`}>
          {isOnline ? "Disconnect Node" : "Connect Node Now"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Estimated Today', value: `₦${earningsToday.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-500' },
          { label: 'Partner Rating', value: driver.rating.toString(), icon: Star, color: 'text-amber-500' },
          { label: 'Node Sessions', value: rides.length.toString(), icon: CheckCircle, color: 'text-blue-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50 flex items-center space-x-6 transition hover:shadow-lg group">
            <div className={`p-4 rounded-2xl bg-slate-50 ${stat.color} group-hover:scale-110 transition`}><stat.icon className="w-7 h-7" /></div>
            <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p><p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center uppercase text-sm"><History className="w-5 h-5 mr-3 text-blue-600" /> Recent Settlements</h3>
               <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View All Ledger</button>
            </div>
            <div className="space-y-4">
               {loading ? <div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-200" /></div> : 
               transactions.length === 0 ? <p className="text-center py-10 text-xs font-bold text-slate-400 uppercase tracking-widest">No recent transmissions</p> :
               transactions.map((t, idx) => (
                 <div key={idx} className="flex justify-between items-center p-5 bg-slate-50 rounded-[24px] border border-slate-100 hover:bg-white transition group">
                    <div className="flex items-center space-x-4">
                       <div className={`p-2 rounded-xl ${t.type === 'CREDIT' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                          {t.type === 'CREDIT' ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-180" />}
                       </div>
                       <div>
                          <p className="text-xs font-black text-slate-900 leading-none">{t.category}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{new Date(t.created_at).toLocaleTimeString()}</p>
                       </div>
                    </div>
                    <p className={`font-black text-sm ${t.type === 'CREDIT' ? 'text-emerald-600' : 'text-slate-900'}`}>
                       {t.type === 'CREDIT' ? '+' : '-'}₦{parseFloat(t.amount).toLocaleString()}
                    </p>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
            <h3 className="text-xl font-black mb-8 flex items-center tracking-tight uppercase text-sm relative z-10"><Activity className="w-5 h-5 mr-3 text-blue-400" /> Telemetry Stream</h3>
            <div className="space-y-6 relative z-10">
               <div className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Node Connection</span>
                  <span className="text-xs font-black text-emerald-400">ENCRYPTED_PG_CORE</span>
               </div>
               <div className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Avg. Response Time</span>
                  <span className="text-xs font-black">1.2s Sync</span>
               </div>
               <div className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Protocol</span>
                  <span className="text-xs font-black uppercase tracking-widest text-blue-400">V4.2.0-STABLE</span>
               </div>
            </div>
         </div>
      </div>
    </main>
  );
};

const DriverDashboard: React.FC = () => {
  const { currentUser, logout, refreshUser, showToast } = useApp();
  const driver = currentUser as Driver;
  const [isOnline, setIsOnline] = useState(driver?.isOnline || false);
  const [activeRequest, setActiveRequest] = useState<RideRequest | null>(null);

  const toggleOnline = async () => {
    const newState = !isOnline;
    setIsOnline(newState);
    try {
      await db.users.update(driver.id, { isOnline: newState });
      await refreshUser();
      showToast(newState ? "Node connected to SpeedRide Grid" : "Node disconnected", newState ? 'success' : 'info');
    } catch (e) {
      setIsOnline(!newState);
      showToast("Sync failure. Check connection.", "error");
    }
  };

  // Poll for ride requests when online
  useEffect(() => {
    if (!isOnline || activeRequest) return;
    const interval = setInterval(async () => {
      const available = await db.rides.getAvailableForDriver(driver.vehicleType);
      if (available.length > 0) {
        setActiveRequest(available[0]);
        // Visual ping
        if ("vibrate" in navigator) navigator.vibrate(200);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isOnline, activeRequest, driver.vehicleType]);

  const handleRideAction = async (status: RideStatus) => {
    if (!activeRequest) return;
    try {
      await db.rides.updateStatus(activeRequest.id, status, driver.id);
      const allRides = await db.rides.getAll();
      const updated = allRides.find(r => r.id === activeRequest.id);
      if (updated) {
        setActiveRequest(updated);
        if (status === RideStatus.COMPLETED) {
          showToast("Ride successfully settled in ledger", "success");
          setActiveRequest(null);
          refreshUser();
        }
      }
    } catch (e) {
      showToast("Status sync failed", "error");
    }
  };

  if (!driver) return null;

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      <div className="w-20 md:w-72 bg-slate-900 text-white flex flex-col p-6 space-y-12 shrink-0 border-r border-white/5">
        <div className="flex items-center justify-center md:justify-start space-x-3 transition hover:scale-105">
           <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20"><Car className="text-white" /></div>
           <span className="hidden md:block font-black text-lg tracking-tighter uppercase">SPEEDRIDE</span>
        </div>
        <nav className="flex-1 space-y-4">
          <NavLink to="/driver" className="flex items-center space-x-4 p-4 rounded-2xl bg-white/10 text-blue-400 shadow-xl shadow-black/20"><Activity /><span className="hidden md:block font-black text-xs uppercase tracking-widest">Dashboard</span></NavLink>
        </nav>
        <button onClick={logout} className="flex items-center space-x-4 p-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition group"><LogOut className="group-hover:-translate-x-1 transition" /><span className="hidden md:block font-black text-xs uppercase tracking-widest">Sign Out</span></button>
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0 sticky top-0 z-50">
           <div className="flex items-center space-x-4"><div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} /><span className="font-black text-[10px] uppercase tracking-widest text-slate-500">{isOnline ? 'Online' : 'Offline'}</span></div>
           <div className="flex items-center space-x-6">
              <div className="hidden md:flex flex-col items-end border-r pr-6 border-slate-100">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Unit Status</p>
                 <p className="text-xs font-black text-slate-900">VERIFIED PARTNER</p>
              </div>
              <img src={driver.avatar} className="w-10 h-10 rounded-xl object-cover ring-4 ring-slate-50 shadow-sm" />
           </div>
        </header>

        <DriverOverview driver={driver} isOnline={isOnline} toggleOnline={toggleOnline} />

        {activeRequest && (
          <div className="fixed bottom-10 right-10 w-full max-w-[440px] bg-slate-900 text-white rounded-[40px] shadow-2xl p-8 border border-white/10 animate-in slide-in-from-bottom-20 z-[200]">
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2 text-blue-400"><Car className="w-5 h-5" /><span className="text-[10px] font-black uppercase tracking-widest">Live Trip Feed</span></div>
                <div className="text-[10px] font-black text-slate-500 px-3 py-1 bg-white/5 rounded-full uppercase tracking-widest">{activeRequest.status}</div>
             </div>
             
             <div className="space-y-6 mb-8">
                <div className="flex justify-between items-end">
                   <div><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Estimated Net</p><p className="text-3xl font-black text-white">₦{(activeRequest.fare * 0.85).toLocaleString()}</p></div>
                   <div className="text-right"><p className="text-xs font-black text-slate-400">{activeRequest.distance} KM Session</p></div>
                </div>
                <div className="space-y-4 px-2">
                   <div className="flex items-start space-x-4"><MapPin className="text-emerald-500 w-4 h-4 mt-1" /><p className="text-sm font-bold opacity-80">{activeRequest.pickup}</p></div>
                   <div className="flex items-start space-x-4"><Navigation className="text-blue-500 w-4 h-4 mt-1" /><p className="text-sm font-bold opacity-80">{activeRequest.dropoff}</p></div>
                </div>
             </div>

             <div className="flex gap-4">
                {activeRequest.status === RideStatus.REQUESTED && (
                  <>
                    <button onClick={() => setActiveRequest(null)} className="flex-1 py-4 bg-white/5 rounded-2xl font-black text-slate-400 text-xs hover:bg-white/10 transition uppercase tracking-widest">Ignore</button>
                    <button onClick={() => handleRideAction(RideStatus.ACCEPTED)} className="flex-1 py-4 bg-blue-600 rounded-2xl font-black text-xs shadow-xl shadow-blue-600/20 hover:bg-blue-500 transition uppercase tracking-widest">Accept Trip</button>
                  </>
                )}
                {activeRequest.status === RideStatus.ACCEPTED && <button onClick={() => handleRideAction(RideStatus.ARRIVING)} className="w-full py-5 bg-amber-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-400 transition">Node Arrived</button>}
                {activeRequest.status === RideStatus.ARRIVING && <button onClick={() => handleRideAction(RideStatus.IN_PROGRESS)} className="w-full py-5 bg-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition">Initiate Journey</button>}
                {activeRequest.status === RideStatus.IN_PROGRESS && <button onClick={() => handleRideAction(RideStatus.COMPLETED)} className="w-full py-5 bg-emerald-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition">Finalize Settlement</button>}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
