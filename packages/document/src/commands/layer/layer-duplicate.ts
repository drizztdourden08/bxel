/* @layer core @kind logic */
import type { LayerId } from '../../model/ids.type';
import type { Layer } from '../../model/sprite.type';
import { layerDuplicateSchema } from '../../schema/layer-duplicate-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { chooseLayerName } from './choose-layer-name';
import { copyLayerCels } from './copy-layer-cels';
import { freeName } from './free-name';
import { insertLayer } from './insert-layer';
import { COPY_SUFFIX } from './layer.constants';
import { pickLayers } from './pick-layers';
import { registerLayerRef } from './register-layer-ref';

const layerDuplicate = defineCommand({
  name: COMMAND_NAME.layerDuplicate,
  scope: 'sprites',
  schema: layerDuplicateSchema,
  run: (draft, input) => {
    const { layer: ref, name } = input.options;
    const created: LayerId[] = [];
    for (const { sprite, layer, index } of pickLayers(draft.artwork, input.sprites, ref)) {
      const names = sprite.layers.map((item) => item.name);
      const copy: Layer = {
        id: draft.ids.next('lay') as LayerId,
        name: chooseLayerName(name, names, freeName(names, `${layer.name}${COPY_SUFFIX}`)),
        visible: layer.visible,
        locked: false,
        ...(layer.lockTransparency === true ? { lockTransparency: true } : {}),
        ...(layer.colour === undefined ? {} : { colour: layer.colour }),
        cels: copyLayerCels(draft, sprite, layer),
      };
      insertLayer(draft, sprite.id, copy, index + 1);
      created.push(copy.id);
    }
    registerLayerRef(draft, input, created);
  },
});

export { layerDuplicate };
