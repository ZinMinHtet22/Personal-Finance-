import { useEffect, useState } from 'react';
import client from '../api/client';
import CurrencySelect from './CurrencySelect';

export default function Header() {
  const [userName, setUserName] = useState('User');
  const [initials, setInitials] = useState('US');
  const [currency, setCurrency] = useState('USD');

  const loadUser = async (forceFetch = false) => {
    try {
      let userStr = localStorage.getItem('nexus_user');
      if (!userStr || forceFetch) {
        const res = await client.get('/user');
        userStr = JSON.stringify(res.data);
        localStorage.setItem('nexus_user', userStr);
      }
      
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.name) {
          setUserName(user.name);
          const parts = user.name.split(' ').filter(Boolean);
          if (parts.length > 1) {
            setInitials((parts[0][0] + parts[1][0]).toUpperCase());
          } else {
            setInitials(user.name.substring(0, 2).toUpperCase());
          }
        }
        if (user.currency) {
          setCurrency(user.currency);
        }
      }
    } catch (err) {
      console.error("Failed to load user", err);
    }
  };

  useEffect(() => {
    loadUser();

    const handleUserUpdated = () => loadUser(true);
    window.addEventListener('userUpdated', handleUserUpdated);
    return () => window.removeEventListener('userUpdated', handleUserUpdated);
  }, []);

  const handleCurrencyChange = async (newCurrency: string) => {
    setCurrency(newCurrency);
    try {
      await client.put('/user/settings', { currency: newCurrency });
      loadUser(true);
      window.dispatchEvent(new Event('userUpdated')); // notify settings page if open
    } catch (err) {
      console.error("Failed to update currency", err);
    }
  };

  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <header className="flex justify-between items-center py-6 px-8 bg-zinc-50 dark:bg-black border-b border-slate-200 dark:border-slate-800">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Welcome Back, {userName}</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{date}</p>
      </div>
      <div className="flex items-center gap-4">
        <CurrencySelect 
          value={currency} 
          onChange={handleCurrencyChange} 
          buttonClassName="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-700 rounded-lg px-4 py-2 hover:border-indigo-500 focus:border-indigo-500"
        />
        <div className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all flex items-center justify-center text-slate-900 dark:text-white font-bold">
          {initials}
        </div>
      </div>
    </header>
  );
}
