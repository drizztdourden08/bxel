/* @layer renderer-app @kind logic */
import type { SlotMove } from './slot-layout.type';
import type { ToolSlot } from './tool-catalogue.type';

const stepSlot = (slots: readonly ToolSlot[], id: string, step: 1 | -1): SlotMove | null => {
  const at = slots.findIndex((slot) => slot.id === id);
  const own = slots[at];
  const next = slots[at + step];
  if (own === undefined || next === undefined) return null;
  if (next.group !== own.group) return { id, group: next.group, before: step === 1 ? next.id : null };
  if (step === -1) return { id, group: own.group, before: next.id };
  const after = slots[at + 2];
  return { id, group: own.group, before: after !== undefined && after.group === own.group ? after.id : null };
};

export { stepSlot };
