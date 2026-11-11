import React, { useState } from 'react';
import { CurrencyCode, ScheduleRow } from '../../types';
import { formatCurrency, exportToCSV } from '../../utils/formatters';
import { Download, ChevronDown, ChevronUp, Printer } from 'lucide-react';

interface ScheduleTableProps {
  yearlyData: ScheduleRow[];
  monthlyData?: ScheduleRow[];
  currency: CurrencyCode;
  title?: string;
  type?: 'loan' | 'deposit';
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({
  yearlyData,
  monthlyData,
  currency,
  title = 'Schedule Breakdown',
  type = 'loan',
}) => {
  const [activeTab, setActiveTab] = useState<'yearly' | 'monthly'>('yearly');
  const [isExpanded, setIsExpanded] = useState(false);

  const currentData = activeTab === 'yearly' ? yearlyData : (monthlyData || yearlyData);
  const displayedRows = isExpanded ? currentData : currentData.slice(0, 10);

  const handleExport = () => {
    const filename = `${title.toLowerCase().replace(/\s+/g, '_')}_${activeTab}`;
    const headers = [
      'Period',
      'Opening Balance',
      type === 'loan' ? 'EMI / Payment' : 'Deposit Added',
      type === 'loan' ? 'Principal Repaid' : 'Principal Added',
      'Interest',
      'Closing Balance',
    ];

    const rows = currentData.map((row) => [
      row.label,
      formatCurrency(row.openingBalance, currency, { hideSymbol: true }),
      formatCurrency(row.depositOrEmi || 0, currency, { hideSymbol: true }),
      formatCurrency(row.principalComponent || 0, currency, { hideSymbol: true }),
      formatCurrency(row.interestComponent, currency, { hideSymbol: true }),
      formatCurrency(row.closingBalance, currency, { hideSymbol: true }),
    ]);

    exportToCSV(filename, headers, rows);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
      {/* Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
            {title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Detailed period-by-period progression of principal & interest
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle (Yearly vs Monthly) */}
          {monthlyData && monthlyData.length > 0 && (
            <div className="flex bg-slate-100 dark:bg-slate-700 p-0.5 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('yearly')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === 'yearly'
                    ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Yearly
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('monthly')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === 'monthly'
                    ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Monthly ({monthlyData.length})
              </button>
            </div>
          )}

          {/* Export CSV button */}
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg transition-colors"
            title="Download CSV file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {/* Print button */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg transition-colors"
            title="Print Schedule"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-medium">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="py-3 px-4">Period</th>
              <th className="py-3 px-4 text-right">Opening Balance</th>
              <th className="py-3 px-4 text-right">
                {type === 'loan' ? 'EMI / Payment' : 'Deposit'}
              </th>
              {type === 'loan' && (
                <th className="py-3 px-4 text-right">Principal</th>
              )}
              <th className="py-3 px-4 text-right">
                {type === 'loan' ? 'Interest' : 'Interest Earned'}
              </th>
              <th className="py-3 px-4 text-right">Closing Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-mono">
            {displayedRows.map((row) => (
              <tr
                key={row.label}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors"
              >
                <td className="py-2.5 px-4 font-sans font-semibold text-slate-800 dark:text-slate-200">
                  {row.label}
                </td>
                <td className="py-2.5 px-4 text-right text-slate-600 dark:text-slate-400">
                  {formatCurrency(row.openingBalance, currency)}
                </td>
                <td className="py-2.5 px-4 text-right text-slate-700 dark:text-slate-300">
                  {row.depositOrEmi !== undefined
                    ? formatCurrency(row.depositOrEmi, currency)
                    : '-'}
                </td>
                {type === 'loan' && (
                  <td className="py-2.5 px-4 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                    {formatCurrency(row.principalComponent || 0, currency)}
                  </td>
                )}
                <td className="py-2.5 px-4 text-right text-amber-600 dark:text-amber-400 font-semibold">
                  {formatCurrency(row.interestComponent, currency)}
                </td>
                <td className="py-2.5 px-4 text-right font-bold text-slate-900 dark:text-slate-100">
                  {formatCurrency(row.closingBalance, currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Show more / collapse toggle */}
      {currentData.length > 10 && (
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 text-center">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            {isExpanded ? (
              <>
                <span>Show Less (First 10)</span>
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>View Full Schedule ({currentData.length} rows)</span>
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

