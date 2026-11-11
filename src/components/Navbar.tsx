import React, { useState } from 'react';
import { CalculatorId, CurrencyCode } from '../types';
import { CURRENCIES } from '../utils/formatters';
import { 
  Calculator, 
  Search, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Grid,
  ChevronDown,
  Coins,
  Ruler
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

  const isFinanceActive = [
    'emi',
    'fd',
    'rd',
    'cumulative',
    'sip',
    'ppf',
    'compound',
    'gst',
  ].includes(currentCalculatorId);

  const isConverterActive = currentCalculatorId.startsWith('unit-');
  const isHomeActive = currentCalculatorId === 'home';

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* 1. Brand Logo */}
          <button
            type="button"
            onClick={() => onSelectCalculator('home')}
            className="flex items-center gap-2.5 text-left group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 text-white flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Calculator className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              OmniCalc
            </span>
          </button>

          {/* 2. Simplified Center Navigation (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/80 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => onSelectCalculator('home')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isHomeActive
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => onSelectCalculator('emi')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isFinanceActive
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Finance</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectCalculator('unit-area')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isConverterActive
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Unit Converters</span>
            </button>

            <button
              type="button"
              onClick={onTogglePicker}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isPickerOpen
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>All Tools</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isPickerOpen ? 'rotate-180' : ''}`} />
            </button>
          </nav>

          {/* 3. Right Quick Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium transition-colors"
              title="Search calculators (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden lg:inline px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 text-[10px] font-mono shadow-xs text-slate-500 dark:text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Currency Selector (compact) */}
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => onSelectCurrency(e.target.value as CurrencyCode)}
                className="appearance-none bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold py-1.5 pl-2.5 pr-6 rounded-xl cursor-pointer border-none focus:outline-none focus:ring-2 focus:ring-brand-500"
                title="Select currency"
              >
                {Object.values(CURRENCIES).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.code}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1.5 text-slate-500">
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

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 dark:border-slate-800 animate-fade-in space-y-1.5">
            <button
              type="button"
              onClick={() => {
                onSelectCalculator('home');
                setMobileMenuOpen(false);
              }}
              className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                isHomeActive
                  ? 'bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Home Hub (All Tools)
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectCalculator('emi');
                setMobileMenuOpen(false);
              }}
              className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                isFinanceActive
                  ? 'bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              💰 Finance Calculators (EMI, FD, RD, SIP, PPF)
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectCalculator('unit-area');
                setMobileMenuOpen(false);
              }}
              className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                isConverterActive
                  ? 'bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              📐 Unit Converters (Area, Length, Temp, Volume, Mass)
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
