import React, { useState, useEffect } from 'react';
import { CurrencyCode } from '../../types';
import { calculateFd } from '../../utils/calculations';
import { SliderInput } from '../Common/SliderInput';
import { MetricCard } from '../Common/MetricCard';
import { DonutChart } from '../Common/DonutChart';
import { GrowthChart } from '../Common/GrowthChart';
import { ScheduleTable } from '../Common/ScheduleTable';
import { ShareButton } from '../Common/ShareButton';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { UserCheck } from 'lucide-react';

interface FdCalculatorProps {
  currency: CurrencyCode;
  initialParams?: Record<string, string>;
}

export const FdCalculator: React.FC<FdCalculatorProps> = ({
  currency,
  initialParams,
}) => {
  const [depositAmount, setDepositAmount] = useState<number>(() => {
    return initialParams?.amount ? parseFloat(initialParams.amount) : 500000;
  });
  const [interestRate, setInterestRate] = useState<number>(() => {
    return initialParams?.rate ? parseFloat(initialParams.rate) : 7.25;
  });
  const [tenureYears, setTenureYears] = useState<number>(() => {
    return initialParams?.years ? parseFloat(initialParams.years) : 5;
  });
  const [isSeniorCitizen, setIsSeniorCitizen] = useState<boolean>(() => {
    return initialParams?.senior === 'true';
  });
  const [isNonCumulative, setIsNonCumulative] = useState<boolean>(() => {
    return initialParams?.nonCum === 'true';
  });
  const [compoundingFreq, setCompoundingFreq] = useState<number>(4); // 4 = Quarterly
  const [payoutFreq, setPayoutFreq] = useState<'monthly' | 'quarterly' | 'half-yearly' | 'yearly'>('quarterly');

  useEffect(() => {
    if (initialParams?.amount) setDepositAmount(parseFloat(initialParams.amount));
    if (initialParams?.rate) setInterestRate(parseFloat(initialParams.rate));
    if (initialParams?.years) setTenureYears(parseFloat(initialParams.years));
  }, [initialParams]);

  // Senior citizens typically get 0.50% extra interest
  const effectiveRate = interestRate + (isSeniorCitizen ? 0.5 : 0);

  const result = calculateFd(
    depositAmount,
    effectiveRate,
    tenureYears,
    compoundingFreq,
    isNonCumulative,
    payoutFreq
  );

  const shareParams = {
    amount: depositAmount,
    rate: interestRate,
    years: tenureYears,
    senior: isSeniorCitizen,
    nonCum: isNonCumulative,
  };

  const donutSegments = [
    {
      label: 'Principal Invested',
      value: result.investedAmount,
      color: '#0284c7', // Brand sky blue
    },
    {
      label: 'Interest Earned',
      value: result.interestEarned,
      color: '#10b981', // Emerald
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Fixed Deposit (FD) Calculator</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
              Bank & Post Office FD
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Calculate your maturity amount, interest income, and effective yield on fixed deposits
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ShareButton calculatorId="fd" params={shareParams} />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-6 bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          {/* Deposit Type Toggle (Cumulative vs Non-Cumulative) */}
          <div className="flex items-center justify-between p-1 bg-slate-100 dark:bg-slate-700/60 rounded-xl">
            <button
              type="button"
              onClick={() => setIsNonCumulative(false)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${!isNonCumulative
                  ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
                }`}
            >
              Cumulative (Reinvested at Maturity)
            </button>
            <button
              type="button"
              onClick={() => setIsNonCumulative(true)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${isNonCumulative
                  ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
                }`}
            >
              Non-Cumulative (Regular Payouts)
            </button>
          </div>

          {/* 1. Deposit Amount */}
          <SliderInput
            label="Total Deposit Amount"
            value={depositAmount}
            onChange={setDepositAmount}
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
          <div className="space-y-2">
            <SliderInput
              label="Rate of Interest (% p.a.)"
              value={interestRate}
              onChange={setInterestRate}
              min={3}
              max={15}
              step={0.1}
              suffix="%"
              presets={[
                { label: '6.5%', value: 6.5 },
                { label: '7.0%', value: 7.0 },
                { label: '7.5%', value: 7.5 },
                { label: '8.0%', value: 8.0 },
              ]}
            />

            {/* Senior Citizen Toggle */}
            <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-amber-900 dark:text-amber-200">
                <input
                  type="checkbox"
                  checked={isSeniorCitizen}
                  onChange={(e) => setIsSeniorCitizen(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 accent-amber-600 cursor-pointer"
                />
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-amber-600" />
                  Senior Citizen (+0.50% Extra Rate)
                </span>
              </label>
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 font-mono">
                Effective: {effectiveRate.toFixed(2)}%
              </span>
            </div>
          </div>

          {/* 3. Tenure in Years */}
          <SliderInput
            label="Tenure (Years)"
            value={tenureYears}
            onChange={setTenureYears}
            min={1}
            max={10}
            step={1}
            suffix="years"
            presets={[
              { label: '1 Year', value: 1 },
              { label: '2 Years', value: 2 },
              { label: '3 Years', value: 3 },
              { label: '5 Years', value: 5 },
              { label: '10 Years', value: 10 },
            ]}
          />

          {/* Compounding or Payout Frequency */}
          {!isNonCumulative ? (
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Compounding Frequency
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Monthly', value: 12 },
                  { label: 'Quarterly (Std)', value: 4 },
                  { label: 'Half-Yearly', value: 2 },
                  { label: 'Yearly', value: 1 },
                ].map((freq) => (
                  <button
                    key={freq.value}
                    type="button"
                    onClick={() => setCompoundingFreq(freq.value)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all ${compoundingFreq === freq.value
                        ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 border-brand-500 font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Interest Payout Frequency
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Monthly', value: 'monthly' as const },
                  { label: 'Quarterly', value: 'quarterly' as const },
                  { label: 'Half-Yearly', value: 'half-yearly' as const },
                  { label: 'Yearly', value: 'yearly' as const },
                ].map((freq) => (
                  <button
                    key={freq.value}
                    type="button"
                    onClick={() => setPayoutFreq(freq.value)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all ${payoutFreq === freq.value
                        ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 border-brand-500 font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Summary & Visuals */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          {!isNonCumulative ? (
            <MetricCard
              label="Maturity Amount"
              amount={result.maturityAmount}
              currency={currency}
              variant="accent"
              subText={`After ${tenureYears} years with compound interest`}
            />
          ) : (
            <MetricCard
              label={`Regular ${payoutFreq.toUpperCase()} Payout`}
              amount={result.periodicPayout || 0}
              currency={currency}
              variant="accent"
              subText={`Paid out ${payoutFreq} to your bank account`}
            />
          )}

          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Total Invested"
              amount={result.investedAmount}
              currency={currency}
              compact
            />
            <MetricCard
              label="Total Interest"
              amount={result.interestEarned}
              currency={currency}
              compact
              subText={`Yield: ${formatPercent(result.effectiveApy)}`}
            />
          </div>

          <DonutChart
            segments={donutSegments}
            currency={currency}
            title="Investment vs Returns"
            centerLabel="Maturity"
            centerValue={formatCurrency(
              !isNonCumulative
                ? result.maturityAmount
                : result.investedAmount + result.interestEarned,
              currency
            )}
          />
        </div>
      </div>

      {/* Yearly Growth Visualization */}
      <GrowthChart
        data={result.yearlySchedule}
        currency={currency}
        title="Year-on-Year Growth of Fixed Deposit"
        type="investment"
      />

      {/* Breakdown Table */}
      <ScheduleTable
        yearlyData={result.yearlySchedule}
        currency={currency}
        title="Fixed Deposit Yearly Breakdown"
        type="deposit"
      />
    </div>
  );
};
