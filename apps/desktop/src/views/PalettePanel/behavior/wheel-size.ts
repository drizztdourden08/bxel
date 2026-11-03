/* @layer renderer-app @kind logic */
import { SWATCH_SIZES } from '../../../palette-view/palette-view.constants';
import type { SwatchSize } from '../../../palette-view/palette-view.type';

const wheelSize = (size: SwatchSize, direction: 1 | -1): SwatchSize => {
  const next = SWATCH_SIZES.indexOf(size) + direction;
  return SWATCH_SIZES[Math.max(0, Math.min(SWATCH_SIZES.length - 1, next))] ?? size;
};

export { wheelSize };
