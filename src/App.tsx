import { useState, useEffect } from 'react';
import { CalculatorId, CurrencyCode } from './types';
import { parseHashUrl, navigateToCalculator } from './utils/urlState';
import { CALCULATORS_META } from './data/calculatorsMeta';
import { Navbar } from './components/Navbar';
import { CalculatorPicker } from './components/CalculatorPicker';
import { AllToolsModal } from './components/AllToolsModal';
import { QuickSearchModal } from './components/QuickSearchModal';
import { HomeScreen } from './components/HomeScreen';

// Financial Calculators
import { EmiCalculator } from './components/Calculators/EmiCalculator';
import { FdCalculator } from './components/Calculators/FdCalculator';
import { RdCalculator } from './components/Calculators/RdCalculator';
import { CumulativeDepositCalc } from './components/Calculators/CumulativeDepositCalc';
import { SipCalculator } from './components/Calculators/SipCalculator';
import { PpfCalculator } from './components/Calculators/PpfCalculator';
import { CompoundInterestCalc } from './components/Calculators/CompoundInterestCalc';
import { GstCalculator } from './components/Calculators/GstCalculator';
import { BmiCalculator } from './components/Calculators/BmiCalculator';
import { DateCalculator } from './components/Calculators/DateCalculator';
import { ScientificCalculator } from './components/Calculators/ScientificCalculator';

// Unit Converters
import { UnitConverter } from './components/Converters/UnitConverter';

// Icons
import { ArrowLeft } from 'lucide-react';

export function App() {
  const [routeState, setRouteState] = useState(() => parseHashUrl());
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return (
      localStorage.getItem('fincalc_dark') === 'true' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Synchronize route changes (back/forward buttons, direct url navigation, hash or clean path)
  useEffect(() => {
    const handleRouteChange = () => {
      setRouteState(parseHashUrl());
    };

    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Update HTML dark class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('fincalc_dark', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('fincalc_dark', 'false');
    }
  }, [darkMode]);

  const activeCalcMeta = CALCULATORS_META.find((c) => c.id === routeState.calculatorId);

  // Dynamic SEO: Canonical Tag, Page Title, and Description
  useEffect(() => {
    const base = 'https://omnicalc.taise.in';
    const isHome = routeState.calculatorId === 'home';
    const canonicalHref = isHome ? `${base}/` : `${base}/${routeState.calculatorId}`;

    // 1. Canonical tag
    let linkCanonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalHref);

    // 2. OpenGraph URL
    const ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', canonicalHref);
    }

    // 3. Dynamic Title & Description
    if (activeCalcMeta) {
      document.title = `${activeCalcMeta.name} - Free Online Calculator | OmniCalc Suite`;
      const descEl = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (descEl) {
        descEl.setAttribute('content', `${activeCalcMeta.description} Free, instant, and mobile-friendly.`);
      }
      const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', `${activeCalcMeta.name} | OmniCalc Suite`);
      }
    } else {
      document.title = 'OmniCalc Suite - Financial Calculators, Unit Converters & Math Tools';
      const descEl = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (descEl) {
        descEl.setAttribute('content', 'Free all-in-one suite for Loan EMI, FD, RD, SIP, GST, Compound Interest, and Unit Converters for Area, Length, Temperature, Volume, Mass, Data, Speed, and Time.');
      }
      const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', 'OmniCalc Suite - Financial Calculators & Unit Converters');
      }
    }
  }, [routeState.calculatorId, activeCalcMeta]);

  const handleSelectCalculator = (id: CalculatorId) => {
    navigateToCalculator(id);
    setIsPickerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActiveCalculator = () => {
    switch (routeState.calculatorId) {
      case 'home':
        return <HomeScreen onSelectCalculator={handleSelectCalculator} />;

      // Finance Calculators
      case 'emi':
        return <EmiCalculator currency={currency} initialParams={routeState.params} />;
      case 'fd':
        return <FdCalculator currency={currency} initialParams={routeState.params} />;
      case 'rd':
        return <RdCalculator currency={currency} initialParams={routeState.params} />;
      case 'cumulative':
        return <CumulativeDepositCalc currency={currency} initialParams={routeState.params} />;
      case 'sip':
        return <SipCalculator currency={currency} initialParams={routeState.params} />;
      case 'ppf':
        return <PpfCalculator currency={currency} initialParams={routeState.params} />;
      case 'compound':
        return <CompoundInterestCalc currency={currency} initialParams={routeState.params} />;
      case 'gst':
        return <GstCalculator currency={currency} initialParams={routeState.params} />;
      case 'bmi':
        return <BmiCalculator initialParams={routeState.params} />;
      case 'date-diff':
        return <DateCalculator initialParams={routeState.params} />;
      case 'scientific':
        return <ScientificCalculator />;

      // Unit Converters
      case 'unit-converter':
      case 'unit-area':
        return <UnitConverter initialCategory="area" initialParams={routeState.params} />;
      case 'unit-length':
        return <UnitConverter initialCategory="length" initialParams={routeState.params} />;
      case 'unit-temperature':
        return <UnitConverter initialCategory="temperature" initialParams={routeState.params} />;
      case 'unit-volume':
        return <UnitConverter initialCategory="volume" initialParams={routeState.params} />;
      case 'unit-mass':
        return <UnitConverter initialCategory="mass" initialParams={routeState.params} />;
      case 'unit-data':
        return <UnitConverter initialCategory="data" initialParams={routeState.params} />;
      case 'unit-speed':
        return <UnitConverter initialCategory="speed" initialParams={routeState.params} />;
      case 'unit-time':
        return <UnitConverter initialCategory="time" initialParams={routeState.params} />;

      default:
        return <HomeScreen onSelectCalculator={handleSelectCalculator} />;
    }
  };

  const isHome = routeState.calculatorId === 'home';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Navigation Header */}
      <Navbar
        currentCalculatorId={routeState.calculatorId}
        onSelectCalculator={handleSelectCalculator}
        currency={currency}
        onSelectCurrency={setCurrency}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onTogglePicker={() => setIsPickerOpen(!isPickerOpen)}
        isPickerOpen={isPickerOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">

        {/* Back to Home & Direct Breadcrumb Bar (when inside a calculator) */}
        {!isHome && (
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSelectCalculator('home')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-850 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-400 transition-all shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Calculators</span>
              </button>

              <span className="text-slate-400 dark:text-slate-600">/</span>

              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {activeCalcMeta?.name || routeState.calculatorId}
              </span>

              {activeCalcMeta?.group && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {activeCalcMeta.group}
                </span>
              )}
            </div>

            {/* Direct URL quick chips */}
            <div className="hidden md:flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px]">
                Quick URLs:
              </span>
              {CALCULATORS_META.slice(0, 7).map((calc) => (
                <button
                  key={calc.id}
                  type="button"
                  onClick={() => handleSelectCalculator(calc.id)}
                  className={`px-2 py-0.5 rounded-md font-mono text-[11px] transition-colors ${
                    calc.id === routeState.calculatorId
                      ? 'bg-brand-600 text-white font-bold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  #{'/'}{calc.id}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Calculator Component or Home Screen */}
        <div className="transition-all duration-300">
          {renderActiveCalculator()}
        </div>

        {/* Bottom Calculator Directory (Always available for easy exploration & URL discovery) */}
        {!isHome && (
          <section className="pt-8 border-t border-slate-200 dark:border-slate-800">
            <CalculatorPicker
              currentId={routeState.calculatorId}
              onSelect={handleSelectCalculator}
            />
          </section>
        )}
      </main>

      {/* All Tools Popup Modal */}
      <AllToolsModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        currentId={routeState.calculatorId}
        onSelect={handleSelectCalculator}
      />

      {/* Quick Search Modal */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCalculator={handleSelectCalculator}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <span>OmniCalc Suite &copy; {new Date().getFullYear()}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold">
                Financial Calculators & Unit Converters
              </span>
            </p>
            <p className="mt-1 text-[11px]">
              Supports standard bank formulas, loan amortization schedules, and high-precision scientific unit conversions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
            <a href="#/home" className="hover:text-brand-600 dark:hover:text-brand-400 hover:underline">
              #/home
            </a>
            <a href="#/emi" className="hover:text-brand-600 dark:hover:text-brand-400 hover:underline">
              #/emi
            </a>
            <a href="#/fd" className="hover:text-brand-600 dark:hover:text-brand-400 hover:underline">
              #/fd
            </a>
            <a href="#/unit-area" className="hover:text-brand-600 dark:hover:text-brand-400 hover:underline">
              #/unit-area
            </a>
            <a href="#/unit-length" className="hover:text-brand-600 dark:hover:text-brand-400 hover:underline">
              #/unit-length
            </a>
            <a href="#/unit-temperature" className="hover:text-brand-600 dark:hover:text-brand-400 hover:underline">
              #/unit-temperature
            </a>
            <a href="#/unit-data" className="hover:text-brand-600 dark:hover:text-brand-400 hover:underline">
              #/unit-data
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;
