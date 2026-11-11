import React, { useState, useEffect } from 'react';
import { SliderInput } from '../Common/SliderInput';
import { ShareButton } from '../Common/ShareButton';
import { HeartPulse, Flame } from 'lucide-react';

interface BmiCalculatorProps {
  initialParams?: Record<string, string>;
}

export const BmiCalculator: React.FC<BmiCalculatorProps> = ({ initialParams }) => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(() => {
    return initialParams?.age ? parseFloat(initialParams.age) : 28;
  });
  const [heightCm, setHeightCm] = useState<number>(() => {
    return initialParams?.height ? parseFloat(initialParams.height) : 175;
  });
  const [weightKg, setWeightKg] = useState<number>(() => {
    return initialParams?.weight ? parseFloat(initialParams.weight) : 70;
  });

  useEffect(() => {
    if (initialParams?.age) setAge(parseFloat(initialParams.age));
    if (initialParams?.height) setHeightCm(parseFloat(initialParams.height));
    if (initialParams?.weight) setWeightKg(parseFloat(initialParams.weight));
    if (initialParams?.gender) setGender(initialParams.gender as 'male' | 'female');
  }, [initialParams]);

  // Derived calculations
  const heightM = heightCm / 100;
  const bmi = heightM > 0 ? weightKg / (heightM * heightM) : 0;

  // Category determination
  let categoryLabel = 'Normal Weight';
  let categoryColor = 'text-emerald-600 dark:text-emerald-400';
  let categoryBg = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800';

  if (bmi < 18.5) {
    categoryLabel = 'Underweight';
    categoryColor = 'text-sky-600 dark:text-sky-400';
    categoryBg = 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800';
  } else if (bmi < 25) {
    categoryLabel = 'Healthy / Normal Weight';
    categoryColor = 'text-emerald-600 dark:text-emerald-400';
    categoryBg = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800';
  } else if (bmi < 30) {
    categoryLabel = 'Overweight';
    categoryColor = 'text-amber-600 dark:text-amber-400';
    categoryBg = 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';
  } else {
    categoryLabel = 'Obese';
    categoryColor = 'text-rose-600 dark:text-rose-400';
    categoryBg = 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800';
  }

  // Ideal weight range for BMI 18.5 - 24.9
  const minIdealKg = 18.5 * (heightM * heightM);
  const maxIdealKg = 24.9 * (heightM * heightM);

  // BMR (Mifflin-St Jeor formula)
  const bmr =
    gender === 'male'
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  // Calorie needs
  const sedentaryCal = Math.round(bmr * 1.2);
  const moderateCal = Math.round(bmr * 1.55);
  const activeCal = Math.round(bmr * 1.725);

  // Position on gauge (10 to 40 scale)
  const gaugePercent = Math.min(100, Math.max(0, ((bmi - 10) / (40 - 10)) * 100));

  const shareParams = {
    weight: weightKg,
    height: heightCm,
    age,
    gender,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <HeartPulse className="w-5 h-5" />
            </span>
            <span>BMI & Health Calculator</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Calculate Body Mass Index (BMI), ideal weight range, BMR, and daily calorie expenditure
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ShareButton calculatorId="bmi" params={shareParams} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 space-y-6 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Gender & Unit selection */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  gender === 'male'
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                👨 Male
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  gender === 'female'
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                👩 Female
              </button>
            </div>

            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Metric Units (cm / kg)
            </div>
          </div>

          {/* 1. Height */}
          <SliderInput
            label="Height"
            value={heightCm}
            onChange={setHeightCm}
            min={100}
            max={230}
            step={1}
            suffix="cm"
            presets={[
              { label: '5\'3" (160cm)', value: 160 },
              { label: '5\'7" (170cm)', value: 170 },
              { label: '5\'9" (175cm)', value: 175 },
              { label: '6\'0" (183cm)', value: 183 },
            ]}
          />

          {/* 2. Weight */}
          <SliderInput
            label="Weight"
            value={weightKg}
            onChange={setWeightKg}
            min={30}
            max={180}
            step={0.5}
            suffix="kg"
            presets={[
              { label: '55 kg', value: 55 },
              { label: '65 kg', value: 65 },
              { label: '75 kg', value: 75 },
              { label: '85 kg', value: 85 },
            ]}
          />

          {/* 3. Age */}
          <SliderInput
            label="Age"
            value={age}
            onChange={setAge}
            min={10}
            max={90}
            step={1}
            suffix="years"
          />
        </div>

        {/* Right Summary & Visuals (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          {/* Main BMI Score Card */}
          <div className={`p-5 rounded-2xl border ${categoryBg} transition-all`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Your BMI Score
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${categoryBg} ${categoryColor}`}>
                {categoryLabel}
              </span>
            </div>

            <div className="text-4xl font-mono font-extrabold text-slate-900 dark:text-white">
              {bmi.toFixed(1)} <span className="text-sm font-sans font-medium text-slate-400">kg/m²</span>
            </div>

            {/* Visual Gauge Bar */}
            <div className="mt-4 space-y-1.5">
              <div className="relative h-3 rounded-full overflow-hidden flex shadow-inner">
                <div className="w-[28%] bg-sky-400" title="Underweight (< 18.5)" />
                <div className="w-[22%] bg-emerald-500" title="Normal (18.5 - 24.9)" />
                <div className="w-[17%] bg-amber-400" title="Overweight (25 - 29.9)" />
                <div className="w-[33%] bg-rose-500" title="Obese (>= 30)" />
              </div>

              {/* Indicator arrow */}
              <div className="relative h-3">
                <div
                  className="absolute -top-1 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-slate-900 dark:border-b-white transition-all duration-300"
                  style={{ left: `${gaugePercent}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>10</span>
                <span>18.5</span>
                <span>25.0</span>
                <span>30.0</span>
                <span>40</span>
              </div>
            </div>
          </div>

          {/* Healthy Weight Range */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Ideal Weight Range for {heightCm} cm
            </span>
            <div className="text-lg font-mono font-bold text-slate-900 dark:text-white">
              {minIdealKg.toFixed(1)} kg — {maxIdealKg.toFixed(1)} kg
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Maintaining this weight gives a healthy BMI between 18.5 and 24.9.
            </p>
          </div>

          {/* Metabolic & Calorie Needs */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800 dark:text-slate-200">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>Daily Calorie Estimates (BMR: {Math.round(bmr)} kcal)</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div className="text-[10px] text-slate-400 font-medium">Sedentary</div>
                <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">{sedentaryCal}</div>
                <div className="text-[9px] text-slate-400">kcal/day</div>
              </div>

              <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800">
                <div className="text-[10px] text-brand-600 dark:text-brand-300 font-medium">Moderate</div>
                <div className="font-mono font-bold text-brand-700 dark:text-brand-200 mt-0.5">{moderateCal}</div>
                <div className="text-[9px] text-brand-500">kcal/day</div>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div className="text-[10px] text-slate-400 font-medium">Active</div>
                <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">{activeCal}</div>
                <div className="text-[9px] text-slate-400">kcal/day</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
