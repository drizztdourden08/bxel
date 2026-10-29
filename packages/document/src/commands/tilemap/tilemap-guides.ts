/* @layer core @kind logic */
import { updateTilemap } from '../../draft/update-tilemap';
import { tilemapGuidesSchema } from '../../schema/tilemap-guides-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { withGuides } from '../guide/with-guides';
import { pickTilemap } from './pick-tilemap';

const tilemapGuides = defineCommand({
  name: COMMAND_NAME.tilemapGuides,
  scope: 'none',
  schema: tilemapGuidesSchema,
  run: (draft, input) => {
    const tilemap = pickTilemap(draft, input.options.tilemap);
    updateTilemap(draft, tilemap.id, (current) => withGuides(current, input.options.guides));
  },
});

export { tilemapGuides };
