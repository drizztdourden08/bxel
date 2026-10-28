/* @layer core @kind logic */
import { paletteRgba } from '@bxel/document';
import type { Artwork, SpriteId } from '@bxel/document';
import type { ResampleOptions } from '../resample/resample.type';
import { CHANNELS, OPAQUE, RGB_SPAN } from './palette-options.constants';


const paletteOptions = (artwork: Artwork, spriteId: SpriteId | undefined, similar: number): ResampleOptions => {
  const sprite = artwork.sprites.find((each) => each.id === spriteId);
  const bank = artwork.banks.find((each) => each.id === sprite?.bankId);
  if (!bank) return { similar };
  const table = paletteRgba(bank);
  const channel = (index: number, at: number): number => table[index * CHANNELS + at] ?? 0;
  const luma = Array.from({ length: bank.slots.length }, (_, index) => {
    const alpha = channel(index, 3);
    return (channel(index, 0) + channel(index, 1) + channel(index, 2) + 1) * (OPAQUE + 1 - alpha);
  });
  const distance = (a: number, b: number): number =>
    Math.hypot(channel(a, 0) - channel(b, 0), channel(a, 1) - channel(b, 1), channel(a, 2) - channel(b, 2)) / RGB_SPAN;
  return { luma, distance, similar };
};

export { paletteOptions };
