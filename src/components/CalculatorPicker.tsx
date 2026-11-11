import React, { useState } from 'react';
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
  ExternalLink,
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
  Binary
} from 'lucide-react';

interface CalculatorPickerProps {
  currentId: CalculatorId;
  onSelect: (id: CalculatorId) => void;
}

export const CalculatorPicker: React.FC<CalculatorPickerProps> = ({
  currentId,
  onSelect,
}) => {
  const [activeTab, setActiveTab] = useState<MainCategoryGroup>('All');

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
    if (activeTab === 'Finance') return calc.group === 'Finance';
    if (activeTab === 'Unit Converters') return calc.group === 'Unit Converters';
    if (activeTab === 'Upcoming') return calc.group === 'Upcoming';
    return true;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Title & Group Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
            All Calculators & Unit Converters
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Click any tool below to navigate directly to its URL
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          {(['All', 'Finance', 'Unit Converters', 'Upcoming'] as MainCategoryGroup[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === tab
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab === 'All' ? 'All (19)' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of calculators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
                }
              }}
              disabled={isUpcoming}
              className={`relative flex flex-col text-left p-3.5 rounded-xl border transition-all duration-200 group focus:outline-none ${
                isUpcoming
                  ? 'bg-slate-50/50 dark:bg-slate-800/40 border-dashed border-slate-300 dark:border-slate-700/60 opacity-75 cursor-default'
                  : isActive
                  ? 'bg-brand-50/80 dark:bg-brand-950/60 border-brand-500 dark:border-brand-500 shadow-md ring-1 ring-brand-500/30 cursor-pointer'
                  : 'bg-slate-50/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm cursor-pointer'
              }`}
            >
              <div className="flex items-start justify-between w-full mb-2">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform ${
                    !isUpcoming && 'group-hover:scale-105'
                  } ${
                    isUpcoming
                      ? 'bg-slate-200/60 dark:bg-slate-700 text-slate-400'
                      : isActive
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-600/50'
                  }`}
                >
                  {getIcon(calc.icon)}
                </div>

                {calc.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isUpcoming
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                        : isActive
                        ? 'bg-brand-100 dark:bg-brand-900/90 text-brand-800 dark:text-brand-200 border-brand-200 dark:border-brand-700'
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
                {calc.shortName}
              </div>

              <p className={`text-xs mt-1 mb-2.5 leading-relaxed line-clamp-2 ${
                isUpcoming
                  ? 'text-slate-500 dark:text-slate-400'
                  : isActive 
                  ? 'text-brand-800/90 dark:text-slate-300' 
                  : 'text-slate-600 dark:text-slate-300'
              }`}>
                {calc.description}
              </p>

              {/* Direct URL Badge */}
              <div className={`mt-auto pt-2 border-t flex items-center justify-between text-[11px] font-mono transition-colors ${
                isUpcoming
                  ? 'border-slate-200 dark:border-slate-700 text-amber-600 dark:text-amber-400'
                  : isActive
                  ? 'border-brand-200 dark:border-brand-900/80 text-brand-600 dark:text-brand-400 font-semibold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400'
              }`}>
                <span>{isUpcoming ? 'Coming Soon' : `#/${calc.id}`}</span>
                {!isUpcoming && (
                  <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
