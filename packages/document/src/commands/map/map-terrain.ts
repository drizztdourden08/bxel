/* @layer core @kind logic */
import { editLayerCells } from '../../draft/edit-layer-cells';
import { mapTerrainSchema } from '../../schema/map-terrain-schema';
import { applyTerrain } from '../../terrain/apply-terrain';
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
    const rules = opened.tileset.terrain;
    if (!rules || rules.keys.every((key) => key === 0)) {
      throw fail(ERROR_CODE.INVALID_OPTION, `Tileset "${opened.tileset.name}" has no terrain rules with tiles assigned.`, { path: 'options.tilemap' });
    }
    const indexes = placementIndexes(opened.tilemap, options);
    const grid = { width: opened.tilemap.columns, height: opened.tilemap.rows };
    editLayerCells(draft, opened, (cells) => applyTerrain(cells, grid, rules, { indexes, erase: options.mode === 'erase' }));
  },
});

export { mapTerrain };
