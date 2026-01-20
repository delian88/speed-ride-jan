
import React, { useState, useEffect, useRef, ReactNode, Component } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
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

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

// Fix: Use the named Component import directly to ensure setState and props are correctly inherited and typed
class DashboardErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Dashboard Collision Detected:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-10 text-center bg-slate-50">
          <div className="p-10 bg-white rounded-[40px] shadow-2xl border border-slate-100 max-w-md w-full animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
              <AlertTriangle className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tighter">Interface Collision</h1>
            <p className="text-slate-500 font-bold mb-8 text-sm leading-relaxed">
              The neural map encountered a DOM conflict. We've isolated the graphics engine to prevent further synchronization issues.
            </p>
            <div className="bg-slate-900 text-blue-400 p-5 rounded-2xl text-[11px] font-mono text-left mb-8 overflow-x-auto border border-blue-500/20">
               {this.state.error?.message || "Internal Node Error"}
            </div>
            <button 
              onClick={() => {
                // Use setState to reset error state
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }} 
              className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-200"
            >
              Reboot Graphics Engine
            </button>
          </div>
        </div>
      );
    }
    // Return children prop correctly
    return this.props.children;
  }
}

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
  const [isManualMode, setIsManualMode] = useState(false);
  const [eta, setEta] = useState<number>(0);

  // Core Map Refs
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const directionsRendererRef = useRef<any>(null);
  const driverMarkerRef = useRef<any>(null);
  const pickupMarkerRef = useRef<any>(null);
  const driverMarkerRef_2 = useRef<any>(null); // renamed to avoid potential duplicate (manual check)
  const pickupMarkerRef_2 = useRef<any>(null); // renamed to avoid potential duplicate (manual check)
  const dropoffMarkerRef = useRef<any>(null);
  const animationRef = useRef<number | null>(null);

  // Input Refs for Autocomplete
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const dropoffInputRef = useRef<HTMLInputElement>(null);

  // Helper to adjust map bounds to show markers
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
      mapRef.current.fitBounds(bounds, { top: 100, bottom: 100, left: 100, right: 100 });
      // If only one marker, zoom out slightly from max fit
      if (pickup && !dropoff || !pickup && dropoff) {
        setTimeout(() => mapRef.current.setZoom(15), 100);
      }
    }
  };

  const getRoute = (origin: string, destination: string) => {
    if (!origin || !destination || isManualMode) return;

    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result: any, status: any) => {
        if (status === 'OK') {
          // Hide individual markers as renderer handles them
          if (pickupMarkerRef.current) pickupMarkerRef.current.setMap(null);
          if (dropoffMarkerRef.current) dropoffMarkerRef.current.setMap(null);
          
          directionsRendererRef.current.setDirections(result);
          const route = result.routes[0].legs[0];
          setDistance(route.distance.value / 1000);
          setRideStep('SELECTION');
        }
      }
    );
  };

  useEffect(() => {
    db.settings.get().then(s => setPricePerKm(s?.pricePerKm || 350));

    let attempts = 0;
    const tryInitMap = () => {
      if (mapContainerRef.current && typeof google !== 'undefined' && google.maps) {
        try {
          if (!mapRef.current) {
            mapRef.current = new google.maps.Map(mapContainerRef.current, {
              center: { lat: 6.5244, lng: 3.3792 },
              zoom: 14,
              disableDefaultUI: true,
              styles: [
                { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] },
                { featureType: "water", elementType: "geometry", stylers: [{ color: "#e2e8f0" }] },
                { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f8fafc" }] }
              ]
            });

            directionsRendererRef.current = new google.maps.DirectionsRenderer({
              suppressMarkers: false,
              polylineOptions: {
                strokeColor: "#2563eb",
                strokeWeight: 6,
                strokeOpacity: 0.8
              }
            });
            directionsRendererRef.current.setMap(mapRef.current);

            // Setup Markers
            pickupMarkerRef.current = new google.maps.Marker({
              map: mapRef.current,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#2563eb",
                fillOpacity: 1,
                strokeColor: "white",
                strokeWeight: 2,
              },
              title: "Pickup"
            });

            dropoffMarkerRef.current = new google.maps.Marker({
              map: mapRef.current,
              icon: {
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                scale: 5,
                fillColor: "#ef4444",
                fillOpacity: 1,
                strokeColor: "white",
                strokeWeight: 2,
              },
              title: "Dropoff"
            });

            // Init Autocomplete
            if (google.maps.places) {
              const pAuto = new google.maps.places.Autocomplete(pickupInputRef.current);
              pAuto.addListener('place_changed', () => {
                const place = pAuto.getPlace();
                if (place.geometry) {
                  setPickup(place.formatted_address || place.name);
                  pickupMarkerRef.current.setPosition(place.geometry.location);
                  pickupMarkerRef.current.setMap(mapRef.current);
                  updateMapBounds();
                  // Trigger auto-route if we have both
                  const currentDropoff = dropoffInputRef.current?.value;
                  if (currentDropoff) getRoute(place.formatted_address || place.name, currentDropoff);
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
                  // Trigger auto-route if we have both
                  const currentPickup = pickupInputRef.current?.value;
                  if (currentPickup) getRoute(currentPickup, place.formatted_address || place.name);
                }
              });
            }
          }
          setIsApiLoading(false);
        } catch (e) {
          console.warn("Maps API Init Error:", e);
          setIsManualMode(true);
          setIsApiLoading(false);
        }
      } else if (attempts < 10) {
        attempts++;
        setTimeout(tryInitMap, 800);
      }
    };

    tryInitMap();

    return () => {
      if (directionsRendererRef.current) directionsRendererRef.current.setMap(null);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const calculateFare = (type: VehicleType) => {
    const multipliers: Record<string, number> = {
      [VehicleType.ECONOMY]: 1.0, [VehicleType.PREMIUM]: 2.2, [VehicleType.XL]: 1.8, [VehicleType.BIKE]: 0.7
    };
    const multiplier = multipliers[type] || 1.0;
    const base = Math.max(distance * pricePerKm * multiplier, 500);
    return Math.round(base);
  };

  const startSimulation = () => {
    if (isManualMode || !directionsRendererRef.current.getDirections()) {
      setRideStep('ON_RIDE');
      setEta(5);
      return;
    }

    setRideStep('ON_RIDE');
    const directions = directionsRendererRef.current.getDirections();
    const path = directions.routes[0].overview_path;
    let step = 0;

    if (!driverMarkerRef.current) {
      driverMarkerRef.current = new google.maps.Marker({
        position: path[0],
        map: mapRef.current,
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: "#2563eb",
          fillOpacity: 1,
          strokeWeight: 2,
          rotation: 0
        },
        title: "Your Ride",
        zIndex: 1000
      });
    }

    const animate = () => {
      if (step >= path.length - 1) {
        setEta(0);
        return;
      }

      const currentPos = path[step];
      const nextPos = path[step + 1];
      
      const heading = google.maps.geometry.spherical.computeHeading(currentPos, nextPos);
      driverMarkerRef.current.setPosition(nextPos);
      driverMarkerRef.current.setIcon({
        ...driverMarkerRef.current.getIcon(),
        rotation: heading
      });

      setEta(Math.ceil(((path.length - step) / path.length) * 15));
      step++;
      animationRef.current = requestAnimationFrame(() => setTimeout(animate, 100));
    };

    animate();
  };

  const confirmRide = async () => {
    if (!currentUser) return;
    setRideStep('MATCHING');
    setTimeout(() => {
      startSimulation();
    }, 3000);
  };

  return (
    <div className="h-full relative overflow-hidden bg-slate-100">
      <div ref={mapContainerRef} className="absolute inset-0 z-0 bg-slate-100" />

      {(isApiLoading || isManualMode) && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-50/50 backdrop-blur-sm pointer-events-none">
          {isApiLoading && !isManualMode && (
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4 shadow-xl"></div>
              <p className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-400">Syncing Matrix...</p>
            </div>
          )}
        </div>
      )}

      {/* SEARCH INTERFACE */}
      <div className={`absolute top-10 left-10 w-full max-w-sm z-20 space-y-4 transition-all duration-700 ease-out ${rideStep === 'ON_RIDE' ? '-translate-x-full opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'}`}>
        <div className="bg-white/95 backdrop-blur-xl p-8 rounded-[40px] shadow-2xl border border-white">
           <div className="flex items-center space-x-3 mb-8">
              <Logo className="h-10 w-auto" />
              <div className="h-6 w-px bg-slate-100" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Real-Time Routing</p>
           </div>
           
           <div className="space-y-4">
             <div className="relative group">
               <div className="absolute left-5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500"></div>
               <input 
                 ref={pickupInputRef}
                 placeholder="Enter Pickup Point" 
                 value={pickup} onChange={e => setPickup(e.target.value)}
                 className="w-full pl-12 pr-5 py-5 bg-slate-50 border-none rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600 transition"
               />
             </div>
             <div className="relative group">
               <div className="absolute left-5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-400"></div>
               <input 
                 ref={dropoffInputRef}
                 placeholder="Where are you going?" 
                 value={dropoff} onChange={e => setDropoff(e.target.value)}
                 className="w-full pl-12 pr-5 py-5 bg-slate-50 border-none rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600 transition"
               />
             </div>
             <button 
               onClick={() => getRoute(pickup, dropoff)}
               disabled={!pickup || !dropoff}
               className="w-full bg-slate-900 text-white font-black py-5 rounded-3xl hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-slate-200"
             >
               Confirm Journey
             </button>
           </div>
        </div>
      </div>

      {/* BOOKING MODAL */}
      {rideStep !== 'INPUT' && (
        <div className="absolute bottom-10 left-6 right-6 md:left-10 md:right-10 max-w-2xl mx-auto z-30">
          <div className="bg-white p-8 rounded-[50px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] border border-white animate-in slide-in-from-bottom-20 duration-500">
            
            {rideStep === 'MATCHING' ? (
              <div className="py-12 text-center space-y-6 overflow-hidden relative">
                 <div className="radar-scanner top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
                 <div className="relative z-10 space-y-4">
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                      <Search className="w-10 h-10" />
                    </div>
                    <p className="text-xl font-black text-slate-900 tracking-tight">Scanning for Pilot...</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">Connecting to Near-Field Nodes</p>
                 </div>
              </div>
            ) : rideStep === 'ON_RIDE' ? (
              <div className="animate-in fade-in duration-700">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-5">
                       <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[24px] flex items-center justify-center font-black text-xl shadow-inner border border-blue-100 relative">
                          SR
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                       </div>
                       <div>
                          <p className="font-black text-slate-900 text-xl tracking-tight">Adebayo Tunde</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Tesla Model 3 • {eta > 0 ? 'EN ROUTE' : 'ARRIVED'}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Arrival In</p>
                       <p className="text-4xl font-black text-blue-600 tracking-tighter">{eta}<span className="text-lg ml-1 font-bold">m</span></p>
                    </div>
                 </div>
                 <div className="flex space-x-4">
                    <button className="flex-1 py-5 bg-slate-50 text-slate-600 font-black rounded-2xl hover:bg-slate-100 transition flex items-center justify-center space-x-2">
                       <Phone className="w-5 h-5" /> <span>Call Partner</span>
                    </button>
                    <button onClick={() => { 
                      setRideStep('INPUT'); 
                      if(driverMarkerRef.current) driverMarkerRef.current.setMap(null); 
                      directionsRendererRef.current.setDirections({routes: []});
                    }} className="flex-1 py-5 bg-red-50 text-red-600 font-black rounded-2xl hover:bg-red-100 transition">Abort Request</button>
                 </div>
              </div>
            ) : (
              <div className="space-y-8">
                 <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">Select Fleet</h3>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{distance.toFixed(1)} KM Telemetry Analysis</p>
                    </div>
                    <button onClick={() => {
                      setRideStep('INPUT');
                      directionsRendererRef.current.setDirections({routes: []});
                    }} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition"><X className="w-6 h-6" /></button>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[VehicleType.ECONOMY, VehicleType.PREMIUM, VehicleType.XL, VehicleType.BIKE].map(type => (
                      <div 
                        key={type} 
                        onClick={() => setSelectedType(type)} 
                        className={`p-5 rounded-3xl border-4 transition-all cursor-pointer flex flex-col items-center text-center ${selectedType === type ? 'border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-100 scale-105' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}
                      >
                         <div className={`p-3 rounded-2xl mb-3 ${selectedType === type ? 'bg-blue-600 text-white' : 'bg-white text-slate-400'}`}>
                           <Car className="w-6 h-6" />
                         </div>
                         <p className="text-[10px] font-black uppercase tracking-widest mb-1">{type}</p>
                         <p className="font-black text-slate-900 tracking-tight">₦{calculateFare(type).toLocaleString()}</p>
                      </div>
                    ))}
                 </div>
                 <button onClick={confirmRide} className="w-full bg-blue-600 text-white font-black py-6 rounded-3xl hover:bg-blue-700 transition-all active:scale-95 shadow-[0_20px_40px_-12px_rgba(37,99,235,0.4)] uppercase tracking-[0.2em] text-xs">
                   Request {selectedType} Node
                 </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const RiderHistory: React.FC = () => {
  const { currentUser } = useApp();
  const [rides, setRides] = useState<any[]>([]);
  useEffect(() => { if (currentUser?.id) db.rides.getByUser(currentUser.id).then(setRides); }, [currentUser]);
  
  return (
    <div className="p-10 space-y-8 overflow-y-auto h-full pb-32">
      <h2 className="text-4xl font-black text-slate-900 tracking-tight">Telemetry History</h2>
      {rides.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-[40px] border border-slate-100 shadow-sm">
           <History className="w-16 h-16 text-slate-100 mx-auto mb-4" />
           <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No historical data found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {rides.map(r => (
            <div key={r.id} className="bg-white p-8 rounded-[32px] border border-slate-100 flex items-center justify-between group hover:shadow-xl transition-all duration-500">
              <div className="flex items-center space-x-6">
                 <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition">
                    <Navigation className="w-6 h-6" />
                 </div>
                 <div>
                    <p className="font-black text-slate-900 text-lg">{(r.dropoff || 'Journey').split(',')[0]}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                       {new Date(r.createdAt).toLocaleDateString()} • {r.status}
                    </p>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-2xl font-black text-slate-900 tracking-tighter">₦{(r.fare || 0).toLocaleString()}</p>
                 <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Settled</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const RiderWallet: React.FC = () => {
  const { currentUser } = useApp();
  return (
    <div className="p-10 space-y-10 overflow-y-auto h-full pb-32">
      <h2 className="text-4xl font-black text-slate-900 tracking-tight">Neural Wallet</h2>
      <div className="bg-slate-900 p-12 rounded-[50px] text-white shadow-2xl shadow-slate-200 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-1000">
           <Zap className="w-48 h-48" />
        </div>
        <p className="text-xs font-black uppercase tracking-[0.4em] opacity-40 mb-3">Available Balance</p>
        <p className="text-6xl font-black tracking-tighter">₦{(currentUser?.balance || 0).toLocaleString()}</p>
        <div className="mt-12 flex space-x-4">
           <button className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-xl">Top Up Account</button>
           <button className="bg-white/10 text-white px-10 py-5 rounded-2xl font-black hover:bg-white/20 transition-all active:scale-95 backdrop-blur-md">Auto-Reload</button>
        </div>
      </div>
    </div>
  );
};

const RiderProfile: React.FC = () => {
  const { currentUser } = useApp();
  return (
    <div className="p-10 space-y-10 overflow-y-auto h-full pb-32">
      <h2 className="text-4xl font-black text-slate-900 tracking-tight">Identity Node</h2>
      <div className="bg-white p-12 rounded-[50px] border border-slate-100 space-y-10 shadow-sm">
        <div className="flex items-center space-x-8">
          <div className="relative">
             <div className="w-28 h-28 rounded-[40px] overflow-hidden bg-slate-100 border-4 border-slate-50 shadow-2xl">
                <img src={currentUser?.avatar || `https://i.pravatar.cc/150?u=${currentUser?.id}`} className="w-full h-full object-cover" alt="Profile" />
             </div>
             <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl border-4 border-white shadow-lg"><ShieldCheck className="w-5 h-5" /></div>
          </div>
          <div>
             <p className="text-3xl font-black text-slate-900 tracking-tighter">{currentUser?.name || 'Speed Rider'}</p>
             <p className="text-slate-400 font-bold text-lg">{currentUser?.email}</p>
             <div className="mt-4 flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full w-fit">
                <Star className="w-4 h-4 fill-blue-600" />
                <span className="font-black text-xs uppercase tracking-widest">Elite Member • 4.98</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 pt-10 border-t border-slate-50">
           <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile Contact</p>
              <p className="text-xl font-black text-slate-900">{currentUser?.phone || 'Not linked'}</p>
           </div>
           <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Method</p>
              <p className="text-xl font-black text-slate-900">Neural Pay (VISA)</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const RiderDashboard: React.FC = () => {
  const { logout, currentUser } = useApp();

  if (!currentUser) return null;
  
  return (
    <DashboardErrorBoundary>
      <div className="flex h-screen bg-white overflow-hidden">
        <div className="w-24 md:w-80 bg-white border-r border-slate-50 flex flex-col py-12 shrink-0">
          <div className="mb-12 px-6 w-full flex justify-center md:justify-start">
             <Logo className="h-12 w-auto" />
          </div>
          <nav className="flex-1 space-y-2 px-6">
            {[
              { to: '/rider', icon: Navigation, label: 'Move Now', end: true },
              { to: '/rider/history', icon: History, label: 'History' },
              { to: '/rider/wallet', icon: Wallet, label: 'Wallet Hub' },
              { to: '/rider/profile', icon: UserIcon, label: 'Identity' },
            ].map((item) => (
              <NavLink 
                key={item.to} to={item.to} end={item.end}
                className={({ isActive }) => `flex items-center justify-center md:justify-start md:space-x-5 p-5 rounded-[24px] transition-all ${isActive ? 'bg-slate-900 text-white shadow-2xl shadow-slate-300' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <item.icon className="w-6 h-6 shrink-0" />
                <span className="hidden md:block font-black uppercase tracking-[0.2em] text-[10px]">{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="px-6">
             <button onClick={logout} className="flex items-center justify-center md:space-x-5 w-full p-5 rounded-[24px] text-red-400 hover:bg-red-50 transition-all font-black text-[10px] uppercase tracking-[0.2em]">
                <LogOut className="w-6 h-6 shrink-0" />
                <span className="hidden md:block">Terminate</span>
             </button>
          </div>
        </div>
        <div className="flex-1 relative bg-slate-50">
          <Routes>
            <Route index element={<RiderExplore />} />
            <Route path="history" element={<RiderHistory />} />
            <Route path="wallet" element={<RiderWallet />} />
            <Route path="profile" element={<RiderProfile />} />
          </Routes>
        </div>
      </div>
    </DashboardErrorBoundary>
  );
};

export default RiderDashboard;
