
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { 
  MapPin, Navigation, History, Wallet, LogOut,
  Car, Zap, Phone, User as UserIcon, CheckCircle, ChevronRight,
  Camera, Save, CreditCard, Plus, ShieldCheck, Mail, Star, X,
  Search, Locate, Users, Clock, Shield, MoreHorizontal, AlertTriangle, AlertCircle
} from 'lucide-react';
import { useApp } from '../App';
import { RideStatus, VehicleType, User as UserType, RideRequest } from '../types';
import { db } from '../database';
import Logo from '../components/Logo';

// Global declaration for Google Maps API
declare var google: any;

const RiderExplore: React.FC = () => {
  const { currentUser } = useApp();
  const [rideStep, setRideStep] = useState<'INPUT' | 'SELECTION' | 'MATCHING' | 'ON_RIDE'>('INPUT');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [distance, setDistance] = useState(0);
  const [selectedType, setSelectedType] = useState<VehicleType>(VehicleType.ECONOMY);
  const [pricePerKm, setPricePerKm] = useState(350);
  const [isApiLoading, setIsApiLoading] = useState(true);
  const [apiLoadError, setApiLoadError] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);
  
  const [activeRide, setActiveRide] = useState<RideRequest | null>(null);
  const [eta, setEta] = useState<number | null>(null);

  const [map, setMap] = useState<any>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<any>(null);
  const [pickupMarker, setPickupMarker] = useState<any>(null);
  const [destMarker, setDestMarker] = useState<any>(null);
  const [driverMarker, setDriverMarker] = useState<any>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("RiderExplore Mounting...");
    db.settings.get().then(s => setPricePerKm(s.pricePerKm));

    let attempts = 0;
    const maxAttempts = 12; // Increase time to load script

    const tryInitMap = () => {
      if (mapContainerRef.current && typeof google !== 'undefined' && google.maps) {
        console.log("Google Maps API detected. Initializing engine...");
        try {
          const gMap = new google.maps.Map(mapContainerRef.current, {
            center: { lat: 6.5244, lng: 3.3792 },
            zoom: 14,
            styles: [
              { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#334155" }] },
              { featureType: "water", elementType: "geometry", stylers: [{ color: "#e2e8f0" }] },
              { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f8fafc" }] },
              { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
              { featureType: "poi", stylers: [{ visibility: "off" }] }
            ],
            disableDefaultUI: true
          });
          
          const dr = new google.maps.DirectionsRenderer({
            suppressMarkers: true,
            polylineOptions: { strokeColor: "#2563eb", strokeWeight: 5, strokeOpacity: 0.7 }
          });
          dr.setMap(gMap);
          
          setMap(gMap);
          setDirectionsRenderer(dr);
          setIsApiLoading(false);
          setApiLoadError(false);
          setIsManualMode(false);
        } catch (error) {
          console.error("Map constructor failed:", error);
          setApiLoadError(true);
          setIsApiLoading(false);
        }
      } else {
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(tryInitMap, 1000);
        } else {
          console.warn("Map API load timeout. Falling back to Manual Neural Mode.");
          setApiLoadError(true);
          setIsApiLoading(false);
          setIsManualMode(true);
        }
      }
    };

    tryInitMap();
  }, []);

  const calculateRoute = () => {
    console.log("Calculating route for:", { pickup, dropoff });
    
    if (!pickup || !dropoff) {
      alert("Address fields are required.");
      return;
    }

    if (isManualMode || typeof google === 'undefined' || !google.maps || !directionsRenderer) {
      console.log("Simulating distance in fallback mode...");
      setDistance(14.8);
      setRideStep('SELECTION');
      return;
    }

    const ds = new google.maps.DirectionsService();
    ds.route({
      origin: pickup,
      destination: dropoff,
      travelMode: google.maps.TravelMode.DRIVING
    }, (result: any, status: any) => {
      if (status === 'OK' && result) {
        directionsRenderer.setDirections(result);
        const dist = (result.routes[0].legs[0].distance?.value || 0) / 1000;
        setDistance(dist);
        setRideStep('SELECTION');
        
        if (pickupMarker) pickupMarker.setMap(null);
        if (destMarker) destMarker.setMap(null);

        const pMarker = new google.maps.Marker({
          position: result.routes[0].legs[0].start_location,
          map: map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#10b981', fillOpacity: 1, strokeWeight: 4, strokeColor: '#fff', scale: 8
          }
        });
        const dMarker = new google.maps.Marker({
          position: result.routes[0].legs[0].end_location,
          map: map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#3b82f6', fillOpacity: 1, strokeWeight: 4, strokeColor: '#fff', scale: 8
          }
        });
        setPickupMarker(pMarker);
        setDestMarker(dMarker);
      } else {
        console.warn("Directions API failed, using calculated fallback.");
        setDistance(10.2);
        setRideStep('SELECTION');
      }
    });
  };

  const simulateRideUpdates = (rideId: string) => {
    const sequence = [
      { status: RideStatus.ACCEPTED, eta: 5, delay: 2000 },
      { status: RideStatus.ARRIVING, eta: 1, delay: 5000 },
      { status: RideStatus.IN_PROGRESS, eta: 12, delay: 8000 }
    ];

    sequence.forEach((step) => {
      setTimeout(async () => {
        await db.rides.updateStatus(rideId, step.status);
        setActiveRide(prev => prev ? { ...prev, status: step.status } : null);
        setEta(step.eta);
        
        if (step.status === RideStatus.ARRIVING && map && !isManualMode) {
          const driverLoc = { lat: map.getCenter().lat() + 0.002, lng: map.getCenter().lng() + 0.002 };
          const dMarker = new google.maps.Marker({
            position: driverLoc,
            map: map,
            label: { text: '🚗', fontSize: '24px' },
            title: "Tunde's Vehicle"
          });
          setDriverMarker(dMarker);
        }
      }, step.delay);
    });
  };

  const confirmRide = async () => {
    if (!currentUser) return;
    setRideStep('MATCHING');
    const fare = calculateFare(selectedType);
    const newRide = await db.rides.create({
       riderId: currentUser.id, pickup, dropoff, fare, distance, vehicleType: selectedType, status: RideStatus.REQUESTED
    });
    setActiveRide(newRide);
    setRideStep('ON_RIDE');
    simulateRideUpdates(newRide.id);
  };

  const calculateFare = (type: VehicleType) => {
    const multipliers: Record<string, number> = {
      [VehicleType.ECONOMY]: 1.0, [VehicleType.PREMIUM]: 2.2, [VehicleType.XL]: 1.8, [VehicleType.BIKE]: 0.7
    };
    const multiplier = multipliers[type] || 1.0;
    const base = Math.max(distance * pricePerKm * multiplier, 500);
    return Math.round(base);
  };

  const getStatusColor = (status: RideStatus) => {
    switch (status) {
      case RideStatus.ACCEPTED: return 'bg-blue-500';
      case RideStatus.ARRIVING: return 'bg-amber-500';
      case RideStatus.IN_PROGRESS: return 'bg-emerald-500';
      default: return 'bg-slate-900';
    }
  };

  return (
    <div className="h-full relative overflow-hidden bg-slate-50">
      <div ref={mapContainerRef} className="absolute inset-0 z-0 bg-slate-100 flex items-center justify-center">
        {isApiLoading && !isManualMode && (
          <div className="text-center z-10 p-8 bg-white/80 backdrop-blur rounded-[40px] shadow-2xl border border-white max-w-xs">
            <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden relative mx-auto mb-4">
               <div className="absolute inset-0 bg-blue-600 animate-loading-bar"></div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Booting Neural Grid...</p>
          </div>
        )}
        {(isManualMode || apiLoadError) && (
          <div className="flex flex-col items-center space-y-4 opacity-40 select-none">
             <MapPin className="w-24 h-24 text-slate-300" />
             <p className="font-black text-slate-400 uppercase tracking-widest text-[9px] text-center">Tracking System Offline<br/>Manual Addressing Enabled</p>
          </div>
        )}
      </div>

      {activeRide && rideStep === 'ON_RIDE' && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-6 animate-slide-top">
          <div className="bg-slate-900 text-white p-4 rounded-[28px] shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-xl bg-opacity-95">
             <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getStatusColor(activeRide.status)} shadow-lg shadow-blue-500/20`}>
                  {activeRide.status === RideStatus.IN_PROGRESS ? <Navigation className="w-6 h-6 animate-pulse" /> : <Car className="w-6 h-6" />}
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-0.5">Live Status</p>
                   <p className="text-lg font-black tracking-tight leading-none">
                     {activeRide.status === RideStatus.REQUESTED && "Broadcasting..."}
                     {activeRide.status === RideStatus.ACCEPTED && "Accepted"}
                     {activeRide.status === RideStatus.ARRIVING && "Approaching"}
                     {activeRide.status === RideStatus.IN_PROGRESS && "In Transit"}
                   </p>
                </div>
             </div>
             {eta !== null && (
               <div className="text-right pr-2">
                  <p className="text-[10px] font-black uppercase text-slate-500 mb-0.5">ETA</p>
                  <p className="text-xl font-black">{eta}m</p>
               </div>
             )}
          </div>
        </div>
      )}

      <div className={`absolute top-10 left-10 w-full max-w-sm z-10 space-y-4 transition-all duration-500 ${rideStep === 'ON_RIDE' ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
        <div className="bg-white p-6 rounded-[32px] shadow-2xl border border-slate-100 animate-fade-up">
           <div className="flex items-center space-x-3 mb-6">
              <Logo className="h-10 w-auto" />
              <div className="h-6 w-px bg-slate-100" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Neural Link</p>
           </div>
           
           <div className="space-y-4">
             <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500" />
                <input 
                  placeholder="Starting Point" 
                  value={pickup}
                  onChange={e => setPickup(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 transition"
                />
             </div>
             <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500" />
                <input 
                  placeholder="End Destination" 
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

      <div className={`absolute bottom-10 left-6 right-6 md:left-10 md:right-10 max-w-2xl mx-auto z-20 transition-all duration-700 transform ${rideStep !== 'INPUT' ? 'translate-y-0 opacity-100' : 'translate-y-96 opacity-0 pointer-events-none'}`}>
        <div className="bg-white p-6 md:p-10 rounded-[40px] md:rounded-[50px] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.3)] border border-white">
          {rideStep === 'MATCHING' ? (
            <div className="py-10 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-700">
               <div className="relative w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-blue-600/10 rounded-full animate-pulse" />
                  <div className="absolute inset-0 rounded-full overflow-hidden opacity-30"><div className="radar-scanner" /></div>
                  <Logo className="h-14 w-auto logo-ignition z-10" />
               </div>
               <div className="text-center">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight shimmer-text">Querying Fleet Matrix...</h3>
                  <p className="text-slate-400 font-bold mt-1 text-xs">Negotiating best available rate.</p>
               </div>
            </div>
          ) : rideStep === 'ON_RIDE' && activeRide ? (
            <div className="animate-in fade-in zoom-in duration-500">
               <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                  <div className="flex items-center space-x-5">
                     <div className="relative">
                        <img src="https://i.pravatar.cc/150?u=tunde" className="w-16 h-16 rounded-[24px] border-4 border-slate-50 shadow-xl object-cover" alt="Driver" />
                        <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-lg border-2 border-white"><Star className="w-2.5 h-2.5 fill-white" /></div>
                     </div>
                     <div>
                        <p className="text-xl font-black text-slate-900">Adebayo Tunde</p>
                        <div className="flex items-center space-x-2 mt-1">
                           <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase">Tesla Model 3</span>
                           <span className="text-[9px] font-black text-slate-400 border border-slate-100 px-2 py-0.5 rounded-md uppercase">LAG-777</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center space-x-3">
                     <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition shadow-sm"><Phone className="w-5 h-5" /></button>
                     <button className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition shadow-xl shadow-blue-500/20"><Shield className="w-5 h-5" /></button>
                  </div>
               </div>

               <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-slate-50 p-4 rounded-3xl text-center border border-slate-100/50">
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Fare</p>
                     <p className="text-lg font-black text-slate-900">₦{(activeRide.fare || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-3xl text-center border border-slate-100/50">
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Trip</p>
                     <p className="text-lg font-black text-slate-900">{(activeRide.distance || 0).toFixed(1)}km</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-3xl text-center border border-slate-100/50">
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Stars</p>
                     <p className="text-lg font-black text-slate-900">4.92</p>
                  </div>
               </div>

               <div className="flex space-x-3">
                  <button onClick={() => { setRideStep('INPUT'); setActiveRide(null); }} className="flex-1 py-4 bg-white border-2 border-slate-100 rounded-[20px] font-black text-red-500 hover:bg-red-50 transition text-sm">Cancel Trip</button>
                  <button className="flex-1 py-4 bg-slate-900 text-white rounded-[20px] font-black shadow-2xl hover:bg-blue-600 transition flex items-center justify-center space-x-2 text-sm">
                    <MoreHorizontal className="w-4 h-4" />
                    <span>Options</span>
                  </button>
               </div>
            </div>
          ) : (
            <div className="space-y-6">
               <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Available Fleet</h3>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{distance.toFixed(1)} KM Projected Journey</p>
                  </div>
                  <button onClick={() => setRideStep('INPUT')} className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition"><X className="w-4 h-4" /></button>
               </div>

               <div className="grid grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                  {[
                    { type: VehicleType.ECONOMY, name: 'Lite', icon: Car, color: 'text-slate-400' },
                    { type: VehicleType.PREMIUM, name: 'Elite', icon: Zap, color: 'text-blue-600' },
                    { type: VehicleType.XL, name: 'Spaceship', icon: Users, color: 'text-indigo-600' },
                    { type: VehicleType.BIKE, name: 'Rocket', icon: Navigation, color: 'text-orange-500' }
                  ].map((item) => {
                    const fare = calculateFare(item.type);
                    return (
                      <div 
                        key={item.type}
                        onClick={() => setSelectedType(item.type)}
                        className={`p-4 md:p-5 rounded-[24px] border-2 transition cursor-pointer flex flex-col justify-between ${selectedType === item.type ? 'border-blue-600 bg-blue-50/10' : 'border-transparent bg-slate-50 hover:bg-white hover:border-slate-100'}`}
                      >
                         <div className="flex justify-between items-start mb-4">
                            <div className={`p-2.5 bg-white rounded-xl shadow-sm ${item.color}`}><item.icon className="w-4 h-4" /></div>
                            <p className="text-xs font-black text-slate-900">₦{fare.toLocaleString()}</p>
                         </div>
                         <div>
                            <p className="font-black text-slate-900 text-xs">{item.name}</p>
                            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{item.type}</p>
                         </div>
                      </div>
                    );
                  })}
               </div>

               <button onClick={confirmRide} className="w-full bg-blue-600 text-white font-black py-4 rounded-[20px] hover:bg-blue-700 transition shadow-2xl shadow-blue-500/20">
                  Execute Booking
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ... History, Wallet, Profile components remain identical but with optional chaining for safety ...

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
    <div className="p-6 md:p-12 space-y-8 animate-in fade-in slide-in-from-right-10 duration-500 overflow-y-auto h-full pb-32">
      <h2 className="text-3xl font-black tracking-tight text-slate-900">Neural Log</h2>
      <div className="space-y-4">
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-28 bg-slate-50 rounded-[30px]"></div>)}
          </div>
        ) : rides.length === 0 ? (
          <div className="py-20 text-center space-y-4">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300"><History className="w-8 h-8" /></div>
             <p className="font-bold text-slate-400">Memory bank is empty.</p>
          </div>
        ) : (
          rides.map(ride => (
            <div key={ride.id} className="bg-white p-6 rounded-[30px] border border-slate-100 flex items-center justify-between hover:shadow-xl transition-all group">
              <div className="flex items-center space-x-5">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  <MapPin className="text-slate-400 group-hover:text-blue-600 w-6 h-6" />
                </div>
                <div>
                   <div className="flex items-center space-x-2">
                      <p className="font-black text-slate-900 text-base">{(ride.dropoff || 'Location').split(',')[0]}</p>
                      <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded font-black text-slate-400">{(ride.distance || 0).toFixed(1)} KM</span>
                   </div>
                  <p className="text-[10px] text-slate-400 font-bold">{new Date(ride.createdAt).toLocaleDateString()} • {ride.vehicleType}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-slate-900">₦{(ride.fare || 0).toLocaleString()}</p>
                <p className={`text-[9px] font-black uppercase tracking-widest ${ride.status === 'COMPLETED' ? 'text-emerald-500' : 'text-blue-500'}`}>{ride.status}</p>
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
    <div className="p-6 md:p-12 space-y-12 animate-in fade-in slide-in-from-right-10 duration-500 overflow-y-auto h-full pb-32">
      <h2 className="text-3xl font-black tracking-tight text-slate-900">Neural Credits</h2>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-8 md:p-10 rounded-[40px] text-white relative overflow-hidden shadow-2xl">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Platform Liquidity</p>
          <p className="text-4xl font-black mb-10">₦{(currentUser?.balance || 0).toLocaleString()}</p>
          <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black hover:bg-blue-600 hover:text-white transition-all">Inject Funds</button>
        </div>
        <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 flex flex-col justify-center">
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Settlement Node</p>
           <div className="flex items-center space-x-4">
             <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center font-black text-[10px]">VISA</div>
             <p className="font-black text-lg text-slate-900">**** 4422</p>
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

  return (
    <div className="p-6 md:p-12 space-y-12 animate-in fade-in slide-in-from-right-10 duration-500 overflow-y-auto h-full pb-32">
      <h2 className="text-3xl font-black tracking-tight text-slate-900">Identity Matrix</h2>
      <div className="lg:col-span-2 space-y-8 max-w-3xl">
          <form onSubmit={handleUpdate} className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
             <div className="flex items-center space-x-6">
                <img src={formData.avatar} className="w-24 h-24 rounded-[32px] border-4 border-slate-50 shadow-xl object-cover" />
                <div>
                   <h3 className="text-2xl font-black text-slate-900">{formData.name || 'Rider'}</h3>
                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">Secure Node</span>
                </div>
             </div>
             <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                   <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Full Identity</label>
                   <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} disabled={!isEditing} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 transition disabled:opacity-50" />
                </div>
                <div className="space-y-1">
                   <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Phone Link</label>
                   <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} disabled={!isEditing} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 transition disabled:opacity-50" />
                </div>
             </div>
             <div className="flex justify-end pt-4">
                <button type="button" onClick={() => setIsEditing(!isEditing)} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition">
                  {isEditing ? 'Discard Changes' : 'Modify Identity'}
                </button>
                {isEditing && (
                  <button type="submit" disabled={isLoading} className="ml-4 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20">
                    Commit Changes
                  </button>
                )}
             </div>
          </form>
      </div>
    </div>
  );
};

const RiderDashboard: React.FC = () => {
  const { logout } = useApp();
  console.log("RiderDashboard component mounting...");
  
  const navItems = [
    { to: '/rider', icon: Navigation, label: 'Book Ride', end: true },
    { to: '/rider/history', icon: History, label: 'Logs' },
    { to: '/rider/wallet', icon: Wallet, label: 'Wallet' },
    { to: '/rider/profile', icon: UserIcon, label: 'Identity' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <div className="w-20 md:w-72 bg-white border-r border-slate-100 flex flex-col items-center py-10 md:py-12 shrink-0">
        <div className="mb-10 px-4 w-full flex justify-center">
          <Logo className="h-10 md:h-16 w-auto" />
        </div>
        <nav className="flex-1 flex flex-col space-y-3 w-full px-4">
          {navItems.map((item) => (
            <NavLink 
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `
                flex items-center justify-center md:justify-start md:space-x-5 p-4 md:p-5 rounded-[20px] md:rounded-[24px] transition-all group
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-xl' 
                  : 'text-slate-400 hover:bg-blue-50 hover:text-blue-600'}
              `}
            >
              <item.icon className="w-6 h-6 shrink-0" />
              <span className="hidden md:block font-black uppercase tracking-[0.2em] text-[10px]">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto px-4 w-full space-y-6 text-center">
           <button onClick={logout} className="flex items-center justify-center md:space-x-4 w-full p-4 rounded-2xl text-red-400 hover:bg-red-50 transition font-black text-[10px] uppercase tracking-widest">
             <LogOut className="w-6 h-6" />
             <span className="hidden md:block">Terminate</span>
           </button>
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
