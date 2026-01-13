
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
      <nav className="fixed w-full z-50 glass border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="bg-blue-600 p-1.5 rounded-lg mr-2">
                <Zap className="h-6 w-6 text-white fill-current" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900">SPEEDRIDE</span>
            </div>
            <div className="hidden lg:flex space-x-10 font-bold text-slate-600">
              <a href="#services" className="hover:text-blue-600 transition">Services</a>
              <a href="#how-it-works" className="hover:text-blue-600 transition">How it Works</a>
              <a href="#pricing" className="hover:text-blue-600 transition">Pricing</a>
              <a href="#safety" className="hover:text-blue-600 transition">Safety</a>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/auth" className="hidden sm:block text-slate-900 font-bold hover:text-blue-600 transition">Sign In</Link>
              <Link to="/auth" className="bg-slate-900 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95">
                Book a Ride
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-4 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -z-10 w-[60%] h-[100%] bg-gradient-to-l from-blue-50 to-transparent rounded-bl-[100px]"></div>
        <div className="absolute top-40 -left-20 -z-10 w-64 h-64 bg-blue-100 rounded-full blur-[120px] opacity-60"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-bold text-sm">
              <Award className="w-4 h-4" />
              <span>Rated #1 for Urban Mobility in 2024</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight">
              Arrive in <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Style & Speed.</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
              Experience the next generation of ride-hailing. Upfront pricing, premium vehicles, and the world's most professional drivers at your fingertips.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/auth" className="group flex items-center justify-center bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold hover:bg-blue-600 transition shadow-2xl shadow-slate-300">
                Book My First Ride <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
              </Link>
              <Link to="/auth" className="flex items-center justify-center border-2 border-slate-200 text-slate-900 px-10 py-5 rounded-2xl font-bold hover:border-slate-900 transition">
                Become a Driver
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-100">
              <div>
                <p className="text-3xl font-black text-slate-900">4.9/5</p>
                <p className="text-sm text-slate-500 font-medium">Average Rating</p>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900">5M+</p>
                <p className="text-sm text-slate-500 font-medium">Rides Monthly</p>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900">10k+</p>
                <p className="text-sm text-slate-500 font-medium">Partner Drivers</p>
              </div>
            </div>
          </div>

          <div className="relative lg:ml-auto">
             <div className="absolute -inset-10 bg-blue-500/5 rounded-full blur-[100px] -z-10"></div>
             <img 
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1000&q=80" 
              className="rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] object-cover h-[600px] w-full transform -rotate-2 hover:rotate-0 transition duration-700" 
              alt="Premium Ride" 
             />
             
             {/* Floating Info Cards */}
             <div className="absolute top-20 -left-12 bg-white p-6 rounded-3xl shadow-2xl flex items-center space-x-4 border border-slate-50 animate-bounce transition hover:animate-none">
                <div className="bg-green-100 p-3 rounded-2xl">
                  <ShieldCheck className="text-green-600 w-8 h-8" />
                </div>
                <div>
                  <p className="font-black text-slate-900">Certified Safe</p>
                  <p className="text-xs text-slate-500 font-bold">Background verified</p>
                </div>
             </div>

             <div className="absolute bottom-20 -right-8 bg-slate-900 text-white p-6 rounded-3xl shadow-2xl flex items-center space-x-4 border border-white/10">
                <div className="bg-blue-600 p-3 rounded-2xl">
                  <Car className="text-white w-8 h-8" />
                </div>
                <div>
                  <p className="font-black">Tesla Model S</p>
                  <p className="text-xs text-blue-300 font-bold tracking-widest uppercase">Premium Class</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-32 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-blue-600 font-black tracking-widest uppercase text-sm">How it works</h2>
            <p className="text-4xl md:text-5xl font-black text-slate-900">Three steps to your destination</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: MapPin, step: '01', title: 'Set Destination', desc: 'Enter where you want to go and choose the service that fits your mood.' },
              { icon: Smartphone, step: '02', title: 'Find Driver', desc: 'Our smart algorithm matches you with the closest top-rated driver instantly.' },
              { icon: Award, step: '03', title: 'Enjoy the Ride', desc: 'Track your driver in real-time and pay seamlessly through the app.' }
            ].map((item, idx) => (
              <div key={idx} className="relative group text-center space-y-6">
                <div className="mx-auto w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center group-hover:scale-110 transition duration-500">
                  <item.icon className="w-10 h-10 text-blue-600" />
                  <span className="absolute -top-4 -right-4 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-4 border-slate-50">{item.step}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900">{item.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
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
              <h2 className="text-blue-600 font-black tracking-widest uppercase text-sm">Our Fleet</h2>
              <p className="text-4xl md:text-5xl font-black text-slate-900">Services for every occasion</p>
            </div>
            <p className="text-slate-500 font-medium max-w-sm mt-6 md:mt-0">From budget commutes to executive travel, we've got you covered in every city.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: 'Economy', icon: Car, desc: 'Quality rides, affordable prices.', tag: 'Popular' },
              { title: 'Premium', icon: Shield, desc: 'Luxury cars and top drivers.', tag: 'Elite' },
              { title: 'XL', icon: Zap, desc: 'Spacious for groups of up to 6.', tag: 'Spacious' },
              { title: 'Bike', icon: Clock, desc: 'Skip the traffic, get there fast.', tag: 'Fast' },
            ].map((service, idx) => (
              <div key={idx} className="p-10 rounded-[40px] border border-slate-100 bg-white hover:shadow-2xl hover:-translate-y-2 transition duration-500 flex flex-col items-start h-full">
                <div className="bg-blue-50 p-4 rounded-2xl mb-8">
                  <service.icon className="w-10 h-10 text-blue-600" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-2 block">{service.tag}</span>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">{service.title}</h3>
                  <p className="text-slate-500 font-medium">{service.desc}</p>
                </div>
                <button className="mt-10 flex items-center font-black text-slate-900 group">
                  Book {service.title} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Transparency */}
      <section id="pricing" className="py-32 px-4 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 blur-[150px]"></div>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-blue-400 font-black tracking-widest uppercase text-sm">Transparent Pricing</h2>
              <p className="text-5xl font-black leading-tight">No surprises. <br />Know the fare before <br />you hit request.</p>
              <p className="text-slate-400 text-xl leading-relaxed">We believe in complete transparency. Our upfront pricing model calculates your fare based on traffic, distance, and time so you can plan your budget with confidence.</p>
              <div className="space-y-6 pt-6">
                {[
                  { icon: Wallet, title: 'No Hidden Fees', desc: 'The price you see is the price you pay.' },
                  { icon: CheckCircle, title: 'Cashless Payments', desc: 'Secure in-app credit/debit card processing.' },
                  { icon: Award, title: 'Surge Alerts', desc: 'Real-time notifications if pricing changes due to demand.' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="bg-white/5 p-2 rounded-lg"><item.icon className="w-6 h-6 text-blue-400" /></div>
                    <div>
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      <p className="text-slate-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 backdrop-blur-sm">
              <div className="space-y-6">
                <div className="flex justify-between items-center p-6 bg-white/5 rounded-3xl border border-white/5">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-black">SR</div>
                    <div>
                      <p className="font-bold">Base Fare</p>
                      <p className="text-xs text-slate-400">Fixed rate per city</p>
                    </div>
                  </div>
                  <p className="text-xl font-black">₦500</p>
                </div>
                <div className="flex justify-between items-center p-6 bg-white/5 rounded-3xl border border-white/5">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center font-black">KM</div>
                    <div>
                      <p className="font-bold">Distance Rate</p>
                      <p className="text-xs text-slate-400">Per kilometer</p>
                    </div>
                  </div>
                  <p className="text-xl font-black">₦250</p>
                </div>
                <div className="flex justify-between items-center p-6 bg-white/5 rounded-3xl border border-white/5">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center font-black">MN</div>
                    <div>
                      <p className="font-bold">Time Rate</p>
                      <p className="text-xs text-slate-400">Per minute in ride</p>
                    </div>
                  </div>
                  <p className="text-xl font-black">₦50</p>
                </div>
                <div className="pt-10 border-t border-white/10">
                   <div className="flex justify-between items-center mb-6">
                      <p className="text-slate-400 font-bold">Estimated Economy Fare</p>
                      <p className="text-3xl font-black text-blue-400">₦2,500</p>
                   </div>
                   <Link to="/auth" className="block text-center bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition shadow-xl shadow-blue-600/20">Calculate My Fare</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section id="safety" className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative order-2 lg:order-1">
              <img 
                src="https://images.unsplash.com/photo-1549194388-2469d59ec75c?auto=format&fit=crop&w=800&q=80" 
                className="rounded-[40px] shadow-2xl h-[500px] w-full object-cover" 
                alt="Safety Focus" 
              />
              <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[40px] shadow-2xl border border-slate-50 max-w-xs">
                <Star className="w-10 h-10 text-yellow-500 fill-current mb-4" />
                <p className="text-slate-600 font-medium italic">"The real-time tracking gives me such peace of mind when traveling late at night."</p>
                <p className="mt-4 font-black text-slate-900">— Sarah J.</p>
              </div>
            </div>
            <div className="space-y-8 order-1 lg:order-2">
              <h2 className="text-blue-600 font-black tracking-widest uppercase text-sm">Unmatched Safety</h2>
              <p className="text-4xl font-black leading-tight text-slate-900">Your safety is <br />our priority #1.</p>
              <div className="space-y-10 mt-10">
                {[
                  { icon: Users, title: 'Background Checks', desc: 'Every driver must pass a thorough criminal and driving record history check before they can drive.' },
                  { icon: Map, title: 'Real-time Tracking', desc: 'Share your trip details and live location with friends or family so they know you arrived safely.' },
                  { icon: MessageSquare, title: '24/7 Support', desc: 'Our dedicated safety team is available around the clock to help with any concerns during your ride.' }
                ].map((item, i) => (
                  <div key={i} className="flex space-x-6">
                    <div className="bg-blue-600 text-white p-4 rounded-2xl h-fit shrink-0 shadow-lg shadow-blue-200">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-900 mb-2">{item.title}</h4>
                      <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-blue-600 font-black tracking-widest uppercase text-sm">Testimonials</h2>
            <p className="text-4xl md:text-5xl font-black text-slate-900">What our riders say</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Michael Chen', role: 'Business Traveler', text: 'SpeedRide is my go-to for airport transfers. Always on time, spotless cars, and very professional drivers.', img: 'https://picsum.photos/seed/mike/100' },
              { name: 'Jessica Smith', role: 'Nightly Commuter', text: 'As a woman traveling alone at night, I feel completely safe with their tracking features. Best app in the city!', img: 'https://picsum.photos/seed/jess/100' },
              { name: 'David Wilson', role: 'Premium User', text: 'The Premium service is worth every penny. Teslas, polite drivers, and quiet rides. Absolutely fantastic experience.', img: 'https://picsum.photos/seed/dave/100' }
            ].map((t, i) => (
              <div key={i} className="bg-white p-10 rounded-[40px] shadow-sm hover:shadow-xl transition duration-500 border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="flex text-yellow-500 mb-6">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-5 h-5 fill-current" />)}
                  </div>
                  <p className="text-slate-600 font-medium italic mb-8 leading-relaxed text-lg">"{t.text}"</p>
                </div>
                <div className="flex items-center space-x-4">
                  <img src={t.img} className="w-14 h-14 rounded-full border-2 border-blue-100" alt={t.name} />
                  <div>
                    <p className="font-black text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-400 font-black uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 space-y-4">
             <h2 className="text-blue-600 font-black tracking-widest uppercase text-sm font-black">Help Center</h2>
             <p className="text-4xl font-black text-slate-900">Common Questions</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className={`rounded-3xl border transition-all duration-300 ${activeFaq === i ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full text-left p-8 flex justify-between items-center group"
                >
                  <span className={`text-xl font-black transition ${activeFaq === i ? 'text-blue-700' : 'text-slate-900'}`}>{faq.q}</span>
                  <HelpCircle className={`w-6 h-6 transition-all duration-300 ${activeFaq === i ? 'text-blue-600 rotate-180' : 'text-slate-300'}`} />
                </button>
                {activeFaq === i && (
                  <div className="px-8 pb-8 animate-in slide-in-from-top-2 duration-300">
                    <p className="text-slate-600 font-medium leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto bg-blue-600 rounded-[60px] p-12 md:p-24 relative overflow-hidden text-center text-white shadow-2xl shadow-blue-200">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 space-y-10 max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter">Ready to go? <br />Your ride awaits.</h2>
            <p className="text-xl text-blue-100 font-medium">Join over 5 million happy riders and experience the future of urban transport today.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/auth" className="w-full sm:w-auto bg-white text-blue-600 px-12 py-5 rounded-2xl font-black hover:bg-blue-50 transition shadow-xl text-lg">Download for iOS</Link>
              <Link to="/auth" className="w-full sm:w-auto bg-slate-900 text-white px-12 py-5 rounded-2xl font-black hover:bg-slate-800 transition shadow-xl text-lg">Download for Android</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-32 pb-12 px-4 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-16 mb-20">
            <div className="md:col-span-4 space-y-8">
              <div className="flex items-center">
                <div className="bg-blue-600 p-1.5 rounded-lg mr-2">
                  <Zap className="h-6 w-6 text-white fill-current" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-slate-900">SPEEDRIDE</span>
              </div>
              <p className="text-slate-500 font-medium max-w-sm leading-relaxed">Redefining mobility with technology and premium service. Experience the city like never before.</p>
              <div className="mt-4">
                <p className="text-xs font-black uppercase tracking-widest text-slate-300">Powered by Premegage Tech</p>
              </div>
              <div className="flex space-x-4 pt-4">
                 {['Twitter', 'Instagram', 'LinkedIn', 'Facebook'].map(s => (
                   <a key={s} href="#" className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition group">
                     <span className="sr-only">{s}</span>
                     <div className="w-5 h-5 bg-current rounded-full opacity-20 group-hover:opacity-100 transition"></div>
                   </a>
                 ))}
              </div>
            </div>
            <div className="md:col-span-2 space-y-6">
              <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Company</h4>
              <ul className="space-y-4 text-slate-500 font-medium">
                <li><a href="#" className="hover:text-blue-600 transition">About Us</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Our Fleet</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Newsroom</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Careers</a></li>
              </ul>
            </div>
            <div className="md:col-span-2 space-y-6">
              <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Services</h4>
              <ul className="space-y-4 text-slate-500 font-medium">
                <li><a href="#" className="hover:text-blue-600 transition">Economy</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Premium</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Business</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Logistics</a></li>
              </ul>
            </div>
            <div className="md:col-span-4 space-y-6">
              <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Newsletter</h4>
              <p className="text-slate-500 font-medium">Get the latest updates and exclusive promos directly to your inbox.</p>
              <form className="flex space-x-2" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Email address" className="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 flex-1 font-medium outline-none focus:ring-2 focus:ring-blue-500 transition" />
                <button className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-blue-600 transition shadow-lg shadow-slate-200">
                  <ArrowRight />
                </button>
              </form>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-slate-400 font-medium text-sm gap-6">
            <p>© 2024 SpeedRide Inc. Built with passion for mobility.</p>
            <div className="flex space-x-10">
              <a href="#" className="hover:text-slate-900 transition">Privacy Policy</a>
              <a href="#" className="hover:text-slate-900 transition">Terms of Service</a>
              <a href="#" className="hover:text-slate-900 transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
