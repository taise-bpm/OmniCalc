import React, { useState, useEffect } from 'react';
import { CalculatorId, MainCategoryGroup } from '../types';
import { CALCULATORS_META } from '../data/calculatorsMeta';
import { 
  Calculator, 
  Landmark, 
  PiggyBank, 
  TrendingUp, 
  LineChart, 
  ShieldCheck, 
  Percent, 
  Maximize2, 
  Ruler, 
  Thermometer, 
  Droplets, 
  Scale, 
  HardDrive, 
  Gauge, 
  Clock, 
  Receipt, 
  HeartPulse, 
  Calendar, 
  Binary,
  X,
  Search,
  ExternalLink
} from 'lucide-react';

interface AllToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentId: CalculatorId;
  onSelect: (id: CalculatorId) => void;
}

export const AllToolsModal: React.FC<AllToolsModalProps> = ({
  isOpen,
  onClose,
  currentId,
  onSelect,
}) => {
  const [activeTab, setActiveTab] = useState<MainCategoryGroup>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setSearchQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

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

  const filtered = CALCULATORS_META.filter((calc) => {
    // Category tab filter
    if (activeTab === 'Finance' && calc.group !== 'Finance') return false;
    if (activeTab === 'Unit Converters' && calc.group !== 'Unit Converters') return false;
    if (activeTab === 'Upcoming' && calc.group !== 'Upcoming') return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = calc.name.toLowerCase().includes(q);
      const matchDesc = calc.description.toLowerCase().includes(q);
      const matchKeywords = calc.keywords.some((k) => k.toLowerCase().includes(q));
      return matchName || matchDesc || matchKeywords;
    }

    return true;
  });

  const financeCount = CALCULATORS_META.filter((c) => c.group === 'Finance').length;
  const unitCount = CALCULATORS_META.filter((c) => c.group === 'Unit Converters').length;
  const utilityCount = CALCULATORS_META.filter((c) => c.group === 'Upcoming').length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[88vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              All Calculators & Converters
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Pick any tool to jump straight to its calculation page
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition-colors"
            title="Close popup (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar: Search + Category Tabs */}
        <div className="px-4 py-3 bg-slate-50/80 dark:bg-slate-850 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('All')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'All'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({CALCULATORS_META.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('Finance')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'Finance'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Finance ({financeCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('Unit Converters')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'Unit Converters'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Unit Converters ({unitCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('Upcoming')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'Upcoming'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Utility & Health ({utilityCount})
            </button>
          </div>

          {/* Quick Filter Input */}
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Scrollable Tools Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No calculators found matching "{searchQuery}"
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filtered.map((calc, idx) => {
                const isActive = calc.id === currentId && !calc.isUpcoming;
                const isUpcoming = calc.isUpcoming;

                return (
                  <button
                    key={`${calc.id}-${idx}`}
                    type="button"
                    onClick={() => {
                      if (!isUpcoming) {
                        onSelect(calc.id);
                        onClose();
                      }
                    }}
                    disabled={isUpcoming}
                    className={`flex flex-col text-left p-3.5 rounded-2xl border transition-all group ${
                      isUpcoming
                        ? 'bg-slate-50/50 dark:bg-slate-800/40 border-dashed border-slate-300 dark:border-slate-700/60 opacity-70 cursor-default'
                        : isActive
                        ? 'bg-brand-50/90 dark:bg-brand-950/60 border-brand-500 shadow-md ring-1 ring-brand-500/30 cursor-pointer'
                        : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-brand-500 hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-750 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-start justify-between w-full mb-2">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                          !isUpcoming && 'group-hover:scale-105'
                        } ${
                          isUpcoming
                            ? 'bg-slate-200/60 dark:bg-slate-700 text-slate-400'
                            : isActive
                            ? 'bg-brand-500 text-white shadow-sm'
                            : 'bg-brand-50 dark:bg-slate-700 text-brand-600 dark:text-slate-200'
                        }`}
                      >
                        {getIcon(calc.icon)}
                      </div>

                      {calc.badge && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            isUpcoming
                              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200'
                              : isActive
                              ? 'bg-brand-100 dark:bg-brand-900 text-brand-800 dark:text-brand-200 border-brand-200 dark:border-brand-700'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600'
                          }`}
                        >
                          {calc.badge}
                        </span>
                      )}
                    </div>

                    <div className={`font-bold text-sm transition-colors ${
                      isUpcoming
                        ? 'text-slate-700 dark:text-slate-300'
                        : isActive 
                        ? 'text-brand-900 dark:text-brand-200' 
                        : 'text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400'
                    }`}>
                      {calc.name}
                    </div>

                    <p className={`text-xs mt-1 mb-2.5 leading-relaxed line-clamp-2 ${
                      isUpcoming
                        ? 'text-slate-400 dark:text-slate-500'
                        : isActive 
                        ? 'text-brand-800/90 dark:text-slate-300' 
                        : 'text-slate-600 dark:text-slate-300'
                    }`}>
                      {calc.description}
                    </p>

                    <div className="mt-auto pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-mono">
                      <span className={`${
                        isUpcoming ? 'text-amber-600 font-sans' : 'text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 font-semibold'
                      }`}>
                        {isUpcoming ? 'Coming Soon' : `#/${calc.id}`}
                      </span>
                      {!isUpcoming && (
                        <ExternalLink className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Bottom Status */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Click any card to navigate immediately</span>
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 font-mono text-[10px]">ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  );
};

