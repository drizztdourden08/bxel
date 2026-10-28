/* @layer core @kind logic */
import { updateTilemap } from '../../draft/update-tilemap';
import { tilemapGuidesSchema } from '../../schema/tilemap-guides-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { copyGuides } from '../guide/copy-guides';
import { pickTilemap } from './pick-tilemap';

const tilemapGuides = defineCommand({
  name: COMMAND_NAME.tilemapGuides,
  scope: 'none',
  schema: tilemapGuidesSchema,
  run: (draft, input) => {
    const tilemap = pickTilemap(draft, input.options.tilemap);
    updateTilemap(draft, tilemap.id, (current) => {
      const { guides: _old, ...rest } = current;
      const guides = copyGuides(input.options.guides);
      return guides ? { ...rest, guides } : rest;
    });
  },
});

export { tilemapGuides };
