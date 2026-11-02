/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { useDrawingStore } from '../../stores/useDrawingStore';
import { currentTarget } from '../current-target';
import { tileSizeOfTarget } from '../tile-size-of-target';
import { nudgeStep } from './nudge-step';

const nudgeSteps = (fast: boolean): Point => {
  const pixels = nudgeStep(fast);
  if (fast || useDrawingStore.getState().nudgeUnit !== 'tile') return { x: pixels, y: pixels };
  const target = currentTarget();
  const tile = target === null ? null : tileSizeOfTarget(target);
  return tile === null ? { x: pixels, y: pixels } : { x: tile.width, y: tile.height };
};

export { nudgeSteps };
