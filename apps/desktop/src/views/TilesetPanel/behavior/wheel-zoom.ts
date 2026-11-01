/* @layer renderer-app @kind logic */
import type { ThumbZoom } from '../../../stores/tileset-view-store.type';

const STEPS: readonly ThumbZoom[] = [1, 2, 3, 4];

const wheelZoom = (current: number, deltaY: number): ThumbZoom => {
  const at = Math.max(0, STEPS.findIndex((step) => step >= current));
  const next = Math.min(STEPS.length - 1, Math.max(0, at + (deltaY < 0 ? 1 : -1)));
  return STEPS[next] ?? 1;
};

export { wheelZoom };
