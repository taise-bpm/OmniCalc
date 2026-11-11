import React, { useState, useEffect } from 'react';
import { CurrencyCode } from '../../types';
import { calculateCumulativeDeposit } from '../../utils/calculations';
import { SliderInput } from '../Common/SliderInput';
import { MetricCard } from '../Common/MetricCard';
import { DonutChart } from '../Common/DonutChart';
import { GrowthChart } from '../Common/GrowthChart';
import { ScheduleTable } from '../Common/ScheduleTable';
import { ShareButton } from '../Common/ShareButton';
import { formatPercent } from '../../utils/formatters';

interface CumulativeDepositCalcProps {
  currency: CurrencyCode;
  initialParams?: Record<string, string>;
}

export const CumulativeDepositCalc: React.FC<CumulativeDepositCalcProps> = ({
  currency,
  initialParams,
}) => {
  const [initialDeposit, setInitialDeposit] = useState<number>(() => {
    return initialParams?.principal ? parseFloat(initialParams.principal) : 300000;
  });
  const [periodicAddition, setPeriodicAddition] = useState<number>(() => {
    return initialParams?.addition ? parseFloat(initialParams.addition) : 0;
  });
  const [additionFreq, setAdditionFreq] = useState<'none' | 'monthly' | 'quarterly' | 'yearly'>('none');
  const [interestRate, setInterestRate] = useState<number>(() => {
    return initialParams?.rate ? parseFloat(initialParams.rate) : 8.1;
  });
  const [tenureYears, setTenureYears] = useState<number>(() => {
    return initialParams?.years ? parseFloat(initialParams.years) : 5;
  });
  const [compoundingFreq, setCompoundingFreq] = useState<number>(4); // Quarterly compounding

  useEffect(() => {
    if (initialParams?.principal) setInitialDeposit(parseFloat(initialParams.principal));
    if (initialParams?.rate) setInterestRate(parseFloat(initialParams.rate));
    if (initialParams?.years) setTenureYears(parseFloat(initialParams.years));
  }, [initialParams]);

  const result = calculateCumulativeDeposit(
    initialDeposit,
    periodicAddition,
    additionFreq,
    interestRate,
    tenureYears,
    compoundingFreq
  );

  const shareParams = {
    principal: initialDeposit,
    addition: periodicAddition,
    rate: interestRate,
    years: tenureYears,
    compound: compoundingFreq,
  };

  const donutSegments = [
    {
      label: 'Total Principal Invested',
      value: result.totalInvested,
      color: '#0284c7', // Brand blue
    },
    {
      label: 'Accrued Compound Interest',
      value: result.totalInterest,
      color: '#059669', // Emerald
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Cumulative Deposit Calculator</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-semibold">
              Reinvestment & Compound Growth
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Calculate wealth accumulation where earned interest is reinvested periodically until final maturity
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ShareButton calculatorId="cumulative" params={shareParams} />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-6 bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          {/* 1. Initial Principal */}
          <SliderInput
            label="Initial Lump Sum Principal"
            value={initialDeposit}
            onChange={setInitialDeposit}
            min={10000}
            max={10000000}
            step={10000}
            currency={currency}
            presets={[
              { label: '₹1 Lakh', value: 100000 },
              { label: '₹3 Lakh', value: 300000 },
              { label: '₹5 Lakh', value: 500000 },
              { label: '₹10 Lakh', value: 1000000 },
              { label: '₹25 Lakh', value: 2500000 },
            ]}
          />

          {/* 2. Rate of Interest */}
          <SliderInput
            label="Annual Interest Rate (% p.a.)"
            value={interestRate}
            onChange={setInterestRate}
            min={3}
            max={16}
            step={0.1}
            suffix="%"
            presets={[
              { label: '7.5%', value: 7.5 },
              { label: '8.1%', value: 8.1 },
              { label: '8.6%', value: 8.6 },
              { label: '9.2%', value: 9.2 },
            ]}
          />

          {/* 3. Tenure */}
          <SliderInput
            label="Investment Tenure (Years)"
            value={tenureYears}
            onChange={setTenureYears}
            min={1}
            max={20}
            step={1}
            suffix="years"
            presets={[
              { label: '1 Yr', value: 1 },
              { label: '3 Yrs', value: 3 },
              { label: '5 Yrs', value: 5 },
              { label: '7 Yrs', value: 7 },
              { label: '10 Yrs', value: 10 },
            ]}
          />

          {/* 4. Compounding Frequency */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Compounding Frequency
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Monthly', value: 12 },
                { label: 'Quarterly', value: 4 },
                { label: 'Half-Yearly', value: 2 },
                { label: 'Annually', value: 1 },
              ].map((freq) => (
                <button
                  key={freq.value}
                  type="button"
                  onClick={() => setCompoundingFreq(freq.value)}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                    compoundingFreq === freq.value
                      ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-300 border-teal-500 font-bold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {freq.label}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Periodic Additions */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Optional Regular Top-Up / Additions
              </span>
              <div className="flex bg-slate-100 dark:bg-slate-700 p-0.5 rounded-lg text-xs font-medium">
                {(['none', 'monthly', 'quarterly', 'yearly'] as const).map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setAdditionFreq(freq)}
                    className={`px-2 py-0.5 rounded-md capitalize transition-all ${
                      additionFreq === freq
                        ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 font-bold shadow-sm'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            {additionFreq !== 'none' && (
              <SliderInput
                label={`Regular ${additionFreq} addition`}
                value={periodicAddition}
                onChange={setPeriodicAddition}
                min={1000}
                max={200000}
                step={1000}
                currency={currency}
              />
            )}
          </div>
        </div>

        {/* Right Summary & Visuals */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <MetricCard
            label="Cumulative Maturity Value"
            amount={result.maturityValue}
            currency={currency}
            variant="accent"
            subText={`Effective Annual Yield (APY): ${formatPercent(result.effectiveApy)}`}
          />

          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Total Invested"
              amount={result.totalInvested}
              currency={currency}
              compact
            />
            <MetricCard
              label="Compound Interest"
              amount={result.totalInterest}
              currency={currency}
              compact
              subText={`+${((result.totalInterest / (result.totalInvested || 1)) * 100).toFixed(1)}% growth`}
            />
          </div>

          <DonutChart
            segments={donutSegments}
            currency={currency}
            title="Capital vs Compound Growth"
            centerLabel="Final Value"
          />
        </div>
      </div>

      {/* Yearly Growth Visualization */}
      <GrowthChart
        data={result.yearlySchedule}
        currency={currency}
        title="Compound Wealth Accumulation Curve"
        type="investment"
      />

      {/* Breakdown Table */}
      <ScheduleTable
        yearlyData={result.yearlySchedule}
        currency={currency}
        title="Cumulative Deposit Progression Table"
        type="deposit"
      />
    </div>
  );
};
