/* @layer renderer-app @kind logic */
import { foldCoord } from '@bxel/raster';
import type { RunSpan, RunWindow } from './wrap-runs.type';

const wrapRuns = ({ start, length, room, wrapped }: RunWindow): RunSpan[] => {
  if (!wrapped) {
    const first = Math.max(0, start);
    const last = Math.min(room, start + length);
    return last > first ? [{ start: first, length: last - first }] : [];
  }
  const runs: RunSpan[] = [];
  let at = foldCoord(start, room);
  let left = Math.min(length, room);
  while (left > 0) {
    const run = Math.min(left, room - at);
    runs.push({ start: at, length: run });
    left -= run;
    at = 0;
  }
  return runs;
};

export { wrapRuns };
