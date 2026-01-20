
import React, { useState, useEffect } from 'react';
import { 
  MapPin, Search, Navigation, CreditCard, Clock, 
  ChevronRight, Star, Settings, History, Wallet, LogOut,
  Car, Shield, Zap, X, Phone, User as UserIcon, Camera,
  CheckCircle
} from 'lucide-react';
import { useApp } from '../App';
import { RideStatus, VehicleType } from '../types';
import Logo from '../components/Logo';

type RiderView = 'HOME' | 'HISTORY' | 'WALLET' | 'PROFILE';

const RiderDashboard: React.FC = () => {
  const { currentUser, logout } = useApp();
  const [currentView, setCurrentView] = useState<RiderView>('HOME');
  
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [rideStep, setRideStep] = useState<'INPUT' | 'SELECTION' | 'MATCHING' | 'ON_RIDE'>('INPUT');
  const [selectedType, setSelectedType] = useState<VehicleType>(VehicleType.ECONOMY);
  const [activeRide, setActiveRide] = useState<any>(null);

  const handleBooking = () => {
    if (!pickup || !dropoff) return;
    setRideStep('SELECTION');
  };

  const confirmRide = () => {
    setRideStep('MATCHING');
    setTimeout(() => {
      const newRide = {
        id: 'r-' + Math.random().toString(36).substr(2, 9),
        pickup,
        dropoff,
        vehicleType: selectedType,
        status: RideStatus.ACCEPTED,
        driver: {
          name: 'Sarah Miller',
          avatar: 'https://picsum.photos/seed/sarah/200',
          rating: 4.9,
          vehicleModel: 'Tesla Model 3',
          plateNumber: 'SR-777-2026'
        },
        eta: '4 mins'
      };
      setActiveRide(newRide);
      setRideStep('ON_RIDE');
    }, 5000);
  };

  const cancelRequest = () => {
    setRideStep('INPUT');
    setActiveRide(null);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <div className="w-24 md:w-80 bg-white border-r border-slate-100 flex flex-col items-center py-12 shrink-0 animate-fade-up">
        <div className="mb-12 px-6 w-full flex justify-center">
          <div className="bg-white p-2 rounded-2xl shadow-sm hover:scale-105 transition-transform cursor-pointer">
            <Logo className="h-20 w-auto" />
          </div>
        </div>
        <nav className="flex-1 flex flex-col space-y-6 w-full px-6">
          {[
            { id: 'HOME', icon: Navigation, label: 'Explore' },
            { id: 'HISTORY', icon: History, label: 'Past Trips' },
            { id: 'WALLET', icon: Wallet, label: 'Finance' },
            { id: 'PROFILE', icon: UserIcon, label: 'Account' },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setCurrentView(item.id as any)}
              className={`flex items-center space-x-5 p-5 rounded-[24px] transition-all group active:scale-95 ${currentView === item.id ? 'bg-blue-600 text-white shadow-[0_15px_30px_-10px_rgba(59,130,246,0.4)]' : 'text-slate-400 hover:bg-blue-50 hover:text-blue-600'}`}
            >
              <item.icon className={`w-6 h-6 shrink-0 transition-transform ${currentView === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="hidden md:block font-black uppercase tracking-[0.2em] text-[10px]">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto px-6 w-full text-center pb-6">
           <a 
            href="https://www.premegagetech.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-blue-600 transition"
           >
            Premegage Tech
           </a>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <div className="h-full relative overflow-hidden bg-white">
          <div className="absolute inset-0 bg-[#f1f5f9] overflow-hidden">
             <svg className="w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
               {[...Array(20)].map((_, i) => <path key={i} d={`M0 ${i*10} L100 ${i*10} M${i*10} 0 L${i*10} 100`} stroke="black" strokeWidth="0.1" />)}
             </svg>
             {pickup && (
               <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 animate-fade-up">
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
                     <div className="absolute inset-8 border-2 border-blue-600/20 rounded-full animate-pulse stagger-1"></div>
                     <div className="absolute inset-16 border-2 border-blue-600/30 rounded-full animate-pulse stagger-2"></div>
                     <div className="absolute inset-0 rounded-full overflow-hidden opacity-40">
                        <div className="radar-scanner"></div>
                     </div>
                     <div className="relative w-32 h-32 bg-slate-900 rounded-[40px] flex items-center justify-center shadow-2xl z-10 animate-bounce group overflow-hidden">
                        <Logo className="h-20 w-auto brightness-0 invert" />
                     </div>
                  </div>
                  <div className="text-center space-y-4">
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter shimmer-text">Matching Fleet...</h3>
                    <p className="text-slate-500 font-bold max-w-xs mx-auto">AI is optimizing route and matching you with a 5-star partner.</p>
                  </div>
                  <button onClick={cancelRequest} className="text-red-500 font-black hover:bg-red-50 px-10 py-4 rounded-2xl transition-all hover:scale-105 active:scale-95">Cancel Request</button>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
                  {rideStep === 'INPUT' && (
                    <div className="space-y-10">
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight">Your 2026 destination?</h3>
                      <div className="space-y-4">
                        <input 
                          placeholder="Current Location" 
                          value={pickup} onChange={e => setPickup(e.target.value)}
                          className="w-full pl-10 pr-8 py-6 bg-white rounded-[28px] border-2 border-transparent shadow-sm font-bold text-slate-900 outline-none focus:border-blue-600 transition-all hover:scale-[1.01]" 
                        />
                        <input 
                          placeholder="Where to?" 
                          value={dropoff} onChange={e => setDropoff(e.target.value)}
                          className="w-full pl-10 pr-8 py-6 bg-white rounded-[28px] border-2 border-transparent shadow-sm font-bold text-slate-900 outline-none focus:border-blue-600 transition-all hover:scale-[1.01]" 
                        />
                      </div>
                      <button onClick={handleBooking} className="w-full bg-slate-900 text-white font-black py-6 rounded-[32px] hover:bg-blue-600 active:scale-95 transition-all shadow-2xl">Search Nearby 2026 Fleet</button>
                    </div>
                  )}
                  {rideStep === 'SELECTION' && (
                    <div className="space-y-8">
                       <h3 className="text-3xl font-black text-slate-900">Confirm Class</h3>
                       <button onClick={confirmRide} className="w-full bg-blue-600 text-white font-black py-6 rounded-[32px] hover:bg-blue-700 active:scale-95 transition-all shadow-2xl shadow-blue-200">Book Now</button>
                    </div>
                  )}
                  {rideStep === 'ON_RIDE' && (
                    <div className="text-center py-10">
                       <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" />
                       <h3 className="text-2xl font-black">Driver Assigned!</h3>
                       <button onClick={() => setRideStep('INPUT')} className="mt-6 text-blue-600 font-bold">New Booking</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;
