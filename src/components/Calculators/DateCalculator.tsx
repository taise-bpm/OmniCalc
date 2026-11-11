import React, { useState, useEffect } from 'react';
import { ShareButton } from '../Common/ShareButton';
import { Calendar, Gift, Briefcase } from 'lucide-react';

interface DateCalculatorProps {
  initialParams?: Record<string, string>;
}

export const DateCalculator: React.FC<DateCalculatorProps> = ({ initialParams }) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [startDate, setStartDate] = useState<string>(() => {
    return initialParams?.start || '1998-05-15';
  });
  const [endDate, setEndDate] = useState<string>(() => {
    return initialParams?.end || todayStr;
  });

  useEffect(() => {
    if (initialParams?.start) setStartDate(initialParams.start);
    if (initialParams?.end) setEndDate(initialParams.end);
  }, [initialParams]);

  const d1 = new Date(startDate);
  const d2 = new Date(endDate);

  // Order dates chronologically
  const isReverse = d1 > d2;
  const start = isReverse ? d2 : d1;
  const end = isReverse ? d1 : d2;

  // Breakdown in Years, Months, Days
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months--;
    // Days in previous month
    const prevMonthLastDay = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  // Total metrics
  const diffMs = Math.abs(d2.getTime() - d1.getTime());
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const remainingDaysInWeek = totalDays % 7;
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;

  // Working days (Monday to Friday)
  let workingDays = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const dayOfWeek = cur.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays++;
    }
    cur.setDate(cur.getDate() + 1);
  }

  // Next birthday calculation (based on start date)
  const today = new Date();
  const currentYear = today.getFullYear();
  let nextBday = new Date(currentYear, d1.getMonth(), d1.getDate());

  if (nextBday < today) {
    nextBday = new Date(currentYear + 1, d1.getMonth(), d1.getDate());
  }

  const daysToNextBday = Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const bdayDayName = nextBday.toLocaleDateString(undefined, { weekday: 'long' });

  const shareParams = {
    start: startDate,
    end: endDate,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Calendar className="w-5 h-5" />
            </span>
            <span>Date & Age Difference Calculator</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Calculate exact age in years, months, and days, duration between calendar dates, and next birthday
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ShareButton calculatorId="date-diff" params={shareParams} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (6 Cols) */}
        <div className="lg:col-span-6 space-y-5 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1.5">
                Start Date (or Date of Birth)
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-base rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  End Date
                </label>
                <button
                  type="button"
                  onClick={() => setEndDate(todayStr)}
                  className="text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400 font-bold"
                >
                  Set to Today
                </button>
              </div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-base rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 block mb-2">Quick Age Presets:</span>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Born in 2000', year: 2000 },
                { label: 'Born in 1995', year: 1995 },
                { label: 'Born in 1990', year: 1990 },
                { label: 'Born in 1985', year: 1985 },
              ].map((p) => (
                <button
                  key={p.year}
                  type="button"
                  onClick={() => setStartDate(`${p.year}-01-01`)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Summary (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Breakdown Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-lg space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
              Exact Age & Calendar Duration
            </span>

            <div className="flex flex-wrap items-baseline gap-3">
              <div className="text-3xl sm:text-4xl font-mono font-extrabold">
                {years} <span className="text-sm font-sans font-medium text-indigo-200">Years</span>
              </div>
              <div className="text-3xl sm:text-4xl font-mono font-extrabold">
                {months} <span className="text-sm font-sans font-medium text-indigo-200">Months</span>
              </div>
              <div className="text-3xl sm:text-4xl font-mono font-extrabold">
                {days} <span className="text-sm font-sans font-medium text-indigo-200">Days</span>
              </div>
            </div>

            <p className="text-xs text-indigo-100 font-medium">
              From {start.toLocaleDateString(undefined, { dateStyle: 'medium' })} to {end.toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </p>
          </div>

          {/* Detailed Units Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Days</div>
              <div className="text-base font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                {totalDays.toLocaleString()}
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Weeks</div>
              <div className="text-base font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                {totalWeeks} wks {remainingDaysInWeek} d
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-brand-500" />
                <span>Working Days</span>
              </div>
              <div className="text-base font-mono font-bold text-brand-600 dark:text-brand-400 mt-0.5">
                {workingDays.toLocaleString()}
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Hours</div>
              <div className="text-base font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                {totalHours.toLocaleString()}
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                {totalMinutes.toLocaleString()} mins
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 sm:col-span-2">
              <div className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1">
                <Gift className="w-3 h-3 text-rose-500" />
                <span>Next Birthday Countdown</span>
              </div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                <strong>{daysToNextBday} days remaining</strong> (on a {bdayDayName})
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
