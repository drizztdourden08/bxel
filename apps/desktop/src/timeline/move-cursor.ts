/* @layer renderer-app @kind logic */
import { currentTarget } from '../editor/current-target';
import type { CelMove } from './timeline.type';
import { goToCel } from './go-to-cel';

const clamp = (value: number, total: number): number => Math.min(Math.max(value, 0), total - 1);

const moveCursor = (by: CelMove, extend: boolean): void => {
  const target = currentTarget();
  if (!target) return;
  const { frames, layers } = target.sprite;
  const frame = frames[clamp(frames.findIndex((each) => each.id === target.frameId) + by.frames, frames.length)];
  const layer = layers[clamp(layers.findIndex((each) => each.id === target.layerId) + by.layers, layers.length)];
  if (frame && layer) goToCel({ layerId: layer.id, frameId: frame.id }, extend);
};

export { moveCursor };
