
import React, { useState } from 'react';
import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  MapPin, Navigation, History, Wallet, LogOut,
  Car, Zap, Phone, User as UserIcon, CheckCircle, ChevronRight
} from 'lucide-react';
import { useApp } from '../App';
import { RideStatus, VehicleType } from '../types';
import Logo from '../components/Logo';

const RiderExplore: React.FC<{ 
  pickup: string, setPickup: (v: string) => void, 
  dropoff: string, setDropoff: (v: string) => void 
}> = ({ pickup, setPickup, dropoff, setDropoff }) => {
  const [rideStep, setRideStep] = useState<'INPUT' | 'SELECTION' | 'MATCHING' | 'ON_RIDE'>('INPUT');
  const [selectedType] = useState<VehicleType>(VehicleType.ECONOMY);

  const confirmRide = () => {
    setRideStep('MATCHING');
    setTimeout(() => setRideStep('ON_RIDE'), 4000);
  };

  return (
    <div className="h-full relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[#f1f5f9] overflow-hidden">
        <svg className="w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
          {[...Array(20)].map((_, i) => <path key={i} d={`M0 ${i*10} L100 ${i*10} M${i*10} 0 L${i*10} 100`} stroke="black" strokeWidth="0.1" />)}
        </svg>
        {pickup && (
          <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 animate-fade-up">
            <div className="pulse-marker relative w-10 h-10 flex items-center justify-center">
              <MapPin className="text-blue-600 w-10 h-10 drop-shadow-2xl animate-bounce" />
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-10 left-10 right-10 max-w-2xl mx-auto bg-white rounded-[60px] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.25)] overflow-hidden border border-white p-2 animate-fade-up">
        <div className="bg-slate-50 p-10 rounded-[58px]">
          {rideStep === 'MATCHING' ? (
            <div className="py-24 flex flex-col items-center justify-center space-y-12 animate-in fade-in duration-700">
              <div className="relative flex items-center justify-center w-64 h-64">
                <div className="absolute inset-0 border-2 border-blue-600/10 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 rounded-full overflow-hidden opacity-40"><div className="radar-scanner"></div></div>
                <div className="relative w-32 h-32 bg-slate-900 rounded-[40px] flex items-center justify-center shadow-2xl z-10 animate-bounce group overflow-hidden">
                  <Logo className="h-20 w-auto brightness-0 invert" />
                </div>
              </div>
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter shimmer-text">Matching Fleet...</h3>
            </div>
          ) : rideStep === 'ON_RIDE' ? (
            <div className="text-center py-10 animate-in zoom-in duration-500">
               <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" />
               <h3 className="text-2xl font-black">Driver Assigned!</h3>
               <p className="text-slate-500 font-bold mb-6">Tesla Model S (SR-2026) is 3 mins away.</p>
               <button onClick={() => setRideStep('INPUT')} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black">Book Another</button>
            </div>
          ) : (
            <div className="space-y-10">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                {rideStep === 'INPUT' ? 'Your 2026 destination?' : 'Confirm your ride'}
              </h3>
              {rideStep === 'INPUT' ? (
                <div className="space-y-4">
                  <input placeholder="Current Location" value={pickup} onChange={e => setPickup(e.target.value)} className="w-full pl-10 pr-8 py-6 bg-white rounded-[28px] border-2 border-transparent shadow-sm font-bold text-slate-900 outline-none focus:border-blue-600 transition-all" />
                  <input placeholder="Where to?" value={dropoff} onChange={e => setDropoff(e.target.value)} className="w-full pl-10 pr-8 py-6 bg-white rounded-[28px] border-2 border-transparent shadow-sm font-bold text-slate-900 outline-none focus:border-blue-600 transition-all" />
                  <button onClick={() => setRideStep('SELECTION')} className="w-full bg-slate-900 text-white font-black py-6 rounded-[32px] hover:bg-blue-600 active:scale-95 transition-all shadow-2xl">Search Nearby 2026 Fleet</button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-6 bg-white rounded-3xl border-2 border-blue-600 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Zap className="text-blue-600 w-8 h-8" />
                      <div><p className="font-black">SpeedRide Premium</p><p className="text-xs text-slate-400 font-bold">Tesla Elite Fleet</p></div>
                    </div>
                    <p className="text-xl font-black">₦4,200</p>
                  </div>
                  <button onClick={confirmRide} className="w-full bg-blue-600 text-white font-black py-6 rounded-[32px] hover:bg-blue-700 active:scale-95 transition-all shadow-2xl">Confirm Booking</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RiderHistory: React.FC = () => (
  <div className="p-12 space-y-8 animate-in fade-in slide-in-from-right-10 duration-500 overflow-y-auto h-full">
    <h2 className="text-4xl font-black tracking-tight text-slate-900">Past Journeys</h2>
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 flex items-center justify-between hover:shadow-xl transition-all group">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
              <History className="text-slate-400 group-hover:text-blue-600 w-8 h-8" />
            </div>
            <div>
              <p className="font-black text-slate-900 text-lg">Trip to Victoria Island</p>
              <p className="text-xs text-slate-400 font-bold">Oct 12, 2026 • 14:20 PM</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-black text-slate-900">₦3,450.00</p>
            <p className="text-[10px] font-black uppercase text-green-500 tracking-widest">Completed</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const RiderWallet: React.FC = () => (
  <div className="p-12 space-y-12 animate-in fade-in slide-in-from-right-10 duration-500 overflow-y-auto h-full">
    <h2 className="text-4xl font-black tracking-tight text-slate-900">Financial Hub</h2>
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-slate-900 p-10 rounded-[50px] text-white relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
        <p className="text-xs font-black uppercase tracking-[0.3em] opacity-60 mb-2">Available Credits</p>
        <p className="text-5xl font-black mb-10">₦15,500.25</p>
        <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black hover:bg-blue-600 hover:text-white transition-all">Top Up Balance</button>
      </div>
      <div className="bg-white p-10 rounded-[50px] border border-slate-100 flex flex-col justify-center">
         <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Primary Method</p>
         <div className="flex items-center space-x-4">
           <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center font-black text-[10px]">VISA</div>
           <p className="font-black text-xl text-slate-900">**** 4422</p>
         </div>
      </div>
    </div>
  </div>
);

const RiderDashboard: React.FC = () => {
  const { logout } = useApp();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');

  const navItems = [
    { to: '/rider', icon: Navigation, label: 'Explore', end: true },
    { to: '/rider/history', icon: History, label: 'Past Trips' },
    { to: '/rider/wallet', icon: Wallet, label: 'Finance' },
    { to: '/rider/profile', icon: UserIcon, label: 'Account' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* PERSISTENT SIDEBAR */}
      <div className="w-24 md:w-80 bg-white border-r border-slate-100 flex flex-col items-center py-12 shrink-0">
        <div className="mb-12 px-6 w-full flex justify-center">
          <Logo className="h-20 w-auto" />
        </div>
        <nav className="flex-1 flex flex-col space-y-4 w-full px-6">
          {navItems.map((item) => (
            <NavLink 
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `
                flex items-center space-x-5 p-5 rounded-[24px] transition-all group active:scale-95
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-[0_15px_30px_-10px_rgba(59,130,246,0.4)]' 
                  : 'text-slate-400 hover:bg-blue-50 hover:text-blue-600'}
              `}
            >
              <item.icon className="w-6 h-6 shrink-0 transition-transform group-hover:scale-110" />
              <span className="hidden md:block font-black uppercase tracking-[0.2em] text-[10px]">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto px-6 w-full space-y-6 text-center">
           <button onClick={logout} className="flex items-center justify-center space-x-4 w-full p-5 rounded-2xl text-red-400 hover:bg-red-50 transition font-black text-[10px] uppercase tracking-widest">
             <LogOut className="w-5 h-5" />
             <span className="hidden md:block">Sign Out</span>
           </button>
           <a href="https://www.premegagetech.com" target="_blank" rel="noopener noreferrer" className="block text-[8px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-blue-600 transition">
            Premegage Tech
           </a>
        </div>
      </div>

      {/* SEPARATE PAGES RENDERED HERE */}
      <div className="flex-1 relative overflow-hidden bg-white">
        <Routes>
          <Route path="/" element={<RiderExplore pickup={pickup} setPickup={setPickup} dropoff={dropoff} setDropoff={setDropoff} />} />
          <Route path="/history" element={<RiderHistory />} />
          <Route path="/wallet" element={<RiderWallet />} />
          <Route path="/profile" element={<div className="p-12"><h2 className="text-4xl font-black">Account Settings</h2></div>} />
        </Routes>
      </div>
    </div>
  );
};

export default RiderDashboard;
