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
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[400px]">
      <div className="p-6 border-b border-slate-800">
        <h3 className="text-lg font-semibold text-slate-200">Recent Transactions</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-slate-950 text-slate-400 text-sm">
            <tr>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-slate-200 font-medium">{tx.category}</span>
                </td>
                <td className="px-6 py-4 text-slate-400 text-sm">
                  {new Date(tx.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {tx.is_subscription ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/50 text-purple-400 border border-purple-700/50">
                      Subscription
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                      One-time
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-slate-200 font-semibold">${parseFloat(tx.amount).toFixed(2)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
