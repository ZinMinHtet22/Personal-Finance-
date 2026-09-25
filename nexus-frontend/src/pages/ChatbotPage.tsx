import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import client from '../api/client';
import { Bot, User, Send } from 'lucide-react';

export default function ChatbotPage() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: 'ai', content: 'Hello! I am your Nexus Wealth Coach. How can I help you analyze your finances today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestions = [
    "How can I reduce my monthly expenses?",
    "Analyze my recent subscriptions",
    "What is my largest spending category?"
  ];

  const sendMessage = async (e?: React.FormEvent, suggestionText?: string) => {
    if (e) e.preventDefault();
    
    const textToSubmit = suggestionText || input;
    if (!textToSubmit.trim()) return;

    const userMsg = textToSubmit.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await client.post('/chat', { message: userMsg });
      setMessages(prev => [...prev, { role: 'ai', content: res.data.reply }]);
    } catch (e: any) {
      const errorMsg = e.response?.data?.reply || 'Sorry, I am having trouble connecting right now.';
      setMessages(prev => [...prev, { role: 'ai', content: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col h-screen relative">
        <Header />
        <main className="flex-1 p-8 flex flex-col overflow-hidden relative">
          <div className="flex-1 bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-sm">
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg, i) => (
                <div key={i} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`p-3 rounded-full flex-shrink-0 border shadow-sm ${msg.role === 'user' ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-transparent shadow-indigo-500/20' : 'bg-zinc-50 dark:bg-[#151515] text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800'}`}>
                    {msg.role === 'user' ? <User size={18} strokeWidth={2.5} /> : <Bot size={18} strokeWidth={2.5} />}
                  </div>
                  <div className={`p-4 max-w-[75%] rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] dark:shadow-none font-light text-[15px] tracking-wide ${msg.role === 'user' ? 'bg-black dark:bg-white text-white dark:text-black rounded-tr-none border border-transparent' : 'bg-white dark:bg-[#111111] text-zinc-800 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-800/60 rounded-tl-none'}`}>
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full flex-shrink-0 bg-zinc-50 dark:bg-[#151515] text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <Bot size={18} strokeWidth={2.5} />
                  </div>
                  <div className="p-4 bg-white dark:bg-[#111111] border border-zinc-200/60 dark:border-zinc-800/60 text-zinc-500 dark:text-zinc-400 rounded-2xl rounded-tl-none shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] dark:shadow-none font-light text-[15px] tracking-wide">
                    <div className="flex space-x-1 items-center h-5">
                      <div className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce" style={{animationDelay: '0.15s'}}></div>
                      <div className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-[#0a0a0a] border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
              {messages.length === 1 && (
                <div className="flex flex-wrap justify-center gap-2 px-2">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInput(suggestion);
                        sendMessage(undefined, suggestion);
                      }}
                      className="group flex items-center justify-center gap-2 text-[13px] font-medium px-4 py-2 rounded-full bg-gradient-to-b from-white to-slate-50 dark:from-[#151515] dark:to-[#0f0f0f] border border-slate-200/80 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-300 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-[0_4px_12px_rgba(99,102,241,0.1)] dark:hover:shadow-[0_4px_15px_rgba(99,102,241,0.15)] transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
              <form onSubmit={sendMessage} className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask a question about your finances..." 
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-6 py-4 text-slate-900 dark:text-white placeholder:text-slate-600 dark:placeholder:text-slate-200 outline-none focus:border-slate-400 dark:focus:border-slate-600 pr-16 shadow-sm font-medium"
                  disabled={loading}
                />
                <button type="submit" disabled={loading || !input.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-95 transition-all shadow-sm font-medium rounded-full disabled:bg-slate-300 disabled:text-slate-700 dark:disabled:bg-slate-400 dark:disabled:text-slate-900 disabled:cursor-not-allowed">
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
