/* @layer renderer-app @kind logic */
import { opaqueSlots } from '../palette-limit/opaque-slots';
import { fitColors } from './fit-colors';
import { FALLBACK_BACKGROUND } from './palette-source.constants';
import type { BankPlan, PaletteSource } from './palette-source.type';
import { sourceColors } from './source-colors';
import { sourceName } from './source-name';

const bankPlan = (source: PaletteSource, limit: number, transparent: boolean): BankPlan => {
  const fitted = fitColors(sourceColors(source), opaqueSlots(limit, transparent));
  const colors = fitted.colors.length === 0 && !transparent ? [FALLBACK_BACKGROUND] : fitted.colors;
  return { bank: { name: sourceName(source), cap: limit, transparent, colors }, dropped: fitted.dropped };
};

export { bankPlan };
