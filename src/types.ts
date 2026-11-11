export type CalculatorId = 
  | 'home'
  | 'emi' 
  | 'fd' 
  | 'rd' 
  | 'cumulative' 
  | 'sip' 
  | 'ppf' 
  | 'compound'
  | 'gst'
  | 'bmi'
  | 'date-diff'
  | 'scientific'
  | 'unit-converter'
  | 'unit-area'
  | 'unit-length'
  | 'unit-temperature'
  | 'unit-volume'
  | 'unit-mass'
  | 'unit-data'
  | 'unit-speed'
  | 'unit-time';

export type MainCategoryGroup = 'All' | 'Finance' | 'Unit Converters' | 'Upcoming';

export type CalculatorCategory = 
  | 'Loans' 
  | 'Deposits & Savings' 
  | 'Investments' 
  | 'Unit Converters' 
  | 'Upcoming Tools';

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  formatStyle: 'indian' | 'western';
}

export interface CalculatorMeta {
  id: CalculatorId;
  name: string;
  shortName: string;
  group: 'Finance' | 'Unit Converters' | 'Upcoming';
  category: CalculatorCategory;
  badge?: string;
  description: string;
  keywords: string[];
  icon: string;
  isUpcoming?: boolean;
}

export interface ScheduleRow {
  period: number; // Month or Year
  label: string;
  openingBalance: number;
  depositOrEmi?: number;
  principalComponent?: number;
  interestComponent: number;
  totalInterestToDate?: number;
  closingBalance: number;
}

export interface EmiResult {
  monthlyEmi: number;
  totalPrincipal: number;
  totalInterest: number;
  totalPayment: number;
  interestRatio: number;
  schedule: ScheduleRow[];
  yearlySchedule: ScheduleRow[];
  prepaymentSavings?: {
    monthsSaved: number;
    interestSaved: number;
    newTenureMonths: number;
  };
}

export interface FdResult {
  investedAmount: number;
  interestEarned: number;
  maturityAmount: number;
  effectiveApy: number;
  periodicPayout?: number; // for non-cumulative
  yearlySchedule: ScheduleRow[];
}

export interface RdResult {
  monthlyDeposit: number;
  totalDeposit: number;
  interestEarned: number;
  maturityAmount: number;
  schedule: ScheduleRow[];
  yearlySchedule: ScheduleRow[];
}

export interface CumulativeResult {
  initialPrincipal: number;
  periodicAddition: number;
  totalInvested: number;
  totalInterest: number;
  maturityValue: number;
  effectiveApy: number;
  yearlySchedule: ScheduleRow[];
}

export interface SipResult {
  monthlyInvestment: number;
  totalInvested: number;
  estimatedReturns: number;
  maturityAmount: number;
  yearlySchedule: ScheduleRow[];
}

export interface PpfResult {
  annualDeposit: number;
  totalInvested: number;
  totalInterest: number;
  maturityAmount: number;
  yearlySchedule: ScheduleRow[];
}
