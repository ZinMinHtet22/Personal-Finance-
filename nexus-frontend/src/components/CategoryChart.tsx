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
  const chartData = data.map(d => ({ name: d.category, value: parseFloat(d.total) }));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-[400px]">
      <h3 className="text-lg font-semibold text-slate-200 mb-4">Expenses by Category</h3>
      {chartData.length > 0 ? (
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
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
              itemStyle={{ color: '#f8fafc' }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center text-slate-500">
          No data available
        </div>
      )}
    </div>
  );
}
