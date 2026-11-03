/* @layer renderer-app @kind logic */
import { runsMask } from '@bxel/raster';
import type { MaskView } from '@bxel/raster';
import type { EditorTarget } from '../../editor/editor.type';
import type { Shape } from './selection-step.type';

const savedIncoming = (shape: Shape, target: EditorTarget): MaskView | 'missing' | 'resized' | null => {
  if (shape.kind !== 'saved') return null;
  const saved = target.sprite.selections?.find((each) => each.name === shape.name);
  if (!saved) return 'missing';
  const { width, height } = target.sprite;
  return saved.width === width && saved.height === height ? runsMask(target.sprite, saved.runs) : 'resized';
};

export { savedIncoming };
