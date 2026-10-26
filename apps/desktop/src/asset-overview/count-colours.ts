/* @layer renderer-app @kind logic */
import type { RgbaImage } from '@bxel/formats';
import { COLOUR_KEY } from './asset-overview.constants';

const countColours = (images: readonly RgbaImage[]): number => {
  const seen = new Set<number>();
  const { channels, red, green } = COLOUR_KEY;
  for (const { data } of images) {
    for (let at = 0; at + channels <= data.length; at += channels) {
      if ((data[at + 3] ?? 0) > 0) seen.add((data[at] ?? 0) * red + (data[at + 1] ?? 0) * green + (data[at + 2] ?? 0));
    }
  }
  return seen.size;
};

export { countColours };
