/* @layer renderer-app @kind logic */
import { maskBounds } from '@bxel/raster';
import type { MaskView } from '@bxel/raster';
import { EXTRA_TEXT } from './status-extras.constants';

const selectionExtra = (mask: MaskView | null): string | null => {
  const box = mask ? maskBounds(mask) : null;
  return box ? EXTRA_TEXT.selectionValue(box.width, box.height, box.x, box.y) : null;
};

export { selectionExtra };
