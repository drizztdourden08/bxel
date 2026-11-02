/* @layer renderer-app @kind constants */
import type { LayoutStep } from './move-tile.type';

const STEP_OF: Readonly<Record<LayoutStep, (columns: number) => number>> = {
  left: () => -1,
  right: () => 1,
  up: (columns) => -columns,
  down: (columns) => columns,
};

const LAYOUT_STEPS: readonly LayoutStep[] = ['left', 'right', 'up', 'down'];

export { LAYOUT_STEPS, STEP_OF };
