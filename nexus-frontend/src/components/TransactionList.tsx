interface Transaction {
  id: number;
  amount: string;
  category: string;
  is_subscription: boolean;
  renewal_date: string | null;
  created_at: string;
}

interface TransactionListProps {
  transactions?: Transaction[];
}

// Temporary mock data for UI visualization if none provided
const MOCK_DATA: Transaction[] = [
  { id: 1, amount: '12.99', category: 'Entertainment', is_subscription: true, renewal_date: '2026-08-01', created_at: '2026-07-01T10:00:00Z' },
  { id: 2, amount: '45.50', category: 'Groceries', is_subscription: false, renewal_date: null, created_at: '2026-07-02T14:30:00Z' },
  { id: 3, amount: '120.00', category: 'Utilities', is_subscription: true, renewal_date: '2026-07-15', created_at: '2026-06-15T09:00:00Z' },
];

export default function TransactionList({ transactions = MOCK_DATA }: TransactionListProps) {
  return (
    <div className="glass-panel flex flex-col h-[400px]">
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Recent Transactions</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider z-10 border-b border-slate-200/50 dark:border-slate-800/50">
            <tr>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Type</th>
              <th className="px-6 py-4 font-semibold text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <span className="text-slate-900 dark:text-slate-200 font-semibold group-hover:text-black dark:group-hover:text-white transition-colors">{tx.category}</span>
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm font-medium">
                  {new Date(tx.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-6 py-4">
                  {tx.is_subscription ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 border border-transparent">
                      Subscription
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      One-time
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-slate-900 dark:text-slate-200 font-bold">${parseFloat(tx.amount).toFixed(2)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
