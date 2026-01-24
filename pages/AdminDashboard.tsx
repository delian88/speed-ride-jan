
import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { 
  Users, Car, TrendingUp, AlertCircle, ShieldCheck, 
  Settings, Search, X, Map, LayoutDashboard, 
  Database, PieChart, LogOut, ShieldAlert, CheckCircle, Check, Eye, FileText, Image as ImageIcon,
  MoreVertical, Mail, Phone, Wallet, Star, Zap, DollarSign, Save,
  Filter, Trash2, Edit3, ShieldX, UserMinus, Plus, RefreshCw, Activity,
  Ban, ToggleLeft, ToggleRight, MessageSquare, Globe, Gift, HelpCircle,
  MapPin, Clock, ArrowRight, ChevronRight, AlertTriangle,
  // Fix: Import User from lucide-react and alias as UserIcon to avoid conflict with local User type
  User as UserIcon
} from 'lucide-react';
import { useApp } from '../App';
import { db } from '../database';
import { Driver, User, RideRequest, UserRole, RideStatus } from '../types';

// --- Sub-components ---

const AdminRegionManager: React.FC = () => {
  const regions = [
    { name: 'Minna', zones: 12, drivers: 45, status: 'ACTIVE', gtv: '₦4.2M' },
    { name: 'Abuja', zones: 84, drivers: 1200, status: 'ACTIVE', gtv: '₦82.5M' },
    { name: 'Lagos', zones: 156, drivers: 3500, status: 'ACTIVE', gtv: '₦145.0M' },
    { name: 'Kano', zones: 42, drivers: 210, status: 'MAINTENANCE', gtv: '₦0' },
  ];

  return (
    <div className="p-12 space-y-10 animate-in fade-in duration-500 overflow-y-auto h-full pb-32">
       <div className="flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Regional Logistics</h2>
            <p className="text-slate-500 font-bold">Manage geographical zones and local service toggles.</p>
          </div>
          <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black flex items-center space-x-2 hover:bg-blue-600 transition">
             <MapPin className="w-5 h-5" /> <span>Deploy New City</span>
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {regions.map((city, i) => (
            <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group hover:shadow-2xl transition duration-500">
               <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl ${city.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    <Globe className="w-7 h-7" />
                  </div>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full ${city.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{city.status}</span>
               </div>
               <h3 className="text-2xl font-black text-slate-900 mb-1">{city.name}</h3>
               <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-6">{city.zones} ACTIVE ZONES</p>
               <div className="pt-6 border-t border-slate-50 flex justify-between items-end">
                  <div><p className="text-[10px] font-black text-slate-300 uppercase">Revenue (30d)</p><p className="text-xl font-black text-slate-900">{city.gtv}</p></div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition" />
               </div>
            </div>
          ))}
       </div>
    </div>
  );
};

const AdminPromotions: React.FC = () => {
  const promos = [
    { code: 'MINNA50', disc: '50%', usage: '1,240', limit: '5,000', expiry: '2026-12-31', status: 'ACTIVE' },
    { code: 'FUTMINNA_FREE', disc: '₦2,000', usage: '840', limit: '1,000', expiry: '2026-06-15', status: 'EXPIRED' },
    { code: 'RIDEWELL', disc: '20%', usage: '4,500', limit: 'Unlimited', expiry: 'None', status: 'ACTIVE' },
  ];

  return (
    <div className="p-12 space-y-10 animate-in fade-in duration-500 overflow-y-auto h-full pb-32">
       <div className="flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Growth Engine</h2>
            <p className="text-slate-500 font-bold">Configure campaign codes and referral neural weights.</p>
          </div>
          <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center space-x-2 hover:bg-blue-700 transition shadow-xl shadow-blue-500/20">
             <Plus className="w-5 h-5" /> <span>Generate Promo</span>
          </button>
       </div>

       <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
             <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                   <th className="px-8 py-6">Campaign Cipher</th>
                   <th className="px-8 py-6">Discount Logic</th>
                   <th className="px-8 py-6">Propagation</th>
                   <th className="px-8 py-6">Expiry Protocol</th>
                   <th className="px-8 py-6 text-right">Status</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
                {promos.map((p, i) => (
                   <tr key={i} className="hover:bg-slate-50 transition">
                      <td className="px-8 py-6 font-black text-slate-900 font-mono tracking-widest">{p.code}</td>
                      <td className="px-8 py-6 font-black text-blue-600">{p.disc}</td>
                      <td className="px-8 py-6">
                         <div className="flex items-center space-x-2 font-bold text-sm text-slate-500">
                           <Users className="w-4 h-4" /> <span>{p.usage} / {p.limit}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-xs font-black text-slate-400">{p.expiry}</td>
                      <td className="px-8 py-6 text-right">
                         <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${p.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>{p.status}</span>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
};

const AdminRides: React.FC = () => {
  const [rides, setRides] = useState<RideRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.rides.getAll().then(r => {
      setRides(r.reverse());
      setLoading(false);
    });
  }, []);

  const getStatusColor = (s: RideStatus) => {
    switch(s) {
      case RideStatus.COMPLETED: return 'bg-emerald-50 text-emerald-600';
      case RideStatus.CANCELLED: return 'bg-red-50 text-red-600';
      case RideStatus.IN_PROGRESS: return 'bg-blue-50 text-blue-600';
      default: return 'bg-amber-50 text-amber-600';
    }
  };

  return (
    <div className="p-12 space-y-10 animate-in fade-in duration-500 overflow-y-auto h-full pb-32">
       <div className="flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Fleet Intelligence</h2>
            <p className="text-slate-500 font-bold">Live telemetry for every ride in the matrix.</p>
          </div>
          <div className="flex space-x-4">
             <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition"><RefreshCw className="w-5 h-5" /></button>
             <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black flex items-center space-x-2">
                <Filter className="w-5 h-5" /> <span>Advanced Filter</span>
             </button>
          </div>
       </div>

       <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
             <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                   <th className="px-8 py-6">Ride Pulse</th>
                   <th className="px-8 py-6">Origin & Terminal</th>
                   <th className="px-8 py-6">Economic Data</th>
                   <th className="px-8 py-6">Timeline</th>
                   <th className="px-8 py-6 text-right">Telemetry Status</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={5} className="p-20 text-center animate-pulse text-slate-400 font-black">Syncing Fleet Telemetry...</td></tr>
                ) : rides.length === 0 ? (
                  <tr><td colSpan={5} className="p-20 text-center text-slate-400 font-black">No neural ride logs recorded.</td></tr>
                ) : rides.map(ride => (
                  <tr key={ride.id} className="hover:bg-slate-50 transition">
                     <td className="px-8 py-6">
                        <div className="flex items-center space-x-3">
                           <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center"><Car className="w-5 h-5 text-slate-400" /></div>
                           <p className="text-xs font-black text-slate-900">{ride.id.toUpperCase()}</p>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <div className="space-y-1">
                           <p className="text-xs font-bold text-slate-900 flex items-center"><MapPin className="w-3 h-3 text-emerald-500 mr-2" /> {ride.pickup}</p>
                           <p className="text-xs font-bold text-slate-900 flex items-center"><MapPin className="w-3 h-3 text-red-500 mr-2" /> {ride.dropoff}</p>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <p className="font-black text-slate-900">₦{ride.fare.toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-slate-400">{ride.distance.toFixed(1)} KM • {ride.vehicleType}</p>
                     </td>
                     <td className="px-8 py-6 text-xs font-black text-slate-400">{new Date(ride.createdAt).toLocaleTimeString()}</td>
                     <td className="px-8 py-6 text-right">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusColor(ride.status)}`}>{ride.status}</span>
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
};

const AdminSupport: React.FC = () => {
  const tickets = [
    { id: 'TKT-1', user: 'Sarah Miller', subject: 'Lost item in vehicle', priority: 'HIGH', date: '2h ago', status: 'OPEN' },
    { id: 'TKT-2', user: 'Alex Johnson', subject: 'Payment failed but debited', priority: 'MEDIUM', date: '4h ago', status: 'PENDING' },
    { id: 'TKT-3', user: 'Adebayo Tunde', subject: 'Account verification delay', priority: 'LOW', date: '1d ago', status: 'RESOLVED' },
  ];

  return (
    <div className="p-12 space-y-10 animate-in fade-in duration-500 overflow-y-auto h-full pb-32">
       <div className="flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Support Node</h2>
            <p className="text-slate-500 font-bold">Neural ticket resolution and dispute management.</p>
          </div>
          <button className="bg-red-500 text-white px-8 py-4 rounded-2xl font-black flex items-center space-x-2 hover:bg-red-600 transition shadow-xl shadow-red-500/20">
             <AlertTriangle className="w-5 h-5" /> <span>Urgent Protocol</span>
          </button>
       </div>

       <div className="grid md:grid-cols-3 gap-8">
          {tickets.map((t, i) => (
            <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition duration-500">
               <div className={`absolute top-0 right-0 w-2 h-full ${t.priority === 'HIGH' ? 'bg-red-500' : t.priority === 'MEDIUM' ? 'bg-amber-400' : 'bg-blue-400'}`}></div>
               <div className="flex justify-between mb-6">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{t.id}</span>
                  <span className="text-[10px] font-black text-slate-300 uppercase">{t.date}</span>
               </div>
               <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight">{t.subject}</h3>
               <p className="text-sm font-bold text-slate-400 mb-6 flex items-center"><UserIcon className="w-4 h-4 mr-2" /> {t.user}</p>
               <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${t.status === 'OPEN' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'}`}>{t.status}</span>
                  <button className="p-3 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition"><MessageSquare className="w-4 h-4" /></button>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
};

// --- Main Dashboard Shell ---

const UserProfileModal: React.FC<{ user: User, onClose: () => void, onUpdate: () => void }> = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({ ...user });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await db.users.update(user.id, formData);
    setIsSaving(false);
    onUpdate();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl p-10 animate-in zoom-in duration-300">
         <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black text-slate-900">Manage Identity Node</h3>
            <button onClick={onClose} className="p-2 bg-slate-100 rounded-xl hover:text-red-500 transition"><X className="w-5 h-5" /></button>
         </div>
         
         <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Full Name</label>
                  <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-3 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600" />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Phone Contact</label>
                  <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-6 py-3 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600" />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Wallet Balance (₦)</label>
                  <input type="number" value={formData.balance} onChange={e => setFormData({...formData, balance: Number(e.target.value)})} className="w-full px-6 py-3 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600" />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Platform Rating</label>
                  <input type="number" step="0.1" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: Number(e.target.value)})} className="w-full px-6 py-3 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600" />
               </div>
            </div>
            
            <div className="pt-6 border-t border-slate-100 flex justify-end space-x-4">
               <button type="button" onClick={onClose} className="px-8 py-4 font-black text-slate-400 uppercase tracking-widest text-xs">Cancel</button>
               <button type="submit" disabled={isSaving} className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl hover:bg-blue-700 transition">
                  {isSaving ? 'Synchronizing...' : 'Commit Changes'}
               </button>
            </div>
         </form>
      </div>
    </div>
  );
};

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    pricePerKm: 2000,
    baseFare: 1000,
    commission: 20,
    maintenanceMode: false,
    globalAlert: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    db.settings.get().then(s => {
      setSettings(s);
      setIsLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await db.settings.update(settings);
    setIsSaving(false);
    setMessage('Neural settings propagated successfully.');
    setTimeout(() => setMessage(''), 3000);
  };

  if (isLoading) return <div className="p-20 text-center animate-pulse">Syncing Intel Core...</div>;

  return (
    <main className="p-12 space-y-12 animate-in fade-in duration-500 overflow-y-auto h-full pb-32">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Platform Intelligence</h2>
          <p className="text-slate-500 font-bold">Manage economic engines and system-wide protocols.</p>
        </div>
        {message && <div className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl font-black text-xs animate-bounce">{message}</div>}
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <form onSubmit={handleSave} className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-sm space-y-10">
           <div className="flex items-center space-x-4 mb-4">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-3xl"><TrendingUp className="w-6 h-6" /></div>
              <h3 className="text-2xl font-black text-slate-900">Economic Parameters</h3>
           </div>
           
           <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Price Per KM (₦)</label>
                   <input type="number" value={settings.pricePerKm} onChange={e => setSettings({...settings, pricePerKm: Number(e.target.value)})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-black text-xl outline-none focus:ring-2 focus:ring-blue-600" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Base Fare (₦)</label>
                   <input type="number" value={settings.baseFare} onChange={e => setSettings({...settings, baseFare: Number(e.target.value)})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-black text-xl outline-none focus:ring-2 focus:ring-blue-600" />
                </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Platform Commission (%)</label>
                 <input type="range" min="5" max="40" value={settings.commission} onChange={e => setSettings({...settings, commission: Number(e.target.value)})} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                 <div className="flex justify-between font-black text-sm text-slate-900 px-1"><span>5%</span><span className="text-blue-600">{settings.commission}%</span><span>40%</span></div>
              </div>
           </div>

           <div className="pt-8 border-t border-slate-50 space-y-6">
              <div className="flex items-center justify-between">
                 <div><h4 className="font-black text-slate-900">Maintenance Protocol</h4><p className="text-xs font-bold text-slate-400">Disable all new ride requests system-wide.</p></div>
                 <button type="button" onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})} className={`p-1 w-14 rounded-full transition-colors ${settings.maintenanceMode ? 'bg-red-500' : 'bg-slate-200'}`}>
                    <div className={`w-6 h-6 bg-white rounded-full transition-transform ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                 </button>
              </div>
              
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Global Network Broadcast</label>
                 <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 text-slate-400 w-5 h-5" />
                    <textarea value={settings.globalAlert} onChange={e => setSettings({...settings, globalAlert: e.target.value})} placeholder="Maintenance alert, promotion or system news..." className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl font-bold min-h-[100px] outline-none" />
                 </div>
              </div>
           </div>

           <button type="submit" disabled={isSaving} className="w-full bg-slate-900 text-white font-black py-5 rounded-[30px] shadow-2xl hover:bg-blue-600 transition flex items-center justify-center space-x-3">
             <Save className="w-5 h-5" />
             <span>{isSaving ? 'Propagating...' : 'Commit System Settings'}</span>
           </button>
        </form>

        <div className="bg-slate-900 p-10 rounded-[50px] text-white flex flex-col justify-between h-fit space-y-10">
           <div className="space-y-4">
              <h3 className="text-2xl font-black">Platform Health</h3>
              <p className="text-slate-400 font-bold text-sm">Real-time status of the neural network and edge nodes.</p>
           </div>
           
           <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Dispatch Latency', value: '14ms', icon: Activity },
                { label: 'Map Integrity', value: '99.9%', icon: Map },
                { label: 'Payment Node', value: 'Active', icon: DollarSign },
                { label: 'Security Sentry', value: 'Online', icon: ShieldCheck }
              ].map((s, i) => (
                <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/10">
                   <s.icon className="w-5 h-5 text-blue-400 mb-3" />
                   <p className="text-[10px] font-black uppercase text-white/40 mb-1">{s.label}</p>
                   <p className="text-xl font-black">{s.value}</p>
                </div>
              ))}
           </div>
           
           <div className="p-6 bg-blue-600 rounded-3xl text-center">
              <p className="text-xs font-black uppercase tracking-widest">Enterprise Instance v4.2</p>
           </div>
        </div>
      </div>
    </main>
  );
};

const UserRegistry: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const all = await db.users.getAll();
    setUsers(all);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Danger: Are you sure you want to terminate this identity node? This action cannot be undone.")) {
      await db.users.delete(id);
      await fetchUsers();
    }
  };

  return (
    <div className="p-12 space-y-10 animate-in fade-in duration-500 overflow-y-auto h-full pb-32">
       <div className="flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Identity Matrix</h2>
            <p className="text-slate-500 font-bold">Manage every user, rider, and driver in the network.</p>
          </div>
          <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black flex items-center space-x-2 hover:bg-blue-600 transition">
             <Plus className="w-5 h-5" /> <span>Provision User</span>
          </button>
       </div>

       <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row gap-6 justify-between items-center">
             <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email..." className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-600" />
             </div>
             
             <div className="flex items-center space-x-3 bg-slate-50 p-1.5 rounded-2xl">
                {['ALL', 'RIDER', 'DRIVER', 'ADMIN'].map(r => (
                  <button key={r} onClick={() => setRoleFilter(r as any)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${roleFilter === r ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-900'}`}>{r}</button>
                ))}
             </div>
          </div>

          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                   <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                      <th className="px-8 py-6">Node Identity</th>
                      <th className="px-8 py-6">Protocol Role</th>
                      <th className="px-8 py-6">Asset Value</th>
                      <th className="px-8 py-6">Neural Sync</th>
                      <th className="px-8 py-6 text-right">Operational Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {loading ? (
                     <tr><td colSpan={5} className="p-20 text-center animate-pulse text-slate-400 font-black">Syncing Node Registry...</td></tr>
                   ) : filteredUsers.length === 0 ? (
                     <tr><td colSpan={5} className="p-20 text-center text-slate-400 font-black">No matching nodes found.</td></tr>
                   ) : filteredUsers.map(user => (
                     <tr key={user.id} className="hover:bg-slate-50 transition">
                        <td className="px-8 py-6">
                           <div className="flex items-center space-x-4">
                              <img src={user.avatar} className="w-12 h-12 rounded-2xl object-cover shadow-md" />
                              <div>
                                 <p className="font-black text-slate-900">{user.name}</p>
                                 <p className="text-xs text-slate-400 font-bold">{user.email}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              user.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-600' :
                              user.role === 'DRIVER' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'
                           }`}>{user.role}</span>
                        </td>
                        <td className="px-8 py-6 font-black text-slate-900">₦{user.balance.toLocaleString()}</td>
                        <td className="px-8 py-6">
                           <div className="flex items-center space-x-1.5 text-indigo-600 font-black text-sm"><Star className="w-3.5 h-3.5 fill-indigo-600" /> <span>{user.rating}</span></div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <div className="flex justify-end space-x-2">
                              <button onClick={() => setSelectedUser(user)} className="p-3 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition shadow-sm"><Edit3 className="w-4 h-4" /></button>
                              <button onClick={() => handleDelete(user.id)} className="p-3 bg-white border border-slate-100 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition shadow-sm"><Trash2 className="w-4 h-4" /></button>
                           </div>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>

       {selectedUser && <UserProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} onUpdate={fetchUsers} />}
    </div>
  );
};

const AdminOverview: React.FC<{ stats: any, pendingDrivers: Driver[], handleVerification: (id: string, app: boolean) => void, loading: boolean }> = ({ stats, pendingDrivers, handleVerification, loading }) => {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  return (
    <div className="p-12 space-y-12 animate-in fade-in duration-500 overflow-y-auto h-full pb-32">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Active Sessions', value: stats.activeRides.toLocaleString(), change: '+12%', icon: Zap },
          { label: 'Network GTV', value: '₦' + (stats.revenue/1000000).toFixed(2) + 'M', change: '+8%', icon: TrendingUp },
          { label: 'Total Nodes', value: stats.newUsers.toString(), change: '+24%', icon: Users },
          { label: 'Compliance Alerts', value: pendingDrivers.length.toString(), icon: ShieldAlert },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50 hover:shadow-2xl transition duration-500 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition duration-700"><stat.icon className="w-24 h-24" /></div>
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                <stat.icon className="w-7 h-7" />
              </div>
              {stat.change && <span className="text-xs font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">{stat.change}</span>}
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
            <p className="text-4xl font-black text-slate-900 tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center space-x-4">
             <ShieldCheck className="w-8 h-8 text-emerald-600" />
             <div>
                <h3 className="text-2xl font-black text-slate-900">Credential Review</h3>
                <p className="text-slate-500 font-bold text-sm">Validating driver-partners for fleet synchronization.</p>
             </div>
          </div>
          <span className="bg-emerald-600 text-white text-xs font-black px-4 py-2 rounded-xl shadow-lg">{pendingDrivers.length} PENDING AUTH</span>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center"><div className="animate-spin h-10 w-10 border-t-2 border-blue-600 rounded-full mx-auto"></div></div>
          ) : pendingDrivers.length === 0 ? (
            <div className="p-20 text-center space-y-4">
               <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
               <p className="text-xl font-black text-slate-900">Network Synchronized</p>
               <p className="text-slate-500 font-bold">Zero pending compliance tasks.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="px-10 py-6">Applicant Node</th>
                  <th className="px-10 py-6">Vehicle Asset</th>
                  <th className="px-10 py-6">Biometric Docs</th>
                  <th className="px-10 py-6 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pendingDrivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-slate-50 transition group">
                    <td className="px-10 py-8">
                      <div className="flex items-center space-x-4">
                         <img src={driver.avatar} className="w-14 h-14 rounded-2xl border-4 border-white shadow-md" />
                         <div>
                            <p className="font-black text-slate-900 leading-none mb-1">{driver.name}</p>
                            <p className="text-xs text-slate-400 font-bold">{driver.email}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                       <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 w-fit">
                         <p className="text-xs font-black text-slate-900">{driver.vehicleModel}</p>
                         <p className="text-[10px] font-black text-blue-600 tracking-widest uppercase">{driver.plateNumber}</p>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                       <button onClick={() => setSelectedDriver(driver)} className="flex items-center space-x-2 text-blue-600 font-black text-xs hover:underline uppercase tracking-widest">
                         <Eye className="w-4 h-4" /> <span>Analyze Artifacts</span>
                       </button>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <div className="flex items-center justify-end space-x-3">
                         <button onClick={() => handleVerification(driver.id, true)} className="px-8 py-3 bg-slate-900 text-white font-black text-xs rounded-xl shadow-lg hover:bg-blue-600 transition">APPROVE</button>
                         <button className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition"><X className="w-6 h-6" /></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Driver Asset Modal */}
      {selectedDriver && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
           <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" onClick={() => setSelectedDriver(null)}></div>
           <div className="relative w-full max-w-4xl bg-white rounded-[60px] shadow-2xl border border-white p-12 max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300">
              <button onClick={() => setSelectedDriver(null)} className="absolute top-10 right-10 p-3 bg-slate-100 hover:text-red-500 rounded-2xl transition"><X className="w-6 h-6" /></button>
              
              <div className="flex items-center space-x-8 mb-16">
                 <img src={selectedDriver.avatar} className="w-24 h-24 rounded-[40px] border-4 border-slate-50 shadow-2xl" />
                 <div>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tight">{selectedDriver.name}</h3>
                    <p className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs">Compliance Core v4.2 • ID: {selectedDriver.id}</p>
                 </div>
              </div>

              <div className="grid md:grid-cols-2 gap-16">
                 <div className="space-y-6">
                    <h4 className="font-black text-xl text-slate-900 flex items-center space-x-3"><FileText className="w-6 h-6 text-blue-600" /> <span>Driver's License</span></h4>
                    <div className="aspect-[4/3] bg-slate-100 rounded-[50px] overflow-hidden border-8 border-white shadow-2xl">
                       <img src={selectedDriver.licenseDoc || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800'} className="w-full h-full object-cover" />
                    </div>
                 </div>
                 <div className="space-y-6">
                    <h4 className="font-black text-xl text-slate-900 flex items-center space-x-3"><ImageIcon className="w-6 h-6 text-blue-600" /> <span>Biometric NIN</span></h4>
                    <div className="aspect-[4/3] bg-slate-100 rounded-[50px] overflow-hidden border-8 border-white shadow-2xl">
                       <img src={selectedDriver.ninDoc || 'https://images.unsplash.com/photo-1557221162-8e6d24a6825c?w=800'} className="w-full h-full object-cover" />
                    </div>
                 </div>
              </div>

              <div className="mt-20 pt-12 border-t border-slate-100 flex justify-end space-x-6">
                 <button onClick={() => setSelectedDriver(null)} className="px-12 py-6 font-black text-slate-400 uppercase tracking-widest text-xs">Defer</button>
                 <button onClick={() => { handleVerification(selectedDriver.id, true); setSelectedDriver(null); }} className="px-12 py-6 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-700 transition shadow-2xl uppercase tracking-widest text-xs">Validate Asset</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { logout, currentUser } = useApp();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeRides: 0,
    revenue: 0,
    newUsers: 0,
    alerts: 0
  });

  const loadInitialData = async () => {
    const allUsers = await db.users.getAll();
    const allRides = await db.rides.getAll();
    const allDrivers = allUsers.filter(u => u.role === 'DRIVER') as Driver[];
    
    setDrivers(allDrivers);
    setStats({
       activeRides: allRides.filter(r => r.status !== RideStatus.COMPLETED).length,
       revenue: allRides.reduce((acc, r) => acc + r.fare, 0),
       newUsers: allUsers.length,
       alerts: allDrivers.filter(d => !d.isVerified).length
    });
    setLoading(false);
  };

  useEffect(() => { loadInitialData(); }, []);

  const handleVerification = async (id: string, approve: boolean) => {
    await db.users.update(id, { isVerified: approve });
    await loadInitialData();
  };

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Matrix Overview', end: true },
    { to: '/admin/users', icon: Users, label: 'Identities' },
    { to: '/admin/rides', icon: Car, label: 'Fleet Logs' },
    { to: '/admin/regions', icon: Globe, label: 'Regions' },
    { to: '/admin/promos', icon: Gift, label: 'Promotions' },
    { to: '/admin/support', icon: HelpCircle, label: 'Support Hub' },
    { to: '/admin/settings', icon: Settings, label: 'Core Intel' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-24 md:w-72 bg-slate-900 text-slate-400 p-8 flex flex-col shrink-0 border-r border-white/5">
        <div className="flex items-center space-x-3 text-white mb-12">
          <ShieldCheck className="w-10 h-10 text-blue-500" />
          <span className="hidden md:block text-2xl font-black tracking-tighter uppercase">SPEEDADMIN</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `flex items-center space-x-4 w-full p-4 rounded-2xl transition font-bold text-sm ${isActive ? 'bg-blue-600 text-white shadow-2xl shadow-blue-500/20' : 'hover:bg-white/5 hover:text-white'}`}>
              <item.icon className="w-5 h-5" />
              <span className="hidden md:block">{item.label}</span>
            </NavLink>
          ))}
          <button onClick={logout} className="mt-10 flex items-center space-x-4 w-full p-4 rounded-2xl hover:bg-red-500/10 text-red-400 transition font-bold text-sm"><LogOut className="w-5 h-5" /> <span className="hidden md:block">Close Session</span></button>
        </nav>
        
        <div className="hidden md:block pt-10 border-t border-white/5 text-center">
           <p className="text-[8px] font-black uppercase tracking-[0.4em] opacity-30">Admin: {currentUser?.name}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Header */}
        <header className="h-24 bg-white border-b border-slate-100 px-12 flex items-center justify-between sticky top-0 z-20 shrink-0">
           <div className="flex items-center space-x-6">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Control</h1>
              <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full"><div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div><span className="text-[10px] font-black text-blue-600 uppercase">Neural Nodes Sync</span></div>
           </div>
           <div className="flex items-center space-x-6">
              <div className="text-right hidden sm:block">
                 <p className="text-sm font-black text-slate-900">{currentUser?.name}</p>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Master Protocol</p>
              </div>
              <div className="w-12 h-12 rounded-2xl overflow-hidden ring-4 ring-slate-50"><img src={currentUser?.avatar} className="w-full h-full object-cover" /></div>
           </div>
        </header>

        {/* Dynamic Route Content */}
        <div className="flex-1 overflow-hidden relative">
          <Routes>
            <Route path="/" element={<AdminOverview stats={stats} pendingDrivers={drivers.filter(d => !d.isVerified)} handleVerification={handleVerification} loading={loading} />} />
            <Route path="/users" element={<UserRegistry />} />
            <Route path="/rides" element={<AdminRides />} />
            <Route path="/regions" element={<AdminRegionManager />} />
            <Route path="/promos" element={<AdminPromotions />} />
            <Route path="/support" element={<AdminSupport />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
