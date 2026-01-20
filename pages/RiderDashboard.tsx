
import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { 
  MapPin, Navigation, History, Wallet, LogOut,
  Car, Zap, Phone, User as UserIcon, CheckCircle, ChevronRight,
  Plus, ShieldCheck, Mail, Star, X,
  Search, Locate, Users, Clock, Shield, MoreHorizontal, 
  AlertTriangle, AlertCircle, Bell, ChevronDown, CreditCard,
  RefreshCw, Minus, Loader2, Activity
} from 'lucide-react';
import { useApp } from '../App';
import { RideStatus, VehicleType, User as UserType, RideRequest } from '../types';
import { db } from '../database';
import Logo from '../components/Logo';

declare var google: any;

// Minna, Niger State Coordinates (Central point near FUT Minna/Shiroro Hotel area)
const MINNA_COORDS = { lat: 9.6139, lng: 6.5569 };

const RiderExplore: React.FC<{ onLocationUpdate: (city: string) => void }> = ({ onLocationUpdate }) => {
  const { currentUser } = useApp();
  const [rideStep, setRideStep] = useState<'INPUT' | 'MATCHING' | 'ON_RIDE'>('INPUT');
  const [pickup, setPickup] = useState('Fetching current location...');
  const [dropoff, setDropoff] = useState('');
  const [distance, setDistance] = useState(0);
  const [selectedType, setSelectedType] = useState<VehicleType>(VehicleType.ECONOMY);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
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
    } else {
      mapRef.current.setCenter(MINNA_COORDS);
      mapRef.current.setZoom(15);
    }
  };

  const getRoute = (origin: any, destination: string) => {
    if (!origin || !destination || !google?.maps) return;
    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result: any, status: any) => {
        if (status === 'OK') {
          // Temporarily hide markers to show clean route
          if (pickupMarkerRef.current) pickupMarkerRef.current.setMap(null);
          if (dropoffMarkerRef.current) dropoffMarkerRef.current.setMap(null);
          directionsRendererRef.current.setDirections(result);
          const route = result.routes[0].legs[0];
          setDistance(route.distance.value / 1000);
        } else {
          console.error("Directions request failed due to " + status);
        }
      }
    );
  };

  const initMap = () => {
    if (!mapContainerRef.current || typeof google === 'undefined' || !google.maps) {
      setMapError("Google Maps API is not loading. Check your internet or API key in index.html.");
      return;
    }

    try {
      // Create map instance
      mapRef.current = new google.maps.Map(mapContainerRef.current, {
        center: MINNA_COORDS,
        zoom: 15,
        disableDefaultUI: true,
        clickableIcons: false,
        styles: [
          { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#cbd5e1" }] },
          { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f1f5f9" }] },
          { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }
        ]
      });

      // Initialize route renderer
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: { strokeColor: "#2563eb", strokeWeight: 6, strokeOpacity: 0.8 }
      });
      directionsRendererRef.current.setMap(mapRef.current);

      // Create persistent markers
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

      // Autocomplete setup
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
            const addr = place.formatted_address || place.name;
            setPickup(addr);
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
            const addr = place.formatted_address || place.name;
            setDropoff(addr);
            dropoffMarkerRef.current.setPosition(place.geometry.location);
            dropoffMarkerRef.current.setMap(mapRef.current);
            updateMapBounds();
            if (pickup) getRoute(pickupMarkerRef.current.getPosition(), addr);
          }
        });
      }

      setMapLoaded(true);
      requestUserLocation();
    } catch (err) {
      console.error("Map initialization failed:", err);
      setMapError("Interface failure. Check console for details.");
    }
  };

  const requestUserLocation = () => {
    if (navigator.geolocation) {
      setPickup("Locating you...");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const center = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          if (mapRef.current) {
            mapRef.current.setCenter(center);
            pickupMarkerRef.current.setPosition(center);
          }
          
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: center }, (results: any, status: any) => {
            if (status === "OK" && results[0]) {
              const address = results[0].formatted_address;
              setPickup(address);
              const city = results[0].address_components.find((c: any) => c.types.includes("locality"))?.long_name || "Minna";
              onLocationUpdate(`${city}, Nigeria`);
            } else {
              setPickup(`${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}`);
            }
          });
        },
        (error) => {
          console.warn("Geolocation permission or error:", error);
          setPickup("Minna, Niger State (GPS Disabled)");
          onLocationUpdate("Minna, Nigeria");
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else {
      setPickup("Minna, Niger State");
    }
  };

  useEffect(() => {
    // Polling for Google Maps availability
    let attempts = 0;
    const checkGoogle = setInterval(() => {
      attempts++;
      if (typeof google !== 'undefined' && google.maps) {
        initMap();
        clearInterval(checkGoogle);
      }
      if (attempts > 20) { // 10 seconds timeout
        clearInterval(checkGoogle);
        if (!mapLoaded) {
          setMapError("Google Maps script failed to load. Please ensure your API key is valid.");
        }
      }
    }, 500);

    return () => clearInterval(checkGoogle);
  }, []);

  const calculateFare = (type: VehicleType) => {
    const multipliers: Record<string, number> = {
      [VehicleType.ECONOMY]: 1.0, [VehicleType.PREMIUM]: 1.5, [VehicleType.XL]: 2.0, [VehicleType.BIKE]: 0.5
    };
    const multiplier = multipliers[type] || 1.0;
    // Strictly enforced ₦2,000/KM as per requirement
    const calculated = distance * 2000 * multiplier;
    return Math.max(calculated, 1000); 
  };

  const currentFare = calculateFare(selectedType);

  return (
    <div className="flex h-full w-full bg-white relative">
      {/* Sidebar Controls */}
      <div className="w-[420px] h-full flex flex-col border-r border-slate-100 shadow-2xl z-20 overflow-y-auto custom-scrollbar bg-white">
        <div className="p-8 space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-slate-900 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-black text-xs uppercase tracking-widest">Pickup Location</span>
              </div>
              <div className="relative group">
                <input 
                  ref={pickupInputRef}
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Street name in Minna..."
                  className="w-full pl-6 pr-12 py-5 bg-slate-50 border border-slate-100 rounded-[24px] font-bold text-sm focus:ring-4 focus:ring-blue-600/5 outline-none transition-all"
                />
                <button 
                  onClick={requestUserLocation}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 p-2 transition"
                >
                  <Locate className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-slate-900 mb-2">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-red-500" />
                </div>
                <span className="font-black text-xs uppercase tracking-widest">Where to?</span>
              </div>
              <div className="relative group">
                <input 
                  ref={dropoffInputRef}
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  placeholder="Destination in Niger State..."
                  className="w-full pl-6 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[24px] font-bold text-sm focus:ring-4 focus:ring-blue-600/5 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Matrix */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { type: VehicleType.ECONOMY, label: 'Standard', img: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=200&q=80' },
              { type: VehicleType.PREMIUM, label: 'Elite', img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&q=80' },
              { type: VehicleType.XL, label: 'Fleet XL', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=200&q=80' }
            ].map((v) => (
              <div 
                key={v.type}
                onClick={() => setSelectedType(v.type)}
                className={`cursor-pointer rounded-[24px] border-2 transition-all overflow-hidden ${selectedType === v.type ? 'border-blue-600 bg-blue-50/20 shadow-xl' : 'border-slate-50 hover:border-slate-200'}`}
              >
                <div className="h-20 relative overflow-hidden bg-slate-100">
                  <img src={v.img} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition" />
                </div>
                <div className={`p-3 text-center ${selectedType === v.type ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                  <p className="text-[9px] font-black uppercase tracking-widest leading-none mb-1">{v.label}</p>
                  <p className="text-xs font-black">₦{Math.round(calculateFare(v.type)).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Economics */}
          <div className="bg-slate-50 rounded-[32px] p-8 space-y-4">
            <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-400">
              <span>Ride Telemetry</span>
              <Activity className="w-4 h-4" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-bold">Estimated Distance</span>
                <span className="font-black text-slate-900">{distance.toFixed(1)} KM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-bold">Regional Rate</span>
                <span className="font-black text-blue-600">₦2,000 / KM</span>
              </div>
              <div className="pt-4 border-t border-slate-200 flex justify-between items-end">
                <span className="text-slate-900 font-black text-sm uppercase tracking-widest">Net Fare</span>
                <span className="text-3xl font-black text-slate-900 tracking-tighter">₦{Math.round(currentFare).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setRideStep('MATCHING')}
            disabled={!pickup || !dropoff || distance === 0}
            className="w-full py-6 bg-slate-900 text-white rounded-[28px] font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          >
            {rideStep === 'MATCHING' ? 'Dispatching...' : 'Request Pilot'}
          </button>
        </div>
      </div>

      {/* Map Content Viewport */}
      <div className="flex-1 relative bg-slate-50 overflow-hidden">
        <div ref={mapContainerRef} className={`absolute inset-0 z-0 transition-opacity duration-1000 ${mapLoaded ? 'opacity-100' : 'opacity-0'}`} />
        
        {/* State Overlays */}
        {!mapLoaded && !mapError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white">
             <div className="relative mb-8">
               <Logo className="h-32 w-auto animate-pulse" />
               <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full"></div>
             </div>
             <div className="flex items-center space-x-3 text-slate-400 font-black text-xs uppercase tracking-[0.4em]">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Synchronizing Minna Fleet Map...</span>
             </div>
          </div>
        )}

        {mapError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50 p-10 text-center">
             <div className="p-6 bg-red-50 text-red-500 rounded-[40px] mb-6">
                <AlertCircle className="w-16 h-16" />
             </div>
             <h3 className="text-2xl font-black text-slate-900 mb-2">Map Interface offline</h3>
             <p className="text-slate-500 font-bold max-w-sm mb-8">{mapError}</p>
             <button onClick={() => window.location.reload()} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition">Attempt Hard Reset</button>
          </div>
        )}

        {mapLoaded && (
          <>
            <div className="absolute bottom-10 right-10 flex flex-col space-y-3 z-20">
              <div className="flex flex-col bg-white rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden">
                <button onClick={() => mapRef.current?.setZoom((mapRef.current?.getZoom() || 15) + 1)} className="p-5 hover:bg-slate-50 transition text-slate-400 hover:text-slate-900 border-b border-slate-100"><Plus className="w-6 h-6" /></button>
                <button onClick={() => mapRef.current?.setZoom((mapRef.current?.getZoom() || 15) - 1)} className="p-5 hover:bg-slate-50 transition text-slate-400 hover:text-slate-900"><Minus className="w-6 h-6" /></button>
              </div>
              <button onClick={() => updateMapBounds()} className="p-5 bg-white rounded-[24px] shadow-2xl border border-slate-100 hover:bg-blue-50 transition text-slate-400 hover:text-blue-600">
                <RefreshCw className="w-6 h-6" />
              </button>
            </div>
          </>
        )}

        {/* Dispatch Matching Overlay */}
        {rideStep === 'MATCHING' && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-500">
            <div className="bg-white p-12 rounded-[64px] shadow-2xl flex flex-col items-center space-y-8 animate-in zoom-in duration-700 max-w-md text-center">
               <div className="relative">
                 <div className="w-32 h-32 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center animate-pulse">
                   <Search className="w-16 h-16" />
                 </div>
                 <div className="absolute -inset-4 border-4 border-blue-600/20 rounded-full animate-ping"></div>
               </div>
               <div>
                 <p className="text-3xl font-black text-slate-900 tracking-tight">Syncing Nearest Pilot</p>
                 <p className="text-xs text-slate-400 font-black uppercase tracking-[0.4em] mt-2">Minna Dispatch Hub v8.0</p>
               </div>
               <button onClick={() => setRideStep('INPUT')} className="text-red-500 font-black text-[10px] uppercase tracking-[0.3em] hover:text-red-600 mt-4 px-6 py-2 rounded-full hover:bg-red-50 transition">Cancel Link</button>
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
      <header className="h-20 bg-slate-900 text-white flex items-center justify-between px-8 z-50 shrink-0 shadow-2xl border-b border-white/5">
        <div className="flex items-center space-x-12">
          <Logo className="h-10 w-auto brightness-0 invert" />
          <div className="hidden md:flex items-center space-x-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10 transition group">
            <MapPin className="w-4 h-4 text-blue-500 group-hover:scale-110 transition" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{currentCity}</span>
            <ChevronDown className="w-3 h-3 text-white/40" />
          </div>
        </div>

        <nav className="hidden lg:flex items-center space-x-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
           <NavLink to="/rider" end className={({isActive}) => isActive ? "text-white" : "hover:text-white transition"}>Booking Hub</NavLink>
           <NavLink to="/rider/history" className={({isActive}) => isActive ? "text-white" : "hover:text-white transition"}>Journey Logs</NavLink>
           <NavLink to="/rider/wallet" className={({isActive}) => isActive ? "text-white" : "hover:text-white transition"}>Transactions</NavLink>
        </nav>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4 pl-6 border-l border-white/5">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-blue-400">₦{currentUser.balance.toLocaleString()}</p>
             </div>
             <div className="relative group">
               <button className="flex items-center space-x-3 p-1.5 pr-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition">
                  <img src={currentUser.avatar} className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/10" />
                  <ChevronDown className="w-3 h-3 text-white/40 group-hover:rotate-180 transition" />
               </button>
               <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-3 text-slate-900 z-[100]">
                  <div className="px-6 py-4 border-b border-slate-50 mb-2">
                     <p className="font-black text-sm">{currentUser.name}</p>
                     <p className="text-[10px] font-bold text-slate-400">{currentUser.email}</p>
                  </div>
                  <button onClick={() => navigate('/rider/profile')} className="w-full flex items-center space-x-4 px-6 py-4 hover:bg-slate-50 transition font-black text-[10px] uppercase tracking-widest text-slate-600"><UserIcon className="w-4 h-4" /> <span>Account Hub</span></button>
                  <button onClick={logout} className="w-full flex items-center space-x-4 px-6 py-4 hover:bg-red-50 text-red-600 transition font-black text-[10px] uppercase tracking-widest border-t border-slate-50 mt-2"><LogOut className="w-4 h-4" /> <span>Close Session</span></button>
               </div>
             </div>
          </div>
        </div>
      </header>

      <div className="flex-1 relative overflow-hidden">
        <Routes>
          <Route index element={<RiderExplore onLocationUpdate={setCurrentCity} />} />
          <Route path="history" element={<div className="p-20 text-center flex flex-col items-center justify-center space-y-6"><div className="p-10 bg-slate-50 rounded-full"><Clock className="w-16 h-16 text-slate-200" /></div><p className="text-2xl font-black text-slate-900">Journey history unavailable.</p></div>} />
          <Route path="wallet" element={<div className="p-20 text-center flex flex-col items-center justify-center space-y-6"><div className="p-10 bg-slate-50 rounded-full"><Wallet className="w-16 h-16 text-slate-200" /></div><p className="text-2xl font-black text-slate-900">Wallet telemetry offline.</p></div>} />
          <Route path="profile" element={<div className="p-20 text-center flex flex-col items-center justify-center space-y-6"><div className="p-10 bg-slate-50 rounded-full"><UserIcon className="w-16 h-16 text-slate-200" /></div><p className="text-2xl font-black text-slate-900">Identity node sync pending.</p></div>} />
        </Routes>
      </div>
    </div>
  );
};

export default RiderDashboard;
