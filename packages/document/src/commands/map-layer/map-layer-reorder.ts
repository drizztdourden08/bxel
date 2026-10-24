/* @layer core @kind logic */
import { updateTilemap } from '../../draft/update-tilemap';
import { mapLayerReorderSchema } from '../../schema/map-layer-reorder-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { pickMapLayer } from '../tilemap/pick-map-layer';
import { pickTilemap } from '../tilemap/pick-tilemap';

const mapLayerReorder = defineCommand({
  name: COMMAND_NAME.mapLayerReorder,
  scope: 'none',
  schema: mapLayerReorderSchema,
  run: (draft, input) => {
    const { to } = input.options;
    const tilemap = pickTilemap(draft, input.options.tilemap);
    const { layer, index } = pickMapLayer(tilemap, input.options.layer);
    if (to >= tilemap.layers.length) {
      throw fail(ERROR_CODE.INDEX_OUT_OF_RANGE, 'The position is at or above the number of layers.', { path: 'options.to' });
    }
    if (index === to) return;
    const rest = tilemap.layers.filter((item) => item.id !== layer.id);
    updateTilemap(draft, tilemap.id, (current) => ({
      ...current,
      layers: [...rest.slice(0, to), layer, ...rest.slice(to)],
    }));
  },
});

export { mapLayerReorder };
