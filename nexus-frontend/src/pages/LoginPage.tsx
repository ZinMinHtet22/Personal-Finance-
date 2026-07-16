import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import client from '../api/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await client.post('/login', { email, password });
      localStorage.setItem('nexus_token', res.data.token);
      localStorage.setItem('nexus_user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err: any) {
      if (err.response?.status === 403) {
        if (err.response?.data?.requires_verification) {
          navigate('/verify-email', { state: { email: err.response.data.email } });
        } else if (err.response?.data?.requires_biometric) {
          localStorage.setItem('admin_webauthn_email', err.response.data.email);
          navigate('/admin/login', { state: { email: err.response.data.email } });
        } else {
          setError(err.response?.data?.message || 'Login failed');
        }
      } else {
        setError(err.response?.data?.message || 'Login failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative overflow-hidden bg-slate-50 dark:bg-[#050505]">
      
      {/* Luxury Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img src="/images/auth-bg.png" alt="Background texture" className="absolute inset-0 w-full h-full object-cover opacity-30 dark:opacity-20 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-slate-50/80 dark:bg-[#050505]/90 backdrop-blur-2xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808025_1px,transparent_1px),linear-gradient(to_bottom,#80808025_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,black_50%,transparent_100%)]"></div>
        
        {/* Pronounced Glowing Orbs */}
        <div className="hidden dark:block absolute top-[-10%] left-[-10%] w-[700px] h-[700px] bg-indigo-600/15 blur-[120px] rounded-full animate-pulse" style={{animationDuration: '12s'}}></div>
        <div className="hidden dark:block absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/15 blur-[120px] rounded-full animate-pulse" style={{animationDuration: '15s'}}></div>
        <div className="hidden dark:block absolute top-[20%] right-[20%] w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full animate-pulse" style={{animationDuration: '10s'}}></div>
      </div>

      {/* Glassmorphism Card */}
      <div className="w-full max-w-md relative z-10 p-8 sm:p-12 rounded-[2.5rem] bg-white/80 dark:bg-[#111]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
        
        <div className="flex justify-center mb-10">
          <Link to="/">
            <div className="w-12 h-12 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
              <span className="text-white dark:text-black font-bold text-2xl leading-none">N</span>
            </div>
          </Link>
        </div>

        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Client Sign In</h2>
          <p className="text-slate-500 dark:text-slate-400 font-light">Access your wealth management portal.</p>
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-300 p-4 rounded-xl mb-6 text-sm font-medium flex items-center">
            <div className="w-2 h-2 rounded-full bg-red-500 mr-3 animate-pulse"></div>
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 text-sm mb-2 font-medium">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-white/50 dark:bg-[#0a0a0a]/50 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white outline-none focus:border-slate-400 dark:focus:border-slate-600 transition-all shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium backdrop-blur-md" placeholder="name@company.com" />
          </div>
          <div>
            <label className="block text-slate-700 dark:text-slate-300 text-sm mb-2 font-medium">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-white/50 dark:bg-[#0a0a0a]/50 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white outline-none focus:border-slate-400 dark:focus:border-slate-600 transition-all shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium backdrop-blur-md" placeholder="••••••••" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <button type="submit" className="w-full bg-slate-900 dark:bg-white text-white dark:text-black font-semibold py-4 rounded-xl transition-all shadow-md active:scale-[0.98] flex justify-center items-center mt-6 hover:bg-slate-800 dark:hover:bg-slate-200">
            Sign In
          </button>
        </form>
        
        <p className="mt-8 text-center text-slate-500 dark:text-slate-400 text-sm font-light">
          Don't have an account? <Link to="/register" className="text-slate-900 dark:text-white hover:underline font-medium transition-colors ml-1">Request Access</Link>
        </p>
      </div>
    </div>
  );
}
