import { CurrencyCode, CurrencyConfig } from '../types';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee (INR)',
    formatStyle: 'indian',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar (USD)',
    formatStyle: 'western',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro (EUR)',
    formatStyle: 'western',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound (GBP)',
    formatStyle: 'western',
  },
};

/**
 * Format a number to Indian numbering system (e.g., 12,34,567) or Western (1,234,567)
 */
export function formatCurrency(
  value: number,
  currency: CurrencyCode = 'INR',
  options?: { hideSymbol?: boolean; decimals?: number }
): string {
  if (isNaN(value) || !isFinite(value)) return '0';

  const decimals = options?.decimals !== undefined ? options.decimals : 0;
  const config = CURRENCIES[currency] || CURRENCIES.INR;

  let formattedNumber = '';
  if (config.formatStyle === 'indian') {
    formattedNumber = formatIndianNumber(value, decimals);
  } else {
    formattedNumber = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  }

  if (options?.hideSymbol) {
    return formattedNumber;
  }

  return `${config.symbol} ${formattedNumber}`;
}

/**
 * Custom formatter for Indian commas: 12,34,567.89
 */
export function formatIndianNumber(val: number, decimals: number = 0): string {
  const isNegative = val < 0;
  const absVal = Math.abs(val);

  const rounded = absVal.toFixed(decimals);
  const parts = rounded.split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1];

  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);

  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }

  const result =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') +
    lastThree +
    (decimalPart ? '.' + decimalPart : '');

  return isNegative ? '-' + result : result;
}

/**
 * Format in readable short units: e.g. 50 Lakhs, 1.25 Cr, 150K, 2.5M
 */
export function formatCompactCurrency(
  val: number,
  currency: CurrencyCode = 'INR'
): string {
  if (isNaN(val) || !isFinite(val)) return '0';
  const config = CURRENCIES[currency] || CURRENCIES.INR;
  const abs = Math.abs(val);

  if (config.formatStyle === 'indian') {
    if (abs >= 10000000) {
      return `${config.symbol} ${(val / 10000000).toFixed(2)} Cr`;
    }
    if (abs >= 100000) {
      return `${config.symbol} ${(val / 100000).toFixed(2)} Lakh`;
    }
    if (abs >= 1000) {
      return `${config.symbol} ${(val / 1000).toFixed(1)}k`;
    }
  } else {
    if (abs >= 1000000000) {
      return `${config.symbol} ${(val / 1000000000).toFixed(2)}B`;
    }
    if (abs >= 1000000) {
      return `${config.symbol} ${(val / 1000000).toFixed(2)}M`;
    }
    if (abs >= 1000) {
      return `${config.symbol} ${(val / 1000).toFixed(1)}K`;
    }
  }

  return formatCurrency(val, currency);
}

/**
 * Format percentage
 */
export function formatPercent(value: number, decimals: number = 2): string {
  if (isNaN(value)) return '0%';
  return `${value.toFixed(decimals)}%`;
}

/**
 * Export table data to CSV and trigger browser download
 */
export function exportToCSV(
  filename: string,
  headers: string[],
  rows: (string | number)[][]
) {
  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((row) => row.map(v => `"${v}"`).join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

