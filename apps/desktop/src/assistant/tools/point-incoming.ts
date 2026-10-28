/* @layer renderer-app @kind logic */
import { indexMask } from '@bxel/raster';
import type { MaskView } from '@bxel/raster';
import type { EditorTarget } from '../../editor/editor.type';
import { celPixels } from '../../editor/selection/cel-pixels';
import { pointMask } from '../../editor/selection/point-mask';
import type { Shape } from './selection-step.type';

const pointIncoming = (shape: Shape, target: EditorTarget): MaskView | 'outside' | null => {
  const { width, height } = target.sprite;
  if (shape.kind === 'colour') return indexMask({ pixels: celPixels(target), width, height }, shape.index);
  if (shape.kind !== 'wand') return null;
  const inside = shape.x >= 0 && shape.y >= 0 && shape.x < width && shape.y < height;
  return inside ? pointMask(target, 'wand', { x: shape.x, y: shape.y }, shape.connectivity) : 'outside';
};

export { pointIncoming };
