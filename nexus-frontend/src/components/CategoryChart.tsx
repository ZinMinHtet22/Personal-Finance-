import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface CategoryData {
  category: string;
  total: string;
}

interface CategoryChartProps {
  data: CategoryData[];
}

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];

export default function CategoryChart({ data }: CategoryChartProps) {
  const chartData = data
    .map(d => ({ name: d.category, value: parseFloat(d.total) }))
    .filter(d => !isNaN(d.value) && d.value > 0);

  return (
    <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl p-6 h-[400px] flex flex-col">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-200 mb-4 shrink-0">Expenses by Category</h3>
      {chartData.length > 0 ? (
        <div className="flex-1 min-h-0 w-full">
          <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
              itemStyle={{ color: '#f8fafc', fontWeight: 500 }}
              formatter={(value) => [`$${Number(value ?? 0).toLocaleString()}`, undefined]}
            />
          </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-500">
          No data available
        </div>
      )}
    </div>
  );
}
