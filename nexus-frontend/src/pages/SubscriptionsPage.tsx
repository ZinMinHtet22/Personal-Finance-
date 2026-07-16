import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import client from '../api/client';

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const res = await client.get('/subscriptions');
        setSubscriptions(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchSubs();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Subscriptions Hub</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map(sub => (
              <div key={sub.id} className="glass-panel p-6 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3">
                  <span className="bg-purple-900/50 text-purple-400 text-xs px-2 py-1 rounded-full border border-purple-700/50">Recurring</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{sub.category}</h3>
                <p className="text-3xl font-bold text-indigo-400 mb-4">${parseFloat(sub.amount).toFixed(2)}</p>
                <div className="text-slate-500 dark:text-slate-400 text-sm">
                  <p>Next Renewal: <span className="text-slate-900 dark:text-white font-medium">{sub.renewal_date || 'Unknown'}</span></p>
                </div>
              </div>
            ))}
            {subscriptions.length === 0 && (
              <div className="col-span-full text-slate-500 py-8 text-center">No active subscriptions found.</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
