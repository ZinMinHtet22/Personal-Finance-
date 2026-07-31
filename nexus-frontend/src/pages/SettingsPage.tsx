import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import client from '../api/client';
import { useNavigate } from 'react-router-dom';
import { Monitor, Smartphone, Trash2 } from 'lucide-react';
import CurrencySelect from '../components/CurrencySelect';
import LocaleSelect from '../components/LocaleSelect';
import { useTheme } from '../context/ThemeContext';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [locale, setLocale] = useState('en');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');

  const [budgetAlerts, setBudgetAlerts] = useState(false);
  const [weeklySummary, setWeeklySummary] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    client.get('/user').then(res => {
      setName(res.data.name);
      setCurrency(res.data.currency || 'USD');
      setLocale(res.data.locale || 'en');
      if (res.data.notification_preferences) {
        setBudgetAlerts(res.data.notification_preferences.budget_alerts || false);
        setWeeklySummary(res.data.notification_preferences.weekly_summary || false);
      }
    }).catch(() => navigate('/login'));
  }, [navigate]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    setErrorMsg('');
    try {
      const payload: any = { name, currency, locale };
      const res = await client.put('/user/settings', payload);
      
      const updatedUser = res.data;
      localStorage.setItem('nexus_user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('userUpdated'));
      
      setMsg('Profile preferences updated successfully!');
    } catch (e: any) {
      setErrorMsg(e.response?.data?.message || 'Error updating profile.');
    }
  };

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(''); setErrorMsg('');
    try {
      const payload: any = { 
        notification_preferences: { budget_alerts: budgetAlerts, weekly_summary: weeklySummary } 
      };
      await client.put('/user/settings', payload);
      setMsg('Notification preferences updated!');
    } catch (e: any) {
      setErrorMsg(e.response?.data?.message || 'Error updating preferences.');
    }
  };

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    setErrorMsg('');
    if (!currentPassword || !newPassword) {
      setErrorMsg('Please fill in both password fields.');
      return;
    }
    try {
      const payload: any = { current_password: currentPassword, new_password: newPassword };
      await client.put('/user/settings', payload);
      setMsg('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (e: any) {
      setErrorMsg(e.response?.data?.message || 'Error updating password.');
    }
  };


  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    setErrorMsg('');
    if (!deletePassword) {
      setErrorMsg('Password is required to delete account.');
      return;
    }
    
    if (!window.confirm("Are you ABSOLUTELY sure you want to delete your account? This action cannot be undone and will erase all your financial data.")) {
      return;
    }
    
    try {
      await client.delete('/user/account', { data: { password: deletePassword } });
      localStorage.removeItem('nexus_token');
      localStorage.removeItem('nexus_user');
      navigate('/login');
    } catch (e: any) {
      setErrorMsg(e.response?.data?.message || 'Error deleting account. Check password.');
    }
  };

  const handleDownloadExport = async () => {
    try {
      const res = await client.get('/transactions/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'nexus_transactions.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (e) {
      setErrorMsg("Failed to download export.");
    }
  };

  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(''); setErrorMsg('');
    if (!importFile) return;
    
    const formData = new FormData();
    formData.append('csv_file', importFile);
    
    try {
      const res = await client.post('/transactions/import/preview', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPreviewData(res.data);
    } catch (e: any) {
      setErrorMsg(e.response?.data?.message || 'Error parsing file.');
    }
  };

  const handleImport = async () => {
    setMsg(''); setErrorMsg('');
    if (!importFile) return;
    
    const formData = new FormData();
    formData.append('csv_file', importFile);
    
    try {
      const res = await client.post('/transactions/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMsg(res.data.message);
      setPreviewData(null);
      setImportFile(null);
    } catch (e: any) {
      setErrorMsg(e.response?.data?.message || 'Error importing file.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto relative">
          <div className="max-w-2xl mx-auto w-full">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">User Settings</h2>
            
            {msg && <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 p-4 rounded-xl mb-6 shadow-sm font-medium">{msg}</div>}
            {errorMsg && <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6">{errorMsg}</div>}
            
            <div className="glass-panel rounded-xl mb-6">
              <div className="flex border-b border-slate-200 dark:border-slate-800">
                <button 
                  onClick={() => setActiveTab('profile')} 
                  className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'profile' ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                  Profile Preferences
                </button>
                <button 
                  onClick={() => setActiveTab('security')} 
                  className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'security' ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                  Security & Account
                </button>
                <button 
                  onClick={() => setActiveTab('data')} 
                  className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'data' ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                  Data Portability
                </button>
                <button 
                  onClick={() => setActiveTab('appearance')} 
                  className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'appearance' ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-700'}`}
                >
                  Appearance
                </button>
                <button 
                  onClick={() => setActiveTab('notifications')} 
                  className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'notifications' ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-700'}`}
                >
                  Notifications
                </button>
              </div>

              <div className="p-8">
                {activeTab === 'profile' && (
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div>
                      <label className="block text-slate-500 dark:text-slate-400 text-sm mb-2">Display Name</label>
                      <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-slate-900 dark:focus:border-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-slate-500 dark:text-slate-400 text-sm mb-2">Default Currency</label>
                        <CurrencySelect 
                          value={currency} 
                          onChange={setCurrency} 
                          buttonClassName="w-full bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:border-slate-900 dark:focus:border-white hover:border-slate-700" 
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 dark:text-slate-400 text-sm mb-2">Locale</label>
                        <LocaleSelect
                          value={locale} 
                          onChange={setLocale} 
                          buttonClassName="w-full bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:border-slate-900 dark:focus:border-white hover:border-slate-700"
                        />
                      </div>
                    </div>
                    <button type="submit" className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-95 transition-all shadow-sm font-semibold py-2 px-6 rounded-lg transition-colors">
                      Save Profile
                    </button>
                  </form>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-10">
                    {/* Password Change Form */}
                    <form onSubmit={handleSaveSecurity} className="space-y-6">
                      <h3 className="text-lg font-medium text-slate-900 dark:text-white">Change Password</h3>
                      <div>
                        <label className="block text-slate-500 dark:text-slate-400 text-sm mb-2">Current Password</label>
                        <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-slate-900 dark:focus:border-white" />
                      </div>
                      <div>
                        <label className="block text-slate-500 dark:text-slate-400 text-sm mb-2">New Password</label>
                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-slate-900 dark:focus:border-white" />
                      </div>
                      <button type="submit" className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-95 transition-all shadow-sm font-semibold py-2 px-6 rounded-lg transition-colors">
                        Update Password
                      </button>
                    </form>

                    <hr className="border-slate-200 dark:border-slate-800" />



                    {/* Danger Zone - Premium UI */}
                    <div className="relative overflow-hidden border border-red-200 dark:border-red-900/50 bg-gradient-to-br from-red-50 to-white dark:from-red-950/20 dark:to-[#0a0a0a] rounded-2xl p-8 shadow-sm">
                      {/* Subtle red glow in the corner */}
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/10 blur-3xl rounded-full pointer-events-none"></div>

                      <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                        <Trash2 size={22} className="animate-pulse" /> Danger Zone
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-xl">
                        Permanently delete your account and all of your financial data. This action is <strong className="font-semibold text-slate-900 dark:text-white">irreversible</strong> and cannot be undone.
                      </p>
                      
                      <form onSubmit={handleDeleteAccount} className="space-y-5 relative z-10">
                        <div>
                          <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">Confirm Current Password to Delete</label>
                          <input 
                            type="password" 
                            value={deletePassword} 
                            onChange={e => setDeletePassword(e.target.value)} 
                            className="w-full max-w-md bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all shadow-sm" 
                            placeholder="Enter your password..." 
                          />
                        </div>
                        <button 
                          type="submit" 
                          className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold py-2.5 px-8 rounded-xl shadow-lg shadow-red-500/25 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          Delete Account
                        </button>
                      </form>
                    </div>

                  </div>
                )}

                {activeTab === 'data' && (
                  <div className="space-y-10">
                    <div>
                      <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Export Data</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Download a complete CSV archive of all your transactions.</p>
                      <button onClick={handleDownloadExport} className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-900 dark:text-white font-semibold py-2 px-6 rounded-lg transition-colors border border-slate-700">
                        Download CSV Export
                      </button>
                    </div>

                    <hr className="border-slate-200 dark:border-slate-800" />

                    <div>
                      <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Import Data</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Upload a CSV file from another service or your bank.</p>
                      
                      {!previewData ? (
                        <form onSubmit={handlePreview} className="space-y-4">
                          <div className="flex items-center gap-4">
                            <input type="file" accept=".csv" onChange={e => setImportFile(e.target.files?.[0] || null)} className="text-slate-600 dark:text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-200 dark:file:bg-slate-800 file:text-slate-900 dark:file:text-white hover:file:bg-slate-300 dark:hover:file:bg-slate-700 cursor-pointer transition-colors" />
                          </div>
                          <button type="submit" disabled={!importFile} className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-95 transition-all shadow-sm disabled:opacity-50 font-semibold py-2 px-6 rounded-lg transition-colors">
                            Preview Import
                          </button>
                        </form>
                      ) : (
                        <div className="space-y-4">
                          <div className="bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                            <h4 className="text-slate-900 dark:text-white font-medium mb-3">Previewing first 3 rows:</h4>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                                <thead>
                                  <tr className="border-b border-slate-200 dark:border-slate-800">
                                    <th className="pb-2">Date</th>
                                    <th className="pb-2">Category</th>
                                    <th className="pb-2">Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {previewData.map((row, i) => (
                                    <tr key={i} className="border-b border-slate-200 dark:border-slate-800/50">
                                      <td className="py-2">{row.date}</td>
                                      <td className="py-2">{row.category}</td>
                                      <td className="py-2">${row.amount.toFixed(2)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <button onClick={handleImport} className="bg-green-600 hover:bg-green-700 text-slate-900 dark:text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                              Confirm & Import
                            </button>
                            <button onClick={() => setPreviewData(null)} className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-900 dark:text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Theme Preferences</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <button onClick={() => setTheme('light')} className={`p-4 border rounded-xl flex flex-col items-center gap-3 transition-colors ${theme === 'light' ? 'border-black dark:border-white bg-zinc-100 dark:bg-zinc-800' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}>
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                          <Monitor size={24} className="text-slate-600" />
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">Light Mode</span>
                      </button>
                      
                      <button onClick={() => setTheme('dark')} className={`p-4 border rounded-xl flex flex-col items-center gap-3 transition-colors ${theme === 'dark' ? 'border-black dark:border-white bg-zinc-100 dark:bg-zinc-800' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}>
                        <div className="w-12 h-12 glass-panel rounded-full flex items-center justify-center">
                          <Monitor size={24} className="text-slate-500 dark:text-slate-400" />
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">Dark Mode</span>
                      </button>
                      
                      <button onClick={() => setTheme('system')} className={`p-4 border rounded-xl flex flex-col items-center gap-3 transition-colors ${theme === 'system' ? 'border-black dark:border-white bg-zinc-100 dark:bg-zinc-800' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}>
                        <div className="w-12 h-12 bg-gradient-to-tr from-slate-100 to-slate-900 rounded-full flex items-center justify-center">
                          <Smartphone size={24} className="text-slate-500" />
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">System Default</span>
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <form onSubmit={handleSaveNotifications} className="space-y-6">
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Notification Preferences</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800/50">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">Budget Alerts</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Get notified when you exceed 90% of a budget.</p>
                        </div>
                        <button type="button" onClick={() => setBudgetAlerts(!budgetAlerts)} className={`w-12 h-6 rounded-full transition-colors relative ${budgetAlerts ? 'bg-slate-900 dark:bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                          <div className={`w-4 h-4 bg-white dark:bg-white rounded-full absolute top-1 transition-transform ${budgetAlerts ? 'translate-x-7' : 'translate-x-1'}`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800/50">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">Weekly Summary</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Receive a weekly email summarizing your expenses.</p>
                        </div>
                        <button type="button" onClick={() => setWeeklySummary(!weeklySummary)} className={`w-12 h-6 rounded-full transition-colors relative ${weeklySummary ? 'bg-slate-900 dark:bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                          <div className={`w-4 h-4 bg-white dark:bg-white rounded-full absolute top-1 transition-transform ${weeklySummary ? 'translate-x-7' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    </div>
                    
                    <button type="submit" className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-95 transition-all shadow-sm font-semibold py-2 px-6 rounded-lg transition-colors">
                      Save Preferences
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
