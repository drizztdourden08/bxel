/* @layer renderer-app @kind logic */
import { oklchToHex } from '@bxel/palette';
import type { Oklch } from '@bxel/palette';
import { CHANNEL_STOPS } from '../PalettePanel.constants';

const oklchStops = (colour: Oklch, channel: keyof Oklch, max: number): string[] =>
  Array.from({ length: CHANNEL_STOPS }, (_, at) => oklchToHex({ ...colour, [channel]: (max * at) / (CHANNEL_STOPS - 1) }));

export { oklchStops };
