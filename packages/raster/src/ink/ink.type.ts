/* @layer core @kind types */
type DitherPattern = 'checker' | 'bayer' | 'rows' | 'columns' | 'dots';

type Ink =
  | { readonly kind: 'normal' }
  | { readonly kind: 'behind' }
  | { readonly kind: 'lockAlpha' }
  | { readonly kind: 'onlyColour'; readonly index: number }
  | { readonly kind: 'dither'; readonly pattern: DitherPattern; readonly level: number; readonly second: number }
  | { readonly kind: 'shade'; readonly ramp?: string; readonly direction: 'up' | 'down'; readonly steps: number }
  | { readonly kind: 'lighten'; readonly steps: number }
  | { readonly kind: 'darken'; readonly steps: number }
  | { readonly kind: 'pattern'; readonly brushId: string; readonly originX: number; readonly originY: number };

type InkApply = (current: number, x: number, y: number, value: number) => number | null;

type InkRule = { readonly once: boolean; readonly apply: InkApply };

export type { DitherPattern, Ink, InkApply, InkRule };
