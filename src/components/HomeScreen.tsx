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
  Maximize2, 
  Ruler, 
  Thermometer, 
  Droplets, 
  Scale, 
  HardDrive, 
  Gauge, 
  Clock, 
  ArrowRight, 
  Search, 
  Sparkles, 
  Receipt,
  HeartPulse,
  Calendar,
  Binary
} from 'lucide-react';

interface HomeScreenProps {
  onSelectCalculator: (id: CalculatorId) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectCalculator }) => {
  const [activeGroup, setActiveGroup] = useState<MainCategoryGroup>('All');
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredCalculators = CALCULATORS_META.filter((calc) => {
    // Group filter
    if (activeGroup === 'Finance' && calc.group !== 'Finance') return false;
    if (activeGroup === 'Unit Converters' && calc.group !== 'Unit Converters') return false;
    if (activeGroup === 'Upcoming' && calc.group !== 'Upcoming') return false;

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
  const upcomingCount = CALCULATORS_META.filter((c) => c.group === 'Upcoming').length;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-brand-900 via-slate-900 to-slate-950 p-6 sm:p-10 text-white overflow-hidden shadow-xl border border-brand-800/40">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Universal Calculation & Unit Conversion Suite</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Financial Calculators & Powerful Unit Converters
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Everything in one place: calculate loan EMIs, bank deposits, mutual fund wealth, and convert between Area, Length, Temperature, Volume, Mass, Data, Speed, and Time.
          </p>

          {/* Quick Search on Hero */}
          <div className="pt-2">
            <div className="relative max-w-xl">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search any calculator or unit (e.g., 'EMI', 'Acre to Sq Ft', 'FD', 'Celsius', 'MB to GB')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 dark:bg-slate-800/80 backdrop-blur-md border border-white/20 dark:border-slate-700 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveGroup('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeGroup === 'All'
                ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Calculators ({CALCULATORS_META.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveGroup('Finance')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeGroup === 'Finance'
                ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            💰 Finance ({financeCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveGroup('Unit Converters')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeGroup === 'Unit Converters'
                ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            📐 Unit Converters ({unitCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveGroup('Upcoming')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeGroup === 'Upcoming'
                ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🚀 Future Tools ({upcomingCount})
          </button>
        </div>

        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Showing {filteredCalculators.length} calculators
        </span>
      </div>

      {/* Main Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCalculators.map((calc, idx) => {
          const isUpcoming = calc.isUpcoming;

          return (
            <div
              key={`${calc.id}-${idx}`}
              onClick={() => {
                if (!isUpcoming) {
                  onSelectCalculator(calc.id);
                }
              }}
              className={`flex flex-col justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                isUpcoming
                  ? 'bg-slate-50/60 dark:bg-slate-900/60 border-dashed border-slate-300 dark:border-slate-800 opacity-80 cursor-default'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-brand-500 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer group'
              }`}
            >
              <div>
                {/* Header Icon & Badges */}
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                      isUpcoming
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        : 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 group-hover:scale-110 shadow-sm'
                    }`}
                  >
                    {getIcon(calc.icon)}
                  </div>

                  {calc.badge && (
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        isUpcoming
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                          : calc.group === 'Unit Converters'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border-brand-200 dark:border-brand-800'
                      }`}
                    >
                      {calc.badge}
                    </span>
                  )}
                </div>

                {/* Name */}
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {calc.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed line-clamp-2">
                  {calc.description}
                </p>
              </div>

              {/* Bottom URL Link */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                {isUpcoming ? (
                  <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                    In Development
                  </span>
                ) : (
                  <>
                    <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 font-semibold">
                      #{'/'}{calc.id}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400 group-hover:translate-x-0.5 transition-transform">
                      <span>Open</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
