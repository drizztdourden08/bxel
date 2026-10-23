/* @layer core @kind logic */
import { BAYER_MATRICES } from './bayer-matrices';
import { DITHER_SPREAD_DEFAULT } from './dither-spread.constants';
import type { DitherOptions, DitherPlan } from './palette-map.type';

const buildDitherPlan = (options: DitherOptions): DitherPlan => {
  const { size } = options;
  const spread = options.spread ?? DITHER_SPREAD_DEFAULT;
  const cells = size * size;
  const offsets = Int32Array.from(BAYER_MATRICES[size], (rank) =>
    Math.floor(((2 * rank + 1 - cells) * spread) / (2 * cells)),
  );
  return { size, offsets, originX: options.originX ?? 0, originY: options.originY ?? 0 };
};

export { buildDitherPlan };
