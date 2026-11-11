import React, { useState, useEffect } from 'react';
import { CurrencyCode } from '../../types';
import { calculatePpf } from '../../utils/calculations';
import { SliderInput } from '../Common/SliderInput';
import { MetricCard } from '../Common/MetricCard';
import { DonutChart } from '../Common/DonutChart';
import { GrowthChart } from '../Common/GrowthChart';
import { ScheduleTable } from '../Common/ScheduleTable';
import { ShareButton } from '../Common/ShareButton';
import { ShieldCheck } from 'lucide-react';

interface PpfCalculatorProps {
  currency: CurrencyCode;
  initialParams?: Record<string, string>;
}

export const PpfCalculator: React.FC<PpfCalculatorProps> = ({
  currency,
  initialParams,
}) => {
  const [annualDeposit, setAnnualDeposit] = useState<number>(() => {
    return initialParams?.deposit ? parseFloat(initialParams.deposit) : 150000;
  });
  const [interestRate, setInterestRate] = useState<number>(() => {
    return initialParams?.rate ? parseFloat(initialParams.rate) : 7.1;
  });
  const [tenureYears, setTenureYears] = useState<number>(() => {
    return initialParams?.years ? parseFloat(initialParams.years) : 15;
  });

  useEffect(() => {
    if (initialParams?.deposit) setAnnualDeposit(parseFloat(initialParams.deposit));
    if (initialParams?.years) setTenureYears(parseFloat(initialParams.years));
  }, [initialParams]);

  const result = calculatePpf(annualDeposit, interestRate, tenureYears);

  const shareParams = {
    deposit: annualDeposit,
    rate: interestRate,
    years: tenureYears,
  };

  const donutSegments = [
    {
      label: 'Total Amount Deposited',
      value: result.totalInvested,
      color: '#0284c7', // Brand blue
    },
    {
      label: 'Tax-Free Interest Earned',
      value: result.totalInterest,
      color: '#10b981', // Emerald green
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>PPF Calculator</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Sovereign Guarantee (EEE Tax-Free)
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Calculate guaranteed tax-free maturity amount on Government Public Provident Fund
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ShareButton calculatorId="ppf" params={shareParams} />
        </div>
      </div>

      {/* Inputs & Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-6 bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          {/* 1. Yearly Investment */}
          <SliderInput
            label="Yearly Deposit (Max ₹1.5 Lakh/yr)"
            value={annualDeposit}
            onChange={setAnnualDeposit}
            min={500}
            max={150000}
            step={1000}
            currency={currency}
            helperText="Maximum allowed contribution per financial year is ₹1,50,000 under section 80C"
            presets={[
              { label: '₹25,000', value: 25000 },
              { label: '₹50,000', value: 50000 },
              { label: '₹1 Lakh', value: 100000 },
              { label: '₹1.5 Lakh (Max)', value: 150000 },
            ]}
          />

          {/* 2. Interest Rate (Government notification) */}
          <SliderInput
            label="Annual Interest Rate (% p.a.)"
            value={interestRate}
            onChange={setInterestRate}
            min={6.0}
            max={9.0}
            step={0.1}
            suffix="%"
            helperText="Set by Ministry of Finance quarterly (current standard is 7.1%)"
          />

          {/* 3. Tenure in Years */}
          <SliderInput
            label="Tenure (Years)"
            value={tenureYears}
            onChange={setTenureYears}
            min={15}
            max={30}
            step={5}
            suffix="years"
            helperText="PPF has a mandatory 15-year lock-in, extendable in blocks of 5 years"
            presets={[
              { label: '15 Years', value: 15 },
              { label: '20 Years', value: 20 },
              { label: '25 Years', value: 25 },
              { label: '30 Years', value: 30 },
            ]}
          />
        </div>

        {/* Right Summary & Visuals */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <MetricCard
            label="Tax-Free Maturity Corpus"
            amount={result.maturityAmount}
            currency={currency}
            variant="accent"
            subText={`Completely tax-free maturity after ${tenureYears} years`}
          />

          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Total Invested"
              amount={result.totalInvested}
              currency={currency}
              compact
            />
            <MetricCard
              label="Total Interest"
              amount={result.totalInterest}
              currency={currency}
              compact
              subText="Tax-free compound interest"
            />
          </div>

          <DonutChart
            segments={donutSegments}
            currency={currency}
            title="PPF Contribution vs Interest"
            centerLabel="Final Balance"
          />
        </div>
      </div>

      <GrowthChart
        data={result.yearlySchedule}
        currency={currency}
        title="PPF 15+ Years Wealth Accumulation"
        type="investment"
      />

      <ScheduleTable
        yearlyData={result.yearlySchedule}
        currency={currency}
        title="PPF Yearly Growth Schedule"
        type="deposit"
      />
    </div>
  );
};

