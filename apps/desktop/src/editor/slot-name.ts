/* @layer renderer-app @kind logic */
import type { EditorTarget } from './editor.type';
import { paletteSlots } from './palette-slots';
import { STATUS_TEXT } from './status.constants';

const slotName = (target: EditorTarget, index: number | null): string => {
  const slot = index === null ? undefined : paletteSlots(target.bank)[index];
  return slot ? STATUS_TEXT.colour(slot.index, slot.name) : STATUS_TEXT.outside;
};

export { slotName };
