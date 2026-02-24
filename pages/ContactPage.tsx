
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ArrowRight, MessageSquare, Globe, Clock } from 'lucide-react';
import Logo from '../components/Logo';

const ContactPage: React.FC = () => {
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
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div className="space-y-12">
              <div className="space-y-6">
                <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">
                  Get in <br/> Touch.
                </h1>
                <p className="text-xl text-slate-500 max-w-md font-medium leading-relaxed">
                  Have questions about our service or want to partner with us? Our team is here to help you move better.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start space-x-6 group">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Call Us</p>
                    <a href="tel:+2348085410884" className="text-2xl font-black text-slate-900 hover:text-blue-600 transition tracking-tight">+234 808 541 0884</a>
                  </div>
                </div>

                <div className="flex items-start space-x-6 group">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Us</p>
                    <a href="mailto:info@speedride.com" className="text-2xl font-black text-slate-900 hover:text-blue-600 transition tracking-tight">info@speedride.com</a>
                  </div>
                </div>

                <div className="flex items-start space-x-6 group">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Visit Us</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                      Minna, Niger State, <br/> Nigeria
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-12 border-t border-slate-100 grid grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center space-x-2 text-blue-600 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Support Hours</span>
                  </div>
                  <p className="text-sm font-bold text-slate-600">24/7 Real-time Support</p>
                </div>
                <div>
                  <div className="flex items-center space-x-2 text-emerald-600 mb-2">
                    <Globe className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Coverage</span>
                  </div>
                  <p className="text-sm font-bold text-slate-600">Nationwide Operations</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-[60px] p-8 md:p-12 border border-slate-100 shadow-sm">
              <div className="space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Send a Message</h2>
                </div>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input 
                        type="text" 
                        className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition shadow-sm"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                      <input 
                        type="email" 
                        className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition shadow-sm"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                    <select className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition shadow-sm appearance-none">
                      <option>General Inquiry</option>
                      <option>Support Issue</option>
                      <option>Driver Partnership</option>
                      <option>Fleet Management</option>
                      <option>Corporate Solutions</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
                    <textarea 
                      rows={4}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition shadow-sm resize-none"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-900 transition shadow-xl flex items-center justify-center group">
                    Send Message <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
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
              <Link to="/how-it-works" className="hover:text-blue-600 transition">How it Works</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;
