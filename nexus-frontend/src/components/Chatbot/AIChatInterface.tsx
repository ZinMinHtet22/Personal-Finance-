import { useState } from 'react';
import { Bot, User, Send, X, MessageSquare, Sparkles } from 'lucide-react';
import client from '../../api/client';

export default function AIChatInterface() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: 'ai', content: 'Hello! I am your Nexus Wealth Coach. How can I help you analyze your finances today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestions = [
    "How can I reduce my monthly expenses?",
    "Analyze my recent subscriptions"
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
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all z-50 flex items-center justify-center"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Chat Widget Panel */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 w-full h-[100dvh] sm:bottom-8 sm:right-8 sm:w-[380px] sm:h-[550px] bg-white dark:bg-slate-950 border-t sm:border border-slate-200 dark:border-slate-800 sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[60] transform transition-all duration-300 ease-in-out">
          
          {/* Header */}
          <div className="p-4 bg-slate-50 dark:bg-[#0a0a0a] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Nexus Wealth Coach</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Powered by Nexus</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-[#0a0a0a]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`p-2 rounded-full flex-shrink-0 border shadow-sm ${msg.role === 'user' ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-transparent shadow-indigo-500/20' : 'bg-zinc-50 dark:bg-[#151515] text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800'}`}>
                  {msg.role === 'user' ? <User size={16} strokeWidth={2.5} /> : <Bot size={16} strokeWidth={2.5} />}
                </div>
                <div className={`p-3 max-w-[80%] rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] dark:shadow-none font-light text-[14px] tracking-wide ${msg.role === 'user' ? 'bg-black dark:bg-white text-white dark:text-black rounded-tr-none border border-transparent' : 'bg-white dark:bg-[#111111] text-zinc-800 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-800/60 rounded-tl-none'}`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full flex-shrink-0 border shadow-sm bg-zinc-50 dark:bg-[#151515] text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800">
                  <Bot size={16} strokeWidth={2.5} />
                </div>
                <div className="p-3 bg-white dark:bg-[#111111] border border-zinc-200/60 dark:border-zinc-800/60 text-zinc-500 dark:text-zinc-400 rounded-2xl rounded-tl-none shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] dark:shadow-none font-light text-[14px] tracking-wide">
                  <div className="flex space-x-1 items-center h-4">
                    <div className="w-1 h-1 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce" style={{animationDelay: '0.15s'}}></div>
                    <div className="w-1 h-1 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
            {messages.length === 1 && (
              <div className="flex flex-col gap-2">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(suggestion);
                      sendMessage(undefined, suggestion);
                    }}
                    className="group flex items-center justify-center gap-2 text-[11px] font-medium px-3 py-2 rounded-xl bg-gradient-to-b from-white to-slate-50 dark:from-[#151515] dark:to-[#0f0f0f] border border-slate-200/80 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-300 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-[0_4px_12px_rgba(99,102,241,0.1)] dark:hover:shadow-[0_4px_15px_rgba(99,102,241,0.15)] transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer text-center w-full"
                  >
                    <span>{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
            <form onSubmit={sendMessage} className="relative">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask your AI coach..." 
                className="w-full bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-600 dark:placeholder:text-slate-200 text-sm outline-none focus:border-slate-400 dark:focus:border-slate-600 pr-12 transition-colors font-medium"
                disabled={loading}
              />
              <button 
                type="submit" 
                disabled={loading || !input.trim()} 
                className="absolute right-2 top-2 p-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105 active:scale-95 transition-all shadow-sm rounded-lg disabled:bg-slate-300 disabled:text-slate-700 dark:disabled:bg-slate-400 dark:disabled:text-slate-900 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
}
