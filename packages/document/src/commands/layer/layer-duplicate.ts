/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import { updateSprite } from '../../draft/update-sprite';
import { blockOf } from '../../layer-tree/block-of';
import type { LayerId } from '../../model/ids.type';
import type { Layer, Sprite } from '../../model/sprite.type';
import { layerDuplicateSchema } from '../../schema/layer-duplicate-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { chooseLayerName } from './choose-layer-name';
import { copyLayerCels } from './copy-layer-cels';
import { freeName } from './free-name';
import { COPY_SUFFIX } from './layer.constants';
import { pickLayers } from './pick-layers';
import { registerLayerRef } from './register-layer-ref';

const copyBlock = (draft: Draft, sprite: Sprite, top: Layer, topName: string): Layer[] => {
  const block = blockOf(sprite.layers, top.id);
  const fresh = new Map<string, LayerId>();
  const names = sprite.layers.map((item) => item.name);
  const items = sprite.layers.filter((item) => block.has(item.id));
  for (const item of items) fresh.set(item.id, draft.ids.next('lay') as LayerId);
  return items.map((item) => {
    const name = item.id === top.id ? topName : freeName(names, `${item.name}${COPY_SUFFIX}`);
    names.push(name);
    const parentId = item.id === top.id ? item.parentId : fresh.get(item.parentId ?? '');
    const copy: Layer = { ...item, id: fresh.get(item.id) ?? item.id, name, lock: { ...item.lock, pixels: false }, cels: copyLayerCels(draft, sprite, item) };
    return parentId === undefined ? copy : { ...copy, parentId };
  });
};

const layerDuplicate = defineCommand({
  name: COMMAND_NAME.layerDuplicate,
  scope: 'sprites',
  schema: layerDuplicateSchema,
  run: (draft, input) => {
    const { layer: ref, name } = input.options;
    const created: LayerId[] = [];
    for (const { sprite, layer, index } of pickLayers(draft.artwork, input.sprites, ref)) {
      const names = sprite.layers.map((item) => item.name);
      const copies = copyBlock(draft, sprite, layer, chooseLayerName(name, names, freeName(names, `${layer.name}${COPY_SUFFIX}`)));
      updateSprite(draft, sprite.id, (current) => ({ ...current, layers: [...current.layers.slice(0, index + 1), ...copies, ...current.layers.slice(index + 1)] }));
      const top = copies.at(-1);
      if (top) created.push(top.id);
    }
    registerLayerRef(draft, input, created);
  },
});

export { layerDuplicate };
