import { Link } from 'react-router-dom';
import { ArrowRight, PieChart, Shield, LineChart, Globe, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function LandingPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-slate-900 dark:text-slate-50 font-sans selection:bg-slate-200 dark:selection:bg-slate-800">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b border-slate-200/50 dark:border-white/5 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-xl transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded flex items-center justify-center">
              <span className="text-white dark:text-black font-bold text-lg leading-none">N</span>
            </div>
            <span className="text-xl font-bold tracking-tight">NEXUS</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-lg"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link to="/login" className="text-sm font-medium hover:text-slate-500 transition-colors hidden sm:block">
              Client Portal
            </Link>
            <Link 
              to="/register" 
              className="px-5 py-2.5 text-sm font-medium bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-sm active:scale-95"
            >
              Request Access
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-[90vh] flex items-center">
        {/* Luxury Background Elements */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          {/* Subtle Grid Pattern with radial mask */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_30%,black_40%,transparent_100%)]"></div>

          {/* Glowing Orbs (Only visible in dark mode for that rich luxury feel, light mode stays crisp white/silver) */}
          <div className="hidden dark:block absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="hidden dark:block absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse" style={{animationDuration: '8s'}}></div>
          <div className="hidden dark:block absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse" style={{animationDuration: '10s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
            
            {/* Left Column: Copy & CTA */}
            <div className="flex flex-col items-start text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium tracking-wide uppercase mb-8 text-slate-600 dark:text-slate-400">
                <span>Exclusive Wealth Management</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.1]">
                Elevate Your <br />
                Financial Legacy
              </h1>
              
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 font-light leading-relaxed max-w-xl">
                Experience uncompromised precision and clarity. Nexus is the premier platform designed for the modern elite to orchestrate their global wealth with absolute confidence.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link 
                  to="/register" 
                  className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-200 transition-all active:scale-95 shadow-lg shadow-slate-900/10 dark:shadow-white/10 group w-full sm:w-auto"
                >
                  <span>Begin Your Journey</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/login" 
                  className="px-8 py-4 bg-white dark:bg-[#111] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl font-medium flex items-center justify-center hover:bg-slate-50 dark:hover:bg-[#1a1a1a] transition-all active:scale-95 w-full sm:w-auto"
                >
                  Client Sign In
                </Link>
              </div>
            </div>

            {/* Right Column: Floating Mock UI Card */}
            <div className="relative w-full max-w-lg mx-auto lg:max-w-none lg:ml-auto perspective-[1000px]">
               {/* Card Container */}
               <div className="p-8 rounded-[2.5rem] bg-white/80 dark:bg-[#111]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative z-10 transition-transform duration-700 hover:rotate-y-[-5deg] hover:rotate-x-[5deg]">
                 
                 <div className="flex justify-between items-start mb-12">
                   <div>
                     <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-2 tracking-wide uppercase">Total Net Worth</p>
                     <h3 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">$2,458,930<span className="text-slate-400 text-2xl">.00</span></h3>
                   </div>
                   <div className="px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-semibold border border-emerald-100 dark:border-emerald-500/20">
                     +14.2%
                   </div>
                 </div>
                 
                 {/* Mock Chart Area */}
                 <div className="h-48 w-full rounded-2xl bg-gradient-to-t from-slate-100 to-transparent dark:from-white/5 border-b-2 border-slate-900 dark:border-white relative overflow-hidden flex items-end">
                    {/* Fake bars */}
                    <div className="w-full flex items-end justify-between px-4 gap-3 h-full opacity-60 dark:opacity-40 pt-12 pb-0">
                      <div className="w-full bg-slate-900 dark:bg-white rounded-t-md h-[30%] hover:h-[35%] transition-all"></div>
                      <div className="w-full bg-slate-900 dark:bg-white rounded-t-md h-[50%] hover:h-[55%] transition-all"></div>
                      <div className="w-full bg-slate-900 dark:bg-white rounded-t-md h-[40%] hover:h-[45%] transition-all"></div>
                      <div className="w-full bg-slate-900 dark:bg-white rounded-t-md h-[70%] hover:h-[75%] transition-all"></div>
                      <div className="w-full bg-slate-900 dark:bg-white rounded-t-md h-[60%] hover:h-[65%] transition-all"></div>
                      <div className="w-full bg-slate-900 dark:bg-white rounded-t-md h-[85%] hover:h-[90%] transition-all"></div>
                      <div className="w-full bg-indigo-600 dark:bg-white rounded-t-md h-[100%] shadow-[0_0_15px_rgba(79,70,229,0.5)] dark:shadow-[0_0_15px_rgba(255,255,255,0.3)]"></div>
                    </div>
                 </div>
               </div>
               
               {/* Decorative elements behind card (only in dark mode to prevent light mode flashiness) */}
               <div className="hidden dark:block absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none"></div>
               <div className="hidden dark:block absolute -bottom-12 -left-12 w-48 h-48 bg-purple-500/20 blur-[80px] rounded-full pointer-events-none"></div>
            </div>

          </div>
        </div>
      </section>

      {/* Bento Box Features */}
      <section className="py-24 lg:py-32 bg-slate-50 dark:bg-[#0a0a0a] border-y border-slate-200/50 dark:border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Unrivaled Precision</h2>
            <p className="text-slate-600 dark:text-slate-400 font-light text-lg lg:text-xl">
              A bespoke suite of tools crafted to monitor, analyze, and optimize your portfolio with unparalleled accuracy. Built for those who demand excellence.
            </p>
          </div>
          
          {/* Asymmetrical Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Feature 1 (Large) */}
            <div className="md:col-span-8 p-10 rounded-[2rem] bg-white dark:bg-[#111] border border-slate-200/60 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-colors group relative overflow-hidden flex flex-col justify-between min-h-[320px] shadow-sm">
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-8 group-hover:scale-110 transition-transform">
                  <LineChart size={28} strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold mb-3">Portfolio Analytics</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light max-w-md">
                  Deep, real-time insights into your asset performance and global market trends, allowing you to make strategic decisions instantly.
                </p>
              </div>
              <div className="absolute right-0 bottom-0 w-64 h-64 bg-slate-50 dark:bg-[#151515] rounded-tl-full -mr-10 -mb-10 transition-transform group-hover:scale-105 border-t border-l border-slate-200/50 dark:border-white/5 flex items-center justify-center">
                 <div className="w-32 h-32 border-4 border-dashed border-indigo-200 dark:border-indigo-900/50 rounded-full animate-[spin_30s_linear_infinite]"></div>
              </div>
            </div>

            {/* Feature 2 (Medium) */}
            <div className="md:col-span-4 p-10 rounded-[2rem] bg-white dark:bg-[#151515] border border-slate-200/60 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-colors group flex flex-col min-h-[320px] shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-8 group-hover:scale-110 transition-transform">
                <Shield size={28} strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Bank-Grade Vault</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light mt-auto">
                Military-grade encryption and multi-layer security protocols to ensure absolute privacy for your most sensitive data.
              </p>
            </div>

            {/* Feature 3 (Medium) */}
            <div className="md:col-span-5 p-10 rounded-[2rem] bg-white dark:bg-[#111] border border-slate-200/60 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-colors group flex flex-col min-h-[320px] shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-8 group-hover:scale-110 transition-transform">
                <Globe size={28} strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Global Reach</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light mt-auto">
                Seamless multi-currency support for a truly borderless wealth experience across international markets.
              </p>
            </div>

            {/* Feature 4 (Large) */}
            <div className="md:col-span-7 p-10 rounded-[2rem] bg-white dark:bg-[#111] border border-slate-200/60 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-colors group flex flex-col sm:flex-row gap-8 items-start sm:items-center min-h-[320px] shadow-sm">
              <div className="flex-1">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-8 group-hover:scale-110 transition-transform">
                  <PieChart size={28} strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold mb-3">Bespoke Reporting</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                  Tailored fiscal reports providing clarity on cash flow, expenditure, and long-term projections.
                </p>
              </div>
              <div className="w-full sm:w-48 h-48 rounded-2xl bg-slate-50 dark:bg-[#151515] border border-slate-200/50 dark:border-white/5 flex items-center justify-center flex-shrink-0 group-hover:-rotate-3 transition-transform">
                <PieChart size={64} className="text-purple-200 dark:text-purple-900/40" strokeWidth={1} />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white dark:bg-[#050505] text-center border-t border-slate-200/50 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 bg-slate-900 dark:bg-white rounded-sm flex items-center justify-center">
              <span className="text-white dark:text-black font-bold text-xs leading-none">N</span>
            </div>
            <span className="font-semibold tracking-tight text-sm">NEXUS</span>
          </div>
          <p className="text-slate-500 dark:text-slate-500 text-sm font-light">
            &copy; {new Date().getFullYear()} Nexus Wealth Management. All rights reserved.
          </p>
        </div>
      </footer>
      
    </div>
  );
}
