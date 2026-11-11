import React, { useState } from 'react';
import { CalculatorId, CurrencyCode } from '../types';
import { CALCULATORS_META } from '../data/calculatorsMeta';
import { CURRENCIES } from '../utils/formatters';
import { 
  Calculator, 
  Search, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Copy, 
  Check, 
  Grid,
  ChevronDown,
  Home
} from 'lucide-react';

interface NavbarProps {
  currentCalculatorId: CalculatorId;
  onSelectCalculator: (id: CalculatorId) => void;
  currency: CurrencyCode;
  onSelectCurrency: (currency: CurrencyCode) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSearch: () => void;
  onTogglePicker: () => void;
  isPickerOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCalculatorId,
  onSelectCalculator,
  currency,
  onSelectCurrency,
  darkMode,
  onToggleDarkMode,
  onOpenSearch,
  onTogglePicker,
  isPickerOpen,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const copyCurrentUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onSelectCalculator('home')}
              className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-lg sm:text-xl tracking-tight group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 text-white flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Calculator className="w-5 h-5" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-extrabold text-slate-900 dark:text-white">OmniCalc</span>
                <span className="text-[10px] text-brand-600 dark:text-brand-400 font-bold uppercase tracking-wider">
                  Suite & Converters
                </span>
              </div>
            </button>

            {/* Direct URL Badge / Pill */}
            <div className="hidden lg:flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>url: #/{currentCalculatorId}</span>
              <button
                type="button"
                onClick={copyCurrentUrl}
                title="Copy current URL"
                className="ml-1 p-0.5 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                {copiedUrl ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Center Navigation: Quick switcher tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => onSelectCalculator('home')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentCalculatorId === 'home'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home Hub</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectCalculator('emi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentCalculatorId === 'emi'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Loan EMI
            </button>

            <button
              type="button"
              onClick={() => onSelectCalculator('fd')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentCalculatorId === 'fd'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              FD Deposit
            </button>

            <button
              type="button"
              onClick={() => onSelectCalculator('unit-area')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentCalculatorId === 'unit-area'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Area Converter
            </button>

            <button
              type="button"
              onClick={() => onSelectCalculator('unit-length')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentCalculatorId === 'unit-length'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Length
            </button>

            <button
              type="button"
              onClick={() => onSelectCalculator('unit-temperature')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentCalculatorId === 'unit-temperature'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Temp
            </button>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Pick Calculator Button */}
            <button
              type="button"
              onClick={onTogglePicker}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                isPickerOpen
                  ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 border-brand-500'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-transparent'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">All Calculators</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isPickerOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Quick Search (Ctrl+K) */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
              title="Search all calculators & unit converters (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span className="hidden xl:inline">Search</span>
              <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 text-[10px] font-mono shadow-xs text-slate-500 dark:text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Currency Selector */}
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => onSelectCurrency(e.target.value as CurrencyCode)}
                className="appearance-none bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold py-1.5 pl-3 pr-7 rounded-xl cursor-pointer border-none focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {Object.values(CURRENCIES).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.code}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800 animate-fade-in space-y-4">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                💰 Financial Calculators
              </div>
              <div className="grid grid-cols-2 gap-2">
                {CALCULATORS_META.filter((c) => c.group === 'Finance').map((calc) => (
                  <button
                    key={calc.id}
                    type="button"
                    onClick={() => {
                      onSelectCalculator(calc.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`p-2 rounded-xl text-left text-xs font-semibold border transition-all ${
                      calc.id === currentCalculatorId
                        ? 'bg-brand-50/90 dark:bg-brand-950/80 border-brand-500 text-brand-700 dark:text-brand-300 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div>{calc.name}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">#{'/'}{calc.id}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                📐 Unit Converters
              </div>
              <div className="grid grid-cols-2 gap-2">
                {CALCULATORS_META.filter((c) => c.group === 'Unit Converters').map((calc) => (
                  <button
                    key={calc.id}
                    type="button"
                    onClick={() => {
                      onSelectCalculator(calc.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`p-2 rounded-xl text-left text-xs font-semibold border transition-all ${
                      calc.id === currentCalculatorId
                        ? 'bg-brand-50/90 dark:bg-brand-950/80 border-brand-500 text-brand-700 dark:text-brand-300 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div>{calc.shortName}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">#{'/'}{calc.id}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
