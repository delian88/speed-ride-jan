
import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { 
  MapPin, Navigation, History, Wallet, LogOut,
  Car, Zap, Phone, User as UserIcon, CheckCircle, ChevronRight,
  Camera, Save, CreditCard, Plus, ShieldCheck, Mail, Star, X,
  Search, Locate, Users
} from 'lucide-react';
import { useApp } from '../App';
import { RideStatus, VehicleType, User as UserType } from '../types';
import { db } from '../database';
import Logo from '../components/Logo';

// Fix: Declare google globally to resolve "Cannot find name 'google'" and "Cannot find namespace 'google'" errors
declare var google: any;

const RiderExplore: React.FC = () => {
  const { currentUser } = useApp();
  const [rideStep, setRideStep] = useState<'INPUT' | 'SELECTION' | 'MATCHING' | 'ON_RIDE'>('INPUT');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [distance, setDistance] = useState(0);
  const [selectedType, setSelectedType] = useState<VehicleType>(VehicleType.ECONOMY);
  const [pricePerKm, setPricePerKm] = useState(350);
  
  const mapRef = useRef<HTMLDivElement>(null);
  // Fix: Use any type for Google Maps objects to avoid namespace errors (line 25-28)
  const [map, setMap] = useState<any>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<any>(null);
  const [pickupMarker, setPickupMarker] = useState<any>(null);
  const [destMarker, setDestMarker] = useState<any>(null);

  useEffect(() => {
    // Load Price Settings
    db.settings.get().then(s => setPricePerKm(s.pricePerKm));

    // Initialize Map
    if (mapRef.current && !map) {
      // Fix: Resolve "Cannot find name 'google'" on line 36
      const gMap = new google.maps.Map(mapRef.current, {
        center: { lat: 6.5244, lng: 3.3792 }, // Default to Lagos
        zoom: 12,
        styles: [
          { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#000000" }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9c9c9" }] },
          { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f5f5f5" }] }
        ],
        disableDefaultUI: true
      });
      
      // Fix: Resolve "Cannot find name 'google'" on line 47
      const dr = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#2563eb",
          strokeWeight: 6,
          strokeOpacity: 0.8
        }
      });
      dr.setMap(gMap);
      
      setMap(gMap);
      setDirectionsRenderer(dr);
    }
  }, [mapRef.current]);

  const calculateRoute = () => {
    if (!pickup || !dropoff || !directionsRenderer) return;

    // Fix: Resolve "Cannot find name 'google'" on line 65
    const ds = new google.maps.DirectionsService();
    ds.route({
      origin: pickup,
      destination: dropoff,
      // Fix: Resolve "Cannot find name 'google'" on line 69
      travelMode: google.maps.TravelMode.DRIVING
    }, (result: any, status: any) => {
      if (status === 'OK' && result) {
        directionsRenderer.setDirections(result);
        const dist = (result.routes[0].legs[0].distance?.value || 0) / 1000;
        setDistance(dist);
        setRideStep('SELECTION');
        
        // Markers
        if (pickupMarker) pickupMarker.setMap(null);
        if (destMarker) destMarker.setMap(null);

        // Fix: Resolve "Cannot find name 'google'" on line 81
        const pMarker = new google.maps.Marker({
          position: result.routes[0].legs[0].start_location,
          map: map,
          icon: {
            // Fix: Resolve "Cannot find name 'google'" on line 85
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#10b981',
            fillOpacity: 1,
            strokeWeight: 0,
            scale: 8
          }
        });
        // Fix: Resolve "Cannot find name 'google'" on line 92
        const dMarker = new google.maps.Marker({
          position: result.routes[0].legs[0].end_location,
          map: map,
          icon: {
            // Fix: Resolve "Cannot find name 'google'" on line 96
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#3b82f6',
            fillOpacity: 1,
            strokeWeight: 0,
            scale: 8
          }
        });
        setPickupMarker(pMarker);
        setDestMarker(dMarker);
      } else {
        alert("Could not calculate route. Please check the addresses.");
      }
    });
  };

  const confirmRide = async () => {
    if (!currentUser) return;
    setRideStep('MATCHING');
    
    const fare = calculateFare(selectedType);

    await db.rides.create({
       riderId: currentUser.id,
       pickup,
       dropoff,
       fare: fare,
       distance: distance,
       vehicleType: selectedType
    });

    setTimeout(() => setRideStep('ON_RIDE'), 4000);
  };

  const calculateFare = (type: VehicleType) => {
    const multipliers = {
      [VehicleType.ECONOMY]: 1.0,
      [VehicleType.PREMIUM]: 2.2,
      [VehicleType.XL]: 1.8,
      [VehicleType.BIKE]: 0.7
    };
    const base = Math.max(distance * pricePerKm * multipliers[type], 500); // Min fare 500
    return Math.round(base);
  };

  return (
    <div className="h-full relative overflow-hidden bg-slate-50">
      {/* Map Background */}
      <div ref={mapRef} className="absolute inset-0 z-0" />

      {/* Map Overlays & Inputs */}
      <div className="absolute top-10 left-10 w-96 z-10 space-y-4">
        <div className="bg-white p-6 rounded-[32px] shadow-2xl border border-slate-100 animate-fade-up">
           <div className="flex items-center space-x-3 mb-6">
              <Logo className="h-10 w-auto" />
              <div className="h-6 w-px bg-slate-100" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Plan Trip</p>
           </div>
           
           <div className="space-y-4">
             <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500" />
                <input 
                  placeholder="Enter Pickup Point" 
                  value={pickup}
                  onChange={e => setPickup(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 transition"
                />
             </div>
             <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500" />
                <input 
                  placeholder="Enter Destination" 
                  value={dropoff}
                  onChange={e => setDropoff(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 transition"
                />
             </div>
             {rideStep === 'INPUT' && (
               <button 
                onClick={calculateRoute}
                disabled={!pickup || !dropoff}
                className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-blue-600 transition shadow-xl disabled:opacity-50"
               >
                 Estimate Journey
               </button>
             )}
           </div>
        </div>
      </div>

      {/* Ride Selection Panel */}
      <div className={`absolute bottom-10 left-10 right-10 max-w-2xl mx-auto z-20 transition-all duration-700 transform ${rideStep !== 'INPUT' ? 'translate-y-0 opacity-100' : 'translate-y-96 opacity-0 pointer-events-none'}`}>
        <div className="bg-white p-10 rounded-[50px] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.3)] border border-white">
          {rideStep === 'MATCHING' ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-700">
               <div className="relative w-40 h-40 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-blue-600/10 rounded-full animate-pulse" />
                  <div className="absolute inset-0 rounded-full overflow-hidden opacity-30"><div className="radar-scanner" /></div>
                  <Logo className="h-16 w-auto logo-ignition z-10" />
               </div>
               <div className="text-center">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight shimmer-text">Matching Fleet...</h3>
                  <p className="text-slate-400 font-bold mt-1">Found 4 drivers nearby. Negotiating rate...</p>
               </div>
            </div>
          ) : rideStep === 'ON_RIDE' ? (
            <div className="text-center py-6 animate-in zoom-in duration-500">
               <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <CheckCircle className="w-10 h-10" />
               </div>
               <h3 className="text-3xl font-black text-slate-900 mb-2">Driver Confirmed!</h3>
               <p className="text-slate-500 font-bold mb-8">Tesla Model S • Plate LAG-007 • Tunde is 3 mins away</p>
               <button onClick={() => setRideStep('INPUT')} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-blue-600 transition shadow-2xl">Return to Hub</button>
            </div>
          ) : (
            <div className="space-y-8">
               <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Select Fleet</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{distance.toFixed(2)} KM Journey</p>
                  </div>
                  <button onClick={() => setRideStep('INPUT')} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition"><X className="w-5 h-5" /></button>
               </div>

               <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { type: VehicleType.ECONOMY, name: 'Lite', icon: Car, color: 'text-slate-400' },
                    { type: VehicleType.PREMIUM, name: 'Elite', icon: Zap, color: 'text-blue-600' },
                    // Fix: Resolved missing icon "Users"
                    { type: VehicleType.XL, name: 'Spaceship', icon: Users, color: 'text-indigo-600' },
                    { type: VehicleType.BIKE, name: 'Rocket', icon: Navigation, color: 'text-orange-500' }
                  ].map((item) => {
                    const fare = calculateFare(item.type);
                    return (
                      <div 
                        key={item.type}
                        onClick={() => setSelectedType(item.type)}
                        className={`p-6 rounded-3xl border-2 transition cursor-pointer flex flex-col justify-between ${selectedType === item.type ? 'border-blue-600 bg-blue-50/10' : 'border-transparent bg-slate-50 hover:bg-white hover:border-slate-100'}`}
                      >
                         <div className="flex justify-between items-start mb-6">
                            <div className={`p-3 bg-white rounded-xl shadow-sm ${item.color}`}><item.icon className="w-5 h-5" /></div>
                            <p className="text-lg font-black text-slate-900">₦{fare.toLocaleString()}</p>
                         </div>
                         <div>
                            <p className="font-black text-slate-900">{item.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.type}</p>
                         </div>
                      </div>
                    );
                  })}
               </div>

               <button onClick={confirmRide} className="w-full bg-blue-600 text-white font-black py-6 rounded-[32px] hover:bg-blue-700 transition shadow-2xl shadow-blue-500/30">
                  Commit Session
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RiderHistory: React.FC = () => {
  const { currentUser } = useApp();
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      db.rides.getByUser(currentUser.id).then(data => {
        setRides(data.reverse());
        setLoading(false);
      });
    }
  }, [currentUser]);

  return (
    <div className="p-12 space-y-8 animate-in fade-in slide-in-from-right-10 duration-500 overflow-y-auto h-full pb-32">
      <h2 className="text-4xl font-black tracking-tight text-slate-900">Neural Log</h2>
      <div className="space-y-4">
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-32 bg-slate-50 rounded-[40px]"></div>)}
          </div>
        ) : rides.length === 0 ? (
          <div className="py-20 text-center space-y-4">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300"><History className="w-10 h-10" /></div>
             <p className="font-bold text-slate-400">Memory bank is empty.</p>
          </div>
        ) : (
          rides.map(ride => (
            <div key={ride.id} className="bg-white p-8 rounded-[40px] border border-slate-100 flex items-center justify-between hover:shadow-xl transition-all group">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  <MapPin className="text-slate-400 group-hover:text-blue-600 w-8 h-8" />
                </div>
                <div>
                   <div className="flex items-center space-x-2">
                      <p className="font-black text-slate-900 text-lg">{ride.dropoff.split(',')[0]}</p>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-black text-slate-400">{ride.distance?.toFixed(1)} KM</span>
                   </div>
                  <p className="text-xs text-slate-400 font-bold">{new Date(ride.createdAt).toLocaleDateString()} • {ride.vehicleType}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-slate-900">₦{ride.fare.toLocaleString()}</p>
                <p className={`text-[10px] font-black uppercase tracking-widest ${ride.status === 'COMPLETED' ? 'text-emerald-500' : 'text-blue-500'}`}>{ride.status}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const RiderWallet: React.FC = () => {
  const { currentUser } = useApp();
  return (
    <div className="p-12 space-y-12 animate-in fade-in slide-in-from-right-10 duration-500 overflow-y-auto h-full pb-32">
      <h2 className="text-4xl font-black tracking-tight text-slate-900">Neural Credits</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-10 rounded-[50px] text-white relative overflow-hidden shadow-2xl">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
          <p className="text-xs font-black uppercase tracking-[0.3em] opacity-60 mb-2">Platform Liquidity</p>
          <p className="text-5xl font-black mb-10">₦{currentUser?.balance.toLocaleString() || '0.00'}</p>
          <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black hover:bg-blue-600 hover:text-white transition-all">Inject Funds</button>
        </div>
        <div className="bg-white p-10 rounded-[50px] border border-slate-100 flex flex-col justify-center">
           <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Settlement Node</p>
           <div className="flex items-center space-x-4">
             <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center font-black text-[10px]">VISA</div>
             <p className="font-black text-xl text-slate-900">**** 4422</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const RiderProfile: React.FC = () => {
  const { currentUser, refreshUser } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    avatar: currentUser?.avatar || ''
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsLoading(true);
    try {
      await db.users.update(currentUser.id, formData);
      await refreshUser();
      setMessage('Identity Updated');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Update Failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-12 space-y-12 animate-in fade-in slide-in-from-right-10 duration-500 overflow-y-auto h-full pb-32">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900">Identity Matrix</h2>
          <p className="text-slate-500 font-bold">Secure profile management.</p>
        </div>
        {message && (
          <div className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl font-black text-sm animate-bounce">
            {message}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleUpdate} className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-sm space-y-10">
             <div className="flex items-center space-x-8">
                <div className="relative group">
                   <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-slate-50 shadow-xl">
                      <img src={formData.avatar} className="w-full h-full object-cover" />
                   </div>
                   <label className={`absolute -bottom-2 -right-2 p-3 bg-blue-600 text-white rounded-2xl shadow-xl cursor-pointer hover:bg-blue-700 transition transform hover:scale-110 ${!isEditing ? 'opacity-0' : 'opacity-100'}`}>
                      <Camera className="w-5 h-5" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                   </label>
                </div>
                <div>
                   <h3 className="text-2xl font-black text-slate-900">{formData.name}</h3>
                   <div className="flex items-center space-x-2 text-slate-400 font-bold text-sm">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>Verified Node</span>
                   </div>
                </div>
             </div>

             <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
                   <input 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 transition disabled:opacity-50" 
                  />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Phone Line</label>
                   <input 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 transition disabled:opacity-50" 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
                   <input 
                    value={formData.email}
                    disabled
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-400 outline-none transition opacity-50 cursor-not-allowed" 
                  />
                </div>
             </div>

             <div className="flex justify-end space-x-4">
                {isEditing ? (
                  <>
                    <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-4 text-slate-400 font-black text-sm hover:text-slate-900 transition">Cancel</button>
                    <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition">
                      {isLoading ? 'Saving...' : 'Commit Changes'}
                    </button>
                  </>
                ) : (
                  <button type="button" onClick={() => setIsEditing(true)} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-blue-600 transition">Edit Identity</button>
                )}
             </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const RiderDashboard: React.FC = () => {
  const { logout } = useApp();
  const navItems = [
    { to: '/rider', icon: Navigation, label: 'Hub', end: true },
    { to: '/rider/history', icon: History, label: 'Logs' },
    { to: '/rider/wallet', icon: Wallet, label: 'Wallet' },
    { to: '/rider/profile', icon: UserIcon, label: 'Identity' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
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
             <span className="hidden md:block">Terminate Matrix</span>
           </button>
           <a href="https://www.premegagetech.com" target="_blank" rel="noopener noreferrer" className="block text-[8px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-blue-600 transition">
            Powered by Premegage Tech
           </a>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden bg-white">
        <Routes>
          <Route path="/" element={<RiderExplore />} />
          <Route path="/history" element={<RiderHistory />} />
          <Route path="/wallet" element={<RiderWallet />} />
          <Route path="/profile" element={<RiderProfile />} />
        </Routes>
      </div>
    </div>
  );
};

export default RiderDashboard;
