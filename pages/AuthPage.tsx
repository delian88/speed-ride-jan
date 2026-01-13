
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { db } from '../database';
import { 
  Mail, Lock, Phone, User as UserIcon, Shield, 
  ChevronRight, Zap, ChevronLeft,
  FileText, Car, Smartphone, AlertCircle
} from 'lucide-react';

type AuthView = 'LOGIN' | 'SIGNUP' | 'OTP' | 'FORGOT' | 'RESET' | 'SUCCESS';

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
    vehicleType: 'ECONOMY'
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useApp();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
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
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const users = await db.users.getAll();
      if (users.find(u => u.email === formData.email)) {
        setError("User already exists with this email.");
        return;
      }
      setView('OTP');
    } catch (err) {
      setError("Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
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
          isVerified: false
        } : {})
      });
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
              <Zap className="w-10 h-10 fill-current" />
            </div>
            <h2 className="text-3xl font-black text-slate-900">Verified!</h2>
            <p className="text-slate-500 font-bold">Account created successfully. Redirecting you to your dashboard...</p>
          </div>
        );

      case 'OTP':
        return (
          <div className="space-y-8 text-center animate-in fade-in duration-500">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Smartphone className="text-blue-600 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Verify Identity</h2>
            <p className="text-slate-500 font-medium leading-relaxed">We've sent a code to <span className="text-slate-900 font-bold">{formData.phone || formData.email}</span>. Please enter it below.</p>
            <div className="flex justify-center space-x-2">
              {otp.map((digit, i) => (
                <input
                  key={i} id={`otp-${i}`} type="text" maxLength={1} value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="w-10 h-14 md:w-12 md:h-16 text-center text-xl font-black bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-600 outline-none transition"
                />
              ))}
            </div>
            <button 
              onClick={handleVerifyOtp} disabled={isLoading}
              className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition shadow-xl disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify & Sign In"}
            </button>
            <p className="text-sm font-bold text-slate-400">Didn't get it? <button className="text-blue-600 hover:underline">Resend Code</button></p>
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
                <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-center">
                   <p className="text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Driver's License & NIN</p>
                   <label className="bg-slate-900 text-white px-4 py-2 rounded-lg text-[10px] font-black cursor-pointer hover:bg-blue-600 transition">Upload Verification Docs</label>
                </div>
              </div>
            )}
            {error && <div className="flex items-center space-x-2 text-red-600 text-sm font-bold bg-red-50 p-4 rounded-xl"><AlertCircle className="w-4 h-4" /> <span>{error}</span></div>}
            <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition shadow-xl" disabled={isLoading}>{isLoading ? "Processing..." : "Continue to Verify"}</button>
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
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[120px] -z-10"></div>
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl border border-white p-10">
        <div className="flex justify-center items-center mb-10">
          <div className="bg-blue-600 p-2 rounded-xl mr-2"><Zap className="h-6 w-6 text-white fill-current" /></div>
          <span className="text-2xl font-black tracking-tighter">SPEEDRIDE</span>
        </div>
        {renderView()}
        <div className="mt-10 pt-6 border-t border-slate-50 text-center">
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Powered by Premegage Tech</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
