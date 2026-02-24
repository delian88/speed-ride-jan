
import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, TrendingUp, Calendar, Shield, Award, Zap, CheckCircle, ArrowRight, Smartphone, Clock } from 'lucide-react';
import Logo from '../components/Logo';

const DrivePage: React.FC = () => {
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
              <Link to="/auth" className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded-full hover:bg-slate-900 transition shadow-xl">
                Start Driving
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest">
                <TrendingUp className="w-4 h-4" />
                <span>Highest Commissions in the Industry</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none">Drive Your <br/> Own Future</h1>
              <p className="text-xl text-slate-500 font-medium leading-relaxed">
                Join the most advanced mobility network in the world. As a SpeedRide partner, you get the tools, the support, and the freedom to earn on your own terms.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth" className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition shadow-2xl flex items-center justify-center">
                  Apply to Drive <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <a href="#benefits" className="border-2 border-slate-200 text-slate-900 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-slate-900 transition flex items-center justify-center">
                  Learn Benefits
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-10 bg-blue-500/10 rounded-full blur-[100px] -z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1593950315186-76a92975b60c?auto=format&fit=crop&w=1000&q=80" 
                className="rounded-[60px] shadow-2xl object-cover h-[500px] w-full" 
                alt="Driver Partner" 
              />
              <div className="absolute top-10 -right-10 bg-white p-8 rounded-[32px] shadow-2xl border border-slate-50 hidden md:block">
                <p className="text-3xl font-black text-slate-900">₦250k+</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Avg. Weekly Earnings</p>
              </div>
            </div>
          </div>

          <div id="benefits" className="grid md:grid-cols-3 gap-8 mb-32">
            {[
              { 
                icon: DollarSign, 
                title: 'Instant Payouts', 
                desc: 'No more waiting for weeks. Withdraw your earnings to your bank account instantly after every trip completion.',
                color: 'bg-emerald-600'
              },
              { 
                icon: Calendar, 
                title: 'Total Flexibility', 
                desc: 'Drive when you want, where you want. You are the boss of your schedule. No minimum hours, no pressure.',
                color: 'bg-blue-600'
              },
              { 
                icon: Shield, 
                title: 'Full Insurance', 
                desc: 'Every trip is fully insured by our premium partners. We protect you and your passengers on every kilometer.',
                color: 'bg-slate-900'
              }
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 p-10 rounded-[48px] border border-slate-100 hover:bg-white hover:shadow-2xl transition-all group">
                <div className={`w-16 h-16 ${item.color} text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:rotate-12 transition-all`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">{item.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-600 rounded-[60px] p-12 md:p-24 text-white">
            <div className="max-w-3xl mx-auto text-center space-y-10">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">Ready to Start?</h2>
              <p className="text-blue-100 text-xl font-medium leading-relaxed">
                The application process takes less than 10 minutes. Once verified, you can start accepting rides and earning immediately.
              </p>
              <div className="grid sm:grid-cols-3 gap-8">
                {[
                  { icon: Smartphone, title: '1. Sign Up', desc: 'Create your account' },
                  { icon: Award, title: '2. Verify', desc: 'Upload documents' },
                  { icon: Zap, title: '3. Drive', desc: 'Start earning' }
                ].map((step, i) => (
                  <div key={i} className="space-y-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto">
                      <step.icon className="w-6 h-6" />
                    </div>
                    <h4 className="font-black uppercase tracking-widest text-sm">{step.title}</h4>
                    <p className="text-xs text-blue-200 font-bold">{step.desc}</p>
                  </div>
                ))}
              </div>
              <div className="pt-10">
                <Link to="/auth" className="inline-flex bg-white text-blue-600 px-12 py-6 rounded-[28px] font-black text-sm uppercase tracking-widest hover:scale-105 transition shadow-2xl">
                  Create Driver Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-50 py-20 px-4 border-t border-slate-100">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <Logo className="h-16 w-auto mx-auto" />
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            SpeedRide Partner Network. Empowering mobility professionals worldwide.
          </p>
          <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-400 text-xs font-bold">© 2026 SpeedRide Mobility Inc.</p>
            <div className="flex space-x-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Link to="/" className="hover:text-blue-600 transition">Home</Link>
              <Link to="/fleet" className="hover:text-blue-600 transition">Fleet</Link>
              <Link to="/safety" className="hover:text-blue-600 transition">Safety</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DrivePage;
