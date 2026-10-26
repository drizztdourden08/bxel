/* @layer core @kind types */
import type { BankId, RampId, SwatchId } from './ids.type';

type Rgb = `#${string}`;

type Swatch =
  | { readonly id: SwatchId; readonly kind: 'transparent' }
  | { readonly id: SwatchId; readonly kind: 'color'; readonly rgb: Rgb; readonly alpha?: number; readonly name: string };

type Ramp = { readonly id: RampId; readonly name: string; readonly swatches: readonly SwatchId[] };

type PaletteBank = {
  readonly id: BankId;
  readonly name: string;
  readonly created?: number;
  readonly cap: number;
  readonly transparent: boolean;
  readonly slots: readonly Swatch[];
  readonly ramps: readonly Ramp[];
};

export type { PaletteBank, Ramp, Rgb, Swatch };
