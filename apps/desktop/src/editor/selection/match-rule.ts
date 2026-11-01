/* @layer renderer-app @kind logic */
import { OPAQUE_ALPHA } from '@bxel/document';
import type { PaletteBank, Swatch } from '@bxel/document';
import type { MatchKind } from './selection.type';

const channels = (swatch: Swatch | undefined): readonly number[] => {
  if (!swatch || swatch.kind === 'transparent') return [0, 0, 0, 0];
  const value = Number.parseInt(swatch.rgb.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255, swatch.alpha ?? OPAQUE_ALPHA];
};

const distanceBetween = (a: Swatch | undefined, b: Swatch | undefined): number => {
  const left = channels(a);
  const right = channels(b);
  return Math.max(...left.map((each, at) => Math.abs(each - (right[at] ?? 0))));
};

const sameRamp = (bank: PaletteBank, a: Swatch | undefined, b: Swatch | undefined): boolean =>
  a !== undefined && b !== undefined && bank.ramps.some((ramp) => ramp.swatches.includes(a.id) && ramp.swatches.includes(b.id));

const matchRule = (kind: MatchKind, bank: PaletteBank, distance: number): ((seed: number, index: number) => boolean) => {
  if (kind === 'ramp') return (seed, index) => seed === index || sameRamp(bank, bank.slots[seed], bank.slots[index]);
  if (kind === 'similar') return (seed, index) => seed === index || distanceBetween(bank.slots[seed], bank.slots[index]) <= distance;
  return (seed, index) => seed === index;
};

export { matchRule };
