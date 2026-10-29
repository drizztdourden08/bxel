/* @layer renderer-app @kind logic */
import { terrainSetsOf } from '@bxel/document';
import { useTilemapStore } from '../../stores/useTilemapStore';
import { useTilesetViewStore } from '../../stores/useTilesetViewStore';
import type { MapTarget } from '../tilemap.type';
import { chosenSet } from './chosen-set';

const terrainActive = (target: MapTarget): boolean => {
  if (!useTilemapStore.getState().terrainBrush) return false;
  const set = chosenSet(terrainSetsOf(target.tileset), useTilesetViewStore.getState().terrainSetId);
  return set?.slots.some((slot) => slot.length > 0) ?? false;
};

export { terrainActive };
