
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Globe, ShieldAlert, Lock, Eye, Heart, CheckCircle, ArrowRight } from 'lucide-react';
import Logo from '../components/Logo';

const SafetyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="fixed w-full z-50 glass border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center">
              <Logo className="h-12 w-auto" />
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/auth" className="text-slate-900 font-bold hover:text-blue-600 transition">Sign In</Link>
              <Link to="/auth" className="bg-slate-900 text-white font-bold py-2.5 px-6 rounded-full hover:bg-blue-600 transition shadow-xl">
                Book Safely
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              <span>Safety First, Always</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase">Your Security is <br/> Our Core Mission</h1>
            <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
              In 2026, safety isn't just a feature—it's the foundation of our entire network. We use cutting-edge AI and human expertise to protect every journey.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {[
              { 
                icon: ShieldCheck, 
                title: 'AI Monitoring', 
                desc: 'Our smart monitoring engine tracks every trip in real-time. If a vehicle deviates from its route or stops unexpectedly, our security team is alerted instantly.',
                color: 'bg-blue-600'
              },
              { 
                icon: Phone, 
                title: 'Emergency Response', 
                desc: 'One-tap access to local authorities and our specialized incident response team. We provide your exact GPS location and trip details automatically.',
                color: 'bg-red-600'
              },
              { 
                icon: Globe, 
                title: 'Trusted Contacts', 
                desc: 'Share your live trip progress with friends or family. They can follow your journey on a map and receive a notification when you arrive safely.',
                color: 'bg-emerald-600'
              }
            ].map((item, i) => (
              <div key={i} className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                <div className={`w-16 h-16 ${item.color} text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">{item.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 rounded-[60px] p-12 md:p-24 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
              <div className="space-y-8">
                <h2 className="text-4xl md:text-6xl font-black leading-tight">Vetted Partners. <br/> Verified Vehicles.</h2>
                <p className="text-slate-400 text-lg leading-relaxed font-medium">
                  Every driver undergoes a rigorous background check and identity verification using biometric scanning. Vehicles are inspected regularly to ensure they meet our 2026 safety standards.
                </p>
                <div className="space-y-4">
                  {[
                    'Biometric Identity Verification',
                    'Criminal Background Screening',
                    'Regular Vehicle Safety Audits',
                    'Driver Performance Monitoring'
                  ].map((text, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="font-bold text-slate-200">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80" 
                  className="rounded-[40px] shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000" 
                  alt="Safety Verification" 
                />
                <div className="absolute -bottom-10 -left-10 bg-blue-600 p-10 rounded-[40px] shadow-2xl hidden md:block">
                  <p className="text-4xl font-black">100%</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">Verified Fleet</p>
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
            Your safety is our priority. Travel with confidence on the SpeedRide network.
          </p>
          <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-400 text-xs font-bold">© 2026 SpeedRide Mobility Inc.</p>
            <div className="flex space-x-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Link to="/" className="hover:text-blue-600 transition">Home</Link>
              <Link to="/fleet" className="hover:text-blue-600 transition">Fleet</Link>
              <Link to="/drive" className="hover:text-blue-600 transition">Drive</Link>
              <Link to="/contact" className="hover:text-blue-600 transition">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SafetyPage;
