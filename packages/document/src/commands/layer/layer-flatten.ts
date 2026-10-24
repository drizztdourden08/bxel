/* @layer core @kind logic */
import { addCel } from '../../draft/add-cel';
import type { Draft } from '../../draft/draft.type';
import type { CelId, FrameId, LayerId, SpriteId } from '../../model/ids.type';
import type { Layer, Sprite } from '../../model/sprite.type';
import { flattenFrame } from '../../read/flatten-frame';
import { requireSprite } from '../../read/require-sprite';
import { layerFlattenSchema } from '../../schema/layer-flatten-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { ERROR_CODE } from '../error-code.constants';
import { defineCommand } from '../define-command';
import { chooseLayerName } from './choose-layer-name';
import { failIfAny } from './fail-if-any';
import { freeName } from './free-name';
import { insertLayer } from './insert-layer';
import { FLATTEN_NAME } from './layer.constants';
import { registerLayerRef } from './register-layer-ref';

const flatCels = (draft: Draft, sprite: Sprite): Record<FrameId, CelId> => {
  const cels: Record<FrameId, CelId> = {};
  for (const frame of sprite.frames) {
    const flat = flattenFrame(sprite, frame.id);
    if (flat.some((value) => value !== 0)) cels[frame.id] = addCel(draft, sprite.id, flat);
  }
  return cels;
};

const flattenSprite = (draft: Draft, spriteId: SpriteId, requested: string | undefined): LayerId => {
  const sprite = requireSprite(draft.project, spriteId);
  const names = sprite.layers.map((item) => item.name);
  const layer: Layer = {
    id: draft.ids.next('lay') as LayerId,
    name: chooseLayerName(requested, names, freeName(names, FLATTEN_NAME)),
    visible: true,
    locked: false,
    cels: flatCels(draft, sprite),
  };
  insertLayer(draft, spriteId, layer, sprite.layers.length);
  return layer.id;
};

const layerFlatten = defineCommand({
  name: COMMAND_NAME.layerFlatten,
  scope: 'sprites',
  schema: layerFlattenSchema,
  run: (draft, input) => {
    const hidden = input.sprites.filter((id) => !requireSprite(draft.project, id).layers.some((layer) => layer.visible));
    failIfAny(
      ERROR_CODE.TARGET_EMPTY,
      'Flatten needs at least one visible layer in every target sprite.',
      hidden.map((spriteId) => ({ spriteId, layerId: null, frameId: null, reason: 'no layer is visible' })),
    );
    const created = input.sprites.map((spriteId) => flattenSprite(draft, spriteId, input.options.name));
    registerLayerRef(draft, input, created);
  },
});

export { layerFlatten };
