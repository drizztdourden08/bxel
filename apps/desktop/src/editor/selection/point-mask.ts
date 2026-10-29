/* @layer renderer-app @kind logic */
import { indexMask, wandMask } from '@bxel/raster';
import type { Connectivity, MaskView, Point } from '@bxel/raster';
import { useSelectionStore } from '../../stores/useSelectionStore';
import type { EditorTarget } from '../editor.type';
import { samplePixels } from './sample-pixels';

const pointMask = (target: EditorTarget, by: 'wand' | 'colour', at: Point, connectivity?: Connectivity): MaskView => {
  const { width, height } = target.sprite;
  const buffer = { pixels: samplePixels(target), width, height };
  if (by === 'wand') return wandMask({ target: buffer, seed: at, connectivity: connectivity ?? useSelectionStore.getState().connectivity });
  return indexMask(buffer, buffer.pixels[at.y * width + at.x] ?? 0);
};

export { pointMask };
