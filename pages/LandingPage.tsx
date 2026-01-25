
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, Shield, Clock, CreditCard, ChevronRight, 
  MapPin, Star, Phone, CheckCircle, Zap,
  Smartphone, Award, Users, HelpCircle, ArrowRight,
  ShieldCheck, Map, Wallet, MessageSquare,
  Globe, ShieldAlert, Cpu, BarChart3, TrendingUp,
  User as UserIcon, Menu, X
} from 'lucide-react';
import Logo from '../components/Logo';

const LandingPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col bg-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed w-full z-50 glass border-b border-gray-100 transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center group cursor-pointer h-full py-2 shrink-0">
              <Logo className="h-12 md:h-16 w-auto group-hover:scale-105 transition-transform" />
            </Link>
            
            {/* Desktop Nav */}
            <div className="hidden lg:flex space-x-10 font-bold text-slate-600">
              <a href="#services" className="hover:text-blue-600 transition-colors">Fleet</a>
              <a href="#safety" className="hover:text-blue-600 transition-colors">Safety</a>
              <a href="#opportunity" className="hover:text-blue-600 transition-colors">Drive</a>
              <a href="#how-it-works" className="hover:text-blue-600 transition-colors">Tech</a>
            </div>

            <div className="flex items-center space-x-4 md:space-x-6">
              <Link to="/auth" className="hidden sm:block text-slate-900 font-bold hover:text-blue-600 transition">Sign In</Link>
              <Link to="/auth" className="bg-slate-900 text-white font-bold py-2.5 px-6 md:py-3 md:px-8 rounded-full hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200 text-sm md:text-base">
                Book a Ride
              </Link>
              {/* Mobile Toggle */}
              <button 
                className="lg:hidden p-2 text-slate-600"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 p-6 space-y-4 shadow-2xl animate-in slide-in-from-top duration-300">
            <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="block font-bold text-slate-600 hover:text-blue-600">Fleet</a>
            <a href="#safety" onClick={() => setIsMobileMenuOpen(false)} className="block font-bold text-slate-600 hover:text-blue-600">Safety</a>
            <a href="#opportunity" onClick={() => setIsMobileMenuOpen(false)} className="block font-bold text-slate-600 hover:text-blue-600">Drive</a>
            <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="block font-bold text-slate-600 hover:text-blue-600">Sign In</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-48 pb-16 md:pb-32 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-[100%] md:w-[60%] h-[100%] bg-gradient-to-l from-blue-50 to-transparent rounded-bl-[100px] animate-drift"></div>
        <div className="absolute top-40 -left-20 -z-10 w-96 h-96 bg-blue-100 rounded-full blur-[120px] opacity-40 animate-pulse"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6 md:space-y-10 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-bold text-sm animate-fade-up">
              <Award className="w-4 h-4" />
              <span>The Future of Mobility is Here</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[0.95] tracking-tight animate-fade-up">
              Urban Travel <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Reimagined.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium animate-fade-up">
              Move through the city with 2026 precision. SpeedRide combines AI matching with a premium electric fleet.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-up">
              <Link to="/auth" className="group flex items-center justify-center bg-slate-900 text-white px-8 py-4 md:px-10 md:py-5 rounded-2xl font-bold hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-slate-300">
                Start My Journey <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
              </Link>
              <a href="#opportunity" className="flex items-center justify-center border-2 border-slate-200 text-slate-900 px-8 py-4 md:px-10 md:py-5 rounded-2xl font-bold hover:border-slate-900 hover:bg-slate-50 transition-all">
                Partner with Us
              </a>
            </div>
          </div>

          <div className="relative lg:ml-auto animate-fade-up hidden md:block">
             <div className="absolute -inset-10 bg-blue-500/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>
             <img 
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1000&q=80" 
              className="rounded-[40px] shadow-2xl object-cover h-[400px] lg:h-[600px] w-full transform -rotate-2 hover:rotate-0 transition-all duration-1000 animate-float" 
              alt="Premium Ride" 
             />
             <div className="absolute top-20 -left-12 bg-white p-6 rounded-3xl shadow-2xl border border-slate-50 animate-float hidden lg:block">
                <div className="mb-2 inline-block">
                  <Logo className="h-10 w-auto" />
                </div>
                <p className="font-black text-slate-900">AI Routing v4.0</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Optimizing every path</p>
             </div>
          </div>
        </div>
      </section>

      {/* Services Fleet Section */}
      <section id="services" className="py-16 md:py-32 px-4 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20 space-y-4">
            <h2 className="text-blue-600 font-black tracking-widest uppercase text-xs">The 2026 Fleet</h2>
            <p className="text-3xl md:text-5xl font-black text-slate-900">Tailored to your lifestyle</p>
            <p className="text-slate-500 font-medium">From solo commutes to team board meetings on wheels.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { title: 'Economy Plus', icon: Smartphone, desc: 'Smart, efficient, and affordable city hops.', price: 'Low', feat: 'Instant Pickup' },
              { title: 'Tesla Premium', icon: Zap, desc: 'Eco-luxury with full self-driving support.', price: 'Premium', feat: 'In-ride Wi-Fi' },
              { title: 'Speed XL', icon: Users, desc: 'Spacious vans for up to 8 passengers.', price: 'Medium', feat: 'Large Luggage' },
              { title: 'Nano Bike', icon: Car, desc: 'Beat the gridlock with ultra-fast couriers.', price: 'Ultra-Low', feat: 'Heavy Traffic' }
            ].map((item, i) => (
              <div key={i} className="group p-6 md:p-8 rounded-[40px] bg-slate-50 border border-slate-100 hover:bg-slate-900 hover:text-white transition-all duration-500 cursor-pointer hover:-translate-y-4">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-blue-600 group-hover:rotate-12 transition-all">
                  <item.icon className="w-7 h-7 md:w-8 md:h-8 text-blue-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-black mb-3">{item.title}</h3>
                <p className="text-sm font-medium opacity-60 mb-6">{item.desc}</p>
                <div className="flex items-center justify-between pt-6 border-t border-slate-200 group-hover:border-white/10">
                  <span className="text-[10px] font-black uppercase tracking-widest">{item.feat}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer (Simplified for brevity in response) */}
      <footer className="bg-white pt-16 pb-12 px-4 border-t border-slate-100">
        <div className="max-w-7xl mx-auto text-center">
          <Logo className="h-12 w-auto mx-auto mb-8" />
          <p className="text-slate-400 text-xs font-bold">© 2026 SpeedRide Mobility Inc. All rights reserved.</p>
          <a href="https://www.premegagetech.com" className="mt-4 block text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Powered by Premegage Tech</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
