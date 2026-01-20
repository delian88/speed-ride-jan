
import React, { useState, useEffect, useRef, ReactNode, Component } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { 
  MapPin, Navigation, History, Wallet, LogOut,
  Car, Zap, Phone, User as UserIcon, CheckCircle, ChevronRight,
  Plus, ShieldCheck, Mail, Star, X,
  Search, Locate, Users, Clock, Shield, MoreHorizontal, 
  AlertTriangle, AlertCircle, Bell, ChevronDown, CreditCard,
  RefreshCw, Minus
} from 'lucide-react';
import { useApp } from '../App';
import { RideStatus, VehicleType, User as UserType, RideRequest } from '../types';
import { db } from '../database';
import Logo from '../components/Logo';

declare var google: any;

const RiderExplore: React.FC = () => {
  const { currentUser } = useApp();
  const [rideStep, setRideStep] = useState<'INPUT' | 'MATCHING' | 'ON_RIDE'>('INPUT');
  const [rideStatus, setRideStatus] = useState<RideStatus>(RideStatus.REQUESTED);
  const [pickup, setPickup] = useState('123 Main St, New York, NY');
  const [dropoff, setDropoff] = useState('');
  const [distance, setDistance] = useState(0);
  const [selectedType, setSelectedType] = useState<VehicleType>(VehicleType.ECONOMY);
  const [pricePerKm, setPricePerKm] = useState(350);
  const [eta, setEta] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'WALLET' | 'CARD'>('WALLET');

  // Map Refs
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const directionsRendererRef = useRef<any>(null);
  const driverMarkerRef = useRef<any>(null);
  const pickupMarkerRef = useRef<any>(null);
  const dropoffMarkerRef = useRef<any>(null);
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const dropoffInputRef = useRef<HTMLInputElement>(null);

  const updateMapBounds = () => {
    if (!mapRef.current) return;
    const bounds = new google.maps.LatLngBounds();
    let hasCoords = false;
    
    if (pickupMarkerRef.current?.getPosition() && pickup) {
      bounds.extend(pickupMarkerRef.current.getPosition());
      hasCoords = true;
    }
    if (dropoffMarkerRef.current?.getPosition() && dropoff) {
      bounds.extend(dropoffMarkerRef.current.getPosition());
      hasCoords = true;
    }

    if (hasCoords) {
      mapRef.current.fitBounds(bounds, { top: 100, bottom: 100, left: 100, right: 100 });
      if (!dropoff || !pickup) {
        setTimeout(() => mapRef.current.setZoom(15), 100);
      }
    }
  };

  const getRoute = (origin: string, destination: string) => {
    if (!origin || !destination) return;
    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result: any, status: any) => {
        if (status === 'OK') {
          if (pickupMarkerRef.current) pickupMarkerRef.current.setMap(null);
          if (dropoffMarkerRef.current) dropoffMarkerRef.current.setMap(null);
          directionsRendererRef.current.setDirections(result);
          const route = result.routes[0].legs[0];
          setDistance(route.distance.value / 1000);
        }
      }
    );
  };

  useEffect(() => {
    db.settings.get().then(s => setPricePerKm(s?.pricePerKm || 350));

    const initMap = () => {
      if (mapContainerRef.current && typeof google !== 'undefined' && google.maps) {
        mapRef.current = new google.maps.Map(mapContainerRef.current, {
          center: { lat: 40.7128, lng: -74.0060 }, // NYC
          zoom: 13,
          disableDefaultUI: true,
          styles: [
            { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#cbd5e1" }] },
            { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f1f5f9" }] }
          ]
        });

        directionsRendererRef.current = new google.maps.DirectionsRenderer({
          suppressMarkers: false,
          polylineOptions: { strokeColor: "#2563eb", strokeWeight: 6, strokeOpacity: 0.8 }
        });
        directionsRendererRef.current.setMap(mapRef.current);

        pickupMarkerRef.current = new google.maps.Marker({
          map: mapRef.current,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#2563eb",
            fillOpacity: 1,
            strokeColor: "white",
            strokeWeight: 3,
          }
        });

        dropoffMarkerRef.current = new google.maps.Marker({
          map: mapRef.current,
          icon: {
            path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
            fillColor: "#ef4444",
            fillOpacity: 1,
            strokeWeight: 0,
            scale: 2,
            anchor: new google.maps.Point(12, 22)
          }
        });

        if (google.maps.places) {
          const pAuto = new google.maps.places.Autocomplete(pickupInputRef.current);
          pAuto.addListener('place_changed', () => {
            const place = pAuto.getPlace();
            if (place.geometry) {
              setPickup(place.formatted_address || place.name);
              pickupMarkerRef.current.setPosition(place.geometry.location);
              pickupMarkerRef.current.setMap(mapRef.current);
              updateMapBounds();
              if (dropoff) getRoute(place.formatted_address || place.name, dropoff);
            }
          });

          const dAuto = new google.maps.places.Autocomplete(dropoffInputRef.current);
          dAuto.addListener('place_changed', () => {
            const place = dAuto.getPlace();
            if (place.geometry) {
              setDropoff(place.formatted_address || place.name);
              dropoffMarkerRef.current.setPosition(place.geometry.location);
              dropoffMarkerRef.current.setMap(mapRef.current);
              updateMapBounds();
              if (pickup) getRoute(pickup, place.formatted_address || place.name);
            }
          });
        }
      }
    };

    const interval = setInterval(() => {
      if (typeof google !== 'undefined') {
        initMap();
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const calculateFare = (type: VehicleType) => {
    const multipliers: Record<string, number> = {
      [VehicleType.ECONOMY]: 1.0, [VehicleType.PREMIUM]: 2.1, [VehicleType.XL]: 2.5, [VehicleType.BIKE]: 0.6
    };
    const multiplier = multipliers[type] || 1.0;
    return Math.max(distance * pricePerKm * multiplier, 500);
  };

  const currentFare = calculateFare(selectedType);

  const confirmRide = () => {
    setRideStep('MATCHING');
    setTimeout(() => {
      setRideStep('ON_RIDE');
      setRideStatus(RideStatus.IN_PROGRESS);
      setEta(5);
    }, 3000);
  };

  return (
    <div className="flex h-full w-full bg-white">
      {/* Sidebar Overlay */}
      <div className="w-[420px] h-full flex flex-col border-r border-slate-100 shadow-2xl z-10 overflow-y-auto custom-scrollbar bg-white">
        <div className="p-8 space-y-8">
          {/* Pickup Selection */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-slate-900 mb-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-sm tracking-tight">Your Location</span>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]"></div>
                <input 
                  ref={pickupInputRef}
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Enter pickup point"
                  className="w-full pl-10 pr-10 py-4 bg-slate-50 border border-slate-100 rounded-xl font-medium text-sm focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition">
                  <Locate className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-slate-900 mb-2">
                <MapPin className="w-5 h-5 text-red-500" />
                <span className="font-bold text-sm tracking-tight">Drop-off Location</span>
              </div>
              <div className="relative group">
                <input 
                  ref={dropoffInputRef}
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  placeholder="Enter destination"
                  className="w-full pl-5 pr-10 py-4 bg-slate-50 border border-slate-100 rounded-xl font-medium text-sm focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition">
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Vehicle Selection */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { type: VehicleType.ECONOMY, label: 'Economy', price: 12.50, time: 5, img: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=200&q=80' },
              { type: VehicleType.PREMIUM, label: 'Premium', price: 25.80, time: 3, img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&q=80' },
              { type: VehicleType.XL, label: 'SUV', price: 30.20, time: 6, img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=200&q=80' }
            ].map((v) => (
              <div 
                key={v.type}
                onClick={() => setSelectedType(v.type)}
                className={`cursor-pointer rounded-xl border-2 transition-all overflow-hidden ${selectedType === v.type ? 'border-blue-600 bg-blue-50/20 ring-4 ring-blue-50' : 'border-slate-100 hover:border-slate-200'}`}
              >
                <div className="h-16 relative overflow-hidden bg-slate-100">
                  <img src={v.img} className="w-full h-full object-cover" />
                  {selectedType === v.type && (
                    <div className="absolute top-1 right-1 bg-blue-600 text-white rounded-full p-0.5">
                      <CheckCircle className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <div className={`p-3 text-center ${selectedType === v.type ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                  <p className="text-[10px] font-black uppercase tracking-widest">{v.label}</p>
                  <p className="text-xs font-bold mt-1">₦{(currentFare * (v.price/12.5)).toLocaleString()} • {v.time} min</p>
                </div>
              </div>
            ))}
          </div>

          {/* Fare Details */}
          <div className="border-t border-slate-100 pt-6 space-y-4">
            <div className="flex justify-between items-center group cursor-pointer">
              <span className="font-bold text-slate-500 text-sm">Fare Details</span>
              <ChevronDown className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-medium">Base Fare</span>
                <span className="font-bold text-slate-900">₦500.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-medium">Distance & Time</span>
                <span className="font-bold text-slate-900">₦{(currentFare * 0.8).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-medium">Service Fee</span>
                <span className="font-bold text-slate-900">₦{(currentFare * 0.1).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-900 font-black text-sm">Estimated Total</span>
                <span className="text-xl font-black text-slate-900">₦{currentFare.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="border-t border-slate-100 pt-6 space-y-4">
            <div className="flex justify-between items-center group cursor-pointer">
              <span className="font-bold text-slate-500 text-sm">Payment Method</span>
              <ChevronDown className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setPaymentMethod('WALLET')}
                className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'WALLET' ? 'border-blue-600 bg-blue-50/20' : 'border-slate-50 bg-slate-50 text-slate-400'}`}
              >
                <Wallet className={`w-4 h-4 ${paymentMethod === 'WALLET' ? 'text-blue-600' : ''}`} />
                <span className="text-xs font-black">Wallet (₦{currentUser?.balance.toLocaleString()})</span>
              </button>
              <button 
                onClick={() => setPaymentMethod('CARD')}
                className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'CARD' ? 'border-blue-600 bg-blue-50/20' : 'border-slate-50 bg-slate-50 text-slate-400'}`}
              >
                <CreditCard className={`w-4 h-4 ${paymentMethod === 'CARD' ? 'text-blue-600' : ''}`} />
                <span className="text-xs font-black">Card **** 1234</span>
              </button>
            </div>
            <button className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline">Add Payment Method</button>
          </div>

          {/* Action Button */}
          <button 
            onClick={confirmRide}
            disabled={!pickup || !dropoff}
            className="w-full py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale"
          >
            {rideStep === 'MATCHING' ? 'Synchronizing Node...' : 'Confirm Ride'}
          </button>
        </div>
      </div>

      {/* Map Content */}
      <div className="flex-1 relative bg-slate-100">
        <div ref={mapContainerRef} className="absolute inset-0 z-0" />
        
        {/* Floating Controls */}
        <div className="absolute bottom-10 right-10 flex flex-col space-y-3 z-20">
          <div className="flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            <button onClick={() => mapRef.current?.setZoom((mapRef.current?.getZoom() || 13) + 1)} className="p-4 hover:bg-slate-50 transition text-slate-400 hover:text-slate-900 border-b border-slate-50"><Plus className="w-6 h-6" /></button>
            <button onClick={() => mapRef.current?.setZoom((mapRef.current?.getZoom() || 13) - 1)} className="p-4 hover:bg-slate-50 transition text-slate-400 hover:text-slate-900"><Minus className="w-6 h-6" /></button>
          </div>
          <button onClick={() => updateMapBounds()} className="p-4 bg-white rounded-2xl shadow-2xl border border-slate-100 hover:bg-slate-50 transition text-slate-400 hover:text-blue-600">
            <RefreshCw className="w-6 h-6" />
          </button>
          <button className="p-4 bg-blue-600 rounded-2xl shadow-2xl text-white hover:bg-blue-700 transition">
            <Zap className="w-6 h-6" />
          </button>
        </div>

        {/* Route Info Overlay (Matching) */}
        {rideStep === 'MATCHING' && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-900/10 backdrop-blur-sm pointer-events-none">
            <div className="bg-white p-10 rounded-[40px] shadow-2xl flex flex-col items-center space-y-6 animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center animate-pulse">
                <Search className="w-10 h-10" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-slate-900 tracking-tight">Finding Your Pilot</p>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Connecting to available fleet nodes...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const RiderDashboard: React.FC = () => {
  const { logout, currentUser } = useApp();
  const navigate = useNavigate();

  if (!currentUser) return null;
  
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Header Bar */}
      <header className="h-20 bg-slate-900 text-white flex items-center justify-between px-8 z-50 shrink-0 shadow-2xl">
        <div className="flex items-center space-x-12">
          <Logo className="h-10 w-auto brightness-0 invert" />
          <div className="hidden md:flex items-center space-x-3 bg-white/5 px-6 py-3 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-black">New York, NY</span>
            <ChevronDown className="w-3 h-3 text-white/40" />
          </div>
        </div>

        <nav className="hidden lg:flex items-center space-x-10 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
           <NavLink to="/rider" end className={({isActive}) => isActive ? "text-white" : "hover:text-white transition"}>Booking Hub</NavLink>
           <NavLink to="/rider/history" className={({isActive}) => isActive ? "text-white" : "hover:text-white transition"}>Journey Logs</NavLink>
           <NavLink to="/rider/wallet" className={({isActive}) => isActive ? "text-white" : "hover:text-white transition"}>Transactions</NavLink>
        </nav>

        <div className="flex items-center space-x-6">
          <button className="relative p-2 text-white/40 hover:text-white transition">
            <Bell className="w-6 h-6" />
            <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></div>
          </button>
          
          <div className="flex items-center space-x-4 pl-6 border-l border-white/5">
             <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Available</p>
                <p className="text-sm font-black text-blue-400">₦{currentUser.balance.toLocaleString()}</p>
             </div>
             <div className="relative group">
               <button className="flex items-center space-x-3 p-1.5 pr-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition">
                  <img src={currentUser.avatar} className="w-10 h-10 rounded-xl object-cover" />
                  <ChevronDown className="w-3 h-3 text-white/40" />
               </button>
               <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 text-slate-900">
                  <button onClick={() => navigate('/rider/profile')} className="w-full flex items-center space-x-3 px-5 py-3 hover:bg-slate-50 transition font-black text-xs uppercase tracking-widest"><UserIcon className="w-4 h-4" /> <span>Identity</span></button>
                  <button onClick={logout} className="w-full flex items-center space-x-3 px-5 py-3 hover:bg-red-50 text-red-600 transition font-black text-xs uppercase tracking-widest"><LogOut className="w-4 h-4" /> <span>Terminate Session</span></button>
               </div>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden">
        <Routes>
          <Route index element={<RiderExplore />} />
          <Route path="history" element={<RiderHistory />} />
          <Route path="wallet" element={<RiderWallet />} />
          <Route path="profile" element={<RiderProfile />} />
        </Routes>
      </div>
    </div>
  );
};

// Simplified sub-views for demonstration based on previous high-quality logic
const RiderHistory: React.FC = () => {
  const { currentUser } = useApp();
  const [rides, setRides] = useState<any[]>([]);
  useEffect(() => { if (currentUser?.id) db.rides.getByUser(currentUser.id).then(setRides); }, [currentUser]);
  return (
    <div className="p-10 max-w-5xl mx-auto space-y-8 h-full overflow-y-auto pb-32">
      <h2 className="text-4xl font-black text-slate-900 tracking-tight">Telemetry History</h2>
      <div className="grid gap-4">
        {rides.map(r => (
          <div key={r.id} className="bg-white p-8 rounded-[32px] border border-slate-100 flex items-center justify-between group hover:shadow-xl transition-all duration-500">
            <div className="flex items-center space-x-6">
               <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition"><Navigation className="w-6 h-6" /></div>
               <div>
                  <p className="font-black text-slate-900 text-lg">{(r.dropoff || 'Journey').split(',')[0]}</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{new Date(r.createdAt).toLocaleDateString()} • {r.status}</p>
               </div>
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tighter">₦{(r.fare || 0).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const RiderWallet: React.FC = () => {
  const { currentUser } = useApp();
  return (
    <div className="p-10 max-w-5xl mx-auto space-y-10 h-full overflow-y-auto pb-32">
      <h2 className="text-4xl font-black text-slate-900 tracking-tight">Neural Wallet</h2>
      <div className="bg-slate-900 p-12 rounded-[50px] text-white shadow-2xl relative overflow-hidden group">
        <Zap className="absolute top-0 right-0 p-12 opacity-10 w-48 h-48 group-hover:scale-110 transition-transform duration-1000" />
        <p className="text-xs font-black uppercase tracking-[0.4em] opacity-40 mb-3">Available Balance</p>
        <p className="text-6xl font-black tracking-tighter">₦{(currentUser?.balance || 0).toLocaleString()}</p>
        <div className="mt-12 flex space-x-4">
           <button className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black hover:bg-blue-600 hover:text-white transition-all shadow-xl">Top Up Account</button>
           <button className="bg-white/10 text-white px-10 py-5 rounded-2xl font-black hover:bg-white/20 transition-all backdrop-blur-md">Auto-Reload</button>
        </div>
      </div>
    </div>
  );
};

const RiderProfile: React.FC = () => {
  const { currentUser } = useApp();
  return (
    <div className="p-10 max-w-5xl mx-auto space-y-10 h-full overflow-y-auto pb-32">
      <h2 className="text-4xl font-black text-slate-900 tracking-tight">Identity Node</h2>
      <div className="bg-white p-12 rounded-[50px] border border-slate-100 space-y-10">
        <div className="flex items-center space-x-8">
           <img src={currentUser?.avatar} className="w-28 h-28 rounded-[40px] border-4 border-slate-50 shadow-2xl" />
           <div>
              <p className="text-3xl font-black text-slate-900 tracking-tighter">{currentUser?.name}</p>
              <p className="text-slate-400 font-bold text-lg">{currentUser?.email}</p>
              <div className="mt-4 inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest">Elite Member • 4.98</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;
