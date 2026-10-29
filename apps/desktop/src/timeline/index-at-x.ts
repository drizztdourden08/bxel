/* @layer renderer-app @kind logic */
import type { TrackLayout } from './track-layout.type';

const indexAtX = (layout: TrackLayout, x: number): number => {
  let found = 0;
  for (let index = 0; index < layout.lefts.length; index += 1) {
    if ((layout.lefts[index] ?? 0) <= x) found = index;
  }
  return found;
};

export { indexAtX };
