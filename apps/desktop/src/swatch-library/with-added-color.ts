/* @layer renderer-app @kind logic */
import { MAX_SET_COLORS } from '@bxel/project';
import type { SwatchColor, SwatchSet } from '@bxel/project';

const withAddedColor = (set: SwatchSet, color: SwatchColor): SwatchSet =>
  set.colors.length >= MAX_SET_COLORS ? set : { ...set, colors: [...set.colors, color] };

export { withAddedColor };
