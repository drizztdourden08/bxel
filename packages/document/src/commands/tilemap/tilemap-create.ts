/* @layer core @kind logic */
import { DEFAULT_LAYER_NAME } from '../../model/limits.constants';
import { tilemapCreateSchema } from '../../schema/tilemap-create-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { chooseLayerName } from '../layer/choose-layer-name';
import { addTilemap } from './add-tilemap';
import { buildMapLayer } from './build-map-layer';

const tilemapCreate = defineCommand({
  name: COMMAND_NAME.tilemapCreate,
  scope: 'none',
  schema: tilemapCreateSchema,
  run: (draft, input) => {
    const { options } = input;
    const layerName = chooseLayerName(options.layerName, [], DEFAULT_LAYER_NAME);
    addTilemap(draft, input.ref, options, () => [buildMapLayer(draft.ids, layerName, options.columns * options.rows)]);
  },
});

export { tilemapCreate };
