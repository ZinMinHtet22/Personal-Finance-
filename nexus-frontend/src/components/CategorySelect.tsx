import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const categories = [
  'Groceries',
  'Entertainment',
  'Transport',
  'Housing',
  'Utilities',
  'Dining',
  'Shopping',
  'Healthcare',
  'Education',
  'Personal',
  'Travel',
  'Other'
];

export default function CategorySelect({ 
  value, 
  onChange, 
  buttonClassName = '' 
}: { 
  value: string, 
  onChange: (val: string) => void, 
  buttonClassName?: string 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between outline-none transition-colors ${buttonClassName}`}
      >
        <span>{value || 'Select Category'}</span>
        <ChevronDown size={16} className={`ml-3 text-slate-500 dark:text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[150px] z-[60] bg-slate-100 dark:bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {categories.map(c => (
            <button
              key={c}
              type="button"
              className={`w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${c === value ? 'bg-slate-200 dark:bg-slate-700 font-medium text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'}`}
              onClick={() => {
                onChange(c);
                setIsOpen(false);
              }}
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
