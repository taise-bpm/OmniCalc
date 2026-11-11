import React from 'react';
import { CurrencyCode } from '../../types';
import { formatCurrency, formatPercent } from '../../utils/formatters';

interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  currency: CurrencyCode;
  title?: string;
  centerLabel?: string;
  centerValue?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  segments,
  currency,
  title = 'Breakdown',
  centerLabel,
  centerValue,
}) => {
  const total = segments.reduce((sum, seg) => sum + Math.max(0, seg.value), 0);

  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
        {title}
      </h4>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        {/* SVG Donut */}
        <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
            {/* Background Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="transparent"
              className="text-slate-100 dark:text-slate-700/60"
            />

            {/* Segments */}
            {total > 0 &&
              segments.map((seg, idx) => {
                const percent = Math.max(0, seg.value) / total;
                const strokeDasharray = `${circumference * percent} ${circumference * (1 - percent)}`;
                const strokeDashoffset = -circumference * accumulatedPercent;
                accumulatedPercent += percent;

                return (
                  <circle
                    key={idx}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={seg.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    fill="transparent"
                    strokeLinecap="round"
                    className="transition-all duration-500 ease-out"
                  />
                );
              })}
          </svg>

          {/* Center Info */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {centerLabel || 'Total'}
            </span>
            <span className="text-sm font-bold font-mono text-slate-800 dark:text-white">
              {centerValue || formatCurrency(total, currency)}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3 w-full max-w-xs">
          {segments.map((seg, idx) => {
            const percent = total > 0 ? (Math.max(0, seg.value) / total) * 100 : 0;
            return (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750/50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-md shrink-0 shadow-sm"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {seg.label}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                    {formatCurrency(seg.value, currency)}
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {formatPercent(percent, 1)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

