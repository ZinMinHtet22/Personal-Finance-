import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const currencies = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'JPY', label: 'JPY (¥)' },
  { value: 'CAD', label: 'CAD ($)' },
  { value: 'AUD', label: 'AUD ($)' },
  { value: 'CHF', label: 'CHF (Fr)' },
  { value: 'CNY', label: 'CNY (¥)' },
  { value: 'INR', label: 'INR (₹)' },
  { value: 'SGD', label: 'SGD ($)' },
  { value: 'NZD', label: 'NZD ($)' },
  { value: 'ZAR', label: 'ZAR (R)' },
  { value: 'BRL', label: 'BRL (R$)' },
  { value: 'MXN', label: 'MXN ($)' },
];

export default function CurrencySelect({ 
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

  const selected = currencies.find(c => c.value === value) || currencies[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between outline-none transition-colors ${buttonClassName}`}
      >
        <span>{selected.label}</span>
        <ChevronDown size={16} className={`ml-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[120px] z-50 bg-slate-100 dark:bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {currencies.map(c => (
            <button
              key={c.value}
              type="button"
              className={`w-full text-left px-4 py-2 hover:bg-slate-700 transition-colors ${c.value === value ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-700 dark:text-slate-200'}`}
              onClick={() => {
                onChange(c.value);
                setIsOpen(false);
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
