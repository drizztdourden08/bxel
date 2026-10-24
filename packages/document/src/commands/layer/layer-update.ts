/* @layer core @kind logic */
import { layerUpdateSchema } from '../../schema/layer-update-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { chooseLayerName } from './choose-layer-name';
import { pickLayers } from './pick-layers';
import { replaceLayer } from './replace-layer';

const layerUpdate = defineCommand({
  name: COMMAND_NAME.layerUpdate,
  scope: 'sprites',
  schema: layerUpdateSchema,
  run: (draft, input) => {
    const { options } = input;
    for (const { sprite, layer } of pickLayers(draft.project, input.sprites, options.layer)) {
      const others = sprite.layers.filter((item) => item.id !== layer.id).map((item) => item.name);
      const name = chooseLayerName(options.name, others, layer.name);
      const visible = options.visible ?? layer.visible;
      const locked = options.locked ?? layer.locked;
      const same = name === layer.name && visible === layer.visible && locked === layer.locked;
      if (!same) replaceLayer(draft, sprite.id, { ...layer, name, visible, locked });
    }
  },
});

export { layerUpdate };
