/* @layer core @kind logic */
import { updateTileset } from '../../draft/update-tileset';
import { terrainSetsIssue } from '../../read/terrain-sets-issue';
import { tilesetTerrainSetsSchema } from '../../schema/tileset-terrain-sets-schema';
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
    const { sets } = input.options;
    const issue = sets ? terrainSetsIssue(sets, tileset) : null;
    if (issue !== null) throw fail(ERROR_CODE.INVALID_OPTION, issue, { path: 'options.sets' });
    updateTileset(draft, tileset.id, (current) => {
      const { terrain: _terrain, terrainSets: _sets, ...rest } = current;
      return sets && sets.length > 0 ? { ...rest, terrainSets: sets } : rest;
    });
  },
});

export { tilesetTerrainSets };
