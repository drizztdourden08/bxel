/* @layer core @kind logic */
import { updateTilemap } from '../../draft/update-tilemap';
import { tilemapUpdateSchema } from '../../schema/tilemap-update-schema';
import { assertNameFree } from '../../validate/assert-name-free';
import { checkName } from '../../validate/check-name';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { pickTilemap } from './pick-tilemap';

const tilemapUpdate = defineCommand({
  name: COMMAND_NAME.tilemapUpdate,
  scope: 'none',
  schema: tilemapUpdateSchema,
  run: (draft, input) => {
    const tilemap = pickTilemap(draft, input.options.tilemap);
    const name = checkName(input.options.name);
    const others = draft.artwork.tilemaps.filter((item) => item.id !== tilemap.id).map((item) => item.name);
    assertNameFree(others, name);
    if (name !== tilemap.name) updateTilemap(draft, tilemap.id, (current) => ({ ...current, name }));
  },
});

export { tilemapUpdate };
