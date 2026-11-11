import React from 'react';
import { CurrencyCode } from '../../types';
import { CURRENCIES, formatIndianNumber } from '../../utils/formatters';

interface Preset {
  label: string;
  value: number;
}

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  currency?: CurrencyCode;
  presets?: Preset[];
  helperText?: string;
  disabled?: boolean;
}

export const SliderInput: React.FC<SliderInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  currency,
  presets,
  helperText,
  disabled = false,
}) => {
  const displayPrefix = currency ? CURRENCIES[currency].symbol : prefix;

  // Handle direct text typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9.]/g, '');
    const num = parseFloat(rawVal);
    if (!isNaN(num)) {
      onChange(Math.min(max * 1.5, Math.max(0, num)));
    } else if (rawVal === '') {
      onChange(0);
    }
  };

  // Percentage for slider background gradient fill
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const formatUnitSuffix = (num: number, s?: string) => {
    if (!s) return '';
    if (s.startsWith('%')) return s;
    if (num === 1 && s === 'years') return ' year';
    if (num === 1 && s === 'months') return ' month';
    return ` ${s}`;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
        
        {/* Direct input badge */}
        <div className="flex items-center justify-end bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500 transition-all">
          {displayPrefix && (
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 mr-1.5 select-none shrink-0">
              {displayPrefix}
            </span>
          )}
          <input
            type="text"
            inputMode="numeric"
            value={currency === 'INR' ? formatIndianNumber(value, step < 1 ? 1 : 0) : value}
            onChange={handleInputChange}
            disabled={disabled}
            className="w-24 sm:w-28 text-right font-mono font-semibold text-slate-900 dark:text-white bg-transparent focus:outline-none text-sm p-0"
          />
          {suffix && (
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1.5 select-none shrink-0">
              {suffix}
            </span>
          )}
        </div>
      </div>

      {/* Range Slider with fill effect */}
      <div className="relative pt-1 pb-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          disabled={disabled}
          style={{
            background: `linear-gradient(to right, #0284c7 0%, #0284c7 ${percentage}%, #cbd5e1 ${percentage}%, #cbd5e1 100%)`,
          }}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-200 dark:bg-slate-700 accent-brand-600 transition-all"
        />
        <div className="flex justify-between text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1">
          <span>{displayPrefix}{currency === 'INR' ? formatIndianNumber(min) : min}{formatUnitSuffix(min, suffix)}</span>
          <span>{displayPrefix}{currency === 'INR' ? formatIndianNumber(max) : max}{formatUnitSuffix(max, suffix)}</span>
        </div>
      </div>

      {/* Preset pills */}
      {presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChange(preset.value)}
              className={`text-xs px-2 py-0.5 rounded-md font-medium transition-colors ${
                value === preset.value
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}

      {helperText && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      )}
    </div>
  );
};

