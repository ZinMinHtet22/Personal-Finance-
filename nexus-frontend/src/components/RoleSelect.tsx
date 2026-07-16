import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface RoleSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RoleSelect({ value, onChange }: RoleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const roles = [
    { value: 'normal', label: 'Normal' },
    { value: 'business_owner', label: 'Business Owner' }
  ];

  const selectedRole = roles.find(r => r.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        className="w-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedRole?.label}</span>
        <ChevronDown size={18} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-1 flex flex-col">
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                className={`w-full text-left px-4 py-2.5 transition-all duration-200 ${
                  r.value === value 
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
                }`}
                onClick={() => {
                  onChange(r.value);
                  setIsOpen(false);
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
