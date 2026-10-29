/* @layer renderer-app @kind logic */
import { TICK_FPS } from './track-layout.constants';

const ticksOf = (ms: number): number => Math.round((ms * TICK_FPS) / 1000);

export { ticksOf };
