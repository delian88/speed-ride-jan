
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
  const { state, updateState, logout } = useApp();
  const [currentView, setCurrentView] = useState<RiderView>('HOME');
  
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [rideStep, setRideStep] = useState<'INPUT' | 'SELECTION' | 'MATCHING' | 'ON_RIDE'>('INPUT');
  const [selectedType, setSelectedType] = useState<VehicleType>(VehicleType.ECONOMY);
  const [activeRide, setActiveRide] = useState<any>(null);

  // Profile States
  const [userName, setUserName] = useState(state.currentUser.name);
  const [userPhone, setUserPhone] = useState(state.currentUser.phone);

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
        driver: state.allDrivers[0],
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
    <div className="p-10 space-y-10 animate-in slide-in-from-right duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-slate-900">Profile Management</h2>
        <button onClick={() => setCurrentView('HOME')} className="p-3 bg-slate-100 rounded-2xl hover:bg-slate-200 transition">
          <X className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <div className="space-y-6 w-full md:w-1/3">
          <div className="relative group mx-auto w-40 h-40">
            <img src={state.currentUser.avatar} className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-xl" alt="avatar" />
            <button className="absolute bottom-2 right-2 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition">
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-slate-900">{userName}</p>
            <p className="text-sm font-bold text-slate-400">Member since 2024</p>
          </div>
        </div>

        <div className="flex-1 space-y-8 bg-white p-8 rounded-[40px] shadow-sm border border-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</label>
              <input 
                type="text" value={userName} onChange={e => setUserName(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Phone Number</label>
              <input 
                type="tel" value={userPhone} onChange={e => setUserPhone(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600" 
              />
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Payment Methods</p>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <div className="flex items-center space-x-4">
                  <div className="bg-slate-900 p-2 rounded-lg text-white font-bold text-[10px]">VISA</div>
                  <p className="font-bold">**** **** **** 4242</p>
               </div>
               <button className="text-xs font-black text-blue-600 hover:underline">Edit</button>
            </div>
            <button className="flex items-center space-x-2 text-blue-600 font-bold hover:underline">
              <Zap className="w-4 h-4" /> <span>Add New Method</span>
            </button>
          </div>
          <button className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-blue-600 transition shadow-xl shadow-slate-200">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-24 md:w-72 bg-white border-r border-slate-100 flex flex-col items-center py-10">
        <div className="mb-16">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Zap className="h-8 w-8 text-white fill-current" />
          </div>
        </div>
        <nav className="flex-1 flex flex-col space-y-6 w-full px-4">
          <button 
            onClick={() => setCurrentView('HOME')}
            className={`flex items-center space-x-4 p-4 rounded-2xl transition w-full ${currentView === 'HOME' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
          >
            <Navigation className="w-6 h-6 shrink-0" />
            <span className="hidden md:block font-black uppercase tracking-widest text-xs">Book Ride</span>
          </button>
          <button 
            onClick={() => setCurrentView('HISTORY')}
            className={`flex items-center space-x-4 p-4 rounded-2xl transition w-full ${currentView === 'HISTORY' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
          >
            <History className="w-6 h-6 shrink-0" />
            <span className="hidden md:block font-black uppercase tracking-widest text-xs">History</span>
          </button>
          <button 
            onClick={() => setCurrentView('WALLET')}
            className={`flex items-center space-x-4 p-4 rounded-2xl transition w-full ${currentView === 'WALLET' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
          >
            <Wallet className="w-6 h-6 shrink-0" />
            <span className="hidden md:block font-black uppercase tracking-widest text-xs">Wallet</span>
          </button>
          <button 
            onClick={() => setCurrentView('PROFILE')}
            className={`flex items-center space-x-4 p-4 rounded-2xl transition w-full ${currentView === 'PROFILE' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
          >
            <UserIcon className="w-6 h-6 shrink-0" />
            <span className="hidden md:block font-black uppercase tracking-widest text-xs">Profile</span>
          </button>
        </nav>
        <button onClick={logout} className="p-4 text-red-400 hover:text-red-600 transition mt-auto flex items-center space-x-4">
          <LogOut className="w-6 h-6" />
          <span className="hidden md:block font-black uppercase tracking-widest text-xs">Sign Out</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-y-auto">
        {currentView === 'PROFILE' ? renderProfileView() : (
          <div className="h-full relative overflow-hidden">
            {/* Mock Map Background */}
            <div className="absolute inset-0 bg-[#f8fafc] overflow-hidden">
               <svg className="w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                 {[...Array(20)].map((_, i) => <path key={i} d={`M0 ${i*10} L100 ${i*10} M${i*10} 0 L${i*10} 100`} stroke="black" strokeWidth="0.1" />)}
               </svg>
               {pickup && (
                 <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="pulse-marker relative w-8 h-8 flex items-center justify-center">
                      <MapPin className="text-blue-600 w-8 h-8 drop-shadow-lg" />
                    </div>
                 </div>
               )}
               {dropoff && (
                 <div className="absolute top-1/4 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
                    <MapPin className="text-red-600 w-8 h-8 drop-shadow-lg" />
                 </div>
               )}
            </div>

            {/* User Stats/Top Bar */}
            <div className="absolute top-10 left-10 right-10 flex justify-between items-center pointer-events-none">
              <div 
                onClick={() => setCurrentView('PROFILE')}
                className="glass p-5 rounded-3xl border border-white flex items-center space-x-4 pointer-events-auto cursor-pointer hover:bg-white/90 transition shadow-2xl shadow-slate-200"
              >
                <img src={state.currentUser.avatar} className="w-12 h-12 rounded-full border-2 border-blue-500 p-0.5" alt="profile" />
                <div>
                  <p className="font-black text-slate-900 leading-none mb-1">{state.currentUser.name}</p>
                  <p className="text-xs text-blue-600 font-black flex items-center">
                    <Star className="w-3 h-3 fill-current mr-1" /> {state.currentUser.rating} • Top Rider
                  </p>
                </div>
              </div>
              <div className="glass p-5 rounded-3xl border border-white pointer-events-auto shadow-2xl shadow-slate-200 text-right">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">SpeedWallet</p>
                <p className="font-black text-2xl text-slate-900">₦{state.currentUser.balance.toLocaleString()}</p>
              </div>
            </div>

            {/* Interaction Panel */}
            <div className="absolute bottom-10 left-10 right-10 max-w-xl mx-auto bg-white rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] overflow-hidden border border-white p-2">
              <div className="bg-slate-50 p-8 rounded-[38px]">
                {rideStep === 'INPUT' && (
                  <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-500">
                    <h3 className="text-2xl font-black text-slate-900">Where are you going?</h3>
                    <div className="space-y-4 relative">
                      <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-200"></div>
                      <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-blue-500 z-10 border-2 border-white"></div>
                        <input 
                          placeholder="Current Location" 
                          value={pickup} onChange={e => setPickup(e.target.value)}
                          className="w-full pl-12 pr-6 py-5 bg-white rounded-2xl border border-slate-100 shadow-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 transition" 
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-sm bg-red-500 z-10 border-2 border-white"></div>
                        <input 
                          placeholder="Drop-off point" 
                          value={dropoff} onChange={e => setDropoff(e.target.value)}
                          className="w-full pl-12 pr-6 py-5 bg-white rounded-2xl border border-slate-100 shadow-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 transition" 
                        />
                      </div>
                    </div>
                    <button 
                      onClick={handleBooking}
                      disabled={!pickup || !dropoff}
                      className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-blue-600 transition shadow-2xl shadow-slate-300 disabled:opacity-50"
                    >
                      Match Nearby Drivers
                    </button>
                  </div>
                )}

                {rideStep === 'SELECTION' && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-black text-slate-900">Service Class</h3>
                      <button onClick={cancelRequest} className="p-2 bg-white rounded-xl shadow-sm text-slate-400 hover:text-slate-900"><X /></button>
                    </div>
                    <div className="space-y-3">
                      {[
                        { type: VehicleType.ECONOMY, price: 2500, icon: Car, eta: '3 mins' },
                        { type: VehicleType.PREMIUM, price: 4500, icon: Shield, eta: '5 mins' },
                        { type: VehicleType.XL, price: 3800, icon: Zap, eta: '8 mins' },
                      ].map(item => (
                        <button 
                          key={item.type}
                          onClick={() => setSelectedType(item.type)}
                          className={`flex items-center p-6 rounded-3xl border-2 transition ${selectedType === item.type ? 'border-blue-600 bg-white shadow-xl shadow-blue-50' : 'border-transparent bg-white hover:border-slate-200'}`}
                        >
                          <div className={`p-3 rounded-2xl mr-5 ${selectedType === item.type ? 'bg-blue-600 text-white' : 'bg-slate-100 text-blue-600'}`}>
                            <item.icon className="w-8 h-8" />
                          </div>
                          <div className="text-left flex-1">
                            <p className="font-black text-lg text-slate-900">{item.type}</p>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{item.eta} away</p>
                          </div>
                          <p className="font-black text-xl text-slate-900">₦{item.price.toLocaleString()}</p>
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={confirmRide}
                      className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition shadow-2xl shadow-blue-100"
                    >
                      Confirm {selectedType} Booking
                    </button>
                  </div>
                )}

                {rideStep === 'MATCHING' && (
                  <div className="py-20 flex flex-col items-center justify-center space-y-10 animate-in zoom-in duration-500">
                    <div className="relative flex items-center justify-center">
                       <div className="w-32 h-32 border-8 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                       <div className="absolute w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center">
                        <Car className="text-blue-400 w-10 h-10 animate-pulse" />
                       </div>
                    </div>
                    <div className="text-center space-y-3">
                      <h3 className="text-3xl font-black text-slate-900">Scanning City...</h3>
                      <p className="text-slate-500 font-bold">Connecting you to the best driver for your route.</p>
                    </div>
                    <button onClick={cancelRequest} className="text-red-500 font-black hover:bg-red-50 px-6 py-2 rounded-xl transition">Abort Request</button>
                  </div>
                )}

                {rideStep === 'ON_RIDE' && activeRide && (
                  <div className="space-y-8 animate-in slide-in-from-bottom-20 duration-500">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-600 text-xs font-black uppercase tracking-[0.2em]">Driver En Route</span>
                       </div>
                       <p className="text-2xl font-black text-blue-600">{activeRide.eta}</p>
                    </div>
                    <div className="flex items-center space-x-6 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                      <img src={activeRide.driver.avatar} className="w-20 h-20 rounded-2xl object-cover border-4 border-slate-50 shadow-md" alt="driver" />
                      <div className="flex-1">
                        <p className="font-black text-xl text-slate-900">{activeRide.driver.name}</p>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">{activeRide.driver.vehicleModel} • {activeRide.driver.plateNumber}</p>
                        <div className="flex items-center text-sm text-yellow-500 mt-1 font-black">
                          <Star className="w-4 h-4 fill-current mr-1" /> {activeRide.driver.rating}
                        </div>
                      </div>
                      <button className="bg-blue-600 p-4 rounded-2xl text-white hover:bg-blue-700 transition shadow-xl shadow-blue-100">
                        <Phone className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="flex space-x-4">
                      <button onClick={cancelRequest} className="flex-1 py-5 border-2 border-slate-100 rounded-2xl font-black text-slate-400 hover:border-red-200 hover:text-red-500 transition">Cancel</button>
                      <button className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black hover:bg-blue-600 transition shadow-xl">Message Driver</button>
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
