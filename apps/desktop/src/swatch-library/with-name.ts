/* @layer renderer-app @kind logic */
import { MAX_SET_NAME } from '@bxel/project';
import type { SwatchSet } from '@bxel/project';

const withName = (set: SwatchSet, name: string): SwatchSet => {
  const next = name.slice(0, MAX_SET_NAME);
  return next.trim() === '' ? set : { ...set, name: next };
};

export { withName };
