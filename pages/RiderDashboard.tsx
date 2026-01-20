
import React, { useState, useEffect, useRef, useCallback, ReactNode, Component } from 'react';
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

// Define interfaces for props and state to ensure TypeScript correctly identifies the component structure
interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

// Error Boundary for Dashboard components
// Inheriting from Component<ErrorBoundaryProps, ErrorBoundaryState> ensures props and state are typed
class DashboardErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Initialize state as a property for better type inference in TypeScript
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Dashboard Crash Caught:", error, errorInfo);
  }

  render() {
    // TypeScript now correctly identifies this.state thanks to the generic types on Component
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-10 text-center bg-slate-50">
          <div className="p-6 bg-white rounded-[40px] shadow-xl border border-slate-100 max-w-md w-full">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-2">Interface Collision</h1>
            <p className="text-slate-500 font-bold mb-6 text-sm">We encountered a telemetry error while loading your dashboard.</p>
            <div className="bg-slate-900 text-blue-400 p-4 rounded-2xl text-[10px] font-mono text-left mb-6 overflow-hidden">
               {this.state.error?.message || this.state.error?.toString()}
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition"
            >
              Reboot Matrix
            </button>
          </div>
        </div>
      );
    }
    // TypeScript now correctly identifies this.props thanks to the generic types on Component
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
  
  const [activeRide, setActiveRide] = useState<RideRequest | null>(null);
  const [eta, setEta] = useState<number | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    db.settings.get().then(s => setPricePerKm(s?.pricePerKm || 350));

    let attempts = 0;
    const maxAttempts = 3;

    const tryInitMap = () => {
      if (mapContainerRef.current && typeof google !== 'undefined' && google.maps) {
        try {
          new google.maps.Map(mapContainerRef.current, {
            center: { lat: 6.5244, lng: 3.3792 },
            zoom: 14,
            disableDefaultUI: true
          });
          setIsApiLoading(false);
        } catch (e) {
          setIsManualMode(true);
          setIsApiLoading(false);
        }
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(tryInitMap, 1000);
      } else {
        setIsManualMode(true);
        setIsApiLoading(false);
      }
    };
    tryInitMap();
  }, []);

  const calculateFare = (type: VehicleType) => {
    const multipliers: Record<string, number> = {
      [VehicleType.ECONOMY]: 1.0, [VehicleType.PREMIUM]: 2.2, [VehicleType.XL]: 1.8, [VehicleType.BIKE]: 0.7
    };
    const multiplier = multipliers[type] || 1.0;
    const base = Math.max(distance * pricePerKm * multiplier, 500);
    return Math.round(base);
  };

  const confirmRide = async () => {
    if (!currentUser) return;
    setRideStep('MATCHING');
    const fare = calculateFare(selectedType);
    const newRide = await db.rides.create({
       riderId: currentUser.id, pickup, dropoff, fare, distance, vehicleType: selectedType, status: RideStatus.REQUESTED
    });
    setActiveRide(newRide);
    setTimeout(() => {
      setRideStep('ON_RIDE');
      db.rides.updateStatus(newRide.id, RideStatus.ACCEPTED);
      setEta(5);
    }, 2000);
  };

  return (
    <div className="h-full relative overflow-hidden bg-slate-50">
      <div ref={mapContainerRef} className="absolute inset-0 z-0 bg-slate-100 flex items-center justify-center">
        {isApiLoading && !isManualMode && <div className="text-slate-400 font-black animate-pulse uppercase tracking-widest text-xs">Initializing Neural Map...</div>}
        {isManualMode && <div className="text-slate-300 flex flex-col items-center"><MapPin className="w-12 h-12 mb-2 opacity-20" /><p className="text-[10px] font-black uppercase tracking-widest opacity-40">Offline Mode Active</p></div>}
      </div>

      <div className={`absolute top-10 left-10 w-full max-w-sm z-10 space-y-4 transition-all duration-500 ${rideStep === 'ON_RIDE' ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
        <div className="bg-white p-6 rounded-[32px] shadow-2xl border border-slate-100">
           <div className="flex items-center space-x-3 mb-6">
              <Logo className="h-10 w-auto" />
              <div className="h-6 w-px bg-slate-100" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rider Hub</p>
           </div>
           
           <div className="space-y-4">
             <input 
               placeholder="Starting Point" 
               value={pickup} onChange={e => setPickup(e.target.value)}
               className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600 transition"
             />
             <input 
               placeholder="Destination" 
               value={dropoff} onChange={e => setDropoff(e.target.value)}
               className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600 transition"
             />
             <button 
               onClick={() => { setDistance(12.5); setRideStep('SELECTION'); }}
               disabled={!pickup || !dropoff}
               className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-blue-600 transition disabled:opacity-50"
             >
               Plan Journey
             </button>
           </div>
        </div>
      </div>

      {rideStep !== 'INPUT' && (
        <div className="absolute bottom-10 left-6 right-6 md:left-10 md:right-10 max-w-2xl mx-auto z-20">
          <div className="bg-white p-6 md:p-8 rounded-[40px] shadow-2xl border border-white">
            {rideStep === 'MATCHING' ? (
              <div className="py-10 text-center space-y-4">
                 <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden mx-auto"><div className="bg-blue-600 h-full animate-loading-bar" /></div>
                 <p className="text-lg font-black text-slate-900 tracking-tight">Syncing with available fleet...</p>
              </div>
            ) : rideStep === 'ON_RIDE' ? (
              <div className="animate-in fade-in duration-500">
                 <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                       <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center font-black">SR</div>
                       <div><p className="font-black text-slate-900 text-lg">Adebayo Tunde</p><p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Tesla Model 3 • LAG-777</p></div>
                    </div>
                    <div className="text-right"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ETA</p><p className="text-2xl font-black text-blue-600">{eta}m</p></div>
                 </div>
                 <button onClick={() => setRideStep('INPUT')} className="w-full py-4 bg-red-50 text-red-600 font-black rounded-2xl hover:bg-red-100 transition">Cancel Request</button>
              </div>
            ) : (
              <div className="space-y-6">
                 <div className="flex justify-between items-center"><h3 className="text-xl font-black text-slate-900">Select Vehicle</h3><button onClick={() => setRideStep('INPUT')} className="text-slate-400 hover:text-slate-900"><X /></button></div>
                 <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1">
                    {[VehicleType.ECONOMY, VehicleType.PREMIUM, VehicleType.XL, VehicleType.BIKE].map(type => (
                      <div key={type} onClick={() => setSelectedType(type)} className={`p-4 rounded-2xl border-2 transition cursor-pointer ${selectedType === type ? 'border-blue-600 bg-blue-50/50' : 'border-slate-50 bg-slate-50'}`}>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{type}</p>
                         <p className="font-black text-slate-900">₦{calculateFare(type).toLocaleString()}</p>
                      </div>
                    ))}
                 </div>
                 <button onClick={confirmRide} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition">Request {selectedType}</button>
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
    <div className="p-10 space-y-6 overflow-y-auto h-full pb-32">
      <h2 className="text-3xl font-black text-slate-900 tracking-tight">Trip Logs</h2>
      {rides.length === 0 ? <p className="text-slate-400 font-bold">No historical data found.</p> : (
        <div className="space-y-4">
          {rides.map(r => (
            <div key={r.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
              <div><p className="font-black text-slate-900">{(r.dropoff || 'Journey').split(',')[0]}</p><p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(r.createdAt).toLocaleDateString()} • {r.status}</p></div>
              <p className="text-xl font-black text-slate-900">₦{(r.fare || 0).toLocaleString()}</p>
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
      <h2 className="text-3xl font-black text-slate-900 tracking-tight">Neural Wallet</h2>
      <div className="bg-slate-900 p-10 rounded-[40px] text-white">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Available Balance</p>
        <p className="text-5xl font-black">₦{(currentUser?.balance || 0).toLocaleString()}</p>
        <button className="mt-8 bg-white text-slate-900 px-8 py-4 rounded-2xl font-black hover:bg-blue-600 hover:text-white transition">Top Up Balance</button>
      </div>
    </div>
  );
};

const RiderProfile: React.FC = () => {
  const { currentUser } = useApp();
  return (
    <div className="p-10 space-y-10 overflow-y-auto h-full pb-32">
      <h2 className="text-3xl font-black text-slate-900 tracking-tight">Identity Node</h2>
      <div className="bg-white p-10 rounded-[40px] border border-slate-100 space-y-6">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 rounded-3xl overflow-hidden bg-slate-100">
             <img src={currentUser?.avatar || `https://i.pravatar.cc/150?u=${currentUser?.id}`} className="w-full h-full object-cover" alt="Profile" />
          </div>
          <div><p className="text-2xl font-black text-slate-900">{currentUser?.name || 'Rider'}</p><p className="text-slate-400 font-bold">{currentUser?.email}</p></div>
        </div>
      </div>
    </div>
  );
};

const RiderDashboard: React.FC = () => {
  const { logout, currentUser } = useApp();
  const navigate = useNavigate();

  if (!currentUser) return null;
  
  return (
    <DashboardErrorBoundary>
      <div className="flex h-screen bg-white overflow-hidden">
        <div className="w-20 md:w-72 bg-white border-r border-slate-100 flex flex-col py-10 shrink-0">
          <div className="mb-10 px-4 w-full flex justify-center"><Logo className="h-12 w-auto" /></div>
          <nav className="flex-1 space-y-2 px-4">
            {[
              { to: '/rider', icon: Navigation, label: 'Book Ride', end: true },
              { to: '/rider/history', icon: History, label: 'Logs' },
              { to: '/rider/wallet', icon: Wallet, label: 'Wallet' },
              { to: '/rider/profile', icon: UserIcon, label: 'Identity' },
            ].map((item) => (
              <NavLink 
                key={item.to} to={item.to} end={item.end}
                className={({ isActive }) => `flex items-center justify-center md:justify-start md:space-x-4 p-4 rounded-2xl transition ${isActive ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400 hover:bg-blue-50 hover:text-blue-600'}`}
              >
                <item.icon className="w-6 h-6 shrink-0" />
                <span className="hidden md:block font-black uppercase tracking-[0.2em] text-[10px]">{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="px-4"><button onClick={logout} className="flex items-center justify-center md:space-x-4 w-full p-4 rounded-2xl text-red-400 hover:bg-red-50 transition font-black text-[10px] uppercase tracking-widest"><LogOut className="w-6 h-6" /><span className="hidden md:block">Terminate</span></button></div>
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
