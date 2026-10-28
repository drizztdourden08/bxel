/* @layer core @kind logic */
import { oklabToOklch } from './oklab-to-oklch';
import { parseHex } from './parse-hex';
import { GREY_CHROMA, RAMP_RANK_STRIDE } from './palette-sort.constants';
import type { ColourSwatch, PaletteSortKey, SortInput } from './palette-sort.type';
import { relativeLuminance } from './relative-luminance';
import { rgbToOklab } from './rgb-to-oklab';

const lch = (swatch: ColourSwatch) => oklabToOklch(rgbToOklab(parseHex(swatch.rgb.slice(0, 7)) ?? 0));

const rampRank = ({ bank, swatch }: SortInput): number => {
  const ramp = bank.ramps.findIndex((each) => each.swatches.includes(swatch.id));
  const ramped = bank.ramps[ramp];
  return ramped ? ramp * RAMP_RANK_STRIDE + ramped.swatches.indexOf(swatch.id) : Number.MAX_SAFE_INTEGER;
};

const hueRank = ({ swatch }: SortInput): number => {
  const { l, c, h } = lch(swatch);
  return c < GREY_CHROMA ? l - 1 : h;
};

const sortValue = (key: PaletteSortKey, input: SortInput): number | string => {
  switch (key) {
    case 'lightness':
      return lch(input.swatch).l;
    case 'luminance':
      return relativeLuminance(parseHex(input.swatch.rgb.slice(0, 7)) ?? 0);
    case 'hue':
      return hueRank(input);
    case 'chroma':
      return lch(input.swatch).c;
    case 'name':
      return input.swatch.name.toLowerCase();
    case 'use':
      return input.usage[input.index] ?? 0;
    case 'ramp':
      return rampRank(input);
  }
};

export { sortValue };
