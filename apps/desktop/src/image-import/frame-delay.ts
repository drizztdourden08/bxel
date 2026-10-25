/* @layer renderer-app @kind logic */
import { DEFAULT_FRAME_DURATION_MS, MAX_DURATION_MS, MIN_DURATION_MS } from '@bxel/document';

const frameDelay = (delayMs: number): number =>
  delayMs < MIN_DURATION_MS ? DEFAULT_FRAME_DURATION_MS : Math.min(MAX_DURATION_MS, Math.round(delayMs));

export { frameDelay };
