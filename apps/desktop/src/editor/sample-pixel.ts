/* @layer renderer-app @kind logic */
import { sampleIndex } from '@bxel/document';
import type { Point } from '@bxel/raster';
import { useDrawingStore } from '../stores/useDrawingStore';
import type { EditorTarget } from './editor.type';

const layerSample = (target: EditorTarget, at: Point): number | null => {
  const { sprite } = target;
  if (at.x < 0 || at.y < 0 || at.x >= sprite.width || at.y >= sprite.height) return null;
  const celId = target.layer.cels[target.frameId];
  return (celId === undefined ? undefined : sprite.cels[celId]?.pixels[at.y * sprite.width + at.x]) ?? 0;
};

const samplePixel = (target: EditorTarget, at: Point): number | null =>
  useDrawingStore.getState().pickSample === 'layer' ? layerSample(target, at) : sampleIndex(target.sprite, target.frameId, at);

export { samplePixel };
