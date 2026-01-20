
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { db } from '../database';
import { sendWelcomeEmail, sendOtpEmail } from '../services/mail';
import { 
  Mail, Lock, Phone, User as UserIcon, Shield, 
  ChevronRight, Zap, ChevronLeft,
  FileText, Car, Smartphone, AlertCircle, Upload, CheckCircle as CheckCircleIcon, Image as ImageIcon,
  Wifi, Info
} from 'lucide-react';
import Logo from '../components/Logo';

type AuthView = 'LOGIN' | 'SIGNUP' | 'OTP' | 'FORGOT' | 'RESET' | 'SUCCESS';

interface InterceptedMail {
  subject: string;
  body: string;
  otp?: string;
  timestamp: string;
}

const AuthPage: React.FC = () => {
  const [view, setView] = useState<AuthView>('LOGIN');
  const [role, setRole] = useState<'RIDER' | 'DRIVER' | 'ADMIN'>('RIDER');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    name: '',
    vehicleModel: '',
    plateNumber: '',
    vehicleType: 'ECONOMY',
    licenseDoc: '',
    ninDoc: ''
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [correctOtp, setCorrectOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Virtual Mail Interceptor State
  const [interceptedMail, setInterceptedMail] = useState<InterceptedMail | null>(null);

  const { login } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const handleMailIntercept = (e: any) => {
      setInterceptedMail(e.detail);
      // Auto-dismiss after 8 seconds
      setTimeout(() => setInterceptedMail(null), 8000);
    };
    window.addEventListener('speedride_mail_intercept', handleMailIntercept);
    return () => window.removeEventListener('speedride_mail_intercept', handleMailIntercept);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'licenseDoc' | 'ninDoc') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large. Maximum size is 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, [field]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const users = await db.users.getAll();
      const user = users.find(u => u.email === formData.email && u.role === role);
      if (user) {
        login(user);
        navigate(`/${role.toLowerCase()}`);
      } else {
        setError("Invalid credentials or role mismatch.");
      }
    } catch (err) {
      setError("An error occurred during authentication.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'DRIVER' && (!formData.licenseDoc || !formData.ninDoc)) {
      setError("Please upload both Driver's License and NIN for verification.");
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const users = await db.users.getAll();
      if (users.find(u => u.email === formData.email)) {
        setError("User already exists with this email.");
        setIsLoading(false);
        return;
      }
      
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setCorrectOtp(newOtp);
      await sendOtpEmail(formData.email, newOtp);
      setView('OTP');
    } catch (err) {
      setError("Registration flow failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp !== correctOtp) {
      setError("Invalid verification code. Please check the interceptor at the top.");
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const newUser = await db.users.create({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: role,
        avatar: `https://i.pravatar.cc/150?u=${formData.email}`,
        ...(role === 'DRIVER' ? {
          vehicleModel: formData.vehicleModel,
          plateNumber: formData.plateNumber,
          vehicleType: formData.vehicleType as any,
          isOnline: false,
          isVerified: false,
          licenseDoc: formData.licenseDoc,
          ninDoc: formData.ninDoc
        } : {})
      });

      if (role !== 'ADMIN') {
        await sendWelcomeEmail({
          email: formData.email,
          name: formData.name,
          role: role as 'RIDER' | 'DRIVER'
        });
      }

      setView('SUCCESS');
      setTimeout(() => {
        login(newUser as any);
        navigate(`/${role.toLowerCase()}`);
      }, 2000);
    } catch (err) {
      setError("OTP Verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError('');
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const renderView = () => {
    switch (view) {
      case 'SUCCESS':
        return (
          <div className="text-center py-10 space-y-6 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Logo className="h-12 w-auto" />
            </div>
            <h2 className="text-3xl font-black text-slate-900">Verified!</h2>
            <p className="text-slate-500 font-bold">Account created successfully. A welcome transmission has been intercepted.</p>
          </div>
        );

      case 'OTP':
        return (
          <div className="space-y-8 text-center animate-in fade-in duration-500">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Wifi className="text-blue-600 w-8 h-8 animate-pulse" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Verify Transmission</h2>
            <div className="text-slate-500 font-medium leading-relaxed px-4 space-y-2">
              <p>Intercepting secure code for:</p>
              <p className="text-slate-900 font-black py-1 px-3 bg-blue-50 rounded-lg inline-block">{formData.email}</p>
              <p className="text-xs text-blue-600 font-bold uppercase tracking-widest animate-pulse">Check the mail interceptor above</p>
            </div>
            <div className="flex justify-center space-x-2">
              {otp.map((digit, i) => (
                <input
                  key={i} id={`otp-${i}`} type="text" maxLength={1} value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className={`w-10 h-14 md:w-12 md:h-16 text-center text-xl font-black bg-slate-50 border-2 rounded-xl focus:border-blue-600 outline-none transition ${error ? 'border-red-200' : 'border-slate-100'}`}
                />
              ))}
            </div>
            {error && <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl">{error}</p>}
            <button 
              onClick={handleVerifyOtp} disabled={isLoading}
              className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition shadow-xl disabled:opacity-50"
            >
              {isLoading ? "Validating Code..." : "Verify & Sign In"}
            </button>
          </div>
        );

      case 'SIGNUP':
        return (
          <form onSubmit={handleSignup} className="space-y-4 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-slate-900 text-center mb-6">Create Account</h2>
            <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
              {['RIDER', 'DRIVER'].map(r => (
                <button key={r} type="button" onClick={() => setRole(r as any)} className={`flex-1 py-2 text-xs font-black rounded-lg transition ${role === r ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>{r}</button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative col-span-2 md:col-span-1">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input name="name" placeholder="Full Name" required onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <div className="relative col-span-2 md:col-span-1">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input name="phone" placeholder="Phone Number" required onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input name="email" type="email" placeholder="Email Address" required onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-600" />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input name="password" type="password" placeholder="Secure Password" required onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-600" />
            </div>
            {role === 'DRIVER' && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input name="vehicleModel" placeholder="Vehicle Model" required onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl outline-none" />
                  </div>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input name="plateNumber" placeholder="Plate Number" required onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl outline-none" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <input type="file" accept="image/*" id="license-upload" className="hidden" onChange={(e) => handleFileUpload(e, 'licenseDoc')} />
                    <label htmlFor="license-upload" className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${formData.licenseDoc ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-blue-50'}`}>
                      {formData.licenseDoc ? <CheckCircleIcon className="w-6 h-6 text-emerald-500 mb-1" /> : <Upload className="w-6 h-6 text-slate-400 mb-1" />}
                      <span className="text-[10px] font-black text-slate-400 uppercase">{formData.licenseDoc ? 'License OK' : 'License'}</span>
                    </label>
                  </div>
                  <div className="relative group">
                    <input type="file" accept="image/*" id="nin-upload" className="hidden" onChange={(e) => handleFileUpload(e, 'ninDoc')} />
                    <label htmlFor="nin-upload" className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${formData.ninDoc ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-blue-50'}`}>
                      {formData.ninDoc ? <CheckCircleIcon className="w-6 h-6 text-emerald-500 mb-1" /> : <Smartphone className="w-6 h-6 text-slate-400 mb-1" />}
                      <span className="text-[10px] font-black text-slate-400 uppercase">{formData.ninDoc ? 'NIN OK' : 'NIN ID'}</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
            {error && <div className="flex items-center space-x-2 text-red-600 text-sm font-bold bg-red-50 p-4 rounded-xl"><AlertCircle className="w-4 h-4" /> <span>{error}</span></div>}
            <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition shadow-xl" disabled={isLoading}>{isLoading ? "Connecting to Mail Node..." : "Connect & Verify"}</button>
            <p className="text-center font-bold text-slate-400">Already a member? <button type="button" onClick={() => setView('LOGIN')} className="text-blue-600">Sign In</button></p>
          </form>
        );

      case 'LOGIN':
      default:
        return (
          <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-slate-900 text-center mb-6">Sign In</h2>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {['RIDER', 'DRIVER', 'ADMIN'].map(r => (
                <button key={r} type="button" onClick={() => setRole(r as any)} className={`flex-1 py-2 text-xs font-black rounded-lg transition ${role === r ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>{r}</button>
              ))}
            </div>
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input name="email" type="email" placeholder="Email Address" required onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input name="password" type="password" placeholder="Password" required onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
            </div>
            {error && <div className="text-red-600 text-xs font-bold bg-red-50 p-3 rounded-lg text-center">{error}</div>}
            <div className="flex justify-between text-sm font-bold">
               <label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" className="rounded" /> <span className="text-slate-500">Remember me</span></label>
               <button type="button" className="text-blue-600">Forgot Password?</button>
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-blue-600 transition shadow-xl" disabled={isLoading}>{isLoading ? "Authenticating..." : "Sign In"}</button>
            <p className="text-center font-bold text-slate-400">New around here? <button type="button" onClick={() => setView('SIGNUP')} className="text-blue-600">Create Account</button></p>
          </form>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden">
      {/* VIRTUAL MAIL INTERCEPTOR UI */}
      {interceptedMail && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 w-full max-w-lg z-[200] animate-slide-top px-4">
           <div className="bg-slate-900 text-white p-6 rounded-[32px] shadow-2xl border-2 border-blue-500/50 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4"><div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div></div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-blue-600 rounded-2xl"><Mail className="w-6 h-6" /></div>
                <div>
                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Neural Transmission Intercepted</p>
                   <p className="text-sm font-black">{interceptedMail.subject}</p>
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 mb-4">
                 <p className="text-xs text-slate-300 font-medium leading-relaxed">{interceptedMail.body}</p>
              </div>
              {interceptedMail.otp && (
                <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-2"><Zap className="w-4 h-4 text-yellow-400" /><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure Access Code</span></div>
                   <span className="text-2xl font-black text-blue-400 tracking-[0.2em]">{interceptedMail.otp}</span>
                </div>
              )}
           </div>
        </div>
      )}

      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[120px] -z-10"></div>
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl border border-white p-10">
        <div className="flex flex-col items-center justify-center mb-10">
          <Logo className="h-24 w-auto mb-2" />
        </div>
        {renderView()}
        <div className="mt-10 pt-6 border-t border-slate-50 text-center">
           <a href="https://www.premegagetech.com" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-blue-600 transition">
            Powered by Premegage Tech
           </a>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
