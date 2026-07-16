import { Bot } from 'lucide-react';

interface AICoachBannerProps {
  summary: string;
}

export default function AICoachBanner({ summary }: AICoachBannerProps) {
  return (
    <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-xl p-6 mb-8 flex items-start gap-4">
      <div className="bg-indigo-600/20 p-3 rounded-lg text-indigo-400">
        <Bot size={24} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-indigo-300 mb-2">AI Financial Coach Insight</h3>
        <p className="text-slate-300 leading-relaxed">
          {summary || "Loading your personalized financial insights..."}
        </p>
      </div>
    </div>
  );
}
