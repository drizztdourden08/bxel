/* @layer renderer-app @kind logic */
import { placeOf } from './place-of';
import type { SlotMove, SurfaceLayout } from './slot-layout.type';
import { SLOT_GROUPS } from './tool-catalogue.constants';
import type { ToolSlot } from './tool-catalogue.type';

const rankOf = (group: string): number => SLOT_GROUPS.findIndex((entry) => entry.id === group);

const endOfGroup = (places: SurfaceLayout, group: string): number => {
  const rank = rankOf(group);
  const last = places.reduce((found, place, at) => (rankOf(place.group) <= rank ? at : found), -1);
  return last + 1;
};

const moveSlot = (slots: readonly ToolSlot[], move: SlotMove): SurfaceLayout => {
  const places = slots.map(placeOf);
  const from = places.findIndex((place) => place.id === move.id);
  if (from < 0) return places;
  const [moved] = places.splice(from, 1);
  const target = move.before === null ? -1 : places.findIndex((place) => place.id === move.before);
  const at = target >= 0 ? target : endOfGroup(places, move.group);
  places.splice(at, 0, { ...(moved ?? { id: move.id }), group: target >= 0 ? (places[target]?.group ?? move.group) : move.group });
  return places;
};

export { moveSlot };
