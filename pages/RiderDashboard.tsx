
import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { 
  MapPin, Navigation, History, Wallet, LogOut, Car, Zap, CheckCircle, 
  ChevronRight, Search, Locate, Users, Clock, Shield, Bell, ChevronDown, Menu, ChevronUp, Loader2, Plus, X, CreditCard, DollarSign
} from 'lucide-react';
import { useApp } from '../App';
import { RideStatus, VehicleType, RideRequest } from '../types';
import { db } from '../database';

// Replace with your BudPay Public Key from Dashboard
const BUDPAY_PUBLIC_KEY = "pk_test_j6j1h6h1h6h1h6h1h6h1h6h1h6h1"; 

const MINNA_COORDS = { lat: 9.6139, lng: 6.5569 };

const TopUpModal: React.FC<{ isOpen: boolean, onClose: () => void, onFunded: () => void }> = ({ isOpen, onClose, onFunded }) => {
  const { currentUser, showToast } = useApp();
  const [amount, setAmount] = useState('');
  const [isFunding, setIsFunding] = useState(false);

  const handleFundWithBudPay = async () => {
    const val = parseFloat(amount);
    if (!val || val < 100) {
      showToast("Minimum top-up is ₦100", "error");
      return;
    }

    setIsFunding(true);

    try {
      // BudPay Checkout Initialization
      const reference = `SR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      const checkout = (window as any).BudPayCheckout({
        key: BUDPAY_PUBLIC_KEY,
        email: currentUser?.email,
        amount: val,
        currency: "NGN",
        reference: reference,
        firstName: currentUser?.name.split(' ')[0] || "User",
        lastName: currentUser?.name.split(' ')[1] || "SpeedRide",
        metadata: {
          user_id: currentUser?.id,
          purpose: "Wallet Funding"
        },
        callback: async (response: any) => {
          // On successful payment signal from BudPay
          if (response.status === 'success') {
            try {
              await db.users.fundWallet(currentUser!.id, val);
              showToast(`₦${val.toLocaleString()} successfully provisioned to your wallet`, "success");
              onFunded();
              onClose();
            } catch (e) {
              showToast("System failed to update balance. Contact support with ref: " + reference, "error");
            }
          } else {
            showToast("Payment was not successful", "error");
          }
          setIsFunding(false);
        },
        onClose: () => {
          showToast("Payment window closed", "info");
          setIsFunding(false);
        }
      });
    } catch (e) {
      showToast("Failed to initialize gateway", "error");
      setIsFunding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl relative z-10 p-10 animate-in zoom-in-95 duration-300 border border-white">
        <button onClick={onClose} className="absolute right-6 top-6 p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-900 transition"><X className="w-5 h-5" /></button>
        <div className="text-center space-y-4 mb-10">
           <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm"><CreditCard className="w-8 h-8" /></div>
           <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Fund via BudPay</h3>
           <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">Secure Multi-Channel Payment <br/> via SpeedRide Ledger</p>
        </div>

        <div className="space-y-6">
           <div className="relative group">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300 group-focus-within:text-blue-600">₦</span>
              <input 
                type="number" value={amount} onChange={e => setAmount(e.target.value)} 
                placeholder="0.00" 
                className="w-full bg-slate-50 border border-slate-100 rounded-[28px] py-6 pl-12 pr-6 text-2xl font-black outline-none focus:ring-4 focus:ring-blue-500/5 transition"
              />
           </div>

           <div className="grid grid-cols-3 gap-3">
              {[2000, 5000, 10000].map(val => (
                <button key={val} onClick={() => setAmount(val.toString())} className="py-3 bg-slate-50 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-blue-600 hover:text-white transition shadow-sm">
                  + ₦{val.toLocaleString()}
                </button>
              ))}
           </div>

           <button 
             disabled={isFunding} onClick={handleFundWithBudPay}
             className="w-full py-6 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-blue-600 transition shadow-2xl shadow-blue-500/20 active:scale-95 disabled:opacity-50 disabled:scale-100"
           >
             {isFunding ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Zap className="w-5 h-5 text-yellow-400" /><span>Initialize Payment</span></>}
           </button>
           
           <p className="text-[9px] text-center font-bold text-slate-400 uppercase tracking-widest">
             Payments processed securely by BudPay Infrastructure
           </p>
        </div>
      </div>
    </div>
  );
};

const RiderExplore: React.FC<{ onOpenTopUp: () => void }> = ({ onOpenTopUp }) => {
  const { currentUser, refreshUser, showToast } = useApp();
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [pickup, setPickup] = useState('Abuja Tech Hub, Wuse 2');
  const [dropoff, setDropoff] = useState('Nnamdi Azikiwe Airport');
  const [selectedType, setSelectedType] = useState<VehicleType>(VehicleType.ECONOMY);
  const [isBooking, setIsBooking] = useState(false);
  const [activeRide, setActiveRide] = useState<RideRequest | null>(null);

  const calculateFare = (type: VehicleType) => {
    const base = type === VehicleType.ECONOMY ? 1200 : type === VehicleType.PREMIUM ? 3500 : 5000;
    return base + 4500; // Simulated distance fare
  };

  const handleBook = async () => {
    if (!currentUser) return;
    setIsBooking(true);
    try {
      const fare = calculateFare(selectedType);
      if (currentUser.balance < fare) {
        showToast("Insufficient Balance. Fund your wallet to proceed.", "error");
        onOpenTopUp();
        setIsBooking(false);
        return;
      }

      const ride = await db.rides.create({
        riderId: currentUser.id,
        pickup,
        dropoff,
        fare,
        vehicleType: selectedType,
        distance: 12.5,
      });
      setActiveRide(ride);
      showToast("Journey initiated. Searching fleet...", "success");
    } catch (e: any) {
      showToast(e.message, "error");
    } finally {
      setIsBooking(false);
    }
  };

  // Poll for ride status updates
  useEffect(() => {
    if (!activeRide) return;
    const interval = setInterval(async () => {
      const allRides = await db.rides.getAll();
      const updated = allRides.find(r => r.id === activeRide.id);
      if (updated) {
        setActiveRide(updated);
        if (updated.status === RideStatus.COMPLETED) {
          clearInterval(interval);
          refreshUser();
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [activeRide, refreshUser]);

  return (
    <div className="flex h-full w-full bg-slate-50 relative flex-col lg:flex-row">
      <div className={`${isFormVisible ? 'translate-y-0 h-[70%] lg:h-full' : 'translate-y-full lg:translate-y-0 h-0 lg:w-[450px]'} transition-all duration-500 fixed lg:static bottom-0 left-0 w-full lg:w-[450px] bg-white border-r border-slate-100 shadow-2xl z-50 overflow-y-auto p-6 md:p-10 flex flex-col`}>
        {activeRide ? (
          <div className="space-y-8 animate-in fade-in zoom-in duration-500">
             <div className="bg-blue-600 p-8 rounded-[40px] text-white text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-60">Journey Node Active</p>
                <h3 className="text-3xl font-black mb-2">{activeRide.status}</h3>
                <p className="font-bold opacity-80">R-#{activeRide.id.slice(-4).toUpperCase()}</p>
             </div>
             
             <div className="space-y-6">
                <div className="flex items-center space-x-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm"><Car className="text-blue-600" /></div>
                   <div><p className="text-xs font-black text-slate-400 uppercase tracking-widest">Driver Telemetry</p><p className="font-black text-slate-900">{activeRide.driverId ? "Driver Assigned" : "Searching Fleet..."}</p></div>
                </div>
                <div className="space-y-4 px-2">
                   <div className="flex items-start space-x-3"><div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" /><div><p className="text-[10px] font-black uppercase text-slate-400">Pickup</p><p className="text-sm font-bold text-slate-900">{activeRide.pickup}</p></div></div>
                   <div className="flex items-start space-x-3"><div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" /><div><p className="text-[10px] font-black uppercase text-slate-400">Destination</p><p className="text-sm font-bold text-slate-900">{activeRide.dropoff}</p></div></div>
                </div>
             </div>

             {activeRide.status === RideStatus.COMPLETED && (
               <button onClick={() => setActiveRide(null)} className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest">Book New Journey</button>
             )}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-end">
               <h2 className="text-3xl font-black text-slate-900 tracking-tight">Request a Ride</h2>
               <div className="flex items-center space-x-2 text-blue-600 mb-1">
                  <Shield className="w-4 h-4" />
                  <span className="text-[9px] font-black uppercase tracking-widest">SpeedSafe Protected</span>
               </div>
            </div>
            
            {currentUser?.balance === 0 && (
               <div className="bg-amber-50 border border-amber-100 p-6 rounded-[32px] flex items-start space-x-4 animate-pulse">
                  <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-lg"><Wallet className="w-5 h-5" /></div>
                  <div>
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Empty Wallet</p>
                    <p className="text-xs font-bold text-slate-600 leading-relaxed">Fund your account to start requesting rides from the SpeedRide fleet.</p>
                  </div>
               </div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                 <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-600 w-5 h-5 group-focus-within:scale-110 transition" />
                 <input value={pickup} onChange={e => setPickup(e.target.value)} placeholder="Pickup Location" className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[24px] font-bold text-sm outline-none focus:ring-4 focus:ring-blue-500/5 transition" />
              </div>
              <div className="relative group">
                 <Navigation className="absolute left-5 top-1/2 -translate-y-1/2 text-red-500 w-5 h-5" />
                 <input value={dropoff} onChange={e => setDropoff(e.target.value)} placeholder="Where to?" className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[24px] font-bold text-sm outline-none focus:ring-4 focus:ring-red-500/5 transition" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[VehicleType.ECONOMY, VehicleType.PREMIUM, VehicleType.XL].map(type => (
                <button key={type} onClick={() => setSelectedType(type)} className={`p-4 rounded-[28px] border-2 transition-all flex flex-col items-center justify-center ${selectedType === type ? 'border-blue-600 bg-blue-50 shadow-xl shadow-blue-500/10' : 'border-slate-50 bg-white hover:border-slate-200'}`}>
                  <Car className={`w-8 h-8 mb-2 ${selectedType === type ? 'text-blue-600' : 'text-slate-300'}`} />
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{type}</p>
                  <p className="text-xs font-black text-slate-900 mt-1">₦{calculateFare(type).toLocaleString()}</p>
                </button>
              ))}
            </div>

            <button disabled={isBooking} onClick={handleBook} className="w-full py-6 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-slate-300 flex items-center justify-center space-x-3">
              {isBooking ? <><Loader2 className="w-5 h-5 animate-spin" /><span>Syncing Fleet...</span></> : <span>Confirm Booking</span>}
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 relative bg-slate-200 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80')] bg-cover opacity-60 grayscale-[0.5]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-blue-500/20 pointer-events-none">
           <div className="radar-scanner" />
        </div>
      </div>
    </div>
  );
};

const RiderDashboard: React.FC = () => {
  const { logout, currentUser, refreshUser } = useApp();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-white">
      <TopUpModal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} onFunded={refreshUser} />

      <header className="h-20 bg-slate-900 text-white flex items-center justify-between px-6 md:px-10 z-50 shrink-0">
        <div className="flex items-center space-x-6">
          <button onClick={() => setIsNavOpen(!isNavOpen)} className="lg:hidden p-2 text-white/60 hover:text-white transition"><Menu className="w-6 h-6" /></button>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"><Car className="w-6 h-6 text-white" /></div>
            <span className="font-black text-xl tracking-tighter hidden sm:block uppercase">SPEEDRIDE</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
           <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest opacity-60">Neural Wallet</p>
              <p className={`text-xl font-black ${currentUser?.balance === 0 ? 'text-amber-400' : 'text-white'}`}>₦{currentUser?.balance.toLocaleString()}</p>
           </div>
           <button 
             onClick={() => setIsTopUpOpen(true)}
             className="bg-blue-600 text-white p-2.5 rounded-2xl hover:scale-105 active:scale-95 transition shadow-lg shadow-blue-500/20 flex items-center space-x-2"
           >
             <Plus className="w-5 h-5" />
             <span className="hidden md:block text-[10px] font-black uppercase tracking-widest">Top Up</span>
           </button>
           <div className="flex items-center space-x-3 border-l border-white/10 pl-6">
              <img src={currentUser?.avatar} className="w-11 h-11 rounded-2xl object-cover ring-2 ring-white/10 shadow-xl" />
              <button onClick={logout} className="p-3 bg-white/5 rounded-2xl hover:bg-red-500/20 hover:text-red-400 transition"><LogOut className="w-5 h-5" /></button>
           </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route index element={<RiderExplore onOpenTopUp={() => setIsTopUpOpen(true)} />} />
          <Route path="*" element={<div className="p-20 text-center font-black text-slate-300">Section Provisioning...</div>} />
        </Routes>
      </div>
    </div>
  );
};

export default RiderDashboard;
