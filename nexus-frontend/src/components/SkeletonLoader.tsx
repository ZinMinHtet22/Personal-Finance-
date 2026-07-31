import { motion } from 'framer-motion';

export function CardSkeleton() {
  return (
    <div className="glass-panel p-6 rounded-xl animate-pulse">
      <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
      <div className="h-10 w-1/2 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
      <div className="space-y-3">
        <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="h-2 w-4/5 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-[400px] flex flex-col animate-pulse">
      <div className="h-6 w-1/3 bg-slate-700 rounded mb-8"></div>
      <div className="flex-1 flex items-end gap-4 pb-4 px-4">
        {[40, 70, 45, 90, 65, 30, 80].map((h, i) => (
          <div key={i} className="flex-1 bg-slate-700 rounded-t-md" style={{ height: `${h}%` }}></div>
        ))}
      </div>
    </div>
  );
}

export function ListSkeleton() {
  return (
    <div className="glass-panel p-6 rounded-xl animate-pulse">
      <div className="flex justify-between mb-6">
        <div className="h-6 w-1/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            </div>
            <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-8 w-full"
    >
      <div className="flex justify-between items-center mb-8">
        <div className="h-8 w-40 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
        <div className="flex gap-4">
          <div className="h-10 w-28 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
          <div className="h-10 w-36 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
        </div>
      </div>
      
      <div className="h-20 w-full bg-indigo-50 dark:bg-indigo-900/20 rounded-xl mb-8 animate-pulse"></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <ChartSkeleton />
          <CardSkeleton />
        </div>
        <div className="lg:col-span-2">
          <ListSkeleton />
        </div>
      </div>
    </motion.div>
  );
}
