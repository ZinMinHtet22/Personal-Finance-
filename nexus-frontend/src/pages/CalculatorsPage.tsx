import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, TrendingUp, CreditCard, Building, ShieldAlert } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CalculatorsPage() {
  const [activeTab, setActiveTab] = useState('compound');

  // Compound Interest State
  const [principal, setPrincipal] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(7);

  // Debt Payoff State
  const [debtBalance, setDebtBalance] = useState(15000);
  const [debtRate, setDebtRate] = useState(18);
  const [monthlyPayment, setMonthlyPayment] = useState(500);

  // Mortgage State
  const [loanAmount, setLoanAmount] = useState(300000);
  const [loanRate, setLoanRate] = useState(6.5);
  const [loanYears, setLoanYears] = useState(30);

  // Emergency Fund State
  const [monthlyExpenses, setMonthlyExpenses] = useState(3500);
  const [targetMonths, setTargetMonths] = useState(6);
  const [currentSavings, setCurrentSavings] = useState(5000);

  const compoundData = useMemo(() => {
    let data = [];
    let currentPrincipal = principal;
    let totalContributed = principal;
    
    for (let i = 0; i <= years; i++) {
      data.push({
        year: i === 0 ? 'Now' : `Year ${i}`,
        total: Math.round(currentPrincipal),
        contributions: Math.round(totalContributed)
      });
      // Add a year of growth and contributions
      for (let m = 0; m < 12; m++) {
        currentPrincipal = currentPrincipal * (1 + (rate / 100) / 12) + monthlyContribution;
        totalContributed += monthlyContribution;
      }
    }
    return data;
  }, [principal, monthlyContribution, years, rate]);

  const calculateDebt = () => {
    if (monthlyPayment <= (debtBalance * (debtRate / 100) / 12)) return null; // Payment too low
    
    let balance = debtBalance;
    let months = 0;
    let totalInterest = 0;
    
    while (balance > 0 && months < 1200) {
      const interest = balance * (debtRate / 100) / 12;
      totalInterest += interest;
      balance = balance + interest - monthlyPayment;
      months++;
    }
    
    return { months, totalInterest };
  };

  const debtResult = calculateDebt();

  const calculateMortgage = () => {
    const p = loanAmount;
    const r = (loanRate / 100) / 12;
    const n = loanYears * 12;
    if (r === 0) return p / n;
    return p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };

  const mortgagePayment = calculateMortgage();
  const emergencyTarget = monthlyExpenses * targetMonths;
  const emergencyProgress = Math.min(100, Math.round((currentSavings / emergencyTarget) * 100));

  const tabs = [
    { id: 'compound', name: 'Compound Growth', icon: TrendingUp },
    { id: 'debt', name: 'Debt Payoff', icon: CreditCard },
    { id: 'mortgage', name: 'Loan / Mortgage', icon: Building },
    { id: 'emergency', name: 'Emergency Fund', icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl">
              <Calculator size={28} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Financial Calculators</h2>
          </div>

          <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md scale-100' 
                      : 'bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 scale-95 hover:scale-100'
                  }`}
                >
                  <Icon size={18} />
                  {tab.name}
                </button>
              )
            })}
          </div>

          <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm relative overflow-hidden min-h-[500px]">
            <AnimatePresence mode="wait">
              {activeTab === 'compound' && (
                <motion.div 
                  key="compound"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-12"
                >
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Investment Growth</h3>
                    <div>
                      <label className="block text-sm text-slate-500 dark:text-slate-400 mb-2">Initial Principal ($)</label>
                      <input type="number" value={principal} onChange={e => setPrincipal(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 dark:text-slate-400 mb-2">Monthly Contribution ($)</label>
                      <input type="number" value={monthlyContribution} onChange={e => setMonthlyContribution(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 dark:text-slate-400 mb-2">Years to Grow ({years} yrs)</label>
                      <input type="range" min="1" max="50" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full accent-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 dark:text-slate-400 mb-2">Estimated Return Rate ({rate}%)</label>
                      <input type="range" min="1" max="20" step="0.1" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full accent-indigo-500" />
                    </div>
                  </div>
                  <div className="lg:col-span-2 flex flex-col">
                    <div className="mb-6">
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Future Value (in {years} years)</p>
                      <p className="text-4xl font-bold text-slate-900 dark:text-white mt-1">
                        ${compoundData[compoundData.length - 1]?.total.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex-1 min-h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={compoundData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorContrib" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                          <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={v => `$${(v/1000)}k`} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                            formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
                          />
                          <Area type="monotone" dataKey="total" name="Total Balance" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                          <Area type="monotone" dataKey="contributions" name="Total Contributions" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorContrib)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'debt' && (
                <motion.div 
                  key="debt"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="max-w-2xl mx-auto"
                >
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-8 text-center">Debt Payoff Planner</h3>
                  <div className="space-y-6 bg-slate-50 dark:bg-black/30 p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div>
                      <label className="block text-sm text-slate-500 dark:text-slate-400 mb-2">Total Debt Balance ($)</label>
                      <input type="number" value={debtBalance} onChange={e => setDebtBalance(Number(e.target.value))} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-red-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 dark:text-slate-400 mb-2">Interest Rate (%)</label>
                      <input type="number" step="0.1" value={debtRate} onChange={e => setDebtRate(Number(e.target.value))} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-red-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 dark:text-slate-400 mb-2">Monthly Payment ($)</label>
                      <input type="number" value={monthlyPayment} onChange={e => setMonthlyPayment(Number(e.target.value))} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-red-500 transition-colors" />
                    </div>
                  </div>
                  
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center">
                      <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-1">Time to Payoff</p>
                      <p className="text-3xl font-bold text-red-700 dark:text-red-300">
                        {!debtResult ? 'Never' : `${Math.floor(debtResult.months / 12)}y ${debtResult.months % 12}m`}
                      </p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/20 p-6 rounded-2xl text-center">
                      <p className="text-sm text-orange-600 dark:text-orange-400 font-medium mb-1">Total Interest</p>
                      <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                        ${!debtResult ? '∞' : Math.round(debtResult.totalInterest).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'mortgage' && (
                <motion.div 
                  key="mortgage"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="max-w-2xl mx-auto"
                >
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-8 text-center">Loan / Mortgage Amortization</h3>
                  <div className="space-y-6 bg-slate-50 dark:bg-black/30 p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div>
                      <label className="block text-sm text-slate-500 dark:text-slate-400 mb-2">Loan Amount ($)</label>
                      <input type="number" value={loanAmount} onChange={e => setLoanAmount(Number(e.target.value))} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-colors" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-slate-500 dark:text-slate-400 mb-2">Interest Rate (%)</label>
                        <input type="number" step="0.1" value={loanRate} onChange={e => setLoanRate(Number(e.target.value))} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-500 dark:text-slate-400 mb-2">Loan Term (Years)</label>
                        <input type="number" value={loanYears} onChange={e => setLoanYears(Number(e.target.value))} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-colors" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 bg-indigo-500/10 border border-indigo-500/20 p-8 rounded-2xl text-center">
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-2">Estimated Monthly Payment</p>
                    <p className="text-5xl font-bold text-indigo-700 dark:text-indigo-300">
                      ${Math.round(mortgagePayment).toLocaleString()}
                    </p>
                    <p className="text-xs text-indigo-500 dark:text-indigo-500/70 mt-3 uppercase tracking-wider font-semibold">Principal & Interest Only</p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'emergency' && (
                <motion.div 
                  key="emergency"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="max-w-2xl mx-auto"
                >
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-8 text-center">Emergency Fund Target</h3>
                  <div className="space-y-6 bg-slate-50 dark:bg-black/30 p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div>
                      <label className="block text-sm text-slate-500 dark:text-slate-400 mb-2">Monthly Essential Expenses ($)</label>
                      <input type="number" value={monthlyExpenses} onChange={e => setMonthlyExpenses(Number(e.target.value))} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 dark:text-slate-400 mb-2">Target Safety Net ({targetMonths} months)</label>
                      <input type="range" min="1" max="12" value={targetMonths} onChange={e => setTargetMonths(Number(e.target.value))} className="w-full accent-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 dark:text-slate-400 mb-2">Current Savings ($)</label>
                      <input type="number" value={currentSavings} onChange={e => setCurrentSavings(Number(e.target.value))} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                  </div>
                  
                  <div className="mt-8 bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-2xl">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-1">Target Goal</p>
                        <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                          ${emergencyTarget.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{emergencyProgress}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-emerald-500/20 rounded-full h-3 overflow-hidden">
                      <div className="h-3 rounded-full bg-emerald-500 transition-all duration-1000 ease-out" style={{ width: `${emergencyProgress}%` }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
