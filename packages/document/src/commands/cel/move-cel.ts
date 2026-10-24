/* @layer core @kind logic */
import { setCelSlot } from '../../draft/set-cel-slot';
import type { SlotAction } from './cel.type';
import { slotOf } from './slot-of';

const moveCel: SlotAction = (draft, { source, target }) => {
  setCelSlot(draft, slotOf(target), source.celId ?? null);
  setCelSlot(draft, slotOf(source), null);
};

export { moveCel };
