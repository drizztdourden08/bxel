/* @layer renderer-app @kind logic */
import { CHANNEL_TOP } from '../PalettePanel.constants';

const rgbStops = (rgb: readonly number[], channel: number): string[] =>
  [0, CHANNEL_TOP].map((value) => `rgb(${rgb.map((each, at) => (at === channel ? value : each)).join(' ')})`);

export { rgbStops };
