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

interface CompoundInterestCalcProps {
  currency: CurrencyCode;
  initialParams?: Record<string, string>;
}

export const CompoundInterestCalc: React.FC<CompoundInterestCalcProps> = ({
  currency,
  initialParams,
}) => {
  const [principal, setPrincipal] = useState<number>(() => {
    return initialParams?.principal ? parseFloat(initialParams.principal) : 100000;
  });
  const [interestRate, setInterestRate] = useState<number>(() => {
    return initialParams?.rate ? parseFloat(initialParams.rate) : 10;
  });
  const [tenureYears, setTenureYears] = useState<number>(() => {
    return initialParams?.years ? parseFloat(initialParams.years) : 10;
  });
  const [compoundingFreq, setCompoundingFreq] = useState<number>(12); // monthly
  const [monthlyContribution, setMonthlyContribution] = useState<number>(0);

  useEffect(() => {
    if (initialParams?.principal) setPrincipal(parseFloat(initialParams.principal));
    if (initialParams?.rate) setInterestRate(parseFloat(initialParams.rate));
    if (initialParams?.years) setTenureYears(parseFloat(initialParams.years));
  }, [initialParams]);

  const result = calculateCumulativeDeposit(
    principal,
    monthlyContribution,
    monthlyContribution > 0 ? 'monthly' : 'none',
    interestRate,
    tenureYears,
    compoundingFreq
  );

  const shareParams = {
    principal,
    rate: interestRate,
    years: tenureYears,
    freq: compoundingFreq,
  };

  const donutSegments = [
    {
      label: 'Total Principal',
      value: result.totalInvested,
      color: '#0284c7',
    },
    {
      label: 'Compound Interest',
      value: result.totalInterest,
      color: '#6366f1',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Compound Interest Calculator</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 font-semibold">
              Universal Compound Formula
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Simulate the exponential growth of money with flexible compounding frequencies
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ShareButton calculatorId="compound" params={shareParams} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6 bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <SliderInput
            label="Initial Investment"
            value={principal}
            onChange={setPrincipal}
            min={1000}
            max={5000000}
            step={5000}
            currency={currency}
            presets={[
              { label: '₹50K', value: 50000 },
              { label: '₹1 Lakh', value: 100000 },
              { label: '₹5 Lakh', value: 500000 },
              { label: '₹10 Lakh', value: 1000000 },
            ]}
          />

          <SliderInput
            label="Annual Interest / Return Rate (% p.a.)"
            value={interestRate}
            onChange={setInterestRate}
            min={1}
            max={30}
            step={0.25}
            suffix="%"
            presets={[
              { label: '8%', value: 8 },
              { label: '10%', value: 10 },
              { label: '12%', value: 12 },
              { label: '15%', value: 15 },
            ]}
          />

          <SliderInput
            label="Time Period (Years)"
            value={tenureYears}
            onChange={setTenureYears}
            min={1}
            max={30}
            step={1}
            suffix="years"
            presets={[
              { label: '3 Yrs', value: 3 },
              { label: '5 Yrs', value: 5 },
              { label: '10 Yrs', value: 10 },
              { label: '20 Yrs', value: 20 },
            ]}
          />

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Compound Frequency
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Monthly', value: 12 },
                { label: 'Quarterly', value: 4 },
                { label: 'Semi-Annual', value: 2 },
                { label: 'Annually', value: 1 },
              ].map((freq) => (
                <button
                  key={freq.value}
                  type="button"
                  onClick={() => setCompoundingFreq(freq.value)}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                    compoundingFreq === freq.value
                      ? 'bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-300 border-violet-500 font-bold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {freq.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
            <SliderInput
              label="Optional Monthly Addition"
              value={monthlyContribution}
              onChange={setMonthlyContribution}
              min={0}
              max={100000}
              step={1000}
              currency={currency}
            />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <MetricCard
            label="Future Balance"
            amount={result.maturityValue}
            currency={currency}
            variant="secondary"
            subText={`Effective APY: ${formatPercent(result.effectiveApy)}`}
          />

          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Total Deposited"
              amount={result.totalInvested}
              currency={currency}
              compact
            />
            <MetricCard
              label="Interest Accrued"
              amount={result.totalInterest}
              currency={currency}
              compact
              subText={`+${((result.totalInterest / (result.totalInvested || 1)) * 100).toFixed(0)}% return`}
            />
          </div>

          <DonutChart
            segments={donutSegments}
            currency={currency}
            title="Capital vs Compound Returns"
            centerLabel="Future Value"
          />
        </div>
      </div>

      <GrowthChart
        data={result.yearlySchedule}
        currency={currency}
        title="Exponential Compound Growth"
        type="investment"
      />

      <ScheduleTable
        yearlyData={result.yearlySchedule}
        currency={currency}
        title="Compound Interest Yearly Growth Schedule"
        type="deposit"
      />
    </div>
  );
};

