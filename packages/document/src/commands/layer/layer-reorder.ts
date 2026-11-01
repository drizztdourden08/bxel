/* @layer core @kind logic */
import { blockOf } from '../../layer-tree/block-of';
import { isGroupItem } from '../../layer-tree/is-group-item';
import { moveBlock } from '../../layer-tree/move-block';
import { layerReorderSchema } from '../../schema/layer-reorder-schema';
import { ERROR_CODE } from '../error-code.constants';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { failIfAny } from './fail-if-any';
import { layerIssue } from './layer-issue';
import { pickLayers } from './pick-layers';
import { reparentItem } from '../../layer-tree/reparent-item';
import { setTree } from './set-tree';

const layerReorder = defineCommand({
  name: COMMAND_NAME.layerReorder,
  scope: 'sprites',
  schema: layerReorderSchema,
  run: (draft, input) => {
    const { layer: ref, to, parentId } = input.options;
    const picked = pickLayers(draft.artwork, input.sprites, ref);
    failIfAny(
      ERROR_CODE.INDEX_OUT_OF_RANGE,
      'The position is at or above the number of layers.',
      picked.filter(({ sprite }) => to >= sprite.layers.length).map(({ sprite, layer }) => layerIssue(sprite.id, layer, `position ${to} is past the top`)),
    );
    failIfAny(
      ERROR_CODE.INVALID_OPTION,
      'parentId names a group that holds this layer or is not a group.',
      picked
        .filter(({ sprite, layer }) => parentId && (blockOf(sprite.layers, layer.id).has(parentId) || !isGroupItem(sprite.layers.find((item) => item.id === parentId))))
        .map(({ sprite, layer }) => layerIssue(sprite.id, layer, 'it cannot join that group')),
    );
    for (const { sprite, layer } of picked) {
      const layers = moveBlock(sprite.layers, { id: layer.id, to, parentId, reparent: reparentItem });
      if (layers.some((item, index) => item !== sprite.layers[index])) setTree(draft, sprite.id, layers);
    }
  },
});

export { layerReorder };
