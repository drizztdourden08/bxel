/* @layer core @kind logic */
import type { Layer } from '../../model/sprite.type';
import type { LayerUpdateOptions } from '../../schema/command-options.type';
import { layerUpdateSchema } from '../../schema/layer-update-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { chooseLayerName } from './choose-layer-name';
import { pickLayers } from './pick-layers';
import { replaceLayer } from './replace-layer';
import { withLayerColour } from './with-layer-colour';

const withTransparencyLock = (layer: Layer, wanted: boolean | undefined): Layer => {
  if (wanted === undefined || wanted === (layer.lockTransparency === true)) return layer;
  const next: { -readonly [Key in keyof Layer]: Layer[Key] } = { ...layer };
  if (wanted) next.lockTransparency = true;
  else delete next.lockTransparency;
  return next;
};

const patched = (layer: Layer, options: LayerUpdateOptions, name: string): Layer => {
  const flags = { ...layer, name, visible: options.visible ?? layer.visible, locked: options.locked ?? layer.locked };
  return withLayerColour(withTransparencyLock(flags, options.lockTransparency), options.colour);
};

const same = (before: Layer, after: Layer): boolean =>
  before.name === after.name &&
  before.visible === after.visible &&
  before.locked === after.locked &&
  before.colour === after.colour &&
  (before.lockTransparency === true) === (after.lockTransparency === true);

const layerUpdate = defineCommand({
  name: COMMAND_NAME.layerUpdate,
  scope: 'sprites',
  schema: layerUpdateSchema,
  run: (draft, input) => {
    const { options } = input;
    for (const { sprite, layer } of pickLayers(draft.artwork, input.sprites, options.layer)) {
      const others = sprite.layers.filter((item) => item.id !== layer.id).map((item) => item.name);
      const next = patched(layer, options, chooseLayerName(options.name, others, layer.name));
      if (!same(layer, next)) replaceLayer(draft, sprite.id, next);
    }
  },
});

export { layerUpdate };
