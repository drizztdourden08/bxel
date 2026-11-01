/* @layer core @kind logic */
import { NO_LOCK } from '../../model/layer-lock.constants';
import type { LayerId } from '../../model/ids.type';
import { layerAddSchema } from '../../schema/layer-add-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { addLayers } from './add-layers';
import { chooseLayerName } from './choose-layer-name';
import { nextLayerName } from './next-layer-name';

const layerAdd = defineCommand({
  name: COMMAND_NAME.layerAdd,
  scope: 'sprites',
  schema: layerAddSchema,
  run: (draft, input) => {
    const { name, above } = input.options;
    addLayers(draft, input, above, (sprite, names, anchor) => ({
      layer: {
        id: draft.ids.next('lay') as LayerId,
        name: chooseLayerName(name, names, nextLayerName(names)),
        visible: true,
        lock: NO_LOCK,
        cels: {},
      },
      at: anchor ? anchor.index + 1 : sprite.layers.length,
    }));
  },
});

export { layerAdd };
