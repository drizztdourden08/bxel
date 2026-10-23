/* @layer core @kind logic */
import { ALPHA_THRESHOLD_DEFAULT } from './alpha-threshold.constants';
import type { CensusOptions, ColorCensus, ColorEntry } from './census.type';
import type { RgbaImage } from './image.type';
import { packRgb } from './pack-rgb';

const byFrequencyThenValue = (a: ColorEntry, b: ColorEntry): number =>
  b.count - a.count || a.rgb - b.rgb;

const countColors = (image: RgbaImage, options: CensusOptions = {}): ColorCensus => {
  const threshold = options.alphaThreshold ?? ALPHA_THRESHOLD_DEFAULT;
  const { data } = image;
  const tally = new Map<number, number>();
  let opaquePixels = 0;
  for (let at = 0; at + 3 < data.length; at += 4) {
    if ((data[at + 3] ?? 0) < threshold) continue;
    const rgb = packRgb(data[at] ?? 0, data[at + 1] ?? 0, data[at + 2] ?? 0);
    tally.set(rgb, (tally.get(rgb) ?? 0) + 1);
    opaquePixels += 1;
  }
  const colors = [...tally].map(([rgb, count]) => ({ rgb, count })).sort(byFrequencyThenValue);
  const total = Math.floor(data.length / 4);
  return { colors, opaquePixels, transparentPixels: total - opaquePixels };
};

export { countColors };
