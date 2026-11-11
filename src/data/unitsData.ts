export type UnitCategoryType = 
  | 'length' 
  | 'area' 
  | 'temperature' 
  | 'volume' 
  | 'mass' 
  | 'data' 
  | 'speed' 
  | 'time';

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  factor?: number; // relative to base unit
  toBase?: (val: number) => number;
  fromBase?: (baseVal: number) => number;
}

export interface UnitCategory {
  id: UnitCategoryType;
  name: string;
  icon: string;
  description: string;
  baseUnit: string;
  units: UnitDefinition[];
  formulaHelp?: string;
}

export const UNIT_CATEGORIES: Record<UnitCategoryType, UnitCategory> = {
  length: {
    id: 'length',
    name: 'Length & Distance',
    icon: 'Ruler',
    description: 'Convert meters, kilometers, miles, feet, inches, yards, and nautical units',
    baseUnit: 'm',
    units: [
      { id: 'm', name: 'Meter', symbol: 'm', factor: 1 },
      { id: 'km', name: 'Kilometer', symbol: 'km', factor: 1000 },
      { id: 'cm', name: 'Centimeter', symbol: 'cm', factor: 0.01 },
      { id: 'mm', name: 'Millimeter', symbol: 'mm', factor: 0.001 },
      { id: 'mi', name: 'Mile', symbol: 'mi', factor: 1609.344 },
      { id: 'yd', name: 'Yard', symbol: 'yd', factor: 0.9144 },
      { id: 'ft', name: 'Foot', symbol: 'ft', factor: 0.3048 },
      { id: 'in', name: 'Inch', symbol: 'in', factor: 0.0254 },
      { id: 'nmi', name: 'Nautical Mile', symbol: 'nmi', factor: 1852 },
      { id: 'um', name: 'Micrometer', symbol: 'µm', factor: 1e-6 },
      { id: 'nm', name: 'Nanometer', symbol: 'nm', factor: 1e-9 },
    ],
  },

  area: {
    id: 'area',
    name: 'Area & Land Measurement',
    icon: 'Maximize2',
    description: 'Convert square feet, square meters, acres, hectares, guntha, bigha, and square miles',
    baseUnit: 'sq_m',
    units: [
      { id: 'sq_m', name: 'Square Meter', symbol: 'm²', factor: 1 },
      { id: 'sq_ft', name: 'Square Foot', symbol: 'sq ft', factor: 0.09290304 },
      { id: 'acre', name: 'Acre', symbol: 'ac', factor: 4046.8564224 },
      { id: 'hectare', name: 'Hectare', symbol: 'ha', factor: 10000 },
      { id: 'sq_km', name: 'Square Kilometer', symbol: 'km²', factor: 1000000 },
      { id: 'sq_yd', name: 'Square Yard', symbol: 'sq yd', factor: 0.83612736 },
      { id: 'sq_in', name: 'Square Inch', symbol: 'sq in', factor: 0.00064516 },
      { id: 'sq_mi', name: 'Square Mile', symbol: 'sq mi', factor: 2589988.11 },
      { id: 'guntha', name: 'Guntha (Indian)', symbol: 'guntha', factor: 101.171 },
      { id: 'bigha', name: 'Bigha (Standard)', symbol: 'bigha', factor: 2529.285 },
    ],
  },

  temperature: {
    id: 'temperature',
    name: 'Temperature',
    icon: 'Thermometer',
    description: 'Convert between Celsius (°C), Fahrenheit (°F), and Kelvin (K)',
    baseUnit: 'c',
    units: [
      {
        id: 'c',
        name: 'Celsius',
        symbol: '°C',
        toBase: (v) => v,
        fromBase: (c) => c,
      },
      {
        id: 'f',
        name: 'Fahrenheit',
        symbol: '°F',
        toBase: (f) => ((f - 32) * 5) / 9,
        fromBase: (c) => (c * 9) / 5 + 32,
      },
      {
        id: 'k',
        name: 'Kelvin',
        symbol: 'K',
        toBase: (k) => k - 273.15,
        fromBase: (c) => c + 273.15,
      },
    ],
  },

  volume: {
    id: 'volume',
    name: 'Volume & Capacity',
    icon: 'Droplets',
    description: 'Convert liters, milliliters, gallons, cubic meters, fluid ounces, pints, and cups',
    baseUnit: 'l',
    units: [
      { id: 'l', name: 'Liter', symbol: 'L', factor: 1 },
      { id: 'ml', name: 'Milliliter', symbol: 'mL', factor: 0.001 },
      { id: 'cum', name: 'Cubic Meter', symbol: 'm³', factor: 1000 },
      { id: 'gal_us', name: 'Gallon (US)', symbol: 'gal (US)', factor: 3.785411784 },
      { id: 'gal_uk', name: 'Gallon (Imperial)', symbol: 'gal (UK)', factor: 4.54609 },
      { id: 'cuft', name: 'Cubic Foot', symbol: 'cu ft', factor: 28.316846592 },
      { id: 'floz_us', name: 'Fluid Ounce (US)', symbol: 'fl oz', factor: 0.0295735295625 },
      { id: 'pt_us', name: 'Pint (US)', symbol: 'pt', factor: 0.473176473 },
      { id: 'qt_us', name: 'Quart (US)', symbol: 'qt', factor: 0.946352946 },
      { id: 'cup_us', name: 'Cup (US)', symbol: 'cup', factor: 0.2365882365 },
      { id: 'tbsp', name: 'Tablespoon (US)', symbol: 'tbsp', factor: 0.0147868 },
      { id: 'tsp', name: 'Teaspoon (US)', symbol: 'tsp', factor: 0.00492892 },
    ],
  },

  mass: {
    id: 'mass',
    name: 'Mass & Weight',
    icon: 'Scale',
    description: 'Convert kilograms, grams, milligrams, pounds, ounces, metric tons, and carats',
    baseUnit: 'kg',
    units: [
      { id: 'kg', name: 'Kilogram', symbol: 'kg', factor: 1 },
      { id: 'g', name: 'Gram', symbol: 'g', factor: 0.001 },
      { id: 'mg', name: 'Milligram', symbol: 'mg', factor: 1e-6 },
      { id: 'lb', name: 'Pound', symbol: 'lb', factor: 0.45359237 },
      { id: 'oz', name: 'Ounce', symbol: 'oz', factor: 0.028349523125 },
      { id: 'ton', name: 'Metric Ton', symbol: 't', factor: 1000 },
      { id: 'stone', name: 'Stone (UK)', symbol: 'st', factor: 6.35029318 },
      { id: 'carat', name: 'Carat', symbol: 'ct', factor: 0.0002 },
      { id: 'quintal', name: 'Quintal', symbol: 'q', factor: 100 },
    ],
  },

  data: {
    id: 'data',
    name: 'Data Storage & Memory',
    icon: 'HardDrive',
    description: 'Convert bytes, kilobytes, megabytes, gigabytes, terabytes, petabytes, and bits',
    baseUnit: 'b',
    units: [
      { id: 'b', name: 'Byte', symbol: 'B', factor: 1 },
      { id: 'bit', name: 'Bit', symbol: 'bit', factor: 0.125 },
      { id: 'kb', name: 'Kilobyte', symbol: 'KB', factor: 1024 },
      { id: 'mb', name: 'Megabyte', symbol: 'MB', factor: 1048576 },
      { id: 'gb', name: 'Gigabyte', symbol: 'GB', factor: 1073741824 },
      { id: 'tb', name: 'Terabyte', symbol: 'TB', factor: 1099511627776 },
      { id: 'pb', name: 'Petabyte', symbol: 'PB', factor: 1125899906842624 },
      { id: 'kbit', name: 'Kilobit', symbol: 'Kb', factor: 128 },
      { id: 'mbit', name: 'Megabit', symbol: 'Mb', factor: 131072 },
      { id: 'gbit', name: 'Gigabit', symbol: 'Gb', factor: 134217728 },
    ],
  },

  speed: {
    id: 'speed',
    name: 'Speed & Velocity',
    icon: 'Gauge',
    description: 'Convert kilometers per hour (km/h), miles per hour (mph), m/s, knots, and ft/s',
    baseUnit: 'ms',
    units: [
      { id: 'ms', name: 'Meter per second', symbol: 'm/s', factor: 1 },
      { id: 'kmh', name: 'Kilometer per hour', symbol: 'km/h', factor: 0.277777778 },
      { id: 'mph', name: 'Mile per hour', symbol: 'mph', factor: 0.44704 },
      { id: 'knot', name: 'Knot', symbol: 'kn', factor: 0.514444 },
      { id: 'fts', name: 'Foot per second', symbol: 'ft/s', factor: 0.3048 },
      { id: 'mach', name: 'Mach (Sound in Air)', symbol: 'Mach', factor: 343 },
    ],
  },

  time: {
    id: 'time',
    name: 'Time Duration',
    icon: 'Clock',
    description: 'Convert seconds, minutes, hours, days, weeks, months, years, and decades',
    baseUnit: 's',
    units: [
      { id: 's', name: 'Second', symbol: 's', factor: 1 },
      { id: 'ms', name: 'Millisecond', symbol: 'ms', factor: 0.001 },
      { id: 'min', name: 'Minute', symbol: 'min', factor: 60 },
      { id: 'h', name: 'Hour', symbol: 'hr', factor: 3600 },
      { id: 'd', name: 'Day', symbol: 'day', factor: 86400 },
      { id: 'wk', name: 'Week', symbol: 'wk', factor: 604800 },
      { id: 'mo', name: 'Month (Avg)', symbol: 'mo', factor: 2629800 },
      { id: 'yr', name: 'Year (Calendar)', symbol: 'yr', factor: 31536000 },
      { id: 'dec', name: 'Decade', symbol: 'decade', factor: 315360000 },
    ],
  },
};

/**
 * Universal conversion function between any two units in a category
 */
export function convertUnit(
  value: number,
  categoryType: UnitCategoryType,
  fromUnitId: string,
  toUnitId: string
): number {
  if (isNaN(value)) return 0;
  if (fromUnitId === toUnitId) return value;

  const category = UNIT_CATEGORIES[categoryType];
  if (!category) return value;

  const fromUnit = category.units.find((u) => u.id === fromUnitId);
  const toUnit = category.units.find((u) => u.id === toUnitId);

  if (!fromUnit || !toUnit) return value;

  // Temperature uses custom functions
  if (categoryType === 'temperature') {
    const baseCelsius = fromUnit.toBase ? fromUnit.toBase(value) : value;
    return toUnit.fromBase ? toUnit.fromBase(baseCelsius) : baseCelsius;
  }

  // Linear factor conversion
  const fromFactor = fromUnit.factor ?? 1;
  const toFactor = toUnit.factor ?? 1;

  const baseValue = value * fromFactor;
  return baseValue / toFactor;
}

/**
 * Get all conversions for a given value in a category
 */
export function getAllConversions(
  value: number,
  categoryType: UnitCategoryType,
  fromUnitId: string
): { unit: UnitDefinition; convertedValue: number }[] {
  const category = UNIT_CATEGORIES[categoryType];
  if (!category) return [];

  return category.units.map((unit) => ({
    unit,
    convertedValue: convertUnit(value, categoryType, fromUnitId, unit.id),
  }));
}

