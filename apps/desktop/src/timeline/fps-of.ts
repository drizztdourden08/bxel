/* @layer renderer-app @kind logic */
import type { AnimSequence } from '@bxel/document';

const fpsOf = (sequence: Pick<AnimSequence, 'steps' | 'cycleMs'>): number =>
  sequence.cycleMs === 0 ? 0 : Math.round((1000 * sequence.steps.length * 10) / sequence.cycleMs) / 10;

export { fpsOf };
