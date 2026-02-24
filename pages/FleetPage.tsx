
import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Zap, Users, Smartphone, ShieldCheck, Clock, CreditCard, ChevronRight, ArrowRight, Truck, Bus, Bike, Star } from 'lucide-react';
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Economy */}
            <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 hover:border-blue-200 transition-all group">
              <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Smartphone className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-3">Economy</h2>
              <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
                Affordable, everyday rides. Perfect for your daily commute across the city.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-xs font-bold text-slate-500"><CheckCircle className="w-3 h-3 mr-2 text-emerald-500" /> Seats up to 4</li>
                <li className="flex items-center text-xs font-bold text-slate-500"><CheckCircle className="w-3 h-3 mr-2 text-emerald-500" /> Professional Drivers</li>
              </ul>
              <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">From ₦1,200</span>
                <Link to="/auth" className="font-black text-[10px] uppercase tracking-widest flex items-center hover:text-blue-600">Book <ChevronRight className="w-3 h-3 ml-1" /></Link>
              </div>
            </div>

            {/* Comfort */}
            <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 hover:border-indigo-200 transition-all group">
              <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-3">Comfort</h2>
              <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
                Newer cars with extra legroom. For when you need a more relaxed journey.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-xs font-bold text-slate-500"><CheckCircle className="w-3 h-3 mr-2 text-emerald-500" /> Extra Legroom</li>
                <li className="flex items-center text-xs font-bold text-slate-500"><CheckCircle className="w-3 h-3 mr-2 text-emerald-500" /> Top-rated Drivers</li>
              </ul>
              <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">From ₦2,500</span>
                <Link to="/auth" className="font-black text-[10px] uppercase tracking-widest flex items-center hover:text-indigo-600">Book <ChevronRight className="w-3 h-3 ml-1" /></Link>
              </div>
            </div>

            {/* Luxury */}
            <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 hover:border-slate-900 transition-all group">
              <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Star className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-3">Luxury</h2>
              <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
                Premium high-end vehicles. Arrive in style for your most important meetings.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-xs font-bold text-slate-500"><CheckCircle className="w-3 h-3 mr-2 text-emerald-500" /> High-end Sedans</li>
                <li className="flex items-center text-xs font-bold text-slate-500"><CheckCircle className="w-3 h-3 mr-2 text-emerald-500" /> VIP Experience</li>
              </ul>
              <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">From ₦5,000</span>
                <Link to="/auth" className="font-black text-[10px] uppercase tracking-widest flex items-center hover:text-slate-900">Book <ChevronRight className="w-3 h-3 ml-1" /></Link>
              </div>
            </div>

            {/* Bus */}
            <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 hover:border-emerald-200 transition-all group">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Bus className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-3">Bus</h2>
              <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
                Group travel made easy. Spacious vans and buses for your team or family.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-xs font-bold text-slate-500"><CheckCircle className="w-3 h-3 mr-2 text-emerald-500" /> Seats up to 14</li>
                <li className="flex items-center text-xs font-bold text-slate-500"><CheckCircle className="w-3 h-3 mr-2 text-emerald-500" /> Group Optimized</li>
              </ul>
              <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">From ₦3,500</span>
                <Link to="/auth" className="font-black text-[10px] uppercase tracking-widest flex items-center hover:text-emerald-600">Book <ChevronRight className="w-3 h-3 ml-1" /></Link>
              </div>
            </div>

            {/* Truck */}
            <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 hover:border-amber-200 transition-all group">
              <div className="w-14 h-14 bg-amber-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Truck className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-3">Truck</h2>
              <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
                Hauling and logistics. Reliable trucks for moving your goods safely.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-xs font-bold text-slate-500"><CheckCircle className="w-3 h-3 mr-2 text-emerald-500" /> Heavy Duty</li>
                <li className="flex items-center text-xs font-bold text-slate-500"><CheckCircle className="w-3 h-3 mr-2 text-emerald-500" /> Logistics Support</li>
              </ul>
              <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">From ₦8,000</span>
                <Link to="/auth" className="font-black text-[10px] uppercase tracking-widest flex items-center hover:text-amber-600">Book <ChevronRight className="w-3 h-3 ml-1" /></Link>
              </div>
            </div>

            {/* Tricycle */}
            <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 hover:border-orange-200 transition-all group">
              <div className="w-14 h-14 bg-orange-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Bike className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-3">Tricycle</h2>
              <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
                Fast and agile. The best way to beat traffic in busy urban areas.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-xs font-bold text-slate-500"><CheckCircle className="w-3 h-3 mr-2 text-emerald-500" /> Beat the Traffic</li>
                <li className="flex items-center text-xs font-bold text-slate-500"><CheckCircle className="w-3 h-3 mr-2 text-emerald-500" /> Highly Affordable</li>
              </ul>
              <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">From ₦800</span>
                <Link to="/auth" className="font-black text-[10px] uppercase tracking-widest flex items-center hover:text-orange-600">Book <ChevronRight className="w-3 h-3 ml-1" /></Link>
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
              <Link to="/contact" className="hover:text-white transition">Contact</Link>
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
