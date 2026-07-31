import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { adminUsers, toggleUserStatus } from '../api/client';
import type { AdminUser } from '../api/client';
import { Shield, ShieldAlert } from 'lucide-react';

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const currentUser = JSON.parse(localStorage.getItem('nexus_user') || '{}');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminUsers();
      setUsers(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      const response = await toggleUserStatus(id);
      setUsers(users.map(u => u.id === id ? { ...u, account_status: response.user.account_status } : u));
    } catch (err: any) {
      alert(err.message || 'Failed to toggle status');
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex transition-colors duration-300">
      <Sidebar />
      
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        <Header />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg">
                <Shield size={24} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Admin Dashboard</h2>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 flex items-start gap-3">
              <ShieldAlert className="mt-0.5" size={20} />
              <p>{error}</p>
            </div>
          )}

          <div className="bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#151515] border-b border-slate-200 dark:border-slate-800/60 text-slate-500 dark:text-slate-400 text-sm font-medium">
                    <th className="p-4 pl-6">User ID</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Join Date</th>
                    <th className="p-4">Last Login</th>
                    <th className="p-4 text-center">Txns</th>
                    <th className="p-4 text-center">AI Interactions</th>
                    <th className="p-4 text-center">Role</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-900 dark:text-slate-200">
                  {loading ? (
                    <tr>
                      <td colSpan={10} className="p-8 text-center text-slate-500">Loading users...</td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-8 text-center text-slate-500">No users found.</td>
                    </tr>
                  ) : (
                    users.map(user => (
                      <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-[#151515] transition-colors">
                        <td className="p-4 pl-6 font-mono text-xs text-slate-500">#{user.id}</td>
                        <td className="p-4 font-medium whitespace-nowrap">{user.name}</td>
                        <td className="p-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">{user.email}</td>
                        <td className="p-4 text-sm whitespace-nowrap">{new Date(user.created_at).toLocaleString()}</td>
                        <td className="p-4 text-sm whitespace-nowrap">{user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'Never'}</td>
                        <td className="p-4 text-center font-mono">{user.transactions_count}</td>
                        <td className="p-4 text-center font-mono">{user.ai_interactions_count}</td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                              : user.role === 'business_owner'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                            {user.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.account_status === 'active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {user.account_status === 'active' ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            disabled={user.id === currentUser.id}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                              user.id === currentUser.id
                                ? 'opacity-50 cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                                : user.account_status === 'active'
                                  ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400'
                                  : 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40 dark:text-green-400'
                            }`}
                          >
                            {user.account_status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
