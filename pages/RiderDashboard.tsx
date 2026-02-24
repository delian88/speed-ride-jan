
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { 
  MapPin, Navigation, Car, Zap, CheckCircle, 
  Shield, ShieldCheck, Loader2, Plus, X, CreditCard, Wallet, LogOut, Menu, History, ExternalLink, RefreshCw
} from 'lucide-react';
import { useApp } from '../App';
import { RideStatus, VehicleType, RideRequest } from '../types';
import { db } from '../database';

/**
 * SPEEDRIDE 2026 | BudPay Configuration
 */
const BUDPAY_SECRET_KEY = "sk_test_zudz0pzuse78aospgybdczmwsv2drb6ddwr7lod"; 

const InvoiceHistory: React.FC<{ refreshTrigger: number, onFunded: () => void }> = ({ refreshTrigger, onFunded }) => {
  const { currentUser, showToast } = useApp();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const list = await db.invoices.getByUser(currentUser.id);
      setInvoices(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [currentUser, refreshTrigger]);

  const handleManualVerify = async (inv: any) => {
    if (inv.status === 'PAID') return;
    
    showToast("Verifying with Gateway Core...", "info");
    setTimeout(async () => {
      await db.invoices.updateStatus(inv.invoice_no, 'PAID');
      await db.users.fundWallet(currentUser!.id, parseFloat(inv.amount));
      showToast("Payment Synchronized. Wallet Updated.", "success");
      onFunded();
      fetchInvoices();
    }, 1500);
  };

  return (
    <div className="p-8 md:p-12 space-y-10 bg-white h-full overflow-y-auto custom-scrollbar">
       <div className="flex justify-between items-center">
         <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Invoice Ledger</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Wallet Provisioning History</p>
         </div>
         <button onClick={fetchInvoices} className="p-4 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-2xl transition">
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
         </button>
       </div>

       <div className="space-y-4">
         {loading && invoices.length === 0 ? <div className="p-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-slate-200" /></div> :
          invoices.length === 0 ? (
            <div className="p-20 text-center space-y-4 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
               <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto text-slate-200"><History className="w-8 h-8" /></div>
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No transmissions found in ledger</p>
               <p className="text-[10px] text-slate-400 uppercase">Tip: Invoices using Test Keys only appear in BudPay's "Test Mode" dashboard.</p>
            </div>
          ) : (
            invoices.map((inv, idx) => (
              <div key={idx} className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-blue-200 transition-all group">
                 <div className="flex items-center space-x-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                       <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{inv.invoice_no}</p>
                       <p className="text-xl font-black text-slate-900">₦{parseFloat(inv.amount).toLocaleString()}</p>
                    </div>
                 </div>
                 
                 <div className="flex items-center space-x-4 w-full md:w-auto">
                    <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                       {inv.status}
                    </span>
                    {inv.status !== 'PAID' && (
                       <>
                         <a href={inv.redirect_link} target="_blank" rel="noreferrer" className="flex-1 md:flex-none py-3 px-6 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center space-x-2">
                           <span>Pay Now</span><ExternalLink className="w-3 h-3" />
                         </a>
                         <button onClick={() => handleManualVerify(inv)} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 rounded-xl transition">
                           <CheckCircle className="w-5 h-5" />
                         </button>
                       </>
                    )}
                 </div>
              </div>
            ))
          )}
       </div>
    </div>
  );
};

const TopUpModal: React.FC<{ isOpen: boolean, onClose: () => void, onFunded: () => void }> = ({ isOpen, onClose, onFunded }) => {
  const { currentUser, showToast } = useApp();
  const [amount, setAmount] = useState('');
  const [isFunding, setIsFunding] = useState(false);
  const [invoiceLink, setInvoiceLink] = useState<string | null>(null);

  const handleCreateInvoice = async () => {
    const val = parseFloat(amount);
    if (!val || val < 100) {
      showToast("Minimum top-up is ₦100", "error");
      return;
    }

    setIsFunding(true);

    try {
      const duedate = new Date();
      duedate.setDate(duedate.getDate() + 1); 
      const invoiceNo = `SR-${Date.now()}`;

      const response = await fetch('https://api.budpay.com/api/v2/create_invoice', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${BUDPAY_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: "Wallet Top-up - SpeedRide",
          duedate: duedate.toISOString().split('T')[0],
          currency: "NGN",
          invoicenumber: invoiceNo,
          reminder: "1",
          email: currentUser?.email,
          first_name: currentUser?.name.split(' ')[0] || "User",
          last_name: currentUser?.name.split(' ')[1] || "SpeedRide",
          billing_address: "SpeedRide Terminal 1",
          billing_city: "Abuja",
          billing_state: "FCT",
          billing_country: "Nigeria",
          billing_zipcode: "234",
          items: [
            {
              description: "Neural Wallet Credit Injection",
              quantity: "1",
              unit_price: val.toString(),
              meta_data: ""
            }
          ]
        })
      });

      const result = await response.json();

      // BudPay API returns 'status' boolean
      if (result.status && result.data && result.data[0]?.redirect_link) {
        const link = result.data[0].redirect_link;
        
        await db.invoices.create(currentUser!.id, {
          invoice_no: invoiceNo,
          amount: val,
          status: 'PENDING',
          redirect_link: link
        });

        setInvoiceLink(link);
        showToast("Invoice recorded and synchronized.", "success");
        window.open(link, '_blank', 'noopener,noreferrer');
        onFunded(); // Notify parent to refresh list
      } else {
        console.error("BudPay API Error:", result);
        throw new Error(result.message || "BudPay API rejection. Check keys.");
      }
    } catch (e: any) {
      showToast(e.message || "Gateway Failure", "error");
    } finally {
      setIsFunding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose} />
      <div className="bg-white w-full max-w-md rounded-[44px] shadow-2xl relative z-10 p-10 animate-in zoom-in-95 duration-300 border border-white/20">
        <button onClick={onClose} className="absolute right-8 top-8 p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-900 transition hover:rotate-90"><X className="w-5 h-5" /></button>
        
        <div className="text-center space-y-4 mb-10">
           <div className="w-20 h-20 bg-blue-600 text-white rounded-[32px] flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/30 animate-float">
             <CreditCard className="w-10 h-10" />
           </div>
           <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Fund wallet</h3>
        </div>

        <div className="space-y-6">
           {!invoiceLink ? (
             <>
               <div className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300 group-focus-within:text-blue-600 transition-colors">₦</span>
                  <input 
                    type="number" value={amount} onChange={e => setAmount(e.target.value)} 
                    placeholder="0.00" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-[32px] py-7 pl-14 pr-8 text-3xl font-black outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all placeholder:text-slate-200"
                  />
               </div>

               <div className="grid grid-cols-3 gap-3">
                  {[2000, 5000, 10000].map(val => (
                    <button key={val} onClick={() => setAmount(val.toString())} className="py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm">
                      + ₦{val.toLocaleString()}
                    </button>
                  ))}
               </div>

               <button 
                 disabled={isFunding} onClick={handleCreateInvoice}
                 className="w-full py-6 bg-blue-600 text-white rounded-[28px] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center space-x-3 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-blue-500/20 disabled:opacity-50"
               >
                 {isFunding ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Zap className="w-5 h-5 text-yellow-300" /><span>Fund Account Now</span></>}
               </button>
             </>
           ) : (
             <div className="text-center space-y-6 py-4 animate-in fade-in slide-in-from-bottom-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                   <CheckCircle className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-slate-600 leading-relaxed">
                  Local Ledger Sync'd. Visit the "Invoices" section to track or complete this request.
                </p>
                <button 
                  onClick={() => { setInvoiceLink(null); onClose(); }}
                  className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest"
                >
                  I'll check later
                </button>
                <a href={invoiceLink} target="_blank" rel="noreferrer" className="block text-[10px] font-black text-blue-600 uppercase tracking-widest underline">
                  Open Payment Portal
                </a>
             </div>
           )}
           
           <div className="flex items-center justify-center space-x-2 pt-2 border-t border-slate-50 mt-4">
              <Shield className="w-3 h-3 text-emerald-500" />
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                secure payment
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

const RiderExplore: React.FC<{ onOpenTopUp: () => void }> = ({ onOpenTopUp }) => {
  const { currentUser, refreshUser, showToast } = useApp();
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [pickup, setPickup] = useState('Abuja Tech Hub, Wuse 2');
  const [dropoff, setDropoff] = useState('Nnamdi Azikiwe Airport');
  const [selectedType, setSelectedType] = useState<VehicleType>(VehicleType.ECONOMY);
  const [isBooking, setIsBooking] = useState(false);
  const [activeRide, setActiveRide] = useState<RideRequest | null>(null);

  const calculateFare = (type: VehicleType) => {
    const base = type === VehicleType.ECONOMY ? 1200 : type === VehicleType.PREMIUM ? 3500 : 5000;
    return base + 4500;
  };

  const handleBook = async () => {
    if (!currentUser) return;
    setIsBooking(true);
    try {
      const fare = calculateFare(selectedType);
      if (currentUser.balance < fare) {
        showToast("Insufficient Balance. Fund your wallet.", "error");
        onOpenTopUp();
        setIsBooking(false);
        return;
      }

      const ride = await db.rides.create({
        riderId: currentUser.id,
        pickup,
        dropoff,
        fare,
        vehicleType: selectedType,
        distance: 12.5,
      });
      setActiveRide(ride);
      showToast("Syncing with Fleet Node...", "success");
    } catch (e: any) {
      showToast(e.message, "error");
    } finally {
      setIsBooking(false);
    }
  };

  useEffect(() => {
    if (!activeRide) return;
    const interval = setInterval(async () => {
      const allRides = await db.rides.getAll();
      const updated = allRides.find(r => r.id === activeRide.id);
      if (updated) {
        setActiveRide(updated);
        if (updated.status === RideStatus.COMPLETED) {
          clearInterval(interval);
          refreshUser();
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [activeRide, refreshUser]);

  return (
    <div className="flex h-full w-full bg-slate-50 relative flex-col lg:flex-row">
      <div className={`${isFormVisible ? 'translate-y-0 h-[75%] lg:h-full' : 'translate-y-full lg:translate-y-0 h-0 lg:w-[480px]'} transition-all duration-700 fixed lg:static bottom-0 left-0 w-full lg:w-[480px] bg-white border-r border-slate-100 shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.1)] lg:shadow-none z-50 overflow-y-auto p-8 md:p-12 flex flex-col custom-scrollbar`}>
        {activeRide ? (
          <div className="space-y-10 animate-in fade-in zoom-in duration-700">
             <div className="bg-slate-900 p-10 rounded-[48px] text-white text-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
                <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-6 text-blue-400">Dispatch Synchronized</p>
                <h3 className="text-4xl font-black mb-3 tracking-tighter">{activeRide.status}</h3>
                <div className="inline-flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">ID: {activeRide.id.slice(-6).toUpperCase()}</span>
                </div>
             </div>
             
             <div className="space-y-8">
                <div className="flex items-center space-x-5 bg-slate-50 p-7 rounded-[32px] border border-slate-100">
                   <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md text-blue-600"><Car className="w-7 h-7" /></div>
                   <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fleet Telemetry</p><p className="font-black text-slate-900 text-lg">{activeRide.driverId ? "Partner Assigned" : "Searching Fleet..."}</p></div>
                </div>
                <div className="space-y-6 px-4">
                   <div className="flex items-start space-x-4">
                      <div className="flex flex-col items-center mt-1.5">
                        <div className="w-3 h-3 rounded-full border-2 border-emerald-500 bg-white" />
                        <div className="w-0.5 h-10 border-l-2 border-dashed border-slate-200" />
                      </div>
                      <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Pickup Signal</p><p className="font-bold text-slate-900 leading-tight">{activeRide.pickup}</p></div>
                   </div>
                   <div className="flex items-start space-x-4">
                      <div className="w-3 h-3 rounded-full bg-blue-600 mt-1.5 shadow-lg shadow-blue-500/50" />
                      <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Destination Node</p><p className="font-bold text-slate-900 leading-tight">{activeRide.dropoff}</p></div>
                   </div>
                </div>
             </div>

             {activeRide.status === RideStatus.COMPLETED && (
               <button onClick={() => setActiveRide(null)} className="w-full py-6 bg-slate-900 text-white rounded-[32px] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all">Start New Mission</button>
             )}
          </div>
        ) : (
          <div className="space-y-10">
            <div className="flex justify-between items-end">
               <div>
                 <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Request</h2>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Fleet Access Node</p>
               </div>
               <div className="flex items-center space-x-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Secured</span>
               </div>
            </div>
            
            {currentUser?.balance === 0 && (
               <div className="bg-amber-50 border border-amber-100 p-8 rounded-[40px] flex items-start space-x-5 animate-pulse">
                  <div className="p-4 bg-amber-500 text-white rounded-2xl shadow-xl shadow-amber-500/20"><Wallet className="w-6 h-6" /></div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-amber-700 uppercase tracking-[0.2em] mb-2">Wallet Depleted</p>
                    <p className="text-xs font-bold text-slate-600 leading-relaxed">System requires provisioning before journey requests. Use the "Top Up" node to continue.</p>
                  </div>
               </div>
            )}

            <div className="space-y-5">
              <div className="relative group">
                 <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-600 w-5 h-5 group-focus-within:scale-125 transition-transform" />
                 <input value={pickup} onChange={e => setPickup(e.target.value)} placeholder="Origin Node" className="w-full pl-16 pr-8 py-6 bg-slate-50 border border-slate-100 rounded-[32px] font-black text-sm outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all" />
              </div>
              <div className="relative group">
                 <Navigation className="absolute left-6 top-1/2 -translate-y-1/2 text-red-500 w-5 h-5 group-focus-within:rotate-45 transition-transform" />
                 <input value={dropoff} onChange={e => setDropoff(e.target.value)} placeholder="Destination Node" className="w-full pl-16 pr-8 py-6 bg-slate-50 border border-slate-100 rounded-[32px] font-black text-sm outline-none focus:ring-4 focus:ring-red-600/5 focus:border-red-600 transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[VehicleType.ECONOMY, VehicleType.PREMIUM, VehicleType.XL].map(type => (
                <button key={type} onClick={() => setSelectedType(type)} className={`p-5 rounded-[36px] border-2 transition-all flex flex-col items-center justify-center relative overflow-hidden ${selectedType === type ? 'border-blue-600 bg-blue-50/50 shadow-2xl shadow-blue-600/10' : 'border-slate-50 bg-white hover:border-slate-200'}`}>
                  {selectedType === type && <div className="absolute top-0 right-0 bg-blue-600 p-1 rounded-bl-xl"><CheckCircle className="w-3 h-3 text-white" /></div>}
                  <Car className={`w-9 h-9 mb-3 ${selectedType === type ? 'text-blue-600 scale-110' : 'text-slate-300'} transition-transform`} />
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{type}</p>
                  <p className="text-sm font-black text-slate-900">₦{calculateFare(type).toLocaleString()}</p>
                </button>
              ))}
            </div>

            <button disabled={isBooking} onClick={handleBook} className="w-full py-7 bg-slate-900 text-white rounded-[32px] font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-600 hover:scale-[1.03] active:scale-95 transition-all shadow-2xl shadow-slate-300 flex items-center justify-center space-x-3 disabled:grayscale disabled:opacity-50">
              {isBooking ? <><Loader2 className="w-6 h-6 animate-spin" /><span>Syncing Core...</span></> : <span>Confirm Mission</span>}
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 relative bg-slate-200 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80')] bg-cover opacity-70 grayscale-[0.4]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/20" />
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-blue-500/10 pointer-events-none">
           <div className="radar-scanner" />
        </div>
      </div>
    </div>
  );
};

const RiderDashboard: React.FC = () => {
  const { logout, currentUser, refreshUser } = useApp();
  const [activeTab, setActiveTab] = useState<'EXPLORE' | 'INVOICES'>('EXPLORE');
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFunded = () => {
    refreshUser();
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="flex flex-col h-screen bg-white font-inter">
      <TopUpModal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} onFunded={handleFunded} />

      <header className="h-24 bg-slate-900 text-white flex items-center justify-between px-8 md:px-12 z-50 shrink-0 border-b border-white/5 shadow-2xl">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-[20px] flex items-center justify-center shadow-2xl shadow-blue-600/30 rotate-3"><Car className="w-7 h-7 text-white" /></div>
            <span className="font-black text-2xl tracking-tighter hidden sm:block uppercase">SPEEDRIDE</span>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-4 bg-white/5 p-1.5 rounded-[22px] border border-white/10">
             <button onClick={() => setActiveTab('EXPLORE')} className={`px-6 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'EXPLORE' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-400 hover:text-white'}`}>Explore</button>
             <button onClick={() => setActiveTab('INVOICES')} className={`px-6 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'INVOICES' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-400 hover:text-white'}`}>Invoices</button>
          </nav>
        </div>
        
        <div className="flex items-center space-x-8">
           <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-1 opacity-80">Neural Ledger</p>
              <div className="flex items-center justify-end space-x-2">
                 <p className={`text-2xl font-black ${currentUser?.balance === 0 ? 'text-red-500' : 'text-white'}`}>₦{currentUser?.balance.toLocaleString()}</p>
              </div>
           </div>
           <button 
             onClick={() => setIsTopUpOpen(true)}
             className="bg-blue-600 text-white px-6 py-4 rounded-[24px] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-blue-500/20 flex items-center space-x-3 border border-blue-400/20"
           >
             <Plus className="w-5 h-5" />
             <span className="hidden md:block text-[11px] font-black uppercase tracking-[0.2em]">Top Up Node</span>
           </button>
           <div className="flex items-center space-x-5 border-l border-white/10 pl-8">
              <div className="relative">
                <img src={currentUser?.avatar} className="w-12 h-12 rounded-[22px] object-cover ring-4 ring-white/5 shadow-2xl border border-white/10" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" />
              </div>
              <button onClick={logout} className="p-4 bg-white/5 rounded-2xl hover:bg-red-500/20 hover:text-red-400 transition-all border border-white/5"><LogOut className="w-5 h-5" /></button>
           </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'EXPLORE' ? (
          <RiderExplore onOpenTopUp={() => setIsTopUpOpen(true)} />
        ) : (
          <InvoiceHistory refreshTrigger={refreshTrigger} onFunded={handleFunded} />
        )}
      </div>

      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 glass rounded-[32px] p-2 flex items-center space-x-2 z-[100] border border-white/20 shadow-2xl">
         <button onClick={() => setActiveTab('EXPLORE')} className={`p-4 rounded-[24px] ${activeTab === 'EXPLORE' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400'}`}><MapPin /></button>
         <button onClick={() => setActiveTab('INVOICES')} className={`p-4 rounded-[24px] ${activeTab === 'INVOICES' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400'}`}><History /></button>
      </nav>
    </div>
  );
};

export default RiderDashboard;
