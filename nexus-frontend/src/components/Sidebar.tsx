import { Bot, Settings, LogOut, LayoutDashboard, Wallet, Calendar, Target } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const getLinkClass = (path: string) => {
    const isActive = location.pathname.startsWith(path);
    return `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      isActive 
        ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white font-semibold' 
        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;
  };

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 glass-panel !border-l-0 !border-t-0 !border-b-0 !rounded-none flex flex-col z-20">
      <div className="p-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-wider">NEXUS</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        <Link to="/dashboard" className={getLinkClass('/dashboard')}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        <Link to="/transactions" className={getLinkClass('/transactions')}>
          <Wallet size={20} />
          <span>Transactions</span>
        </Link>
        <Link to="/subscriptions" className={getLinkClass('/subscriptions')}>
          <Calendar size={20} />
          <span>Subscriptions</span>
        </Link>
        <Link to="/budgets" className={getLinkClass('/budgets')}>
          <Target size={20} />
          <span>Budgets</span>
        </Link>
        <Link to="/chat" className={getLinkClass('/chat')}>
          <Bot size={20} />
          <span>AI Wealth Coach</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <Link to="/settings" className={getLinkClass('/settings')}>
          <Settings size={20} />
          <span>Settings</span>
        </Link>
        <button onClick={() => { localStorage.removeItem('nexus_token'); window.location.reload(); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
