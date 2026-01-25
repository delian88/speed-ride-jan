
import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { 
  Car, DollarSign, Activity, Bell, CheckCircle, Navigation, Shield, LogOut, Star, 
  TrendingUp, Calendar, ArrowUpRight, AlertTriangle, Menu, X, Loader2, MapPin
} from 'lucide-react';
import { useApp } from '../App';
import { db } from '../database';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Driver, RideRequest, RideStatus } from '../types';

const DriverOverview: React.FC<{ driver: Driver, isOnline: boolean, toggleOnline: () => void }> = ({ driver, isOnline, toggleOnline }) => {
  const [rides, setRides] = useState<RideRequest[]>([]);
  
  useEffect(() => {
    const fetch = async () => setRides((await db.rides.getByUser(driver.id)).filter(r => r.status === RideStatus.COMPLETED));
    fetch();
  }, [driver.id]);

  const earningsToday = rides
    .filter(r => new Date(r.createdAt).toDateString() === new Date().toDateString())
    .reduce((acc, r) => acc + (r.fare * 0.8), 0);

  return (
    <main className="p-6 md:p-10 space-y-8 overflow-y-auto h-full pb-32 bg-[#fcfcfc]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div><h1 className="text-3xl font-black text-slate-900 tracking-tight">Driver Hub: {driver.name}</h1><p className="text-slate-500 font-bold">Node online via SpeedRide 2026 Core.</p></div>
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex items-center space-x-6">
           <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Available Balance</p><p className="text-2xl font-black text-blue-600">₦{driver.balance.toLocaleString()}</p></div>
           <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><DollarSign /></div>
        </div>
      </div>

      <div className="bg-slate-900 p-8 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center space-x-6">
          <div className={`w-4 h-4 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
          <div><h4 className="text-xl font-black">{isOnline ? 'Accepting Incoming Signals' : 'Signals Offline'}</h4><p className="font-bold opacity-60">Online status required for telemetry matching.</p></div>
        </div>
        <button onClick={toggleOnline} className={`px-10 py-5 rounded-3xl font-black transition-all ${isOnline ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'}`}>
          {isOnline ? "Disconnect Node" : "Connect Node Now"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Today Revenue', value: `₦${earningsToday.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-500' },
          { label: 'Node Rating', value: driver.rating.toString(), icon: Star, color: 'text-amber-500' },
          { label: 'Completed', value: rides.length.toString(), icon: CheckCircle, color: 'text-blue-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50 flex items-center space-x-6 transition hover:shadow-lg">
            <div className={`p-4 rounded-2xl bg-slate-50 ${stat.color}`}><stat.icon className="w-7 h-7" /></div>
            <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p><p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p></div>
          </div>
        ))}
      </div>
    </main>
  );
};

const DriverDashboard: React.FC = () => {
  const { currentUser, logout, refreshUser } = useApp();
  const driver = currentUser as Driver;
  const [isOnline, setIsOnline] = useState(driver?.isOnline || false);
  const [activeRequest, setActiveRequest] = useState<RideRequest | null>(null);

  const toggleOnline = async () => {
    const newState = !isOnline;
    setIsOnline(newState);
    await db.users.update(driver.id, { isOnline: newState });
    await refreshUser();
  };

  // Poll for ride requests when online
  useEffect(() => {
    if (!isOnline || activeRequest) return;
    const interval = setInterval(async () => {
      const available = await db.rides.getAvailableForDriver(driver.vehicleType);
      if (available.length > 0) setActiveRequest(available[0]);
    }, 5000);
    return () => clearInterval(interval);
  }, [isOnline, activeRequest, driver.vehicleType]);

  const handleRideAction = async (status: RideStatus) => {
    if (!activeRequest) return;
    await db.rides.updateStatus(activeRequest.id, status, driver.id);
    const updated = (await db.rides.getAll()).find(r => r.id === activeRequest.id);
    if (updated) {
      setActiveRequest(updated);
      if (status === RideStatus.COMPLETED) {
        setActiveRequest(null);
        refreshUser();
      }
    }
  };

  if (!driver) return null;

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      <div className="w-20 md:w-72 bg-slate-900 text-white flex flex-col p-6 space-y-12 shrink-0">
        <div className="flex items-center justify-center md:justify-start space-x-3"><div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"><Car className="text-white" /></div><span className="hidden md:block font-black text-lg tracking-tighter uppercase">SPEEDRIDE</span></div>
        <nav className="flex-1 space-y-4">
          <NavLink to="/driver" className="flex items-center space-x-4 p-4 rounded-2xl bg-white/10 text-blue-400"><Activity /><span className="hidden md:block font-black text-xs uppercase tracking-widest">Dashboard</span></NavLink>
        </nav>
        <button onClick={logout} className="flex items-center space-x-4 p-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition"><LogOut /><span className="hidden md:block font-black text-xs uppercase tracking-widest">Sign Out</span></button>
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0">
           <div className="flex items-center space-x-4"><div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} /><span className="font-black text-[10px] uppercase tracking-widest text-slate-500">{isOnline ? 'Online' : 'Offline'}</span></div>
           <div className="flex items-center space-x-6"><Bell className="text-slate-300" /><img src={driver.avatar} className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100" /></div>
        </header>

        <DriverOverview driver={driver} isOnline={isOnline} toggleOnline={toggleOnline} />

        {activeRequest && (
          <div className="fixed bottom-10 right-10 w-full max-w-[440px] bg-slate-900 text-white rounded-[40px] shadow-2xl p-8 border border-white/10 animate-in slide-in-from-bottom-20 z-[200]">
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2 text-blue-400"><Car className="w-5 h-5" /><span className="text-[10px] font-black uppercase tracking-widest">Live Trip Feed</span></div>
                <div className="text-[10px] font-black text-slate-500 px-3 py-1 bg-white/5 rounded-full">{activeRequest.status}</div>
             </div>
             
             <div className="space-y-6 mb-8">
                <div className="flex justify-between items-end">
                   <div><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Estimated Fare</p><p className="text-3xl font-black text-white">₦{activeRequest.fare.toLocaleString()}</p></div>
                   <div className="text-right"><p className="text-xs font-black text-slate-400">{activeRequest.distance} KM Trip</p></div>
                </div>
                <div className="space-y-4 px-2">
                   <div className="flex items-start space-x-4"><MapPin className="text-emerald-500 w-4 h-4 mt-1" /><p className="text-sm font-bold opacity-80">{activeRequest.pickup}</p></div>
                   <div className="flex items-start space-x-4"><Navigation className="text-blue-500 w-4 h-4 mt-1" /><p className="text-sm font-bold opacity-80">{activeRequest.dropoff}</p></div>
                </div>
             </div>

             <div className="flex gap-4">
                {activeRequest.status === RideStatus.REQUESTED && (
                  <>
                    <button onClick={() => setActiveRequest(null)} className="flex-1 py-4 bg-white/5 rounded-2xl font-black text-slate-400 text-xs">Ignore</button>
                    <button onClick={() => handleRideAction(RideStatus.ACCEPTED)} className="flex-1 py-4 bg-blue-600 rounded-2xl font-black text-xs shadow-xl shadow-blue-600/20">Accept Trip</button>
                  </>
                )}
                {activeRequest.status === RideStatus.ACCEPTED && <button onClick={() => handleRideAction(RideStatus.ARRIVING)} className="w-full py-5 bg-amber-500 rounded-2xl font-black text-xs uppercase">I Have Arrived</button>}
                {activeRequest.status === RideStatus.ARRIVING && <button onClick={() => handleRideAction(RideStatus.IN_PROGRESS)} className="w-full py-5 bg-blue-600 rounded-2xl font-black text-xs uppercase">Start Journey</button>}
                {activeRequest.status === RideStatus.IN_PROGRESS && <button onClick={() => handleRideAction(RideStatus.COMPLETED)} className="w-full py-5 bg-emerald-600 rounded-2xl font-black text-xs uppercase">End Journey</button>}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
