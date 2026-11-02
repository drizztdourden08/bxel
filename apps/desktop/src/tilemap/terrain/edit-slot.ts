/* @layer renderer-app @kind logic */
import { terrainSetsOf } from '@bxel/document';
import { currentTileset } from '../current-tileset';
import { pickedKey } from '../picked-key';
import { setTerrainSets } from '../set-terrain-sets';
import { activeSet } from './active-set';
import type { SlotEdit } from './edit-slot.type';
import { slotChange } from './slot-change';
import { updateSlot } from './update-slot';

const editSlot = ({ slot, action, key, set }: SlotEdit): boolean => {
  const tileset = currentTileset();
  const target = activeSet(set);
  const tile = key ?? pickedKey();
  if (!tileset || !target || slot < 0 || slot >= target.slots.length) return false;
  if (action !== 'clear' && tile === null) return false;
  const next = updateSlot(target, slot, slotChange(action, tile ?? 0));
  return setTerrainSets(terrainSetsOf(tileset).map((each) => (each.id === target.id ? next : each)));
};

export { editSlot };
