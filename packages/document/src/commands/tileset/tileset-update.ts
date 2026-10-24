/* @layer core @kind logic */
import { updateTileset } from '../../draft/update-tileset';
import { tilesetUpdateSchema } from '../../schema/tileset-update-schema';
import { assertNameFree } from '../../validate/assert-name-free';
import { checkName } from '../../validate/check-name';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { pickTileset } from '../tilemap/pick-tileset';

const tilesetUpdate = defineCommand({
  name: COMMAND_NAME.tilesetUpdate,
  scope: 'none',
  schema: tilesetUpdateSchema,
  run: (draft, input) => {
    const tileset = pickTileset(draft, input.options.tileset);
    const name = checkName(input.options.name);
    const others = draft.artwork.tilesets.filter((item) => item.id !== tileset.id).map((item) => item.name);
    assertNameFree(others, name);
    if (name !== tileset.name) updateTileset(draft, tileset.id, (current) => ({ ...current, name }));
  },
});

export { tilesetUpdate };
