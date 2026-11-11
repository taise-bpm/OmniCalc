import React, { useState, useEffect } from 'react';
import { CurrencyCode } from '../../types';
import { calculateRd } from '../../utils/calculations';
import { SliderInput } from '../Common/SliderInput';
import { MetricCard } from '../Common/MetricCard';
import { DonutChart } from '../Common/DonutChart';
import { GrowthChart } from '../Common/GrowthChart';
import { ScheduleTable } from '../Common/ScheduleTable';
import { ShareButton } from '../Common/ShareButton';

interface RdCalculatorProps {
  currency: CurrencyCode;
  initialParams?: Record<string, string>;
}

export const RdCalculator: React.FC<RdCalculatorProps> = ({
  currency,
  initialParams,
}) => {
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(() => {
    return initialParams?.deposit ? parseFloat(initialParams.deposit) : 10000;
  });
  const [interestRate, setInterestRate] = useState<number>(() => {
    return initialParams?.rate ? parseFloat(initialParams.rate) : 7.1;
  });
  const [tenureYears, setTenureYears] = useState<number>(() => {
    return initialParams?.years ? parseFloat(initialParams.years) : 3;
  });
  const [tenureUnit, setTenureUnit] = useState<'years' | 'months'>(() => {
    return (initialParams?.unit as 'years' | 'months') || 'years';
  });

  useEffect(() => {
    if (initialParams?.deposit) setMonthlyDeposit(parseFloat(initialParams.deposit));
    if (initialParams?.rate) setInterestRate(parseFloat(initialParams.rate));
    if (initialParams?.years) setTenureYears(parseFloat(initialParams.years));
  }, [initialParams]);

  const totalMonths = tenureUnit === 'years' ? tenureYears * 12 : tenureYears;
  const result = calculateRd(monthlyDeposit, interestRate, totalMonths);

  const shareParams = {
    deposit: monthlyDeposit,
    rate: interestRate,
    years: tenureYears,
    unit: tenureUnit,
  };

  const donutSegments = [
    {
      label: 'Total Amount Deposited',
      value: result.totalDeposit,
      color: '#0284c7', // Brand blue
    },
    {
      label: 'Interest Earned (Quarterly Compounded)',
      value: result.interestEarned,
      color: '#8b5cf6', // Violet
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Recurring Deposit (RD) Calculator</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
              Monthly Savings Scheme
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Calculate maturity value for monthly deposits compounded quarterly (Bank & Post Office standard)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ShareButton calculatorId="rd" params={shareParams} />
        </div>
      </div>

      {/* Inputs & Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-6 bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          {/* 1. Monthly Deposit */}
          <SliderInput
            label="Monthly Deposit Amount"
            value={monthlyDeposit}
            onChange={setMonthlyDeposit}
            min={500}
            max={200000}
            step={500}
            currency={currency}
            presets={[
              { label: '₹2,500/m', value: 2500 },
              { label: '₹5,000/m', value: 5000 },
              { label: '₹10,000/m', value: 10000 },
              { label: '₹25,000/m', value: 25000 },
              { label: '₹50,000/m', value: 50000 },
            ]}
          />

          {/* 2. Rate of Interest */}
          <SliderInput
            label="Rate of Interest (% p.a.)"
            value={interestRate}
            onChange={setInterestRate}
            min={3}
            max={12}
            step={0.1}
            suffix="%"
            helperText="Compounded quarterly as per Indian banking & postal standards"
            presets={[
              { label: '6.5%', value: 6.5 },
              { label: '6.8%', value: 6.8 },
              { label: '7.1%', value: 7.1 },
              { label: '7.5%', value: 7.5 },
            ]}
          />

          {/* 3. Tenure */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Deposit Tenure
              </label>
              <div className="flex bg-slate-100 dark:bg-slate-700 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    if (tenureUnit === 'months') {
                      setTenureYears(Math.max(1, Math.round(tenureYears / 12)));
                      setTenureUnit('years');
                    }
                  }}
                  className={`px-2.5 py-0.5 rounded-md transition-all ${
                    tenureUnit === 'years'
                      ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Years
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (tenureUnit === 'years') {
                      setTenureYears(tenureYears * 12);
                      setTenureUnit('months');
                    }
                  }}
                  className={`px-2.5 py-0.5 rounded-md transition-all ${
                    tenureUnit === 'months'
                      ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Months
                </button>
              </div>
            </div>

            <SliderInput
              label=""
              value={tenureYears}
              onChange={setTenureYears}
              min={tenureUnit === 'years' ? 1 : 6}
              max={tenureUnit === 'years' ? 10 : 120}
              step={1}
              suffix={tenureUnit}
              presets={
                tenureUnit === 'years'
                  ? [
                      { label: '1 Year', value: 1 },
                      { label: '2 Years', value: 2 },
                      { label: '3 Years', value: 3 },
                      { label: '5 Years', value: 5 },
                      { label: '10 Years', value: 10 },
                    ]
                  : [
                      { label: '6 Mo', value: 6 },
                      { label: '12 Mo', value: 12 },
                      { label: '24 Mo', value: 24 },
                      { label: '36 Mo', value: 36 },
                      { label: '60 Mo', value: 60 },
                    ]
              }
            />
          </div>
        </div>

        {/* Right Summary & Visuals */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <MetricCard
            label="Maturity Amount"
            amount={result.maturityAmount}
            currency={currency}
            variant="secondary"
            subText={`Payable at the end of ${totalMonths} months`}
          />

          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Total Deposited"
              amount={result.totalDeposit}
              currency={currency}
              compact
              subText={`${totalMonths} monthly installments`}
            />
            <MetricCard
              label="Total Interest"
              amount={result.interestEarned}
              currency={currency}
              compact
              subText="Quarterly compounded"
            />
          </div>

          <DonutChart
            segments={donutSegments}
            currency={currency}
            title="Deposit vs Compounded Returns"
            centerLabel="Maturity Value"
          />
        </div>
      </div>

      {/* Growth Chart */}
      <GrowthChart
        data={result.yearlySchedule}
        currency={currency}
        title="Accumulated Wealth Progression (RD)"
        type="investment"
      />

      {/* Schedule Table */}
      <ScheduleTable
        yearlyData={result.yearlySchedule}
        monthlyData={result.schedule}
        currency={currency}
        title="Recurring Deposit Schedule"
        type="deposit"
      />
    </div>
  );
};
