/* @layer renderer-app @kind logic */
import { unionRect } from '@bxel/document';
import type { Rect } from '@bxel/raster';

const unionDirty = (first: Rect | null, second: Rect | null): Rect | null => {
  if (first && second) return unionRect(first, second);
  return first ?? second;
};

export { unionDirty };
