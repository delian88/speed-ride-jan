
import React, { useState, useEffect, useRef } from 'react';
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

const MINNA_COORDS = { lat: 9.6139, lng: 6.5569 };

const RiderExplore: React.FC<{ onLocationUpdate: (city: string) => void }> = ({ onLocationUpdate }) => {
  const { currentUser } = useApp();
  const [rideStep, setRideStep] = useState<'INPUT' | 'MATCHING' | 'ON_RIDE'>('INPUT');
  const [pickup, setPickup] = useState('Locating your position...');
  const [dropoff, setDropoff] = useState('');
  const [distance, setDistance] = useState(0);
  const [selectedType, setSelectedType] = useState<VehicleType>(VehicleType.ECONOMY);
  const [pricePerKm, setPricePerKm] = useState(2000); 
  const [paymentMethod, setPaymentMethod] = useState<'WALLET' | 'CARD'>('WALLET');

  // Map Refs
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const directionsRendererRef = useRef<any>(null);
  const pickupMarkerRef = useRef<any>(null);
  const dropoffMarkerRef = useRef<any>(null);
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const dropoffInputRef = useRef<HTMLInputElement>(null);

  const updateMapBounds = () => {
    if (!mapRef.current) return;
    const bounds = new google.maps.LatLngBounds();
    let hasCoords = false;
    
    if (pickupMarkerRef.current?.getPosition()) {
      bounds.extend(pickupMarkerRef.current.getPosition());
      hasCoords = true;
    }
    if (dropoffMarkerRef.current?.getPosition()) {
      bounds.extend(dropoffMarkerRef.current.getPosition());
      hasCoords = true;
    }

    if (hasCoords) {
      mapRef.current.fitBounds(bounds, { top: 120, bottom: 120, left: 120, right: 120 });
    }
  };

  const getRoute = (origin: any, destination: string) => {
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
    db.settings.get().then(s => setPricePerKm(s?.pricePerKm || 2000));

    const initMap = () => {
      if (mapContainerRef.current && typeof google !== 'undefined' && google.maps) {
        mapRef.current = new google.maps.Map(mapContainerRef.current, {
          center: MINNA_COORDS,
          zoom: 15,
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
          position: MINNA_COORDS,
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

        const autocompleteOptions = {
          componentRestrictions: { country: "NG" },
          fields: ["formatted_address", "geometry", "name"],
          location: new google.maps.LatLng(MINNA_COORDS.lat, MINNA_COORDS.lng),
          radius: 50000,
        };

        if (google.maps.places) {
          const pAuto = new google.maps.places.Autocomplete(pickupInputRef.current, autocompleteOptions);
          pAuto.addListener('place_changed', () => {
            const place = pAuto.getPlace();
            if (place.geometry) {
              setPickup(place.formatted_address || place.name);
              pickupMarkerRef.current.setPosition(place.geometry.location);
              pickupMarkerRef.current.setMap(mapRef.current);
              updateMapBounds();
              if (dropoff) getRoute(place.geometry.location, dropoff);
            }
          });

          const dAuto = new google.maps.places.Autocomplete(dropoffInputRef.current, autocompleteOptions);
          dAuto.addListener('place_changed', () => {
            const place = dAuto.getPlace();
            if (place.geometry) {
              setDropoff(place.formatted_address || place.name);
              dropoffMarkerRef.current.setPosition(place.geometry.location);
              dropoffMarkerRef.current.setMap(mapRef.current);
              updateMapBounds();
              if (pickup) getRoute(pickupMarkerRef.current.getPosition(), place.formatted_address || place.name);
            }
          });
        }

        // Real-time Geolocation Logic
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const center = { lat: pos.coords.latitude, lng: pos.coords.longitude };
              mapRef.current.setCenter(center);
              pickupMarkerRef.current.setPosition(center);
              
              const geocoder = new google.maps.Geocoder();
              geocoder.geocode({ location: center }, (results: any, status: any) => {
                if (status === "OK" && results[0]) {
                  const address = results[0].formatted_address;
                  setPickup(address);
                  const city = results[0].address_components.find((c: any) => c.types.includes("locality"))?.long_name || "Minna";
                  onLocationUpdate(`${city}, Nigeria`);
                }
              });
            },
            () => {
              setPickup("Minna, Niger State");
              onLocationUpdate("Minna, Nigeria");
            }
          );
        }
      }
    };

    const interval = setInterval(() => {
      if (typeof google !== 'undefined' && google.maps) {
        initMap();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const calculateFare = (type: VehicleType) => {
    const multipliers: Record<string, number> = {
      [VehicleType.ECONOMY]: 1.0, [VehicleType.PREMIUM]: 1.5, [VehicleType.XL]: 2.0, [VehicleType.BIKE]: 0.5
    };
    const multiplier = multipliers[type] || 1.0;
    const calculated = distance * 2000 * multiplier; // Enforced 2000/km
    return Math.max(calculated, 1000); 
  };

  const currentFare = calculateFare(selectedType);

  return (
    <div className="flex h-full w-full bg-white">
      <div className="w-[420px] h-full flex flex-col border-r border-slate-100 shadow-2xl z-10 overflow-y-auto custom-scrollbar bg-white">
        <div className="p-8 space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-slate-900 mb-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-sm tracking-tight">Pickup Point</span>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]"></div>
                <input 
                  ref={pickupInputRef}
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Where are you?"
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
                <span className="font-bold text-sm tracking-tight">Drop-off Point</span>
              </div>
              <div className="relative group">
                <input 
                  ref={dropoffInputRef}
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  placeholder="Where to?"
                  className="w-full pl-5 pr-10 py-4 bg-slate-50 border border-slate-100 rounded-xl font-medium text-sm focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition">
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { type: VehicleType.ECONOMY, label: 'Economy', img: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=200&q=80' },
              { type: VehicleType.PREMIUM, label: 'Premium', img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&q=80' },
              { type: VehicleType.XL, label: 'SUV', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=200&q=80' }
            ].map((v) => (
              <div 
                key={v.type}
                onClick={() => setSelectedType(v.type)}
                className={`cursor-pointer rounded-xl border-2 transition-all overflow-hidden ${selectedType === v.type ? 'border-blue-600 bg-blue-50/20' : 'border-slate-100 hover:border-slate-200'}`}
              >
                <div className="h-16 relative overflow-hidden bg-slate-100">
                  <img src={v.img} className="w-full h-full object-cover" />
                </div>
                <div className={`p-3 text-center ${selectedType === v.type ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                  <p className="text-[10px] font-black uppercase tracking-widest">{v.label}</p>
                  <p className="text-xs font-bold mt-1">₦{Math.round(calculateFare(v.type)).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-6 space-y-4">
            <div className="flex justify-between items-center group cursor-pointer">
              <span className="font-bold text-slate-500 text-sm">Fare Breakdown</span>
              <ChevronDown className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-medium">Trip Distance</span>
                <span className="font-bold text-slate-900">{distance.toFixed(2)} KM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-medium">Price/KM</span>
                <span className="font-bold text-slate-900">₦2,000</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-900 font-black text-sm uppercase tracking-widest">Total Price</span>
                <span className="text-2xl font-black text-slate-900">₦{Math.round(currentFare).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setPaymentMethod('WALLET')}
                className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'WALLET' ? 'border-blue-600 bg-blue-50/20' : 'border-slate-50 bg-slate-50 text-slate-400'}`}
              >
                <Wallet className={`w-4 h-4 ${paymentMethod === 'WALLET' ? 'text-blue-600' : ''}`} />
                <span className="text-[10px] font-black uppercase">Wallet</span>
              </button>
              <button 
                onClick={() => setPaymentMethod('CARD')}
                className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'CARD' ? 'border-blue-600 bg-blue-50/20' : 'border-slate-50 bg-slate-50 text-slate-400'}`}
              >
                <CreditCard className={`w-4 h-4 ${paymentMethod === 'CARD' ? 'text-blue-600' : ''}`} />
                <span className="text-[10px] font-black uppercase">Card</span>
              </button>
            </div>
          </div>

          <button 
            onClick={() => setRideStep('MATCHING')}
            disabled={!pickup || !dropoff || distance === 0}
            className="w-full py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30"
          >
            {rideStep === 'MATCHING' ? 'Syncing Nearest Pilot...' : 'Request Ride Now'}
          </button>
        </div>
      </div>

      <div className="flex-1 relative bg-slate-100">
        <div ref={mapContainerRef} className="absolute inset-0 z-0" />
        <div className="absolute bottom-10 right-10 flex flex-col space-y-3 z-20">
          <div className="flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            <button onClick={() => mapRef.current?.setZoom((mapRef.current?.getZoom() || 15) + 1)} className="p-4 hover:bg-slate-50 transition text-slate-400 hover:text-slate-900 border-b border-slate-50"><Plus className="w-6 h-6" /></button>
            <button onClick={() => mapRef.current?.setZoom((mapRef.current?.getZoom() || 15) - 1)} className="p-4 hover:bg-slate-50 transition text-slate-400 hover:text-slate-900"><Minus className="w-6 h-6" /></button>
          </div>
          <button onClick={() => updateMapBounds()} className="p-4 bg-white rounded-2xl shadow-2xl border border-slate-100 hover:bg-slate-50 transition text-slate-400 hover:text-blue-600">
            <RefreshCw className="w-6 h-6" />
          </button>
        </div>

        {rideStep === 'MATCHING' && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-900/10 backdrop-blur-sm">
            <div className="bg-white p-12 rounded-[60px] shadow-2xl flex flex-col items-center space-y-6 animate-in zoom-in duration-500">
               <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center animate-pulse">
                 <Search className="w-12 h-12" />
               </div>
               <div className="text-center">
                 <p className="text-2xl font-black text-slate-900 tracking-tight">Syncing Nearest Pilot</p>
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1">Minna Regional Fleet v4.0</p>
               </div>
               <button onClick={() => setRideStep('INPUT')} className="text-red-500 font-black text-xs uppercase tracking-widest hover:underline mt-4">Cancel Request</button>
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
  const [currentCity, setCurrentCity] = useState('Minna, Nigeria');

  if (!currentUser) return null;
  
  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="h-20 bg-slate-900 text-white flex items-center justify-between px-8 z-50 shrink-0 shadow-2xl">
        <div className="flex items-center space-x-12">
          <Logo className="h-10 w-auto brightness-0 invert" />
          <div className="hidden md:flex items-center space-x-3 bg-white/5 px-6 py-3 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-black uppercase tracking-widest">{currentCity}</span>
            <ChevronDown className="w-3 h-3 text-white/40" />
          </div>
        </div>

        <nav className="hidden lg:flex items-center space-x-10 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
           <NavLink to="/rider" end className={({isActive}) => isActive ? "text-white" : "hover:text-white transition"}>Dashboard</NavLink>
           <NavLink to="/rider/history" className={({isActive}) => isActive ? "text-white" : "hover:text-white transition"}>Journeys</NavLink>
           <NavLink to="/rider/wallet" className={({isActive}) => isActive ? "text-white" : "hover:text-white transition"}>Wallet</NavLink>
        </nav>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4 pl-6 border-l border-white/5">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-blue-400">₦{currentUser.balance.toLocaleString()}</p>
             </div>
             <div className="relative group">
               <button className="flex items-center space-x-3 p-1.5 pr-4 bg-white/5 rounded-2xl border border-white/5">
                  <img src={currentUser.avatar} className="w-10 h-10 rounded-xl object-cover" />
                  <ChevronDown className="w-3 h-3 text-white/40" />
               </button>
               <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 text-slate-900">
                  <button onClick={() => navigate('/rider/profile')} className="w-full flex items-center space-x-3 px-5 py-3 hover:bg-slate-50 transition font-black text-xs uppercase tracking-widest"><UserIcon className="w-4 h-4" /> <span>Profile</span></button>
                  <button onClick={logout} className="w-full flex items-center space-x-3 px-5 py-3 hover:bg-red-50 text-red-600 transition font-black text-xs uppercase tracking-widest"><LogOut className="w-4 h-4" /> <span>Logout</span></button>
               </div>
             </div>
          </div>
        </div>
      </header>

      <div className="flex-1 relative overflow-hidden">
        <Routes>
          <Route index element={<RiderExplore onLocationUpdate={setCurrentCity} />} />
          <Route path="history" element={<div className="p-10 text-center font-black">Coming Soon</div>} />
          <Route path="wallet" element={<div className="p-10 text-center font-black">Coming Soon</div>} />
          <Route path="profile" element={<div className="p-10 text-center font-black">Coming Soon</div>} />
        </Routes>
      </div>
    </div>
  );
};

export default RiderDashboard;
