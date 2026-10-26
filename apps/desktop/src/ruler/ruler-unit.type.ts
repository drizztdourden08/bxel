/* @layer renderer-app @kind types */
type RulerUnit = 'pixels' | 'tiles' | 'percent';

interface UnitScale {
  size: number;
  total: number;
  suffix: string;
}

export type { RulerUnit, UnitScale };
