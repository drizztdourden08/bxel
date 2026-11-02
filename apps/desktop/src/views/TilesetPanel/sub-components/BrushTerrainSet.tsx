/* @layer renderer-app @kind component */
import { terrainSetsOf } from '@bxel/document';
import { Select } from '@drizztdourden08/tessera';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import { chosenSet } from '../../../tilemap/terrain/chosen-set';
import { TERRAIN_TEXT } from '../../../tilemap/terrain/terrain.constants';
import type { TilesetModelProps } from '../TilesetPanel.type';

const BrushTerrainSet = ({ model }: TilesetModelProps) => {
  const id = useTilesetViewStore((state) => state.terrainSetId);
  const select = useTilesetViewStore((state) => state.setTerrainSetId);
  const sets = terrainSetsOf(model.tileset);
  const set = chosenSet(sets, id);
  if (!set || sets.length < 2) return null;
  return <Select size="sm" aria-label={TERRAIN_TEXT.setPicker} options={sets.map((each) => ({ value: each.id, label: each.name }))} value={set.id} onChange={select} />;
};

export { BrushTerrainSet };
