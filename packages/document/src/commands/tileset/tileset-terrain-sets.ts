/* @layer core @kind logic */
import { updateTileset } from '../../draft/update-tileset';
import { terrainSetsIssue } from '../../read/terrain-sets-issue';
import { terrainSetsOf } from '../../read/terrain-sets-of';
import { tilesetTerrainSetsSchema } from '../../schema/tileset-terrain-sets-schema';
import { fillSetFromPacking } from '../../terrain/fill-set-from-packing';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { pickTileset } from '../tilemap/pick-tileset';

const tilesetTerrainSets = defineCommand({
  name: COMMAND_NAME.tilesetTerrainSets,
  scope: 'none',
  schema: tilesetTerrainSetsSchema,
  run: (draft, input) => {
    const tileset = pickTileset(draft, input.options.tileset);
    const { sets, fill } = input.options;
    if (sets === undefined && fill === undefined) throw fail(ERROR_CODE.INVALID_OPTION, 'Give sets, fill or both.', { path: 'options.sets' });
    const issue = sets ? terrainSetsIssue(sets, tileset) : null;
    if (issue !== null) throw fail(ERROR_CODE.INVALID_OPTION, issue, { path: 'options.sets' });
    const written = sets === undefined ? terrainSetsOf(tileset) : (sets ?? []);
    const filled = fill === undefined ? written : fillSetFromPacking(tileset, written, fill);
    if (typeof filled === 'string') throw fail(ERROR_CODE.INVALID_OPTION, filled, { path: 'options.fill' });
    updateTileset(draft, tileset.id, (current) => {
      const { terrain: _terrain, terrainSets: _sets, ...rest } = current;
      return filled.length > 0 ? { ...rest, terrainSets: filled } : rest;
    });
  },
});

export { tilesetTerrainSets };
