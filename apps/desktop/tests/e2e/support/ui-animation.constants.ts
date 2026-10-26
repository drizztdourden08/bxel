/* @layer renderer-app @kind constants */
import type { Cell } from './e2e.type';

const UI_ANIMATION = {
  side: 16,
  durations: [100, 250, 400],
  swatches: [2, 3, 4],
  tag: 'run',
  file: 'run.bxanim',
  strokes: [
    [{ x: 1, y: 1 }, { x: 4, y: 1 }],
    [{ x: 1, y: 4 }, { x: 4, y: 4 }],
    [{ x: 1, y: 8 }, { x: 4, y: 8 }],
  ] satisfies readonly (readonly Cell[])[],
} as const;

export { UI_ANIMATION };
