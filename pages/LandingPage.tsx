
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, Shield, Clock, CreditCard, ChevronRight, 
  MapPin, Star, Phone, CheckCircle, Zap,
  Smartphone, Award, Users, HelpCircle, ArrowRight,
  ShieldCheck, Map, Wallet, MessageSquare,
  Globe, ShieldAlert, Cpu, BarChart3, TrendingUp,
  User as UserIcon, Menu, X, Play, Apple, Download,
  Truck, Bus, Bike
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
            
            {/* Desktop Nav - Updated to open in same tab */}
            <div className="hidden lg:flex space-x-10 font-bold text-slate-600">
              <Link to="/fleet" className="hover:text-blue-600 transition-colors">Fleet</Link>
              <Link to="/safety" className="hover:text-blue-600 transition-colors">Safety</Link>
              <Link to="/drive" className="hover:text-blue-600 transition-colors">Drive</Link>
              <Link to="/how-it-works" className="hover:text-blue-600 transition-colors">How it Works</Link>
              <Link to="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
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
            <Link to="/fleet" onClick={() => setIsMobileMenuOpen(false)} className="block font-bold text-slate-600 hover:text-blue-600">Fleet</Link>
            <Link to="/safety" onClick={() => setIsMobileMenuOpen(false)} className="block font-bold text-slate-600 hover:text-blue-600">Safety</Link>
            <Link to="/drive" onClick={() => setIsMobileMenuOpen(false)} className="block font-bold text-slate-600 hover:text-blue-600">Drive</Link>
            <Link to="/how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="block font-bold text-slate-600 hover:text-blue-600">How it Works</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block font-bold text-slate-600 hover:text-blue-600">Contact</Link>
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
              <Link to="/drive" className="flex items-center justify-center border-2 border-slate-200 text-slate-900 px-8 py-4 md:px-10 md:py-5 rounded-2xl font-bold hover:border-slate-900 hover:bg-slate-50 transition-all">
                Partner with Us
              </Link>
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

      {/* Stats Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {[
              { label: 'Rides Completed', value: '10M+' },
              { label: 'Active Drivers', value: '500K' },
              { label: 'Cities Covered', value: '120+' },
              { label: 'User Rating', value: '4.9/5' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-5xl font-black text-slate-900 mb-2">{stat.value}</p>
                <p className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
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
              { title: 'Economy', icon: Smartphone, desc: 'Smart, efficient, and affordable city hops.', price: 'Low', feat: 'Instant Pickup' },
              { title: 'Comfort', icon: Zap, desc: 'Newer cars with extra legroom and top drivers.', price: 'Medium', feat: 'Extra Space' },
              { title: 'Luxury', icon: Star, desc: 'Premium high-end vehicles for VIP travel.', price: 'Premium', feat: 'Elite Service' },
              { title: 'Bus', icon: Bus, desc: 'Spacious vans for groups up to 14 people.', price: 'Medium', feat: 'Group Travel' },
              { title: 'Truck', icon: Truck, desc: 'Reliable logistics and hauling support.', price: 'High', feat: 'Heavy Duty' },
              { title: 'Tricycle', icon: Bike, desc: 'Fast, agile, and incredibly affordable.', price: 'Ultra-Low', feat: 'Beat Traffic' }
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

      {/* Safety Section */}
      <section id="safety" className="py-16 md:py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-blue-500 font-black tracking-widest uppercase text-xs">Safety Protocol</h2>
              <p className="text-4xl md:text-6xl font-black leading-tight">Your security is our core mission.</p>
              <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
                We've built a multilayered safety system powered by real-time AI and human oversight to ensure every journey is protected.
              </p>
              <div className="grid sm:grid-cols-2 gap-8">
                {[
                  { icon: ShieldCheck, title: 'AI Monitoring', desc: 'Continuous route verification and anomaly detection.' },
                  { icon: Phone, title: '24/7 Support', desc: 'Instant access to emergency response teams.' },
                  { icon: Globe, title: 'Real-time GPS', desc: 'Share your live trip progress with trusted contacts.' },
                  { icon: ShieldAlert, title: 'Health First', desc: 'Verified sanitization protocols for every vehicle.' }
                ].map((item, i) => (
                  <div key={i} className="space-y-3">
                    <item.icon className="w-8 h-8 text-blue-500" />
                    <h4 className="text-xl font-black">{item.title}</h4>
                    <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80" 
                alt="Safety Concept" 
                className="rounded-[60px] shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute -bottom-10 -left-10 bg-blue-600 p-10 rounded-[40px] shadow-2xl hidden md:block">
                 <p className="text-4xl font-black text-white">99.9%</p>
                 <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">Incident-Free Trips</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
            <h2 className="text-blue-600 font-black tracking-widest uppercase text-xs mb-4">Step-by-Step</h2>
            <p className="text-3xl md:text-5xl font-black text-slate-900">How to SpeedRide</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Visual connector line */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 border-t-2 border-dashed border-slate-100 -z-10"></div>
            
            {[
              { step: '01', title: 'Request', desc: 'Enter your destination and choose the vehicle that fits your mood.' },
              { step: '02', title: 'Connect', desc: 'Our AI engine matches you with the nearest top-rated partner.' },
              { step: '03', title: 'Arrive', desc: 'Enjoy a premium journey and reach your destination safely.' }
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-blue-600 transition-colors duration-500 shadow-sm border border-slate-100">
                  <span className="text-2xl font-black text-slate-900 group-hover:text-white">{item.step}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed px-4">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Drive with us section */}
      <section id="opportunity" className="py-16 md:py-32 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-[60px] shadow-2xl p-8 md:p-20 overflow-hidden relative border border-slate-100">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Logo className="h-64 w-auto" />
            </div>
            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
              <div className="space-y-8">
                <h2 className="text-blue-600 font-black tracking-widest uppercase text-xs">Partner Opportunity</h2>
                <p className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">Make the city your office.</p>
                <p className="text-slate-500 text-lg leading-relaxed">
                  Join our fleet of professional partners. Benefit from the highest commissions in the industry, flexible scheduling, and 2026-era technology support.
                </p>
                <ul className="space-y-4">
                  {['Weekly instant payouts', 'AI-assisted demand routing', 'Comprehensive vehicle insurance', 'Performance-based bonuses'].map((text, i) => (
                    <li key={i} className="flex items-center space-x-3 text-slate-900 font-bold">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/auth" className="inline-flex items-center justify-center bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold hover:bg-blue-600 transition shadow-xl shadow-slate-200">
                  Join the Fleet <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <img src="https://images.unsplash.com/photo-1593950315186-76a92975b60c?auto=format&fit=crop&w=400&q=80" className="rounded-3xl h-64 w-full object-cover shadow-lg" alt="Driver Partner" />
                <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80" className="rounded-3xl h-64 w-full object-cover shadow-lg mt-8" alt="Happy Driver" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Promo Section */}
      <section className="py-24 px-4 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto bg-blue-600 rounded-[60px] p-12 md:p-24 text-white relative">
           <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-10">
                 <h2 className="text-4xl md:text-6xl font-black leading-tight">Your city, in the <br/> palm of your hand.</h2>
                 <p className="text-blue-100 text-lg opacity-80 max-w-md">Download the SpeedRide 2026 app for the fastest booking experience and exclusive app-only features.</p>
                 <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex items-center space-x-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-black hover:scale-105 transition active:scale-95 shadow-2xl shadow-blue-900/20">
                       <Apple className="w-6 h-6" />
                       <div className="text-left">
                          <p className="text-[10px] font-bold uppercase opacity-60 leading-none">Download on</p>
                          <p className="text-sm">App Store</p>
                       </div>
                    </button>
                    <button className="flex items-center space-x-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:scale-105 transition active:scale-95 shadow-2xl shadow-blue-900/20 border border-white/10">
                       <Play className="w-6 h-6" />
                       <div className="text-left">
                          <p className="text-[10px] font-bold uppercase opacity-60 leading-none">Get it on</p>
                          <p className="text-sm">Google Play</p>
                       </div>
                    </button>
                 </div>
              </div>
              <div className="relative hidden lg:block">
                 <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/20 rounded-full blur-[100px]"></div>
                 <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80" className="w-80 mx-auto rounded-[40px] shadow-2xl border-[12px] border-slate-900 transform rotate-12" alt="App Preview" />
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 pt-24 pb-12 px-4 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2 space-y-8">
              <Logo className="h-16 w-auto" />
              <p className="text-slate-500 font-medium max-w-sm">
                Leading the global transition to sustainable, intelligent urban mobility through advanced telemetry and premium service.
              </p>
              <div className="flex space-x-4">
                {/* Social placeholders */}
                {[Globe, Smartphone, MessageSquare].map((Icon, i) => (
                  <div key={i} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all cursor-pointer">
                    <Icon className="w-5 h-5" />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <h4 className="text-slate-900 font-black text-xs uppercase tracking-[0.2em]">Product</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-500">
                <li><Link to="/fleet" className="hover:text-blue-600 transition">Fleet Options</Link></li>
                <li><a href="#" className="hover:text-blue-600 transition">Price Estimates</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Business Travel</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Gift Cards</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-slate-900 font-black text-xs uppercase tracking-[0.2em]">Company</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-500">
                <li><a href="#" className="hover:text-blue-600 transition">About Us</a></li>
                <li><Link to="/drive" className="hover:text-blue-600 transition">Careers</Link></li>
                <li><a href="#" className="hover:text-blue-600 transition">Press Center</a></li>
                <li><Link to="/safety" className="hover:text-blue-600 transition">Safety Center</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-slate-900 font-black text-xs uppercase tracking-[0.2em]">Support</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-500">
                <li><Link to="/contact" className="hover:text-blue-600 transition">Contact Us</Link></li>
                <li><a href="#" className="hover:text-blue-600 transition">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Community</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Accessibility</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-400 text-xs font-bold">© 2026 SpeedRide Mobility Inc. Global Headquarters: SF-24-902.</p>
            <div className="flex items-center space-x-6 text-[10px] font-black uppercase tracking-widest text-slate-300">
              <a href="#" className="hover:text-blue-600">English (US)</a>
              <a href="#" className="hover:text-blue-600">Metric Units</a>
              <a href="https://www.premegagetech.com" target="_blank" className="text-blue-400 hover:text-blue-600 transition">Powered by Premegage Tech</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
