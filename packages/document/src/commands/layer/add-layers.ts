/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import type { LayerId } from '../../model/ids.type';
import { requireSprite } from '../../read/require-sprite';
import type { LayerRef } from '../../schema/command-options.type';
import type { CommandInput } from '../command-def.type';
import type { LayerBuild } from './add-layers.type';
import { insertLayer } from './insert-layer';
import { pickLayers } from './pick-layers';
import { registerLayerRef } from './register-layer-ref';

const addLayers = (draft: Draft, input: CommandInput, above: LayerRef | undefined, build: LayerBuild): void => {
  const anchors = above ? pickLayers(draft.artwork, input.sprites, above) : [];
  const created: LayerId[] = [];
  for (const spriteId of input.sprites) {
    const sprite = requireSprite(draft.artwork, spriteId);
    const names = sprite.layers.map((layer) => layer.name);
    const anchor = anchors.find((picked) => picked.sprite.id === spriteId);
    const { layer, at } = build(sprite, names, anchor);
    insertLayer(draft, spriteId, layer, at);
    created.push(layer.id);
  }
  registerLayerRef(draft, input, created);
};

export { addLayers };
