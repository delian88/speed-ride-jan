
import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Zap, Users, Smartphone, ShieldCheck, Clock, CreditCard, ChevronRight, ArrowRight } from 'lucide-react';
import Logo from '../components/Logo';

const FleetPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed w-full z-50 glass border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center">
              <Logo className="h-12 w-auto" />
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/auth" className="text-slate-900 font-bold hover:text-blue-600 transition">Sign In</Link>
              <Link to="/auth" className="bg-slate-900 text-white font-bold py-2.5 px-6 rounded-full hover:bg-blue-600 transition shadow-xl">
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter">THE 2026 FLEET</h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
              Every vehicle in our network is vetted for safety, comfort, and efficiency. Experience the future of urban mobility.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-slate-50 p-10 rounded-[48px] border border-slate-100 hover:border-blue-200 transition-all">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                  <Smartphone className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4">Economy Plus</h2>
                <p className="text-slate-600 font-medium leading-relaxed mb-6">
                  Our most popular choice for daily commutes. Clean, modern sedans with professional drivers who know every shortcut in the city.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm font-bold text-slate-500"><CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> Seats up to 4</li>
                  <li className="flex items-center text-sm font-bold text-slate-500"><CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> Climate Control</li>
                  <li className="flex items-center text-sm font-bold text-slate-500"><CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> 5-Star Rated Drivers</li>
                </ul>
                <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-widest text-blue-600">Starting at ₦1,200</span>
                  <Link to="/auth" className="font-black text-xs uppercase tracking-widest flex items-center hover:text-blue-600">Book <ChevronRight className="w-4 h-4 ml-1" /></Link>
                </div>
              </div>

              <div className="bg-slate-50 p-10 rounded-[48px] border border-slate-100 hover:border-blue-200 transition-all">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                  <Zap className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4">Tesla Premium</h2>
                <p className="text-slate-600 font-medium leading-relaxed mb-6">
                  Arrive in style and silence. Our premium electric fleet offers a quiet, luxurious experience with advanced tech features.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm font-bold text-slate-500"><CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> All-Electric Fleet</li>
                  <li className="flex items-center text-sm font-bold text-slate-500"><CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> In-car Wi-Fi & Charging</li>
                  <li className="flex items-center text-sm font-bold text-slate-500"><CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> Premium Sound System</li>
                </ul>
                <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-widest text-indigo-600">Starting at ₦3,500</span>
                  <Link to="/auth" className="font-black text-xs uppercase tracking-widest flex items-center hover:text-indigo-600">Book <ChevronRight className="w-4 h-4 ml-1" /></Link>
                </div>
              </div>
            </div>

            <div className="space-y-8 md:mt-12">
              <div className="bg-slate-50 p-10 rounded-[48px] border border-slate-100 hover:border-blue-200 transition-all">
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                  <Users className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4">Speed XL</h2>
                <p className="text-slate-600 font-medium leading-relaxed mb-6">
                  Perfect for groups, families, or when you just need that extra space for luggage. Spacious SUVs and vans at your service.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm font-bold text-slate-500"><CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> Seats up to 8</li>
                  <li className="flex items-center text-sm font-bold text-slate-500"><CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> Extra Luggage Space</li>
                  <li className="flex items-center text-sm font-bold text-slate-500"><CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> Ideal for Airport Runs</li>
                </ul>
                <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-600">Starting at ₦5,000</span>
                  <Link to="/auth" className="font-black text-xs uppercase tracking-widest flex items-center hover:text-emerald-600">Book <ChevronRight className="w-4 h-4 ml-1" /></Link>
                </div>
              </div>

              <div className="bg-slate-50 p-10 rounded-[48px] border border-slate-100 hover:border-blue-200 transition-all">
                <div className="w-16 h-16 bg-orange-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                  <Car className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4">Nano Bike</h2>
                <p className="text-slate-600 font-medium leading-relaxed mb-6">
                  The ultimate traffic buster. Fast, agile, and incredibly affordable. Get through the city's tightest spots in record time.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm font-bold text-slate-500"><CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> Beat the Gridlock</li>
                  <li className="flex items-center text-sm font-bold text-slate-500"><CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> Helmet Provided</li>
                  <li className="flex items-center text-sm font-bold text-slate-500"><CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> Solo Travel Optimized</li>
                </ul>
                <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-widest text-orange-600">Starting at ₦500</span>
                  <Link to="/auth" className="font-black text-xs uppercase tracking-widest flex items-center hover:text-orange-600">Book <ChevronRight className="w-4 h-4 ml-1" /></Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <Logo className="h-16 w-auto mx-auto brightness-0 invert" />
          <p className="text-slate-400 font-medium max-w-md mx-auto">
            SpeedRide 2026. Redefining the way you move through the world.
          </p>
          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-500 text-xs font-bold">© 2026 SpeedRide Mobility Inc.</p>
            <div className="flex space-x-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <Link to="/safety" className="hover:text-white transition">Safety</Link>
              <Link to="/drive" className="hover:text-white transition">Drive</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

export default FleetPage;
