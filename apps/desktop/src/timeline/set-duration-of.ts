/* @layer renderer-app @kind logic */
import type { AnimFrameId } from '@bxel/document';
import { setDurations } from './set-durations';

const setDurationOf = (ids: readonly AnimFrameId[], durationMs: number): boolean =>
  Number.isFinite(durationMs) && setDurations(new Map(ids.map((id) => [id, durationMs])));

export { setDurationOf };
