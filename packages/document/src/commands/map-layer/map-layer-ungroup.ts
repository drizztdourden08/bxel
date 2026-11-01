/* @layer core @kind logic */
import { updateTilemap } from '../../draft/update-tilemap';
import { isGroupItem } from '../../layer-tree/is-group-item';
import { ungroupItems } from '../../layer-tree/ungroup-items';
import { mapLayerUngroupSchema } from '../../schema/map-layer-ungroup-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { pickMapLayer } from '../tilemap/pick-map-layer';
import { pickTilemap } from '../tilemap/pick-tilemap';

const mapLayerUngroup = defineCommand({
  name: COMMAND_NAME.mapLayerUngroup,
  scope: 'none',
  schema: mapLayerUngroupSchema,
  run: (draft, input) => {
    const tilemap = pickTilemap(draft, input.options.tilemap);
    const { layer } = pickMapLayer(tilemap, input.options.layer);
    if (!isGroupItem(layer)) throw fail(ERROR_CODE.LAYER_KIND, `Map layer "${layer.name}" is not a group.`, { path: 'options.layer' });
    updateTilemap(draft, tilemap.id, (current) => ({ ...current, layers: ungroupItems(current.layers, layer) }));
  },
});

export { mapLayerUngroup };
