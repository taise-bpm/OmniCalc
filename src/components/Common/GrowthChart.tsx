import React, { useState } from 'react';
import { CurrencyCode, ScheduleRow } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface GrowthChartProps {
  data: ScheduleRow[];
  currency: CurrencyCode;
  title?: string;
  type?: 'investment' | 'loan';
}

export const GrowthChart: React.FC<GrowthChartProps> = ({
  data,
  currency,
  title = 'Yearly Growth Chart',
  type = 'investment',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  // We can sample data if there are too many periods
  const displayData = data.length > 25 
    ? data.filter((_, idx) => idx % Math.ceil(data.length / 25) === 0 || idx === data.length - 1)
    : data;

  const maxVal = Math.max(
    ...displayData.map((d) =>
      type === 'loan' ? (d.openingBalance || 0) : d.closingBalance
    ),
    1
  );

  const height = 180;
  const paddingBottom = 28;
  const chartHeight = height - paddingBottom;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {title}
        </h4>
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-brand-500" />
            <span className="text-slate-600 dark:text-slate-400">
              {type === 'loan' ? 'Remaining Balance' : 'Total Balance'}
            </span>
          </div>
          {type !== 'loan' && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              <span className="text-slate-600 dark:text-slate-400">Interest Earned</span>
            </div>
          )}
        </div>
      </div>

      {/* SVG Bar / Area visualization */}
      <div className="relative w-full overflow-x-auto pb-2">
        <div className="min-w-[420px]">
          <div className="relative h-44 flex items-end gap-1.5 sm:gap-2 px-2 pt-6">
            {displayData.map((item, idx) => {
              const val = type === 'loan' ? item.closingBalance : item.closingBalance;
              const barHeight = Math.max(4, (val / maxVal) * chartHeight);
              const isHovered = hoveredIdx === idx;

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-10 z-20 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[11px] font-mono font-semibold py-1 px-2 rounded-lg shadow-lg pointer-events-none whitespace-nowrap">
                      <div>{item.label}</div>
                      <div>{formatCurrency(val, currency)}</div>
                    </div>
                  )}

                  {/* Bar */}
                  <div
                    className={`w-full rounded-t-md transition-all duration-200 ${
                      type === 'loan'
                        ? 'bg-amber-500 group-hover:bg-amber-400'
                        : 'bg-brand-500 group-hover:bg-brand-400'
                    } ${isHovered ? 'ring-2 ring-brand-300 dark:ring-brand-500 scale-y-105 origin-bottom' : ''}`}
                    style={{ height: `${barHeight}px` }}
                  />

                  {/* X axis label */}
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-2 truncate w-full text-center">
                    {item.label.replace('Year ', 'Y').replace('Month ', 'M')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

