import React from 'react';
import { CurrencyCode } from '../../types';
import { formatCurrency, formatCompactCurrency } from '../../utils/formatters';

interface MetricCardProps {
  label: string;
  amount: number;
  currency: CurrencyCode;
  variant?: 'primary' | 'secondary' | 'accent' | 'default';
  subText?: string;
  compact?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  amount,
  currency,
  variant = 'default',
  subText,
  compact = false,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-500/20';
      case 'secondary':
        return 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/20';
      case 'accent':
        return 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/20';
      default:
        return 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm';
    }
  };

  const isDarkCard = variant !== 'default';

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 transition-all duration-200 ${getVariantStyles()}`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span
          className={`text-xs font-semibold uppercase tracking-wider ${
            isDarkCard ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {label}
        </span>
        {amount > 0 && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              isDarkCard
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            {formatCompactCurrency(amount, currency)}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <div
          className={`font-mono font-bold tracking-tight ${
            compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'
          }`}
        >
          {formatCurrency(amount, currency)}
        </div>
      </div>

      {subText && (
        <p
          className={`text-xs mt-1.5 font-medium ${
            isDarkCard ? 'text-white/75' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {subText}
        </p>
      )}
    </div>
  );
};

