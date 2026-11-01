/* @layer core @kind logic */
import { groupItems } from '../../layer-tree/group-items';
import { outermostItems } from '../../layer-tree/outermost-items';
import { NO_LOCK } from '../../model/layer-lock.constants';
import type { LayerId } from '../../model/ids.type';
import type { Layer } from '../../model/sprite.type';
import { requireSprite } from '../../read/require-sprite';
import { layerGroupSchema } from '../../schema/layer-group-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { chooseLayerName } from './choose-layer-name';
import { failIfAny } from './fail-if-any';
import { freeName } from './free-name';
import { GROUP_NAME } from './layer.constants';
import { layerIssue } from './layer-issue';
import { pickLayers } from './pick-layers';
import { registerLayerRef } from './register-layer-ref';
import { setTree } from './set-tree';

const layerGroup = defineCommand({
  name: COMMAND_NAME.layerGroup,
  scope: 'sprites',
  schema: layerGroupSchema,
  run: (draft, input) => {
    const created: LayerId[] = [];
    for (const spriteId of input.sprites) {
      const sprite = requireSprite(draft.artwork, spriteId);
      const picked = input.options.layers.flatMap((ref) => pickLayers(draft.artwork, [spriteId], ref).map((item) => item.layer));
      const members = outermostItems(sprite.layers, picked);
      const parents = new Set(members.map((layer) => layer.parentId));
      failIfAny(
        ERROR_CODE.INVALID_OPTION,
        'The layers of one group share one group today, or none.',
        parents.size > 1 ? members.map((layer) => layerIssue(spriteId, layer, 'it sits in another group')) : [],
      );
      const names = sprite.layers.map((layer) => layer.name);
      const parentId = members[0]?.parentId;
      const group: Layer = {
        id: draft.ids.next('lay') as LayerId,
        name: chooseLayerName(input.options.name, names, freeName(names, GROUP_NAME)),
        visible: true,
        lock: NO_LOCK,
        kind: 'group',
        ...(parentId ? { parentId } : {}),
        cels: {},
      };
      setTree(draft, spriteId, groupItems(sprite.layers, new Set(members.map((layer) => layer.id)), group));
      created.push(group.id);
    }
    registerLayerRef(draft, input, created);
  },
});

export { layerGroup };
