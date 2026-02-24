
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, Car, Zap, CheckCircle, Smartphone, Award, Users, ArrowRight, MousePointer2, ShieldCheck } from 'lucide-react';
import Logo from '../components/Logo';

const HowItWorksPage: React.FC = () => {
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
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase">Simple. Fast. <br/> Seamless.</h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
              Moving through the city should be the easiest part of your day. Here is how SpeedRide makes it happen.
            </p>
          </div>

          <div className="space-y-32">
            {/* Rider Section */}
            <section>
              <div className="flex items-center space-x-4 mb-12">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">For Riders</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-12">
                {[
                  { 
                    step: '01', 
                    icon: MapPin, 
                    title: 'Set Destination', 
                    desc: 'Open the app and enter where you want to go. Our AI instantly calculates the best route and provides multiple vehicle options with upfront pricing.' 
                  },
                  { 
                    step: '02', 
                    icon: Zap, 
                    title: 'Match & Connect', 
                    desc: 'Our smart engine matches you with the nearest top-rated driver. You can see their real-time location, vehicle details, and estimated arrival time.' 
                  },
                  { 
                    step: '03', 
                    icon: Navigation, 
                    title: 'Enjoy the Ride', 
                    desc: 'Hop in and relax. Your driver follows the AI-optimized route. Payment is handled automatically from your digital wallet upon arrival.' 
                  }
                ].map((item, i) => (
                  <div key={i} className="relative group">
                    <div className="text-8xl font-black text-slate-100 absolute -top-10 -left-6 -z-10 group-hover:text-blue-50 transition-colors">{item.step}</div>
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all h-full">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">{item.title}</h3>
                      <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Driver Section */}
            <section>
              <div className="flex items-center space-x-4 mb-12">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg">
                  <Car className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">For Drivers</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-12">
                {[
                  { 
                    step: '01', 
                    icon: Award, 
                    title: 'Go Online', 
                    desc: 'Connect your node to the SpeedRide grid whenever you want to work. Our system starts scanning for nearby rider signals immediately.' 
                  },
                  { 
                    step: '02', 
                    icon: MousePointer2, 
                    title: 'Accept Requests', 
                    desc: 'Receive ride requests with clear pickup and dropoff locations. You have total freedom to accept the trips that fit your current route.' 
                  },
                  { 
                    step: '03', 
                    icon: CheckCircle, 
                    title: 'Earn & Withdraw', 
                    desc: 'Complete the journey and see your earnings instantly. Withdraw your funds to your bank account at any time with zero delay.' 
                  }
                ].map((item, i) => (
                  <div key={i} className="relative group">
                    <div className="text-8xl font-black text-slate-100 absolute -top-10 -left-6 -z-10 group-hover:text-slate-200 transition-colors">{item.step}</div>
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all h-full">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-slate-900 group-hover:text-white transition-all">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">{item.title}</h3>
                      <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-32 bg-slate-50 rounded-[60px] p-12 md:p-24 border border-slate-100">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Ready to Move?</h2>
                <p className="text-slate-500 text-lg font-medium leading-relaxed">
                  Join thousands of users who have already switched to the most intelligent mobility platform in the city.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/auth" className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition shadow-2xl flex items-center justify-center">
                    Sign Up Now <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-4">
                  <ShieldCheck className="w-8 h-8 text-blue-600" />
                  <h4 className="font-black uppercase tracking-widest text-xs">Secure Payments</h4>
                  <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase">Digital wallet integration for seamless transactions.</p>
                </div>
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-4 mt-8">
                  <Users className="w-8 h-8 text-emerald-600" />
                  <h4 className="font-black uppercase tracking-widest text-xs">Community Driven</h4>
                  <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase">Rated and reviewed by users like you.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white py-20 px-4 border-t border-slate-100">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <Logo className="h-16 w-auto mx-auto" />
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            SpeedRide 2026. The smartest way to move.
          </p>
          <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-400 text-xs font-bold">© 2026 SpeedRide Mobility Inc.</p>
            <div className="flex space-x-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Link to="/fleet" className="hover:text-blue-600 transition">Fleet</Link>
              <Link to="/safety" className="hover:text-blue-600 transition">Safety</Link>
              <Link to="/drive" className="hover:text-blue-600 transition">Drive</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HowItWorksPage;
