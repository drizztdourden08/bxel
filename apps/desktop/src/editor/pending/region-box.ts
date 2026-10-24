/* @layer renderer-app @kind logic */
import { maskBounds } from '@bxel/raster';
import type { MaskView, Rect } from '@bxel/raster';
import type { EditorTarget } from '../editor.type';

const regionBox = (target: EditorTarget, mask: MaskView | null): Rect =>
  (mask ? maskBounds(mask) : null) ?? { x: 0, y: 0, width: target.sprite.width, height: target.sprite.height };

export { regionBox };
