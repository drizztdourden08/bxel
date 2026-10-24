/* @layer renderer-app @kind logic */
import { indexMask, wandMask } from '@bxel/raster';
import type { Connectivity, MaskView, Point } from '@bxel/raster';
import type { EditorTarget } from '../editor.type';
import { celPixels } from './cel-pixels';

const pointMask = (target: EditorTarget, by: 'wand' | 'colour', at: Point, connectivity: Connectivity): MaskView => {
  const { width, height } = target.sprite;
  const buffer = { pixels: celPixels(target), width, height };
  if (by === 'wand') return wandMask({ target: buffer, seed: at, connectivity });
  return indexMask(buffer, buffer.pixels[at.y * width + at.x] ?? 0);
};

export { pointMask };
