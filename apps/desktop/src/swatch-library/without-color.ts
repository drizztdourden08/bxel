/* @layer renderer-app @kind logic */
import type { SwatchSet } from '@bxel/project';

const withoutColor = (set: SwatchSet, index: number): SwatchSet =>
  set.colors.length <= 1 ? set : { ...set, colors: set.colors.filter((_color, at) => at !== index) };

export { withoutColor };
