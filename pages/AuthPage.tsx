
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { db } from '../database';
import { sendWelcomeEmail, sendOtpEmail, sendResetEmail } from '../services/mail';
import { 
  Mail, Lock, Phone, User as UserIcon, Shield, 
  ChevronRight, Zap, ChevronLeft,
  FileText, Car, Smartphone, AlertCircle, Upload, CheckCircle as CheckCircleIcon,
  Wifi, Info, RefreshCw
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
    confirmPassword: '',
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
  
  const [interceptedMail, setInterceptedMail] = useState<InterceptedMail | null>(null);

  const { login, showToast } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const handleMailIntercept = (e: any) => {
      setInterceptedMail(e.detail);
      setTimeout(() => setInterceptedMail(null), 12000);
    };
    window.addEventListener('speedride_mail_intercept', handleMailIntercept);
    return () => window.removeEventListener('speedride_mail_intercept', handleMailIntercept);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'licenseDoc' | 'ninDoc') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("File exceeds 5MB limit", "error");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, [field]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const email = formData.email.trim();
      const password = formData.password.trim();

      if (!email || !password) {
        throw new Error("Missing credentials.");
      }

      // Unified login automatically finds the user and their role
      const session = await db.auth.login(email, password);
      
      login(session);
      
      // Navigate based on the identified role
      setTimeout(() => {
        navigate(`/${session.role.toLowerCase()}`);
      }, 1200);
    } catch (err: any) {
      setError(err.message);
      showToast(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const validatePassword = (pass: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

    if (pass.length < minLength) return "Password must be at least 8 characters long.";
    if (!hasUpperCase) return "Password must contain at least one uppercase letter.";
    if (!hasLowerCase) return "Password must contain at least one lowercase letter.";
    if (!hasNumber) return "Password must contain at least one number.";
    if (!hasSpecialChar) return "Password must contain at least one special character.";
    return null;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      showToast(passwordError, "error");
      setError(passwordError);
      return;
    }

    if (role === 'DRIVER' && (!formData.licenseDoc || !formData.ninDoc)) {
      showToast("Documents required for Driver accounts", "error");
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setCorrectOtp(newOtp);
      await sendOtpEmail(formData.email, newOtp);
      showToast("Verification code transmitted", "success");
      setView('OTP');
    } catch (err) {
      showToast("Failed to initiate signup", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const user = await db.users.getByEmail(formData.email);
      if (!user) {
        showToast("Email not found", "error");
        setIsLoading(false);
        return;
      }

      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setCorrectOtp(newOtp);
      await sendResetEmail(formData.email, newOtp);
      showToast("Recovery signal sent", "success");
      setView('RESET');
    } catch (err) {
      showToast("Recovery flow interrupted", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp !== correctOtp) {
      showToast("Security code invalid", "error");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords mismatch", "error");
      return;
    }

    setIsLoading(true);
    try {
      const success = await db.users.updatePassword(formData.email, formData.password);
      if (success) {
        showToast("Password synced successfully", "success");
        setView('SUCCESS');
        setTimeout(() => setView('LOGIN'), 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp !== correctOtp) {
      showToast("Verification failed", "error");
      return;
    }

    setIsLoading(true);
    try {
      const newUser = await db.users.create({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
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

      showToast("Account Provisioned", "success");
      setView('SUCCESS');
      setTimeout(() => {
        login(newUser);
        setTimeout(() => {
          navigate(`/${role.toLowerCase()}`);
        }, 1200);
      }, 2000);
    } catch (err: any) {
      showToast(err.message || "Database commit failed", "error");
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
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircleIcon className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">SUCCESS</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Redirecting to Dashboard...</p>
          </div>
        );

      case 'FORGOT':
        return (
          <form onSubmit={handleForgotPassword} className="space-y-6 animate-in fade-in duration-500">
            <button type="button" onClick={() => setView('LOGIN')} className="flex items-center text-slate-400 font-black text-xs uppercase tracking-widest hover:text-blue-600 transition">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </button>
            <h2 className="text-2xl font-black text-slate-900 text-center tracking-tight uppercase">Recover</h2>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input name="email" type="text" placeholder="Email Address" required onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-sm" />
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-blue-600 transition shadow-xl uppercase tracking-widest text-xs" disabled={isLoading}>{isLoading ? "SENDING..." : "SEND CODE"}</button>
          </form>
        );

      case 'RESET':
        return (
          <form onSubmit={handleResetPassword} className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-slate-900 text-center uppercase tracking-tight">Set New Password</h2>
            <div className="flex justify-center space-x-2">
              {otp.map((digit, i) => (
                <input
                  key={i} id={`otp-${i}`} type="text" maxLength={1} value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className={`w-10 h-14 text-center text-xl font-black bg-slate-50 border-2 rounded-xl focus:border-blue-600 outline-none transition border-slate-100`}
                />
              ))}
            </div>
            <div className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input name="password" type="password" placeholder="New Password" required onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-sm" />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input name="confirmPassword" type="password" placeholder="Confirm Password" required onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-sm" />
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition shadow-xl uppercase tracking-widest text-xs" disabled={isLoading}>{isLoading ? "SAVING..." : "UPDATE PASSWORD"}</button>
          </form>
        );

      case 'OTP':
        return (
          <div className="space-y-8 text-center animate-in fade-in duration-500">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Wifi className="text-blue-600 w-8 h-8 animate-pulse" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Verify Account</h2>
            <div className="flex justify-center space-x-2">
              {otp.map((digit, i) => (
                <input
                  key={i} id={`otp-${i}`} type="text" maxLength={1} value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className={`w-10 h-14 md:w-12 md:h-16 text-center text-xl font-black bg-slate-50 border-2 rounded-xl focus:border-blue-600 outline-none transition border-slate-100`}
                />
              ))}
            </div>
            <button 
              onClick={handleVerifyOtp} disabled={isLoading}
              className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition shadow-xl uppercase tracking-widest text-xs"
            >
              {isLoading ? "VALIDATING..." : "VERIFY"}
            </button>
          </div>
        );

      case 'SIGNUP':
        return (
          <form onSubmit={handleSignup} className="space-y-4 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-slate-900 text-center mb-6 uppercase tracking-tight">Create Account</h2>
            <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
              {['RIDER', 'DRIVER'].map(r => (
                <button key={r} type="button" onClick={() => setRole(r as any)} className={`flex-1 py-2 text-[10px] font-black rounded-lg transition uppercase tracking-widest ${role === r ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>{r}</button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input name="name" placeholder="Name" required onChange={handleInputChange} className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-sm" />
              <input name="phone" placeholder="Phone" required onChange={handleInputChange} className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-sm" />
            </div>
            <input name="email" type="email" placeholder="Email" required onChange={handleInputChange} className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-sm" />
            <input name="password" type="password" placeholder="Password" required onChange={handleInputChange} className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-sm" />
            
            {role === 'DRIVER' && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <input name="vehicleModel" placeholder="Vehicle" required onChange={handleInputChange} className="px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-xs" />
                <input name="plateNumber" placeholder="Plate" required onChange={handleInputChange} className="px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-xs" />
                <label className="flex flex-col items-center justify-center p-3 rounded-2xl border-2 border-dashed bg-slate-50 cursor-pointer text-[9px] font-black uppercase tracking-widest text-slate-400">
                  <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'licenseDoc')} />
                  {formData.licenseDoc ? 'LICENSE OK' : 'LICENSE'}
                </label>
                <label className="flex flex-col items-center justify-center p-3 rounded-2xl border-2 border-dashed bg-slate-50 cursor-pointer text-[9px] font-black uppercase tracking-widest text-slate-400">
                  <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'ninDoc')} />
                  {formData.ninDoc ? 'NIN OK' : 'NIN ID'}
                </label>
              </div>
            )}
            <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition shadow-xl uppercase tracking-widest text-xs mt-2" disabled={isLoading}>{isLoading ? "CREATING..." : "SIGN UP"}</button>
            <p className="text-center font-bold text-slate-400 text-xs">Already registered? <button type="button" onClick={() => setView('LOGIN')} className="text-blue-600">Sign In</button></p>
          </form>
        );

      case 'LOGIN':
      default:
        return (
          <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-slate-900 text-center mb-6 uppercase tracking-tight">Sign In</h2>
            
            <div className="space-y-4">
              <input name="email" type="text" placeholder="Email / Username" required onChange={handleInputChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-sm" />
              <input name="password" type="password" placeholder="Password" required onChange={handleInputChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-sm" />
            </div>
            
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
               <label className="flex items-center space-x-2 cursor-pointer text-slate-500"><input type="checkbox" className="rounded-md" /> <span>Keep me signed in</span></label>
               <button type="button" onClick={() => setView('FORGOT')} className="text-blue-600">Forgot Password?</button>
            </div>
            
            <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-blue-600 transition shadow-xl uppercase tracking-[0.2em] text-xs" disabled={isLoading}>{isLoading ? "Signing in.." : "SIGN IN"}</button>
            
            <p className="text-center font-bold text-slate-400 text-xs">New account? <button type="button" onClick={() => setView('SIGNUP')} className="text-blue-600 underline">Create Account</button></p>
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
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-blue-600 rounded-2xl"><Mail className="w-6 h-6" /></div>
                <div>
                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Transmission Intercepted</p>
                   <p className="text-sm font-black">{interceptedMail.subject}</p>
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 mb-4">
                 <p className="text-xs text-slate-300 font-medium leading-relaxed">{interceptedMail.body}</p>
              </div>
              {interceptedMail.otp && (
                <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-2 text-slate-400"><Zap className="w-4 h-4 text-yellow-400" /><span className="text-[10px] font-black uppercase tracking-widest">Access Code</span></div>
                   <span className="text-2xl font-black text-blue-400 tracking-[0.2em]">{interceptedMail.otp}</span>
                </div>
              )}
           </div>
        </div>
      )}

      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[120px] -z-10"></div>
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl border border-white p-10 animate-fade-up">
        <div className="flex flex-col items-center justify-center mb-10">
          <Logo className="h-20 w-auto" />
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
