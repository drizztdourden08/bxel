/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';
import { paletteSlots } from '../../../editor/palette-slots';
import { STRIP_LENGTH } from '../PalettePanel.constants';

const stripColours = (bank: PaletteBank): string[] =>
  paletteSlots(bank)
    .filter((slot) => !slot.transparent)
    .slice(0, STRIP_LENGTH)
    .map((slot) => slot.hex);

export { stripColours };
