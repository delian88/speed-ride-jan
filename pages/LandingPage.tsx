
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, Shield, Clock, CreditCard, ChevronRight, 
  MapPin, Star, Phone, CheckCircle, Zap,
  Smartphone, Award, Users, HelpCircle, ArrowRight,
  ShieldCheck, Map, Wallet, MessageSquare,
  Globe, ShieldAlert, Cpu, BarChart3, TrendingUp,
  User as UserIcon
} from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col bg-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed w-full z-50 glass border-b border-gray-100 transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center group cursor-pointer">
              <div className="bg-blue-600 p-1.5 rounded-lg mr-2 group-hover:rotate-12 transition-transform">
                <Zap className="h-6 w-6 text-white fill-current" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900">SPEEDRIDE</span>
            </div>
            <div className="hidden lg:flex space-x-10 font-bold text-slate-600">
              <a href="#services" className="hover:text-blue-600 transition-colors">Fleet</a>
              <a href="#safety" className="hover:text-blue-600 transition-colors">Safety</a>
              <a href="#opportunity" className="hover:text-blue-600 transition-colors">Drive</a>
              <a href="#how-it-works" className="hover:text-blue-600 transition-colors">Tech</a>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/auth" className="hidden sm:block text-slate-900 font-bold hover:text-blue-600 transition">Sign In</Link>
              <Link to="/auth" className="bg-slate-900 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200">
                Book a Ride
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-[60%] h-[100%] bg-gradient-to-l from-blue-50 to-transparent rounded-bl-[100px] animate-drift"></div>
        <div className="absolute top-40 -left-20 -z-10 w-96 h-96 bg-blue-100 rounded-full blur-[120px] opacity-40 animate-pulse"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-bold text-sm animate-fade-up">
              <Award className="w-4 h-4" />
              <span>The Future of Mobility is Here</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.95] tracking-tight animate-fade-up stagger-1">
              Urban Travel <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Reimagined.</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-lg leading-relaxed font-medium animate-fade-up stagger-2">
              Move through the city with 2026 precision. SpeedRide combines AI matching with a premium electric fleet to deliver the fastest arrival times in history.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-up stagger-3">
              <Link to="/auth" className="group flex items-center justify-center bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-slate-300">
                Start My Journey <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
              </Link>
              <a href="#opportunity" className="flex items-center justify-center border-2 border-slate-200 text-slate-900 px-10 py-5 rounded-2xl font-bold hover:border-slate-900 hover:bg-slate-50 transition-all">
                Partner with Us
              </a>
            </div>
          </div>

          <div className="relative lg:ml-auto animate-fade-up stagger-2">
             <div className="absolute -inset-10 bg-blue-500/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>
             <img 
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1000&q=80" 
              className="rounded-[40px] shadow-2xl object-cover h-[600px] w-full transform -rotate-2 hover:rotate-0 transition-all duration-1000 animate-float" 
              alt="Premium Ride" 
             />
             <div className="absolute top-20 -left-12 bg-white p-6 rounded-3xl shadow-2xl border border-slate-50 animate-float stagger-2">
                <div className="bg-blue-600 p-3 rounded-2xl mb-2 inline-block"><Cpu className="text-white w-6 h-6" /></div>
                <p className="font-black text-slate-900">AI Routing v4.0</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Optimizing every path</p>
             </div>
          </div>
        </div>
      </section>

      {/* Services Fleet Section */}
      <section id="services" className="py-32 px-4 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-blue-600 font-black tracking-widest uppercase text-xs">The 2026 Fleet</h2>
            <p className="text-4xl md:text-5xl font-black text-slate-900">Tailored to your lifestyle</p>
            <p className="text-slate-500 font-medium">From solo commutes to team board meetings on wheels, we have the perfect ride for every occasion.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Economy Plus', icon: Smartphone, desc: 'Smart, efficient, and affordable city hops.', price: 'Low', feat: 'Instant Pickup' },
              { title: 'Tesla Premium', icon: Zap, desc: 'Eco-luxury with full self-driving support.', price: 'Premium', feat: 'In-ride Wi-Fi' },
              { title: 'Speed XL', icon: Users, desc: 'Spacious vans for up to 8 passengers.', price: 'Medium', feat: 'Large Luggage' },
              { title: 'Nano Bike', icon: Car, desc: 'Beat the gridlock with ultra-fast couriers.', price: 'Ultra-Low', feat: 'Heavy Traffic' }
            ].map((item, i) => (
              <div key={i} className="group p-8 rounded-[40px] bg-slate-50 border border-slate-100 hover:bg-slate-900 hover:text-white transition-all duration-500 cursor-pointer hover:-translate-y-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-blue-600 group-hover:rotate-12 transition-all">
                  <item.icon className="w-8 h-8 text-blue-600 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-black mb-3">{item.title}</h3>
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

      {/* Safety Section */}
      <section id="safety" className="py-32 px-4 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80" className="rounded-[60px] shadow-2xl animate-float" />
            <div className="absolute bottom-10 -right-10 bg-blue-600 p-10 rounded-[40px] shadow-2xl">
              <ShieldCheck className="w-16 h-16 text-white" />
            </div>
          </div>
          <div className="space-y-10">
            <h2 className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs">SpeedRide Shield</h2>
            <p className="text-5xl font-black leading-tight">Safety is built into every byte of code.</p>
            <div className="space-y-8">
              {[
                { title: 'AI Sentry Monitoring', desc: 'Our cloud platform monitors every route 24/7, flagging anomalies in real-time.', icon: ShieldAlert },
                // Fix: Corrected 'UserIcon' not found error by importing 'User as UserIcon' from lucide-react
                { title: 'Verified Professional DNA', desc: 'Drivers undergo bi-annual background & biometric clearance.', icon: UserIcon },
                { title: 'One-Tap Rapid Response', desc: 'Direct link to local security and medical units in under 2 minutes.', icon: Phone }
              ].map((s, idx) => (
                <div key={idx} className="flex items-start space-x-6">
                  <div className="bg-white/5 p-4 rounded-2xl"><s.icon className="text-blue-500 w-8 h-8" /></div>
                  <div>
                    <h4 className="text-xl font-black mb-1">{s.title}</h4>
                    <p className="text-slate-400 font-medium">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Driver Opportunity Section */}
      <section id="opportunity" className="py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center mb-24 space-y-4">
          <h2 className="text-blue-600 font-black uppercase tracking-widest text-xs">Join the Elite</h2>
          <p className="text-4xl md:text-6xl font-black text-slate-900">Be Your Own CEO</p>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">Our 2026 driver-first platform offers more than just rides—it offers a career path with total flexibility.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { title: 'Daily Settlement', icon: Wallet, value: '₦450k+', sub: 'Average weekly earnings' },
            { title: 'Full Autonomy', icon: Map, value: 'Anytime', sub: 'Work when you choose' },
            { title: 'Fleet Discounts', icon: Car, value: '25% Off', sub: 'Maintenance & EV charging' }
          ].map((item, i) => (
            <div key={i} className="bg-slate-50 p-12 rounded-[50px] border border-slate-100 text-center hover:shadow-xl transition duration-500">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                <item.icon className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-5xl font-black text-slate-900 mb-2">{item.value}</p>
              <p className="font-black text-blue-600 uppercase tracking-widest text-xs mb-6">{item.title}</p>
              <p className="text-slate-500 font-bold">{item.sub}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-20 text-center">
           <Link to="/auth" className="inline-flex items-center space-x-4 bg-slate-900 text-white px-12 py-6 rounded-[32px] font-black hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all shadow-2xl">
             <span>Apply as a Driver Partner</span>
             <ChevronRight className="w-5 h-5" />
           </Link>
        </div>
      </section>

      {/* Global Presence & Tech Stats */}
      <section className="py-24 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12 text-center">
          <div><p className="text-5xl font-black mb-2">42</p><p className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Global Cities</p></div>
          <div><p className="text-5xl font-black mb-2">1.2M</p><p className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Monthly Users</p></div>
          <div><p className="text-5xl font-black mb-2">99.8%</p><p className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Safety Rating</p></div>
          <div><p className="text-5xl font-black mb-2">84k</p><p className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Partner Drivers</p></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-32 pb-12 px-4 border-t border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-16 mb-24">
            <div className="md:col-span-5 space-y-10">
              <div className="flex items-center">
                <div className="bg-blue-600 p-2 rounded-xl mr-3 shadow-lg">
                  <Zap className="h-6 w-6 text-white fill-current" />
                </div>
                <span className="text-3xl font-black tracking-tighter text-slate-900">SPEEDRIDE</span>
              </div>
              <p className="text-slate-500 font-bold text-lg max-w-sm leading-relaxed">Redefining mobility with cutting-edge tech and elite service. Experience the city like never before.</p>
              <div className="flex space-x-4">
                 {['Twitter', 'LinkedIn', 'Instagram'].map(s => <button key={s} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition text-slate-400 font-bold text-[10px] uppercase">{s[0]}</button>)}
              </div>
            </div>
            
            <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
              <div className="space-y-6">
                <p className="font-black text-xs uppercase tracking-[0.3em] text-slate-400">Platform</p>
                <ul className="space-y-4 font-bold text-slate-600 text-sm">
                  <li><a href="#" className="hover:text-blue-600 transition">How it Works</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition">Our Fleet</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition">Gift Cards</a></li>
                </ul>
              </div>
              <div className="space-y-6">
                <p className="font-black text-xs uppercase tracking-[0.3em] text-slate-400">Partners</p>
                <ul className="space-y-4 font-bold text-slate-600 text-sm">
                  <li><a href="#" className="hover:text-blue-600 transition">Apply to Drive</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition">Fleet Solutions</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition">Safety Standards</a></li>
                </ul>
              </div>
              <div className="space-y-6">
                <p className="font-black text-xs uppercase tracking-[0.3em] text-slate-400">Support</p>
                <ul className="space-y-4 font-bold text-slate-600 text-sm">
                  <li><a href="#" className="hover:text-blue-600 transition">Help Center</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition">Contact Us</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-400 text-xs font-bold">© 2026 SpeedRide Mobility Inc. All rights reserved.</p>
            <div className="group cursor-pointer">
              <a 
                href="https://www.premegagetech.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 group-hover:text-blue-600 transition-colors"
              >
                Powered by Premegage Tech
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
