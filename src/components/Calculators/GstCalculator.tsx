import React, { useState, useEffect } from 'react';
import { CurrencyCode } from '../../types';
import { SliderInput } from '../Common/SliderInput';
import { MetricCard } from '../Common/MetricCard';
import { DonutChart } from '../Common/DonutChart';
import { ShareButton } from '../Common/ShareButton';
import { formatCurrency } from '../../utils/formatters';
import { Receipt, Split } from 'lucide-react';

interface GstCalculatorProps {
  currency: CurrencyCode;
  initialParams?: Record<string, string>;
}

export const GstCalculator: React.FC<GstCalculatorProps> = ({
  currency,
  initialParams,
}) => {
  const [amount, setAmount] = useState<number>(() => {
    return initialParams?.amount ? parseFloat(initialParams.amount) : 50000;
  });
  const [gstRate, setGstRate] = useState<number>(() => {
    return initialParams?.rate ? parseFloat(initialParams.rate) : 18;
  });
  const [isInclusive, setIsInclusive] = useState<boolean>(() => {
    return initialParams?.inclusive === 'true';
  });

  useEffect(() => {
    if (initialParams?.amount) setAmount(parseFloat(initialParams.amount));
    if (initialParams?.rate) setGstRate(parseFloat(initialParams.rate));
  }, [initialParams]);

  // Calculations
  let netAmount = 0;
  let gstAmount = 0;
  let totalAmount = 0;

  if (isInclusive) {
    // Amount includes GST: Net = Amount / (1 + Rate/100)
    netAmount = amount / (1 + gstRate / 100);
    gstAmount = amount - netAmount;
    totalAmount = amount;
  } else {
    // Amount excludes GST: GST = Amount * Rate/100
    netAmount = amount;
    gstAmount = amount * (gstRate / 100);
    totalAmount = amount + gstAmount;
  }

  const cgstAmount = gstAmount / 2;
  const sgstAmount = gstAmount / 2;

  const shareParams = {
    amount,
    rate: gstRate,
    inclusive: isInclusive,
  };

  const donutSegments = [
    {
      label: 'Pre-Tax Base Amount',
      value: netAmount,
      color: '#0284c7', // Brand blue
    },
    {
      label: `GST (${gstRate}%)`,
      value: gstAmount,
      color: '#f59e0b', // Amber
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Receipt className="w-5 h-5" />
            </span>
            <span>GST & Sales Tax Calculator</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Calculate GST Inclusive (Extract tax) or Exclusive (Add tax) with CGST, SGST & IGST split
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ShareButton calculatorId="gst" params={shareParams} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 space-y-6 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Mode Selector (Add GST vs Remove GST) */}
          <div className="flex items-center justify-between p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setIsInclusive(false)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${!isInclusive
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
                }`}
            >
              GST Exclusive (Add Tax to Net Amount)
            </button>
            <button
              type="button"
              onClick={() => setIsInclusive(true)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${isInclusive
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
                }`}
            >
              GST Inclusive (Extract Tax from Gross)
            </button>
          </div>

          {/* 1. Base Amount */}
          <SliderInput
            label={isInclusive ? 'Total Gross Amount (Including GST)' : 'Pre-Tax Net Amount (Excluding GST)'}
            value={amount}
            onChange={setAmount}
            min={100}
            max={5000000}
            step={100}
            currency={currency}
            presets={[
              { label: '₹1,000', value: 1000 },
              { label: '₹10,000', value: 10000 },
              { label: '₹50,000', value: 50000 },
              { label: '₹1 Lakh', value: 100000 },
              { label: '₹5 Lakh', value: 500000 },
            ]}
          />

          {/* 2. Standard GST Tax Slabs */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Standard GST Tax Slabs
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[
                { label: '0% (Exempt)', value: 0 },
                { label: '5% (Essential)', value: 5 },
                { label: '12% (Standard)', value: 12 },
                { label: '18% (Services)', value: 18 },
                { label: '28% (Luxury)', value: 28 },
              ].map((slab) => (
                <button
                  key={slab.value}
                  type="button"
                  onClick={() => setGstRate(slab.value)}
                  className={`py-2 px-1 text-xs font-bold rounded-xl border text-center transition-all ${gstRate === slab.value
                      ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-700 dark:text-amber-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                  <div>{slab.value}%</div>
                  <div className="text-[10px] font-normal text-slate-400 truncate">{slab.label.split(' ')[1]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Rate Slider */}
          <SliderInput
            label="Custom GST Rate (%)"
            value={gstRate}
            onChange={setGstRate}
            min={0}
            max={40}
            step={0.5}
            suffix="%"
          />
        </div>

        {/* Right Metric Summary & Donut Chart (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <MetricCard
            label="Total Gross Amount"
            amount={totalAmount}
            currency={currency}
            variant="primary"
            subText={isInclusive ? 'Original inclusive price' : 'Base amount + GST'}
          />

          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Pre-Tax Base (Net)"
              amount={netAmount}
              currency={currency}
              compact
            />
            <MetricCard
              label="Total GST Amount"
              amount={gstAmount}
              currency={currency}
              compact
              subText={`${gstRate}% Tax`}
            />
          </div>

          {/* Tax Split breakdown (CGST & SGST) */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mb-2">
              <Split className="w-4 h-4 text-brand-500" />
              <span>Tax Split Details</span>
            </div>

            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>CGST (Central Tax: {gstRate / 2}%):</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {formatCurrency(cgstAmount, currency)}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>SGST / UTGST (State Tax: {gstRate / 2}%):</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {formatCurrency(sgstAmount, currency)}
              </span>
            </div>

            <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
              <span>Or IGST (Integrated Inter-State):</span>
              <span className="font-mono text-amber-600 dark:text-amber-400">
                {formatCurrency(gstAmount, currency)}
              </span>
            </div>
          </div>

          <DonutChart
            segments={donutSegments}
            currency={currency}
            title="Base vs Tax Breakdown"
            centerLabel="Total Gross"
          />
        </div>
      </div>
    </div>
  );
};