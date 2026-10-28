/* @layer core @kind logic */
import type { PaletteBank, Swatch } from '@bxel/document';
import { oklabToOklch } from './oklab-to-oklch';
import { parseHex } from './parse-hex';
import { GREY_CHROMA, RAMP_RANK_STRIDE } from './palette-sort.constants';
import type { PaletteSortKey } from './palette-sort.type';
import { relativeLuminance } from './relative-luminance';
import { rgbToOklab } from './rgb-to-oklab';

type ColourSwatch = Extract<Swatch, { kind: 'color' }>;

interface SortInput {
  readonly bank: PaletteBank;
  readonly swatch: ColourSwatch;
  readonly index: number;
  readonly usage: ArrayLike<number>;
}

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

const SORT_VALUE: Readonly<Record<PaletteSortKey, (input: SortInput) => number | string>> = {
  lightness: ({ swatch }) => lch(swatch).l,
  luminance: ({ swatch }) => relativeLuminance(parseHex(swatch.rgb.slice(0, 7)) ?? 0),
  hue: hueRank,
  chroma: ({ swatch }) => lch(swatch).c,
  name: ({ swatch }) => swatch.name.toLowerCase(),
  use: ({ usage, index }) => usage[index] ?? 0,
  ramp: rampRank,
};

const sortValue = (key: PaletteSortKey, input: SortInput): number | string => SORT_VALUE[key](input);

export { sortValue };
