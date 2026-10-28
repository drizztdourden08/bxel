/* @layer core @kind types */
type RampHueMode = 'shift' | 'straight';

interface RampSpan {
  readonly dark: number;
  readonly light: number;
}

interface RampSwatch {
  readonly index: number;
  readonly hex: string;
}

interface RampBuildOptions {
  readonly base: string;
  readonly baseIndex?: number | null;
  readonly light: number;
  readonly dark: number;
  readonly hueShift: number;
  readonly hueMode: RampHueMode;
  readonly span?: RampSpan;
  readonly chromaCurve: boolean;
  readonly snap: number;
  readonly existing: readonly RampSwatch[];
}

interface RampStep {
  readonly offset: number;
  readonly hex: string;
  readonly l: number;
  readonly c: number;
  readonly h: number;
  readonly reuses: number | null;
}

interface RampBuild {
  readonly steps: readonly RampStep[];
  readonly added: number;
  readonly span: RampSpan;
}

interface StepShape {
  readonly offset: number;
  readonly side: number;
  readonly count: number;
}

export type { RampBuild, RampBuildOptions, RampHueMode, RampSpan, RampStep, RampSwatch, StepShape };
