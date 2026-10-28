/* @layer renderer-app @kind logic */
import { hexToOklch, oklchToHex } from '@bxel/palette';
import { NUDGE_LIGHTNESS } from './palette-panel.constants';

const nudgedColour = (hex: string): string => {
  const colour = hexToOklch(hex);
  if (!colour) return '#808080';
  const l = colour.l > 1 - 2 * NUDGE_LIGHTNESS ? colour.l - NUDGE_LIGHTNESS : colour.l + NUDGE_LIGHTNESS;
  return oklchToHex({ ...colour, l });
};

export { nudgedColour };
