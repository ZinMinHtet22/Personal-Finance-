import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import client from '../api/client';

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [category, setCategory] = useState('Groceries');
  const [limit, setLimit] = useState('');
  
  const fetchBudgets = async () => {
    try {
      const res = await client.get('/budgets');
      setBudgets(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleSetBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await client.post('/budgets', { category, limit_amount: limit });
      setLimit('');
      fetchBudgets();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Monthly Budgets</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <form onSubmit={handleSetBudget} className="glass-panel p-6 rounded-xl space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Set Budget Limit</h3>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 text-sm mb-1">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 text-slate-900 dark:text-white outline-none">
                    <option>Groceries</option>
                    <option>Entertainment</option>
                    <option>Transport</option>
                    <option>Housing</option>
                    <option>Utilities</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 text-sm mb-1">Limit Amount</label>
                  <input type="number" value={limit} onChange={e => setLimit(e.target.value)} step="0.01" required className="w-full bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 text-slate-900 dark:text-white outline-none" />
                </div>
                <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-95 transition-all shadow-sm font-medium py-2 rounded-lg transition-colors">
                  Save Budget
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 glass-panel p-6 rounded-xl space-y-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Active Budgets</h3>
              {budgets.length === 0 ? (
                <p className="text-slate-500">No budgets set.</p>
              ) : (
                budgets.map(b => (
                  <div key={b.id} className="bg-slate-50 dark:bg-[#0a0a0a] p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-900 dark:text-white font-medium">{b.category}</span>
                      <span className="text-slate-500 dark:text-slate-400">Limit: ${b.limit_amount}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
