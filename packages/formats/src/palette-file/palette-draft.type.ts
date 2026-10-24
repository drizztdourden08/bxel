/* @layer core @kind types */
import type { PaletteColor } from './palette-file.type';

type GplDraft = {
  name: string;
  readonly colors: PaletteColor[];
};

export type { GplDraft };
