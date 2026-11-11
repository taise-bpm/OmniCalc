import {
  EmiResult,
  FdResult,
  RdResult,
  CumulativeResult,
  SipResult,
  PpfResult,
  ScheduleRow,
} from '../types';

/**
 * Calculate Loan EMI and full amortization schedule
 */
export function calculateEmi(
  principal: number,
  annualRate: number,
  tenureMonths: number,
  extraMonthlyPayment: number = 0
): EmiResult {
  if (principal <= 0 || tenureMonths <= 0) {
    return {
      monthlyEmi: 0,
      totalPrincipal: 0,
      totalInterest: 0,
      totalPayment: 0,
      interestRatio: 0,
      schedule: [],
      yearlySchedule: [],
    };
  }

  const monthlyRate = annualRate > 0 ? annualRate / 12 / 100 : 0;
  let baseEmi = 0;

  if (monthlyRate === 0) {
    baseEmi = principal / tenureMonths;
  } else {
    const factor = Math.pow(1 + monthlyRate, tenureMonths);
    baseEmi = (principal * monthlyRate * factor) / (factor - 1);
  }

  // Generate standard monthly amortization schedule
  const monthlySchedule: ScheduleRow[] = [];
  let currentBalance = principal;
  let totalInterest = 0;

  for (let m = 1; m <= tenureMonths; m++) {
    const interestForMonth = currentBalance * monthlyRate;
    let principalForMonth = baseEmi - interestForMonth;

    if (m === tenureMonths || principalForMonth > currentBalance) {
      principalForMonth = currentBalance;
    }

    currentBalance = Math.max(0, currentBalance - principalForMonth);
    totalInterest += interestForMonth;

    monthlySchedule.push({
      period: m,
      label: `Month ${m}`,
      openingBalance: currentBalance + principalForMonth,
      depositOrEmi: principalForMonth + interestForMonth,
      principalComponent: principalForMonth,
      interestComponent: interestForMonth,
      totalInterestToDate: totalInterest,
      closingBalance: currentBalance,
    });

    if (currentBalance <= 0) break;
  }

  // Aggregate into yearly schedule
  const yearlySchedule: ScheduleRow[] = [];
  const totalYears = Math.ceil(monthlySchedule.length / 12);

  for (let y = 1; y <= totalYears; y++) {
    const startIdx = (y - 1) * 12;
    const endIdx = Math.min(y * 12, monthlySchedule.length);
    const monthsInYear = monthlySchedule.slice(startIdx, endIdx);

    const yearOpening = monthsInYear[0].openingBalance;
    const yearClosing = monthsInYear[monthsInYear.length - 1].closingBalance;
    const yearPrincipal = monthsInYear.reduce((acc, row) => acc + (row.principalComponent || 0), 0);
    const yearInterest = monthsInYear.reduce((acc, row) => acc + row.interestComponent, 0);
    const yearEmi = monthsInYear.reduce((acc, row) => acc + (row.depositOrEmi || 0), 0);

    yearlySchedule.push({
      period: y,
      label: `Year ${y}`,
      openingBalance: yearOpening,
      depositOrEmi: yearEmi,
      principalComponent: yearPrincipal,
      interestComponent: yearInterest,
      closingBalance: yearClosing,
    });
  }

  // Prepayment simulation (if user adds extra payment per month)
  let prepaymentSavings;
  if (extraMonthlyPayment > 0 && monthlyRate > 0) {
    let prepBalance = principal;
    let prepMonths = 0;
    let prepTotalInterest = 0;

    while (prepBalance > 0.01 && prepMonths < tenureMonths * 2) {
      prepMonths++;
      const interestForMonth = prepBalance * monthlyRate;
      prepTotalInterest += interestForMonth;

      let payment = baseEmi + extraMonthlyPayment;
      let principalPaid = payment - interestForMonth;

      if (principalPaid > prepBalance) {
        principalPaid = prepBalance;
      }
      prepBalance = Math.max(0, prepBalance - principalPaid);
    }

    prepaymentSavings = {
      monthsSaved: Math.max(0, tenureMonths - prepMonths),
      interestSaved: Math.max(0, totalInterest - prepTotalInterest),
      newTenureMonths: prepMonths,
    };
  }

  const totalPayment = principal + totalInterest;
  const interestRatio = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  return {
    monthlyEmi: baseEmi,
    totalPrincipal: principal,
    totalInterest,
    totalPayment,
    interestRatio,
    schedule: monthlySchedule,
    yearlySchedule,
    prepaymentSavings,
  };
}

/**
 * Fixed Deposit (FD) Calculator
 * Supports Cumulative (reinvested with quarterly/monthly/yearly compounding)
 * and Non-Cumulative (interest paid out periodically: monthly, quarterly, yearly)
 */
export function calculateFd(
  principal: number,
  annualRate: number,
  tenureYears: number,
  compoundingPerYear: number = 4, // 4 = Quarterly (standard bank FD)
  isNonCumulative: boolean = false,
  payoutFrequency: 'monthly' | 'quarterly' | 'half-yearly' | 'yearly' = 'quarterly'
): FdResult {
  if (principal <= 0 || annualRate <= 0 || tenureYears <= 0) {
    return {
      investedAmount: principal,
      interestEarned: 0,
      maturityAmount: principal,
      effectiveApy: annualRate,
      yearlySchedule: [],
    };
  }

  // Effective Annual Percentage Yield (APY)
  const effectiveApy =
    (Math.pow(1 + annualRate / 100 / compoundingPerYear, compoundingPerYear) - 1) * 100;

  if (isNonCumulative) {
    // Non-cumulative payout
    const totalSimpleInterest = principal * (annualRate / 100) * tenureYears;

    let periodicPayout = 0;
    if (payoutFrequency === 'monthly') {
      periodicPayout = (principal * (annualRate / 100)) / 12;
    } else if (payoutFrequency === 'quarterly') {
      periodicPayout = (principal * (annualRate / 100)) / 4;
    } else if (payoutFrequency === 'half-yearly') {
      periodicPayout = (principal * (annualRate / 100)) / 2;
    } else {
      periodicPayout = principal * (annualRate / 100);
    }

    const yearlySchedule: ScheduleRow[] = [];
    const fullYears = Math.ceil(tenureYears);
    const annualPayout = principal * (annualRate / 100);

    for (let y = 1; y <= fullYears; y++) {
      const yearInterest = y === fullYears && tenureYears % 1 !== 0 
        ? principal * (annualRate / 100) * (tenureYears % 1) 
        : annualPayout;

      yearlySchedule.push({
        period: y,
        label: `Year ${y}`,
        openingBalance: principal,
        depositOrEmi: 0,
        principalComponent: 0,
        interestComponent: yearInterest,
        closingBalance: principal, // principal returned at the end
      });
    }

    return {
      investedAmount: principal,
      interestEarned: totalSimpleInterest,
      maturityAmount: principal, // principal returned, interest was already paid out
      effectiveApy: annualRate,
      periodicPayout,
      yearlySchedule,
    };
  }

  // Cumulative FD calculation: A = P * (1 + r/n)^(n*t)
  const n = compoundingPerYear;
  const t = tenureYears;
  const r = annualRate / 100;

  const maturityAmount = principal * Math.pow(1 + r / n, n * t);
  const interestEarned = maturityAmount - principal;

  // Yearly schedule
  const yearlySchedule: ScheduleRow[] = [];
  const fullYears = Math.ceil(tenureYears);
  let currentBalance = principal;

  for (let y = 1; y <= fullYears; y++) {
    const elapsedYears = y > tenureYears ? tenureYears : y;
    const closingForYear = principal * Math.pow(1 + r / n, n * elapsedYears);
    const openingForYear = currentBalance;
    const yearInterest = closingForYear - openingForYear;
    currentBalance = closingForYear;

    yearlySchedule.push({
      period: y,
      label: `Year ${y}`,
      openingBalance: openingForYear,
      interestComponent: yearInterest,
      closingBalance: closingForYear,
    });
  }

  return {
    investedAmount: principal,
    interestEarned,
    maturityAmount,
    effectiveApy,
    yearlySchedule,
  };
}

/**
 * Recurring Deposit (RD) Calculator
 * Standard banking formula with quarterly compounding
 * M = sum_{k=1}^N P * (1 + r/4)^(4 * (N - k + 1)/12)
 */
export function calculateRd(
  monthlyDeposit: number,
  annualRate: number,
  tenureMonths: number,
  compoundingPerYear: number = 4 // Indian banks compound RD quarterly
): RdResult {
  if (monthlyDeposit <= 0 || tenureMonths <= 0) {
    return {
      monthlyDeposit,
      totalDeposit: 0,
      interestEarned: 0,
      maturityAmount: 0,
      schedule: [],
      yearlySchedule: [],
    };
  }

  const r = annualRate / 100;
  const n = compoundingPerYear;
  let maturityAmount = 0;
  const totalDeposit = monthlyDeposit * tenureMonths;

  // Calculate compound return on each monthly installment
  const monthlySchedule: ScheduleRow[] = [];
  let cumulativePrincipal = 0;

  for (let m = 1; m <= tenureMonths; m++) {
    // Remaining time in years for this installment
    const remainingYears = (tenureMonths - m + 1) / 12;
    const installmentMaturity = monthlyDeposit * Math.pow(1 + r / n, n * remainingYears);
    maturityAmount += installmentMaturity;

    cumulativePrincipal += monthlyDeposit;

    monthlySchedule.push({
      period: m,
      label: `Month ${m}`,
      openingBalance: cumulativePrincipal - monthlyDeposit,
      depositOrEmi: monthlyDeposit,
      principalComponent: monthlyDeposit,
      interestComponent: Math.max(0, installmentMaturity - monthlyDeposit),
      closingBalance: cumulativePrincipal,
    });
  }

  const interestEarned = Math.max(0, maturityAmount - totalDeposit);

  // Group into yearly schedule
  const yearlySchedule: ScheduleRow[] = [];
  const totalYears = Math.ceil(tenureMonths / 12);
  let previousClosing = 0;

  for (let y = 1; y <= totalYears; y++) {
    const monthsInYear = Math.min(12, tenureMonths - (y - 1) * 12);
    const yearDeposit = monthlyDeposit * monthsInYear;
    const totalDepositedToDate = monthlyDeposit * Math.min(tenureMonths, y * 12);

    // Approximate cumulative balance at year end based on compounding
    const yearFraction = Math.min(tenureMonths, y * 12) / tenureMonths;
    // Non-linear interest accumulation
    const interestToDate = interestEarned * Math.pow(yearFraction, 1.8);
    const yearClosing = totalDepositedToDate + interestToDate;
    const yearInterest = yearClosing - previousClosing - yearDeposit;

    yearlySchedule.push({
      period: y,
      label: `Year ${y}`,
      openingBalance: previousClosing,
      depositOrEmi: yearDeposit,
      principalComponent: yearDeposit,
      interestComponent: Math.max(0, yearInterest),
      closingBalance: y === totalYears ? maturityAmount : yearClosing,
    });

    previousClosing = yearClosing;
  }

  return {
    monthlyDeposit,
    totalDeposit,
    interestEarned,
    maturityAmount,
    schedule: monthlySchedule,
    yearlySchedule,
  };
}

/**
 * Cumulative Deposit (CD) Calculator
 * Ideal for NBFC / Bank Cumulative deposits & Wealth accumulators
 * Supports lump sum + optional regular periodic additions
 */
export function calculateCumulativeDeposit(
  initialPrincipal: number,
  periodicAddition: number,
  additionFrequency: 'none' | 'monthly' | 'quarterly' | 'yearly',
  annualRate: number,
  tenureYears: number,
  compoundingPerYear: number = 4
): CumulativeResult {
  const n = compoundingPerYear;
  const r = annualRate / 100;

  const effectiveApy = (Math.pow(1 + r / n, n) - 1) * 100;

  if (initialPrincipal <= 0 && periodicAddition <= 0) {
    return {
      initialPrincipal: 0,
      periodicAddition: 0,
      totalInvested: 0,
      totalInterest: 0,
      maturityValue: 0,
      effectiveApy,
      yearlySchedule: [],
    };
  }

  let totalInvested = initialPrincipal;
  let currentBalance = initialPrincipal;
  const yearlySchedule: ScheduleRow[] = [];
  const fullYears = Math.ceil(tenureYears);

  // Frequency mapping for periodic addition
  let additionsPerYear = 0;
  if (additionFrequency === 'monthly') additionsPerYear = 12;
  else if (additionFrequency === 'quarterly') additionsPerYear = 4;
  else if (additionFrequency === 'yearly') additionsPerYear = 1;

  for (let y = 1; y <= fullYears; y++) {
    const yearOpening = currentBalance;
    let yearDeposit = 0;
    let yearInterest = 0;

    if (additionsPerYear === 0) {
      // Pure lump sum compounding for this year
      const yearClosing = yearOpening * Math.pow(1 + r / n, n * 1);
      yearInterest = yearClosing - yearOpening;
      currentBalance = yearClosing;
    } else {
      // Simulate periodic additions throughout the year
      const subPeriods = additionsPerYear;
      for (let p = 0; p < subPeriods; p++) {
        // Add contribution at start of period
        currentBalance += periodicAddition;
        totalInvested += periodicAddition;
        yearDeposit += periodicAddition;

        // Compound for this fraction of the year
        const periodInterest = currentBalance * (r / subPeriods);
        currentBalance += periodInterest;
        yearInterest += periodInterest;
      }
    }

    yearlySchedule.push({
      period: y,
      label: `Year ${y}`,
      openingBalance: yearOpening,
      depositOrEmi: yearDeposit,
      principalComponent: yearDeposit,
      interestComponent: yearInterest,
      closingBalance: currentBalance,
    });
  }

  const maturityValue = currentBalance;
  const totalInterest = Math.max(0, maturityValue - totalInvested);

  return {
    initialPrincipal,
    periodicAddition,
    totalInvested,
    totalInterest,
    maturityValue,
    effectiveApy,
    yearlySchedule,
  };
}

/**
 * Systematic Investment Plan (SIP) Calculator
 * M = P * [ (1 + i)^n - 1 ] / i * (1 + i)
 */
export function calculateSip(
  monthlyInvestment: number,
  expectedReturnRate: number,
  tenureYears: number
): SipResult {
  const n = tenureYears * 12;
  const i = expectedReturnRate / 12 / 100;
  const totalInvested = monthlyInvestment * n;

  if (monthlyInvestment <= 0 || tenureYears <= 0) {
    return {
      monthlyInvestment,
      totalInvested: 0,
      estimatedReturns: 0,
      maturityAmount: 0,
      yearlySchedule: [],
    };
  }

  let maturityAmount = 0;
  if (i === 0) {
    maturityAmount = totalInvested;
  } else {
    maturityAmount = monthlyInvestment * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  }

  const estimatedReturns = Math.max(0, maturityAmount - totalInvested);

  // Yearly schedule
  const yearlySchedule: ScheduleRow[] = [];
  let prevBalance = 0;

  for (let y = 1; y <= tenureYears; y++) {
    const months = y * 12;
    const yearInvested = monthlyInvestment * 12;
    const balanceAtYear =
      i === 0
        ? monthlyInvestment * months
        : monthlyInvestment * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);

    const yearGrowth = balanceAtYear - prevBalance - yearInvested;

    yearlySchedule.push({
      period: y,
      label: `Year ${y}`,
      openingBalance: prevBalance,
      depositOrEmi: yearInvested,
      principalComponent: yearInvested,
      interestComponent: Math.max(0, yearGrowth),
      closingBalance: balanceAtYear,
    });

    prevBalance = balanceAtYear;
  }

  return {
    monthlyInvestment,
    totalInvested,
    estimatedReturns,
    maturityAmount,
    yearlySchedule,
  };
}

/**
 * Public Provident Fund (PPF) Calculator
 * 15 Years minimum government scheme, max limit 1.5 Lakh/yr, annual compound
 */
export function calculatePpf(
  annualDeposit: number,
  interestRate: number = 7.1,
  tenureYears: number = 15
): PpfResult {
  const cappedAnnualDeposit = Math.min(annualDeposit, 150000); // PPF legal limit
  const r = interestRate / 100;
  const yearlySchedule: ScheduleRow[] = [];

  let balance = 0;
  let totalInvested = 0;

  for (let y = 1; y <= tenureYears; y++) {
    const opening = balance;
    balance += cappedAnnualDeposit;
    totalInvested += cappedAnnualDeposit;

    const interest = balance * r;
    balance += interest;

    yearlySchedule.push({
      period: y,
      label: `Year ${y}`,
      openingBalance: opening,
      depositOrEmi: cappedAnnualDeposit,
      principalComponent: cappedAnnualDeposit,
      interestComponent: interest,
      closingBalance: balance,
    });
  }

  const maturityAmount = balance;
  const totalInterest = Math.max(0, maturityAmount - totalInvested);

  return {
    annualDeposit: cappedAnnualDeposit,
    totalInvested,
    totalInterest,
    maturityAmount,
    yearlySchedule,
  };
}
