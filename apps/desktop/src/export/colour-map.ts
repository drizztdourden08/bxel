/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';
import { bankRgba } from './bank-rgba';
import { colourKey } from './colour-key';
import { EXPORT_LIMITS, TRANSPARENT_RGBA } from './export.constants';
import type { ColourBuilder, ColourMapResult, Target } from './export.type';

const addColour = (builder: ColourBuilder, data: ArrayLike<number>, at: number): void => {
  const key = colourKey(data, at);
  if (builder.lookup.has(key)) return;
  builder.lookup.set(key, builder.rgba.length / 4);
  builder.rgba.push(...(key === 0 ? TRANSPARENT_RGBA : [data[at] ?? 0, data[at + 1] ?? 0, data[at + 2] ?? 0, data[at + 3] ?? 0]));
};

const banksOf = (targets: readonly Target[]): PaletteBank[] => {
  const seen = new Map<string, PaletteBank>();
  for (const target of targets) if (!seen.has(target.bank.id)) seen.set(target.bank.id, target.bank);
  return [...seen.values()];
};

const colourMap = (targets: readonly Target[]): ColourMapResult => {
  const banks = banksOf(targets);
  const builder: ColourBuilder = { rgba: [], lookup: new Map() };
  if (banks.length > 1) addColour(builder, TRANSPARENT_RGBA, 0);
  for (const bank of banks) {
    const table = bankRgba(bank);
    for (let slot = 0; slot < table.length / 4; slot += 1) addColour(builder, table, slot * 4);
  }
  addColour(builder, TRANSPARENT_RGBA, 0);
  const colours = builder.rgba.length / 4;
  if (colours > EXPORT_LIMITS.maxColours) return { ok: false, banks: banks.length, colours };
  const bankName = banks.length === 1 ? (banks[0]?.name ?? '') : '';
  return {
    ok: true,
    map: { palette: Uint8Array.from(builder.rgba), lookup: builder.lookup, bankName, banks: banks.length, opaque: colours - 1 },
  };
};

export { colourMap };
