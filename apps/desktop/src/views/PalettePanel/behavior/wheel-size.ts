/* @layer renderer-app @kind logic */
import { SWATCH_SIZES } from '../../../palette-view/palette-view.constants';
import type { SwatchSize } from '../../../palette-view/palette-view.type';

const wheelSize = (size: SwatchSize, deltaY: number): SwatchSize => {
  const at = SWATCH_SIZES.indexOf(size);
  const next = deltaY < 0 ? at + 1 : at - 1;
  return SWATCH_SIZES[Math.max(0, Math.min(SWATCH_SIZES.length - 1, next))] ?? size;
};

export { wheelSize };
