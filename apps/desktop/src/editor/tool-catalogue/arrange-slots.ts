/* @layer renderer-app @kind logic */
import type { SurfaceLayout } from './slot-layout.type';
import { slotClaims } from './slot-claims';
import { slotMembers } from './slot-members';
import { SLOT_GROUPS } from './tool-catalogue.constants';
import type { ToolMember, ToolSlot } from './tool-catalogue.type';

const rankOf = (group: string): number => SLOT_GROUPS.findIndex((entry) => entry.id === group);

const withMembers = (slot: ToolSlot, members: readonly ToolMember[]): ToolSlot => {
  const [first] = members;
  if (members.length === slot.members.length && members.every((member, at) => member === slot.members[at])) return slot;
  const tool = members.some((member) => member.tool === slot.tool) || first === undefined ? slot.tool : first.tool;
  return { ...slot, tool, members };
};

const arrangeSlots = (base: readonly ToolSlot[], layout: SurfaceLayout | undefined): ToolSlot[] => {
  const places = new Map((layout ?? []).map((place, at) => [place.id, { place, at }] as const));
  const claims = slotClaims(layout ?? []);
  const found = new Map(base.flatMap((slot) => slot.members.map((member) => [member.id, member] as const)));
  const origin = new Map(base.flatMap((slot) => slot.members.map((member) => [member.id, slot] as const)));
  const baseIds = new Set(base.map((slot) => slot.id));
  const own = base.map((slot) => withMembers(slot, slotMembers({ placeId: slot.id, own: slot.members, place: places.get(slot.id)?.place, claims, found })));
  const made = (layout ?? [])
    .filter((place) => !baseIds.has(place.id))
    .flatMap((place): ToolSlot[] => {
      const members = slotMembers({ placeId: place.id, own: [], place, claims, found });
      const [first] = members;
      const from = first === undefined ? undefined : origin.get(first.id);
      return first === undefined || from === undefined ? [] : [{ id: place.id, group: place.group, label: first.label, key: from.key, tool: first.tool, surfaces: from.surfaces, members }];
    });
  const placed = [...own, ...made]
    .filter((slot) => slot.members.length > 0)
    .map((slot, index) => {
      const place = places.get(slot.id);
      const group = place?.place.group ?? slot.group;
      return { slot: group === slot.group ? slot : { ...slot, group }, rank: rankOf(group), at: place?.at ?? places.size + index };
    });
  return placed.sort((a, b) => a.rank - b.rank || a.at - b.at).map((entry) => entry.slot);
};

export { arrangeSlots };
