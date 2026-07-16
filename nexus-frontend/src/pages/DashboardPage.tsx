import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AICoachBanner from '../components/AICoachBanner';
import CategoryChart from '../components/CategoryChart';
import TransactionList from '../components/TransactionList';
import client from '../api/client';
import { exportToCsv } from '../utils/exportCsv';
import { Download } from 'lucide-react';
import CategorySelect from '../components/CategorySelect';

export default function DashboardPage() {
  const [summaryData, setSummaryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [type, setType] = useState('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubscription, setIsSubscription] = useState(false);
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const fetchSummary = async () => {
    try {
      const response = await client.get('/dashboard/summary');
      setSummaryData(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        navigate('/login');
      }
      console.error("Failed to fetch dashboard summary", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await client.post('/transactions', {
        amount,
        category,
        is_subscription: isSubscription,
        type,
        date,
        description
      });
      setShowAddModal(false);
      setAmount('');
      setDescription('');
      fetchSummary();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center text-slate-900 dark:text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col relative">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto relative">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Overview</h2>
            <div className="flex gap-4">
              <button onClick={() => exportToCsv('nexus-transactions.csv', summaryData?.recent_transactions || [])} className="flex items-center gap-2 glass-panel hover:bg-slate-700 text-slate-900 dark:text-white px-4 py-2 rounded-lg font-medium transition-colors border border-slate-700">
                <Download size={18} />
                Export CSV
              </button>
              <button onClick={() => setShowAddModal(true)} className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-95 transition-all shadow-sm font-medium text-white px-4 py-2 rounded-lg font-medium">
                + Add Transaction
              </button>
            </div>
          </div>
          <AICoachBanner summary={summaryData?.ai_coach_summary || ''} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <CategoryChart data={summaryData?.categories?.length ? summaryData.categories : []} />
              
              {summaryData?.budget_progress && summaryData.budget_progress.length > 0 && (
                <div className="glass-panel rounded-xl p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Budget Progress</h3>
                  <div className="space-y-4">
                    {summaryData.budget_progress.map((bp: any, idx: number) => {
                      const percent = Math.min(100, Math.round((bp.spent / bp.limit_amount) * 100));
                      const isOver = percent >= 100;
                      return (
                        <div key={idx}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600 dark:text-slate-300 font-medium">{bp.category}</span>
                            <span className={isOver ? 'text-red-400' : 'text-slate-500 dark:text-slate-400'}>
                              ${parseFloat(bp.spent).toFixed(0)} / ${parseFloat(bp.limit_amount).toFixed(0)}
                            </span>
                          </div>
                          <div className="w-full bg-zinc-50 dark:bg-black rounded-full h-2 overflow-hidden border border-slate-200 dark:border-slate-800">
                            <div className={`h-2 rounded-full ${isOver ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${percent}%` }}></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="lg:col-span-2">
              <TransactionList transactions={summaryData?.recent_transactions} />
            </div>
          </div>
        </main>

        {showAddModal && (
          <div className="absolute inset-0 bg-zinc-50 dark:bg-black/80 flex items-center justify-center z-50">
            <div className="glass-panel p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Add Transaction</h3>
              
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 mb-6">
                <button 
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === 'expense' ? 'bg-slate-700 text-slate-900 dark:text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'}`}
                  onClick={() => setType('expense')}
                >
                  Expense
                </button>
                <button 
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === 'income' ? 'bg-slate-700 text-slate-900 dark:text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'}`}
                  onClick={() => setType('income')}
                >
                  Income
                </button>
              </div>

              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 text-sm mb-1">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">$</span>
                    <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required className="w-full bg-zinc-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-4 py-3 text-slate-900 dark:text-white outline-none focus:border-indigo-500" placeholder="0.00" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 text-sm mb-1">Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full bg-zinc-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-indigo-500 [color-scheme:dark]" />
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 text-sm mb-1">Category</label>
                    <CategorySelect 
                      value={category} 
                      onChange={setCategory} 
                      buttonClassName="w-full bg-zinc-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 text-sm mb-1">Notes (Optional)</label>
                  <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Dinner with friends..." className="w-full bg-zinc-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-indigo-500" />
                </div>

                <div className="flex items-center justify-between bg-zinc-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3">
                  <div>
                    <p className="text-slate-900 dark:text-white font-medium text-sm">Recurring Subscription</p>
                    <p className="text-slate-500 text-xs">Mark this as a monthly subscription</p>
                  </div>
                  <button 
                    type="button" 
                    className={`w-12 h-6 rounded-full transition-colors relative ${isSubscription ? 'bg-indigo-600 hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all' : 'bg-slate-700'}`}
                    onClick={() => setIsSubscription(!isSubscription)}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${isSubscription ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-2.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white font-medium">Cancel</button>
                  <button type="submit" className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-95 transition-all shadow-sm font-medium text-slate-900 dark:text-white px-6 py-2.5 rounded-lg font-medium shadow-lg shadow-indigo-900/20">Save Transaction</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
