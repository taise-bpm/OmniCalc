import React, { useState, useEffect } from 'react';
import { UnitCategoryType, UNIT_CATEGORIES, convertUnit, getAllConversions } from '../../data/unitsData';
import { CalculatorId } from '../../types';
import { ShareButton } from '../Common/ShareButton';
import { 
  ArrowLeftRight, 
  Copy, 
  Check, 
  Maximize2, 
  Ruler, 
  Thermometer, 
  Droplets, 
  Scale, 
  HardDrive, 
  Gauge, 
  Clock,
  Info
} from 'lucide-react';

interface UnitConverterProps {
  initialCategory?: UnitCategoryType;
  initialParams?: Record<string, string>;
  onSelectCategoryUrl?: (id: CalculatorId) => void;
}

export const UnitConverter: React.FC<UnitConverterProps> = ({
  initialCategory = 'area',
  initialParams,
}) => {
  const [category, setCategory] = useState<UnitCategoryType>(() => {
    return (initialParams?.category as UnitCategoryType) || initialCategory;
  });

  const categoryDef = UNIT_CATEGORIES[category] || UNIT_CATEGORIES.area;

  const [fromUnit, setFromUnit] = useState<string>(() => {
    if (initialParams?.from && categoryDef.units.some((u) => u.id === initialParams.from)) {
      return initialParams.from;
    }
    return categoryDef.units[0]?.id || '';
  });

  const [toUnit, setToUnit] = useState<string>(() => {
    if (initialParams?.to && categoryDef.units.some((u) => u.id === initialParams.to)) {
      return initialParams.to;
    }
    return categoryDef.units[1]?.id || categoryDef.units[0]?.id || '';
  });

  const [fromValue, setFromValue] = useState<number>(() => {
    return initialParams?.val ? parseFloat(initialParams.val) : 1;
  });

  const [copied, setCopied] = useState(false);

  // When initialCategory changes from URL (e.g. navigating from /#/unit-area to /#/unit-length)
  useEffect(() => {
    if (initialCategory && UNIT_CATEGORIES[initialCategory]) {
      setCategory(initialCategory);
      const newDef = UNIT_CATEGORIES[initialCategory];
      setFromUnit(newDef.units[0]?.id || '');
      setToUnit(newDef.units[1]?.id || newDef.units[0]?.id || '');
    }
  }, [initialCategory]);

  // When switching category tabs internally
  const handleCategoryChange = (newCat: UnitCategoryType) => {
    setCategory(newCat);
    const newDef = UNIT_CATEGORIES[newCat];
    setFromUnit(newDef.units[0]?.id || '');
    setToUnit(newDef.units[1]?.id || newDef.units[0]?.id || '');
    setFromValue(1);
    window.location.hash = `#/unit-${newCat}`;
  };

  const toValue = convertUnit(fromValue, category, fromUnit, toUnit);

  const swapUnits = () => {
    const prevFrom = fromUnit;
    const prevTo = toUnit;
    setFromUnit(prevTo);
    setToUnit(prevFrom);
  };

  const fromUnitObj = categoryDef.units.find((u) => u.id === fromUnit);
  const toUnitObj = categoryDef.units.find((u) => u.id === toUnit);

  const allConversions = getAllConversions(fromValue, category, fromUnit);

  const formatNumber = (num: number) => {
    if (isNaN(num)) return '0';
    if (Math.abs(num) >= 1e9 || (Math.abs(num) < 1e-4 && num !== 0)) {
      return num.toExponential(4);
    }
    return Number(num.toFixed(6)).toLocaleString(undefined, { maximumFractionDigits: 6 });
  };

  const copyResult = () => {
    const text = `${formatNumber(fromValue)} ${fromUnitObj?.symbol} = ${formatNumber(toValue)} ${toUnitObj?.symbol}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryIcon = (cat: UnitCategoryType) => {
    switch (cat) {
      case 'area':
        return <Maximize2 className="w-4 h-4" />;
      case 'length':
        return <Ruler className="w-4 h-4" />;
      case 'temperature':
        return <Thermometer className="w-4 h-4" />;
      case 'volume':
        return <Droplets className="w-4 h-4" />;
      case 'mass':
        return <Scale className="w-4 h-4" />;
      case 'data':
        return <HardDrive className="w-4 h-4" />;
      case 'speed':
        return <Gauge className="w-4 h-4" />;
      case 'time':
        return <Clock className="w-4 h-4" />;
      default:
        return <Maximize2 className="w-4 h-4" />;
    }
  };

  const shareParams = {
    category,
    from: fromUnit,
    to: toUnit,
    val: fromValue,
  };

  return (
    <div className="space-y-6">
      {/* Category selector pills */}
      <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {(Object.keys(UNIT_CATEGORIES) as UnitCategoryType[]).map((catKey) => {
            const cat = UNIT_CATEGORIES[catKey];
            const isActive = catKey === category;
            return (
              <button
                key={catKey}
                type="button"
                onClick={() => handleCategoryChange(catKey)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {getCategoryIcon(catKey)}
                <span>{cat.name.split('&')[0].trim()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Converter Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm space-y-6">
        {/* Header with Title & Share */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
                {getCategoryIcon(category)}
              </span>
              <span>{categoryDef.name}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {categoryDef.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ShareButton calculatorId={`unit-${category}` as CalculatorId} params={shareParams} />
          </div>
        </div>

        {/* Dual Input Conversion Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
          {/* FROM Section (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              From
            </label>
            <div className="space-y-3">
              <input
                type="number"
                value={fromValue}
                onChange={(e) => setFromValue(parseFloat(e.target.value) || 0)}
                className="w-full text-2xl font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="0"
              />

              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-semibold rounded-xl px-3.5 py-2.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {categoryDef.units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SWAP Button (1 Col) */}
          <div className="lg:col-span-1 flex justify-center">
            <button
              type="button"
              onClick={swapUnits}
              className="p-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-500 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 shadow-md hover:scale-110 active:scale-95 transition-all"
              title="Swap units"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          {/* TO Section (5 Cols) */}
          <div className="lg:col-span-5 bg-brand-50/50 dark:bg-brand-950/20 p-4 sm:p-5 rounded-2xl border border-brand-200/70 dark:border-brand-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400 block">
                To (Converted Result)
              </label>
              <button
                type="button"
                onClick={copyResult}
                className="flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                title="Copy result"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-3">
              <div className="w-full text-2xl font-mono font-bold text-brand-900 dark:text-brand-200 bg-white dark:bg-slate-900 border border-brand-200 dark:border-brand-800 rounded-xl px-4 py-2.5 overflow-x-auto select-all">
                {formatNumber(toValue)}
              </div>

              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-semibold rounded-xl px-3.5 py-2.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {categoryDef.units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Formula & Relation Badge */}
        <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 font-medium">
          <Info className="w-4 h-4 text-brand-500 shrink-0" />
          <span>
            <strong>Formula Relationship:</strong> 1 {fromUnitObj?.name} = {formatNumber(convertUnit(1, category, fromUnit, toUnit))} {toUnitObj?.name} ({toUnitObj?.symbol})
          </span>
        </div>
      </div>

      {/* Multi-Unit Instant Comparison Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Instant Multi-Unit Comparison Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Equivalent value of {formatNumber(fromValue)} {fromUnitObj?.name} across all {categoryDef.name} units
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {allConversions.length} Units
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Unit Name</th>
                <th className="py-3 px-4">Symbol</th>
                <th className="py-3 px-4 text-right">Converted Value</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {allConversions.map(({ unit, convertedValue }) => {
                const isSelected = unit.id === toUnit;
                return (
                  <tr
                    key={unit.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                      isSelected ? 'bg-brand-50/40 dark:bg-brand-950/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-sans font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{unit.name}</span>
                      {isSelected && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-brand-500 text-white font-bold">
                          Active Target
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                      {unit.symbol}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white text-sm select-all">
                      {formatNumber(convertedValue)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setToUnit(unit.id)}
                        className="text-xs font-sans font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 hover:underline"
                      >
                        Select as Target
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
