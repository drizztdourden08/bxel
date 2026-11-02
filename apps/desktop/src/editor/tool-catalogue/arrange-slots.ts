/* @layer renderer-app @kind logic */
import type { SurfaceLayout } from './slot-layout.type';
import { SLOT_GROUPS } from './tool-catalogue.constants';
import type { ToolSlot } from './tool-catalogue.type';

const rankOf = (group: string): number => SLOT_GROUPS.findIndex((entry) => entry.id === group);

const arrangeSlots = (base: readonly ToolSlot[], layout: SurfaceLayout | undefined): ToolSlot[] => {
  const places = new Map((layout ?? []).map((place, at) => [place.id, { group: place.group, at }] as const));
  const placed = base.map((slot, index) => {
    const place = places.get(slot.id);
    const group = place?.group ?? slot.group;
    return { slot: group === slot.group ? slot : { ...slot, group }, rank: rankOf(group), at: place?.at ?? places.size + index };
  });
  return placed.sort((a, b) => a.rank - b.rank || a.at - b.at).map((entry) => entry.slot);
};

export { arrangeSlots };
