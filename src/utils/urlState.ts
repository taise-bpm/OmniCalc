import { CalculatorId } from '../types';

export interface RouteState {
  calculatorId: CalculatorId;
  params: Record<string, string>;
}

export function parseHashUrl(): RouteState {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (!hash || hash === 'home') {
    return { calculatorId: 'home', params: {} };
  }

  const [path, queryString] = hash.split('?');
  const cleanPath = path.toLowerCase().replace(/^\//, '');

  const validCalculators: CalculatorId[] = [
    'home',
    'emi',
    'fd',
    'rd',
    'cumulative',
    'sip',
    'ppf',
    'compound',
    'gst',
    'bmi',
    'date-diff',
    'scientific',
    'unit-converter',
    'unit-area',
    'unit-length',
    'unit-temperature',
    'unit-volume',
    'unit-mass',
    'unit-data',
    'unit-speed',
    'unit-time',
  ];

  const matchedId = validCalculators.find((id) => id === cleanPath);
  const calculatorId: CalculatorId = matchedId || 'home';

  const params: Record<string, string> = {};
  if (queryString) {
    const searchParams = new URLSearchParams(queryString);
    searchParams.forEach((val, key) => {
      params[key] = val;
    });
  }

  return { calculatorId, params };
}

export function buildCalculatorUrl(
  calculatorId: CalculatorId,
  params?: Record<string, string | number | boolean>
): string {
  let url = `/#/${calculatorId}`;
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        searchParams.set(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  return url;
}

export function navigateToCalculator(
  calculatorId: CalculatorId,
  params?: Record<string, string | number | boolean>
) {
  const newUrl = buildCalculatorUrl(calculatorId, params);
  window.location.hash = newUrl.replace(/^\//, '');
}
