/* @layer renderer-app @kind logic */
import { formatSwatchColor, swatchFields } from '@bxel/document';
import type { Rgb } from '@bxel/document';
import type { SwatchSet } from '@bxel/project';

const recolorSet = (set: SwatchSet, index: number, rgb: string, alpha?: number): SwatchSet => {
  const next = rgb.toLowerCase() as Rgb;
  const previous = set.colors[index];
  const kept = alpha ?? previous?.alpha;
  const unnamed = previous === undefined || previous.name === formatSwatchColor(previous.rgb as Rgb, previous.alpha);
  const name = unnamed ? formatSwatchColor(next, kept) : previous.name;
  return { ...set, colors: set.colors.map((color, at) => (at === index ? { ...swatchFields(next, kept), name } : color)) };
};

export { recolorSet };
