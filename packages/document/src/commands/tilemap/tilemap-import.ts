/* @layer core @kind logic */
import { tilemapImportSchema } from '../../schema/tilemap-import-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { addTilemap } from './add-tilemap';
import { importedLayers } from './imported-layers';

const tilemapImport = defineCommand({
  name: COMMAND_NAME.tilemapImport,
  scope: 'none',
  schema: tilemapImportSchema,
  run: (draft, input) => {
    const { options } = input;
    addTilemap(draft, input.ref, options, () => importedLayers(draft.ids, options.layers, options.columns * options.rows));
  },
});

export { tilemapImport };
