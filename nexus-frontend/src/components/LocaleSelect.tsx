import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const locales = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ru', label: 'Russian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ar', label: 'Arabic' },
  { value: 'hi', label: 'Hindi' },
  { value: 'it', label: 'Italian' },
  { value: 'ko', label: 'Korean' },
  { value: 'nl', label: 'Dutch' },
];

export default function LocaleSelect({ 
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

  const selected = locales.find(c => c.value === value) || locales[0];

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
          {locales.map(c => (
            <button
              key={c.value}
              type="button"
              className={`w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${c.value === value ? 'bg-slate-200 dark:bg-slate-700 font-medium text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'}`}
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
