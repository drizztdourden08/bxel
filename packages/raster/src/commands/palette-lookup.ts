/* @layer core @kind logic */
import { paletteRgba } from '@bxel/document';
import type { PaletteBank } from '@bxel/document';
import { CHANNELS } from './copy-region.constants';

const gap = (table: Uint8Array, at: number, rgb: readonly number[]): number =>
  rgb.reduce((sum, value, channel) => sum + ((table[at * CHANNELS + channel] ?? 0) - value) ** 2, 0);

const nearest = (target: Uint8Array, rgb: readonly number[]): number => {
  let best = 1;
  let bestGap = Number.POSITIVE_INFINITY;
  for (let at = 1; at < target.length / CHANNELS; at++) {
    const here = gap(target, at, rgb);
    if (here < bestGap) {
      best = at;
      bestGap = here;
    }
  }
  return best;
};

const paletteLookup = (from: PaletteBank, to: PaletteBank): Uint8Array => {
  const source = paletteRgba(from);
  const target = paletteRgba(to);
  return Uint8Array.from({ length: source.length / CHANNELS }, (_, at) => (at === 0 ? 0 : nearest(target, [source[at * CHANNELS] ?? 0, source[at * CHANNELS + 1] ?? 0, source[at * CHANNELS + 2] ?? 0])));
};

export { paletteLookup };
