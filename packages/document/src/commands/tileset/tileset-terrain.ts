/* @layer core @kind logic */
import { updateTileset } from '../../draft/update-tileset';
import { terrainIssue } from '../../read/terrain-issue';
import { tilesetTerrainSchema } from '../../schema/tileset-terrain-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { pickTileset } from '../tilemap/pick-tileset';

const tilesetTerrain = defineCommand({
  name: COMMAND_NAME.tilesetTerrain,
  scope: 'none',
  schema: tilesetTerrainSchema,
  run: (draft, input) => {
    const tileset = pickTileset(draft, input.options.tileset);
    const { rules } = input.options;
    const issue = rules ? terrainIssue(rules, tileset) : null;
    if (issue !== null) throw fail(ERROR_CODE.INVALID_OPTION, issue, { path: 'options.rules' });
    updateTileset(draft, tileset.id, (current) => {
      const { terrain: dropped, ...rest } = current;
      return rules ? { ...rest, terrain: rules } : rest;
    });
  },
});

export { tilesetTerrain };
