
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, Shield, Clock, CreditCard, ChevronRight, 
  MapPin, Star, Phone, CheckCircle, Zap,
  Smartphone, Award, Users, HelpCircle, ArrowRight,
  ShieldCheck, Map, Wallet, MessageSquare
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "How do I book a ride?",
      a: "Simply sign in to your SpeedRide account, enter your pickup and drop-off locations, choose your preferred vehicle type, and tap 'Book Now'. A driver will be matched with you instantly."
    },
    {
      q: "What safety measures are in place?",
      a: "Every SpeedRide driver undergoes a rigorous multi-step background check. We also offer real-time trip sharing, an emergency SOS button, and 24/7 support for every journey."
    },
    {
      q: "How is the fare calculated?",
      a: "Fares are calculated based on base rates, time, and distance. We use upfront pricing so you see exactly what you'll pay before you request a ride."
    },
    {
      q: "Can I schedule a ride in advance?",
      a: "Yes! Use our 'Schedule' feature to book your ride up to 30 days in advance, ensuring a driver is ready when you are."
    }
  ];

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
              <a href="#services" className="hover:text-blue-600 transition-colors">Services</a>
              <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it Works</a>
              <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#safety" className="hover:text-blue-600 transition-colors">Safety</a>
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
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -z-10 w-[60%] h-[100%] bg-gradient-to-l from-blue-50 to-transparent rounded-bl-[100px]"></div>
        <div className="absolute top-40 -left-20 -z-10 w-96 h-96 bg-blue-100 rounded-full blur-[120px] opacity-40"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 animate-fade-up">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-bold text-sm">
              <Award className="w-4 h-4" />
              <span>Rated #1 for Urban Mobility in 2026</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.95] tracking-tight">
              Arrive in <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Style & Speed.</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-lg leading-relaxed font-medium">
              Experience the next generation of ride-hailing. Upfront pricing, premium vehicles, and the world's most professional drivers at your fingertips.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/auth" className="group flex items-center justify-center bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-slate-300">
                Book My First Ride <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
              </Link>
              <Link to="/auth" className="flex items-center justify-center border-2 border-slate-200 text-slate-900 px-10 py-5 rounded-2xl font-bold hover:border-slate-900 hover:bg-slate-50 transition-all">
                Become a Driver
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-100">
              <div className="group cursor-default">
                <p className="text-3xl font-black text-slate-900 group-hover:text-blue-600 transition">4.9/5</p>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest text-[10px]">Average Rating</p>
              </div>
              <div className="group cursor-default">
                <p className="text-3xl font-black text-slate-900 group-hover:text-blue-600 transition">8M+</p>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest text-[10px]">Rides Monthly</p>
              </div>
              <div className="group cursor-default">
                <p className="text-3xl font-black text-slate-900 group-hover:text-blue-600 transition">25k+</p>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest text-[10px]">Partner Drivers</p>
              </div>
            </div>
          </div>

          <div className="relative lg:ml-auto animate-fade-up stagger-2">
             <div className="absolute -inset-10 bg-blue-500/10 rounded-full blur-[100px] -z-10"></div>
             <img 
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1000&q=80" 
              className="rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] object-cover h-[600px] w-full transform -rotate-2 hover:rotate-0 transition-all duration-1000 animate-float" 
              alt="Premium Ride" 
             />
             
             {/* Floating Info Cards */}
             <div className="absolute top-20 -left-12 bg-white p-6 rounded-3xl shadow-2xl flex items-center space-x-4 border border-slate-50 animate-float stagger-2">
                <div className="bg-green-100 p-3 rounded-2xl">
                  <ShieldCheck className="text-green-600 w-8 h-8" />
                </div>
                <div>
                  <p className="font-black text-slate-900">Certified Safe</p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Background verified</p>
                </div>
             </div>

             <div className="absolute bottom-20 -right-8 bg-slate-900 text-white p-6 rounded-3xl shadow-2xl flex items-center space-x-4 border border-white/10 animate-float">
                <div className="bg-blue-600 p-3 rounded-2xl">
                  <Car className="text-white w-8 h-8" />
                </div>
                <div>
                  <p className="font-black">Tesla Model S Plaid</p>
                  <p className="text-xs text-blue-300 font-bold tracking-widest uppercase">2026 Premium Class</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-32 px-4 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 space-y-4 animate-fade-up">
            <h2 className="text-blue-600 font-black tracking-widest uppercase text-xs">How it works</h2>
            <p className="text-4xl md:text-6xl font-black text-slate-900">Three steps to your destination</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: MapPin, step: '01', title: 'Set Destination', desc: 'Enter where you want to go and choose the service that fits your mood.' },
              { icon: Smartphone, step: '02', title: 'Find Driver', desc: 'Our smart algorithm matches you with the closest top-rated driver instantly.' },
              { icon: Award, step: '03', title: 'Enjoy the Ride', desc: 'Track your driver in real-time and pay seamlessly through the app.' }
            ].map((item, idx) => (
              <div key={idx} className={`relative group text-center space-y-8 animate-fade-up stagger-${idx+1}`}>
                <div className="mx-auto w-24 h-24 bg-white rounded-[32px] shadow-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition duration-500 border border-white">
                  <item.icon className="w-10 h-10 text-blue-600" />
                  <span className="absolute -top-4 -right-4 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-4 border-slate-50 shadow-lg">{item.step}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900">{item.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed px-4">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20">
            <div className="space-y-4">
              <h2 className="text-blue-600 font-black tracking-widest uppercase text-xs">Our 2026 Fleet</h2>
              <p className="text-4xl md:text-6xl font-black text-slate-900">Services for every occasion</p>
            </div>
            <p className="text-slate-500 font-semibold max-w-sm mt-6 md:mt-0 leading-relaxed italic border-l-4 border-blue-600 pl-6">"Redefining the standard of commute in the heart of the city."</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: 'Economy', icon: Car, desc: 'Quality rides, affordable prices.', tag: 'Popular', color: 'blue' },
              { title: 'Premium', icon: Shield, desc: 'Luxury cars and top drivers.', tag: 'Elite', color: 'indigo' },
              { title: 'XL', icon: Zap, desc: 'Spacious for groups of up to 6.', tag: 'Spacious', color: 'emerald' },
              { title: 'Bike', icon: Clock, desc: 'Skip the traffic, get there fast.', tag: 'Fast', color: 'rose' },
            ].map((service, idx) => (
              <div key={idx} className="p-10 rounded-[40px] border border-slate-100 bg-white hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 flex flex-col items-start h-full group">
                <div className={`bg-${service.color}-50 p-4 rounded-3xl mb-8 group-hover:scale-110 transition-transform`}>
                  <service.icon className={`w-10 h-10 text-${service.color}-600`} />
                </div>
                <div className="flex-1">
                  <span className={`text-[10px] font-black uppercase tracking-[0.3em] text-${service.color}-500 mb-2 block`}>{service.tag}</span>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">{service.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{service.desc}</p>
                </div>
                <button className="mt-10 flex items-center font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                  Book {service.title} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Transparency */}
      <section id="pricing" className="py-32 px-4 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[150px] -z-0"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8 animate-fade-up">
              <h2 className="text-blue-400 font-black tracking-widest uppercase text-xs">Transparent Pricing</h2>
              <p className="text-5xl md:text-7xl font-black leading-tight">No surprises. <br />Know the fare <br />before you ride.</p>
              <p className="text-slate-400 text-xl leading-relaxed font-medium">We believe in complete transparency. Our 2026 AI pricing model calculates your fare based on traffic, distance, and time instantly.</p>
              <div className="space-y-6 pt-6">
                {[
                  { icon: Wallet, title: 'No Hidden Fees', desc: 'Upfront pricing you can trust.' },
                  { icon: CheckCircle, title: 'Cashless Payments', desc: 'Secure blockchain-ready processing.' },
                  { icon: Award, title: 'SpeedPass Perks', desc: 'Exclusive rewards for frequent riders.' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-4 group">
                    <div className="bg-white/5 p-3 rounded-2xl group-hover:bg-blue-600/20 transition-colors"><item.icon className="w-6 h-6 text-blue-400" /></div>
                    <div>
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      <p className="text-slate-500 text-sm font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 backdrop-blur-xl animate-fade-up stagger-2">
              <div className="space-y-6">
                <div className="flex justify-between items-center p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black shadow-lg">SR</div>
                    <div>
                      <p className="font-bold">Base Fare</p>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Fixed rate</p>
                    </div>
                  </div>
                  <p className="text-xl font-black">₦500</p>
                </div>
                <div className="flex justify-between items-center p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black shadow-lg">KM</div>
                    <div>
                      <p className="font-bold">Distance Rate</p>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Per kilometer</p>
                    </div>
                  </div>
                  <p className="text-xl font-black">₦250</p>
                </div>
                <div className="flex justify-between items-center p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center font-black shadow-lg">MN</div>
                    <div>
                      <p className="font-bold">Time Rate</p>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Per minute</p>
                    </div>
                  </div>
                  <p className="text-xl font-black">₦50</p>
                </div>
                <div className="pt-10 border-t border-white/10">
                   <div className="flex justify-between items-center mb-8">
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Estimated Fare</p>
                      <p className="text-4xl font-black text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">₦2,500</p>
                   </div>
                   <Link to="/auth" className="block text-center bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-600/20">Calculate My Fare</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section id="safety" className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative order-2 lg:order-1 animate-fade-up">
              <img 
                src="https://images.unsplash.com/photo-1549194388-2469d59ec75c?auto=format&fit=crop&w=800&q=80" 
                className="rounded-[40px] shadow-2xl h-[550px] w-full object-cover animate-float" 
                alt="Safety Focus" 
              />
              <div className="absolute -bottom-10 -right-10 bg-white p-10 rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] border border-slate-50 max-w-xs animate-float stagger-1">
                <Star className="w-10 h-10 text-yellow-500 fill-current mb-4" />
                <p className="text-slate-600 font-bold italic text-lg leading-relaxed">"The real-time tracking gives me absolute peace of mind."</p>
                <p className="mt-6 font-black text-slate-900 tracking-tight">— Sarah J., 2026 Power Rider</p>
              </div>
            </div>
            <div className="space-y-10 order-1 lg:order-2 animate-fade-up stagger-2">
              <h2 className="text-blue-600 font-black tracking-widest uppercase text-xs">Unmatched Safety</h2>
              <p className="text-4xl md:text-6xl font-black leading-[1.1] text-slate-900">Your safety is our <br />priority #1.</p>
              <div className="space-y-12 mt-12">
                {[
                  { icon: Users, title: 'Vetted Partners', desc: 'Every driver must pass a multi-layer criminal and driving record history check before joining the fleet.' },
                  { icon: Map, title: 'SafeLink™ Tracking', desc: 'Share your trip details and live GPS coordinates with emergency contacts automatically.' },
                  { icon: MessageSquare, title: 'Elite Support', desc: 'Our safety squad is stationed 24/7 to resolve issues in seconds, not hours.' }
                ].map((item, i) => (
                  <div key={i} className="flex space-x-8 group">
                    <div className="bg-blue-600 text-white p-5 rounded-[24px] h-fit shrink-0 shadow-xl shadow-blue-100 group-hover:rotate-12 transition-transform duration-500">
                      <item.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-900 mb-3">{item.title}</h4>
                      <p className="text-slate-500 leading-relaxed font-semibold">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto bg-blue-600 rounded-[60px] p-12 md:p-28 relative overflow-hidden text-center text-white shadow-[0_50px_100px_-20px_rgba(59,130,246,0.5)]">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="relative z-10 space-y-12 max-w-4xl mx-auto animate-fade-up">
            <h2 className="text-6xl md:text-8xl font-black leading-tight tracking-tighter">Your 2026 ride <br />is ready now.</h2>
            <p className="text-xl md:text-2xl text-blue-100 font-semibold opacity-90 max-w-2xl mx-auto">Join over 8 million happy riders and experience the future of urban transport today.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 pt-6">
              <Link to="/auth" className="w-full sm:w-auto bg-white text-blue-600 px-14 py-6 rounded-3xl font-black hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all shadow-2xl text-xl">Get SpeedRide iOS</Link>
              <Link to="/auth" className="w-full sm:w-auto bg-slate-900 text-white px-14 py-6 rounded-3xl font-black hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all shadow-2xl text-xl">Get SpeedRide Android</Link>
            </div>
          </div>
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
              <div className="pt-4 group cursor-default">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 group-hover:text-blue-600 transition-colors">Powered by Premegage Tech</p>
              </div>
            </div>
            <div className="md:col-span-2 space-y-8">
              <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Platform</h4>
              <ul className="space-y-5 text-slate-500 font-bold">
                <li><a href="#" className="hover:text-blue-600 transition">About 2026</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Our Fleet</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Global News</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Join Team</a></li>
              </ul>
            </div>
            <div className="md:col-span-5 space-y-10">
              <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Get Updates</h4>
              <p className="text-slate-500 font-bold text-lg">Be the first to know about new cities and exclusive SpeedRide promos.</p>
              <form className="flex space-x-3" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Email address" className="bg-slate-50 border-2 border-slate-100 rounded-3xl px-8 py-5 flex-1 font-bold outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all" />
                <button className="bg-slate-900 text-white p-5 rounded-3xl hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200">
                  <ArrowRight className="w-6 h-6" />
                </button>
              </form>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-slate-400 font-black text-xs gap-8">
            <p className="uppercase tracking-widest">© 2026 SPEEDRIDE GLOBAL INC. BEYOND LIMITS.</p>
            <div className="flex space-x-12">
              <a href="#" className="hover:text-slate-900 transition tracking-widest">PRIVACY</a>
              <a href="#" className="hover:text-slate-900 transition tracking-widest">TERMS</a>
              <a href="#" className="hover:text-slate-900 transition tracking-widest">SECURITY</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
