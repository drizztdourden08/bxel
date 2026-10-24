/* @layer core @kind logic */
import { addCel } from '../../draft/add-cel';
import { setCelSlot } from '../../draft/set-cel-slot';
import type { SlotAction } from './cel.type';
import { slotOf } from './slot-of';

const copyCel: SlotAction = (draft, { source, target }) => {
  const pixels = source.celId ? source.sprite.cels[source.celId]?.pixels : undefined;
  setCelSlot(draft, slotOf(target), pixels ? addCel(draft, source.sprite.id, pixels.slice()) : null);
};

export { copyCel };
