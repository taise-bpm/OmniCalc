import React, { useState, useEffect, useRef } from 'react';
import { CalculatorId } from '../types';
import { CALCULATORS_META } from '../data/calculatorsMeta';
import { 
  Search, 
  X, 
  Calculator, 
  ArrowRight,
  Maximize2,
  Ruler,
  Thermometer,
  Droplets,
  Scale,
  HardDrive,
  Gauge,
  Clock,
  Landmark,
  PiggyBank,
  TrendingUp,
  LineChart,
  ShieldCheck,
  Percent,
  Receipt,
  HeartPulse,
  Calendar,
  Binary
} from 'lucide-react';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCalculator: (id: CalculatorId) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCalculator,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator':
        return <Calculator className="w-5 h-5" />;
      case 'Landmark':
        return <Landmark className="w-5 h-5" />;
      case 'PiggyBank':
        return <PiggyBank className="w-5 h-5" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5" />;
      case 'LineChart':
        return <LineChart className="w-5 h-5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5" />;
      case 'Percent':
        return <Percent className="w-5 h-5" />;
      case 'Maximize2':
        return <Maximize2 className="w-5 h-5" />;
      case 'Ruler':
        return <Ruler className="w-5 h-5" />;
      case 'Thermometer':
        return <Thermometer className="w-5 h-5" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5" />;
      case 'Scale':
        return <Scale className="w-5 h-5" />;
      case 'HardDrive':
        return <HardDrive className="w-5 h-5" />;
      case 'Gauge':
        return <Gauge className="w-5 h-5" />;
      case 'Clock':
        return <Clock className="w-5 h-5" />;
      case 'Receipt':
        return <Receipt className="w-5 h-5" />;
      case 'HeartPulse':
        return <HeartPulse className="w-5 h-5" />;
      case 'Calendar':
        return <Calendar className="w-5 h-5" />;
      case 'Binary':
        return <Binary className="w-5 h-5" />;
      default:
        return <Calculator className="w-5 h-5" />;
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = CALCULATORS_META.filter((calc) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      calc.name.toLowerCase().includes(q) ||
      calc.shortName.toLowerCase().includes(q) ||
      calc.description.toLowerCase().includes(q) ||
      calc.group.toLowerCase().includes(q) ||
      calc.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input bar */}
        <div className="relative flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search all calculators & unit converters (e.g., 'EMI', 'Acre', 'Celsius', 'SIP', 'Speed')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results list */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
              No calculators or unit converters found matching "{query}"
            </div>
          ) : (
            filtered.map((calc, idx) => {
              const isUpcoming = calc.isUpcoming;
              return (
                <button
                  key={`${calc.id}-${idx}`}
                  type="button"
                  disabled={isUpcoming}
                  onClick={() => {
                    if (!isUpcoming) {
                      onSelectCalculator(calc.id);
                      onClose();
                    }
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors group ${
                    isUpcoming
                      ? 'opacity-60 cursor-default'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm shrink-0 group-hover:scale-105 transition-transform">
                      {getIcon(calc.icon)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {calc.name}
                        </span>
                        {calc.badge && (
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            isUpcoming
                              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}>
                            {calc.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5">
                        {calc.description}
                      </p>
                    </div>
                  </div>

                  {!isUpcoming && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Open</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Navigate to any calculator or converter</span>
          <div className="flex items-center gap-2">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-[10px] font-mono">ESC</kbd> to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
