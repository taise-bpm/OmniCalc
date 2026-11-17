import { CalculatorId } from '../types';

export interface RouteState {
  calculatorId: CalculatorId;
  params: Record<string, string>;
}

export function parseHashUrl(): RouteState {
  // 1. Check hash first: #/emi or #emi
  let pathStr = window.location.hash.replace(/^#\/?/, '');

  // 2. Fallback to pathname if hash is empty (for direct SEO links /emi, /fd, etc.)
  if (!pathStr) {
    const rawPath = window.location.pathname.replace(/^\/+/g, '').replace(/\/+$/g, '');
    if (rawPath && rawPath !== 'index.html') {
      pathStr = rawPath;
    }
  }

  if (!pathStr || pathStr === 'home') {
    return { calculatorId: 'home', params: {} };
  }

  const [path, queryString] = pathStr.split('?');
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
  const queryToParse = queryString || window.location.search.replace(/^\?/, '');
  if (queryToParse) {
    const searchParams = new URLSearchParams(queryToParse);
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
  const path = calculatorId === 'home' ? '/' : `/${calculatorId}`;
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        searchParams.set(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      return `${path}?${queryString}`;
    }
  }
  return path;
}

export function navigateToCalculator(
  calculatorId: CalculatorId,
  params?: Record<string, string | number | boolean>
) {
  const newUrl = buildCalculatorUrl(calculatorId, params);
  if (typeof window !== 'undefined' && window.history && window.history.pushState) {
    window.history.pushState(null, '', newUrl);
    window.dispatchEvent(new Event('popstate'));
  } else {
    window.location.hash = `#${newUrl}`;
  }
}
