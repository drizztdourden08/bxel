/* @layer renderer-app @kind logic */
import { placeOf } from './place-of';
import type { MemberMove, SurfaceLayout } from './slot-layout.type';
import type { SlotGroupId, ToolMember, ToolSlot } from './tool-catalogue.type';

type Held = { id: string; group: SlotGroupId; members: ToolMember[] };

const ownId = (slots: readonly ToolSlot[], source: ToolSlot, member: ToolMember): string =>
  slots.some((slot) => slot.id === member.id && !(slot === source && slot.members.length === 1)) ? `${member.id}.alone` : member.id;

const moveMember = (slots: readonly ToolSlot[], move: MemberMove): SurfaceLayout => {
  const source = slots.find((slot) => slot.members.some((each) => each.id === move.member));
  const member = source?.members.find((each) => each.id === move.member);
  const unchanged = (): SurfaceLayout => slots.map(placeOf);
  if (source === undefined || member === undefined || move.to === source.id) return unchanged();
  if (move.to !== null && !slots.some((slot) => slot.id === move.to)) return unchanged();
  const without = (slot: ToolSlot): ToolMember[] => slot.members.filter((each) => each !== member);
  const held = slots.flatMap((slot): Held[] => {
    if (slot !== source) return [{ id: slot.id, group: slot.group, members: slot.id === move.to ? [...slot.members, member] : [...slot.members] }];
    const rest: Held[] = without(slot).length === 0 ? [] : [{ id: slot.id, group: slot.group, members: without(slot) }];
    return move.to === null ? [...rest, { id: ownId(slots, source, member), group: move.group ?? slot.group, members: [member] }] : rest;
  });
  return held.map(placeOf);
};

export { moveMember };
