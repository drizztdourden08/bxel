/* @layer core @kind logic */
import { editLayerCells } from '../../draft/edit-layer-cells';
import { terrainSetsOf } from '../../read/terrain-sets-of';
import { mapTerrainSchema } from '../../schema/map-terrain-schema';
import { applyTerrainSet } from '../../terrain/apply-terrain-set';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { openLayer } from '../tilemap/open-layer';
import { placementIndexes } from '../tilemap/placement-indexes';

const mapTerrain = defineCommand({
  name: COMMAND_NAME.mapTerrain,
  scope: 'none',
  schema: mapTerrainSchema,
  run: (draft, input) => {
    const { options } = input;
    const opened = openLayer(draft, options);
    const wanted = options.set;
    const sets = terrainSetsOf(opened.tileset);
    const set = wanted === undefined ? sets[0] : sets.find((each) => each.id === wanted || each.name === wanted);
    if (!set || set.slots.every((slot) => slot.length === 0)) {
      throw fail(ERROR_CODE.INVALID_OPTION, `Tileset "${opened.tileset.name}" has no terrain rules with tiles assigned.`, { path: 'options.tilemap' });
    }
    const indexes = placementIndexes(opened.tilemap, options);
    const grid = { width: opened.tilemap.columns, height: opened.tilemap.rows };
    editLayerCells(draft, opened, (cells) => applyTerrainSet(cells, grid, set, { indexes, erase: options.mode === 'erase' }));
  },
});

export { mapTerrain };
