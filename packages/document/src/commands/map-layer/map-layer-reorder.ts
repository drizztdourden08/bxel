/* @layer core @kind logic */
import { updateTilemap } from '../../draft/update-tilemap';
import { blockOf } from '../../layer-tree/block-of';
import { isGroupItem } from '../../layer-tree/is-group-item';
import { moveBlock } from '../../layer-tree/move-block';
import { reparentItem } from '../../layer-tree/reparent-item';
import { mapLayerReorderSchema } from '../../schema/map-layer-reorder-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { pickMapLayer } from '../tilemap/pick-map-layer';
import { pickTilemap } from '../tilemap/pick-tilemap';
import { checkMapTree } from './check-map-tree';

const mapLayerReorder = defineCommand({
  name: COMMAND_NAME.mapLayerReorder,
  scope: 'none',
  schema: mapLayerReorderSchema,
  run: (draft, input) => {
    const { to, parentId } = input.options;
    const tilemap = pickTilemap(draft, input.options.tilemap);
    const { layer } = pickMapLayer(tilemap, input.options.layer);
    if (to >= tilemap.layers.length) {
      throw fail(ERROR_CODE.INDEX_OUT_OF_RANGE, 'The position is at or above the number of layers.', { path: 'options.to' });
    }
    if (parentId && (blockOf(tilemap.layers, layer.id).has(parentId) || !isGroupItem(tilemap.layers.find((item) => item.id === parentId)))) {
      throw fail(ERROR_CODE.INVALID_OPTION, 'parentId names a group that holds this layer or is not a group.', { path: 'options.parentId' });
    }
    const layers = moveBlock(tilemap.layers, { id: layer.id, to, parentId, reparent: reparentItem });
    if (layers.every((item, index) => item === tilemap.layers[index])) return;
    checkMapTree(layers);
    updateTilemap(draft, tilemap.id, (current) => ({ ...current, layers }));
  },
});

export { mapLayerReorder };
