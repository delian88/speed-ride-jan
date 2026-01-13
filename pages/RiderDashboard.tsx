
import React, { useState, useEffect } from 'react';
import { 
  MapPin, Search, Navigation, CreditCard, Clock, 
  ChevronRight, Star, Settings, History, Wallet, LogOut,
  Car, Shield, Zap, X, Phone, User as UserIcon, Camera
} from 'lucide-react';
import { useApp } from '../App';
import { RideStatus, VehicleType } from '../types';

type RiderView = 'HOME' | 'HISTORY' | 'WALLET' | 'PROFILE';

const RiderDashboard: React.FC = () => {
  const { currentUser, logout } = useApp();
  const [currentView, setCurrentView] = useState<RiderView>('HOME');
  
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [rideStep, setRideStep] = useState<'INPUT' | 'SELECTION' | 'MATCHING' | 'ON_RIDE'>('INPUT');
  const [selectedType, setSelectedType] = useState<VehicleType>(VehicleType.ECONOMY);
  const [activeRide, setActiveRide] = useState<any>(null);

  // Profile States
  const [userName, setUserName] = useState(currentUser?.name || '');
  const [userPhone, setUserPhone] = useState(currentUser?.phone || '');

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
    }, 3000);
  };

  const cancelRequest = () => {
    setRideStep('INPUT');
    setActiveRide(null);
  };

  const renderProfileView = () => (
    <div className="p-10 space-y-10 animate-fade-up">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Profile 2026</h2>
        <button onClick={() => setCurrentView('HOME')} className="p-3 bg-slate-100 rounded-2xl hover:bg-slate-200 hover:rotate-90 transition-all">
          <X className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        <div className="space-y-8 w-full md:w-1/3">
          <div className="relative group mx-auto w-48 h-48">
            <img src={currentUser?.avatar} className="w-48 h-48 rounded-full object-cover border-8 border-white shadow-2xl group-hover:scale-105 transition-transform" alt="avatar" />
            <button className="absolute bottom-2 right-2 p-4 bg-blue-600 text-white rounded-full shadow-2xl hover:bg-blue-700 hover:scale-110 active:scale-90 transition-all">
              <Camera className="w-6 h-6" />
            </button>
          </div>
          <div className="text-center space-y-2">
            <p className="text-2xl font-black text-slate-900">{userName}</p>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Member since 2026</p>
          </div>
        </div>

        <div className="flex-1 space-y-10 bg-white p-10 rounded-[48px] shadow-sm border border-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Full Name</label>
              <input 
                type="text" value={userName} onChange={e => setUserName(e.target.value)}
                className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-[24px] font-bold outline-none focus:border-blue-600 focus:bg-white transition-all" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Phone Number</label>
              <input 
                type="tel" value={userPhone} onChange={e => setUserPhone(e.target.value)}
                className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-[24px] font-bold outline-none focus:border-blue-600 focus:bg-white transition-all" 
              />
            </div>
          </div>
          <div className="space-y-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Secure Payments</p>
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px] border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer group">
               <div className="flex items-center space-x-6">
                  <div className="bg-slate-900 p-3 rounded-xl text-white font-black text-xs shadow-lg group-hover:scale-110 transition-transform">VISA</div>
                  <p className="font-black text-slate-700 tracking-wider">**** **** **** 2026</p>
               </div>
               <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">Edit</button>
            </div>
            <button className="flex items-center space-x-3 text-blue-600 font-black hover:scale-105 transition-transform ml-2">
              <Zap className="w-5 h-5 fill-current" /> <span>Link 2026 Digital Wallet</span>
            </button>
          </div>
          <button className="w-full bg-slate-900 text-white font-black py-6 rounded-[32px] hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-slate-200">
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-24 md:w-80 bg-white border-r border-slate-100 flex flex-col items-center py-12 shrink-0 animate-fade-up">
        <div className="mb-20">
          <div className="bg-blue-600 p-2.5 rounded-2xl shadow-xl shadow-blue-100 hover:rotate-12 transition-transform cursor-pointer">
            <Zap className="h-8 w-8 text-white fill-current" />
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
              className={`flex items-center space-x-5 p-5 rounded-[24px] transition-all group ${currentView === item.id ? 'bg-blue-600 text-white shadow-[0_15px_30px_-10px_rgba(59,130,246,0.4)]' : 'text-slate-400 hover:bg-blue-50 hover:text-blue-600'}`}
            >
              <item.icon className={`w-6 h-6 shrink-0 transition-transform ${currentView === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="hidden md:block font-black uppercase tracking-[0.2em] text-[10px]">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto px-6 w-full space-y-8 text-center">
          <p className="hidden md:block text-[8px] font-black text-slate-300 uppercase tracking-[0.4em]">Powered by Premegage Tech</p>
          <button onClick={logout} className="flex items-center justify-center space-x-4 w-full p-5 rounded-[24px] text-red-400 hover:bg-red-50 transition-all group">
            <LogOut className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden md:block font-black uppercase tracking-[0.2em] text-[10px]">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden">
        {currentView === 'PROFILE' ? renderProfileView() : (
          <div className="h-full relative overflow-hidden bg-white">
            {/* Map Simulation */}
            <div className="absolute inset-0 bg-[#f1f5f9] overflow-hidden">
               <svg className="w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
                 {[...Array(20)].map((_, i) => <path key={i} d={`M0 ${i*10} L100 ${i*10} M${i*10} 0 L${i*10} 100`} stroke="black" strokeWidth="0.1" />)}
               </svg>
               {pickup && (
                 <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 animate-fade-up">
                    <div className="pulse-marker relative w-10 h-10 flex items-center justify-center">
                      <MapPin className="text-blue-600 w-10 h-10 drop-shadow-2xl" />
                    </div>
                 </div>
               )}
               {dropoff && (
                 <div className="absolute top-1/4 right-1/4 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 animate-fade-up">
                    <MapPin className="text-red-600 w-10 h-10 drop-shadow-2xl" />
                 </div>
               )}
            </div>

            {/* Float HUD Top Bar */}
            <div className="absolute top-10 left-10 right-10 flex justify-between items-center pointer-events-none animate-fade-up">
              <div 
                onClick={() => setCurrentView('PROFILE')}
                className="glass p-5 rounded-[32px] border border-white flex items-center space-x-5 pointer-events-auto cursor-pointer hover:bg-white transition-all shadow-2xl shadow-slate-200 group active:scale-95"
              >
                <img src={currentUser?.avatar} className="w-14 h-14 rounded-full border-4 border-blue-600 p-0.5 group-hover:scale-110 transition-transform" alt="profile" />
                <div>
                  <p className="font-black text-slate-900 leading-none mb-1 text-lg">{currentUser?.name}</p>
                  <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest flex items-center">
                    <Star className="w-3 h-3 fill-current mr-1" /> {currentUser?.rating} • ELITE TIER
                  </p>
                </div>
              </div>
              <div className="glass p-6 rounded-[32px] border border-white pointer-events-auto shadow-2xl shadow-slate-200 text-right group hover:scale-105 transition-transform active:scale-95 cursor-default">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Available Fund</p>
                <p className="font-black text-3xl text-slate-900">₦{currentUser?.balance.toLocaleString()}</p>
              </div>
            </div>

            {/* Bottom Interaction Panel */}
            <div className="absolute bottom-10 left-10 right-10 max-w-2xl mx-auto bg-white rounded-[60px] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.25)] overflow-hidden border border-white p-2 animate-fade-up">
              <div className="bg-slate-50 p-10 rounded-[58px]">
                {rideStep === 'INPUT' && (
                  <div className="space-y-10 animate-fade-up">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Your 2026 destination?</h3>
                    <div className="space-y-4 relative">
                      <div className="absolute left-[26px] top-8 bottom-8 w-1 bg-slate-200 rounded-full"></div>
                      <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500 z-10 border-4 border-white shadow-lg animate-pulse"></div>
                        <input 
                          placeholder="Current Location" 
                          value={pickup} onChange={e => setPickup(e.target.value)}
                          className="w-full pl-16 pr-8 py-6 bg-white rounded-[28px] border-2 border-transparent shadow-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all" 
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-lg bg-red-500 z-10 border-4 border-white shadow-lg animate-pulse"></div>
                        <input 
                          placeholder="Where to?" 
                          value={dropoff} onChange={e => setDropoff(e.target.value)}
                          className="w-full pl-16 pr-8 py-6 bg-white rounded-[28px] border-2 border-transparent shadow-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all" 
                        />
                      </div>
                    </div>
                    <button 
                      onClick={handleBooking}
                      disabled={!pickup || !dropoff}
                      className="w-full bg-slate-900 text-white font-black py-6 rounded-[32px] hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-slate-300 disabled:opacity-50 disabled:scale-100"
                    >
                      Search Nearby 2026 Fleet
                    </button>
                  </div>
                )}

                {rideStep === 'SELECTION' && (
                  <div className="space-y-8 animate-fade-up">
                    <div className="flex items-center justify-between">
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight">Choose Class</h3>
                      <button onClick={cancelRequest} className="p-3 bg-white rounded-2xl shadow-sm text-slate-400 hover:text-red-500 hover:rotate-90 transition-all"><X /></button>
                    </div>
                    <div className="space-y-4">
                      {[
                        { type: VehicleType.ECONOMY, price: 2500, icon: Car, eta: '3 mins' },
                        { type: VehicleType.PREMIUM, price: 4500, icon: Shield, eta: '5 mins' },
                        { type: VehicleType.XL, price: 3800, icon: Zap, eta: '8 mins' },
                      ].map(item => (
                        <button 
                          key={item.type}
                          onClick={() => setSelectedType(item.type)}
                          className={`flex items-center p-8 rounded-[40px] border-4 transition-all ${selectedType === item.type ? 'border-blue-600 bg-white shadow-2xl scale-[1.02]' : 'border-transparent bg-white hover:border-slate-100'}`}
                        >
                          <div className={`p-4 rounded-3xl mr-6 transition-transform ${selectedType === item.type ? 'bg-blue-600 text-white scale-110 shadow-lg' : 'bg-slate-50 text-blue-600'}`}>
                            <item.icon className="w-10 h-10" />
                          </div>
                          <div className="text-left flex-1">
                            <p className="font-black text-xl text-slate-900 uppercase tracking-tight">{item.type}</p>
                            <p className="text-xs text-slate-400 font-black uppercase tracking-widest">{item.eta} away</p>
                          </div>
                          <p className="font-black text-2xl text-slate-900">₦{item.price.toLocaleString()}</p>
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={confirmRide}
                      className="w-full bg-blue-600 text-white font-black py-6 rounded-[32px] hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-blue-600/20"
                    >
                      Confirm {selectedType} Booking
                    </button>
                  </div>
                )}

                {rideStep === 'MATCHING' && (
                  <div className="py-24 flex flex-col items-center justify-center space-y-12 animate-fade-up">
                    <div className="relative flex items-center justify-center">
                       {/* Animated Outer Rings */}
                       <div className="absolute w-48 h-48 border-4 border-blue-600/20 rounded-full animate-ping"></div>
                       <div className="absolute w-56 h-56 border border-blue-600/10 rounded-full animate-pulse"></div>
                       <div className="w-40 h-40 border-[12px] border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                       <div className="absolute w-24 h-24 bg-slate-900 rounded-[32px] flex items-center justify-center shadow-2xl">
                        <Car className="text-blue-400 w-12 h-12 animate-pulse" />
                       </div>
                    </div>
                    <div className="text-center space-y-4">
                      <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Scanning City...</h3>
                      <p className="text-slate-500 font-bold max-w-xs mx-auto">AI is optimizing route and matching you with a 5-star partner.</p>
                    </div>
                    <button onClick={cancelRequest} className="text-red-500 font-black hover:bg-red-50 px-10 py-4 rounded-2xl transition-all hover:scale-105 active:scale-95">Cancel Request</button>
                  </div>
                )}

                {rideStep === 'ON_RIDE' && activeRide && (
                  <div className="space-y-10 animate-fade-up">
                    <div className="flex items-center justify-between px-2">
                       <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
                        <span className="text-green-600 text-xs font-black uppercase tracking-[0.3em]">En Route to You</span>
                       </div>
                       <p className="text-3xl font-black text-blue-600 drop-shadow-md">{activeRide.eta}</p>
                    </div>
                    <div className="flex items-center space-x-8 p-8 bg-white rounded-[48px] border-2 border-slate-50 shadow-sm hover:shadow-xl transition-shadow group">
                      <img src={activeRide.driver.avatar} className="w-24 h-24 rounded-[32px] object-cover border-4 border-slate-50 shadow-lg group-hover:scale-110 transition-transform" alt="driver" />
                      <div className="flex-1">
                        <p className="font-black text-2xl text-slate-900 tracking-tight">{activeRide.driver.name}</p>
                        <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] mt-1">{activeRide.driver.vehicleModel} • {activeRide.driver.plateNumber}</p>
                        <div className="flex items-center text-sm text-yellow-500 mt-2 font-black">
                          <Star className="w-4 h-4 fill-current mr-2" /> {activeRide.driver.rating} • Top Rated
                        </div>
                      </div>
                      <button className="bg-blue-600 p-6 rounded-[32px] text-white hover:bg-blue-700 hover:scale-110 active:scale-90 transition-all shadow-xl shadow-blue-100">
                        <Phone className="w-7 h-7" />
                      </button>
                    </div>
                    <div className="flex space-x-6">
                      <button onClick={cancelRequest} className="flex-1 py-6 border-4 border-slate-50 rounded-[32px] font-black text-slate-400 hover:border-red-100 hover:text-red-500 transition-all hover:scale-[1.02] active:scale-[0.98]">Cancel</button>
                      <button className="flex-1 py-6 bg-slate-900 text-white rounded-[32px] font-black hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl">Safety Portal</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiderDashboard;
