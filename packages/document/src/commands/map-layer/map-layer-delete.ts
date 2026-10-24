/* @layer core @kind logic */
import { updateTilemap } from '../../draft/update-tilemap';
import { mapLayerDeleteSchema } from '../../schema/map-layer-delete-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { pickMapLayer } from '../tilemap/pick-map-layer';
import { pickTilemap } from '../tilemap/pick-tilemap';

const mapLayerDelete = defineCommand({
  name: COMMAND_NAME.mapLayerDelete,
  scope: 'none',
  schema: mapLayerDeleteSchema,
  run: (draft, input) => {
    const { options } = input;
    const tilemap = pickTilemap(draft, options.tilemap);
    const { layer } = pickMapLayer(tilemap, options.layer);
    if (tilemap.layers.length === 1) throw fail(ERROR_CODE.LAST_LAYER, 'A tilemap keeps at least one layer.');
    if (layer.locked && options.allowLocked !== true) {
      throw fail(ERROR_CODE.LAYER_LOCKED, `Map layer "${layer.name}" is locked. Pass allowLocked to delete it.`);
    }
    updateTilemap(draft, tilemap.id, (current) => ({
      ...current,
      layers: current.layers.filter((item) => item.id !== layer.id),
    }));
  },
});

export { mapLayerDelete };
