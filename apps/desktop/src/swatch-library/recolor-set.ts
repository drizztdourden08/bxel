/* @layer renderer-app @kind logic */
import type { SwatchSet } from '@bxel/project';
import { withColor } from './with-color';

const recolorSet = (set: SwatchSet, index: number, rgb: string): SwatchSet => {
  const next = rgb.toLowerCase();
  const previous = set.colors[index];
  const name = previous === undefined || previous.name === previous.rgb ? next : previous.name;
  return withColor(set, index, { rgb: next, name });
};

export { recolorSet };
