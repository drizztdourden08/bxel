/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';
import { CHANGE_TEXT } from './palette-change.constants';
import type { SwatchChoice } from './palette-change.type';
import { slotName } from './slot-name';

const swatchChoices = (bank: PaletteBank, exclude: number): SwatchChoice[] =>
  bank.slots.flatMap((_, index) =>
    index === exclude ? [] : [{ value: String(index), label: CHANGE_TEXT.swatchOption(index, slotName(bank, index)) }],
  );

export { swatchChoices };
