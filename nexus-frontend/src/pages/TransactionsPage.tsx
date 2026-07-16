import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import client from '../api/client';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/transactions').then(res => {
      setTransactions(res.data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto w-full">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">All Transactions</h2>
            
            {loading ? (
              <div className="text-slate-500 dark:text-slate-400">Loading...</div>
            ) : (
              <div className="glass-panel rounded-xl p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium">Category</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((t, i) => (
                        <tr key={i} className="border-b border-slate-200 dark:border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                          <td className="py-3">{new Date(t.created_at).toLocaleDateString()}</td>
                          <td className="py-3">{t.category}</td>
                          <td className="py-3 font-medium text-slate-700 dark:text-slate-200">${parseFloat(t.amount).toFixed(2)}</td>
                          <td className="py-3">
                            {t.is_subscription ? (
                              <span className="px-2 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-md text-xs font-medium">Subscription</span>
                            ) : (
                              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md text-xs">One-time</span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {transactions.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-slate-500">
                            No transactions found. Go to Settings &gt; Data Portability to import some!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
