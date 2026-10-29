/* @layer renderer-app @kind hook */
import { terrainSetsOf } from '@bxel/document';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import { chosenSet } from '../../../tilemap/terrain/chosen-set';
import type { TilesetModel } from '../TilesetPanel.type';
import type { TerrainChoice } from './useTerrainSet.type';

const useTerrainSet = (model: TilesetModel): TerrainChoice => {
  const id = useTilesetViewStore((state) => state.terrainSetId);
  const sets = terrainSetsOf(model.tileset);
  return { sets, set: chosenSet(sets, id) };
};

export { useTerrainSet };
