/* @layer renderer-app @kind logic */
import { maskBounds } from '@bxel/raster';
import type { Rect } from '@bxel/raster';
import type { EditorTarget } from '../editor.type';
import { selectionMask } from './selection-mask';

const selectionBounds = (target: EditorTarget): Rect | null => {
  const mask = selectionMask(target);
  return mask ? maskBounds(mask) : null;
};

export { selectionBounds };
