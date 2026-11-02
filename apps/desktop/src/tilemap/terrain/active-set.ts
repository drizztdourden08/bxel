/* @layer renderer-app @kind logic */
import { terrainSetsOf } from '@bxel/document';
import type { TerrainSet } from '@bxel/document';
import { useTilesetViewStore } from '../../stores/useTilesetViewStore';
import { currentTileset } from '../current-tileset';
import { chosenSet } from './chosen-set';

const activeSet = (id?: string): TerrainSet | undefined => {
  const tileset = currentTileset();
  if (!tileset) return undefined;
  return chosenSet(terrainSetsOf(tileset), id ?? useTilesetViewStore.getState().terrainSetId);
};

export { activeSet };
