/* @layer renderer-app @kind logic */
import { currentCanvasSurface } from '../../../canvas-surface/current-canvas-surface';
import { currentTarget } from '../../../editor/current-target';
import { useSnapGridStore } from '../../../stores/useSnapGridStore';
import { MIN_STEP } from './tile-grid-lines.constants';
import type { GridLines } from './tile-grid-lines.type';

const along = (step: number, extent: number): number[] => Array.from({ length: Math.floor(extent / step) + 1 }, (_, at) => at * step);

const tileGridLines = (): GridLines | null => {
  const { grid } = useSnapGridStore.getState();
  const target = currentTarget();
  if (currentCanvasSurface() !== 'tile' || !grid || !target) return null;
  if (grid.width < MIN_STEP && grid.height < MIN_STEP) return null;
  return { x: along(Math.max(1, grid.width), target.sprite.width), y: along(Math.max(1, grid.height), target.sprite.height) };
};

export { tileGridLines };
