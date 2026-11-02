/* @layer renderer-app @kind logic */
import type { ResizeSpec } from '../sheet-manager/manager.type';

const up = (side: number, step: number): number => Math.max(step, Math.ceil(side / step) * step);

const snapToTiles = (spec: ResizeSpec, tile: { width: number; height: number }): ResizeSpec => ({
  ...spec,
  width: up(spec.width, tile.width),
  height: up(spec.height, tile.height),
});

export { snapToTiles };
