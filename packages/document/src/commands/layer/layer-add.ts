/* @layer core @kind logic */
import type { LayerId } from '../../model/ids.type';
import { requireSprite } from '../../read/require-sprite';
import { layerAddSchema } from '../../schema/layer-add-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { chooseLayerName } from './choose-layer-name';
import { insertLayer } from './insert-layer';
import { nextLayerName } from './next-layer-name';
import { pickLayers } from './pick-layers';
import { registerLayerRef } from './register-layer-ref';

const layerAdd = defineCommand({
  name: COMMAND_NAME.layerAdd,
  scope: 'sprites',
  schema: layerAddSchema,
  run: (draft, input) => {
    const { name, above } = input.options;
    const anchors = above ? pickLayers(draft.artwork, input.sprites, above) : [];
    const created: LayerId[] = [];
    for (const spriteId of input.sprites) {
      const sprite = requireSprite(draft.artwork, spriteId);
      const names = sprite.layers.map((layer) => layer.name);
      const layer = {
        id: draft.ids.next('lay') as LayerId,
        name: chooseLayerName(name, names, nextLayerName(names)),
        visible: true,
        locked: false,
        cels: {},
      };
      const anchor = anchors.find((picked) => picked.sprite.id === spriteId);
      insertLayer(draft, spriteId, layer, anchor ? anchor.index + 1 : sprite.layers.length);
      created.push(layer.id);
    }
    registerLayerRef(draft, input, created);
  },
});

export { layerAdd };
