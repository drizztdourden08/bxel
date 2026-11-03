/* @layer renderer-app @kind logic */
import type { SlotPlace } from './slot-layout.type';
import { TOOL_SLOTS } from './tool-catalogue.constants';
import type { ToolSlot } from './tool-catalogue.type';

const sameIds = (a: readonly string[], b: readonly string[]): boolean => a.length === b.length && a.every((id, at) => id === b[at]);

const placeOf = (slot: Pick<ToolSlot, 'group' | 'id' | 'members'>): SlotPlace => {
  const ids = slot.members.map((member) => member.id);
  const base = TOOL_SLOTS.find((each) => each.id === slot.id);
  return base !== undefined && sameIds(base.members.map((member) => member.id), ids) ? { id: slot.id, group: slot.group } : { id: slot.id, group: slot.group, members: ids };
};

export { placeOf };
