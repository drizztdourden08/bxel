/* @layer renderer-app @kind logic */
import type { SwatchColor, SwatchSet } from '@bxel/project';

const withColor = (set: SwatchSet, index: number, change: Partial<SwatchColor>): SwatchSet => ({
  ...set,
  colors: set.colors.map((color, at) => (at === index ? { ...color, ...change } : color)),
});

export { withColor };
