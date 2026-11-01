/* @layer core @kind logic */
import { FULL_VIEW_OPACITY } from '../../model/layer-lock.constants';
import type { Layer, LayerLock } from '../../model/sprite.type';
import { layerKindOf } from '../../read/layer-kind-of';
import type { LayerUpdateOptions } from '../../schema/command-options.type';
import { layerUpdateSchema } from '../../schema/layer-update-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { chooseLayerName } from './choose-layer-name';
import { failIfAny } from './fail-if-any';
import { layerIssue } from './layer-issue';
import { pickLayers } from './pick-layers';
import { replaceLayer } from './replace-layer';
import { withField } from './with-field';
import { withLayerColour } from './with-layer-colour';

const lockOf = (layer: Layer, options: LayerUpdateOptions): LayerLock => {
  const lock = {
    pixels: options.lock?.pixels ?? options.locked ?? layer.lock.pixels,
    transparency: options.lock?.transparency ?? options.lockTransparency ?? layer.lock.transparency,
    position: options.lock?.position ?? layer.lock.position,
  };
  const same = lock.pixels === layer.lock.pixels && lock.transparency === layer.lock.transparency && lock.position === layer.lock.position;
  return same ? layer.lock : lock;
};

const patched = (layer: Layer, options: LayerUpdateOptions, name: string): Layer => {
  const flags = { ...layer, name, visible: options.visible ?? layer.visible, lock: lockOf(layer, options) };
  const viewed = withField(flags, 'viewOpacity', options.viewOpacity, FULL_VIEW_OPACITY);
  const clipped = withField(viewed, 'clip', options.clip, false);
  return withLayerColour(withField(clipped, 'exported', options.exported, true), options.colour);
};

const FIELDS = ['name', 'visible', 'lock', 'viewOpacity', 'clip', 'colour', 'exported'] as const;

const same = (before: Layer, after: Layer): boolean => FIELDS.every((key) => before[key] === after[key]);

const layerUpdate = defineCommand({
  name: COMMAND_NAME.layerUpdate,
  scope: 'sprites',
  schema: layerUpdateSchema,
  run: (draft, input) => {
    const { options } = input;
    const picked = pickLayers(draft.artwork, input.sprites, options.layer);
    failIfAny(
      ERROR_CODE.LAYER_KIND,
      'Only a pixel layer clips to the layer below.',
      options.clip === true ? picked.filter(({ layer }) => layerKindOf(layer) !== 'pixel').map(({ sprite, layer }) => layerIssue(sprite.id, layer, 'not a pixel layer')) : [],
    );
    for (const { sprite, layer } of picked) {
      const others = sprite.layers.filter((item) => item.id !== layer.id).map((item) => item.name);
      const next = patched(layer, options, chooseLayerName(options.name, others, layer.name));
      if (!same(layer, next)) replaceLayer(draft, sprite.id, next);
    }
  },
});

export { layerUpdate };
