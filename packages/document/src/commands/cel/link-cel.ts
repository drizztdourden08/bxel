/* @layer core @kind logic */
import { ensureCel } from '../../draft/ensure-cel';
import { setCelSlot } from '../../draft/set-cel-slot';
import type { SlotAction } from './cel.type';
import { slotOf } from './slot-of';

const linkCel: SlotAction = (draft, { source, target }) => {
  const celId = source.celId ?? ensureCel(draft, { ...slotOf(source), celId: null });
  setCelSlot(draft, slotOf(target), celId);
};

export { linkCel };
