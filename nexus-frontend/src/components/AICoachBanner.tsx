import { Bot } from 'lucide-react';

interface AICoachBannerProps {
  summary: string;
}

export default function AICoachBanner({ summary }: AICoachBannerProps) {
  return (
    <div className="relative bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-8 flex items-start gap-5 shadow-sm transition-all">
      <div className="relative bg-white dark:bg-slate-800 p-3.5 rounded-xl text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700 flex-shrink-0">
        <Bot size={28} />
      </div>
      
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Nexus Insight</h3>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          {summary || "Loading your personalized financial insights..."}
        </p>
      </div>
    </div>
  );
}
