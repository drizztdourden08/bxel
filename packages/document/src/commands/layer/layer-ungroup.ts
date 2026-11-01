/* @layer core @kind logic */
import { isGroupItem } from '../../layer-tree/is-group-item';
import { ungroupItems } from '../../layer-tree/ungroup-items';
import { layerUngroupSchema } from '../../schema/layer-ungroup-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { failIfAny } from './fail-if-any';
import { layerIssue } from './layer-issue';
import { pickLayers } from './pick-layers';
import { setTree } from './set-tree';

const layerUngroup = defineCommand({
  name: COMMAND_NAME.layerUngroup,
  scope: 'sprites',
  schema: layerUngroupSchema,
  run: (draft, input) => {
    const picked = pickLayers(draft.artwork, input.sprites, input.options.layer);
    failIfAny(
      ERROR_CODE.LAYER_KIND,
      'Ungroup takes a group.',
      picked.filter(({ layer }) => !isGroupItem(layer)).map(({ sprite, layer }) => layerIssue(sprite.id, layer, 'not a group')),
    );
    for (const { sprite, layer } of picked) {
      setTree(draft, sprite.id, ungroupItems(sprite.layers, layer));
    }
  },
});

export { layerUngroup };
