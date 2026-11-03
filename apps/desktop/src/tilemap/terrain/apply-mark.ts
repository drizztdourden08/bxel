/* @layer renderer-app @kind logic */
import { terrainSetsOf } from '@bxel/document';
import { useTilesetViewStore } from '../../stores/useTilesetViewStore';
import { currentTileset } from '../current-tileset';
import { setTerrainSets } from '../set-terrain-sets';
import { activeSet } from './active-set';
import { markEdit } from './mark-edit';
import { maskOfTile } from './mask-of-tile';
import { TERRAIN_TEXT } from './terrain.constants';

const applyMark = (key: number, bit: number, on: boolean): void => {
  const set = activeSet();
  const tileset = currentTileset();
  if (!set || !tileset) return;
  const store = useTilesetViewStore.getState();
  const mask = store.markDrafts[key] ?? maskOfTile(set, key) ?? 0;
  const edit = markEdit({ set, mask, key, bit, on });
  if (!edit.changed) return;
  const made = edit.set;
  if (!made) {
    store.setMarkDraft(key, edit.mask);
    return;
  }
  store.setMarkDraft(key, null);
  setTerrainSets(terrainSetsOf(tileset).map((each) => (each.id === set.id ? made : each)), TERRAIN_TEXT.marks);
};

export { applyMark };
