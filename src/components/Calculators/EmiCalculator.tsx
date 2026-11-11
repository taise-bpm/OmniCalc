import React, { useState, useEffect } from 'react';
import { CurrencyCode } from '../../types';
import { calculateEmi } from '../../utils/calculations';
import { SliderInput } from '../Common/SliderInput';
import { MetricCard } from '../Common/MetricCard';
import { DonutChart } from '../Common/DonutChart';
import { GrowthChart } from '../Common/GrowthChart';
import { ScheduleTable } from '../Common/ScheduleTable';
import { ShareButton } from '../Common/ShareButton';
import { formatCurrency, formatCompactCurrency } from '../../utils/formatters';
import { Sparkles, Zap } from 'lucide-react';

interface EmiCalculatorProps {
  currency: CurrencyCode;
  initialParams?: Record<string, string>;
}

export const EmiCalculator: React.FC<EmiCalculatorProps> = ({
  currency,
  initialParams,
}) => {
  // Initial values from query params or defaults
  const [loanAmount, setLoanAmount] = useState<number>(() => {
    return initialParams?.amount ? parseFloat(initialParams.amount) : 2500000;
  });
  const [interestRate, setInterestRate] = useState<number>(() => {
    return initialParams?.rate ? parseFloat(initialParams.rate) : 8.75;
  });
  const [tenureYears, setTenureYears] = useState<number>(() => {
    return initialParams?.years ? parseFloat(initialParams.years) : 20;
  });
  const [tenureUnit, setTenureUnit] = useState<'years' | 'months'>(() => {
    return (initialParams?.unit as 'years' | 'months') || 'years';
  });
  const [extraPrepayment, setExtraPrepayment] = useState<number>(() => {
    return initialParams?.extra ? parseFloat(initialParams.extra) : 0;
  });
  const [showPrepayment, setShowPrepayment] = useState<boolean>(false);

  // Sync if URL query parameters change externally
  useEffect(() => {
    if (initialParams?.amount) setLoanAmount(parseFloat(initialParams.amount));
    if (initialParams?.rate) setInterestRate(parseFloat(initialParams.rate));
    if (initialParams?.years) setTenureYears(parseFloat(initialParams.years));
  }, [initialParams]);

  const totalMonths = tenureUnit === 'years' ? tenureYears * 12 : tenureYears;
  const result = calculateEmi(loanAmount, interestRate, totalMonths, extraPrepayment);

  const shareParams = {
    amount: loanAmount,
    rate: interestRate,
    years: tenureYears,
    unit: tenureUnit,
    extra: extraPrepayment,
  };

  const donutSegments = [
    {
      label: 'Principal Loan Amount',
      value: result.totalPrincipal,
      color: '#0284c7', // Brand sky blue
    },
    {
      label: 'Total Interest Payable',
      value: result.totalInterest,
      color: '#f59e0b', // Amber
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>EMI Calculator</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-semibold">
              Home, Car & Personal Loans
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Calculate your monthly repayment, total interest, and loan amortization schedule
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ShareButton calculatorId="emi" params={shareParams} />
        </div>
      </div>

      {/* Main Grid: Inputs on Left, Visuals & Summary on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 space-y-6 bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          {/* Loan Presets */}
          <div className="flex items-center gap-2 pb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Quick Type:
            </span>
            <button
              type="button"
              onClick={() => {
                setLoanAmount(5000000);
                setInterestRate(8.5);
                setTenureYears(20);
                setTenureUnit('years');
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 font-medium text-slate-700 dark:text-slate-200"
            >
              🏠 Home Loan (8.5%)
            </button>
            <button
              type="button"
              onClick={() => {
                setLoanAmount(1000000);
                setInterestRate(9.2);
                setTenureYears(5);
                setTenureUnit('years');
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 font-medium text-slate-700 dark:text-slate-200"
            >
              🚗 Car Loan (9.2%)
            </button>
            <button
              type="button"
              onClick={() => {
                setLoanAmount(300000);
                setInterestRate(12.5);
                setTenureYears(3);
                setTenureUnit('years');
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 font-medium text-slate-700 dark:text-slate-200"
            >
              💳 Personal (12.5%)
            </button>
          </div>

          {/* 1. Loan Amount */}
          <SliderInput
            label="Total Loan Amount"
            value={loanAmount}
            onChange={setLoanAmount}
            min={50000}
            max={20000000}
            step={25000}
            currency={currency}
            presets={[
              { label: '₹5 Lakh', value: 500000 },
              { label: '₹10 Lakh', value: 1000000 },
              { label: '₹25 Lakh', value: 2500000 },
              { label: '₹50 Lakh', value: 5000000 },
              { label: '₹1 Crore', value: 10000000 },
            ]}
          />

          {/* 2. Interest Rate */}
          <SliderInput
            label="Annual Interest Rate (% p.a.)"
            value={interestRate}
            onChange={setInterestRate}
            min={1}
            max={25}
            step={0.05}
            suffix="%"
            presets={[
              { label: '8.5%', value: 8.5 },
              { label: '9.0%', value: 9.0 },
              { label: '10.5%', value: 10.5 },
              { label: '12.0%', value: 12.0 },
            ]}
          />

          {/* 3. Loan Tenure with Unit Switcher */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Loan Tenure
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
              max={tenureUnit === 'years' ? 30 : 360}
              step={1}
              suffix={tenureUnit}
              presets={
                tenureUnit === 'years'
                  ? [
                      { label: '5 Yrs', value: 5 },
                      { label: '10 Yrs', value: 10 },
                      { label: '15 Yrs', value: 15 },
                      { label: '20 Yrs', value: 20 },
                      { label: '25 Yrs', value: 25 },
                      { label: '30 Yrs', value: 30 },
                    ]
                  : [
                      { label: '12 Mo', value: 12 },
                      { label: '36 Mo', value: 36 },
                      { label: '60 Mo', value: 60 },
                      { label: '120 Mo', value: 120 },
                    ]
              }
            />
          </div>

          {/* Prepayment Accordion Feature */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => setShowPrepayment(!showPrepayment)}
              className="flex items-center justify-between w-full text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 py-1"
            >
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Simulate Monthly Prepayment / Extra EMI</span>
              </div>
              <span className="text-[11px] underline">
                {showPrepayment ? 'Hide' : '+ Add extra payment'}
              </span>
            </button>

            {showPrepayment && (
              <div className="mt-3 p-4 bg-brand-50/50 dark:bg-slate-900/50 rounded-xl border border-brand-100 dark:border-slate-700 space-y-3">
                <SliderInput
                  label="Extra Monthly Payment (Part Prepayment)"
                  value={extraPrepayment}
                  onChange={setExtraPrepayment}
                  min={0}
                  max={Math.round(result.monthlyEmi * 1.5)}
                  step={500}
                  currency={currency}
                  helperText="Paying an extra sum every month pays down the principal faster"
                />

                {result.prepaymentSavings && extraPrepayment > 0 && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Massive Interest Savings!</span>
                    </div>
                    <p className="text-emerald-700 dark:text-emerald-400">
                      By paying an extra <strong>{formatCurrency(extraPrepayment, currency)}/mo</strong>, you save{' '}
                      <strong>{formatCurrency(result.prepaymentSavings.interestSaved, currency)}</strong> in interest and close your loan{' '}
                      <strong>{Math.floor(result.prepaymentSavings.monthsSaved / 12)} years {result.prepaymentSavings.monthsSaved % 12} months earlier</strong>!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Metric Summary & Donut Chart (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <MetricCard
            label="Monthly Loan EMI"
            amount={result.monthlyEmi}
            currency={currency}
            variant="primary"
            subText={`Payable each month for ${totalMonths} installments`}
          />

          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Principal Loan"
              amount={result.totalPrincipal}
              currency={currency}
              compact
              subText={`${(100 - result.interestRatio).toFixed(1)}% of total`}
            />
            <MetricCard
              label="Total Interest"
              amount={result.totalInterest}
              currency={currency}
              compact
              subText={`${result.interestRatio.toFixed(1)}% of total`}
            />
          </div>

          <MetricCard
            label="Total Amount Payable"
            amount={result.totalPayment}
            currency={currency}
            compact
            subText="Principal Amount + Total Interest"
          />

          <DonutChart
            segments={donutSegments}
            currency={currency}
            title="Loan Payment Breakdown"
            centerLabel="Total Payment"
            centerValue={formatCompactCurrency(result.totalPayment, currency)}
          />
        </div>
      </div>

      {/* Visual Balance Trend Chart */}
      <GrowthChart
        data={result.yearlySchedule}
        currency={currency}
        title="Loan Outstanding Balance Over Time"
        type="loan"
      />

      {/* Full Amortization Schedule Table */}
      <ScheduleTable
        yearlyData={result.yearlySchedule}
        monthlyData={result.schedule}
        currency={currency}
        title="Loan Amortization Schedule"
        type="loan"
      />
    </div>
  );
};
