import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import client from '../api/client';
import { Bot, User, Send } from 'lucide-react';

export default function ChatbotPage() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: 'ai', content: 'Hello! I am your AI Wealth Coach. How can I help you analyze your finances today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await client.post('/chat', { message: userMsg });
      setMessages(prev => [...prev, { role: 'ai', content: res.data.reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I am having trouble connecting right now.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col h-screen">
        <Header />
        <main className="flex-1 p-8 flex flex-col overflow-hidden">
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg, i) => (
                <div key={i} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`p-3 rounded-full ${msg.role === 'user' ? 'bg-indigo-600 hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all' : 'bg-purple-900/50 text-purple-400'}`}>
                    {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                  </div>
                  <div className={`p-4 max-w-[70%] rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}>
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-purple-900/50 text-purple-400">
                    <Bot size={20} />
                  </div>
                  <div className="p-4 bg-slate-800 text-slate-400 rounded-2xl rounded-tl-none">
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800">
              <form onSubmit={sendMessage} className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask a question about your finances..." 
                  className="w-full bg-slate-900 border border-slate-800 rounded-full px-6 py-4 text-white outline-none focus:border-indigo-500 pr-16"
                  disabled={loading}
                />
                <button type="submit" disabled={loading} className="absolute right-2 top-2 p-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-95 transition-all shadow-sm font-medium text-white rounded-full transition-colors disabled:opacity-50">
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
