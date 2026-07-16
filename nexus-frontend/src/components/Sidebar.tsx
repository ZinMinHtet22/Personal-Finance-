import { Bot, Settings, LogOut, LayoutDashboard, Wallet, Calendar, Target, Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const getLinkClass = (path: string) => {
    const isActive = location.pathname.startsWith(path);
    return `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      isActive 
        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold shadow-sm' 
        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
    }`;
  };

  const getIconClass = (path: string) => {
    const isActive = location.pathname.startsWith(path);
    return `transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`;
  };

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 glass-panel !border-l-0 !border-t-0 !border-b-0 !rounded-none flex flex-col z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl">
      <div className="p-8 pb-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center shadow-sm">
          <Target className="text-white dark:text-slate-900 w-5 h-5" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">NEXUS</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <Link to="/dashboard" className={getLinkClass('/dashboard')}>
          <LayoutDashboard size={20} className={getIconClass('/dashboard')} />
          <span>Dashboard</span>
        </Link>
        <Link to="/transactions" className={getLinkClass('/transactions')}>
          <Wallet size={20} className={getIconClass('/transactions')} />
          <span>Transactions</span>
        </Link>
        <Link to="/subscriptions" className={getLinkClass('/subscriptions')}>
          <Calendar size={20} className={getIconClass('/subscriptions')} />
          <span>Subscriptions</span>
        </Link>
        <Link to="/budgets" className={getLinkClass('/budgets')}>
          <Target size={20} className={getIconClass('/budgets')} />
          <span>Budgets</span>
        </Link>
        <Link to="/chat" className={getLinkClass('/chat')}>
          <Bot size={20} className={getIconClass('/chat')} />
          <span>Nexus Wealth Coach</span>
        </Link>
        {(() => {
          try {
            const user = JSON.parse(localStorage.getItem('nexus_user') || '{}');
            if (user.is_admin) {
              return (
                <Link to="/admin" className={getLinkClass('/admin')}>
                  <Shield size={20} className={getIconClass('/admin')} />
                  <span>Admin Dashboard</span>
                </Link>
              );
            }
          } catch (e) {}
          return null;
        })()}
      </nav>

      <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-2 bg-gradient-to-t from-slate-50 to-transparent dark:from-slate-900 dark:to-transparent">
        <Link to="/settings" className={getLinkClass('/settings')}>
          <Settings size={20} className={getIconClass('/settings')} />
          <span>Settings</span>
        </Link>
        <button onClick={() => { localStorage.removeItem('nexus_token'); localStorage.removeItem('nexus_user'); window.location.href = '/login'; }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all duration-200 group">
          <LogOut size={20} className="transition-transform duration-200 group-hover:scale-110" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
