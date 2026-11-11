import React, { useState, useEffect } from 'react';
import { CurrencyCode } from '../../types';
import { calculateSip } from '../../utils/calculations';
import { SliderInput } from '../Common/SliderInput';
import { MetricCard } from '../Common/MetricCard';
import { DonutChart } from '../Common/DonutChart';
import { GrowthChart } from '../Common/GrowthChart';
import { ScheduleTable } from '../Common/ScheduleTable';
import { ShareButton } from '../Common/ShareButton';

interface SipCalculatorProps {
  currency: CurrencyCode;
  initialParams?: Record<string, string>;
}

export const SipCalculator: React.FC<SipCalculatorProps> = ({
  currency,
  initialParams,
}) => {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(() => {
    return initialParams?.investment ? parseFloat(initialParams.investment) : 10000;
  });
  const [expectedReturn, setExpectedReturn] = useState<number>(() => {
    return initialParams?.return ? parseFloat(initialParams.return) : 12;
  });
  const [tenureYears, setTenureYears] = useState<number>(() => {
    return initialParams?.years ? parseFloat(initialParams.years) : 15;
  });

  useEffect(() => {
    if (initialParams?.investment) setMonthlyInvestment(parseFloat(initialParams.investment));
    if (initialParams?.return) setExpectedReturn(parseFloat(initialParams.return));
    if (initialParams?.years) setTenureYears(parseFloat(initialParams.years));
  }, [initialParams]);

  const result = calculateSip(monthlyInvestment, expectedReturn, tenureYears);

  const shareParams = {
    investment: monthlyInvestment,
    return: expectedReturn,
    years: tenureYears,
  };

  const donutSegments = [
    {
      label: 'Invested Amount',
      value: result.totalInvested,
      color: '#0284c7', // Brand blue
    },
    {
      label: 'Estimated Returns',
      value: result.estimatedReturns,
      color: '#10b981', // Emerald green
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>SIP Calculator</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
              Mutual Funds & Wealth
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Calculate estimated future returns from systematic monthly mutual fund investments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ShareButton calculatorId="sip" params={shareParams} />
        </div>
      </div>

      {/* Inputs & Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-6 bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          {/* 1. Monthly Investment */}
          <SliderInput
            label="Monthly Investment (SIP)"
            value={monthlyInvestment}
            onChange={setMonthlyInvestment}
            min={500}
            max={200000}
            step={500}
            currency={currency}
            presets={[
              { label: '₹2.5K', value: 2500 },
              { label: '₹5K', value: 5000 },
              { label: '₹10K', value: 10000 },
              { label: '₹25K', value: 25000 },
              { label: '₹50K', value: 50000 },
            ]}
          />

          {/* 2. Expected Return Rate */}
          <SliderInput
            label="Expected Return Rate (% p.a.)"
            value={expectedReturn}
            onChange={setExpectedReturn}
            min={1}
            max={30}
            step={0.5}
            suffix="%"
            helperText="Typical equity mutual fund historical returns range between 12% - 15%"
            presets={[
              { label: '10%', value: 10 },
              { label: '12%', value: 12 },
              { label: '15%', value: 15 },
              { label: '18%', value: 18 },
            ]}
          />

          {/* 3. Time Period */}
          <SliderInput
            label="Time Period (Years)"
            value={tenureYears}
            onChange={setTenureYears}
            min={1}
            max={35}
            step={1}
            suffix="years"
            presets={[
              { label: '5 Yrs', value: 5 },
              { label: '10 Yrs', value: 10 },
              { label: '15 Yrs', value: 15 },
              { label: '20 Yrs', value: 20 },
              { label: '25 Yrs', value: 25 },
            ]}
          />
        </div>

        {/* Right Summary & Visuals */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <MetricCard
            label="Expected Total Corpus"
            amount={result.maturityAmount}
            currency={currency}
            variant="accent"
            subText={`After ${tenureYears} years with compound growth`}
          />

          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Amount Invested"
              amount={result.totalInvested}
              currency={currency}
              compact
            />
            <MetricCard
              label="Est. Wealth Gain"
              amount={result.estimatedReturns}
              currency={currency}
              compact
              subText={`+${((result.estimatedReturns / (result.totalInvested || 1)) * 100).toFixed(0)}% return`}
            />
          </div>

          <DonutChart
            segments={donutSegments}
            currency={currency}
            title="Capital vs Capital Gain"
            centerLabel="Total Corpus"
          />
        </div>
      </div>

      <GrowthChart
        data={result.yearlySchedule}
        currency={currency}
        title="Power of Compounding (SIP Growth Over Time)"
        type="investment"
      />

      <ScheduleTable
        yearlyData={result.yearlySchedule}
        currency={currency}
        title="Yearly SIP Wealth Accumulation"
        type="deposit"
      />
    </div>
  );
};

