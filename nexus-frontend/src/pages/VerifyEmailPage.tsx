import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import client from '../api/client';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP code.');
      return;
    }
    setLoading(true);
    try {
      const res = await client.post('/verify-otp', { email, otp });
      localStorage.setItem('nexus_token', res.data.token);
      localStorage.setItem('nexus_user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setMsg('');
    try {
      await client.post('/resend-otp', { email });
      setMsg('A new OTP has been sent to your email.');
    } catch (err: any) {
      setError('Failed to resend OTP.');
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#0a0a0a]">
      {/* Left side - Background Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900">
        <div className="absolute inset-0 bg-indigo-900/20 mix-blend-multiply z-10" />
        <img src="/images/auth-bg.png" alt="Corporate background" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10" />
        <div className="absolute bottom-16 left-16 z-20">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight leading-tight">Enterprise Standard<br/>Security</h1>
          <p className="text-slate-300 text-lg max-w-md font-medium">Multi-factor authentication ensures your business data remains protected.</p>
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        <div className="absolute top-8 left-8 lg:hidden">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">NEXUS</h2>
        </div>
        
        <div className="max-w-md w-full relative z-10">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <ShieldCheck size={32} />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-2 tracking-tight">
            Verify Your Identity
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-center mb-10 font-medium text-sm">
            We've sent a 6-digit secure verification code to <br/>
            <span className="font-bold text-slate-700 dark:text-slate-300 mt-1 inline-block">{email}</span>
          </p>

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <div className="relative">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full bg-white dark:bg-[#121212] border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-4 text-center text-3xl tracking-[0.6em] font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm placeholder:tracking-normal placeholder:font-sans placeholder:text-base placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  placeholder="Enter 6-digit code"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm font-semibold flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-3 animate-pulse"></div>
                {error}
              </div>
            )}
            
            {msg && (
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-500/30 text-green-600 dark:text-green-400 text-sm font-semibold flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                {msg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98] disabled:active:scale-100 disabled:shadow-none mt-4"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Verify & Continue'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={handleResend}
              className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-semibold transition-colors"
            >
              Didn't receive the code? Resend Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
